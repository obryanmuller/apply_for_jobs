import hashlib

def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

def get_path_param(event: dict, name: str) -> str | None:
    return (event.get("pathParameters") or {}).get(name)