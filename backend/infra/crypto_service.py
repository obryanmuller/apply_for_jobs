import os
from cryptography.fernet import Fernet

def encrypt(plain: str) -> str:
    key = os.environ["ENCRYPTION_KEY"].encode()
    return Fernet(key).encrypt(plain.encode()).decode()

def decrypt(ciphertext: str) -> str:
    key = os.environ["ENCRYPTION_KEY"].encode()
    return Fernet(key).decrypt(ciphertext.encode()).decode()