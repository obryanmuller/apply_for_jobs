from infra.pwd_repository import consume_view_and_maybe_delete
from infra.crypto_service import decrypt
from utils.http import json_response
from utils.security import sha256_hex, get_path_param


def get_secret(event: dict):
    pwd_id = get_path_param(event, "pwdId")
    if not pwd_id:
        return json_response(400, {"message": "pwdId ausente"})

    token_hash = sha256_hex(pwd_id)

    status, item = consume_view_and_maybe_delete(token_hash)

    if status == "not_found":
        return json_response(404, {"message": "Link inválido"})

    if status == "not_allowed":
        return json_response(410, {"message": "Link expirou ou atingiu o limite de visualizações"})

    # item é ALL_NEW (consistente)
    secret = decrypt(item["ciphertext"])

    expires_at = int(item.get("expires_at", 0))
    views_used = int(item.get("views_used", 0))
    max_views = int(item.get("max_views", 0))
    views_remaining = max_views - views_used

    return json_response(200, {
        "pwdId": pwd_id,
        "pwd": secret,
        "expiration_date": expires_at,
        "view_count": views_remaining,
    })