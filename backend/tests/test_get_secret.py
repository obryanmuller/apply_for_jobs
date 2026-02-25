import json

from usecases.get_secret import get_secret


def _body(resp):
    return json.loads(resp.get("body") or "{}")


def test_get_secret_requires_pwdid(monkeypatch):
    monkeypatch.setattr("usecases.get_secret.get_path_param", lambda event, key: "")

    resp = get_secret({"pathParameters": {}})

    assert resp["statusCode"] == 400
    assert "pwdId" in _body(resp)["message"]


def test_get_secret_returns_404_when_not_found(monkeypatch):
    monkeypatch.setattr("usecases.get_secret.get_path_param", lambda event, key: "abc")
    monkeypatch.setattr("usecases.get_secret.sha256_hex", lambda s: "hash:abc")
    monkeypatch.setattr(
        "usecases.get_secret.consume_view_and_maybe_delete",
        lambda token_hash: ("not_found", None),
    )

    resp = get_secret({"pathParameters": {"pwdId": "abc"}})

    assert resp["statusCode"] == 404
    assert _body(resp)["message"] == "Link inválido"


def test_get_secret_returns_410_when_not_allowed(monkeypatch):
    monkeypatch.setattr("usecases.get_secret.get_path_param", lambda event, key: "abc")
    monkeypatch.setattr("usecases.get_secret.sha256_hex", lambda s: "hash:abc")
    monkeypatch.setattr(
        "usecases.get_secret.consume_view_and_maybe_delete",
        lambda token_hash: ("not_allowed", None),
    )

    resp = get_secret({"pathParameters": {"pwdId": "abc"}})

    assert resp["statusCode"] == 410
    assert "expirou" in _body(resp)["message"]


def test_get_secret_success_decrypts_and_returns_remaining_views(monkeypatch):
    monkeypatch.setattr("usecases.get_secret.get_path_param", lambda event, key: "tok123")
    monkeypatch.setattr("usecases.get_secret.sha256_hex", lambda s: "hash:tok123")

    item = {
        "ciphertext": "enc:segredo",
        "expires_at": 9999,
        "views_used": 1,
        "max_views": 3,
    }

    monkeypatch.setattr(
    "usecases.get_secret.consume_view_and_maybe_delete",
    lambda token_hash: ("consumed", item),
)
    monkeypatch.setattr("usecases.get_secret.decrypt", lambda c: "MEU_SEGREDO")

    resp = get_secret({"pathParameters": {"pwdId": "tok123"}})

    assert resp["statusCode"] == 200
    body = _body(resp)

    assert body["pwdId"] == "tok123"
    assert body["pwd"] == "MEU_SEGREDO"
    assert body["expiration_date"] == 9999
    assert body["view_count"] == 2