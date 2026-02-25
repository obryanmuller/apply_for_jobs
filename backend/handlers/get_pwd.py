from usecases.get_secret import get_secret

def handler(event, context):
    return get_secret(event)