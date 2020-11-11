FROM nvidia/cuda:11.0-base-ubuntu20.04
RUN apt update && apt install -y ffmpeg
RUN mkdir /ffmpeg

WORKDIR /workspace
COPY package*.json ./
RUN npm install
COPY . .

ENTRYPOINT ["bash"]
