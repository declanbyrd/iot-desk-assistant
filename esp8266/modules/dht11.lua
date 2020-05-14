local mqttService = require("mqttService")

dht11 = {}

local dhtPin = 1

function dht11.readSensor()
    status, temp, humi, temp_dec, humi_dec = dht.read11(dhtPin)
    if status == dht.OK then
        publishTemperature(temp)
        publishHumidity(humi)
    elseif status == dht.ERROR_CHECKSUM then
        print( "DHT Checksum error." )
    elseif status == dht.ERROR_TIMEOUT then
        print( "DHT timed out." )
        dht11.readSensor()
    end
end

function publishTemperature(value)
    if value ~= nil then
        mqttService.publish("temperature", value)
    end
end

function publishHumidity(value)
    if value ~= nil then
        mqttService.publish("humidity", value)
    end
end


return dht11
