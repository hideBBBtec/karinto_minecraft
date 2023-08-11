import boto3
import os
region = 'ap-northeast-1'
instances = [os.environ.get("INSTANCE_ID")]
ec2 = boto3.client('ec2', region_name=region)

def lambda_handler(event, context):
    try:
        response = ec2.stop_instances(InstanceIds=instances)
        print(response)
        
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
