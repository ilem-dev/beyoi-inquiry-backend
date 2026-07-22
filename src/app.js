const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: [
            "https://ilemjapan.com",
            "https://in.ilemjapan.com",
            "https://947187.myshopify.com",
            "https://ilem-india.myshopify.com",
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Beyoi inquiry API is running"
    });
});

app.use("/api/inquiries", inquiryRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

module.exports = app;