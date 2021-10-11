import paho.mqtt.client as paho
import json

class Light:    
    ID = 3
    state = False
    brightness = 0
    colour = {'red': 0, 'green': 0, 'blue': 0}
    def __iter__(self):
        return iter(self.ID, self.state, self.brightness, self.colour)  
    def get(self):
        light = {
            'ID': self.ID,
            'state': self.state,
            'brightness':self.brightness,
            'colour':self.colour
        }
        return light

def on_message(client, userdate, msg ):
    msg = str(msg.payload).strip("'")
    msg = msg.strip("b'")
    res = json.loads(msg)
    if light.ID == int(res["ID"]):
        if res["state"] == "true" or res["state"] == True:
            light.state = True  
        else:
            light.state = False
        light.brightness = res["brightness"]
        light.colour = res["colour"]
        print(light.get())
    else: return

light = Light()
def main():
    
    client = paho.Client()
    client.connect("broker.mqttdashboard.com", 1883)
    client.on_message = on_message
    client.subscribe("/updateLight", qos=1)
    client.loop_forever()
    

    
if __name__=="__main__":
    main()

