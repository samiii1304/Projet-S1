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



#quand mouvement detecté, led s'allume!
from grove.gpio import GPIO
import time

PIR_PIN = 5   # D5
LED_PIN = 4   # D4

pir = GPIO(PIR_PIN, GPIO.IN)
led = GPIO(LED_PIN, GPIO.OUT)

print("=== Test PIR + LED (Grove HAT) ===")
print("Attente initialisation PIR...")
time.sleep(2)

try:
    while True:
        if pir.read():
            print("MOUVEMENT DÉTECTÉ")
            led.write(1)
        else:
            led.write(0)
        time.sleep(0.1)

except KeyboardInterrupt:
    print("Arrêt.")


