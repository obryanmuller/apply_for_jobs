import os
import boto3
from botocore.exceptions import ClientError
from utils.time_utils import now_unix

_dynamodb = boto3.resource("dynamodb")
_table = _dynamodb.Table(os.environ["TABLE_NAME"])

def save_secret(item: dict) -> None:
    _table.put_item(Item=item)

def get_secret(token_hash: str) -> dict | None:
    res = _table.get_item(Key={"token_hash": token_hash})
    return res.get("Item")

def consume_view(token_hash: str) -> bool:
    """
    Retorna True se consumiu a visualização.
    Retorna False se falhou por condição (expirado/sem views/revogado).
    """
    try:
        _table.update_item(
            Key={"token_hash": token_hash},
            UpdateExpression="SET views_used = views_used + :one",
            ConditionExpression="views_used < max_views AND expires_at > :now AND (attribute_not_exists(revoked) OR revoked = :false)",
            ExpressionAttributeValues={
                ":one": 1,
                ":now": now_unix(),
                ":false": False,
            },
        )
        return True
    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
            return False
        raise