from flask import Flask, jsonify
from flask_cors import CORS
from phase2_environment import get_light, get_air_quality, pir, led
import time

app = Flask(__name__)
CORS(app)  # Permet au site web d'appeler l'API

@app.route('/')
def home():
    return "API StudyBuddy - Raspberry Pi"

@app.route('/api/environment')
def environment():
    movement = pir.read()
    light_pct, light_raw = get_light()
    air_status, air_raw = get_air_quality()
    
    # LED si mouvement + lumière faible (comme dans phase2_environment.py)
    if movement and light_pct < 30:
        led.write(1)
    else:
        led.write(0)
    
    return jsonify({
        'luminosite': light_raw,        # Valeur brute 0-1023
        'light_percent': light_pct,     # Pourcentage 0-100%
        'qualite_air': air_status,      # "Bon", "Moyen", etc.
        'air_raw': air_raw,             # Valeur brute
        'mouvement': bool(movement),    # True/False
        'timestamp': time.time()
    })

if __name__ == '__main__':
    print("API démarrée : http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000)
