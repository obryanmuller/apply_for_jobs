CORS_HEADERS = {
    "Access-Control-Allow-Origin": "http://localhost:3000",  # ou "*"
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
}

def handler(event, context):
    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": "",
    }