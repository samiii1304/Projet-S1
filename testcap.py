import RPi.GPIO as GPIO
import time

LED = 17
BUZZER = 18
PIR = 23

GPIO.setmode(GPIO.BCM)

GPIO.setup(LED, GPIO.OUT)
GPIO.setup(BUZZER, GPIO.OUT)
GPIO.setup(PIR, GPIO.IN)

print("TEST LED")
GPIO.output(LED, True)
time.sleep(0.5)
GPIO.output(LED, False)
time.sleep(0.5)

print("TEST BUZZER ")
GPIO.output(BUZZER, True)
time.sleep(0.3)
GPIO.output(BUZZER, False)
time.sleep(0.3)

print("TEST PIR ")
print("En attente d'un mouvement")

try:
    while True:
        mouvement = GPIO.input(PIR)
        if mouvement == 1:
            print("mouvement détecté !")
            GPIO.output(LED, True)
            GPIO.output(BUZZER, True)
            time.sleep(1)
            GPIO.output(LED, False)
            GPIO.output(BUZZER, False)
        time.sleep(0.1)

except KeyboardInterrupt:
    pass

finally:
    GPIO.cleanup()
