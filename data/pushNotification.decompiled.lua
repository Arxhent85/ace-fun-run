-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}
local r0_1 = require("plugin.notifications")
local r0_2 = require("storyboard")
r0_1.registerForPushNotifications()
local r0_3 = { "Want to race?", "Miss the feel of sawblades?" }
local r0_4 = {
    "Haven't been struck by lightning in a while?", "You just got magneted back into this game!"
}
local r0_5 = { "Want more Fun Run in your life? Check out Fun Run 2!" }
local r0_6 = {}

local function r0_7(p1_0) -- proto#1 params=1 locals=1 upvalues=0 vararg=false lines=30-33
    return p1_0[math.random(1, #p1_0)]
end

local function r0_8(p2_0, p2_1) -- proto#2 params=2 locals=5 upvalues=4 vararg=false lines=35-62
    if not (r0_2.database and r0_2.database.getPlayerInformation) then
        return
    end
    local r2_0 = r0_2.database.getPlayerInformation()
    if not (r2_0 and r2_0.username) then
        return
    end
    local r2_1 = r0_2.database.getNotification()
    if r2_1 ~= 1 then
        return
    end
    local r2_2 = { alert = r0_7(p2_1) }
    local r2_3 = nil
    if isAndroid then
        r2_3 = system.scheduleNotification(p2_0, r2_2)
    else
        r2_3 = r0_1.scheduleNotification(p2_0, r2_2)
    end
    r0_6[#r0_6 + 1] = r2_3
end

function r0_0.queue3DayNotification() -- proto#3 params=0 locals=1 upvalues=2 vararg=false lines=64-67
    local r3_0 = 259200
    r0_8(r3_0, r0_3)
end

function r0_0.queue7DayNotification() -- proto#4 params=0 locals=1 upvalues=2 vararg=false lines=70-73
    local r4_0 = 604800
    r0_8(r4_0, r0_4)
end

function r0_0.queue30DayNotification() -- proto#5 params=0 locals=1 upvalues=2 vararg=false lines=76-79
    local r5_0 = 2592000
    r0_8(r5_0, r0_5)
end

function r0_0.clearLocalPushNotificationQueue() -- proto#6 params=0 locals=0 upvalues=2 vararg=false lines=82-85
    r0_1.cancelNotification()
    r0_6 = {}
end

r0_2.notification = r0_0
