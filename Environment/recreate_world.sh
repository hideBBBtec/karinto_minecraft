#!/bin/sh
# cronの一時停止
crontab -e

# バックアップ作成
\cp -r -f /home/ec2-user/minecraft /home/ec2-user/minecraft_bk

# 実行されているJAVAプロセスをキル
sudo su -
systemctl status minecraft
systemctl stop minecraft
systemctl status minecraft
exit

# ディレクトリ再作成
rm -fr /home/ec2-user/minecraft
mkdir ~/minecraft
cd ~/minecraft/
wget https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
java -jar BuildTools.jar --rev 1.20.1

# 運用スクリプトの再配置
cp /home/ec2-user/minecraft_bk/check_access_to_shutdown.sh /home/ec2-user/minecraft/
cp /home/ec2-user/minecraft_bk/minecraft_custom_start.sh /home/ec2-user/minecraft/

# EULAへの同意
sed -i -e "s/eula=false/eula=true/g" eula.txt

# 起動
sudo su -
systemctl start minecraft
systemctl status minecraft

# cronの再開
crontab -e
