import React, { useState, useRef } from 'react';
import { DetectedObject } from './DetectedObject/DetectedObject.tsx';

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { LogoutButton } from '../Authentication/LogoutButton.tsx';
import { useNavigate } from 'react-router-dom';

export function ImageAnaliser() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { authToken } = useAuth();
  const navigate = useNavigate();

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
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
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

  const backToHistpry = () => {
    navigate('/analysis-history');
  }

  return (
    <>
    <LogoutButton />
    <div className='flex flex-col h-screen items-center justify-center'>
      <div className="flex justify-between max-w-lg w-full pr-4">
        <h1 className="text-2xl font-bold mb-4">Análise de imagens</h1>
        <Button type='button' onClick={backToHistpry}>Voltar</Button>
      </div>
      <Card className="p-4 flex flex-col gap-4 min-w-[512px]">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
          <Button type='button' variant={'outline'} onClick={handleUploadClick}>
            Selecionar imagem
          </Button>

          {previewURL && (
            <div className="relative mt-4 mb-4">
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
      </Card>
    </div>
    </>
  );
};

