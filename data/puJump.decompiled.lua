-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1) -- proto#1 params=2 locals=4 upvalues=0 vararg=false lines=3-27
    local r1_0 = { 1 }
    r1_0.x = 1
    r1_0.y = 1
    local r1_1 = p1_1[p1_0]
    if r1_1 then
        r1_1.playPowerUpJumpEffect()
        local r1_2, r1_3
        r1_2, r1_3 = r1_1:getLinearVelocity()
        if r1_3 < -140 then
            r1_1:applyForce(100, -250, r1_1.x, r1_1.y)
        elseif r1_3 > 100 then
            r1_1:applyForce(100, -400, r1_1.x, r1_1.y)
        else
            r1_1:applyForce(100, -300, r1_1.x, r1_1.y)
        end
    end
    return r1_0
end

return r0_0
