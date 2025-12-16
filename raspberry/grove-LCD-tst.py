import time
from grove.grove_rgb_lcd import *

# Afficher du texte
setText("Hello, Raspberry Pi!\nGrove LCD Test")

# Changer les couleurs du rétroéclairage
setRGB(255, 0, 0)  # Rouge
time.sleep(1)
setRGB(0, 255, 0)  # Vert
time.sleep(1)
setRGB(0, 0, 255)  # Bleu
time.sleep(1)

# Boucle pour dégradé
for i in range(0, 255, 5):
    setRGB(i, 255-i, i//2)
    time.sleep(0.05)
