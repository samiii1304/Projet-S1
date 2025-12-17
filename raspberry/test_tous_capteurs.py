#!/usr/bin/env python3
"""
TEST COMPLET DE TOUS LES CAPTEURS
Détecte et teste PIR, LED, Lumière, Qualité Air, Buzzer
"""
import RPi.GPIO as GPIO
import time
from grovepi import *
from grove.adc import ADC


# ==================== CONFIGURATION ====================
PIR_PIN = 2      # D2
LED_PIN = 5      # D5
BUZZER_PIN = 18  # GPIO18
LIGHT_CH = 1     # A1
AIR_CH = 0       # A0

# ==================== INITIALISATION ====================
print("Initialisation des capteurs...")

# Initialiser GPIO pour buzzer
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)

# Initialiser ADC pour capteurs analogiques
adc = ADC()

# Initialiser LED
try:
    from grove.grove_led import GroveLed
    led = GroveLed(LED_PIN)
    led_status = "✅"
except:
    led_status = "❌ (module non trouvé)"
    led = None

print(f"  - PIR (D2) : ✅")
print(f"  - LED (D5) : {led_status}")
print(f"  - ADC (A0/A1) : ✅")
print(f"  - Buzzer (GPIO18) : ✅")
print()

# ==================== TEST 1 : BUZZER ====================
print("Test du buzzer...")
try:
    GPIO.output(BUZZER_PIN, 1)
    time.sleep(0.3)
    GPIO.output(BUZZER_PIN, 0)
    print("  Buzzer fonctionnel (1 bip)")
except Exception as e:
    print(f"  Erreur buzzer: {e}")

time.sleep(0.5)

# ==================== TEST 2 : LED ====================
print("💡 Test de la LED...")
try:
    if led:
        led.on()
        print(" LED allumée")
        time.sleep(1)
        led.off()
        print(" LED éteinte")
    else:
        print("  LED non testée (module manquant)")
except Exception as e:
    print(f"  Erreur LED: {e}")

time.sleep(0.5)

# ==================== TEST 3 : CAPTEURS ANALOGIQUES ====================
print(" Test des capteurs analogiques...")
try:
    # Lire lumière
    light_val = adc.read(LIGHT_CH)
    light_percent = (light_val / 1023.0) * 100
    print(f"  - Lumière : {light_val} (ADC) = {light_percent:.1f}%")
    
    # Lire qualité air
    air_val = adc.read(AIR_CH)
    print(f"  - Qualité air : {air_val} (ADC)")
    
    # Interpréter qualité air
    if air_val < 50:
        air_status = " Excellent"
    elif air_val < 200:
        air_status = " Bon"
    elif air_val < 500:
        air_status = " Moyen"
    elif air_val < 800:
        air_status = "Mauvais"
    else:
        air_status = "Dangereux"
    
    print(f"  - Statut air : {air_status}")
    
except Exception as e:
    print(f" Erreur capteurs analogiques: {e}")

# ==================== TEST 4 : PIR (MOUVEMENT) ====================
print("👤 Test du capteur PIR (mouvement)...")
print("  ⏳ Attente de détection (bouge devant le capteur)")
print("  (Appuie sur Ctrl+C pour passer au test suivant)")

detection_count = 0
start_time = time.time()
timeout = 10  # 10 secondes max

try:
    while time.time() - start_time < timeout:
        try:
            pir_val = motion.read(PIR_PIN)
            if pir_val:
                detection_count += 1
                print(f"  Mouvement détecté ! ({detection_count}/3)")
                
                # Allumer LED et bip lors de détection
                if led:
                    led.on()
                GPIO.output(BUZZER_PIN, 1)
                time.sleep(0.1)
                GPIO.output(BUZZER_PIN, 0)
                time.sleep(0.1)
                if led:
                    led.off()
                
                if detection_count >= 3:
                    break
                    
            time.sleep(0.5)
            
        except IOError:
            print("  Erreur de lecture PIR")
            break
            
    if detection_count > 0:
        print(f" PIR fonctionnel ({detection_count} détections)")
    else:
        print(" Aucune détection - vérifie branchement")
        
except KeyboardInterrupt:
    print("  Test PIR sauté")
except Exception as e:
    print(f" Erreur PIR: {e}")

# ==================== TEST 5 : SURVEILLANCE EN CONTINU ====================
print()
print("=" * 60)
print("SURVEILLANCE EN TEMPS RÉEL (30 secondes)")
print("=" * 60)
print("Lecture toutes les 2 secondes :")
print("  MOUV | LUMIÈRE | AIR | ACTION")
print("-" * 60)

end_time = time.time() + 30  # 30 secondes de surveillance

try:
    while time.time() < end_time:
        # Lire tous les capteurs
        mouvement = "NON"
        try:
            if motion.read(PIR_PIN):
                mouvement = "OUI"
        except:
            mouvement = "ERR"
        
        try:
            lumière = adc.read(LIGHT_CH)
            lumière_pct = (lumière / 1023.0) * 100
        except:
            lumière = 0
            lumière_pct = 0
        
        try:
            air = adc.read(AIR_CH)
        except:
            air = 0
        
        # Déterminer l'action
        action = "..."
        if mouvement == "OUI" and lumière_pct < 30:
            action = " Allumer LED"
            if led:
                led.on()
        elif led:
            led.off()
            action = " LED éteinte"
        
        # Afficher
        print(f"  {mouvement:3s} | {lumière_pct:6.1f}% | {air:4d} | {action}")
        
        time.sleep(2)
        
except KeyboardInterrupt:
    print(" Surveillance arrêtée")
except Exception as e:
    print(f" Erreur surveillance: {e}")

# ==================== FIN ====================


# Nettoyage
try:
    if led:
        led.off()
    GPIO.output(BUZZER_PIN, 0)
    GPIO.cleanup()
    print(" Nettoyage GPIO effectué")
except:
    pass
