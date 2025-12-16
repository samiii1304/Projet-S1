from grove.grove_base_hat import GroveBaseHat
import time

# Initialisation du Grove Base HAT
hat = GroveBaseHat()

# Canal analogique utilisé pour le capteur sonore
SOUND_PIN = 'A0'

# Seuil pour détecter bruit élevé
THRESHOLD = 400  # à ajuster selon ton environnement

try:
    while True:
        sound_value = hat.analogRead(SOUND_PIN)
        print("Niveau sonore:", sound_value)

        if sound_value > THRESHOLD:
            print("Attention : bruit trop élevé !")
        else:
            print("Niveau sonore normal.")

        time.sleep(1)  # lecture toutes les secondes
except KeyboardInterrupt:
    print("Programme arrêté")
