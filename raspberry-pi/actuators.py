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


def beep():
    GPIO.output(BUZZER, 1)
    time.sleep(0.5)
    GPIO.output(BUZZER, 0)


def led_on():
    led.on()


def led_off():
    led.off()
