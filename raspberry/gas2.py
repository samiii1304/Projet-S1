from grove.adc import ADC
import time

adc = ADC()

while True:
    print("A0 =", adc.read(0),
          "A1 =", adc.read(1),
          "A2 =", adc.read(2),
          "A3 =", adc.read(3))
    print("-----")
    time.sleep(2)

