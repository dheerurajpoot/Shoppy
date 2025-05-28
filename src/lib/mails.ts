import { User } from "@/models/user";
import nodemailer from "nodemailer";
import { verifyMailTemplate } from "./mail-templates";

interface MailOptions {
	email: string;
	userId: string;
	verificationCode?: string;
}

export const sendMail = async ({ email, userId, verificationCode }: MailOptions) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = Date.now() + 3600000; // 1 hour
		await user.save();

		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		const mailOptions = {
			from: `"${process.env.COMPANY_NAME}" <${process.env.MAIL_USER}>`,
			to: email,
			subject: "Verify Your Email",
			text: "",
			html:verifyMailTemplate(verificationCode!)
		};

		const mailResponse = await transporter.sendMail(mailOptions);
		return mailResponse;
	} catch (error: unknown) {
		console.error("Mail sending error:", error);
		if (error instanceof Error) {
			throw new Error(`Error sending email: ${error.message}`);
		}
		throw new Error("Error sending email: Unknown error");
	}
};
