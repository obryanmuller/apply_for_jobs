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

from botocore.exceptions import ClientError
from utils.time_utils import now_unix

from typing import Literal, Tuple, Dict, Any
from botocore.exceptions import ClientError

ConsumeStatus = Literal["consumed", "consumed_and_deleted", "not_allowed"]

def consume_view_and_maybe_delete(token_hash: str) -> Tuple[ConsumeStatus, Dict[str, Any]]:
    """
    Retorna:
      - ("consumed", item_atualizado) -> consumiu 1 view e o item continua
      - ("consumed_and_deleted", item_atualizado) -> consumiu a última view e deletou o item
      - ("not_allowed", {}) -> expirado/sem views/revogado
    """
    item = _table.get_item(Key={"token_hash": token_hash}).get("Item")
    if not item:
        return "not_found", {}
    try:
        res = _table.update_item(
            Key={"token_hash": token_hash},
            UpdateExpression="SET views_used = views_used + :one",
            ConditionExpression=(
                "views_used < max_views AND expires_at > :now AND "
                "(attribute_not_exists(revoked) OR revoked = :false)"
            ),
            ExpressionAttributeValues={
                ":one": 1,
                ":now": now_unix(),
                ":false": False,
            },
            ReturnValues="ALL_NEW",
        )

        item = res.get("Attributes") or {}
        views_used = int(item.get("views_used", 0))
        max_views = int(item.get("max_views", 0))

        # se atingiu o limite, remove imediatamente
        if max_views > 0 and views_used >= max_views:
            _table.delete_item(Key={"token_hash": token_hash})
            return "consumed_and_deleted", item

        return "consumed", item

    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
            return "not_allowed", {}
        raise