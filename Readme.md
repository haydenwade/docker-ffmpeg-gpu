

docker build -t transcode-poc .

docker run --rm -it --gpus all -e NVIDIA_VISIBLE_DEVICES=all -e NVIDIA_DRIVER_CAPABILITIES=compute,utility,video --volume $PWD:/workspace --entrypoint bash  transcode-poc
