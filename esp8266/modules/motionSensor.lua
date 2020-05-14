local mqttService = require("mqttService")

motionSensor = {}

function motionSensor.read()
    sensorPin = 6
    gpio.mode(sensorPin, gpio.INPUT)
    sensorTimer = tmr.create()
    sensorTimer:alarm(1000, tmr.ALARM_AUTO, function()
        if gpio.read(sensorPin) == 1 then
            print("Motion detected")
            mqttService.publish('motion', 1)
        else
            mqttService.publish('motion', 0)
        end
    end)
end

return motionSensor
