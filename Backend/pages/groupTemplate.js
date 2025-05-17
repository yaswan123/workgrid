// Export a function to generate the email template for group add
const groupTemplate = ({ groupUser, groupName, groupId }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 120px;
            border-radius: 8px;
        }
        .header h1 {
            color: #007bff;
            margin: 10px 0 0;
        }
        .content {
            text-align: center;
        }
        .content h2 {
            color: #333;
        }
        .content p {
            color: #555;
            line-height: 1.6;
        }
        .btn-container {
            text-align: center;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 123, 255, 0.4);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="email-container">
    <div class="header">
        <img src="https://raw.githubusercontent.com/harsha12a/WorkGrid/assets/logo.png" alt="App Logo">
        <h1>WorkGrid</h1>
    </div>
    <div class="content">
        <h2>Welcome to the group: ${groupName || "Unnamed Group"}!</h2>
        <p>Hi <strong>${groupUser.name || "there"}</strong>,</p>
        <p>You have been successfully added to the group <strong>${groupName || "Unnamed Group"}</strong>.</p>
        <p>Feel free to explore and collaborate with your team members!</p>
    </div>
    <div class="btn-container">
        <a href="https://workgrid-five.vercel.app/groups/${groupId}" class="btn">
            View Group
        </a>
    </div>
    <div class="footer">
        <p>Regards,<br/>WorkGrid Team</p>
    </div>
</div>

</body>
</html>
`;

// Export the function
module.exports = groupTemplate;
