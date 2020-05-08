local time = require("time")
local lightLevels = require("lightLevels")
local dht11 = require("dht11")
local motionSensor = require("motionSensor")

wifi.sta.autoconnect(1)
wifi.setmode(wifi.STATION)
station_cfg={}
station_cfg.ssid="Vogel16"
station_cfg.pwd="g0rm0brainache"
station_cfg.save=true
wifi.sta.config(station_cfg)

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
    time.showOnDisplay()
    cron.schedule("* * * * *", function(e)
        lightLevels.read()
        dht11.read()
    end)
    motionSensor.read()
end

