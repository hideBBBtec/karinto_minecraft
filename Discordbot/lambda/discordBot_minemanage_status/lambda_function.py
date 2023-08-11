import boto3
import os
import urllib.request
import urllib.parse #URLエンコード
import json

region = 'ap-northeast-1'
instances = [os.environ.get("INSTANCE_ID")]
ec2 = boto3.client('ec2', region_name=region)

def lambda_handler(event, context):
    try:
        response = ec2.describe_instances(InstanceIds=instances)
        # print(response["Reservations"][0]["Instances"][0])
        
        publicIp = response["Reservations"][0]["Instances"][0].get("PublicIpAddress", "not public")
        serverStatus = response["Reservations"][0]["Instances"][0]["State"]["Name"]
        interactionToken = event.get("interaction").get("token")
        url = f'https://discord.com/api/v9/webhooks/{os.environ.get("DISCORD_APP_ID")}/{interactionToken}'

        # 遅延メッセージを確定させる
        data = {
            "content": f"Status: {serverStatus}\nIP Address: {publicIp}"
        }
        data = json.dumps(data)
        data = data.encode("utf-8")
        request = urllib.request.Request(
            url,
            headers={
                "Content-Type": "application/json",
                "User-Agent": ""
            },
            data=data,
            method="POST"
        )
        

        with urllib.request.urlopen(request) as res:
            #HTTPステータスコードを取得する
            status = res.getcode()
            print("Status code: " + str(status))
      
        return {
            'statusCode': 200,
            'body': {
                'status': 'success'
            }
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': {
                'status': 'fail'
            }
        }
