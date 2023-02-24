import serial
import time
import logging
import datetime
import json
import sqlite3

import os
import sys
import paho.mqtt.client as mqtt
import random

THINGSBOARD_HOST = 'demo.thingsboard.io'
ACCESS_TOKEN = '8610017133'

# Data capture and upload interval in seconds. Less interval will eventually hang the DHT22.
INTERVAL=1

sensor_data = {'temperature': 0, 'humidity': 0}
device_data = {'lat': 0, 'longi': 0}

next_reading = time.time()

client = mqtt.Client()

# Set access token
# client.username_pw_set(ACCESS_TOKEN)

# # Connect to ThingsBoard using default MQTT port and 60 seconds keepalive interval
# client.connect(THINGSBOARD_HOST, 1883, 60)
client.connect("localhost",1883,60)

#client.loop_start()

# SQLite DB Name
DB_Name =  "sensor.db"

import urllib.request

#===============================================================
# Database Manager Class

TableSchema="""
create table IF NOT EXISTS test_modem_table (
    id integer primary key autoincrement,
    device_type text,
    device_revision text,
    device_imei text,
    device_imsi text,
    qccid text,
    ip_address text,
    byte_send text,
    byte_receive text,
    pdp_data text,
    network_Acess_Tech text,
    network_Operator text,
    network_Band text,
    network_Channel text,
    servingcell_Topic text,
    servingcell_Connection_State text,
    servingcell_Acess_Tech text,
    servingcell_FDD_TDD text,
    servingcell_MCC text,
    servingcell_MNC text,
    servingcell_CellID text,
    servingcell_PCID text,
    servingcell_EARFCN text,
    servingcell_FBI text,
    servingcell_UL_BW text,
    servingcell_DL_BW text,
    servingcell_TAC text,
    servingcell_RSRP text,
    servingcell_RSCP text,
    servingcell_RSRQ text,
    servingcell_RSSI text,
    servingcell_SINR text,
    servingcell_CQI text,
    servingcell_TX_Power text,
    servingcell_SRxlev text,
    neighbourcell_Topic text,
    neighbourcell_Acess_Tech text,
    neighbourcell_EARFC text,
    neighbourcell_PCID text,
    neighbourcell_RSRQ text,
    neighbourcell_RSRP text,
    neighbourcell_RSSI text,
    neighbourcell_SINR text,
    neighbourcell_srxlev text,
    neighbourcell_Cell_resel_priority text,
    neighbourcell_s_non_intra_searc text,
    neighbourcell_thresh_serv_low text,
    neighbourcell_s_intra_search text,
    UTC_Time text,
    Latitude text,
    Longitude text,
    HDOP text,
    Altitude text,
    Fix text,
    Course text,
    Speed_km text,
    Speed_kn text,
    date text,
    Satellites text
);
"""

class DatabaseManager():
    def __init__(self):
        self.conn = sqlite3.connect(DB_Name)
        self.conn.execute('pragma foreign_keys = on')
        self.conn.commit()
        self.cur = self.conn.cursor()
        sqlite3.complete_statement(TableSchema)
        self.cur.executescript(TableSchema)

    def add_del_update_db_record(self, sql_query, args=()):
        self.cur.execute(sql_query, args)
        self.conn.commit()
        return

    def __del__(self):
        self.cur.close()
        self.conn.close()

dbObj = DatabaseManager()

# get current UTC time
now = datetime.datetime.utcnow()
ser = serial.Serial("/dev/ttyUSB3", baudrate=9600,rtscts=True, dsrdtr=True,timeout=1)

print("Device is Connected to: " + ser.portstr)

device_data={
    "device_type":'',
    "device_revision":'',
    "device_imei":'',
    "device_imsi":'',
    "qccid":'',
    "ip_address":'',
    'byte_send':'',
    'byte_receive':''
}
pdp_data=[]
network_info={
    'network_Acess_Tech':'',
    'network_Operator':'',
    'network_Band':'',
    'network_Channel':''
}
servingcell={
    'servingcell_Topic':'',
    'servingcell_Connection_State':'',
    'servingcell_Acess_Tech':'',
    'servingcell_FDD_TDD':'',
    'servingcell_MCC':'',
    'servingcell_MNC':'',
    'servingcell_CellID':'',
    'servingcell_PCID':'',
    'servingcell_EARFCN':'',
    'servingcell_FBI':'',
    'servingcell_UL_BW':'',
    'servingcell_DL_BW':'',
    'servingcell_TAC':'',
    'servingcell_RSRP':'',
    'servingcell_RSCP':'',
    'servingcell_RSRQ':'',
    'servingcell_RSSI':'',
    'servingcell_SINR':'',
    'servingcell_CQI':'',
    'servingcell_TX_Power':'',
    'servingcell_SRxlev':''
}
neighbourcell={
    'neighbourcell_Topic':'',
    'neighbourcell_Acess_Tech':'',
    'neighbourcell_EARFC':'',
    'neighbourcell_PCID':'',
    'neighbourcell_RSRQ':'',
    'neighbourcell_RSRP':'',
    'neighbourcell_RSSI':'',
    'neighbourcell_SINR':'',
    'neighbourcell_srxlev':'',
    'neighbourcell_Cell_resel_priority':'',
    'neighbourcell_s_non_intra_searc':'',
    'neighbourcell_thresh_serv_low':'',
    'neighbourcell_s_intra_search':''
}
gps={
    'UTC_Time':'',
    'Latitude':'',
    'Longitude':'',
    'HDOP':'',
    'Altitude':'',
    'Fix':'',
    'Course':'',
    'Speed_km':'',
    'Speed_kn':'',
    'date':'',
    'Satellites':'',
}
global_cmd='AT+QGPS=1'
def send(ser, cmd, cmdStr):
    global global_cmd
    global network_info
    global servingcell
    global neighbourcell
    global gps
    global device_data
    global pdp_data
    global next_reading

    
    ser.write(cmd)
    val = ser.readline(1024)                # read complete line from serial output
    while not '\\n'in str(val):         # check if full data is received. 
        # This loop is entered only if serial read value doesn't contain \n
        # which indicates end of a sentence. 
        # str(val) - val is byte where string operation to check `\\n` 
        # can't be performed
        time.sleep(1)                # delay of 1s 
        temp = ser.readline()           # check for serial output.
        if not not temp.decode():       # if temp is not empty.
            val = (val.decode()+temp.decode()).encode()
            # requrired to decode, sum, then encode because
            # long values might require multiple passes
    val = val.decode()                  # decoding from bytes
    val = val.strip()                   # stripping leading and trailing spaces.
    output = ''.join(val)
    modem_log = output.split(',')
    
    print('output',global_cmd,output)

    if(output != "" and output.startswith("AT")!=True):
        if(global_cmd=='ATI' and output!='Quectel' and output!='OK'):
            #print('1output',cmdStr,output)
            if("Revision" in output):
                device_data['device_revision']=output.split(':')[1].strip()
            else:
                device_data['device_type']=output
        elif(global_cmd=='AT+CGSN' and output!='OK'):
            #print('2output',cmdStr,output)
            device_data['device_imei']=output
        elif(global_cmd=='AT+CIMI' and output!='OK'):
            #print('3output',cmdStr,output)
            device_data['device_imsi']=output
        elif(global_cmd=='AT+QCCID' and output!='OK' and '+QCCID' in output):
            #print('4output',global_cmd,output,output.split(':'))
            device_data['qccid']=output.split(':')[1].strip()
        elif(global_cmd=='AT+CGDCONT?' and output!='OK'):
            #print('5output',cmdStr,output)
            if('+CGDCONT:' in output):
                parse_data=output.split(':')[1].strip().split(',')
                formatData={
                    "cid":str(parse_data[0]),
                    "PDP_type":parse_data[1].replace('"',"").strip(),
                    "APN":parse_data[2].replace('"',"").strip(),
                    "PDP_addr":parse_data[3].replace('"',"").strip(),
                    "data_comp":str(parse_data[4]),
                    "head_comp":str(parse_data[5]),
                    "IPv4_addr_alloc":str(parse_data[6]),
                    "request_type":str(parse_data[7])
                }
                pdp_data.append(formatData)
        elif(global_cmd=='AT+QNWINFO' and output!='OK' and ('+QNWINFO:' in output)):
            #print('6output',cmdStr,output)
            #print('QNWINFO',device_data)
            elements = output.split(':')[1].split(',')
            keys = ['network_Acess_Tech', 'network_Operator', 'network_Band', 'network_Channel']
            my_dict = dict(zip(keys, elements))
            for key in my_dict:
                my_dict[key]=my_dict[key].replace('"',"").strip()
            
            network_info=my_dict
            print('QNWINFO network',my_dict)
        elif(global_cmd=='AT+CGPADDR=1' and output!='OK'):
            newVal=output.split(':')[1].strip()
            device_data['ip_address']=newVal.split(',')[1].replace('"',"").strip()
        
        elif(global_cmd=='AT+QENG="servingcell"' and output!='OK' and ('+QENG: "servingcell"' in output)):
            print('servingcell====')
            elements = output.split(':')[1].split(',')
            keys = [
                'servingcell_Topic',
                'servingcell_Connection_State',
                'servingcell_Acess_Tech',
                'servingcell_FDD_TDD',
                'servingcell_MCC',
                'servingcell_MNC',
                'servingcell_CellID',
                'servingcell_PCID',
                'servingcell_EARFCN',
                'servingcell_FBI',
                'servingcell_UL_BW',
                'servingcell_DL_BW',
                'servingcell_TAC',
                'servingcell_RSRP',
                'servingcell_RSCP',
                'servingcell_RSRQ',
                'servingcell_RSSI',
                'servingcell_SINR',
                'servingcell_CQI',
                'servingcell_TX_Power',
                'servingcell_SRxlev'
            ]
            my_dict = dict(zip(keys, elements))
            print('servingcell dict',my_dict)
            for key in my_dict:
                my_dict[key]=my_dict[key].replace('"',"").strip()
            servingcell=my_dict
            servingcell['servingcell_CQI']=''
            servingcell['servingcell_TX_Power']=''
            servingcell['servingcell_SRxlev']=''
            print('servingcell dict 1',my_dict)
        elif(global_cmd=='AT+QENG="neighbourcell"' and output!='OK' and ('+QENG: "neighbourcell intra"' in output)):
            print('neighbourcell intra===')
            elements = output.split(':')[1].split(',')
            # print(elements)
            keys = [
                'neighbourcell_Topic',
                'neighbourcell_Acess_Tech',
                'neighbourcell_EARFC',
                'neighbourcell_PCID',
                'neighbourcell_RSRQ',
                'neighbourcell_RSRP',
                'neighbourcell_RSSI',
                'neighbourcell_SINR',
                'neighbourcell_srxlev',
                'neighbourcell_Cell_resel_priority',
                'neighbourcell_s_non_intra_searc',
                'neighbourcell_thresh_serv_low',
                'neighbourcell_s_intra_search'
            ]
            my_dict = dict(zip(keys, elements))
            print('neighbourcell intra dict',my_dict)
            for key in my_dict:
                my_dict[key]=my_dict[key].replace('"',"").strip()
            neighbourcell=my_dict
            print('neighbourcell intra dict 1',my_dict)
        elif(global_cmd=='AT+QGDCNT?' and output!='OK'):
            newVal=output.split(':')[1].strip()
            device_data['byte_send']=newVal.split(',')[0]
            device_data['byte_receive']=newVal.split(',')[1]
            #print('device_data',device_data)
        elif(global_cmd=='AT+QGPSLOC=2' and output!='OK' and ('+QGPSLOC:' in output)):
            #print('GPS',device_data)
            elements = output.split(':')[1].split(',')
            keys = [
                'UTC_Time',
                'Latitude',
                'Longitude',
                'HDOP',
                'Altitude',
                'Fix',
                'Course',
                'Speed_km',
                'Speed_kn',
                'date',
                'Satellites'
            ]
            my_dict = dict(zip(keys, elements))
            for key in my_dict:
                my_dict[key]=my_dict[key].replace('"',"").strip()
            
            gps=my_dict
            print('GPS dict',my_dict)
    #global_cmd=='AT+QGPSLOC=2'
    if(output.startswith("AT")):
        if(global_cmd=='AT+QGPSLOC=2'):
            valArr=[]

            valArr.extend(device_data.values())
            valArr.append(json.dumps(pdp_data))
            valArr.extend(network_info.values())
            valArr.extend(servingcell.values())
            valArr.extend(neighbourcell.values())
            valArr.extend(gps.values())
            # print(device_data,network_info,servingcell,neighbourcell,gps)
            # print('val',valArr)

                
            device_info=device_data
            
            servingcell_info=servingcell
            neighbourcell_info=neighbourcell
            gps_info=gps
            pdp_info= pdp_data

            final={
                "device":{
                    "type": device_info["device_type"],
                    "revision": device_info["device_revision"],
                    "imei": device_info["device_imei"],
                    "imsi": device_info["device_imsi"],
                    "qccid": device_info["qccid"],
                    "ipAddress": device_info["ip_address"],
                    "byteSend": device_info["byte_send"],
                    "byteReceive": device_info["byte_receive"],
                    "pdp": pdp_info
                },
                "network":{
                    "accessTech": network_info["network_Acess_Tech"],
                    "operator": network_info["network_Operator"],
                    "band": network_info["network_Band"],
                    "channel": network_info["network_Channel"],
                },
                "servingcell":{
                    "topic": servingcell_info["servingcell_Topic"],
                    "connectionState": servingcell_info["servingcell_Connection_State"],
                    "acessTech": servingcell_info["servingcell_Acess_Tech"],
                    "fddTdd": servingcell_info["servingcell_FDD_TDD"],
                    "mcc": servingcell_info["servingcell_MCC"],
                    "mnc": servingcell_info["servingcell_MNC"],
                    "cellId": servingcell_info["servingcell_CellID"],
                    "pcId": servingcell_info["servingcell_PCID"],
                    "earfcn": servingcell_info["servingcell_EARFCN"],
                    "fbi": servingcell_info["servingcell_FBI"],
                    "ulbw": servingcell_info["servingcell_UL_BW"],
                    "dlbw": servingcell_info["servingcell_DL_BW"],
                    'tac': servingcell_info["servingcell_TAC"],
                    "rsrp": servingcell_info["servingcell_RSRP"],
                    "rscp": servingcell_info["servingcell_RSCP"],
                    "rsrq": servingcell_info["servingcell_RSRQ"],
                    "rssi": servingcell_info["servingcell_RSSI"],
                    "sinr": servingcell_info["servingcell_SINR"],
                    "cqi": servingcell_info["servingcell_CQI"],
                    "txPower": servingcell_info["servingcell_TX_Power"],
                    "srxlev": servingcell_info["servingcell_SRxlev"],
                },
                "neighbourcell":{
                    "topic": neighbourcell_info["neighbourcell_Topic"],
                    "acessTech": neighbourcell_info["neighbourcell_Acess_Tech"],
                    "earfc": neighbourcell_info["neighbourcell_EARFC"],
                    "pcId": neighbourcell_info["neighbourcell_PCID"],
                    "rsrq": neighbourcell_info["neighbourcell_RSRQ"],
                    "rsrp": neighbourcell_info["neighbourcell_RSRP"],
                    "rssi":neighbourcell_info["neighbourcell_RSSI"],
                    "sinr": neighbourcell_info["neighbourcell_SINR"],
                    "srxlev": neighbourcell_info["neighbourcell_srxlev"],
                    "cellReselPriority": neighbourcell_info["neighbourcell_Cell_resel_priority"],
                    "sNonIntraSearc": neighbourcell_info["neighbourcell_s_non_intra_searc"],
                    "threshServLow": neighbourcell_info["neighbourcell_thresh_serv_low"],
                    "sIntraSearch": neighbourcell_info["neighbourcell_s_intra_search"],
                },
                "gps":{
                    "utcTime": gps_info["UTC_Time"],
                    "latitude": gps_info["Latitude"],
                    "longitude": gps_info["Longitude"],
                    "hdop": gps_info["HDOP"],
                    "altitude": gps_info["Altitude"],
                    "fix": gps_info["Fix"],
                    "course": gps_info["Course"],
                    "speedKm": gps_info["Speed_km"],
                    "speedKn": gps_info["Speed_kn"],
                    "date": gps_info["date"],
                    "satellites": gps_info["Satellites"],
                }
            }

            # Sending humidity and temperature data to ThingsBoard
            client.publish('sensor/modem', json.dumps(final), 1)
            # client.publish('v1/devices/me/telemetry', json.dumps(network_info), 1)
            # client.publish('v1/devices/me/telemetry', json.dumps(servingcell_info), 1)
            # client.publish('v1/devices/me/telemetry', json.dumps(neighbourcell_info), 1)
            # client.publish('v1/devices/me/telemetry', json.dumps(gps_info), 1)
            # client.publish('v1/devices/me/telemetry', json.dumps(pdp_info), 1)

            # next_reading += INTERVAL
            # sleep_time = next_reading-time.time()
            # if sleep_time > 0:
            #     time.sleep(sleep_time)
            

            dbObj.add_del_update_db_record("insert into test_modem_table (device_type,device_revision,device_imei,device_imsi,qccid,ip_address,byte_send,byte_receive,pdp_data,network_Acess_Tech,network_Operator,network_Band,network_Channel,servingcell_Topic,servingcell_Connection_State,servingcell_Acess_Tech,servingcell_FDD_TDD,servingcell_MCC,servingcell_MNC,servingcell_CellID,servingcell_PCID,servingcell_EARFCN,servingcell_FBI,servingcell_UL_BW,servingcell_DL_BW,servingcell_TAC,servingcell_RSRP,servingcell_RSCP,servingcell_RSRQ,servingcell_RSSI,servingcell_SINR,servingcell_CQI,servingcell_TX_Power,servingcell_SRxlev,neighbourcell_Topic,neighbourcell_Acess_Tech,neighbourcell_EARFC,neighbourcell_PCID,neighbourcell_RSRQ,neighbourcell_RSRP,neighbourcell_RSSI,neighbourcell_SINR,neighbourcell_srxlev,neighbourcell_Cell_resel_priority,neighbourcell_s_non_intra_searc,neighbourcell_thresh_serv_low,neighbourcell_s_intra_search,UTC_Time,Latitude,Longitude,HDOP,Altitude,Fix,Course,Speed_km,Speed_kn,date,Satellites) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",valArr)
            network_info={
                'network_Acess_Tech':'',
                'network_Operator':'',
                'network_Band':'',
                'network_Channel':''
            }
            servingcell={
                'servingcell_Topic':'',
                'servingcell_Connection_State':'',
                'servingcell_Acess_Tech':'',
                'servingcell_FDD_TDD':'',
                'servingcell_MCC':'',
                'servingcell_MNC':'',
                'servingcell_CellID':'',
                'servingcell_PCID':'',
                'servingcell_EARFCN':'',
                'servingcell_FBI':'',
                'servingcell_UL_BW':'',
                'servingcell_DL_BW':'',
                'servingcell_TAC':'',
                'servingcell_RSRP':'',
                'servingcell_RSCP':'',
                'servingcell_RSRQ':'',
                'servingcell_RSSI':'',
                'servingcell_SINR':'',
                'servingcell_CQI':'',
                'servingcell_TX_Power':'',
                'servingcell_SRxlev':''
            }
            neighbourcell={
                'neighbourcell_Topic':'',
                'neighbourcell_Acess_Tech':'',
                'neighbourcell_EARFC':'',
                'neighbourcell_PCID':'',
                'neighbourcell_RSRQ':'',
                'neighbourcell_RSRP':'',
                'neighbourcell_RSSI':'',
                'neighbourcell_SINR':'',
                'neighbourcell_srxlev':'',
                'neighbourcell_Cell_resel_priority':'',
                'neighbourcell_s_non_intra_searc':'',
                'neighbourcell_thresh_serv_low':'',
                'neighbourcell_s_intra_search':''
            }
            gps={
                'UTC_Time':'',
                'Latitude':'',
                'Longitude':'',
                'HDOP':'',
                'Altitude':'',
                'Fix':'',
                'Course':'',
                'Speed_km':'',
                'Speed_kn':'',
                'date':'',
                'Satellites':''
            }
        global_cmd=output
        

#Enable GPS

def gps_enable(ser):
    send(ser,b'AT+QGPS=1\r','AT+QGPS=1')

def gps_nmea(ser):
    send(ser,b'AT+QGPSCFG="gpsnmeatype",31\r','AT+QGPSCFG="gpsnmeatype')
    
#Device information (Static)"
    
def device_info(ser):
    send(ser,b'ATI\r','ATI')
    
def device_serial(ser):
    send(ser,b'AT+CGSN\r','AT+CGSN')

def device_imei(ser):
    send(ser,b'AT+CIMI\r','AT+CIMI')
    
def device_iccid(ser):
    send(ser,b'AT+QCCID\r','AT+QCCID')
    
def sw_version(ser):
    send(ser,b'CGMR\n','CGMR')


#Device Configuration information (Static)"
def apn_information(ser):
    send(ser,b'AT+CGDCONT?\r','AT+CGDCONT?')
    

def ip_information(ser):
    send(ser,b'AT+CGPADDR=1\r','AT+CGPADDR=1')
    

#Device Location Information(Dynamic)"
    
def gps_location(ser):
    send(ser,b'AT+QGPSLOC=2\r','AT+QGPSLOC=2')
    

#Device Network Information(Dynamic)"
def network_info_data(ser):
    send(ser,b'AT+QNWINFO\r','AT+QNWINFO')

def servingcell_info(ser):
    send(ser,b'AT+QENG="servingcell"\r','AT+QENG="servingcell')
    
def neighbourcell_info(ser):
    send(ser,b'AT+QENG="neighbourcell"\r','AT+QENG="neighbourcell')
    
def data_packets(ser):
    send(ser,b'AT+QGDCNT?\r','AT+QGDCNT?')


print("Device Information:\n")
gps_enable(ser)
gps_nmea(ser)

device_info(ser)
device_serial(ser)
device_imei(ser)
device_iccid(ser)
#sw_version(ser)
apn_information(ser)

while True:                             # runs this loop forever
    time.sleep(5)
    network_info_data(ser)
    time.sleep(1)
    ip_information(ser)
    time.sleep(1)
    servingcell_info(ser)
    time.sleep(1)
    neighbourcell_info(ser)
    time.sleep(1)
    data_packets(ser)
    time.sleep(1)
    gps_location(ser)

client.loop_stop()
client.disconnect()

ser.close()
