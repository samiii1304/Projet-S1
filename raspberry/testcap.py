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


#led
from grove.grove_led import GroveLed
from time import sleep

# Remplacez D5 par le port que vous utilisez
led = GroveLed(5)

# Allumer la LED
led.on()
sleep(5)  # La LED reste allumée 5 secondes

# Éteindre la LED
led.off()

#sound senor
from grove.adc import ADC
import time

adc = ADC()

# D18 correspond au canal 2 sur le Grove Base HAT
CHANNEL = 0

print("Test du Grove Sound Sensor (Ctrl+C pour arrêter)")

while True:
    value = adc.read(CHANNEL)
    print("Niveau sonore :", value)
    time.sleep(0.5)

#gaz sensor
from grove.adc import ADC
import time

adc = ADC()
CHANNEL = 0  # A0

print("🔥 Chauffe du capteur MQ-2 (60 secondes)...")
time.sleep(60)

print("📡 Lecture du capteur MQ-2\n")

while True:
    value = adc.read(CHANNEL)
    print("Valeur gaz :", value)
    time.sleep(1)

#light sensor
from grove.adc import ADC
import time

adc = ADC()
CHANNEL = 1  # A1 pour le capteur de lumière

print("💡 Lecture du capteur de lumière\n")

while True:
    value = adc.read(CHANNEL)   # 0-1023
    voltage = value / 1023.0 * 3.3  # tension en V

    # Optionnel : normaliser en pourcentage de lumière
    light_percent = (value / 1023.0) * 100

    print(f"💡 ADC: {value}, Tension: {voltage:.2f} V, Luminosité: {light_percent:.1f}%")
    time.sleep(1)

