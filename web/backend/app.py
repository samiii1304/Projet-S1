from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
app.secret_key = "studybuddy-secret"
CORS(app, supports_credentials=True)
app.config.update(
    SESSION_COOKIE_SAMESITE=None,  # permet cross-site cookies
    SESSION_COOKIE_SECURE=False    # obligatoire si pas HTTPS
)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500"])
DB = "database.db"

def get_db():
    return sqlite3.connect(DB)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "SELECT id FROM utilisateurs WHERE username=? AND password=?",
        (username, password)
    )
    user = cur.fetchone()
    db.close()
    if user:
        session["user"] = username
        print(session)
        return jsonify({"status": "ok"})
    else:
        return jsonify({"status": "error"}), 401

@app.route("/me")
def me():
    if "user" in session:
        return jsonify({"user": session["user"]})
    return jsonify({"user": None}), 401

@app.route("/logout")
def logout():
    session.clear()
    return jsonify({"status": "logged out"})

if __name__ == "__main__":
    app.run(debug=True)