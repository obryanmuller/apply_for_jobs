import json
import pytest


@pytest.fixture
def make_event():
    def _make_event(body=None, path_params=None):
        return {
            "body": json.dumps(body) if body is not None else None,
            "pathParameters": path_params or {},
        }
    return _make_event