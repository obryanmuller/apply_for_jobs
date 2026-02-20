import time

def now_unix() -> int:
    return int(time.time())

def is_expired(expires_at: int) -> bool:
    return int(expires_at) <= now_unix()

def is_view_limit_reached(views_used: int, max_views: int) -> bool:
    return int(views_used) >= int(max_views)