import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { DetectedObject } from "../ImageAnalysis/DetectedObject/DetectedObject";
import { LogoutButton } from "../Authentication/LogoutButton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

interface detectionType {
  height: number
  name: string
  score: number
  width: number
  x: number
  y: number
}

interface imageType {
  description: string,
  detections: detectionType[],
  image_file: string
}

export function AnalysisHistory() {
  const [images, setImages] = useState<imageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const API_PATH = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${API_PATH}/history`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setError(`Não conseguimos obter o histórico: ${errorData.error}`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setImages(data.uploads);
      } catch (error) {
        console.error('Error:', error);
        setError('Ocorreu um erro ao obter o histórico de análises.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const newAnalysis = () => {
    navigate('/image-analysis');
  }

  return (
    <>
    <LogoutButton />
    <div className='flex flex-col h-screen items-center justify-center'>
      {loading && (
        <div className="flex flex-col justify-between max-w-lg w-full pr-4">
          <h1 className="text-2xl font-bold mb-4">Histórico de análises</h1>
          <Card className="p-4 flex items-center justify-center">
            <p>Carregando histórico...</p>
          </Card>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col justify-between max-w-lg w-full pr-4">
        <h1 className="text-2xl font-bold mb-4">Histórico de análises</h1>
        <Alert variant="destructive" className='bg-red-100'>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
      )}

      {!loading && !error && images.length == 0 && (
        <div className="flex flex-col justify-between max-w-lg w-full pr-4">
          <h1 className="text-2xl font-bold mb-4">Histórico de análises</h1>
          <Card className="p-4 flex flex-col items-center justify-center gap-6">
            <p>Nenhuma analise realizada</p>
            <Button type='button' className="bg-green-600" onClick={newAnalysis}>Nova análise</Button>
          </Card>
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <>
        <div className="flex justify-between min-w-[512px] pr-4">
          <h1 className="text-2xl font-bold mb-4">Histórico de análises</h1>
          <Button type='button' className="bg-green-600" onClick={newAnalysis}>Nova análise</Button>
        </div>
        <ScrollArea className="h-[600px] min-w-[512px] pr-4">
          <div className="space-y-4">
            {images.map((image, index) => (
              <Card key={index} className="p-4">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>{`Imagem ${index + 1}`}</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge className="cursor-pointer" variant="secondary">
                        Ver análise
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="min-w-[512px] max-w-none w-max">
                      <DialogHeader>
                        <DialogTitle>{`Imagem ${index + 1}`}</DialogTitle>
                      </DialogHeader>
                      <div className="relative mb-2">
                        <img
                          src={`data:image/jpeg;base64,${image.image_file}`}
                          alt={`Imagem ${index + 1}`}
                          className="rounded shadow"
                        />
                        {image.detections.map((obj, index) => (
                          <DetectedObject key={index} name={obj.name} score={obj.score} top={obj.y} left={obj.x} height={obj.height} width={obj.width} />
                        ))}
                      </div>
                      <p className="ImageDescription">{image.description}</p>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p><strong>Descrição:</strong> {image.description}</p>
                    <p><strong>Objetos detectados:</strong> {image.detections.length}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        </>
      )}
      </div>
    </>
  );
}