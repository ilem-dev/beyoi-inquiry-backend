const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const sendInquiryEmail = async (inquiryData) => {
  const {
    name,
    email,
    company,
    phone,
    volume,
    industry,
    message,
    formTypeTitle
  } = inquiryData;

  const recipients = String(process.env.MAIL_RECIPIENTS || "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  if (!recipients.length) {
    throw new Error("No recipients configured in MAIL_RECIPIENTS.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || "Not provided");
  const safePhone = escapeHtml(phone);
  const safeVolume = escapeHtml(volume);
  const safeIndustry = escapeHtml(industry);
  const safeMessage = escapeHtml(message);
  const safeSubject = String(formTypeTitle || "Website Inquiry").trim();

  const mailOptions = {
    from: `"ILEM Website" <${process.env.MAIL_FROM}>`,

    to: recipients,

    // Reply button directly customer ko reply karega
    replyTo: email,

    // form_type_title becomes exact subject
    subject: safeSubject,

    text: `
${safeSubject}

Name: ${name}
Email: ${email}
Company: ${company}
Phone: +91 ${phone}
Estimated Monthly Volume: ${volume}
Industry: ${industry}

Message:
${message}
    `.trim(),

    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${escapeHtml(safeSubject)}</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background-color:#f3f1eb;
            font-family:Arial,Helvetica,sans-serif;
            color:#20251f;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="background-color:#f3f1eb;padding:32px 12px;"
          >
            <tr>
              <td align="center">

                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width:680px;
                    background:#ffffff;
                    border-radius:16px;
                    overflow:hidden;
                    box-shadow:0 12px 35px rgba(30,45,30,0.10);
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td
                      style="
                        background:#344f37;
                        padding:28px 34px;
                      "
                    >
                      <p
                        style="
                          margin:0 0 8px;
                          color:#dce8dc;
                          font-size:12px;
                          letter-spacing:2px;
                          text-transform:uppercase;
                        "
                      >
                        ILEM JAPAN
                      </p>

                      <h1
                        style="
                          margin:0;
                          color:#ffffff;
                          font-size:24px;
                          line-height:1.4;
                          font-weight:600;
                        "
                      >
                        ${escapeHtml(safeSubject)}
                      </h1>
                    </td>
                  </tr>

                  <!-- Intro -->
                  <tr>
                    <td style="padding:30px 34px 12px;">
                      <p
                        style="
                          margin:0;
                          color:#667066;
                          font-size:15px;
                          line-height:1.7;
                        "
                      >
                        A new enquiry has been submitted through the ILEM website.
                        The complete details are provided below.
                      </p>
                    </td>
                  </tr>

                  <!-- Details card -->
                  <tr>
                    <td style="padding:18px 34px 8px;">
                      <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                          border:1px solid #e7e8e3;
                          border-radius:12px;
                          overflow:hidden;
                        "
                      >

                        ${createDetailRow("Full Name", safeName)}
                        ${createDetailRow("Email", safeEmail)}
                        ${createDetailRow("Company Name", safeCompany)}
                        ${createDetailRow("Phone Number", `+91 ${safePhone}`)}
                        ${createDetailRow("Monthly Volume", safeVolume)}
                        ${createDetailRow("Industry", safeIndustry)}

                      </table>
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td style="padding:24px 34px 10px;">
                      <p
                        style="
                          margin:0 0 10px;
                          color:#344f37;
                          font-size:13px;
                          font-weight:700;
                          letter-spacing:1px;
                          text-transform:uppercase;
                        "
                      >
                        Customer Message
                      </p>

                      <div
                        style="
                          background:#f7f7f3;
                          border-left:4px solid #344f37;
                          border-radius:8px;
                          padding:18px 20px;
                          color:#343a34;
                          font-size:15px;
                          line-height:1.75;
                          white-space:pre-wrap;
                          overflow-wrap:anywhere;
                        "
                      >${safeMessage}</div>
                    </td>
                  </tr>

                  <!-- Reply button -->
                  <tr>
                    <td style="padding:22px 34px 34px;">
                      <a
                        href="mailto:${safeEmail}"
                        style="
                          display:inline-block;
                          background:#344f37;
                          color:#ffffff;
                          text-decoration:none;
                          padding:13px 24px;
                          border-radius:7px;
                          font-size:14px;
                          font-weight:600;
                        "
                      >
                        Reply to Customer
                      </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      style="
                        background:#f7f7f3;
                        border-top:1px solid #e7e8e3;
                        padding:20px 34px;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          color:#818881;
                          font-size:12px;
                          line-height:1.6;
                        "
                      >
                        This email was automatically generated from the ILEM
                        website enquiry form.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

const createDetailRow = (label, value) => `
  <tr>
    <td
      width="38%"
      style="
        padding:14px 16px;
        background:#f8f8f5;
        border-bottom:1px solid #e7e8e3;
        color:#6b736b;
        font-size:13px;
        font-weight:600;
        vertical-align:top;
      "
    >
      ${label}
    </td>

    <td
      style="
        padding:14px 16px;
        border-bottom:1px solid #e7e8e3;
        color:#242924;
        font-size:14px;
        line-height:1.5;
        overflow-wrap:anywhere;
      "
    >
      ${value}
    </td>
  </tr>
`;

const verifyMailConnection = async () => {
  await transporter.verify();
  console.log("SMTP connection verified successfully.");
};

module.exports = {
  sendInquiryEmail,
  verifyMailConnection
};