-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1, p1_2, p1_3, p1_4, p1_5) -- proto#1 params=6 locals=16 upvalues=0 vararg=false lines=3-128
    local r1_0 = display.newGroup()
    local r1_1 = false
    local r1_2, r1_3 = nil, nil
    local r1_4 = 610
    local r1_5 = { 7, 17, -7, 17, -17, 7, -17, -7, -7, -17, 7, -17, 17, -7, 17, 7 }
    local r1_6 = true

    local function r1_7() -- proto#2 params=0 locals=0 upvalues=1 vararg=false lines=13-15
        r1_6 = false
    end

    local function r1_8() -- proto#3 params=0 locals=2 upvalues=4 vararg=false lines=17-23
        if r1_0 and not r1_1 then
            local r3_0, r3_1 = r1_0:getLinearVelocity()
            r1_2:rotate(r3_0 * 0.05)
            r1_3:rotate(r3_0 * 0.05)
        end
    end

    local function r1_9() -- proto#4 params=0 locals=2 upvalues=3 vararg=false lines=26-38
        if r1_0 and not r1_1 then
            local r4_0, r4_1 = r1_0:getLinearVelocity()
            if r4_0 < 0 and -r1_4 < r4_0 then
                r4_0 = r4_0 - 40
            elseif r4_0 > 0 and r4_0 < r1_4 then
                r4_0 = r4_0 + 40
            end
            r1_0:setLinearVelocity(r4_0, r4_1)
        end
    end

    local function r1_10() -- proto#5 params=0 locals=1 upvalues=3 vararg=false lines=40-49
        r1_1 = true
        if r1_0 then
            Runtime:removeEventListener("enterFrame", r1_8)
            r1_0:removeEventListener("collision", r1_0)
            r1_0:removeSelf()
            r1_0 = nil
        end
    end

    local function r1_11() -- proto#6 params=0 locals=0 upvalues=2 vararg=false lines=51-54
        r1_3.alpha = 1
        r1_2.alpha = 0
    end

    r1_0.changeImage = r1_11

    local function r1_12(p7_0, p7_1) -- proto#7 params=2 locals=0 upvalues=3 vararg=false lines=58-73
        if p7_1.phase == "began"
            and (p7_1.other.id ~= p1_0 or not r1_6)
            and p7_1.other.onCollisionPowerUp
            and p7_1.other.onCollisionPowerUp(p1_0, 1) == 1 then
            r1_11()
        end
    end

    local function r1_13() -- proto#8 params=0 locals=5 upvalues=9 vararg=false lines=77-99
        r1_2 = display.newImageRect("images/game/powerup/blade/blade.png", 40, 40)
        r1_3 = display.newImageRect("images/game/powerup/blade/blade_blood.png", 40, 40)
        r1_3.alpha = 0
        r1_0:insert(r1_2)
        r1_0:insert(r1_3)
        physics.addBody(r1_0, {
            density = 0.6, friction = 0.1, bounce = 0.5, shape = r1_5, filter = powerUpFilter
        }, { isSensor = true, radius = 18, filter = sensorFilter })
        r1_0.collision = r1_12
        r1_0:addEventListener("collision", r1_0)
        r1_0.isFixedRotation = true
        r1_0.update = r1_9
        r1_0.removeObject = r1_10
        p1_4:insert(r1_0)
        Runtime:addEventListener("enterFrame", r1_8)
    end

    local function r1_14() -- proto#9 params=0 locals=0 upvalues=7 vararg=false lines=101-114
        p1_5[p1_0].removeBladeAnimation()
        r1_0:setLinearVelocity(r1_4 * 1, 5, 0)
        r1_0:applyForce(50, 0, 0, -20)
        r1_0:applyForce(-50, 0, 0, 20)
        if p1_1 then
            r1_0.x = p1_1.x
            r1_0.y = p1_1.y - 2
        else
            r1_0.x = p1_2
            r1_0.y = p1_3
        end
    end

    r1_13()
    r1_14()
    timer.performWithDelay(500, r1_7, 1)
    timer.performWithDelay(6000, r1_10, 1)
    return r1_0
end

return r0_0
