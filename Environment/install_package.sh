# パッケージのアップデート
sudo yum -y update

# correttoのパッケージをインポート
sudo rpm --import https://yum.corretto.aws/corretto.key

# リポジトリファイルのダウンロード
sudo curl -L -o /etc/yum.repos.d/corretto.repo https://yum.corretto.aws/corretto.repo

# 必要なパッケージのインストール
sudo yum install -y java-18-amazon-corretto-devel git
