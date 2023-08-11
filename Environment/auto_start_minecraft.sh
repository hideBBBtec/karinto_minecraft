chmod +x minecraft_custom_start.sh

# EULAへの同意
sed -i -e "s/eula=false/eula=true/g" eula.txt

# systemdへ登録
sudo su
vi /etc/systemd/system/minecraft.service

## Unitファイル内容 ################################################################################################
[Unit]
Description=launch minecraft spigot server
After=network-online.target

[Service]
#実行するユーザーを指定（指定がないとルートユーザーとして実行）
User=ec2-user

#作業するディレクトリを指定（これをしないと「EULAに同意してください」と無限にエラーが出る）
WorkingDirectory=/home/ec2-user/minecraft

#このサービスとして実行するコマンドの内容
ExecStart=/bin/bash /home/ec2-user/minecraft/minecraft_custom_start.sh

#サービス停止時の動作（always=常に再起動、on-failure=起動失敗時のみ再起動）
Restart=always

#起動に時間がかかることによる失敗を避けるため、タイムアウト値を設定
TimeoutStartSec=180

[Install]
WantedBy = multi-user.target

#################################################################################################################

exit
sudo systemctl daemon-reload
sudo systemctl enable minecraft.service

# 起動確認
sudo systemctl start minecraft.service
systemctl status minecraft.service
