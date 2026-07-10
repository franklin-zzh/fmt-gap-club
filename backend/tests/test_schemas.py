import json

import pytest

from app import schemas


@pytest.mark.parametrize(
    "model_cls,field_name,input_value,expected",
    [
        (schemas.ProductBase, "tags", '["a", "b"]', ["a", "b"]),
        (schemas.ProductBase, "tags", ["a", "b"], ["a", "b"]),
        (schemas.ProductDetailBase, "efficacy", '{"key": "value"}', {"key": "value"}),
        (schemas.ProductDetailBase, "efficacy", {"key": "value"}, {"key": "value"}),
        (schemas.CommentBase, "metrics", '{"score": 5}', {"score": 5}),
        (schemas.MemberProfileBase, "health_goals", '["goal1"]', ["goal1"]),
        (schemas.MemberProfileBase, "lifestyle_tags", '["tag1"]', ["tag1"]),
        (schemas.HealthSubmissionBase, "answers", '{"q1": "a1"}', {"q1": "a1"}),
        (schemas.HealthSubmissionResponse, "recommendations", '[{"id": 1}]', [{"id": 1}]),
    ],
)
def test_json_string_parsing(model_cls, field_name, input_value, expected):
    """JSON-type columns may be returned as strings; schemas should parse them."""
    data = {field_name: input_value}
    if model_cls is schemas.ProductBase:
        data["name"] = "Test Product"
    if model_cls is schemas.HealthSubmissionResponse:
        data.update({"id": 1, "user_id": 1, "status": "pending", "created_at": "2024-01-01T00:00:00"})
    instance = model_cls(**data)
    assert getattr(instance, field_name) == expected


def test_parse_json_string_helper():
    assert schemas._parse_json_string('["a"]') == ["a"]
    assert schemas._parse_json_string('{"a": 1}') == {"a": 1}
    assert schemas._parse_json_string("plain") == "plain"
    assert schemas._parse_json_string(["a"]) == ["a"]
