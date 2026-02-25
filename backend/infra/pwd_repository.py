import os
from typing import Literal, Tuple, Dict, Any, Optional

import boto3
from botocore.exceptions import ClientError

from utils.time_utils import now_unix


_dynamodb = boto3.resource("dynamodb")
_table = None


def get_table():
    global _table
    if _table is None:
        table_name = os.environ.get("TABLE_NAME")
        if not table_name:
            raise RuntimeError("TABLE_NAME não configurada")
        _table = _dynamodb.Table(table_name)
    return _table


def save_secret(item: dict) -> None:
    table = get_table()
    table.put_item(Item=item)


def get_secret(token_hash: str) -> Optional[dict]:
    table = get_table()
    res = table.get_item(Key={"token_hash": token_hash})
    return res.get("Item")


ConsumeStatus = Literal[
    "consumed",
    "consumed_and_deleted",
    "not_allowed",
    "not_found",
]


def consume_view_and_maybe_delete(token_hash: str) -> Tuple[ConsumeStatus, Dict[str, Any]]:
    table = get_table()

    item = table.get_item(Key={"token_hash": token_hash}).get("Item")
    if not item:
        return "not_found", {}

    try:
        res = table.update_item(
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

        if max_views > 0 and views_used >= max_views:
            table.delete_item(Key={"token_hash": token_hash})
            return "consumed_and_deleted", item

        return "consumed", item

    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
            return "not_allowed", {}
        raise