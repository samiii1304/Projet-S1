#!/usr/bin/env python3
"""
TOUS LES CAPTEURS EN MÊME TEMPS
Lit et affiche les données de tous les capteurs simultanément
"""
import RPi.GPIO as GPIO
import time
import threading
from grovepi import *
from grove.adc import ADC

print("=" * 60)
print("TOUS LES CAPTEURS EN MÊME TEMPS")
print("=" * 60)
print("Lecture simultanée toutes les 2 secondes")
print("Appuyez sur Ctrl+C pour arrêter")
print("=" * 60)

# Configuration
PIR_PIN = 2       # D2 - Capteur mouvement
LED_PIN = 5       # D5 - LED  
BUZZER_PIN = 18   # GPIO18 - Buzzer
LIGHT_CH = 1      # A1 - Capteur lumière
AIR_CH = 0        # A0 - Capteur qualité air
# SOUND_CH = 0    # A2 - Capteur son (si tu l'as)

# Initialisation
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)
GPIO.output(BUZZER_PIN, 0)

adc = ADC()

# Essayer d'importer la LED
try:
    from grove.grove_led import GroveLed
    led = GroveLed(LED_PIN)
    LED_DISPONIBLE = True
except:
    led = None
    LED_DISPONIBLE = False

# Variables partagées entre les threads
donnees_globales = {
    'mouvement': False,
    'lumiere': 0,
    'lumiere_pct': 0,
    'air': 0,
    'air_status': "INCONNU",
    'led_allumee': False
}

lock = threading.Lock()  # Pour synchroniser l'accès aux données

def lire_pir():
    """Lit le capteur PIR (mouvement) en continu"""
    while True:
        try:
            mouvement = motion.read(PIR_PIN)
            with lock:
                donnees_globales['mouvement'] = mouvement
            time.sleep(0.1)  # Lecture rapide pour réactivité
        except:
            time.sleep(0.5)

def lire_lumiere():
    """Lit le capteur de lumière en continu"""
    while True:
        try:
            raw = adc.read(LIGHT_CH)
            pct = (raw / 1023.0) * 100
            with lock:
                donnees_globales['lumiere'] = raw
                donnees_globales['lumiere_pct'] = pct
            time.sleep(0.5)  # Lecture moins fréquente
        except:
            time.sleep(1)

def lire_air():
    """Lit le capteur de qualité d'air en continu"""
    while True:
        try:
            raw = adc.read(AIR_CH)
            
            # Interprétation
            if raw < 50:
                status = "EXCELLENT"
            elif raw < 200:
                status = "BON"
            elif raw < 500:
                status = "MOYEN"
            elif raw < 800:
                status = "MAUVAIS"
            else:
                status = "DANGEREUX"
            
            with lock:
                donnees_globales['air'] = raw
                donnees_globales['air_status'] = status
            time.sleep(0.5)
        except:
            time.sleep(1)

def gestion_led():
    """Gère la LED en fonction des capteurs"""
    while True:
        try:
            with lock:
                mouvement = donnees_globales['mouvement']
                lumiere_pct = donnees_globales['lumiere_pct']
            
            if LED_DISPONIBLE:
                # Allumer LED si mouvement ET lumière faible
                if mouvement and lumiere_pct < 30:
                    if not donnees_globales['led_allumee']:
                        led.on()
                        donnees_globales['led_allumee'] = True
                        print("  -> LED allumée (mouvement + lumière faible)")
                else:
                    if donnees_globales['led_allumee']:
                        led.off()
                        donnees_globales['led_allumee'] = False
            
            time.sleep(0.3)
        except:
            time.sleep(1)

def gestion_buzzer():
    """Gère le buzzer en fonction des événements"""
    dernier_mouvement_time = 0
    
    while True:
        try:
            with lock:
                mouvement = donnees_globales['mouvement']
                air = donnees_globales['air']
            
            maintenant = time.time()
            
            # Bip sur détection de mouvement (pas plus d'un bip toutes les 5s)
            if mouvement and (maintenant - dernier_mouvement_time > 5):
                GPIO.output(BUZZER_PIN, 1)
                time.sleep(0.05)
                GPIO.output(BUZZER_PIN, 0)
                dernier_mouvement_time = maintenant
                print("  -> Bip (mouvement détecté)")
            
            # Bip d'alerte si air mauvais (toutes les 10s)
            if air > 500 and int(maintenant) % 10 == 0:
                for _ in range(3):
                    GPIO.output(BUZZER_PIN, 1)
                    time.sleep(0.1)
                    GPIO.output(BUZZER_PIN, 0)
                    time.sleep(0.1)
                print("  -> Bip d'alerte (air dégradé)")
            
            time.sleep(0.2)
        except:
            time.sleep(1)

def affichage_principal():
    """Affiche les données de tous les capteurs"""
    compteur = 0
    
    print("\nDÉMARRAGE DE LA SURVEILLANCE SIMULTANÉE")
    print("-" * 60)
    print(" Format: [MOUV] LUMIÈRE  QUALITÉ AIR")
    print("         OUI/NON   XX%      VALEUR (STATUT)")
    print("-" * 60)
    
    # Bip de démarrage
    for _ in range(2):
        GPIO.output(BUZZER_PIN, 1)
        time.sleep(0.1)
        GPIO.output(BUZZER_PIN, 0)
        time.sleep(0.1)
    
    try:
        while True:
            with lock:
                mouvement = donnees_globales['mouvement']
                lumiere_pct = donnees_globales['lumiere_pct']
                air = donnees_globales['air']
                air_status = donnees_globales['air_status']
                led_allumee = donnees_globales['led_allumee']
            
            compteur += 1
            
            # Afficher les données
            print(f"\n[{compteur}] {time.strftime('%H:%M:%S')}")
            print(f"  Mouvement: {'OUI' if mouvement else 'NON'}")
            print(f"  Lumière: {lumiere_pct:.1f}%")
            print(f"  Air: {air} ({air_status})")
            print(f"  LED: {'ALLUMÉE' if led_allumee else 'ÉTEINTE'}")
            
            # Afficher les alertes
            alertes = []
            if lumiere_pct < 30:
                alertes.append("LUMIÈRE FAIBLE")
            if air > 500:
                alertes.append("AIR DÉGRADÉ")
            
            if alertes:
                print(f"  ! ALERTES: {', '.join(alertes)}")
            
            print("-" * 40)
            
            time.sleep(2)  # Affichage toutes les 2 secondes
            
    except KeyboardInterrupt:
        print("\nArrêt demandé...")

# Démarrer tous les threads
try:
    print("Démarrage des threads de lecture...")
    
    # Créer les threads
    thread_pir = threading.Thread(target=lire_pir, daemon=True)
    thread_lumiere = threading.Thread(target=lire_lumiere, daemon=True)
    thread_air = threading.Thread(target=lire_air, daemon=True)
    thread_led = threading.Thread(target=gestion_led, daemon=True)
    thread_buzzer = threading.Thread(target=gestion_buzzer, daemon=True)
    
    # Démarrer les threads
    thread_pir.start()
    thread_lumiere.start()
    thread_air.start()
    thread_led.start()
    thread_buzzer.start()
    
    print(f"Threads démarrés: 5/5")
    print("- PIR (mouvement)")
    print("- Lumière")
    print("- Qualité air")
    print("- Gestion LED")
    print("- Gestion buzzer")
    print()
    
    # Lancer l'affichage principal (bloquant)
    affichage_principal()
    
except KeyboardInterrupt:
    print("\nArrêt du programme...")

except Exception as e:
    print(f"\nErreur: {e}")

finally:
    # Nettoyage
    print("\nNettoyage...")
    try:
        if LED_DISPONIBLE:
            led.off()
        GPIO.output(BUZZER_PIN, 0)
        GPIO.cleanup()
        print("GPIO nettoyé")
    except:
        pass
    
    print("\n" + "=" * 60)
    print("PROGRAMME TERMINÉ")
    print("=" * 60)
