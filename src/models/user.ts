import mongoose from "mongoose";

const userModel = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		forgotPasswordToken: String,
		forgotPasswordTokenExpiry: Date,
		verificationCode: String,
		verificationCodeExpiry: Date,
		selectedCategories: [
			{
				type: String,
				default: [],
			},
		],
	},
	{ timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", userModel);
