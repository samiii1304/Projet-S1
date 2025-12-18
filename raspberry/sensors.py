# sensors.py
from grove.adc import ADC
from grove.gpio import GPIO
import time

adc = ADC()

# PIR
pir = GPIO(5, GPIO.IN)

# Channels
SOUND_CHANNEL = 0   # A0
GAS_CHANNEL = 2     # A2
LIGHT_CHANNEL =  6 # A1


def read_pir():
    return pir.read()


def read_sound():
    value = adc.read(SOUND_CHANNEL)
    return value


def read_gas():
    value = adc.read(GAS_CHANNEL)
    return value


def read_light():
    value = adc.read(LIGHT_CHANNEL)
    light_percent = (value / 1023.0) * 100
    return value, round(light_percent, 1)
