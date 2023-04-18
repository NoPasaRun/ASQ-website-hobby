import os
from typing import Tuple


def join_if_exist(*dirs: Tuple[str]):
    join_path = ""
    for dir in dirs:
        join_path = os.path.join(join_path, dir)
        if not os.path.exists(join_path):
            raise OSError(f"Path `{join_path}` does not exist")
    return join_path
        

root = os.path.abspath(".")
static_dir = join_if_exist(root, "static")