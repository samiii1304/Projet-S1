from grove.adc import ADC
import time

adc = ADC()

GAS_CHANNEL = 0  # A0

while True:
    gas_value = adc.read(GAS_CHANNEL)
    print(f"Valeur gaz : {gas_value}")
    time.sleep(1)
