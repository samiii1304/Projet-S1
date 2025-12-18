# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import sensors
import actuators
import json

app = Flask(__name__)
CORS(app)
    
try:
    with open("config/config.json", "r") as f:
        config = json.load(f)
except FileNotFoundError:
    print("Erreur : config.json introuvable")
    exit(1)

SOUND_ALERT = config["thresholds"]["sound_alert"]
GAS_GOOD = config["thresholds"]["gas"]["good"]
GAS_MEDIUM = config["thresholds"]["gas"]["medium"]
BUZZER_ENABLED = config["hardware"]["buzzer_enabled"]

@app.route("/api/environment")
def environment():
    light, light_percent = sensors.read_light()
    sound = sensors.read_sound()
    gas = sensors.read_gas()
    presence = sensors.read_pir()

    # Interprétation simple du gaz
    if gas < GAS_GOOD:
        air_quality = "Bonne"
    elif gas < GAS_MEDIUM:
        air_quality = "Moyenne"
    else:
        air_quality = "Mauvaise"

    # Exemple d’alerte
    if sound > SOUND_ALERT and BUZZER_ENABLED:
        actuators.beep()

    data = {
        "luminosite": light,
        "light_percent": light_percent,
        "niveau_sonore": sound,
        "qualite_air": air_quality,
        "presence": bool(presence)
    }

    return jsonify(data)


if __name__ == "__main__":
    print("API StudyBuddy lancée")
    app.run(
        host=config["app"]["host"],
        port=config["app"]["port"],
        debug=config["app"]["debug"]
    )