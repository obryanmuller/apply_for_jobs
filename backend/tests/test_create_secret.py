import json

from usecases.create_secret import create_secret


def _body(resp):
    return json.loads(resp.get("body") or "{}")


def test_create_secret_rejects_expiration_zero(make_event):
    event = make_event({"expiration_in_seconds": 0, "pass_view_limit": 1})

    resp = create_secret(event)

    assert resp["statusCode"] == 400
    assert "expiration_in_seconds" in _body(resp)["message"]


def test_create_secret_rejects_view_limit_zero(make_event):
    event = make_event({"expiration_in_seconds": 10, "pass_view_limit": 0})

    resp = create_secret(event)

    assert resp["statusCode"] == 400
    assert "pass_view_limit" in _body(resp)["message"]


def test_create_secret_accepts_sended_password_and_saves_item(monkeypatch, make_event):
    saved = {}

    monkeypatch.setattr("usecases.create_secret.encrypt", lambda s: f"enc:{s}")
    monkeypatch.setattr("usecases.create_secret.now_unix", lambda: 1000)
    monkeypatch.setattr("usecases.create_secret.sha256_hex", lambda t: f"hash:{t}")

    def fake_save_secret(item):
        saved.update(item)

    monkeypatch.setattr("usecases.create_secret.save_secret", fake_save_secret)

    event = make_event({
        "expiration_in_seconds": 60,
        "pass_view_limit": 2,
        "sended_password": "  MinhaSenha123  ",
    })

    resp = create_secret(event)

    assert resp["statusCode"] == 201
    body = _body(resp)
    assert "pwdId" in body
    assert isinstance(body["pwdId"], str) and body["pwdId"]

    assert saved["ciphertext"] == "enc:MinhaSenha123"
    assert saved["expires_at"] == 1060
    assert saved["max_views"] == 2
    assert saved["views_used"] == 0
    assert saved["revoked"] is False
    assert saved["token_hash"].startswith("hash:")


def test_create_secret_generates_password_when_not_sent(monkeypatch, make_event):
    saved = {}
    calls = {}

    monkeypatch.setattr("usecases.create_secret.encrypt", lambda s: f"enc:{s}")
    monkeypatch.setattr("usecases.create_secret.now_unix", lambda: 2000)
    monkeypatch.setattr("usecases.create_secret.sha256_hex", lambda t: f"hash:{t}")

    def fake_generate_password(use_letters, use_digits, use_punctuation, pass_length):
        calls["args"] = (use_letters, use_digits, use_punctuation, pass_length)
        return "GERADA_ABC123!"

    monkeypatch.setattr("usecases.create_secret.generate_password", fake_generate_password)

    def fake_save_secret(item):
        saved.update(item)

    monkeypatch.setattr("usecases.create_secret.save_secret", fake_save_secret)

    event = make_event({
        "expiration_in_seconds": 120,
        "pass_view_limit": 1,
        "use_letters": True,
        "use_digits": True,
        "use_punctuation": True,
        "pass_length": 16,
    })

    resp = create_secret(event)

    assert resp["statusCode"] == 201
    assert calls["args"] == (True, True, True, 16)
    assert saved["ciphertext"] == "enc:GERADA_ABC123!"
    assert saved["expires_at"] == 2120


def test_create_secret_returns_400_when_generator_raises(monkeypatch, make_event):
    def fake_generate_password(*args, **kwargs):
        raise ValueError("policy inválida")

    monkeypatch.setattr("usecases.create_secret.generate_password", fake_generate_password)

    event = make_event({
        "expiration_in_seconds": 10,
        "pass_view_limit": 1,
        "use_letters": False,
        "use_digits": False,
        "use_punctuation": False,
        "pass_length": 10,
    })

    resp = create_secret(event)

    assert resp["statusCode"] == 400
    assert _body(resp)["message"] == "policy inválida"