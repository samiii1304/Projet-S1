import RPi.GPIO as GPIO
import time

BUZZER = 18  # GPIO du buzzer

# Setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER, GPIO.OUT)

pwm = GPIO.PWM(BUZZER, 440)  # fréquence 440 Hz

try:
    pwm.start(50)        # duty cycle 50%
    time.sleep(0.5)      # bip pendant 0,5 seconde
    pwm.stop()

finally:
    GPIO.cleanup()
    print("Test du buzzer terminé ✅")
