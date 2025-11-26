from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3
import hashlib
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'studybuddy_secret_key'

def get_db_connection():
    conn = sqlite3.connect('studybuddy.db')
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Routes principales
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM utilisateurs WHERE id = ?', (session['user_id'],)).fetchone()
    
    # Statistiques
    today = datetime.now().date()
    sessions_today = conn.execute('''
        SELECT COUNT(*) FROM sessions 
        WHERE utilisateur_id = ? AND DATE(date_debut) = ? AND statut = "termine"
    ''', (session['user_id'], today)).fetchone()[0]
    
    conn.close()
    return render_template('index.html', user=user, sessions_today=sessions_today)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        pseudo = request.form['pseudo']
        password = request.form['password']
        
        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM utilisateurs WHERE pseudo = ? AND mot_de_passe_hash = ?',
            (pseudo, hash_password(password))
        ).fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user['id']
            session['pseudo'] = user['pseudo']
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Pseudo ou mot de passe incorrect')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        pseudo = request.form['pseudo']
        password = request.form['password']
        
        conn = get_db_connection()
        try:
            conn.execute(
                'INSERT INTO utilisateurs (pseudo, mot_de_passe_hash) VALUES (?, ?)',
                (pseudo, hash_password(password))
            )
            conn.commit()
            conn.close()
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            conn.close()
            return render_template('register.html', error='Ce pseudo est déjà utilisé')
    
    return render_template('register.html')

@app.route('/pomodoro')
def pomodoro():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    methodes = conn.execute('SELECT * FROM methodes_travail').fetchall()
    conn.close()
    
    return render_template('pomodoro.html', methodes=methodes)

@app.route('/start_session', methods=['POST'])
def start_session():
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Non connecté'})
    
    methode_id = request.json['methode_id']
    conn = get_db_connection()
    
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO sessions (utilisateur_id, methode_id, date_debut, statut) 
        VALUES (?, ?, ?, ?)
    ''', (session['user_id'], methode_id, datetime.now(), 'en_cours'))
    
    session_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'session_id': session_id})

@app.route('/statistiques')
def statistiques():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    
    # Sessions des 7 derniers jours
    seven_days_ago = (datetime.now() - timedelta(days=7)).date()
    sessions_data = conn.execute('''
        SELECT DATE(date_debut) as date, COUNT(*) as count
        FROM sessions 
        WHERE utilisateur_id = ? AND date_debut >= ? AND statut = 'termine'
        GROUP BY DATE(date_debut)
        ORDER BY date
    ''', (session['user_id'], seven_days_ago)).fetchall()
    
    conn.close()
    return render_template('statistiques.html', sessions_data=sessions_data)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    from init_database import init_database
    init_database()
    app.run(debug=True, host='0.0.0.0', port=5000)
