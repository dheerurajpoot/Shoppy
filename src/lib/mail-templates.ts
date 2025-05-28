// verify mail template
export const verifyMailTemplate = (verificationCode: string): string => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email address</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .link {
            word-break: break-all;
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Verify Your Email</h2>
        <p>Hello,</p>
        <p>Thank you for signing up with ${process.env.COMPANY_NAME}! Please verify your email address to complete your registration.</p>
    <br />
        <p style="font-weight: bold;">Verification Code: ${verificationCode}</p>
        <p>This code will expire in 1 hour.</p>
    <br />
        <p>If you didn't create an account with us, please ignore this email or contact support if you have concerns.</p>
    </div>
</body>
</html>`;
};
