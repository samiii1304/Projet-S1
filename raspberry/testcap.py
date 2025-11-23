#buzzer qui bip une fois
import RPi.GPIO as GPIO
import time

BUZZER = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER, GPIO.OUT)

GPIO.output(BUZZER, 1)
time.sleep(0.5)
GPIO.output(BUZZER, 0)

GPIO.cleanup()

#pir qui met en enchainé "detection mouvement" quand quelqu'un est la et si personne est la break du code
import time
from grovepi import motion
# Port digital où le PIR est connecté
pir_sensor = 2  # D2 sur Grove Hat
while True:
    try:
        # Lire l'état du capteur
        pir_val = motion.read(pir_sensor)
        if pir_val:
            print("Mouvement détecté !")
        else:
            print("Rien...")
        time.sleep(0.5)
    except KeyboardInterrupt:
        print("Programme arrêté")
        break
    except IOError:
        print("Erreur capteur")


