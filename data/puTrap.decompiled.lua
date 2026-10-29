-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1, p1_2, p1_3, p1_4, p1_5) -- proto#1 params=6 locals=17 upvalues=0 vararg=false lines=3-124
    local r1_0
    local r1_1 = false
    local r1_2 = require("sprite")
    local r1_3 = require("storyboard")
    local r1_4 = require("physics")
    local r1_5, r1_6 = true, true

    local function r1_7() -- proto#2 params=0 locals=0 upvalues=1 vararg=false lines=13-15
        r1_6 = false
    end

    local function r1_8() -- proto#3 params=0 locals=0 upvalues=0 vararg=false lines=17-19

    end

    local function r1_9() -- proto#4 params=0 locals=0 upvalues=2 vararg=false lines=22-26
        r1_0:prepare("close")
        r1_0:play()
        r1_1 = true
    end

    local function r1_10() -- proto#5 params=0 locals=0 upvalues=2 vararg=false lines=28-32
        r1_0:prepare("open")
        r1_0:play()
        r1_1 = false
    end

    local function r1_11(p6_0) -- proto#6 params=1 locals=0 upvalues=2 vararg=false lines=34-40
        if p6_0.phase == "ended" and r1_1 then
            r1_10()
        end
    end

    local function r1_12() -- proto#7 params=0 locals=0 upvalues=2 vararg=false lines=42-50
        if r1_0 then
            r1_0:removeEventListener("sprite", r1_11)
            r1_0:removeEventListener("collision", r1_0)
            r1_0:removeSelf()
            r1_0 = nil
        end
    end

    local function r1_13() -- proto#8 params=0 locals=0 upvalues=1 vararg=false lines=52-54
        r1_5 = true
    end

    local function r1_14(p9_0, p9_1) -- proto#9 params=2 locals=2 upvalues=6 vararg=false lines=56-81
        if p9_1.phase == "began" then
            local r9_0 = true
            if p9_1.other.id == p1_0 and r1_6 then
                r9_0 = false
            elseif p9_1.other.mobileUser and r1_5 then
                r1_5 = false
                p9_1.other.onCollisionPowerUp(p1_0, 2)
                timer.performWithDelay(1000, r1_13, 1)
            elseif r1_3.gameType == 1 and r1_5 and p9_1.other.onCollisionPowerUp then
                r1_5 = false
                p9_1.other.onCollisionPowerUp(p1_0, 2)
                timer.performWithDelay(1000, r1_13, 1)
            end
            if p9_1.other.player and r9_0 then
                r1_9()
            end
        end
    end

    local function r1_15() -- proto#10 params=0 locals=8 upvalues=14 vararg=false lines=85-110
        p1_5[p1_0].removeTrapAnimation()
        r1_0 = r1_2.newSprite(r1_3.gameDataTable.animations.trapSet)
        local r10_0 = { 20, 0, 20, 18, -20, 18, -20, 0 }
        local r10_1 = { 26, 0, 26, 18, 15, 18, 15, 0 }
        r1_4.addBody(r1_0, {
            density = 0.6, friction = 1, bounce = 0.3, shape = r10_0, filter = powerUpFilter
        }, { isSensor = true, shape = r10_1, filter = obstacleFilter })
        r1_0.xScale = 0.5
        r1_0.yScale = 0.5
        r1_0.update = r1_8
        r1_0.removeObject = r1_12
        r1_0.collision = r1_14
        r1_0:addEventListener("collision", r1_0)
        r1_0:addEventListener("sprite", r1_11)
        if p1_1 then
            r1_0.x = p1_1.x
            r1_0.y = p1_1.y
        else
            r1_0.x = p1_2
            r1_0.y = p1_3
        end
        p1_4:insert(r1_0)
    end

    r1_15()
    timer.performWithDelay(500, r1_7, 1)
    timer.performWithDelay(30000, r1_12, 1)
    return r1_0
end

return r0_0
