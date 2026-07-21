def exception_to_dict(exception: Exception) -> dict:
    return {
        "type": type(exception).__name__,
        "message": str(exception)
    }