from flask import Flask, render_template, make_response
from dirs import static_dir, join_if_exist

import logging
import json
import os
import re



app = Flask(__name__, template_folder=static_dir)
extensions = {
    ".jpg": "image/png",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".css": "text/css",
    ".js": "text/javascript",
    ".html": "text/html"
}

logger = logging.getLogger(__name__)


@app.get("/")
def main():
    return render_template("index.html")



@app.route("/static/<subdir>/<path:dir>", strict_slashes=False)
def serve_static(subdir: str, dir: str):

    dir = re.findall(r".+\.\w+", dir)[0]
    file_ext = re.findall(r"\.\w+", dir)[0]
    dir = "\\".join(dir.split("/"))

    file_path = join_if_exist(static_dir, subdir, dir)
    if os.path.isfile(file_path):
        response = make_response(open(file_path, "rb").read())
        response.headers['content-type'] = extensions.get(file_ext, "text")
        return response
    

@app.route("/static/audio/")
def send_audio():

    data: dict = {}
    folder = join_if_exist(static_dir, "audio")

    for index, file_name in enumerate(os.listdir(folder)):
        data[f"{index}"] = str(open(join_if_exist(folder, file_name), "rb").read())
    return json.dumps(data)
    

if __name__ == "__main__":
    app.run("192.168.31.52", 8000, debug=True)