import json
from decimal import Decimal

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "http://localhost:3000",  # pode usar "*" temporariamente
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
}

def json_response(status_code: int, body: dict):
    def default(o):
        if isinstance(o, Decimal):
            return int(o) if o % 1 == 0 else float(o)
        raise TypeError

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            **CORS_HEADERS,
        },
        "body": json.dumps(body, default=default),
    }