-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}
local r0_1, r0_2 = nil, 250
local r0_3, r0_4, r0_5, r0_6, r0_7 = nil, nil, nil, nil, nil
local r0_8 = 0
local r0_9 = require("mapInfo")
local r0_10 = require("storyboard")

local function r0_11(p1_0, p1_1, p1_2, p1_3, p1_4, p1_5) -- proto#1 params=6 locals=1 upvalues=0 vararg=false lines=14-20
    local r1_0 = display.newImageRect(p1_0, p1_3, p1_4)
    r1_0.anchorX = 0
    r1_0.anchorY = 1
    r1_0.x = p1_1
    r1_0.y = p1_2
    p1_5:insert(r1_0)
end

local function r0_12(p2_0, p2_1, p2_2) -- proto#2 params=3 locals=10 upvalues=5 vararg=false lines=24-39
    local r2_0 = (r0_6 - p2_1) * r0_4
    local r2_1 = math.random
    r2_0 = r2_0 + r2_1(-80, 80)
    r2_1 = r0_8 + 20
    r2_1 = r2_1 + math.random(0, r0_3 * 2)
    r0_8 = r2_1
    local r2_2
    if p2_0 == 1 then
        local r2_3 = math.random(6)
        local r2_4 = r2_3
        r2_2 = "images/map/background/forest/cloud" .. r2_4 .. ".png"
    elseif p2_0 == 2 then
        local r2_5 = math.random(6)
        local r2_6 = r2_5
        r2_2 = "images/map/background/candy/cloud" .. r2_6 .. ".png"
    end
    r0_11(r2_2, r2_1, r2_0, 200, 100, p2_2)
end

local function r0_13(p3_0) -- proto#3 params=1 locals=0 upvalues=3 vararg=false lines=41-49
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 8) * r0_4, 1050, 375, p3_0)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 7) * r0_4, 1050, 375, p3_0)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 6) * r0_4, 1050, 375, p3_0)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 6) * r0_4, 1050, 375, p3_0)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 7) * r0_4, 1050, 375, p3_0)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 8) * r0_4, 1050, 375, p3_0)
end

local function r0_14(p4_0, p4_1, p4_2, p4_3, p4_4) -- proto#4 params=5 locals=2 upvalues=7 vararg=false lines=51-66
    r0_13(p4_2)
    for r4_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p4_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_sundown.png", 0, 360, 480, 360, p4_4)
end

local function r0_15(p5_0, p5_1, p5_2, p5_3, p5_4) -- proto#5 params=5 locals=2 upvalues=8 vararg=false lines=68-87
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p5_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p5_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p5_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p5_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p5_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p5_2)
    for r5_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p5_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 507
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p5_4)
end

local function r0_16(p6_0, p6_1, p6_2, p6_3, p6_4) -- proto#6 params=5 locals=2 upvalues=7 vararg=false lines=89-101
    r0_13(p6_2)
    for r6_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p6_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 507
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p6_4)
end

local function r0_17(p7_0, p7_1, p7_2, p7_3, p7_4) -- proto#7 params=5 locals=2 upvalues=8 vararg=false lines=103-121
    r0_11("images/map/background/forest/bkg_mountains.png", -490, (r0_6 - 9) * r0_4, 1050, 375, p7_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1080, (r0_6 - 5) * r0_4, 1050, 375, p7_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 5) * r0_4, 1050, 375, p7_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 6) * r0_4, 1050, 375, p7_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 7) * r0_4, 1050, 375, p7_2)
    for r7_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p7_3)
    end
    r0_2 = 257
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p7_4)
end

local function r0_18(p8_0, p8_1, p8_2, p8_3, p8_4) -- proto#8 params=5 locals=2 upvalues=7 vararg=false lines=123-135
    r0_13(p8_2)
    for r8_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p8_3)
    end
    r0_2 = 257
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sundown.png", 0, 360, 480, 360, p8_4)
end

local function r0_19(p9_0, p9_1, p9_2, p9_3, p9_4) -- proto#9 params=5 locals=2 upvalues=8 vararg=false lines=137-155
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p9_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p9_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p9_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p9_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p9_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p9_2)
    for r9_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p9_3)
    end
    r0_2 = 257
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p9_4)
end

local function r0_20(p10_0, p10_1, p10_2, p10_3, p10_4) -- proto#10 params=5 locals=2 upvalues=8 vararg=false lines=157-185
    r0_11("images/map/background/candy/bakgrunn2.png", -150, (r0_6 - 19) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 400, (r0_6 - 17) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 1200, (r0_6 - 18) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 1700, (r0_6 - 15.5) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 2060, (r0_6 - 16) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 3500, (r0_6 - 15.5) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 4000, (r0_6 - 17) * r0_4, 818, 320, p10_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 4800, (r0_6 - 17) * r0_4, 818, 320, p10_2)
    for r10_0 = 1, r0_5 * 0.1 do
        r0_12(2, 25, p10_3)
    end
    r0_2 = 357
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p10_4)
end

local function r0_21(p11_0, p11_1, p11_2, p11_3, p11_4) -- proto#11 params=5 locals=2 upvalues=8 vararg=false lines=187-203
    r0_11("images/map/background/candy/bakgrunn1.png", -100, (r0_6 - 9) * r0_4, 1090, 426, p11_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p11_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 1960, (r0_6 - 8) * r0_4, 1050, 375, p11_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p11_2)
    for r11_0 = 1, r0_5 * 0.1 do
        r0_12(2, 15, p11_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_sundown.png", 0, 360, 480, 360, p11_4)
end

local function r0_22(p12_0, p12_1, p12_2, p12_3, p12_4) -- proto#12 params=5 locals=2 upvalues=8 vararg=false lines=205-223
    r0_11("images/map/background/candy/bakgrunn1.png", 90, (r0_6 - 9) * r0_4, 1090, 426, p12_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p12_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p12_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p12_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 3920, (r0_6 - 8) * r0_4, 1050, 375, p12_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p12_2)
    for r12_0 = 1, r0_5 * 0.1 do
        r0_12(2, 15, p12_3)
    end
    r0_2 = 507
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p12_4)
end

local function r0_23(p13_0, p13_1, p13_2, p13_3, p13_4) -- proto#13 params=5 locals=2 upvalues=8 vararg=false lines=225-243
    r0_11("images/map/background/candy/bakgrunn1.png", 290, (r0_6 - 7) * r0_4, 1050, 375, p13_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p13_2)
    for r13_0 = 1, r0_5 * 0.1 do
        r0_12(2, 15, p13_3)
    end
    r0_2 = 807
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p13_4)
end

local function r0_24(p14_0, p14_1, p14_2, p14_3, p14_4) -- proto#14 params=5 locals=2 upvalues=8 vararg=false lines=245-261
    r0_11("images/map/background/candy/bakgrunn1.png", -100, (r0_6 - 16) * r0_4, 1090, 426, p14_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 980, (r0_6 - 16) * r0_4, 1050, 375, p14_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 1960, (r0_6 - 15) * r0_4, 1050, 375, p14_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 2940, (r0_6 - 16) * r0_4, 1050, 375, p14_2)
    for r14_0 = 1, r0_5 * 0.1 do
        r0_12(2, 15, p14_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_sundown.png", 0, 360, 480, 360, p14_4)
end

local function r0_25(p15_0, p15_1, p15_2, p15_3, p15_4) -- proto#15 params=5 locals=2 upvalues=8 vararg=false lines=263-279
    r0_11("images/map/background/candy/bakgrunn1.png", -100, (r0_6 - 22) * r0_4, 1090, 426, p15_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 980, (r0_6 - 22) * r0_4, 1050, 375, p15_2)
    r0_11("images/map/background/candy/bakgrunn1.png", 1960, (r0_6 - 21) * r0_4, 1050, 375, p15_2)
    r0_11("images/map/background/candy/bakgrunn2.png", 2940, (r0_6 - 22) * r0_4, 1050, 375, p15_2)
    for r15_0 = 1, r0_5 * 0.1 do
        r0_12(2, 15, p15_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_sundown.png", 0, 360, 480, 360, p15_4)
end

local function r0_26(p16_0, p16_1, p16_2, p16_3, p16_4) -- proto#16 params=5 locals=2 upvalues=8 vararg=false lines=281-299
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p16_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p16_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p16_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p16_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p16_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p16_2)
    for r16_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p16_3)
    end
    r0_2 = 507
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p16_4)
end

local function r0_27(p17_0, p17_1, p17_2, p17_3, p17_4) -- proto#17 params=5 locals=2 upvalues=8 vararg=false lines=301-319
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p17_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p17_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p17_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p17_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p17_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p17_2)
    for r17_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p17_3)
    end
    r0_2 = 357
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p17_4)
end

local function r0_28(p18_0, p18_1, p18_2, p18_3, p18_4) -- proto#18 params=5 locals=2 upvalues=8 vararg=false lines=321-340
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p18_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p18_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p18_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p18_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p18_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p18_2)
    for r18_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p18_3)
    end
    r0_2 = 507
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p18_4)
end

local function r0_29(p19_0, p19_1, p19_2, p19_3, p19_4) -- proto#19 params=5 locals=2 upvalues=8 vararg=false lines=342-360
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 7) * r0_4, 1050, 375, p19_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 7) * r0_4, 1050, 375, p19_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 7) * r0_4, 1050, 375, p19_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 7) * r0_4, 1050, 375, p19_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 7) * r0_4, 1050, 375, p19_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 7) * r0_4, 1050, 375, p19_2)
    for r19_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p19_3)
    end
    r0_2 = 657
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p19_4)
end

local function r0_30(p20_0, p20_1, p20_2, p20_3, p20_4) -- proto#20 params=5 locals=2 upvalues=7 vararg=false lines=362-375
    r0_13(p20_2)
    for r20_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p20_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p20_4)
end

local function r0_31(p21_0, p21_1, p21_2, p21_3, p21_4) -- proto#21 params=5 locals=2 upvalues=7 vararg=false lines=377-390
    r0_13(p21_2)
    for r21_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p21_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p21_4)
end

local function r0_32(p22_0, p22_1, p22_2, p22_3, p22_4) -- proto#22 params=5 locals=2 upvalues=7 vararg=false lines=392-405
    r0_13(p22_2)
    for r22_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p22_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 407
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p22_4)
end

local function r0_33(p23_0, p23_1, p23_2, p23_3, p23_4) -- proto#23 params=5 locals=2 upvalues=8 vararg=false lines=406-425
    r0_11("images/map/background/beach/bkg_mountains.png", -400, (r0_6 - 8) * r0_4, 1050, 375, p23_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 600, (r0_6 - 8) * r0_4, 1050, 375, p23_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 1600, (r0_6 - 8) * r0_4, 1050, 375, p23_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 2600, (r0_6 - 8) * r0_4, 1050, 375, p23_2)
    for r23_0 = 1, r0_5 * 0.05 do
        r0_12(1, 15, p23_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 407
    r0_11("images/map/background/beach/bkg_sundown.png", 0, 360, 480, 360, p23_4)
end

local function r0_34(p24_0, p24_1, p24_2, p24_3, p24_4) -- proto#24 params=5 locals=2 upvalues=8 vararg=false lines=427-444
    r0_11("images/map/background/beach/bkg_mountains.png", -45, (r0_6 - 15) * r0_4 + 10, 1050, 375, p24_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 935, (r0_6 - 15) * r0_4 + 10, 1050, 375, p24_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 1915, (r0_6 - 15) * r0_4 + 10, 1050, 375, p24_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 2895, (r0_6 - 15) * r0_4 + 10, 1050, 375, p24_2)
    for r24_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p24_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 957
    r0_11("images/map/background/beach/bkg_day.png", 0, 360, 480, 360, p24_4)
end

local function r0_35(p25_0, p25_1, p25_2, p25_3, p25_4) -- proto#25 params=5 locals=2 upvalues=8 vararg=false lines=446-466
    r0_11("images/map/background/beach/bkg_mountains.png", -300, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 700, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 1700, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 2700, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 3700, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 4700, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 5700, (r0_6 - 8) * r0_4 + 10, 1050, 375, p25_2)
    for r25_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p25_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 457
    r0_11("images/map/background/beach/bkg_sundown.png", 0, 360, 480, 360, p25_4)
end

local function r0_36(p26_0, p26_1, p26_2, p26_3, p26_4) -- proto#26 params=5 locals=2 upvalues=8 vararg=false lines=468-486
    r0_11("images/map/background/beach/bkg_mountains.png", -45, (r0_6 - 8) * r0_4 + 10, 1050, 375, p26_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 935, (r0_6 - 8) * r0_4 + 10, 1050, 375, p26_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 1915, (r0_6 - 8) * r0_4 + 10, 1050, 375, p26_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 2895, (r0_6 - 8) * r0_4 + 10, 1050, 375, p26_2)
    for r26_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p26_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/beach/bkg_sunup.png", 0, 360, 480, 360, p26_4)
end

local function r0_37(p27_0, p27_1, p27_2, p27_3, p27_4) -- proto#27 params=5 locals=2 upvalues=8 vararg=false lines=488-506
    r0_11("images/map/background/beach/bkg_mountains.png", -45, (r0_6 - 13) * r0_4 + 10, 1050, 375, p27_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 935, (r0_6 - 13) * r0_4 + 10, 1050, 375, p27_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 1915, (r0_6 - 13) * r0_4 + 10, 1050, 375, p27_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 2895, (r0_6 - 13) * r0_4 + 10, 1050, 375, p27_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 3875, (r0_6 - 13) * r0_4 + 10, 1050, 375, p27_2)
    for r27_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p27_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 157
    r0_11("images/map/background/beach/bkg_sunup.png", 0, 360, 480, 360, p27_4)
end

local function r0_38(p28_0, p28_1, p28_2, p28_3, p28_4) -- proto#28 params=5 locals=2 upvalues=8 vararg=false lines=508-526
    r0_11("images/map/background/beach/bkg_mountains.png", -45, (r0_6 - 8) * r0_4 + 10, 1050, 375, p28_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 935, (r0_6 - 8) * r0_4 + 10, 1050, 375, p28_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 1915, (r0_6 - 8) * r0_4 + 10, 1050, 375, p28_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 2895, (r0_6 - 8) * r0_4 + 10, 1050, 375, p28_2)
    r0_11("images/map/background/beach/bkg_mountains.png", 3875, (r0_6 - 8) * r0_4 + 10, 1050, 375, p28_2)
    for r28_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p28_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/beach/bkg_day.png", 0, 360, 480, 360, p28_4)
end

local function r0_39(p29_0, p29_1, p29_2, p29_3, p29_4) -- proto#29 params=5 locals=2 upvalues=8 vararg=false lines=528-546
    r0_11("images/map/background/fall/bkg_mountains.png", -45, (r0_6 - 8) * r0_4 + 10, 1050, 375, p29_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 935, (r0_6 - 8) * r0_4 + 10, 1050, 375, p29_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 1915, (r0_6 - 8) * r0_4 + 10, 1050, 375, p29_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 2895, (r0_6 - 8) * r0_4 + 10, 1050, 375, p29_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 3875, (r0_6 - 8) * r0_4 + 10, 1050, 375, p29_2)
    for r29_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p29_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/fall/bkg_sunup.png", 0, 360, 480, 360, p29_4)
end

local function r0_40(p30_0, p30_1, p30_2, p30_3, p30_4) -- proto#30 params=5 locals=2 upvalues=8 vararg=false lines=548-566
    r0_11("images/map/background/fall/bkg_mountains.png", -45, (r0_6 - 8) * r0_4 + 10, 1050, 375, p30_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 935, (r0_6 - 8) * r0_4 + 10, 1050, 375, p30_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 1915, (r0_6 - 8) * r0_4 + 10, 1050, 375, p30_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 2895, (r0_6 - 8) * r0_4 + 10, 1050, 375, p30_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 3875, (r0_6 - 8) * r0_4 + 10, 1050, 375, p30_2)
    for r30_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p30_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/fall/bkg_day.png", 0, 360, 480, 360, p30_4)
end

local function r0_41(p31_0, p31_1, p31_2, p31_3, p31_4) -- proto#31 params=5 locals=2 upvalues=8 vararg=false lines=568-586
    r0_11("images/map/background/fall/bkg_mountains.png", -45, (r0_6 - 8) * r0_4 + 10, 1050, 375, p31_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 935, (r0_6 - 8) * r0_4 + 10, 1050, 375, p31_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 1915, (r0_6 - 8) * r0_4 + 10, 1050, 375, p31_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 2895, (r0_6 - 8) * r0_4 + 10, 1050, 375, p31_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 3875, (r0_6 - 8) * r0_4 + 10, 1050, 375, p31_2)
    for r31_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p31_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/fall/bkg_day.png", 0, 360, 480, 360, p31_4)
end

local function r0_42(p32_0, p32_1, p32_2, p32_3, p32_4) -- proto#32 params=5 locals=2 upvalues=8 vararg=false lines=588-606
    r0_11("images/map/background/fall/bkg_mountains.png", -45, (r0_6 - 8) * r0_4 + 10, 1050, 375, p32_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 935, (r0_6 - 8) * r0_4 + 10, 1050, 375, p32_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 1915, (r0_6 - 8) * r0_4 + 10, 1050, 375, p32_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 2895, (r0_6 - 8) * r0_4 + 10, 1050, 375, p32_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 3875, (r0_6 - 8) * r0_4 + 10, 1050, 375, p32_2)
    for r32_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p32_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/fall/bkg_sunup.png", 0, 360, 480, 360, p32_4)
end

local function r0_43(p33_0, p33_1, p33_2, p33_3, p33_4) -- proto#33 params=5 locals=2 upvalues=8 vararg=false lines=608-625
    r0_11("images/map/background/fall/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p33_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p33_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p33_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p33_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p33_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p33_2)
    for r33_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p33_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 507
    r0_11("images/map/background/fall/bkg_sunup.png", 0, 360, 480, 360, p33_4)
end

local function r0_44(p34_0, p34_1, p34_2, p34_3, p34_4) -- proto#34 params=5 locals=2 upvalues=8 vararg=false lines=627-645
    r0_11("images/map/background/fall/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p34_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p34_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p34_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p34_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p34_2)
    r0_11("images/map/background/fall/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p34_2)
    for r34_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p34_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 457
    r0_11("images/map/background/beach/bkg_sundown.png", 0, 360, 480, 360, p34_4)
end

local function r0_45(p35_0, p35_1, p35_2, p35_3, p35_4) -- proto#35 params=5 locals=2 upvalues=8 vararg=false lines=647-665
    r0_11("images/map/background/snow/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p35_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p35_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p35_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p35_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p35_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p35_2)
    for r35_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p35_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/snow/bkg_sundown.png", 0, 360, 480, 360, p35_4)
end

local function r0_46(p36_0, p36_1, p36_2, p36_3, p36_4) -- proto#36 params=5 locals=2 upvalues=8 vararg=false lines=667-684
    r0_11("images/map/background/snow/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p36_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p36_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p36_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p36_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p36_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p36_2)
    for r36_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p36_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 507
    r0_11("images/map/background/snow/bkg_sunup.png", 0, 360, 480, 360, p36_4)
end

local function r0_47(p37_0, p37_1, p37_2, p37_3, p37_4) -- proto#37 params=5 locals=2 upvalues=8 vararg=false lines=686-703
    r0_11("images/map/background/snow/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p37_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p37_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p37_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p37_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p37_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p37_2)
    for r37_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p37_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 507
    r0_11("images/map/background/snow/bkg_day.png", 0, 360, 480, 360, p37_4)
end

local function r0_48(p38_0, p38_1, p38_2, p38_3, p38_4) -- proto#38 params=5 locals=2 upvalues=8 vararg=false lines=705-722
    r0_11("images/map/background/snow/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p38_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p38_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p38_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p38_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p38_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p38_2)
    for r38_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p38_3)
    end
    r0_2 = 507
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p38_4)
end

local function r0_49(p39_0, p39_1, p39_2, p39_3, p39_4) -- proto#39 params=5 locals=2 upvalues=8 vararg=false lines=724-742
    r0_11("images/map/background/snow/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p39_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 980, (r0_6 - 9) * r0_4, 1050, 375, p39_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p39_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 2940, (r0_6 - 8) * r0_4, 1050, 375, p39_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p39_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p39_2)
    for r39_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p39_3)
    end
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_2 = 357
    r0_11("images/map/background/forest/bkg_day.png", 0, 360, 480, 360, p39_4)
end

local function r0_50(p40_0, p40_1, p40_2, p40_3, p40_4) -- proto#40 params=5 locals=2 upvalues=8 vararg=false lines=744-763
    r0_11("images/map/background/snow/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p40_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p40_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p40_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p40_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p40_2)
    r0_11("images/map/background/snow/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p40_2)
    for r40_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p40_3)
    end
    r0_2 = 257
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/snow/bkg_sunup.png", 0, 360, 480, 360, p40_4)
end

local function r0_51(p41_0, p41_1, p41_2, p41_3, p41_4) -- proto#41 params=5 locals=2 upvalues=8 vararg=false lines=765-784
    r0_11("images/map/background/forest/bkg_mountains.png", 0, (r0_6 - 9) * r0_4, 1050, 375, p41_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 980, (r0_6 - 8) * r0_4, 1050, 375, p41_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 1960, (r0_6 - 9) * r0_4, 1050, 375, p41_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 2940, (r0_6 - 9) * r0_4, 1050, 375, p41_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 3920, (r0_6 - 9) * r0_4, 1050, 375, p41_2)
    r0_11("images/map/background/forest/bkg_mountains.png", 4900, (r0_6 - 9) * r0_4, 1050, 375, p41_2)
    for r41_0 = 1, r0_5 * 0.1 do
        r0_12(1, 15, p41_3)
    end
    r0_2 = 257
    r0_1 = r0_3 * (r0_5 - 14) + 35
    r0_11("images/map/background/forest/bkg_sunup.png", 0, 360, 480, 360, p41_4)
end

function r0_0.generateBackgrounds(p42_0, p42_1, p42_2, p42_3, p42_4) -- proto#42 params=5 locals=0 upvalues=40 vararg=false lines=788-869
    r0_8 = 0
    if r0_7 == 1 then
        r0_14(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 2 then
        r0_15(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 3 then
        r0_16(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 4 then
        r0_17(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 5 then
        r0_18(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 6 then
        r0_19(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 7 then
        r0_20(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 8 then
        r0_21(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 9 then
        r0_22(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 10 then
        r0_23(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 11 then
        r0_24(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 12 then
        r0_25(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 13 then
        r0_26(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 14 then
        r0_27(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 15 then
        r0_28(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 16 then
        r0_29(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 17 then
        r0_30(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 18 then
        r0_31(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 19 then
        r0_32(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 20 then
        r0_33(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 21 then
        r0_34(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 22 then
        r0_35(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 23 then
        r0_36(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 24 then
        r0_37(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 25 then
        r0_38(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 26 then
        r0_39(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 27 then
        r0_40(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 28 then
        r0_41(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 29 then
        r0_42(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 30 then
        r0_43(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 31 then
        r0_44(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 32 then
        r0_45(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 33 then
        r0_46(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 34 then
        r0_47(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 35 then
        r0_48(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 36 then
        r0_49(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 37 then
        r0_50(p42_0, p42_1, p42_2, p42_3, p42_4)
    elseif r0_7 == 38 then
        r0_51(p42_0, p42_1, p42_2, p42_3, p42_4)
    end
end

function r0_0.insertMapName(p43_0, p43_1) -- proto#43 params=2 locals=4 upvalues=4 vararg=false lines=872-881
    local r43_0 = display.newText(r0_9.getMapName(r0_7), 0, 0, r0_10.gameDataTable.font, 80)
    r43_0:setFillColor(1, 1, 1)
    r43_0.xScale = 0.5
    r43_0.yScale = 0.5
    r43_0.x = p43_1 + 90
    r43_0.y = r0_2 + 75
    p43_0:insert(r43_0)
end

function r0_0.setVariables(p44_0, p44_1, p44_2, p44_3, p44_4) -- proto#44 params=5 locals=0 upvalues=5 vararg=false lines=884-890
    r0_7 = p44_0
    r0_3 = p44_1
    r0_4 = p44_2
    r0_5 = p44_3
    r0_6 = p44_4
end

function r0_0.getGoalX() -- proto#45 params=0 locals=0 upvalues=1 vararg=false lines=893-895
    return r0_1
end

function r0_0.getStartYPos() -- proto#46 params=0 locals=0 upvalues=1 vararg=false lines=898-900
    return r0_2
end

return r0_0
