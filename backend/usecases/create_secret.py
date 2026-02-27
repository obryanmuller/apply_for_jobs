import json
import secrets

from infra.pwd_repository import save_secret
from infra.password_generator import generate_password
from infra.crypto_service import encrypt
from utils.http import json_response
from utils.security import sha256_hex
from utils.time_utils import now_unix


def create_secret(event: dict):
    body = json.loads(event.get("body") or "{}")

    expiration = int(body.get("expiration_in_seconds", 3600))
    max_views = int(body.get("pass_view_limit", 1))

    if expiration <= 0:
        return json_response(400, {"message": "expiration_in_seconds deve ser maior que 0"})

    if max_views <= 0:
        return json_response(400, {"message": "pass_view_limit deve ser maior que 0"})

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