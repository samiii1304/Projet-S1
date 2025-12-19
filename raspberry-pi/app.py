# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import sensors
import actuators

app = Flask(__name__)
CORS(app)

LIGHT_THRESHOLD = 300
SOUND_THRESHOLD = 600
GAS_GOOD = 400
GAS_MEDIUM = 700

@app.route("/api/environment")
def environment():
    light, light_percent = sensors.read_light()
    sound = sensors.read_sound()
    gas = sensors.read_gas()

    if gas < GAS_GOOD:
        air_quality = "Bonne"
    elif gas < GAS_MEDIUM:
        air_quality = "Moyenne"
    else:
        air_quality = "Mauvaise"

    data = {
        "luminosite": light,
        "light_percent": light_percent,
        "niveau_sonore": sound,
        "qualite_air": air_quality,
        "light_threshold": LIGHT_THRESHOLD,
        "sound_threshold": SOUND_THRESHOLD
    }
    return jsonify(data)

@app.route("/api/led/on")
def led_on():
    actuators.led_on()
    return jsonify({"led":"on"})

@app.route("/api/led/off")
def led_off():
    actuators.led_off()
    return jsonify({"led":"off"})

@app.route("/api/buzzer/beep")
def buzzer_beep():
    actuators.beep()
    return jsonify({"buzzer":"beep"})

if __name__ == "__main__":
    print("API StudyBuddy lancée")
    app.run(host="0.0.0.0", port=5000, debug=True)
