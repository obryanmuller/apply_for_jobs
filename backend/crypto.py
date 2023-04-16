import os
from cryptography.fernet import Fernet

key = os.environ.get('CRYPTO_KEY')

if not key:
    raise ValueError(
        'A chave de criptografia não foi definida na variável de ambiente.')

fernet = Fernet(key.encode())


def encrypt_data(data: str):
    encrypted_data = fernet.encrypt(data.encode())
    return encrypted_data.decode()


def decrypt_data(encrypted_data: str):
    decrypted_data = fernet.decrypt(encrypted_data.encode()).decode()
    return decrypted_data
