from usecases.create_secret import create_secret

def handler(event, context):
    return create_secret(event)