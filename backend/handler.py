import json
import time
import secrets
import hashlib
import boto3
import os 
from cryptography.fernet import Fernet
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = os.environ["TABLE_NAME"]
table = dynamodb.Table(TABLE_NAME)

def response(status_code: int, body: dict):
    def default(o):
        if isinstance(o, Decimal):
            # Dynamo usa Decimal; convertendo pra int se for inteiro, senão float
            return int(o) if o % 1 == 0 else float(o)
        raise TypeError

    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body, default=default),
    }

def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

def get_path_param(event: dict, name: str) -> str | None:
    return (event.get("pathParameters") or {}).get(name)

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

def get_pwd(event, context):
    pwd_id = get_path_param(event, "pwdId")
    if not pwd_id:
        return response(400, {"message": "pwdId ausente"})

    token_hash = sha256_hex(pwd_id)

    res = table.get_item(Key={"token_hash": token_hash})
    item = res.get("Item")
    if not item:
        return response(404, {"message": "Link inválido"})
    if item.get("revoked") is True or is_expired(item) or is_view_limit_reached(item):
        return response(410, {"message": "Link expirou ou atingiu o limite de visualizações"})

    try:
        table.update_item(
            Key={"token_hash": token_hash},
            UpdateExpression="SET views_used = views_used + :one",
            ConditionExpression="views_used < max_views AND expires_at > :now AND (attribute_not_exists(revoked) OR revoked = :false)",
            ExpressionAttributeValues={
                ":one": 1,
                ":now": now_unix(),
                ":false": False,
            },
    )
    except Exception as e:
        # se falhou aqui, significa que outra requisição já consumiu a view
        if "ConditionalCheckFailedException" in str(e):
            return response(410, {"message": "Link expirou ou view já consumida"})
        return response(500, {"message": "Erro ao atualizar visualização"})
    secret = decrypt(item["ciphertext"])

    return response(200, {
        "pwd_id": pwd_id,
        "pwd": secret,
        "expiration_date": item["expires_at"],
        "view_count": int(item["max_views"]) - (int(item["views_used"]) + 1)
    })

def encrypt(plain: str) -> str:
    key = os.environ["ENCRYPTION_KEY"].encode()
    f = Fernet(key)
    return f.encrypt(plain.encode()).decode()

def decrypt(ciphertext: str) -> str:
    key = os.environ["ENCRYPTION_KEY"].encode()
    f = Fernet(key)
    return f.decrypt(ciphertext.encode()).decode()

def now_unix() -> int:
    return int(time.time())

def is_expired(item: dict) -> bool:
    return int(item["expires_at"]) <= now_unix()

def is_view_limit_reached(item: dict) -> bool:
    return int(item["views_used"]) >= int(item["max_views"])