from flask import Flask, jsonify
from flask_cors import CORS
import sensors
import actuators

app = Flask(__name__)
CORS(app)

@app.route("/api/environment")
def environment():
    # === CAPTEURS ===
    light, light_percent = sensors.read_light()
    sound = sensors.read_sound()
    presence = sensors.read_pir()

    # 🔥 LIGNE MANQUANTE CHEZ TOI
    gas = sensors.read_gas()   # valeur brute du capteur de gaz

    # === INTERPRÉTATION QUALITÉ DE L'AIR ===
    if gas < 300:
        air_quality = "Bonne"
        air_percent = 85
    elif gas < 600:
        air_quality = "Moyenne"
        air_percent = 50
    else:
        air_quality = "Mauvaise"
        air_percent = 20

    # === JSON FINAL ===
    data = {
        "luminosite": light,
        "light_percent": light_percent,
        "niveau_sonore": sound,
        "presence": bool(presence),

        # 🔥 AIR (IMPORTANT)
        "air_raw": gas,              # valeur brute (debug / futur)
        "air_percent": air_percent,  # pour la barre %
        "qualite_air": air_quality   # texte affiché
    }

    return jsonify(data)

if __name__ == "__main__":
    print("✅ API StudyBuddy lancée sur http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)

