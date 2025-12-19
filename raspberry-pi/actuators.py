# actuators.py
import RPi.GPIO as GPIO
import time
from grove.grove_led import GroveLed

# Buzzer
BUZZER = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER, GPIO.OUT)

# LED
led = GroveLed(16)

def beep(times=1, duration=0.2, pause=0.1):
    """Fait bipper le buzzer plusieurs fois"""
    for _ in range(times):
        GPIO.output(BUZZER, 1)
        time.sleep(duration)
        GPIO.output(BUZZER, 0)
        time.sleep(pause)

def led_on():
    led.on()

def led_off():
    led.off()

