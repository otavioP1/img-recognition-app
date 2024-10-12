import React, { useState } from 'react';

const ObjectDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setDetections([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setDetections(data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Object Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Detecting...' : 'Detect Objects'}
        </button>
      </form>

      {detections.length > 0 && (
        <div>
          <h2>Detected Objects:</h2>
          <ul>
            {detections.map((obj, index) => (
              <li key={index}>
                <strong>{obj.name}</strong> - Score: {(obj.score * 100).toFixed(2)}%
                <br />
                Bounding Box: (x: {obj.x}, y: {obj.y}, width: {obj.width}, height: {obj.height})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
