import os
import boto3
import secrets
import string
import uuid
import time
from flask import Flask, jsonify, make_response, request

app = Flask(__name__)


dynamodb_client = boto3.client('dynamodb')

if os.environ.get('IS_OFFLINE'):
    dynamodb_client = boto3.client(
        'dynamodb', region_name='localhost', endpoint_url='http://localhost:8000'
    )


PWD_TABLE = os.environ['PWD_TABLE']


@app.route('/pwd/<string:pwd_id>')
def get_user(pwd_id):
    result = dynamodb_client.get_item(
        TableName=PWD_TABLE, Key={'pwdId': {'S': pwd_id}}
    )
    item = result.get('Item')
    if not item:
        return jsonify({'error': 'Could not find user with provided "pwdId"'}), 404

    return jsonify(
        {
            'pwd_id': item.get('pwdId').get('S'),
            'pwd': item.get('name').get('S'),
            'view_count': item.get('viewCount').get('N'),
        }
    )


@app.route('/pwd', methods=['POST'])
def get_pwd():
    use_letters = request.json.get('use_letters')
    use_digits = request.json.get('use_digits')
    use_punctuation = request.json.get('use_punctuation')
    pass_length = request.json.get('pass_length')
    pass_view_limit = request.json.get('pass_view_limit')
    expiration_in_seconds = request.json.get('expiration_in_seconds')

    alphabet = ''

    if use_letters:
        letters = string.ascii_letters
        alphabet += letters
    if use_digits:
        digits = string.digits
        alphabet += digits
    if use_punctuation:
        punctuation = string.punctuation
        alphabet += punctuation

    pwd = ''
    for i in range(pass_length):
        pwd += ''.join(secrets.choice(alphabet))

    pwd_id = str(uuid.uuid4())

    if not use_letters or not use_digits or not use_punctuation or not expiration_in_seconds:
        return jsonify({'error': 'Please provide "use_letters", "use_digits", "use_punctuation" and "expiration_in_seconds"'}), 400

    dynamodb_client.put_item(
        TableName=PWD_TABLE,
        Item={
            'pwdId': {'S': pwd_id},
            'pwd': {'S': pwd},
            'viewCount': {'N': str(pass_view_limit)},
            'expiration_date': {'N': str(expiration_in_seconds + int(time.time()))}
        }
    )

    return jsonify({'userId': pwd_id, 'name': pwd})


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)
