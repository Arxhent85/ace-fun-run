-- [unluac error] diagnostic pseudocode: recovery errors; output may not recompile or preserve behavior

-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}
local r0_1 = require("accessories")
local r0_2 = require("sprite")
local r0_3 = require("storyboard")
local r0_4 = 1

local function r0_5(p1_0) -- proto#1 params=1 locals=0 upvalues=2 vararg=false lines=8-17
    p1_0 = not r0_1 and 1
        or not r0_1.getAvatarList() and 1
        or #r0_1.getAvatarList() < p1_0 and 1
        or p1_0
    r0_4 = p1_0
end

local function r0_6(p2_0) -- proto#2 params=1 locals=3 upvalues=1 vararg=false lines=19-29
    local r2_0 = {}
    if p2_0[1] >= 100 then
        for r2_1 = 1, #p2_0 do
            local r2_2 = r0_1.getTableIndex(p2_0[r2_1])
            r2_0[r2_1] = r2_2
        end
    else
        r2_0 = p2_0
    end
    return r2_0
end

local function r0_7(p3_0) -- proto#3 params=1 locals=2 upvalues=1 vararg=false lines=31-39
    local r3_0
    if p3_0 >= 100 then
        r3_0 = r0_1.getTableIndex(p3_0)
    else
        r3_0 = p3_0
    end
    return r3_0
end

function r0_0.updateAvatar(p4_0) -- proto#4 params=1 locals=73 upvalues=6 vararg=false lines=41-124
    local r4_0 = r0_6(p4_0)
    local r4_1 = r0_3.gameDataTable.animations
    r0_5(r4_0[1])
    local r4_2 = r0_1.getAvatarList()
    local r4_3 = r0_1.getHatList(r0_4)
    local r4_4 = r0_1.getItemList(r0_4)
    local r4_5 = r0_1.getBootsList(r0_4)
    local r4_6 = 0
    local r4_7 = r4_0[1]
    local r4_8 = r4_2[#r4_2 < r4_7 and 1 or r4_7][6]
    local r4_9 = "avatar"
    if r4_1[r4_9][0] then
        r4_1[r4_9][r4_6][1]:dispose()
        local r4_10 = r4_1[r4_9]
        local r4_11 = {
            r0_2.newSpriteSheetFromData("images/game/avatar/" .. r4_8 .. ".png", require(r4_8).getSpriteSheetData()),
            r4_8
        }
        r4_10[r4_6] = r4_11
    else
        local r4_12 = r4_1[r4_9]
        local r4_13 = {
            r0_2.newSpriteSheetFromData("images/game/avatar/" .. r4_8 .. ".png", require(r4_8).getSpriteSheetData()),
            r4_8
        }
        r4_12[r4_6] = r4_13
    end
    r4_7 = r4_0[2]
    r4_7 = #r4_3 < r4_7 and 1 or r4_7
    r4_8 = r4_3[r4_7][4]
    local r4_14 = r4_2[r0_4][4]
    local r4_15 = nil
    if r4_7 > 1 then
        r4_15 = r4_14 .. r4_8
    else
        r4_15 = r4_8
    end
    local r4_16 = "hat"
    r4_15 = r4_14 == "goldfox" and "goldfoxHeadSprite" or r4_15
    local r4_17 = r4_1[r4_16]
    if r4_17[r4_6] then
        local r4_18 = r4_1[r4_16]
        r4_18 = r4_18[r4_6][1]
        r4_18:dispose()
        local r4_19 = r4_1[r4_16]
        local r4_20 = {}
        local r4_21 = r0_2.newSpriteSheetFromData
        local r4_22, r4_23, r4_24 = r4_14, "/", r4_15
        local r4_25 = "images/game/accessory/hat/" .. r4_22 .. r4_23 .. r4_24 .. ".png"
        r4_22 = require
        r4_23 = r4_15
        r4_24 = nil
        r4_22 = r4_22(r4_23)
        r4_22 = r4_22.getSpriteSheetData
        r4_21 = r4_21(r4_25, r4_22())
        r4_25 = r4_15
        -- [unluac error] HIR proto#4 still contains residual table-set-list during AST lowering
        r4_19[r4_6] = r4_20
    else
        local r4_26 = r4_1[r4_16]
        local r4_27 = {}
        local r4_28 = r0_2.newSpriteSheetFromData
        local r4_29, r4_30, r4_31 = r4_14, "/", r4_15
        local r4_32 = "images/game/accessory/hat/" .. r4_29 .. r4_30 .. r4_31 .. ".png"
        r4_29 = require
        r4_30 = r4_15
        r4_31 = nil
        r4_29 = r4_29(r4_30)
        r4_29 = r4_29.getSpriteSheetData
        r4_28 = r4_28(r4_32, r4_29())
        r4_32 = r4_15
        -- [unluac error] HIR proto#4 still contains residual table-set-list during AST lowering
        r4_26[r4_6] = r4_27
    end
    r4_7 = r4_0[3]
    r4_7 = #r4_4 < r4_7 and 1 or r4_7
    local r4_33 = r4_4[r4_7]
    r4_8 = r4_33[4]
    if r4_7 > 1 then
        if r4_1.item[r4_6] then
            r4_33 = r4_1.item
            r4_33 = r4_33[r4_6][1]
            r4_33:dispose()
            r4_33 = r4_1.item
            local r4_34 = {}
            local r4_35, r4_36 = r0_2.newSpriteSheetFromData, r4_8
            local r4_37 = "images/game/accessory/item/" .. r4_36 .. ".png"
            r4_36 = require
            r4_36 = r4_36(r4_8)
            r4_36 = r4_36.getSpriteSheetData
            r4_35 = r4_35(r4_37, r4_36())
            r4_37 = r4_8
            -- [unluac error] HIR proto#4 still contains residual table-set-list during AST lowering
            r4_33[r4_6] = r4_34
        else
            r4_33 = r4_1.item
            local r4_38 = {}
            local r4_39, r4_40 = r0_2.newSpriteSheetFromData, r4_8
            local r4_41 = "images/game/accessory/item/" .. r4_40 .. ".png"
            r4_40 = require
            r4_40 = r4_40(r4_8)
            r4_40 = r4_40.getSpriteSheetData
            r4_39 = r4_39(r4_41, r4_40())
            r4_41 = r4_8
            -- [unluac error] HIR proto#4 still contains residual table-set-list during AST lowering
            r4_33[r4_6] = r4_38
        end
        r4_33 = r4_1.item
        r4_33 = r4_33[r4_6]
        r4_33.itemIndex = r4_7
    else
        r4_33 = r4_1.item
        r4_33[r4_6] = nil
    end
    r4_7 = r4_0[4]
    local r4_42 = r4_5[#r4_5 < r4_7 and 1 or r4_7]
    r4_8 = r4_42[4]
    local r4_43 = "boots"
    r4_42 = r4_1[r4_43]
    if r4_42[r4_6] then
        r4_42 = r4_1[r4_43]
        r4_42 = r4_42[r4_6][1]
        r4_42:dispose()
        r4_42 = r4_1[r4_43]
        local r4_44 = {}
        local r4_45, r4_46 = r0_2.newSpriteSheetFromData, r4_8
        local r4_47 = "images/game/accessory/boots/" .. r4_46 .. ".png"
        r4_46 = require
        r4_46 = r4_46(r4_8)
        r4_46 = r4_46.getSpriteSheetData
        r4_45 = r4_45(r4_47, r4_46())
        r4_47 = r4_8
        -- [unluac error] HIR proto#4 still contains residual table-set-list during AST lowering
        r4_42[r4_6] = r4_44
    else
        r4_42 = r4_1[r4_43]
        local r4_48 = {}
        local r4_49, r4_50 = r0_2.newSpriteSheetFromData, r4_8
        local r4_51 = "images/game/accessory/boots/" .. r4_50 .. ".png"
        r4_50 = require
        r4_50 = r4_50(r4_8)
        r4_50 = r4_50.getSpriteSheetData
        r4_49 = r4_49(r4_51, r4_50())
        r4_51 = r4_8
        -- [unluac error] HIR proto#4 still contains residual table-set-list during AST lowering
        r4_42[r4_6] = r4_48
    end
end

function r0_0.changeSpriteAvatar(p5_0, p5_1, p5_2) -- proto#5 params=3 locals=25 upvalues=5 vararg=false lines=127-172
    local r5_0 = r0_3.gameDataTable.animations
    p5_0 = r0_7(p5_0)
    r0_5(p5_0)
    local r5_1 = r0_1.getAvatarList()
    p5_0 = #r5_1 < p5_0 and 1 or p5_0
    local r5_2 = r5_1[p5_0][6]
    local r5_3 = "avatar"
    if r5_0[r5_3][p5_2] then
        local r5_4 = r5_0[r5_3]
        if r5_2 ~= r5_4[p5_2][2] then
            local r5_5 = r5_0[r5_3]
            r5_5 = r5_5[p5_2][1]
            r5_5:dispose()
            local r5_6 = r5_0[r5_3]
            local r5_7 = {}
            local r5_8, r5_9 = r0_2.newSpriteSheetFromData, r5_2
            local r5_10 = "images/game/avatar/" .. r5_9 .. ".png"
            r5_9 = require
            r5_9 = r5_9(r5_2)
            r5_9 = r5_9.getSpriteSheetData
            r5_8 = r5_8(r5_10, r5_9())
            r5_10 = r5_2
            -- [unluac error] HIR proto#5 still contains residual table-set-list during AST lowering
            r5_6[p5_2] = r5_7
        end
    else
        local r5_11 = r5_0[r5_3]
        local r5_12 = {
            r0_2.newSpriteSheetFromData("images/game/avatar/" .. r5_2 .. ".png", require(r5_2).getSpriteSheetData()),
            r5_2
        }
        r5_11[p5_2] = r5_12
    end
    local r5_13 = nil
    if r5_2 == "foxBodySprite"
        or r5_2 == "bearBodySprite"
        or r5_2 == "turtleBodySprite"
        or r5_2 == "bunnyBodySprite"
        or r5_2 == "doeBodySprite"
        or r5_2 == "goldfoxBodySprite" then
        r5_13 = r0_2.newSpriteSet(r5_0[r5_3][p5_2][1], 1, 7)
        r0_2.add(r5_13, "normal", 1, 7, 200, 0)
    else
        r5_13 = r0_2.newSpriteSet(r5_0[r5_3][p5_2][1], 1, 14)
        r0_2.add(r5_13, "normal", 1, 14, 400, 0)
    end
    local r5_14 = r0_2.newSprite(r5_13)
    if p5_1 then
        p5_1:insert(r5_14)
    end
    r5_14:prepare("normal")
    return r5_14
end

function r0_0.changeSpriteBoots(p6_0, p6_1, p6_2) -- proto#6 params=3 locals=20 upvalues=5 vararg=false lines=175-206
    local r6_0 = r0_3.gameDataTable.animations
    p6_0 = r0_7(p6_0)
    local r6_1 = r0_1.getBootsList(r0_4)
    p6_0 = #r6_1 < p6_0 and 1 or p6_0
    local r6_2 = r6_1[p6_0][4]
    local r6_3 = "boots"
    if r6_0[r6_3][p6_2] then
        local r6_4 = r6_0[r6_3]
        if r6_2 ~= r6_4[p6_2][2] then
            local r6_5 = r6_0[r6_3]
            r6_5 = r6_5[p6_2][1]
            r6_5:dispose()
            local r6_6 = r6_0[r6_3]
            local r6_7 = {}
            local r6_8, r6_9 = r0_2.newSpriteSheetFromData, r6_2
            local r6_10 = "images/game/accessory/boots/" .. r6_9 .. ".png"
            r6_9 = require
            r6_9 = r6_9(r6_2)
            r6_9 = r6_9.getSpriteSheetData
            r6_8 = r6_8(r6_10, r6_9())
            r6_10 = r6_2
            -- [unluac error] HIR proto#6 still contains residual table-set-list during AST lowering
            r6_6[p6_2] = r6_7
        end
    else
        local r6_11 = r6_0[r6_3]
        local r6_12 = {
            r0_2.newSpriteSheetFromData("images/game/accessory/boots/" .. r6_2 .. ".png", require(r6_2).getSpriteSheetData()),
            r6_2
        }
        r6_11[p6_2] = r6_12
    end
    local r6_13 = r0_2.newSpriteSet(r6_0[r6_3][p6_2][1], 1, 7)
    r0_2.add(r6_13, "normal", 1, 7, 200, 0)
    local r6_14 = r0_2.newSprite
    r6_14 = r6_14(r6_13)
    if p6_1 then
        p6_1:insert(r6_14)
    end
    r6_14:prepare("normal")
    return r6_14
end

function r0_0.changeSpriteItem(p7_0, p7_1, p7_2) -- proto#7 params=3 locals=22 upvalues=5 vararg=false lines=209-245
    local r7_0 = r0_3.gameDataTable.animations
    p7_0 = r0_7(p7_0)
    local r7_1 = r0_1.getItemList(r0_4)
    local r7_2 = nil
    p7_0 = #r7_1 < p7_0 and 1 or p7_0
    local r7_3 = r7_1[p7_0][4]
    local r7_4 = "item"
    if p7_0 > 1 then
        if r7_0[r7_4][p7_2] then
            local r7_5 = r7_0[r7_4]
            if r7_3 ~= r7_5[p7_2][2] then
                local r7_6 = r7_0[r7_4]
                r7_6 = r7_6[p7_2][1]
                r7_6:dispose()
                local r7_7 = r7_0[r7_4]
                local r7_8 = {}
                local r7_9, r7_10 = r0_2.newSpriteSheetFromData, r7_3
                local r7_11 = "images/game/accessory/item/" .. r7_10 .. ".png"
                r7_10 = require
                r7_10 = r7_10(r7_3)
                r7_10 = r7_10.getSpriteSheetData
                r7_9 = r7_9(r7_11, r7_10())
                r7_11 = r7_3
                -- [unluac error] HIR proto#7 still contains residual table-set-list during AST lowering
                r7_7[p7_2] = r7_8
            end
        else
            local r7_12 = r7_0[r7_4]
            local r7_13 = {
                r0_2.newSpriteSheetFromData("images/game/accessory/item/" .. r7_3 .. ".png", require(r7_3).getSpriteSheetData()),
                r7_3
            }
            r7_12[p7_2] = r7_13
        end
        r7_0[r7_4][p7_2].itemIndex = p7_0
        local r7_14 = r0_2.newSpriteSet(r7_0[r7_4][p7_2][1], 1, 5)
        r0_2.add(r7_14, "normal", 1, 5, 200, 1)
        r7_2 = r0_2.newSprite(r7_14)
        if p7_1 then
            p7_1:insert(r7_2)
        end
        r7_2:prepare("normal")
    end
    return r7_2
end

function r0_0.getSpriteItemSet(p8_0) -- proto#8 params=1 locals=4 upvalues=2 vararg=false lines=248-260
    local r8_0 = r0_3.gameDataTable.animations
    if r8_0.item[p8_0] then
        local r8_1 = r0_2.newSpriteSet
        local r8_2 = r8_0.item
        r8_1 = r8_1(r8_2[p8_0][1], 1, 5)
        r0_2.add(r8_1, "normal", 1, 5, 200, 1)
        return r8_1
    end
    return nil
end

function r0_0.changeSpriteHat(p9_0, p9_1, p9_2) -- proto#9 params=3 locals=36 upvalues=5 vararg=false lines=263-315
    local r9_0 = r0_3.gameDataTable.animations
    p9_0 = r0_7(p9_0)
    local r9_1 = r0_1.getHatList(r0_4)
    local r9_2 = r0_1.getAvatarList()
    local r9_3 = nil
    local r9_4 = r9_2[r0_4][4]
    p9_0 = #r9_1 < p9_0 and 1 or p9_0
    local r9_5 = r9_1[p9_0][4]
    local r9_6, r9_7 = "hat", nil
    if p9_0 > 1 then
        local r9_8 = r9_4
        local r9_9 = r9_5
        r9_7 = r9_8 .. r9_9
    else
        r9_7 = r9_5
    end
    r9_7 = r9_4 == "goldfox" and "goldfoxHeadSprite" or r9_7
    local r9_10 = r9_0[r9_6]
    if r9_10[p9_2] then
        local r9_11 = r9_0[r9_6]
        if r9_7 ~= r9_11[p9_2][2] then
            local r9_12 = r9_0[r9_6]
            r9_12 = r9_12[p9_2][1]
            r9_12:dispose()
            local r9_13 = r9_0[r9_6]
            local r9_14 = {}
            local r9_15 = r0_2.newSpriteSheetFromData
            local r9_16, r9_17, r9_18 = r9_4, "/", r9_7
            local r9_19 = "images/game/accessory/hat/" .. r9_16 .. r9_17 .. r9_18 .. ".png"
            r9_16 = require
            r9_17 = r9_7
            r9_18 = nil
            r9_16 = r9_16(r9_17)
            r9_16 = r9_16.getSpriteSheetData
            r9_15 = r9_15(r9_19, r9_16())
            r9_19 = r9_7
            -- [unluac error] HIR proto#9 still contains residual table-set-list during AST lowering
            r9_13[p9_2] = r9_14
        end
    else
        local r9_20 = r9_0[r9_6]
        local r9_21 = {}
        local r9_22 = r0_2.newSpriteSheetFromData
        local r9_23, r9_24, r9_25 = r9_4, "/", r9_7
        local r9_26 = "images/game/accessory/hat/" .. r9_23 .. r9_24 .. r9_25 .. ".png"
        r9_23 = require
        r9_24 = r9_7
        r9_25 = nil
        r9_23 = r9_23(r9_24)
        r9_23 = r9_23.getSpriteSheetData
        r9_22 = r9_22(r9_26, r9_23())
        r9_26 = r9_7
        -- [unluac error] HIR proto#9 still contains residual table-set-list during AST lowering
        r9_20[p9_2] = r9_21
    end
    local r9_27
    if r9_4 == "lion" then
        local r9_28 = r0_2.newSpriteSet
        local r9_29 = r9_0[r9_6]
        r9_27 = r9_28(r9_29[p9_2][1], 1, 14)
        r0_2.add(r9_27, "normal", 1, 14, 400, 0)
    else
        local r9_30 = r0_2.newSpriteSet
        local r9_31 = r9_0[r9_6]
        r9_27 = r9_30(r9_31[p9_2][1], 1, 7)
        r0_2.add(r9_27, "normal", 1, 7, 200, 0)
    end
    local r9_32 = r0_2.newSprite(r9_27)
    if p9_1 then
        p9_1:insert(r9_32)
    end
    r9_32:prepare("normal")
    r9_32.type = r9_4
    return r9_32
end

function r0_0.cleanSuperfluousSprites() -- proto#10 params=0 locals=6 upvalues=1 vararg=false lines=318-341
    local r10_0 = r0_3.gameDataTable.animations
    for r10_1 = 1, 4 do
        if r10_0.avatar[r10_1] then
            r10_0.avatar[r10_1][1]:dispose()
            r10_0.avatar[r10_1] = nil
        end
        if r10_0.item[r10_1] then
            r10_0.item[r10_1][1]:dispose()
            r10_0.item[r10_1] = nil
        end
        if r10_0.boots[r10_1] then
            r10_0.boots[r10_1][1]:dispose()
            r10_0.boots[r10_1] = nil
        end
        if r10_0.hat[r10_1] then
            r10_0.hat[r10_1][1]:dispose()
            r10_0.hat[r10_1] = nil
        end
    end
end

return r0_0
