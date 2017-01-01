ip='192.168.1.12';
remote_path="/home/pi/code/garage-door"

ssh pi@$ip "mkdir -p $remote_path"

rsync --archive --compress --progress\
    --exclude node_modules\
    --exclude .vscode\
    --exclude logs\
    . pi@$ip:$remote_path

# ssh pi@$ip "cd $remote_path && npm install"