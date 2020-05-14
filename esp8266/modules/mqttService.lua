mqttService = {}

local HOST = "157.245.42.9"
local PORT = 1883

local SUBSCRIBE_TOPICS={
    humidity = "data/humidity",
    temperature = "data/temperature",
    light = "data/light-levels",
    motion = "data/motion",
}


function mqttService.publish(topic, value)
    client:publish(SUBSCRIBE_TOPICS[topic], tostring(value), 1, 0, function(client)
        print("Message sent: " ..SUBSCRIBE_TOPICS[topic], tostring(value))
    end)
end

function mqttService.init()
    client = mqtt.Client("Smart Desk Assistant", 300)
    
    client:lwt("/lwt", "Now Offline", 1, 0)
    
    client:on("connect", function(client)
        print("Client connected to "..HOST)
        for key, topic in pairs(SUBSCRIBE_TOPICS) do
            client:subscribe(topic, 1, function(client)
                print("Subscribe sucessful")
            end)
        end
    end)
    
    client:on("offline", function(client)
        print("Client offline")
    end)
    
    client:connect(HOST, PORT, false, false, function(conn) end, function(conn, reason)
        print("FAIL! Reason is "..reason)
    end)
end

return mqttService
