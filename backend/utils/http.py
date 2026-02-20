import json
from decimal import Decimal

def json_response(status_code: int, body: dict):
    def default(o):
        if isinstance(o, Decimal):
            return int(o) if o % 1 == 0 else float(o)
        raise TypeError

    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body, default=default),
    }