# ディレクトリの作成
mkdir ~/minecraft

# ディレクトリの移動
cd ~/minecraft/

# 現在の場所を確認
pwd
==============出力結果==============
# pwd を実行後に下記になっていることを確認
/home/ec2-user/minecraft
===================================

wget https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar

# バージョンを指定してビルド(1.XX.X など)
java -jar BuildTools.jar --rev 1.20.1
==============出力結果==============
# ビルドには数分ほど掛かるため､気長にお待ちします
~~
Success! Everything completed successfully. Copying final .jar files now.
Copying spigot-1.19.3-R0.1-SNAPSHOT-bootstrap.jar to /home/ec2-user/minecraft/./spigot-1.19.3.jar
  - Saved as ./spigot-1.19.3.jar
===================================

