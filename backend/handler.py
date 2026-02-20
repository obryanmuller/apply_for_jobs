import json
import time
import secrets
import hashlib
import boto3
import os 
from cryptography.fernet import Fernet

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("secure-secrets")

def create_pwd(event, context):
    body = json.loads(event.get("body") or "{}")

    expiration = int(body.get("expiration_in_seconds", 3600))
    max_views = int(body.get("pass_view_limit", 1))

    # aqui você pode receber do body ou gerar
    secret_plain = body.get("secret", "minhaSenha123!")
    if not isinstance(secret_plain, str) or not secret_plain:
        return {"statusCode": 400, "body": json.dumps({"error": "secret inválido"})}

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    item = {
        "token_hash": token_hash,
        "ciphertext": encrypt(secret_plain),
        "expires_at": int(time.time()) + expiration,
        "max_views": max_views,
        "views_used": 0,
        "revoked": False
    }

    table.put_item(Item=item)

    return {
        "statusCode": 200,
        "body": json.dumps({"pwdId": token})
    }

def encrypt(plain: str) -> str:
    key = os.environ["ENCRYPTION_KEY"].encode()
    f = Fernet(key)
    return f.encrypt(plain.encode()).decode()

def decrypt(ciphertext: str) -> str:
    key = os.environ["ENCRYPTION_KEY"].encode()
    f = Fernet(key)
    return f.decrypt(ciphertext.encode()).decode()