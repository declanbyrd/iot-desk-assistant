motionSensor = {}

function motionSensor.read()
    sensorPin = 6
    gpio.mode(sensorPin, gpio.INPUT)
    motionTimer = tmr.create()
    motionTimer:register(1000, 1, function()
        if gpio.read(sensorPin) == 1 then
            print("Motion detected")
        end
    end)
    motionTimer:start()
end

return motionSensor
