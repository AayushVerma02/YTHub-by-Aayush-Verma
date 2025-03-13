"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const handleSubmit = async () => {
    if (!url.trim()) {
      setMessage("❌ Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setMessage("");
    setDownloadLink("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("✅ Download ready! Click the button below to get your file.");
        setDownloadLink(data.downloadUrl); // Store download URL
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Error: Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-4">🎥 YT<span className="text-orange-400">Hub</span></h1>

      <div className="border border-white p-6 rounded-lg flex flex-col items-center gap-4 bg-gray-900">
        <input
          type="text"
          placeholder="Paste your link here..."
          className="bg-gray-200 text-black placeholder:text-gray-600 p-3 rounded-md w-[80vw] md:w-[40vw] focus:outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="rounded-md bg-amber-600 p-3 cursor-pointer w-full text-center hover:bg-amber-700 transition duration-200"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin inline-block" /> : "Download MP4"}
        </button>

        {message && <p className="text-sm text-center text-gray-300">{message}</p>}

        {downloadLink && (
          <a
            href={downloadLink}
            download
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            📥 Click Here to Download
          </a>
        )}
      </div>
    </div>
  );
};

export default Home;