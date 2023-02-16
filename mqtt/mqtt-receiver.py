import paho.mqtt.client as mqtt
import json
from pymongo import MongoClient

uri='mongodb+srv://karthick:karthick6@cluster0.jjghc.mongodb.net/modem?retryWrites=true&w=majority'
client = MongoClient(uri)

db = client['modem']

# Callback for when the client receives a CONNACK response from the server
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("sensor/modem")

# Callback for when a PUBLISH message is received from the server
def on_message(client, userdata, msg):
    parsedData=json.loads(msg.payload)
    
    device=parsedData["device"]
    network=parsedData["network"]
    servingcell=parsedData["servingcell"]
    neighbourcell=parsedData["neighbourcell"]
    gps=parsedData["gps"]

    deviceDb = db["device"]
    networkDb = db["network"]
    servingcellDb = db["servingcell"]
    neighbourcellDb = db["neighbourcell"]
    gpsDb = db["gps"]

    findData=deviceDb.find_one({"imei": device["imei"] })

    if(findData):
        deviceId = findData["_id"]
        del findData['_id']
        
        dataInsert=deviceDb.update_one({"_id": deviceId},{"$set":device})
        network["deviceId"]=deviceId
        servingcell["deviceId"]=deviceId
        neighbourcell["deviceId"]=deviceId
        gps["deviceId"]=deviceId

        networkDb.insert_one(network)
        servingcellDb.insert_one(servingcell)
        neighbourcellDb.insert_one(neighbourcell)
        gpsDb.insert_one(gps)
        
    else:
        dataInsert=deviceDb.insert_one(device)
        deviceId = dataInsert.inserted_id

        network["deviceId"]=deviceId
        servingcell["deviceId"]=deviceId
        neighbourcell["deviceId"]=deviceId
        gps["deviceId"]=deviceId

        networkDb.insert_one(network)
        servingcellDb.insert_one(servingcell)
        neighbourcellDb.insert_one(neighbourcell)
        gpsDb.insert_one(gps)

# Create a MQTT client instance
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to the MQTT broker
client.connect("localhost", 1883, 60)

# Start the client loop to receive messages
client.loop_forever()