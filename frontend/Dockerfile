FROM node:16 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM python:3.9-slim

RUN pip install flask

WORKDIR /app

COPY --from=build /app/dist ./frontend/dist

COPY ../backend/app.py ./app.py
COPY ../backend/model ./model
COPY ../backend/requirements.txt ./requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
