from threading import Thread
import paho.mqtt.client as paho
import json
import csv

class Switch:    
    ID = 1
    state = False
    brightness = 0
    colour = {'red': 0, 'green': 0, 'blue': 0}
    lightsIDs = []
    def __iter__(self):
        return iter(self.ID, self.state, self.brightness, self.colour, self.lightsIDs) 
    def get(self):
        switch = {
            'ID': self.ID,
            'state': self.state,
            'brightness':self.brightness,
            'colour':self.colour,
            'lightsIDs':self.lightsIDs
        }
        return switch

def user_input(client, switch):
    while(True):
        if not switch.state:
            action = input('Type "ON" to turn the light on:   ')
            if action == '':continue
            if switch.state: continue
            if action == "ON":
                switch.state = True
                switch.brightness = 1
                print(switch.get())
                print("The light in now on.")
                
                msg = str(json.dumps(switch.get()))
                client.publish("/switchUpdate", msg, qos=1)
            else: continue
        elif switch.state:
            print("Please select an option: \n1) Turn off the light.\n2) Change brightness. \n3) Change colour.")
            option = input("Enter 1, 2 or 3:    ")
            if not switch.state: continue
            option = int(option)

            if option == '':continue
            elif option == 1:
                action = input('Type "OFF" to turn the light off:   ')
                if not switch.state: continue
                if action == '':continue
                if action == "OFF":
                    switch.state = False
                    switch.brightness = 0
                    colour = {'red': 0, 'green': 0, 'blue': 0}
                    print("The light is now off.")
                    msg = str(json.dumps(switch.get()))
                    client.publish("/switchUpdate", msg, qos=1)
                else: continue
            elif option == 2:
                action = input('Enter a value between 1.0 and 0.1 to change the brightness:   ')
                if not switch.state: continue
                if action == '':continue
                if float(action) > 0.1 and float(action) < 1:
                    switch.brightness = switch.brightness * float(action)
                    print("The brightness is now %d percent." % (switch.brightness * 100))
                    msg = str(json.dumps(switch.get()))
                    client.publish("/switchUpdate", msg, qos=1)
                else: continue
            elif option == 3:
                RED = input('Enter a value between 0 and 255 for RED:    ')
                if not switch.state: continue
                GREEN = input('Enter a value between 0 and 255 for GREEN:    ')
                if not switch.state: continue
                BLUE = input('Enter a value between 0 and 255 for BLUE:    ')
                if not switch.state: continue
                RED = int(RED)
                GREEN = int(GREEN)
                BLUE = int(BLUE)
                if RED == '' or GREEN == '' or BLUE == '':continue
                if 0 < RED < 256 and 0 < GREEN < 256 and 0 < BLUE < 256:
                    switch.colour['red'] = RED
                    switch.colour['green'] = GREEN
                    switch.colour['blue'] = BLUE
                    print(switch.colour)
                    msg = str(json.dumps(switch.get()))
                    client.publish("/switchUpdate", msg, qos=1)
                else:continue
            else: continue

def on_message(client, userdate, msg ):
    msg = str(msg.payload).strip("'")
    msg = msg.strip("b'")
    res = json.loads(msg)
    if switch.ID == int(res["ID"]):
        switch.state = True if res["state"] == "true" else False
        switch.brightness = res["brightness"]
        switch.colour = res["colour"]
        switch.lightsIDs = res["lightsIDs"]
        with open('lights.csv', mode ='w') as file:   
            writer = csv.writer(file)
            
            for id in switch.lightsIDs:
                writer.writerow([id])
        
        #print(switch.get())
    else: return

switch = Switch()


def updateLightsList():
    with open('lights.csv', mode ='r') as file:   
        csvFile = csv.reader(file)
        for lines in csvFile:
            switch.lightsIDs.append(int(lines[0]))
    # msg = str(json.dumps(switch.get()))
    # client.publish("/switchUpdate", msg, qos=1)
updateLightsList()




def main():
    client = paho.Client()
    client.connect("broker.mqttdashboard.com", 1883)
    client.on_message = on_message
    client.subscribe("/updateSwitch", qos=1)
    client.loop_start()

    #thread_updateLights = Thread(target=updateLightsList, args=(client, switch))
    #thread_updateLights.start()
    
    thread_user_input = Thread(target=user_input, args=(client, switch))
    thread_user_input.start()
    

if __name__=="__main__":
    main()


    