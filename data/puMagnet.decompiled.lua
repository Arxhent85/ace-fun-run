-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1, p1_2) -- proto#1 params=3 locals=4 upvalues=0 vararg=false lines=4-32
    local r1_0 = require("storyboard")
    local r1_1 = { 1 }
    r1_1.x = 1
    r1_1.y = 1

    local function r1_2() -- proto#2 params=0 locals=1 upvalues=4 vararg=false lines=12-25
        for r2_0 = 1, #p1_2 do
            if p1_2[r2_0].id ~= p1_0 then
                if p1_2[r2_0].getUsername() == p1_1 then
                    p1_2[r2_0].onCollisionPowerUp(p1_0, 7)
                elseif r1_0.gameType == 1 then
                    p1_2[r2_0].onCollisionPowerUp(p1_0, 7)
                end
            end
        end
    end

    r1_2()
    return r1_1
end

return r0_0
