require("dotenv").config();

const app = require("./src/app");
const {
    verifyMailConnection
} = require("./src/services/mailService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await verifyMailConnection();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("SMTP connection failed:", error.message);
        process.exit(1);
    }
};

startServer();