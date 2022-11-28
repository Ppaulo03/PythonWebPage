import os

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
def get_dir(path):
    return os.path.join(THIS_DIR, path)