local time = {}

local tmsrv = "0.uk.pool.ntp.org"

function formatTime(time)
months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"}
weekDays = {'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'}
timeString = string.format('%s %02d %s', weekDays[tm['wday']], tm['day'], months[tm['mon']])
return timeString
end

function stampTime()
    disp:clearScreen()
    sec, microsec, rate = rtctime.get()
    tm = rtctime.epoch2cal(sec, microsec, rate)
    tm["hour"] = tm["hour"] + 1 -- daylight savings time
    disp:setColor(255, 255, 255)
    disp:setPrintPos(45, 35)
    disp:setFont(ucg.font_helvB12_hr)
    disp:print(string.format("%02d:%02d",  tm["hour"], tm["min"]))
    disp:setPrintPos(0,60)
    dateString = formatTime(tm)
    disp:setFont(ucg.font_helvB10_hr)
    disp:print(dateString)
end

function init_spi_display()
  cs  = 2
  dc  = 3
  spi.setup(1, spi.MASTER, spi.CPOL_LOW, spi.CPHA_LOW, spi.DATABITS_8, 0)
  disp = ucg.ssd1351_18x128x128_hw_spi(1, cs, dc, 0)
  disp:begin(ucg.FONT_MODE_TRANSPARENT)
  disp:clearScreen()
  disp:setRotate180()
end

local function syncTimeAndDisplay()
    sntp.sync(tmsrv, function()
        print("Sync success")
        stampTime()
        cron.schedule("* * * * *", function(e)
            stampTime()
        end)
        end, function()
            print("Sync fail")
        end, 
    1)
end


function time.showOnDisplay()
    init_spi_display()
    syncTimeAndDisplay()    
end

return time
