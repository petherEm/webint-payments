import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './templates';

export const transporter = nodemailer.createTransport({
   service: "gmail",
    auth: {
         user: process.env.NODEMAILER_EMAIL,
         pass: process.env.NODEMAILER_PASSWORD
    }
});


export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace("{{name}}", name)
        .replace("{{intro}}", intro);

   const mailOptions = {
        from: `WebInt Payments <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: 'Welcome to PaymentsCharts! - your hottest payments stock market tracker',
        text: "Thanks for joining PaymentsCharts. You now have the tools to track markets and make smarter moves.",
        html: htmlTemplate
    };

   try {
       await transporter.sendMail(mailOptions);
       return true;
   } catch (error) {
       console.error("Error sending welcome email:", error);
       return false;    
   }
}


export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `WebInt Payments <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from WebInt Payments`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};
