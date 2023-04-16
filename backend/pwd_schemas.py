save_pwd_schema = {
    "type": "object",
    "properties": {
        "use_letters": {"type": "boolean"},
        "use_digits": {"type": "boolean"},
        "use_punctuation": {"type": "boolean"},
        "pass_length": {"type": "number"},
        "pass_view_limit": {"type": "number"},
        "expiration_in_seconds": {"type": "number"},
        "sended_password": {"type": "string"}
    },
    "required": ["use_letters", "use_digits", "use_punctuation", "pass_length", "pass_view_limit", "expiration_in_seconds"]
}
