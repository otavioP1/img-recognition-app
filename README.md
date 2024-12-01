### Prerequisitos
- Docker
- Docker compose

### YOLOv3
Baixe o arquivo [yolov3.weights](https://pjreddie.com/media/files/yolov3.weights) e coloque-o em `/backend/model`

### Rodando localmente
Copie o `frontend/.env.example` para `frontend/.env`
```Bash
cd frontend
cp .env.example .env
```

Copie o `backend/.env.example` para `backend/.env`
```Bash
cd backend
cp .env.example .env
```

E suba os containers do docker
```Bash
docker-compose up --build
```
O aplicação ficará acessível em: http://localhost:3000

