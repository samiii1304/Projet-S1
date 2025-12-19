# sensors.py
from grove.adc import ADC
adc = ADC()

# Channels
SOUND_CHANNEL = 0   # A0
GAS_CHANNEL = 2     # A2
LIGHT_CHANNEL = 6   # A6

def read_sound():
    return adc.read(SOUND_CHANNEL)

def read_gas():
    return adc.read(GAS_CHANNEL)

def read_light():
    value = adc.read(LIGHT_CHANNEL)
    light_percent = (value / 1023.0) * 100
    return value, round(light_percent,1)


