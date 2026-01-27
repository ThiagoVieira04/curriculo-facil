const app = require('./api/index.js');
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test API running on http://localhost:${PORT}`);
    process.exit(0); // Exit immediately if it starts fine
});
