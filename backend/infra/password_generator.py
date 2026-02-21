import secrets

LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
DIGITS = "0123456789"
PUNCTUATION = "!@#$%^&*()-_=+[]{};:,.<>?"

def generate_password(use_letters: bool, use_digits: bool, use_punctuation: bool, length: int) -> str:
    if length < 8 or length > 128:
        raise ValueError("pass_length deve estar entre 8 e 128")

    pools: list[str] = []
    if use_letters:
        pools.append(LETTERS)
    if use_digits:
        pools.append(DIGITS)
    if use_punctuation:
        pools.append(PUNCTUATION)

    if not pools:
        raise ValueError("Selecione ao menos um tipo de caractere")

    # 1 de cada pool habilitado (diversidade mínima)
    password_chars = [secrets.choice(pool) for pool in pools]

    alphabet = "".join(pools)
    while len(password_chars) < length:
        password_chars.append(secrets.choice(alphabet))

    secrets.SystemRandom().shuffle(password_chars)
    return "".join(password_chars)