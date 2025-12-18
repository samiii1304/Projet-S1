# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import sensors
import actuators

app = Flask(__name__)
CORS(app)


@app.route("/api/environment")
def environment():
    light, light_percent = sensors.read_light()
    sound = sensors.read_sound()
    gas = sensors.read_gas()
    presence = sensors.read_pir()

    # Interprétation simple du gaz
    if gas < 300:
        air_quality = "Bonne"
    elif gas < 600:
        air_quality = "Moyenne"
    else:
        air_quality = "Mauvaise"

    # Exemple d’alerte
    if sound > 600:
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
    app.run(host="0.0.0.0", port=5000)

