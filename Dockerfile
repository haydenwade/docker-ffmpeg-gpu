FROM nvidia/cuda:11.0-base-ubuntu20.04
RUN apt update && apt install -y ffmpeg curl
RUN mkdir /ffmpeg

ENV NVM_DIR "/usr/local/nvm"
ENV NODE_VERSION "12.18.4"

# Install nvm with node and npm
RUN mkdir -p $NVM_DIR && curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH


WORKDIR /workspace
COPY package*.json ./
RUN npm install
COPY . .

ENTRYPOINT ["bash"]
