from grove.adc import ADC
import time

adc = ADC()

# D18 correspond au canal 2 sur le Grove Base HAT
CHANNEL = 2

print("Test du Grove Sound Sensor (Ctrl+C pour arrêter)")

while True:
    value = adc.read(CHANNEL)
    print("Niveau sonore :", value)
    time.sleep(0.5)

