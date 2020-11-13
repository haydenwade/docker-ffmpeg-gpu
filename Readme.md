

docker build -t transcode-poc .

docker run --rm -it --gpus all -e NVIDIA_VISIBLE_DEVICES=all -e NVIDIA_DRIVER_CAPABILITIES=compute,utility,video --volume $PWD:/workspace --entrypoint bash  transcode-poc



docker run --rm -it --volume $PWD:/workspace --entrypoint bash  transcode-poc


ffmpeg -vsync 0 -hwaccel cuvid -c:v h264_cuvid -resize 960x540 -i ./input/untranscodedFile.ps -c:a copy -c:v h264_nvenc -b:v 5M output.mp4



ffmpeg -y -vsync 0 -hwaccel cuda -hwaccel_output_format cuda -i ./input/untranscodedFile.ps -c:a copy -c:v h264_nvenc -b:v 5M ./output/output.mp4

ffmpeg -vsync 0 -hwaccel cuvid -c:v h264_cuvid -i ./input/untranscodedFile.ps -c:a copy -c:v h264_nvenc -b:v 5M ./output/output.mp4
