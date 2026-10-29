-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}
local r0_1 = {}
local r0_2 = require("puBlade")
local r0_3 = require("puBladeAnimation")
local r0_4 = require("puTrap")
local r0_5 = require("puTrapAnimation")
local r0_6 = require("puLightning")
local r0_7 = require("puSpeed")
local r0_8 = require("puShield")
local r0_9 = require("puArmor")
local r0_10 = require("puMagnet")
local r0_11 = require("puJump")
local r0_12 = require("puMagnetAnimation")
local r0_13 = require("puBounceTrap")
local r0_14 = require("puBounceTrapAnimation")
local r0_15 = require("puNinja")
local r0_16, r0_17 = nil, nil

function r0_1.usePowerUp(p1_0, p1_1, p1_2, p1_3, p1_4, p1_5, p1_6, p1_7, p1_8) -- proto#1 params=9 locals=4 upvalues=16 vararg=false lines=23-92
    local r1_0 = #r0_0 + 1
    local r1_1 = nil
    if p1_8 and p1_6 and p1_7 and p1_0 then
        if p1_0 == 1 then
            r1_1 = r0_2.new(p1_1, p1_3, p1_4, p1_5, p1_6, p1_8)
            r0_0[r1_0] = r1_1
            p1_8[p1_1].playSound("blade_activate")
        elseif p1_0 == 2 then
            r1_1 = r0_4.new(p1_1, p1_3, p1_4, p1_5, p1_6, p1_8)
            r0_0[r1_0] = r1_1
            p1_8[p1_1].playSound("trap_activate")
        elseif p1_0 == 3 then
            r1_1 = r0_6.new(p1_1, p1_2, p1_8)
            r0_0[r1_0] = r1_1
            r0_17("lightning_activate")
        elseif p1_0 == 4 then
            r1_1 = r0_7.new(p1_1, p1_8)
            p1_8[p1_1].playSound("speed_activate")
        elseif p1_0 == 5 then
            r1_1 = r0_8.new(p1_1, p1_8)
            p1_8[p1_1].playSound("invul_activate")
        elseif p1_0 == 6 then
            r1_1 = r0_9.new(p1_1, p1_8)
            p1_8[p1_1].playSound("armor_activate")
        elseif p1_0 == 7 then
            r1_1 = r0_10.new(p1_1, p1_2, p1_8)
            p1_8[p1_1].playSound("magnet_activate")
        elseif p1_0 == 8 then
            r1_1 = r0_13.new(p1_1, p1_3, p1_4, p1_5, p1_6, p1_8)
            r0_0[r1_0] = r1_1
            p1_8[p1_1].playSound("bounce_activate")
        elseif p1_0 == 9 then
            r1_1 = r0_15.new(p1_1, p1_4, p1_2, p1_8)
            r0_0[r1_0] = r1_1
            p1_8[p1_1].playSound("blade_activate")
        elseif p1_0 == 10 then
            r1_1 = r0_11.new(p1_1, p1_8)
            r0_0[r1_0] = r1_1
            p1_8[p1_1].playSound("bounce_activate")
        end
        if p1_0 == 51 then
            r1_1 = r0_3.new(p1_1, p1_8)
        elseif p1_0 == 52 then
            r1_1 = r0_5.new(p1_1, p1_8)
        elseif p1_0 == 57 then
            r1_1 = r0_12.new(p1_1, p1_8)
        elseif p1_0 == 58 then
            r1_1 = r0_14.new(p1_1, p1_8)
        end
        if r1_1 == nil then
            return 1, 1
        end
        return r1_1.x, r1_1.y
    end
    return 1, 1
end

function r0_1.getPowerUps() -- proto#2 params=0 locals=0 upvalues=1 vararg=false lines=95-97
    return r0_0
end

local function r0_18() -- proto#3 params=0 locals=1 upvalues=1 vararg=false lines=101-109
    for r3_0 = 1, #r0_0 do
        if r0_0[r3_0] and r0_0[r3_0].update then
            r0_0[r3_0].update()
        end
    end
end

function r0_1.clean() -- proto#4 params=0 locals=1 upvalues=2 vararg=false lines=111-128
    if r0_16 then
        timer.cancel(r0_16)
        r0_16 = nil
    end
    for r4_0 = 1, #r0_0 do
        if r0_0[r4_0] then
            if r0_0[r4_0].removeObject then
                r0_0[r4_0].removeObject()
                r0_0[r4_0] = nil
            else
                r0_0[r4_0] = nil
            end
        end
    end
end

function r0_1.init() -- proto#5 params=0 locals=1 upvalues=3 vararg=false lines=131-134
    r0_0 = {}
    r0_16 = timer.performWithDelay(100, r0_18, 0)
end

function r0_1.addPlaySoundFunction(p6_0) -- proto#6 params=1 locals=0 upvalues=1 vararg=false lines=137-139
    r0_17 = p6_0
end

return r0_1
