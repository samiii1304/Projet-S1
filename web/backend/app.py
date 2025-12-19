from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
from datetime import datetime, date, timedelta
import json
import os
import stats_study

config_path = os.path.join(os.path.dirname(__file__), "config/config.json")
try:
    with open(config_path, "r") as f:
        config = json.load(f)
except FileNotFoundError:
    print("Erreur : config.json introuvable")
    exit(1)

app = Flask(__name__)
app_config = config["app"]
db_config = config["database"]

HOST = app_config.get("host")
PORT = app_config.get("port")
DEBUG = app_config.get("debug")
CORS_ORIGINS = app_config.get("cross_site_origins")
DB_PATH = db_config.get("path", "database.db")

app.secret_key = "studybuddy-secret"
CORS(app, supports_credentials=True)
app.config.update(
    SESSION_COOKIE_SAMESITE=None,  # permet cross-site cookies
    SESSION_COOKIE_SECURE=False    # obligatoire si pas HTTPS
)
CORS(app, origins=CORS_ORIGINS, supports_credentials=True)

def get_db():
    return sqlite3.connect(DB_PATH)

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
        session["user_id"] = user[0]
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

@app.route("/pomodoro", methods=["POST"])
def add_pomodoro():
    if "user" not in session:
        return jsonify({"erreur": "Non autorisé"}), 401
    user_id = session["user_id"]
    cur.execute(
        "INSERT INTO pomodoros (user_id, date) VALUES (?, DATE('now'))",
        (user_id,)
    )
    db.commit()
    db.close()

    return jsonify({
        "status": "ok",
        "message": "Pomodoro enregistré",
        "minutes": 25
    })

@app.route("/sessions/start", methods=["POST"])
def start_session():
    if "user" not in session:
        return jsonify({"error": "Non autorisé"}), 401

    user_id = session["user_id"]

    db = get_db()
    cur = db.cursor()
    cur.execute("INSERT INTO sessions (user_id, started_at) VALUES (?, ?)",
                (user_id, datetime.now()))
    db.commit()
    session_id = cur.lastrowid
    db.close()

    return jsonify({"session_id": session_id})

@app.route("/sessions/end", methods=["POST"])
def end_session():
    if "user" not in session:
        return jsonify({"error": "Non autorisé"}), 401

    data = request.json
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id requis"}), 400

    db = get_db()
    cur = db.cursor()
    cur.execute("UPDATE sessions SET ended_at=? WHERE id=?",
                (datetime.now(), session_id))
    db.commit()
    db.close()
    return jsonify({"status": "ok"})

@app.route("/pomodoros", methods=["POST"])
def create_pomodoro():
    if "user" not in session:
        return jsonify({"error": "Non autorisé"}), 401

    user_id = session["user_id"]
    data = request.json
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id requis"}), 400

    db = get_db()
    cur = db.cursor()
    today = date.today()    
    cur.execute(
        "INSERT INTO pomodoros (session_id, user_id, date) VALUES (?, ?, ?)",
        (session_id, user_id, today)
    )
    db.commit()
    db.close()
    return jsonify({"status": "ok"})

@app.route("/stats")
def stats():
    if "user_id" not in session:
        return jsonify({"error": "Non autorisé"}), 401
    db = get_db()
    user_id = session["user_id"]
    stats_data = stats_study.get_user_stats(user_id, db)
    db.close()
    return jsonify(stats_data)

@app.route("/weekly_activity")
def weekly_activity():
    if "user_id" not in session:
        return jsonify({"error": "Non autorisé"}), 401
    days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    weekly_data = {
        day: {
            "day": day,
            "sessions": 0,
            "pomodoros": 0
        }
        for day in days
    }

    user_id = session["user_id"]
    db = get_db()
    cur = db.cursor()
    
    today = datetime.today().date()
    week_start = today - timedelta(days=today.weekday())  # lundi
    
    # Sessions et Pomodoros par jour
    cur.execute("""
        SELECT strftime('%w', date) as weekday, 
               COUNT(DISTINCT s.id) as sessions,
               COUNT(p.id) as pomodoros
        FROM sessions s
        LEFT JOIN pomodoros p ON s.id = p.session_id
        WHERE s.user_id = ? AND date(s.started_at) >= ?
        AND s.ended_at IS NOT NULL
        GROUP BY weekday
        ORDER BY weekday
    """, (user_id, week_start))
    for row in cur.fetchall():
        day_idx = sqlite_to_monday_index(row[0])
        day_name = days[day_idx]
        weekly_data[day_name]["sessions"] = row[1]
        weekly_data[day_name]["pomodoros"] = row[2]

    db.close()
    result = list(weekly_data.values())
    return jsonify(result)

def sqlite_to_monday_index(sqlite_day):
    return (int(sqlite_day) - 1) % 7

if __name__ == "__main__":
    app.run(
        host=HOST,
        port=PORT,
        debug=DEBUG
    )