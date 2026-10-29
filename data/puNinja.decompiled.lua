-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1, p1_2, p1_3) -- proto#1 params=4 locals=4 upvalues=0 vararg=false lines=4-52
    local r1_0 = require("storyboard")
    local r1_1 = { 1 }
    r1_1.x = 1
    r1_1.y = 1

    local function r1_2() -- proto#2 params=0 locals=3 upvalues=6 vararg=false lines=13-46
        if r1_0.gameType == 1 then
            if p1_3[p1_0].getUsername() == p1_2 then
                for r2_0 = 1, #p1_3 do
                    if p1_3[r2_0].ninjaMark then
                        p1_3[r2_0].onCollisionPowerUp(p1_0, 9)
                    end
                end
            else
                local r2_1 = math.random(1, 4)
                p1_3[r2_1].onCollisionPowerUp(p1_0, 9)
            end
        else
            if p1_3[p1_0].getUsername() == p1_2 then
                for r2_2 = 1, #p1_3 do
                    if p1_3[r2_2].ninjaMark then
                        r1_1.x = r2_2
                        p1_1 = r2_2
                    end
                end
            end
            if p1_1 == 0 then
                return
            end
            if p1_3[p1_1].getUsername() == p1_2 then
                p1_3[p1_1].onCollisionPowerUp(p1_0, 9)
            end
        end
    end

    r1_2()
    return r1_1
end

return r0_0
