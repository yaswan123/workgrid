module.exports = (task) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; }
        .header { text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #d9534f; }
        .content { text-align: center; }
        .content h2 { color: #333; }
        .content p { color: #555; line-height: 1.6; }
        .btn-container { text-align: center; margin-top: 20px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 5px; }
        .btn:hover { background-color: #c12e2a; }  /* Optional: Hover effect */
    </style>
</head>
<body>
    <div class="email-container">
    <div class="header">
        <img src="https://raw.githubusercontent.com/harsha12a/WorkGrid/assets/logo.png" alt="App Logo">
        <h1>WorkGrid</h1>
    </div>
        <div class="header">
            <h1>Task Deadline Approaching</h1>
        </div>
        <div class="content">
            <h2>${task.title}</h2>
            <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <p>${task.description || "No description available."}</p>
            <div class="btn-container">
                <a href="https://workgrid-five.vercel.app/tasks" class="btn" style="color: #fff;">View Task</a>
            </div>
        </div>
    </div>
</body>
</html>`;
