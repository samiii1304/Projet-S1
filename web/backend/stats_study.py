import sqlite3
from datetime import datetime, date, timedelta

def get_sessions_today(cur, user_id):
    today = datetime.today().date()
    cur.execute("""
        SELECT COUNT(*) FROM sessions
        WHERE user_id = ? AND DATE(started_at) = ? AND ended_at IS NOT NULL
    """, (user_id, today))
    return cur.fetchone()[0]

def get_sessions_yesterday(cur, user_id):
    yesterday = datetime.today().date() - timedelta(days=1)
    cur.execute("""
        SELECT COUNT(*) FROM sessions
        WHERE user_id = ? AND DATE(started_at) = ? AND ended_at IS NOT NULL
    """, (user_id, yesterday))
    return cur.fetchone()[0]

def get_total_week_time(cur, user_id, pomodoro_minutes=25):
    from datetime import datetime, timedelta

    today = datetime.today().date()
    week_start = today - timedelta(days=today.weekday())  # lundi

    # Nombre de Pomodoros cette semaine
    cur.execute("""
        SELECT COUNT(*) FROM pomodoros
        WHERE user_id = ? AND date >= ?
    """, (user_id, week_start))
    total_pomodoros = cur.fetchone()[0]

    total_minutes = total_pomodoros * pomodoro_minutes
    hours = total_minutes // 60
    minutes = total_minutes % 60

    return {"hours": hours, "minutes": minutes}

def get_streaks(cur, user_id):
    # Récupérer toutes les dates uniques avec session terminée
    cur.execute("""
        SELECT DISTINCT DATE(ended_at)
        FROM sessions
        WHERE user_id = ? AND ended_at IS NOT NULL
        ORDER BY DATE(ended_at) DESC
    """, (user_id,))
    dates = [datetime.fromisoformat(row[0]).date() for row in cur.fetchall()]
    
    if not dates:
        return 0, 0  # current_streak, record_streak

    current_streak = 1
    record_streak = 1

    for i in range(1, len(dates)):
        if (dates[i-1] - dates[i]).days == 1:
            current_streak += 1
        else:
            current_streak = 1
        if current_streak > record_streak:
            record_streak = current_streak

    return current_streak, record_streak

def get_avg_focus(cur, user_id, pause_per_pomodoro=5):
    cur.execute("""
        SELECT s.id, s.started_at, s.ended_at, COUNT(p.id) as nb_pomodoros
        FROM sessions s
        LEFT JOIN pomodoros p ON s.id = p.session_id
        WHERE s.user_id = ?
        GROUP BY s.id
    """, (user_id,))
    
    sessions = cur.fetchall()
    focus_list = []

    for session in sessions:
        session_id, started_at, ended_at, nb_pomodoros = session
        if ended_at is None:
            ended_at = datetime.now()  # session en cours

        duration_minutes = duration_minutes = safe_session_duration_minutes(started_at, ended_at)
        total_pause = nb_pomodoros * pause_per_pomodoro
        work_duration = max(duration_minutes - total_pause, 0)

        focus_percent = (work_duration / duration_minutes * 100) if duration_minutes > 0 else 0
        focus_list.append(focus_percent)

    avg_focus = sum(focus_list) / len(focus_list) if focus_list else 0
    return avg_focus

def get_total_week_time(cur, user_id, pomodoro_minutes=25):
    today = datetime.today().date()
    week_start = today - timedelta(days=today.weekday())  # lundi

    # Nombre de Pomodoros cette semaine
    cur.execute("""
        SELECT COUNT(*) FROM pomodoros
        WHERE user_id = ? AND date >= ?
    """, (user_id, week_start))
    total_pomodoros = cur.fetchone()[0]

    total_minutes = total_pomodoros * pomodoro_minutes
    hours = total_minutes // 60
    minutes = total_minutes % 60
    return hours, minutes

def get_user_stats(user_id, db):
    cur = db.cursor()

    stats = {
        "sessions_today": get_sessions_today(cur, user_id),
        "sessions_yesterday": get_sessions_yesterday(cur, user_id),
        "total_week_hours": 0,
        "total_week_minutes": 0,
        "consecutive_days": 0,
        "record_streak": 0,
        "avg_focus": 0
    }

    stats["consecutive_days"], stats["record_streak"] = get_streaks(cur, user_id)
    stats["avg_focus"] = get_avg_focus(cur, user_id)
    stats["total_week_hours"], stats["total_week_minutes"]  = get_total_week_time(cur, user_id)
    db.close()
    return stats

from datetime import datetime

def safe_session_duration_minutes(started_at, ended_at):
    if not started_at:
        return 0

    if not ended_at:
        ended_at = datetime.now().isoformat()

    try:
        start = datetime.fromisoformat(started_at)
        end = datetime.fromisoformat(ended_at)
    except Exception:
        return 0

    duration = (end - start).total_seconds() / 60

    return max(duration, 0)
