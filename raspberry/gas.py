from grove.adc import ADC
import time

adc = ADC()
CHANNEL = 0  # A0

print("🔥 Chauffe du capteur MQ-2 (60 secondes)...")
time.sleep(60)

print("📡 Lecture du capteur MQ-2\n")

while True:
    value = adc.read(CHANNEL)
    print("Valeur gaz :", value)
    time.sleep(1)
