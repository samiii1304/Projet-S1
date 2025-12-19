import sqlite3
import os

DB = "database.db"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # dossier de init_db.py
SCHEMA = os.path.join(BASE_DIR, "../database/schema.sql")
SCHEMA = os.path.normpath(SCHEMA)
if not os.path.exists(DB):
    print("Base inexistante → création...")
    with sqlite3.connect(DB) as db:
        with open(SCHEMA, "r") as f:
            db.executescript(f.read())
        db.execute("PRAGMA foreign_keys = ON")
else:
    print("Base déjà existante → aucune action")

def table_exists(db, name):
    cur = db.cursor()
    cur.execute("""
        SELECT name FROM sqlite_master
        WHERE type='table' AND name=?
    """, (name,))
    return cur.fetchone() is not None