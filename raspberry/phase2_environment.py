#Le code transforme ton Raspberry Pi + Grove HAT
#en station de surveillance d’environnement, capable de
#détecter la présence, mesurer la luminosité, analyser la qualité de l’air et répondre avec une LED
from grove.gpio import GPIO
from grove.adc import ADC
import time


PIR_PIN = 5       # D5
LED_PIN = 4       # D4
LIGHT_CH = 0      # A0
AIR_CH = 1        # A1

# Initialisation
pir = GPIO(PIR_PIN, GPIO.IN)
led = GPIO(LED_PIN, GPIO.OUT)
adc = ADC()   # pour les capteurs analogiques

def get_light():
    raw = adc.read(LIGHT_CH)
    # Conversion simple en luminosité (0–100%)
    percent = int((raw / 1023) * 100)
    return percent, raw

def get_air_quality():
    raw = adc.read(AIR_CH)
    # Le module renvoie une valeur analogique de 0 à 1023
    # On peut classifier comme ci-dessous :
    if raw < 50:
        quality = "Excellent"
    elif raw < 200:
        quality = "Bon"
    elif raw < 500:
        quality = "Moyen"
    elif raw < 800:
        quality = "Mauvais"
    else:
        quality = "Dangereux"
    return quality, raw

print("=== PHASE 2 : Test des capteurs (Lumière / Air / Présence) ===")

try:
    while True:
        movement = pir.read()
        light_pct, light_raw = get_light()
        air_status, air_raw = get_air_quality()

        print("----------")
        print(f"Mouvement : {'OUI' if movement else 'NON'}")
        print(f"Luminosité : {light_pct}%   (raw={light_raw})")
        print(f"Qualité de l’air : {air_status}   (raw={air_raw})")

        # Petite action visuelle : LED ON si mouvement + lumière faible
        if movement and light_pct < 30:
            led.write(1)
        else:
            led.write(0)

        time.sleep(1)

except KeyboardInterrupt:
    print("Arrêt.")
