const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");


let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
});

// ফাইল ডাউনলোড ও C:\ drive-এ সংরক্ষণ করার জন্য ইভেন্ট
ipcMain.on("download-file", (event) => {
  const fileUrl = "http://localhost:5500"; // Express.js থেকে ফাইল নামানো হবে
  const savePath = path.join("C:\\", "DownloadedFile.exe"); // C:\ drive-এ সংরক্ষণ

  const file = fs.createWriteStream(savePath);
  https.get(fileUrl, (response) => {
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      event.reply("download-complete", "File saved to C:\\ drive successfully!");
    });
  }).on("error", (err) => {
    console.error("Download error:", err);
    event.reply("download-error", "File download failed!");
  });
});
