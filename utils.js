const config = require('./config');

// Utilitários de validação
const validation = {
    // Sanitização mais segura que sempre retorna string
    sanitizeText: (text) => {
        if (text === null || text === undefined) return '';
        if (typeof text !== 'string') text = String(text);

        return text.replace(/<[^>]*>/g, '')
            .replace(/[<>"'&]/g, '')
            .trim()
            .substring(0, config.VALIDATION.MAX_TEXT_LENGTH);
    },

    // Garante que é um array de strings (para habilidades, cursos, etc)
    sanitizeArray: (input, separator = '\n') => {
        if (Array.isArray(input)) {
            return input.map(item => validation.sanitizeText(item));
        }
        if (typeof input === 'string') {
            return input.split(separator).map(item => validation.sanitizeText(item)).filter(Boolean);
        }
        return [];
    },

    validateRequired: (fields) => {
        for (const [key, value] of Object.entries(fields)) {
            // Verifica null/undefined e string vazia
            if (value == null || (typeof value === 'string' && value.trim().length < config.VALIDATION.MIN_TEXT_LENGTH)) {
                return `Campo '${key}' é obrigatório`;
            }
        }
        return null; // Retorna null se tudo estiver ok
    },

    validateEmail: (email) => {
        if (typeof email !== 'string') return false;
        return config.VALIDATION.EMAIL_REGEX.test(email);
    },

    validatePhone: (phone) => {
        if (typeof phone !== 'string') return false;
        return config.VALIDATION.PHONE_REGEX.test(phone);
    },

    validateFileUpload: (file, type = 'photo') => {
        if (!file) return { valid: true };

        const uploadConfig = type === 'resume' ? config.UPLOAD.RESUME : config.UPLOAD;

        if (file.size > uploadConfig.MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `Arquivo muito grande. Máximo ${uploadConfig.MAX_FILE_SIZE / 1024 / 1024}MB.`
            };
        }

        if (!file.mimetype || !uploadConfig.ALLOWED_TYPES.includes(file.mimetype)) {
            const typesMsg = type === 'resume' ? 'Use PDF ou DOCX.' : 'Use JPG ou PNG.';
            return {
                valid: false,
                error: `Formato de arquivo não suportado. ${typesMsg}`
            };
        }

        // Verificação extra de extensão
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (!uploadConfig.ALLOWED_EXTENSIONS.some(allowed => allowed.includes(ext))) {
            return {
                valid: false,
                error: 'Extensão de arquivo inválida.'
            };
        }

        return { valid: true };
    }
};

// Utilitários de rate limiting
const rateLimiting = {
    cleanupOldEntries: (rateLimitMap) => {
        const now = Date.now();
        let cleaned = 0;

        if (rateLimitMap.size > config.RATE_LIMIT.MAX_MAP_SIZE) {
            for (const [key, requests] of rateLimitMap.entries()) {
                const validRequests = requests.filter(time => now - time < config.RATE_LIMIT.WINDOW_MS);
                if (validRequests.length === 0) {
                    rateLimitMap.delete(key);
                    cleaned++;
                } else {
                    rateLimitMap.set(key, validRequests);
                }
            }
        }

        return cleaned;
    },

    checkRateLimit: (ip, rateLimitMap) => {
        const now = Date.now();
        const requests = rateLimitMap.get(ip) || [];
        const validRequests = requests.filter(time => now - time < config.RATE_LIMIT.WINDOW_MS);

        if (validRequests.length >= config.RATE_LIMIT.MAX_REQUESTS) {
            return {
                allowed: false,
                retryAfter: Math.ceil((validRequests[0] + config.RATE_LIMIT.WINDOW_MS - now) / 1000)
            };
        }

        validRequests.push(now);
        rateLimitMap.set(ip, validRequests);
        return { allowed: true };
    }
};

// Utilitários de limpeza
const cleanup = {
    cleanupOldCVs: (cvDatabase) => {
        const cutoff = Date.now() - config.CLEANUP.DATA_RETENTION_MS;
        let cleaned = 0;

        for (const [id, data] of cvDatabase.entries()) {
            if (data.createdAt.getTime() < cutoff) {
                cvDatabase.delete(id);
                cleaned++;
            }
        }

        return cleaned;
    }
};

// Utilitários de PDF
const pdf = {
    generateSafeFilename: (nome) => {
        return nome.replace(/[^\w\s-À-ÿ]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50);
    },

    getPrintStyles: () => `
        <style>
            @page { margin: 0; size: A4; }
            @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none !important; }
            }
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
                font-size: 14px;
                line-height: 1.4;
            }
            * { box-sizing: border-box; }
        </style>
    `
};

// Utilitários de logging
const logger = {
    info: (message, data = {}) => {
        console.log(`ℹ️ ${message}`, data);
    },

    error: (message, error = {}) => {
        console.error(`❌ ${message}`, {
            message: error.message,
            stack: error.stack,
            ...error
        });
    },

    warn: (message, data = {}) => {
        console.warn(`⚠️ ${message}`, data);
    },

    success: (message, data = {}) => {
        console.log(`✅ ${message}`, data);
    }
};

module.exports = {
    validation,
    rateLimiting,
    cleanup,
    pdf,
    logger
};