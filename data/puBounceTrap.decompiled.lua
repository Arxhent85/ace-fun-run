-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1, p1_2, p1_3, p1_4, p1_5) -- proto#1 params=6 locals=16 upvalues=0 vararg=false lines=3-123
    local r1_0
    local r1_1 = false
    local r1_2 = require("sprite")
    local r1_3 = require("storyboard")
    local r1_4 = true
    local r1_5 = true
    local r1_6 = true

    local function r1_7() -- proto#2 params=0 locals=0 upvalues=1 vararg=false lines=13-15
        r1_6 = false
    end

    local function r1_8() -- proto#3 params=0 locals=0 upvalues=0 vararg=false lines=18-21

    end

    local function r1_9() -- proto#4 params=0 locals=0 upvalues=2 vararg=false lines=25-29
        r1_0:prepare("play")
        r1_0:play()
        r1_1 = true
    end

    local function r1_10() -- proto#5 params=0 locals=0 upvalues=2 vararg=false lines=31-35
        r1_0:prepare("reset")
        r1_0:play()
        r1_1 = false
    end

    local function r1_11(p6_0) -- proto#6 params=1 locals=0 upvalues=2 vararg=false lines=37-43
        if p6_0.phase == "ended" and r1_1 then
            r1_10()
        end
    end

    local function r1_12() -- proto#7 params=0 locals=0 upvalues=2 vararg=false lines=45-52
        if r1_0 then
            r1_0:removeEventListener("sprite", r1_11)
            r1_0:removeEventListener("collision", r1_0)
            r1_0:removeSelf()
            r1_0 = nil
        end
    end

    local function r1_13(p8_0, p8_1) -- proto#8 params=2 locals=2 upvalues=6 vararg=false lines=54-79
        if p8_1.phase == "began" then
            local r8_0 = true
            if p8_1.other.id == p1_0 and r1_6 then
                r8_0 = false
            elseif p8_1.other.mobileUser then
                if r1_4 then
                    r1_4 = false
                    p8_1.other.onCollisionPowerUp(p1_0, 8)
                end
            elseif r1_3.gameType == 1 and p8_1.other.onCollisionPowerUp and r1_5 then
                r1_5 = false
                p8_1.other.onCollisionPowerUp(p1_0, 8)
            end
            if p8_1.other.player and r8_0 then
                r1_9()
            end
        end
    end

    local function r1_14() -- proto#9 params=0 locals=8 upvalues=13 vararg=false lines=83-110
        p1_5[p1_0].removeBounceTrapAnimation()
        r1_0 = r1_2.newSprite(r1_3.gameDataTable.animations.bounceTrapSet)
        local r9_0 = { 29.5, -5, 29.5, 19, 6.5, 19, 6.5, -5 }
        local r9_1 = { 15.5, -5, 15.5, 19, 6.5, 19, 6.5, -5 }
        physics.addBody(r1_0, {
            density = 0.6, friction = 1, bounce = 0.3, shape = r9_0, filter = powerUpFilter
        }, { isSensor = true, shape = r9_1, filter = obstacleFilter })
        r1_0.collision = r1_13
        r1_0:addEventListener("collision", r1_0)
        r1_0.xScale = 0.5
        r1_0.yScale = 0.5
        r1_0.update = r1_8
        r1_0.removeObject = r1_12
        r1_0:addEventListener("sprite", r1_11)
        if p1_1 then
            r1_0.x = p1_1.x - 15
            r1_0.y = p1_1.y
        else
            r1_0.x = p1_2
            r1_0.y = p1_3
        end
        p1_4:insert(r1_0)
    end

    r1_14()
    timer.performWithDelay(500, r1_7, 1)
    timer.performWithDelay(30000, r1_12, 1)
    return r1_0
end

return r0_0
