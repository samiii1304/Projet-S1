#!/usr/bin/env python3
"""
DEBUT DE SESSION STUDYBUDDY+
- Detecte la presence
- Verifie l'environnement
- Lance la session Pomodoro
- Jingle de debut
- Allume la LED
- Enregistre en base de donnees
"""
import RPi.GPIO as GPIO
import time
import sqlite3
from datetime import datetime
from grovepi import *
from grove.adc import ADC

print("=" * 60)
print("STUDYBUDDY+ - DEBUT DE SESSION")
print("=" * 60)

# ==================== CONFIGURATION ====================
PIR_PIN = 2       # D2 - Capteur mouvement
LED_PIN = 5       # D5 - LED
BUZZER_PIN = 18   # GPIO18 - Buzzer
LIGHT_CH = 1      # A1 - Capteur lumiere
AIR_CH = 0        # A0 - Capteur qualite air

# Seuils
LIGHT_THRESHOLD = 30      # 30% minimum de luminosite
AIR_THRESHOLD = 500       # Seuil qualite air
WAIT_TIME = 3             # Attente avant debut (secondes)

# ==================== INITIALISATION ====================
print("Initialisation...")

# GPIO pour buzzer
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)

# LED
try:
    from grove.grove_led import GroveLed
    led = GroveLed(LED_PIN)
    LED_OK = True
except:
    print("Erreur: Module LED non trouve")
    LED_OK = False

# ADC pour capteurs analogiques
adc = ADC()

# Base de donnees
DB_FILE = "sessions.db"

def init_db():
    """Initialise la base de donnees"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS sessions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date_debut DATETIME,
                  duree_prevue INTEGER,
                  luminosite INTEGER,
                  qualite_air INTEGER,
                  conditions_ok BOOLEAN)''')
    conn.commit()
    conn.close()
    print("Base de donnees initialisee")

# ==================== FONCTIONS ====================

def lire_lumiere():
    """Lit le capteur de lumiere"""
    try:
        raw = adc.read(LIGHT_CH)
        pourcent = (raw / 1023.0) * 100
        return pourcent, raw
    except:
        return 0, 0

def lire_qualite_air():
    """Lit le capteur MQ-2"""
    try:
        raw = adc.read(AIR_CH)
        return raw
    except:
        return 0

def jingle_debut():
    """Jingle sonore pour debut de session"""
    try:
        pwm = GPIO.PWM(BUZZER_PIN, 440)
        
        # Sequence de 3 bips ascendants
        pwm.start(50)
        for freq in [440, 523, 659]:
            pwm.ChangeFrequency(freq)
            time.sleep(0.15)
        
        # Bip final
        pwm.ChangeFrequency(784)
        time.sleep(0.3)
        pwm.stop()
        
        print("Jingle de debut joue")
    except:
        print("Erreur: Impossible de jouer le jingle")

def verifier_environnement():
    """Verifie si les conditions sont bonnes pour etudier"""
    print("\nVerification de l'environnement...")
    
    # Lire capteurs
    lumiere_pct, lumiere_raw = lire_lumiere()
    air_raw = lire_qualite_air()
    
    print(f"  - Lumiere: {lumiere_pct:.1f}% (seuil: {LIGHT_THRESHOLD}%)")
    print(f"  - Qualite air: {air_raw} (seuil: <{AIR_THRESHOLD})")
    
    # Verifier conditions
    conditions_ok = True
    avertissements = []
    
    if lumiere_pct < LIGHT_THRESHOLD:
        avertissements.append(f"Lumiere insuffisante ({lumiere_pct:.1f}%)")
        conditions_ok = False
    
    if air_raw > AIR_THRESHOLD:
        avertissements.append(f"Qualite d'air degradee ({air_raw})")
        conditions_ok = False
    
    # Afficher resultats
    if conditions_ok:
        print("  -> Environnement: BON")
    else:
        print("  -> Environnement: PROBLEME")
        for avert in avertissements:
            print(f"     ! {avert}")
    
    return conditions_ok, lumiere_raw, air_raw

def attendre_presence():
    """Attend que l'utilisateur soit present"""
    print("\nEn attente de presence...")
    print("Asseyez-vous devant le bureau")
    
    detection_count = 0
    needed_detections = 2
    
    while detection_count < needed_detections:
        try:
            if motion.read(PIR_PIN):
                detection_count += 1
                print(f"  Presence detectee ({detection_count}/{needed_detections})")
                
                # Feedback visuel
                if LED_OK:
                    led.on()
                    time.sleep(0.2)
                    led.off()
                
                # Petit bip
                GPIO.output(BUZZER_PIN, 1)
                time.sleep(0.05)
                GPIO.output(BUZZER_PIN, 0)
                
            time.sleep(0.5)
            
        except KeyboardInterrupt:
            print("\nAnnulation")
            return False
        except:
            print("Erreur lecture PIR")
            time.sleep(1)
    
    print("Presence confirmee")
    return True

def demarrer_session():
    """Procedure complete de demarrage de session"""
    print("\n" + "=" * 60)
    print("DEBUT DE SESSION")
    print("=" * 60)
    
    # 1. Attendre presence
    if not attendre_presence():
        return False
    
    # 2. Verifier environnement
    conditions_ok, lumiere, air = verifier_environnement()
    
    if not conditions_ok:
        print("\nConditions environnementales non optimales.")
        print("Corrigez les problemes avant de continuer.")
        return False
    
    # 3. Compte a rebours
    print(f"\nDebut de session dans {WAIT_TIME} secondes...")
    for i in range(WAIT_TIME, 0, -1):
        print(f"  {i}...")
        
        # Clignoter LED
        if LED_OK:
            led.on() if i % 2 == 0 else led.off()
        
        # Bip court
        GPIO.output(BUZZER_PIN, 1)
        time.sleep(0.05)
        GPIO.output(BUZZER_PIN, 0)
        
        time.sleep(1)
    
    # 4. Demarrage effectif
    print("\nDEMARRAGE !")
    
    # Allumer LED
    if LED_OK:
        led.on()
    
    # Jingle de debut
    jingle_debut()
    
    # Enregistrer en base
    enregistrer_session(lumiere, air, conditions_ok)
    
    # Afficher message
    print("\n" + "*" * 60)
    print("SESSION EN COURS")
    print("*" * 60)
    print("Travaillez pendant 25 minutes")
    print("La LED reste allumee pendant la session")
    print("Pause automatique dans 25 minutes")
    print("*" * 60)
    
    return True

def enregistrer_session(lumiere, air, conditions_ok):
    """Enregistre la session dans la base de donnees"""
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        
        c.execute('''INSERT INTO sessions 
                     (date_debut, duree_prevue, luminosite, qualite_air, conditions_ok)
                     VALUES (?, ?, ?, ?, ?)''',
                  (datetime.now(), 25, lumiere, air, conditions_ok))
        
        conn.commit()
        conn.close()
        
        print("Session enregistree dans la base de donnees")
        
    except Exception as e:
        print(f"Erreur enregistrement base: {e}")

def nettoyer():
    """Nettoyage GPIO"""
    if LED_OK:
        led.off()
    GPIO.output(BUZZER_PIN, 0)
    GPIO.cleanup()
    print("GPIO nettoye")

# ==================== MAIN ====================

if __name__ == "__main__":
    try:
        # Initialiser
        init_db()
        
        print("\nSysteme pret")
        print("Appuyez sur Ctrl+C pour quitter")
        print("-" * 60)
        
        # Boucle principale
        while True:
            commande = input("\nAppuyez sur Entree pour demarrer une session (ou 'q' pour quitter): ")
            
            if commande.lower() == 'q':
                print("Au revoir!")
                break
            
            # Demarrer une session
            if demarrer_session():
                print("\nSession en cours...")
                print("Pour arreter, appuyez sur Ctrl+C")
                print("-" * 60)
                
                # Simuler session de 25 minutes (pour test)
                # En vrai, tu integrerais le timer Pomodoro ici
                try:
                    for minute in range(25):
                        print(f"  {minute+1}/25 minutes ecoulees")
                        time.sleep(60)  # 1 minute pour test
                    
                    print("\nSession terminee! Prenez une pause de 5 minutes.")
                    
                except KeyboardInterrupt:
                    print("\nSession interrompue")
            
            else:
                print("Demarrage annule")
            
            # Eteindre LED entre les sessions
            if LED_OK:
                led.off()
        
    except KeyboardInterrupt:
        print("\n\nProgramme arrete par l'utilisateur")
    
    except Exception as e:
        print(f"\nErreur: {e}")
    
    finally:
        nettoyer()
