import string


def validate_password(use_letters: bool, use_digits: bool, use_punctuation: bool, pass_length: bool, sended_password: str):
    if use_letters and not any(c.isalpha() for c in sended_password):
        return False
    if use_digits and not any(c.isdigit() for c in sended_password):
        return False
    if use_punctuation and not any(c in string.punctuation for c in sended_password):
        return False
    if len(sended_password) < pass_length:
        return False
    return True
