import RPi.GPIO as GPIO
import time

BUZZER = 18  # GPIO du buzzer

# Setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER, GPIO.OUT)

pwm = GPIO.PWM(BUZZER, 440)  # fréquence initiale

def bip(frequency, duration):
    """Fait un bip à une fréquence donnée pendant une durée (s)"""
    pwm.ChangeFrequency(frequency)
    pwm.start(50)  # duty cycle 50%
    time.sleep(duration)
    pwm.stop()
    time.sleep(0.05)  # petite pause entre les bips

print("🚀 Début de la session de travail !")

try:
    # 3 petits bips rapides
    for _ in range(3):
        bip(600, 0.1)

    # bip final plus long et plus doux
    bip(450, 0.6)

finally:
    GPIO.cleanup()
    print("Jingle terminé 🎉")
