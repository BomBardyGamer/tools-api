FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node
COPY . .
RUN wget https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz
RUN tar -xvf ffmpeg-git-amd64-static.tar.xz
RUN mv ffmpeg-git-*-amd64-static ffmpeg-git-amd64-static
ENV FFMPEG_PATH=/app/ffmpeg-git-amd64-static/ffmpeg
CMD ["npm", "run", "start"]
