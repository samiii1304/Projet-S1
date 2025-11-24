"""
Ce que fait exactement ce code
détecte si tu es présent
 démarre une session automatiquement
 allume la LED pendant l’étude
 fait une pause automatique (Pomodoro)
 lit les capteurs régulièrement
coupe la session si tu t’en vas
revient à IDLE proprement"""

from grove.gpio import GPIO
from grove.adc import ADC
import time

# ---------------------------
# CONFIGURATION
# ---------------------------
PIR_PIN = 5
LED_PIN = 4
LIGHT_CH = 0
AIR_CH = 1

STUDY_DURATION = 25 * 60   # 25 minutes
BREAK_DURATION = 5 * 60    # 5 minutes
ABSENCE_TIMEOUT = 15       # 15 sec
SENSOR_INTERVAL = 5        # lire capteurs toutes les 5 sec


# ---------------------------
# INITIALISATION
# ---------------------------
pir = GPIO(PIR_PIN, GPIO.IN)
led = GPIO(LED_PIN, GPIO.OUT)
adc = ADC()

def get_light():
    raw = adc.read(LIGHT_CH)
    return int((raw / 1023) * 100)

def get_air_quality():
    raw = adc.read(AIR_CH)
    return raw

# ---------------------------
# MACHINE À ÉTATS
# ---------------------------
STATE = "IDLE"
last_presence_time = time.time()
session_start = 0

print("=== PHASE 3 : Gestion des sessions ===")

try:
    while True:
        presence = pir.read()
        now = time.time()

        # -------------------------
        # Gestion de la présence
        # -------------------------
        if presence:
            last_presence_time = now

        # -------------------------
        # LOGIQUE DES ÉTATS
        -------------------------
        if STATE == "IDLE":
            led.write(0)
            if presence:
                print("→ READY (présence détectée)")
                STATE = "READY"

        elif STATE == "READY":
            led.write(0)
            if now - last_presence_time > ABSENCE_TIMEOUT:
                print("Absence → retour IDLE")
                STATE = "IDLE"
            else:
                # démarrer automatiquement une session
                print("→ STUDY (session lancée)")
                session_start = now
                STATE = "STUDY"
                led.write(1)

        elif STATE == "STUDY":
            if now - session_start >= STUDY_DURATION:
                print("Fin période d'étude → BREAK")
                STATE = "BREAK"
                led.write(0)
                break_start = now

            # perte de présence
            if now - last_presence_time > ABSENCE_TIMEOUT:
                print("Utilisateur absent → END")
                STATE = "END"

            # lire capteurs à intervalle régulier
            if int(now) % SENSOR_INTERVAL == 0:
                print(f"[STUDY] Light={get_light()}%  Air={get_air_quality()}")

        elif STATE == "BREAK":
            led.write(0)
            if now - break_start >= BREAK_DURATION:
                print("Fin pause → retour STUDY")
                led.write(1)
                session_start = now
                STATE = "STUDY"

        elif STATE == "END":
            led.write(0)
            print("Session terminée. Retour IDLE.")
            STATE = "IDLE"

        time.sleep(0.2)

except KeyboardInterrupt:
    print("Arrêt.")
