import os
import boto3
import secrets
import string
import uuid
import time

from flask import Flask, jsonify, request
app = Flask(__name__)

PASS_TABLE = os.environ['PASS_TABLE']
client = boto3.client('dynamodb')


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/pwdeita",  methods=["GET"])
def get_user():
    id = request.args.get('id')
    return jsonify({'q': id})
    resp = client.get_item(
        TableName=PASS_TABLE,
        Key={
            'passId': {'S': pass_id}
        }
    )
    item = resp.get('Item')
    if not item:
        return jsonify({'error': 'Pass does not exist'}), 404

    return jsonify({
        'passId': item.get('passId').get('S'),
        'pwd': item.get('pwd').get('S')
    })


@app.route("/pwd", methods=["POST"])
def generate_pass():
    use_letters = request.json.get('use_letters')
    use_digits = request.json.get('use_digits')
    use_punctuation = request.json.get('use_punctuation')
    pass_length = request.json.get('pass_length')
    expiradion_in_seconds = request.json.get('expiradion_in_seconds')

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

    pass_id = str(uuid.uuid4())

    resp = client.put_item(
        TableName=PASS_TABLE,
        Item={
            'passId': {'S': pass_id},
            'pwd': {'S': pwd},
            'expiration_date': expiradion_in_seconds + int(time.time()),
        }
    )

    return jsonify({
        'pwd': pwd,
        'passId': pass_id,
    })
