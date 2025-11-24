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
