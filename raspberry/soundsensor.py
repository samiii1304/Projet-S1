import spidev
import time

# Configuration SPI pour MCP3008
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

SOUND_CHANNEL = 0  # Canal du capteur sonore
THRESHOLD = 400    # Seuil à ajuster selon ton environnement

def read_channel(channel):
    adc = spi.xfer2([1, (8+channel)<<4, 0])
    data = ((adc[1]&3) << 8) + adc[2]
    return data

try:
    while True:
        sound_value = read_channel(SOUND_CHANNEL)
        print("Niveau sonore :", sound_value)

        if sound_value > THRESHOLD:
            print("Attention : bruit trop élevé !")
        time.sleep(1)
except KeyboardInterrupt:
    spi.close()
    print("Programme arrêté")
