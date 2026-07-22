const { sendInquiryEmail } = require("../services/mailService");

const createInquiry = async (req, res) => {
    try {
        const {
            name,
            email,
            company,
            phone,
            volume,
            industry,
            message,

            // Shopify/API-compatible field
            form_type_title,

            // Purane Postman payload ko support karne ke liye
            formTitle
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !volume ||
            !industry ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });
        }

        const inquiryData = {
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            company: String(company || "").trim(),
            phone: String(phone).trim(),
            volume: String(volume).trim(),
            industry: String(industry).trim(),
            message: String(message).trim(),

            // New field ko priority milegi
            formTypeTitle: String(
                form_type_title ||
                formTitle ||
                "Website Inquiry"
            ).trim()
        };

        await sendInquiryEmail(inquiryData);

        return res.status(200).json({
            success: true,
            message: "Inquiry sent successfully."
        });
    } catch (error) {
        console.error("Inquiry email error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send inquiry. Please try again later."
        });
    }
};

module.exports = {
    createInquiry
};