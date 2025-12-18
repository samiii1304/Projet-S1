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

    # Interprétation du capteur de gaz
    if gas < 300:
        air_quality = "Bonne"
        air_percent = 85
    elif gas < 600:
        air_quality = "Moyenne"
        air_percent = 50
    else:
        air_quality = "Mauvaise"
        air_percent = 20

    data = {
        "luminosite": light,
        "light_percent": light_percent,
        "niveau_sonore": sound,
        "presence": bool(presence),

        # 🔥 AJOUTS ESSENTIELS
        "air_quality": air_quality,
        "air_percent": air_percent
    }

    return jsonify(data)

if __name__ == "__main__":
    print("✅ API StudyBuddy lancée")
    app.run(host="0.0.0.0", port=5000)
