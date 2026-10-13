-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = 1
local r0_1 = require("mapElements")
r0_1 = r0_1.physicsData
r0_1 = r0_1(r0_0)
local r0_2 = require("mapInfo")
local r0_3 = require("storyboard")
local r0_4 = {}
local r0_5 = {
    "null", "1Av", "1B", "1C1-1", "1C1-2", "1C1-3", "1C1-4", "1C2-1", "1C2-2", "1C2-3", "1D1-1",
    "1D1-2", "1D2-1", "1D2-2", "1E1-1", "1E1-2", "1E2-1", "1E2-2", "1F1-1", "1F1-2", "1F1-3",
    "1F1-4", "1F2-1", "1F2-2", "1F2-3", "1G1-1", "1G1-2", "1G1-3", "1G2-1", "1G2-2", "1G2-3",
    "1H1-1", "1H1-2", "1H1-3", "1H2-1", "1H2-2", "R1Av", "R1B", "R1C1-1", "R1C1-2", "R1C1-3",
    "R1C1-4", "R1C2-1", "R1C2-2", "R1C2-3", "R1D1-1", "R1D1-2", "R1D2-1", "R1D2-2", "R1E1-1",
    "R1E1-2", "R1E2-1", "R1E2-2", "R1F1-1", "R1F1-2", "R1F1-3", "R1F1-4", "R1F2-1", "R1F2-2",
    "R1F2-3", "R1G1-1", "R1G1-2", "R1G1-3", "R1G2-1", "R1G2-2", "R1G2-3", "R1H1-1", "R1H1-2",
    "R1H1-3", "R1H2-1", "R1H2-2", "2A1-1", "2A1-2", "2A2-1", "2A2-2", "2B", "2C", "R2A1-1", "R2A1-2",
    "R2A2-1", "R2A2-2", "R2B", "R2C", "3A", "3B1", "3B2", "3C1", "3C2", "3D1-1", "3D1-2", "3D2-1",
    "3D2-2", "3E1-1", "3E1-2", "3E2-1", "3E2-2", "3F1-1", "3F1-2", "3F2-1", "3F2-2", "3G1-1",
    "3G1-2", "3G1-3", "3G2-1", "3G2-2", "3G2-3", "3H1-1", "3H1-2", "3H1-3", "3H2-1", "3H2-2",
    "3H2-3", "3I1-1", "3I1-2", "3I1-3", "3I1-4", "3I2-1", "3I2-2", "3I2-3", "3I2-4", "R3A", "R3B1",
    "R3B2", "R3C1", "R3C2", "R3D1-1", "R3D1-2", "R3D2-1", "R3D2-2", "R3E1-1", "R3E1-2", "R3E2-1",
    "R3E2-2", "R3F1-1", "R3F1-2", "R3F2-1", "R3F2-2", "R3G1-1", "R3G1-2", "R3G1-3", "R3G2-1",
    "R3G2-2", "R3G2-3", "R3H1-1", "R3H1-2", "R3H1-3", "R3H2-1", "R3H2-2", "R3H2-3", "R3I1-1",
    "R3I1-2", "R3I1-3", "R3I1-4", "R3I2-1", "R3I2-2", "R3I2-3", "R3I2-4", "busk1", "busk2", "busk3",
    "Rbusk1", "Rbusk2", "Rbusk3", "tre1", "tre2", "tre3", "tre4", "Rtre1", "Rtre2", "Rtre3", "Rtre4",
    "veg1", "veg2", "veg3", "veg4", "Rveg1", "Rveg2", "Rveg3", "Rveg4", "stone1-1-1", "stone1-1-2",
    "stone2-1-1", "stone2-1-2", "stone3-1-1", "stone3-1-2", "stone4-1-1", "stone4-1-2",
    "Rstone1-1-1", "Rstone1-1-2", "Rstone2-1-1", "Rstone2-1-2", "Rstone3-1-1", "Rstone3-1-2",
    "Rstone4-1-1", "Rstone4-1-2", "Stup1", "Stup2", "Stup3", "Stup4", "RStup1", "RStup2", "RStup3",
    "RStup4", "powerUp", "Goal", "stotte1", "stotte1-2", "stotte1v2", "stotte1v2-2", "stotte2",
    "stotte2-2", "Rstotte1", "Rstotte1-2", "Rstotte2", "RStotte2-2", "gele1", "gele2", "gele3",
    "is1", "is2", "is3", "slow1", "slow2", "slow3", "0Av", "0A2v", "0Bv", "0Cv", "0Dv", "0Ev", "0Fv",
    "R0Av", "R0A2v", "R0Bv", "R0Cv", "R0Dv", "R0Ev", "R0Fv", "veg5", "veg6", "Rveg5", "Rveg6",
    "tree1-1", "tree1-2", "tree2-1", "tree2-2", "tree3", "Rtree1-1", "Rtree1-2", "Rtree2-1",
    "Rtree2-2", "Rtree3", "candyStone1-1", "candyStone1-2", "candyStone2-1", "candyStone2-2",
    "candyStone3-1", "candyStone3-2", "candyStone4-1", "candyStone4-2", "RcandyStone1-1",
    "RcandyStone1-2", "RcandyStone2-1", "RcandyStone2-2", "RcandyStone3-1", "RcandyStone3-2",
    "RcandyStone4-1", "RcandyStone4-2", "stottev", "0stotte1-1", "0stotte1-2", "0stotte1-3",
    "0stotte2-1", "0stotte2-2", "0stotte2-3", "0stotte3-1", "0stotte3-2", "0stotte3-3",
    "R0stotte1-1", "R0stotte1-2", "R0stotte1-3", "R0stotte2-1", "R0stotte2-2", "R0stotte2-3",
    "R0stotte3-1", "R0stotte3-2", "R0stotte3-3", "RSlide1-1", "RSlide1-2", "RSlide1-3", "RSlide1-4",
    "RSlide2-1", "RSlide2-2", "RSlide2-3", "Jump1", "Jump2", "Br_0-0", "Br_0-1", "Br_1-1", "Br_1-2",
    "Br_2-1", "Br_2-2", "Br_3-1", "RBr_0-0", "RBr_0-1", "RBr_1-1", "RBr_1-2", "RBr_2-1", "RBr_2-2",
    "RBr_3-1", "Slide1-1", "Slide1-2", "Slide1-3", "Slide1-4", "Slide2-1", "Slide2-2", "Slide2-3"
}

local function r0_6(p1_0, p1_1, p1_2) -- proto#1 params=3 locals=7 upvalues=1 vararg=false lines=331-342
    local r1_0 = display.newImageRect("images/map/element/forest/crate.png", 80, 50)
    r1_0.x = p1_0
    r1_0.y = p1_1
    r0_3.powerUpPositions[#r0_3.powerUpPositions + 1] = { p1_0, p1_1, 0, 0, 0, 0 }
    local r1_1 = { 13, -13, 13, 13, -13, 13, -13, -13 }
    physics.addBody(r1_0, { shape = r1_1, isSensor = true, filter = obstacleFilter })
    r1_0.bodyType = "static"
    r1_0.powerUp = true
    return r1_0
end

function r0_4.createMapElement(p2_0, p2_1, p2_2, p2_3) -- proto#2 params=4 locals=22 upvalues=4 vararg=false lines=347-426
    local r2_0 = r0_5[p2_2]
    if r2_0 == "powerUp" then
        return r0_6(p2_0, p2_1, p2_3)
    end
    if r2_0 == "1Av" or r2_0 == "1Bv" or r2_0 == "R1Av" or r2_0 == "R1Bv" then
        r2_0 = r2_0 .. math.random(4)
    elseif r2_0 == "0Av" or r2_0 == "R0Av" or r2_0 == "0Cv" or r2_0 == "R0Cv" then
        r2_0 = r2_0 .. math.random(4)
    elseif r2_0 == "0Bv" or r2_0 == "R0Bv" then
        r2_0 = r2_0 .. math.random(6)
    elseif r2_0 == "0Dv" or r2_0 == "R0Dv" or r2_0 == "0Ev" or r2_0 == "R0Ev" then
        r2_0 = r2_0 .. math.random(3)
    elseif r2_0 == "0Fv" or r2_0 == "R0Fv" then
        r2_0 = r2_0 .. math.random(2)
    elseif r2_0 == "stottev" then
        r2_0 = r2_0 .. math.random(4)
    end
    local r2_1 = nil
    local r2_2 = r0_2.getMapElementTheme(p2_3)
    local r2_3 = "images/map/element/" .. r2_2 .. "/"
    if r2_0 == "tre1" or r2_0 == "tre2" or r2_0 == "tre3" or r2_0 == "tre4" then
        r2_1 = display.newImageRect(r2_3 .. r2_0 .. ".png", 160, 100)
        r2_1.anchorX = 0
        r2_1.anchorY = 0
    elseif r2_0:sub(1, 1) == "R" then
        r2_1 = display.newImageRect(r2_3 .. r2_0:sub(2) .. ".png", 80, 50)
        r2_1.xScale = -1
    else
        r2_1 = display.newImageRect(r2_3 .. r2_0 .. ".png", 80, 50)
    end
    if r2_1 == nil then
        r2_1 = display.newImageRect(r2_3 .. "1Av1.png", 80, 50)
    end
    if r2_0 == "gele1" or r2_0 == "gele2" or r2_0 == "gele3" or r2_0 == "Jump1" then
        r2_1.bounce = true
    end
    if r2_0 == "is1" or r2_0 == "is2" or r2_0 == "is3" then
        r2_1.boost = true
    end
    if r2_0 == "RSlide1-1" or r2_0 == "RSlide1-2" or r2_0 == "RSlide1-3" or r2_0 == "RSlide1-4" then
        r2_1.boost2 = true
    end
    if r2_0 == "Slide1-1" or r2_0 == "Slide1-2" or r2_0 == "Slide1-3" or r2_0 == "Slide1-4" then
        r2_1.boost2 = true
    end
    if r2_0 == "slow1" or r2_0 == "slow2" or r2_0 == "slow3" then
        r2_1.slow = true
    end
    r2_1.x = p2_0
    r2_1.y = p2_1
    physics.addBody(r2_1, r0_1:get(r2_0))
    r2_1.bodyType = "static"
    r2_1.mapElement = true
    return r2_1
end

return r0_4
