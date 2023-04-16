import os
import boto3
import uuid
import time

dynamodb_client = boto3.client('dynamodb')

if os.environ.get('IS_OFFLINE'):
    dynamodb_client = boto3.client(
        'dynamodb', region_name='localhost', endpoint_url='http://localhost:8000'
    )


PWD_TABLE = os.environ['PWD_TABLE']


def get_by_pwd_id(pwd_id):
    result = dynamodb_client.get_item(
        TableName=PWD_TABLE,
        Key={'pwdId': {'S': pwd_id}},
    )
    return result


def delete_by_pwd_id(pwd_id):
    dynamodb_client.delete_item(
        TableName=PWD_TABLE,
        Key={'pwdId': {'S': pwd_id}},
    )


def save_new_pwd(pwd, pass_view_limit, expiration_in_seconds):
    pwd_id = str(uuid.uuid4())
    dynamodb_client.put_item(
        TableName=PWD_TABLE,
        Item={
            'pwdId': {'S': pwd_id},
            'pwd': {'S': pwd},
            'viewCount': {'N': str(pass_view_limit)},
            'expirationDate': {'N': str(expiration_in_seconds + int(time.time()))}
        }
    )
    return pwd_id


def decrease_count_view(pwd_id, views_left):
    dynamodb_client.update_item(
        TableName=PWD_TABLE,
        Key={'pwdId': {'S': pwd_id}},
        UpdateExpression="set viewCount = :r",
        ExpressionAttributeValues={
            ':r': {'N': str(views_left)},
        },
    )
