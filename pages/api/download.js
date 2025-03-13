import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: "Missing video URL" });
  }

  // Ensure the downloads folder exists
  const downloadsFolder = path.join(process.cwd(), "public", "downloads");
  if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder, { recursive: true });
  }

  // Path to Python script
  const pythonScript = path.join(process.cwd(), "scripts", "download.py");

  console.log("Starting download for:", videoUrl);

  // Run Python script to download the video
  const pythonProcess = spawn("python", [pythonScript, videoUrl, downloadsFolder], {
    shell: true,
  });

  let outputData = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => {
    outputData += data.toString();
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      // Extract filename from output (Assumes script prints filename)
      const filenameMatch = outputData.match(/Saved as: (.+)/);
      if (!filenameMatch) {
        return res.status(500).json({ error: "Could not determine file name." });
      }

      const filename = filenameMatch[1].trim();
      const fileUrl = `/downloads/${filename}`;

      const downloadedFile = fs.readdirSync(downloadsFolder)
  .find(file => file.endsWith(".mp4"));

if (downloadedFile) {
  const fileUrl = `/downloads/${encodeURIComponent(downloadedFile)}`;
  return res.status(200).json({
    success: true,
    message: "Download ready!",
    downloadUrl: fileUrl,
  });
} else {
  return res.status(500).json({ error: "File not found after download." });
}

    } else {
      console.error("Download script failed:", errorData);
      return res.status(500).json({ error: "Download failed.", details: errorData });
    }
  });
}