FROM nvidia/cuda:11.0-base-ubuntu20.04
RUN apt update && apt install -y ffmpeg nodejs
RUN mkdir /ffmpeg

# FROM node:12
# WORKDIR /usr/local/app
# COPY package*.json ./
# RUN npm install
# COPY . .

ENTRYPOINT ["bash"]
