import json
import secrets

from repositories.pwd_repository import save_secret, get_secret, consume_view
from services.password_generator import generate_password
from services.crypto_service import encrypt, decrypt
from utils.http import json_response
from utils.security import sha256_hex, get_path_param
from utils.time_utils import now_unix, is_expired, is_view_limit_reached


def create_pwd(event, context):
    body = json.loads(event.get("body") or "{}")

    expiration = int(body.get("expiration_in_seconds", 3600))
    max_views = int(body.get("pass_view_limit", 1))

    sended_password = body.get("sended_password")

    if sended_password is not None:
        if not isinstance(sended_password, str) or not sended_password.strip():
            return json_response(400, {"message": "sended_password inválido"})
        secret_plain = sended_password.strip()
    else:
        use_letters = bool(body.get("use_letters", True))
        use_digits = bool(body.get("use_digits", True))
        use_punctuation = bool(body.get("use_punctuation", True))
        pass_length = int(body.get("pass_length", 16))

        try:
            secret_plain = generate_password(use_letters, use_digits, use_punctuation, pass_length)
        except ValueError as e:
            return json_response(400, {"message": str(e)})

    token = secrets.token_urlsafe(32)
    token_hash = sha256_hex(token)

    item = {
        "token_hash": token_hash,
        "ciphertext": encrypt(secret_plain),
        "expires_at": now_unix() + expiration,
        "max_views": max_views,
        "views_used": 0,
        "revoked": False,
    }

    save_secret(item)
    return json_response(201, {"pwdId": token})


def get_pwd(event, context):
    pwd_id = get_path_param(event, "pwdId")
    if not pwd_id:
        return json_response(400, {"message": "pwdId ausente"})

    token_hash = sha256_hex(pwd_id)

    item = get_secret(token_hash)
    if not item:
        return json_response(404, {"message": "Link inválido"})

    expired = is_expired(item["expires_at"])
    limit_reached = is_view_limit_reached(item["views_used"], item["max_views"])
    if item.get("revoked") is True or expired or limit_reached:
        return json_response(410, {"message": "Link expirou ou atingiu o limite de visualizações"})

    if not consume_view(token_hash):
        return json_response(410, {"message": "Link expirou ou view já consumida"})

    secret = decrypt(item["ciphertext"])
    views_remaining = int(item["max_views"]) - (int(item["views_used"]) + 1)

    return json_response(200, {
        "pwdId": pwd_id,
        "pwd": secret,
        "expiration_date": item["expires_at"],
        "view_count": views_remaining,
    })