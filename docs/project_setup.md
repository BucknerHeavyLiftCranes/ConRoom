# Getting Started:

Setup Steps:
    1. Clone the repository from GitHub.
    2. Paste the .env file into the backend folder.
    3. Before building the container, run "npm install" (a.k.a "npm i") to install all dependecies.
    4. Open VSCode's Command Palette - ctrl + shift + P (windows), cmd + shift + P (macOS).
    5. Select "Dev Container: Reopen in Container".
    6. Wait for the Dev Container to build fully and install all extensions.
    6. Assuming your Dev Container set up properly, click on the "SQL Server" icon and wait for it to load.
    7. Click on the "+" icon or "Add Connection"
    8. Make sure you have your .env file ready - you will copy this information into the "Connection Dialog (Preview)
    9. The profile name will be "Local SQL Server"
    10. Optional: Click "Advanced" and scroll to "Pooling Settings" and enable Pooling.
    11. Click "Connect".
    12. Go to "dbConnection.js" and comment out "database: process.env.DB_NAME". The database hasn't be created yet so you can't use its name in the config.
    13. Go to "server.js" and save the file.
    14. Go back to "dbConnection.js" and uncomment "database: process.env.DB_NAME".
    15. Repeat Step 13.
    16. You Dev Container should now be fully setup with the app running properly and the database connected and fully set up. Enjoy!