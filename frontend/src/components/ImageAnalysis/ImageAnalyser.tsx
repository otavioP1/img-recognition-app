import React, { useState, useRef } from 'react';
import { DetectedObject } from './DetectedObject/DetectedObject.tsx';

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { Button } from '@/components/ui/button';

import { LogoutButton } from '../Authentication/LogoutButton.tsx';

export function ImageAnaliser() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const API_PATH = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${API_PATH}/analyse`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(`Não conseguimos processar a imagem: ${errorData.error}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setDetections(data.detections);
      if (data.detections == 0) {
        setError(`Nenhum objeto detectado`);
      }

      setDescription(data.description);
    } catch (error) {
      console.error('Error:', error);
      setError('Ocorreu um erro ao processar a imagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <LogoutButton />
    <div className='flex h-screen items-center justify-center'>
      <div className="p-6 text-white bg-blue-900 rounded-lg shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Análise de imagens</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
          <Button type='button' variant={'outline'} onClick={handleUploadClick} className='mb-4'>
            Selecionar imagem
          </Button>

          {previewURL && (
            <div className="relative mb-4">
              <img ref={imgRef} src={previewURL} alt="Imagem selecionada" className="max-w-full rounded shadow" />
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
              {loading ? 'Processando...' : 'Processar'}
            </Button>
          )}
        </form>

        {error && (
          <Alert variant="destructive" className='bg-red-100'>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {description && (
          <div>
            <h2 className="text-xl font-semibold">Descrição da imagem</h2>
            <p className='ImageDescription'>{description}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

