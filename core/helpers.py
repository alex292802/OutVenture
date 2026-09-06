
def to_bool(value: str | bool | int | None) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value == 1
    if value is None:
        return False
    return value.strip().lower() in {"1", "true", "yes", "on"}


def compute_distance(lat_a: float,long_a: float, lat_b: float, long_b: float) -> float:
    return 0