from infra.pwd_repository import get_secret as repo_get_secret, consume_view_and_maybe_delete
from infra.crypto_service import decrypt
from utils.http import json_response
from utils.security import sha256_hex, get_path_param
from utils.time_utils import is_expired, is_view_limit_reached


def get_secret(event: dict):
    pwd_id = get_path_param(event, "pwdId")
    if not pwd_id:
        return json_response(400, {"message": "pwdId ausente"})

    token_hash = sha256_hex(pwd_id)

    item = repo_get_secret(token_hash)
    if not item:
        return json_response(404, {"message": "Link inválido"})

    expired = is_expired(item["expires_at"])
    limit_reached = is_view_limit_reached(item["views_used"], item["max_views"])
    if item.get("revoked") is True or expired or limit_reached:
        return json_response(410, {"message": "Link expirou ou atingiu o limite de visualizações"})

    result = consume_view_and_maybe_delete(token_hash)
    if result == "not_allowed":
        return json_response(410, {"message": "Link expirou ou view já consumida"})

    secret = decrypt(item["ciphertext"])
    views_remaining = int(item["max_views"]) - (int(item["views_used"]) + 1)

    return json_response(200, {
        "pwdId": pwd_id,
        "pwd": secret,
        "expiration_date": item["expires_at"],
        "view_count": views_remaining,
    })