import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploading(false);
      setMessage("File uploaded successfully!");
      setFile(null);
      document.querySelector('input[type="file"]').value = null;
    } catch (error) {
      setUploading(false);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpload;