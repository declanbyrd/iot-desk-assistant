local time = require("time")
local lightLevels = require("lightLevels")
local dht11 = require("dht11")
local motionSensor = require("motionSensor")
local mqttService = require("mqttService")

wifi.sta.autoconnect(1)
wifi.setmode(wifi.STATIONAP)
enduser_setup.start()

connectToAp=tmr.create()
connectToAp:register(2000, 1, function()
    if wifi.sta.getip() == nil then
        print("Connecting to network...")
    else
    connectToAp:stop()
        main()
    end
end)
connectToAp:start()


function main()
    mqttService.init()
    time.showOnDisplay()
    cron.schedule("* * * * *", function(e)
        mqttService.publish("light",  lightLevels.read())
        dht11.readSensor()
    end)
    motionSensor.read()
end



