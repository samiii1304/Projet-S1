from grove.grove_gas_sensor import GroveGas
import time

# Capteur branché sur A0
sensor = GroveGas(0)

print("Test du Grove Gas Sensor (CTRL+C pour arrêter)")

try:
    while True:
        gas_value = sensor.moisture  # ou sensor.value selon la version de la lib
        print("Valeur détectée :", gas_value)
        time.sleep(0.5)

except KeyboardInterrupt:
    print("Test arrêté")
