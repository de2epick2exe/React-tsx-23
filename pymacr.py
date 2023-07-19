import pyautogui    #these are for our clicks and keyboard strokes!
import time         #required to call any time commands (i.e. delays)

time.sleep(1)
print(pyautogui.position())

pyautogui.click(2352, 205)
while True:
    pyautogui.keyDown(']')
#