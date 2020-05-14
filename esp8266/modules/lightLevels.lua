lightLevels = {}

local adcPin = 0

function lightLevels.read()
    lightLevel = adc.read(adcPin)
    return lightLevel
end

return lightLevels

