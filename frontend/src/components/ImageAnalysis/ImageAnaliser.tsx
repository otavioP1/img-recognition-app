import React, { useState, useRef } from 'react';
import { DetectedObject } from './DetectedObject.tsx';
import { Button } from '@/components/ui/button';

export function ImageAnaliser() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setDetections([]);
      setDescription('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const API_PATH = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const [detectionResponse, descriptionResponse] = await Promise.all([
        fetch(`${API_PATH}/detect`, {
          method: 'POST',
          body: formData,
        }),
        fetch(`${API_PATH}/describe`, {
          method: 'POST',
          body: formData,
        }),
      ]);

      if (!detectionResponse.ok) {
        const errorData = await detectionResponse.json();
        alert(`Detection Error: ${errorData.error}`);
        setLoading(false);
        return;
      }

      const detectionData = await detectionResponse.json();
      console.log(detectionData);
      setDetections(detectionData);

      if (!descriptionResponse.ok) {
        const errorData = await descriptionResponse.json();
        alert(`Description Error: ${errorData.error}`);
        setLoading(false);
        return;
      }

      const descriptionData = await descriptionResponse.json();
      console.log(descriptionData)
      setDescription(descriptionData.description);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className="p-6 text-white bg-[#1e3a5f] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Object Detection and Image Description</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
          <Button variant={'outline'} onClick={handleUploadClick} className='mb-4'>
            Upload Image
          </Button>

          {previewURL && (
            <div className="relative mb-4">
              <img ref={imgRef} src={previewURL} alt="Selected" className="max-w-full rounded shadow" />
              {detections.map((obj, index) => (
                <DetectedObject key={index} name={obj.name} score={obj.score} top={obj.y} left={obj.x} height={obj.height} width={obj.width} />
              ))}
            </div>
          )}

          {previewURL && (
            <Button
              type="submit"
              disabled={loading}
              className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {loading ? 'Processing...' : 'Detect & Describe'}
            </Button>
          )}
        </form>

        {description && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Image Description:</h2>
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

