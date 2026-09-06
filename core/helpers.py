
def to_bool(value: str | bool | int | None) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value == 1
    if value is None:
        return False
    return value.strip().lower() in {"1", "true", "yes", "on"}
