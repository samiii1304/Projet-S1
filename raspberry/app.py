from flask import Flask, jsonify
from flask_cors import CORS
import sensors
import actuators

app = Flask(__name__)
CORS(app)

@app.route("/api/environment")
def environment():
    light_raw, light_percent = sensors.read_light()
    sound = sensors.read_sound()
    gas = sensors.read_gas()
    presence = sensors.read_pir()

    # AIR QUALITY (conversion claire)
    if gas < 300:
        air_quality = "Bonne"
        air_percent = 85
    elif gas < 600:
        air_quality = "Moyenne"
        air_percent = 50
    else:
        air_quality = "Mauvaise"
        air_percent = 20

    # Alerte sonore
    if sound > 500:
        actuators.beep()

    return jsonify({
        "light_lux": light_raw,
        "light_percent": light_percent,
        "sound_db": sound,

        "air_quality": air_quality,
        "air_percent": air_percent,

        "presence": bool(presence)
    })

if __name__ == "__main__":
    print("✅ API StudyBuddy lancée")
    app.run(host="0.0.0.0", port=5000)
