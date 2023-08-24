# 花梨糖マインクラフトサーバ

## 利用者向け
### マインクラフトサーバー
spigotのバージョン1.20.1  
プラグインとか入れたいときはbbbhideまで連絡ください

### 接続方法
1. マルチプレイを選択  
![image](https://github.com/hideBBBtec/karinto_minecraft/assets/54278033/52ebdc99-4ae4-434a-aa66-49708142df46)

2. サーバーを追加  
![image](https://github.com/hideBBBtec/karinto_minecraft/assets/54278033/b354ff77-0e48-41bb-88cf-4173ee6c81da)

3. 「サーバー名」は自由に入力、「サーバーアドレス」にIPアドレスを入力して「完了」  
※サーバのIPアドレスは、サーバが停止するたびに変わります。後述のDiscord botを使ってアドレスを確認してください。  
![image](https://github.com/hideBBBtec/karinto_minecraft/assets/54278033/ad689973-b9ae-40e3-95b1-4353ba75ab5b)

4. 設定したサーバーを選択して「サーバーに接続」をクリック  
![image](https://github.com/hideBBBtec/karinto_minecraft/assets/54278033/9e18c66a-421d-46af-8703-c836e972b8cc)

5. マインクラフトへようこそ  
![image](https://github.com/hideBBBtec/karinto_minecraft/assets/54278033/26fae989-a402-4869-9fa6-46dd641d603e)

### Discord bot利用方法
|スラッシュコマンド|アクション|機能|備考|
|---|---|---|---|
|/minemanage|start|サーバを起動する|実行後マインクラフトが起動するまで1,2分待つ|
||status|サーバが起動しているかどうか、およびIPアドレスを確認する|サーバのIPアドレスはこれで確認|
||stop|サーバを停止する|基本的には利用しなければ自動で停止するので実行しなくてOK|


### サーバーが起動しているか確認したいとき
1. Discord botのコマンド「/minemanage status」で現在サーバーが起動しているか確認する（誰も接続していないときは10分で自動停止される）
2. サーバが起動していた場合、コマンドの結果でIPアドレスがわかるので接続する
3. サーバが起動していなかった場合、「/minemanage start」で起動する
4. 1,2分で起動するので、「/minemanage status」でIPアドレスを確認して接続する

## 開発者向け

### 要件
#### サーバスペック要件
- 5-10人利用だとメモリ4GB/CPU4コアだが、CPU抑えめでも大丈夫そう  
t3a.medium

#### 節約要件
- 使ってない間はサーバ停止
- Elastic IP使うとお金かかるから、Public IPは変わってもよいものとする

#### 利便性要件
- Discordからサーバ起動停止できる
- Discordからサーバ状態がわかる（起動しているかどうか）
- 今のサーバのIPアドレスが確認できる

#### バックアップ要件
- 一日に一回バックアップ（AMI）を取得する
- バックアップは7世代分だけ残してローテーションするが、月初めのバックアップは永続的に残す
- 上記のAMIを元にスケールアップ/ダウンができるようにする

### 実施した手順
#### Minecraftサーバ作成
1. EC2サーバ起動
2. パッケージのインストール（install_package.sh）
3. Minecraftのインストール（create_minecraft.sh）  
spigotのバージョンに注意
4. Minecraft起動用スクリプト（minecraft_custom_start.sh）を作成し、サーバ起動時に自動起動するように実装（auto_start_minecraft.sh）

#### Discord bot作成
1. サイトを参照してアプリケーションを作成
2. botの招待リンクは下記
https://discord.com/api/oauth2/authorize?client_id=1139242338254852209&permissions=0&scope=bot%20applications.commands
3. node実行環境を作成し、プログラム作成
4. スラッシュコマンドをdiscordにデプロイ
5. discord-interactionsのLambda Layerを作成し、スラッシュコマンドを受けるLambda関数を作成（discordBot_minemanage）
6. 上記のLambda関数にAPIGatewayを紐づけて、discordbotのInteraction URLに登録する
7. EC2をそれぞれ起動、停止、状態確認するLambda関数を作成

#### 自動停止スクリプト作成（cron）
1. minecraftのログを監視するシェルスクリプトを作成（check_access_to_shutdown.sh）
2. rootユーザーのcronに登録し、10分置きに確認するが、起動後15分間は停止しないようにする

#### ワールド再作成
1. バックアップの作成
2. 再ビルドでワールド再作成

#### オペレーター権限付与
1. ops.txtを作成して付与
2. ops.jsonの内容で権限レベルを3に修正

#### バックアップ機能作成
未実装

### 参照サイト
- AWSでマインクラフトサーバーを立てる  
https://dev.classmethod.jp/articles/new-minecraft-for-aws_ec2-instance/
- プレイヤー人数に応じた推奨スペック  
https://www.conoha.jp/vps/media/mine-semi/recommended-server/#section02-02
- DiscordbotをLambdaで作成する  
https://zenn.dev/nacal/articles/e7f0d481661ec0
- Spigot  
https://getbukkit.org/download/spigot
- Discordbot作成方法  
https://www.geeklibrary.jp/counter-attack/discord-js-bot/
- discord.js公式Doc
https://discordjs.guide/slash-commands/deleting-commands.html
- shellでログ解析する方法  
https://qiita.com/moneymog/items/16d2f843c344a5ace51a
- 3秒以上かかる処理に対してdeferする方法
https://dev.classmethod.jp/articles/discord-interaction-endpoint-deferred-multi-lambda/

