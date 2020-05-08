lightLevels = {}

local adcPin = 0

function lightLevels.read()
    lightLevel = adc.read(adcPin)
    print(lightLevel)
end

return lightLevels

