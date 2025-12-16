from grove.adc import ADC
import time

adc = ADC()
GAS_CHANNEL = 0  # A0

print("🔥 Chauffe du capteur MQ-5 (90 secondes)...")
time.sleep(90)

print("✅ Lecture du capteur MQ-5\n")

while True:
    gas_value = adc.read(GAS_CHANNEL)

    if gas_value < 200:
        status = "AIR PROPRE"
    elif gas_value < 500:
        status = "AIR MOYEN"
    else:
        status = "AIR POLLUÉ"

    print(f"MQ-5 valeur : {gas_value} → {status}")

    if gas_value >= 500:
        print("⚠️ Conseil : aérez la pièce")

    time.sleep(2)
