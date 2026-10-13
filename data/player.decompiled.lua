-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.new(p1_0, p1_1, p1_2, p1_3, p1_4, p1_5, p1_6) -- proto#1 params=7 locals=205 upvalues=0 vararg=false lines=3-2058
    local r1_0 = require("sprite")
    local r1_1 = require("storyboard")
    local r1_2 = require("accessories")
    local r1_3 = require("createSprite")
    local r1_4 = require("botModule")
    local r1_5 = require("playerCorpses")
    local r1_6 = display.newGroup()
    local r1_7 = display.newGroup()
    local r1_8 = display.newGroup()
    local r1_9 = display.newGroup()
    local r1_10 = display.newGroup()
    local r1_11 = display.newGroup()
    local r1_12 = nil
    local r1_13 = {}
    r1_13.bladeImage = display.newImageRect("images/game/powerup/blade/blade.png", 25, 25)
    r1_13.trapImage = display.newImageRect("images/game/powerup/trap/icon.png", 25, 25)
    r1_13.bounceTrapImage = display.newImageRect("images/game/powerup/bounceTrap/icon.png", 25, 25)
    r1_13.ninjaPlayerImage = display.newImageRect("images/game/powerup/ninja/arrow.png", 15, 15)
    r1_13.ninjaBarImage = display.newImageRect("images/game/powerup/ninja/arrow.png", 15, 15)
    local r1_14 = {}
    r1_14.defaultTopSpeed = 350
    r1_14.defaultAcceleration = 30
    r1_14.topSpeedX = 350
    r1_14.accelerateX = 25
    r1_14.tempSpeedX = 350
    r1_14.boostMaks = r1_14.topSpeedX * 1.5
    r1_14.boostMaksSlide = r1_14.topSpeedX * 2
    r1_14.slowMaks = r1_14.topSpeedX * 0.4
    local r1_15 = {}
    r1_15.groundTime = 0
    r1_15.playerDeadtime = 3000
    r1_15.goalTime = -1
    r1_15.powerUpAtTimes = 0
    r1_15.lastJumpTime = 1000
    r1_15.currentGameTime = -1
    r1_15.currentUDID = -1
    local r1_16 = 1
    local r1_17 = p1_0 + 1
    r1_17 = #p1_5 < r1_17 and 1 or r1_17
    local r1_18 = 6
    local r1_19, r1_20, r1_21, r1_22, r1_23, r1_24 = -1, 1, 0, 0, 0, p1_3
    if r1_1.config.tutorial then
        r1_24 = 0
    end
    local r1_25 = {}
    r1_25.armorActive = false
    r1_25.shieldActive = false
    r1_25.spriteIsRunning = false
    r1_25.spriteIsInAir = false
    r1_25.playerDead = false
    r1_25.playerInvulnerable = false
    r1_25.speedActive = false
    r1_25.disconnected = false
    r1_25.startedClean = false
    r1_25.tutorialPause = false
    local r1_26 = r1_5.newCorpsParts(r1_9, r1_6)
    local r1_27 = {}
    local r1_28, r1_29, r1_30, r1_31, r1_32 = nil, nil, nil, nil, nil
    local r1_33 = 5
    local r1_34 = {}
    for r1_35 = 1, r1_33 do
        r1_34[r1_35] = (p1_0 - 1) * r1_33 + r1_35
    end
    local r1_36 = 1
    local r1_37 = -1
    local r1_38, r1_39, r1_40 = nil, nil, nil
    local r1_41 = {}
    local r1_42 = display.newImageRect("images/game/avatar/disconnected.png", 18, 18)
    local r1_43 = nil
    if p1_4 then
        r1_43 = display.newImageRect("images/game/playerPlaceSelf.png", 28, 33)
    else
        r1_43 = display.newImageRect("images/game/playerPlaceOthers.png", 28, 33)
    end
    local r1_44 = 0.2
    local r1_45 = display.newImageRect("images/game/playerPlaceSelf.png", 28, 33)
    r1_45.isVisible = false
    r1_7:insert(r1_45)
    do
        local function r1_46(p2_0) -- proto#2 params=1 locals=2 upvalues=1 vararg=false lines=130-138
            local r2_0
            if p2_0 >= 100 then
                r2_0 = r1_2.getTableIndex(p2_0)
            else
                r2_0 = p2_0
            end
            return r2_0
        end

        for r1_47 = 1, 4 do
            local r1_48 = r1_46
            r1_48 = r1_48(p1_2[r1_47])
            p1_2[r1_47] = r1_48
        end
    end
    local r1_49 = r1_2.getAvatarList()
    do
        local r1_50 = p1_2[1]
        if #r1_49 < r1_50 then
            p1_2[1] = 1
        end
    end
    local r1_51 = p1_2[2]
    local r1_52 = r1_2.getHatList(p1_2[1])
    r1_52 = #r1_52
    if r1_52 < r1_51 then
        p1_2[2] = 1
    end
    r1_51 = p1_2[3]
    r1_52 = r1_2.getItemList
    r1_52 = r1_52(p1_2[1])
    r1_52 = #r1_52
    if r1_52 < r1_51 then
        p1_2[3] = 1
    end
    r1_51 = p1_2[4]
    r1_52 = r1_2.getBootsList
    r1_52 = r1_52(p1_2[1])
    r1_52 = #r1_52
    if r1_52 < r1_51 then
        p1_2[4] = 1
    end
    local r1_53 = p1_2[1]
    r1_51 = r1_2.isOldAvtar
    r1_52 = r1_53
    local r1_54 = r1_51(r1_52)
    r1_51 = r1_3.changeSpriteAvatar(p1_2[1], nil, p1_0)
    r1_41.spriteBody = r1_51
    r1_51 = r1_3.changeSpriteHat
    r1_51 = r1_51(p1_2[2], nil, p1_0)
    r1_41.spriteHat = r1_51
    r1_51 = r1_3.changeSpriteHat
    r1_51 = r1_51(p1_2[2], nil, p1_0)
    r1_41.spriteHeadBar = r1_51
    r1_51 = r1_3.changeSpriteItem
    r1_51 = r1_51(p1_2[3], nil, p1_0)
    r1_41.spriteItem = r1_51
    r1_51 = r1_3.getSpriteItemSet
    r1_51 = r1_51(p1_0)
    r1_41.spriteItemSet = r1_51
    r1_51 = r1_3.changeSpriteBoots
    r1_51 = r1_51(p1_2[4], nil, p1_0)
    r1_41.spriteBoots = r1_51
    r1_51 = r1_41.spriteHat
    r1_51.y = -6
    r1_51 = r1_41.spriteHeadBar
    r1_51.xScale = r1_44
    r1_51 = r1_41.spriteHeadBar
    r1_51.yScale = r1_44
    r1_51 = r1_41.spriteBody
    r1_51.xScale = 0.24
    r1_51 = r1_41.spriteBody
    r1_51.yScale = 0.24
    r1_51 = r1_41.spriteBoots
    r1_51.xScale = 0.24
    r1_51 = r1_41.spriteBoots
    r1_51.yScale = 0.24
    r1_51 = r1_41.spriteItem
    if r1_51 then
        r1_41.spriteItem.xScale = 0.24
        r1_41.spriteItem.yScale = 0.24
        r1_41.spriteItem.alpha = 0
    end
    r1_51 = r1_41.spriteHat
    r1_51.xScale = 0.24
    r1_51 = r1_41.spriteHat
    r1_51.yScale = 0.24

    function r1_51() -- proto#3 params=0 locals=0 upvalues=1 vararg=false lines=191-193
        r1_8.alpha = 0
    end

    local function r1_55() -- proto#4 params=0 locals=0 upvalues=2 vararg=false lines=195-198
        r1_8.alpha = 1
        r1_25.playerInvulnerable = false
    end

    local function r1_56() -- proto#5 params=0 locals=1 upvalues=3 vararg=false lines=200-205
        r1_8.alpha = 0.4
        local r5_0 = r1_15.playerDeadtime - 1000
        timer.performWithDelay(r5_0, r1_55, 1)
    end

    local r1_57, r1_58 = r1_0.newSpriteSheetFromData, "images/game/avatar/"
    local r1_59 = r1_49[p1_2[1]][8]
    r1_58 = r1_58 .. r1_59 .. ".png"
    r1_59 = require(r1_49[p1_2[1]][8])
    r1_59 = r1_59.getSpriteSheetData
    r1_57 = r1_57(r1_58, r1_59())
    r1_58 = r1_0.newSpriteSet
    r1_59 = r1_57
    r1_58 = r1_58(r1_59, 1, 8)
    r1_59 = r1_0.add
    r1_59(r1_58, "normal", 1, 7, 1000, 1)
    r1_0.add(r1_58, "head", 8, 1, 1000, 1)
    r1_59 = r1_0.newSpriteSet
    local r1_60 = r1_57
    r1_59 = r1_59(r1_60, 9, 4)
    r1_60 = r1_0.add
    r1_60(r1_59, "normal", 1, 2, 300, 2)
    r1_0.add(r1_59, "head", 3, 1, 1000, 1)
    r1_60 = r1_0.newSpriteSet
    local r1_61 = r1_57
    r1_60 = r1_60(r1_61, 12, 7)
    r1_61 = r1_0.add
    r1_61(r1_60, "normal", 1, 6, 600, 1)
    r1_0.add(r1_60, "head", 7, 1, 1000, 1)
    r1_61 = r1_0.newSpriteSet
    local r1_62 = r1_57
    r1_61 = r1_61(r1_62, 19, 5)
    r1_62 = r1_0.add
    r1_62(r1_61, "normal", 1, 5, 500, 8)
    r1_26.addSpriteSet(r1_59, r1_58, r1_60)

    function r1_62(p6_0) -- proto#6 params=1 locals=0 upvalues=1 vararg=false lines=229-234
        if p6_0 and not r1_25.startedClean then
            p6_0:removeSelf()
            p6_0 = nil
        end
    end

    local function r1_63() -- proto#7 params=0 locals=4 upvalues=7 vararg=false lines=236-249
        if p1_2[3] > 1 and not r1_25.playerDead then
            local r7_0 = r1_0.newSprite(r1_41.spriteItemSet)
            r7_0:prepare("normal")
            r7_0:setFrame(math.random(5))
            r7_0.xScale = 0.5
            r7_0.yScale = 0.5
            r7_0.x = r1_6.x
            r7_0.y = r1_6.y + math.random(-20, 20)
            r1_9:insert(r7_0)
            transition.to(r7_0, { time = 500, delay = 200, alpha = 0, onComplete = r1_62 })
        end
    end

    local r1_64 = r1_0.newSprite(r1_58)
    r1_64.xScale = 0.6
    r1_64.yScale = 0.6
    r1_64.alpha = 0
    if not r1_54 then
        r1_64.y = -6
    end

    local function r1_65(p8_0) -- proto#8 params=1 locals=0 upvalues=1 vararg=false lines=261-265
        if p8_0.phase == "ended" then
            r1_64.alpha = 0
        end
    end

    local function r1_66() -- proto#9 params=0 locals=0 upvalues=2 vararg=false lines=267-272
        r1_64.alpha = 1
        r1_64:prepare("normal")
        r1_64.rotation = r1_8.rotation
        r1_64:play()
    end

    local r1_67 = r1_0.newSprite(r1_60)
    r1_67.xScale = 0.6
    r1_67.yScale = 0.6
    r1_67.alpha = 0
    if not r1_54 then
        r1_67.y = -6
    end

    local function r1_68(p10_0) -- proto#10 params=1 locals=0 upvalues=1 vararg=false lines=284-288
        if p10_0.phase == "ended" then
            r1_67.alpha = 0
        end
    end

    local function r1_69() -- proto#11 params=0 locals=0 upvalues=2 vararg=false lines=290-295
        r1_67.alpha = 1
        r1_67:prepare("normal")
        r1_67.rotation = r1_8.rotation
        r1_67:play()
    end

    local r1_70 = r1_0.newSprite(r1_59)
    r1_70.xScale = 0.6
    r1_70.yScale = 0.6
    r1_70.alpha = 0
    if not r1_54 then
        r1_70.y = -6
    end

    local function r1_71(p12_0) -- proto#12 params=1 locals=0 upvalues=1 vararg=false lines=308-312
        if p12_0.phase == "ended" then
            r1_70.alpha = 0
        end
    end

    local function r1_72() -- proto#13 params=0 locals=0 upvalues=2 vararg=false lines=314-319
        r1_70.alpha = 1
        r1_70:prepare("normal")
        r1_70.rotation = r1_8.rotation
        r1_70:play()
    end

    local r1_73 = r1_0.newSprite(r1_1.gameDataTable.animations.lightningBoltSet)
    r1_73.xScale = 0.5
    r1_73.yScale = 0.5
    r1_73.alpha = 0
    r1_9:insert(r1_73)

    local function r1_74() -- proto#14 params=0 locals=0 upvalues=2 vararg=false lines=328-334
        r1_73.alpha = 1
        r1_73.x = r1_6.x + 10
        r1_73.y = r1_6.y - 110
        r1_73:prepare("normal")
        r1_73:play()
    end

    local function r1_75(p15_0) -- proto#15 params=1 locals=0 upvalues=1 vararg=false lines=336-340
        if p15_0.phase == "ended" then
            r1_73.alpha = 0
        end
    end

    local r1_76, r1_77, r1_78 = nil, nil, nil
    if p1_4 then
        local r1_79 = display.newImageRect("images/game/powerup/lightning/cloudBottom.png", 530, 94)
        r1_77 = r1_79
        r1_77.anchorX = 1
        r1_77.anchorY = 0
        r1_79 = display
        r1_79 = r1_79.contentWidth
        r1_77.x = r1_79
        r1_77.y = 0
        r1_77.alpha = 0
        r1_79 = display
        r1_79 = r1_79.newImageRect
        r1_79 = r1_79("images/game/powerup/lightning/cloudTop.png", 530, 94)
        r1_76 = r1_79
        r1_76.anchorX = 0
        r1_76.anchorY = 0
        r1_76.x = 0
        r1_76.y = 0
        r1_76.alpha = 0
        r1_79 = display
        r1_79 = r1_79.newImageRect
        r1_79 = r1_79("images/game/powerup/lightning/lightningBackground.png", 480, 320)
        r1_78 = r1_79
        r1_79 = display
        r1_79 = r1_79.contentWidth
        r1_79 = r1_79 * 0.5
        r1_78.x = r1_79
        r1_79 = display
        r1_79 = r1_79.contentHeight
        r1_79 = r1_79 * 0.5
        r1_78.y = r1_79
        r1_78.alpha = 0
        local r1_80 = r1_10
        r1_79 = r1_80.insert
        r1_79(r1_80, r1_78)
        r1_80 = r1_10
        r1_79 = r1_80.insert
        r1_79(r1_80, r1_77)
        r1_80 = r1_10
        r1_79 = r1_80.insert
        r1_79(r1_80, r1_76)
    end

    local function r1_81() -- proto#16 params=0 locals=2 upvalues=2 vararg=false lines=370-375
        r1_77.alpha = 0
        r1_76.alpha = 0
        r1_77.x = display.contentWidth
        r1_76.x = 0
    end

    local function r1_82() -- proto#17 params=0 locals=0 upvalues=1 vararg=false lines=377-379
        transition.to(r1_78, { delay = 800, time = 1200, alpha = 0 })
    end

    local function r1_83() -- proto#18 params=0 locals=0 upvalues=2 vararg=false lines=380-387
        r1_77.alpha = 1
        r1_76.alpha = 1
        transition.to(r1_77, { x = 530, time = 1500 })
        transition.to(r1_76, { x = -50, time = 1500 })
        transition.to(r1_77, { delay = 1200, time = 500, alpha = 0 })
        transition.to(r1_76, { delay = 1200, time = 500, alpha = 0 })
    end

    local function r1_84() -- proto#19 params=0 locals=0 upvalues=5 vararg=false lines=389-399
        if p1_4 then
            r1_78.alpha = 0.7
            r1_82()
            r1_83()
            timer.performWithDelay(2200, r1_81, 1)
        end
    end

    local r1_85 = r1_0.newSprite(r1_61)
    r1_85.xScale = 0.6
    r1_85.yScale = 0.6
    r1_85.alpha = 0
    r1_85.x = -3
    if not r1_54 then
        r1_85.y = -5
    end

    local function r1_86(p20_0) -- proto#20 params=1 locals=0 upvalues=3 vararg=false lines=412-421
        if r1_85 and not r1_25.startedClean then
            r1_85:pause()
            r1_25.speedActive = false
            r1_85.alpha = 0
            r1_14.topSpeedX = r1_14.defaultTopSpeed
            r1_14.tempSpeedX = r1_14.topSpeedX
            r1_14.accelerateX = r1_14.defaultAcceleration
        end
    end

    local function r1_87() -- proto#21 params=0 locals=0 upvalues=1 vararg=false lines=423-427
        r1_85.alpha = 1
        r1_85:prepare("normal")
        r1_85:play()
    end

    local function r1_88(p22_0) -- proto#22 params=1 locals=0 upvalues=2 vararg=false lines=429-433
        if p22_0.phase == "ended" and r1_25.speedActive and not r1_25.playerDead then
            r1_86(true)
        end
    end

    local r1_89 = r1_0.newSprite(r1_1.gameDataTable.animations.armorSpriteSet)
    r1_89.xScale = 0.6
    r1_89.yScale = 0.6
    r1_89.alpha = 0

    local function r1_90() -- proto#23 params=0 locals=0 upvalues=2 vararg=false lines=444-448
        r1_25.armorActive = false
        r1_89.alpha = 0
        r1_89:pause()
    end

    local function r1_91() -- proto#24 params=0 locals=0 upvalues=1 vararg=false lines=450-454
        r1_89.alpha = 1
        r1_89:prepare("normal")
        r1_89:play()
    end

    local function r1_92() -- proto#25 params=0 locals=1 upvalues=2 vararg=false lines=456-462
        local r25_0 = display.newImageRect("images/game/powerup/jump/cloud.png", 45, 20)
        r25_0.x = r1_6.x
        r25_0.y = r1_6.y + 20
        r1_9:insert(r25_0)
        transition.to(r25_0, { time = 1000, alpha = 0 })
    end

    local r1_93 = r1_0.newSprite(r1_1.gameDataTable.animations.magnetUse)
    r1_93.xScale = 0.5
    r1_93.yScale = 0.5
    r1_93.alpha = 0
    r1_93.y = -45

    local function r1_94(p26_0) -- proto#26 params=1 locals=0 upvalues=1 vararg=false lines=471-476
        if p26_0.phase == "ended" then
            transition.to(r1_93, { time = 200, alpha = 0 })
            r1_93:pause()
        end
    end

    local function r1_95() -- proto#27 params=0 locals=0 upvalues=1 vararg=false lines=478-482
        r1_93.alpha = 1
        r1_93:prepare("normal")
        r1_93:play()
    end

    local r1_96 = r1_0.newSprite(r1_1.gameDataTable.animations.magnetEffect)
    r1_96.xScale = 0.24
    r1_96.yScale = 0.24
    r1_96.alpha = 0

    local function r1_97(p28_0) -- proto#28 params=1 locals=0 upvalues=1 vararg=false lines=491-496
        if p28_0.phase == "ended" then
            r1_96.alpha = 0
            r1_96:pause()
        end
    end

    local function r1_98() -- proto#29 params=0 locals=0 upvalues=1 vararg=false lines=498-502
        r1_96.alpha = 1
        r1_96:prepare("normal")
        r1_96:play()
    end

    local r1_99 = r1_0.newSprite(r1_1.gameDataTable.animations.shieldSpriteSet)
    r1_99.xScale = 0.6
    r1_99.yScale = 0.6
    r1_99.alpha = 0

    local function r1_100() -- proto#30 params=0 locals=0 upvalues=2 vararg=false lines=511-515
        r1_25.shieldActive = false
        r1_99.alpha = 0
        r1_99:pause()
    end

    local function r1_101(p31_0) -- proto#31 params=1 locals=0 upvalues=2 vararg=false lines=517-531
        if p31_0 then
            if p31_0.phase == "ended" and r1_99.animationType == 1 then
                r1_99:prepare("shieldActive")
                r1_99:play()
                r1_99.animationType = 2
            elseif p31_0.phase == "ended" and r1_99.animationType == 2 then
                r1_99:prepare("shieldEnd")
                r1_99:play()
                r1_99.animationType = 3
            elseif p31_0.phase == "ended" and r1_99.animationType == 3 then
                r1_100()
            end
        end
    end

    local function r1_102() -- proto#32 params=0 locals=0 upvalues=1 vararg=false lines=533-538
        r1_99.animationType = 1
        r1_99.alpha = 1
        r1_99:prepare("shieldStart")
        r1_99:play()
    end

    local r1_103, r1_104, r1_105 = nil, nil, nil
    if p1_4 then
        local r1_106 = display.newImageRect("images/game/powerup/bloodScreenBL.png", 365, 88)
        r1_103 = r1_106
        r1_103.anchorX = 0
        r1_103.anchorY = 1
        r1_103.x = 0
        r1_106 = display
        r1_106 = r1_106.contentHeight
        r1_103.y = r1_106
        r1_103.alpha = 0
        local r1_107 = r1_10
        r1_106 = r1_107.insert
        r1_106(r1_107, r1_103)
        r1_106 = display
        r1_106 = r1_106.newImageRect
        r1_106 = r1_106("images/game/powerup/bloodScreenTL.png", 137, 116)
        r1_104 = r1_106
        r1_104.anchorX = 0
        r1_104.anchorY = 0
        r1_104.x = 0
        r1_104.y = 0
        r1_104.alpha = 0
        r1_107 = r1_10
        r1_106 = r1_107.insert
        r1_106(r1_107, r1_104)
        r1_106 = display
        r1_106 = r1_106.newImageRect
        r1_106 = r1_106("images/game/powerup/bloodScreenTR.png", 216, 140)
        r1_105 = r1_106
        r1_105.anchorX = 1
        r1_105.anchorY = 0
        r1_106 = display
        r1_106 = r1_106.contentWidth
        r1_105.x = r1_106
        r1_105.y = 0
        r1_105.alpha = 0
        r1_107 = r1_10
        r1_106 = r1_107.insert
        r1_106(r1_107, r1_105)
    end

    local function r1_108() -- proto#33 params=0 locals=0 upvalues=3 vararg=false lines=567-575
        if r1_103.alpha == 0 then
            r1_103.alpha = 1
        elseif r1_105.alpha == 0 then
            r1_105.alpha = 1
        elseif r1_104.alpha == 0 then
            r1_104.alpha = 1
        end
    end

    local function r1_109() -- proto#34 params=0 locals=0 upvalues=3 vararg=false lines=577-581
        transition.to(r1_103, { time = 300, alpha = 0 })
        transition.to(r1_105, { time = 300, alpha = 0 })
        transition.to(r1_104, { time = 300, alpha = 0 })
    end

    local function r1_110() -- proto#35 params=0 locals=0 upvalues=4 vararg=false lines=586-596
        if p1_4 then
            r1_108()
            r1_39("blood")
            timer.performWithDelay(125, r1_108, 1)
            timer.performWithDelay(250, r1_108, 1)
            timer.performWithDelay(375, r1_108, 1)
            timer.performWithDelay(800, r1_109, 1)
        end
    end

    local function r1_111(p36_0, p36_1) -- proto#36 params=2 locals=0 upvalues=2 vararg=false lines=603-606
        r1_19 = p36_0
        r1_20 = p36_1
    end

    local function r1_112(p37_0) -- proto#37 params=1 locals=0 upvalues=1 vararg=false lines=608-610
        r1_32 = p37_0
    end

    local function r1_113() -- proto#38 params=0 locals=0 upvalues=3 vararg=false lines=612-618
        if not r1_25.startedClean then
            r1_13.ninjaPlayerImage.alpha = 0
            r1_13.ninjaBarImage.alpha = 0
            r1_6.ninjaMark = false
        end
    end

    local function r1_114() -- proto#39 params=0 locals=0 upvalues=6 vararg=false lines=621-635
        if not r1_25.startedClean then
            if not p1_4 then
                r1_13.ninjaPlayerImage.alpha = 1
            end
            r1_13.ninjaBarImage.alpha = 1
            if r1_28 then
                timer.cancel(r1_28)
                r1_28 = nil
            end
            r1_28 = timer.performWithDelay(500, r1_113, 1)
            r1_6.ninjaMark = true
        end
    end

    local function r1_115(p40_0) -- proto#40 params=1 locals=0 upvalues=1 vararg=false lines=637-646
        if #p1_5 < p40_0 then
            return false
        end
        if p1_5[p40_0].isDisconnected() then
            return false
        end
        return true
    end

    local function r1_116() -- proto#41 params=0 locals=0 upvalues=9 vararg=false lines=648-685
        if r1_24 == 9 and not r1_25.startedClean and r1_15.goalTime < 1 then
            if r1_29 == nil then
                r1_17 = math.random(1, #p1_5)
                if r1_17 == p1_0 then
                    r1_17 = r1_17 + 1
                end
            end
            local r41_0, r41_1 = 8, r1_115(r1_17)
            while not r41_1 do
                r1_17 = r1_17 + 1
                local r41_2 = r1_17
                if #p1_5 < r41_2 then
                    r1_17 = 1
                end
                r41_1 = r1_115(r1_17)
                r41_0 = r41_0 - 1
                if r41_0 < 0 then
                    break
                end
            end
            if r41_0 < 0 then
                r1_17 = p1_0
            end
            p1_5[r1_17].addNinjaMark()
            r1_17 = r1_17 + 1
            r1_29 = timer.performWithDelay(501, r1_116, 1)
        else
            r1_29 = nil
        end
    end

    local function r1_117() -- proto#42 params=0 locals=1 upvalues=10 vararg=false lines=689-787
        local r42_0 = math.random(1, 100)
        r1_22 = r1_6.x
        if r1_19 == r1_20 then
            if r42_0 > 75 then
                r1_24 = 3
            elseif r42_0 > 45 then
                r1_24 = 7
            elseif r42_0 > 20 then
                r1_24 = 4
            elseif r42_0 > 10 then
                r1_24 = 9
            elseif r42_0 > 5 then
                r1_24 = 10
            else
                r1_24 = 5
            end
        elseif r1_19 == 1 then
            if r42_0 > 82 then
                r1_24 = 1
            elseif r42_0 > 64 then
                r1_24 = 8
            elseif r42_0 > 46 then
                r1_24 = 2
            elseif r42_0 > 33 then
                r1_24 = 9
            elseif r42_0 > 23 then
                r1_24 = 10
            elseif r42_0 > 10 then
                r1_24 = 4
            else
                r1_24 = 5
            end
        elseif r42_0 > 89 then
            r1_24 = 1
        elseif r42_0 > 82 then
            r1_24 = 10
        elseif r42_0 > 70 then
            r1_24 = 9
        elseif r42_0 > 60 then
            r1_24 = 7
        elseif r42_0 > 50 then
            r1_24 = 2
        elseif r42_0 > 40 then
            r1_24 = 8
        elseif r42_0 > 30 then
            r1_24 = 3
        elseif r42_0 > 20 then
            r1_24 = 4
        elseif r42_0 > 10 then
            r1_24 = 5
        else
            r1_24 = 6
        end
        if r1_20 == 1 then
            if r42_0 > 87 then
                r1_24 = 1
            elseif r42_0 > 75 then
                r1_24 = 2
            elseif r42_0 > 62 then
                r1_24 = 3
            elseif r42_0 > 50 then
                r1_24 = 4
            elseif r42_0 > 38 then
                r1_24 = 5
            elseif r42_0 > 25 then
                r1_24 = 6
            elseif r42_0 > 12 then
                r1_24 = 7
            elseif r42_0 > 5 then
                r1_24 = 8
            else
                r1_24 = 9
            end
        end
        if r1_1.config.tutorial then
            r1_24 = 4
        end
        if p1_4 then
            r1_32(r1_24)
            if r1_24 == 9 then
                if r1_29 then
                    timer.cancel(r1_29)
                    r1_29 = nil
                end
                r1_116()
            end
        end
    end

    local function r1_118() -- proto#43 params=0 locals=0 upvalues=2 vararg=false lines=789-805
        if r1_24 == 1 then
            r1_24 = 51
        elseif r1_24 == 2 then
            r1_24 = 52
        elseif r1_24 == 7 then
            r1_24 = 57
        elseif r1_24 == 8 then
            r1_24 = 58
        end
        if r1_25.playerDead then
            return 0
        end
        return r1_24
    end

    local function r1_119(p44_0, p44_1, p44_2) -- proto#44 params=3 locals=7 upvalues=1 vararg=false lines=807-815
        local r44_0 = math.abs(tonumber(p44_0) - tonumber(r1_1.powerUpPositions[p44_2][1]))
        local r44_1 = math.abs
        local r44_2 = tonumber(p44_1)
        r44_2 = r44_2 - tonumber(r1_1.powerUpPositions[p44_2][2])
        r44_1 = r44_1(r44_2)
        if r44_0 < 2 and r44_1 < 2 then
            return true
        end
        return false
    end

    local function r1_120(p45_0, p45_1, p45_2) -- proto#45 params=3 locals=2 upvalues=4 vararg=false lines=817-829
        for r45_0 = 1, #r1_1.powerUpPositions do
            if r1_119(p45_0, p45_1, r45_0) and r1_1.powerUpPositions[r45_0][p1_0 + 2] < 2 then
                r1_24 = 1
                if p45_2 < 50 then
                    r1_1.powerUpPositions[r45_0][p1_0 + 2] = r1_1.powerUpPositions[r45_0][p1_0 + 2]
                        + 1
                end
            end
        end
    end

    local function r1_121() -- proto#46 params=0 locals=0 upvalues=2 vararg=false lines=831-842
        if r1_1.gameDataTable.serverVersion < 33 then
            return true
        end
        if r1_1.gameType == 1 then
            return true
        end
        if r1_24 > 0 then
            return true
        end
        return false
    end

    local function r1_122() -- proto#47 params=0 locals=0 upvalues=1 vararg=false lines=844-846
        r1_24 = 0
    end

    local function r1_123() -- proto#48 params=0 locals=3 upvalues=2 vararg=false lines=849-856
        if r1_25.spriteIsRunning and not r1_25.startedClean then
            r1_25.spriteIsRunning = false
            r1_41.spriteBody:pause()
            r1_41.spriteBoots:pause()
            r1_41.spriteHat:pause()
        end
    end

    local function r1_124(p49_0) -- proto#49 params=1 locals=0 upvalues=2 vararg=false lines=858-865
        if p49_0 == true then
            r1_25.tutorialPause = true
            r1_123()
        else
            r1_25.tutorialPause = false
        end
    end

    local function r1_125() -- proto#50 params=0 locals=6 upvalues=2 vararg=false lines=868-879
        if not r1_25.spriteIsInAir and not r1_25.startedClean then
            r1_25.spriteIsInAir = true
            r1_41.spriteBody:setFrame(4)
            r1_41.spriteBoots:setFrame(4)
            r1_41.spriteBody:pause()
            r1_41.spriteBoots:pause()
            r1_41.spriteHat:setFrame(4)
            r1_41.spriteHat:pause()
        end
    end

    local function r1_126() -- proto#51 params=0 locals=3 upvalues=3 vararg=false lines=881-896
        if r1_15.goalTime > 0 then
            return
        end
        if r1_25.tutorialPause then
            return
        end
        if r1_25.spriteIsInAir and not r1_25.startedClean then
            r1_25.spriteIsInAir = false
            r1_41.spriteBody:play()
            r1_41.spriteBoots:play()
            r1_41.spriteHat:play()
        end
    end

    local function r1_127() -- proto#52 params=0 locals=0 upvalues=3 vararg=false lines=898-906
        if r1_6 and r1_15.groundTime + 300 < system.getTimer() then
            r1_6.onGround = false
            r1_125()
        end
    end

    local function r1_128(p53_0) -- proto#53 params=1 locals=13 upvalues=4 vararg=false lines=908-942
        if r1_15.goalTime > 0 then
            return
        end
        if r1_25.tutorialPause then
            return
        end
        if not r1_25.spriteIsRunning and not r1_25.startedClean then
            r1_25.spriteIsRunning = true
            r1_41.spriteBody:prepare("normal")
            r1_41.spriteBody:play()
            r1_41.spriteBoots:prepare("normal")
            r1_41.spriteBoots:play()
            r1_41.spriteHat:prepare("normal")
            r1_41.spriteHat:play()
        end
        local r53_0 = p53_0 / r1_14.topSpeedX
        r53_0 = r53_0 < 0.05 and 0.05 or r53_0
        local r53_1 = r1_41.spriteBody.frame
        local r53_2 = r1_41.spriteBoots.frame
        local r53_3 = r1_41.spriteHat.frame
        r1_41.spriteBody.timeScale = r53_0
        r1_41.spriteBoots.timeScale = r53_0
        r1_41.spriteHat.timeScale = r53_0
        r1_41.spriteBody:setFrame(r53_1)
        r1_41.spriteBoots:setFrame(r53_2)
        r1_41.spriteHat:setFrame(r53_3)
    end

    local function r1_129(p54_0) -- proto#54 params=1 locals=1 upvalues=0 vararg=false lines=944-948
        if p54_0 then
            p54_0[1].blendMode = "normal"
        end
    end

    local function r1_130() -- proto#55 params=0 locals=1 upvalues=4 vararg=false lines=950-961
        local r55_0 = r1_23 + 500
        if system.getTimer() < r55_0 then
            return false
        end
        local r55_1 = r1_6.x
        if r1_22 + 100 < r55_1 then
            r1_15.powerUpAtTimes = 1
            return true
        end
        if r1_15.powerUpAtTimes < 2 then
            r1_15.powerUpAtTimes = r1_15.powerUpAtTimes + 1
            return true
        end
        return false
    end

    local function r1_131(p56_0, p56_1) -- proto#56 params=2 locals=19 upvalues=17 vararg=false lines=965-1068
        if p56_1.phase == "began" then
            if p56_1.other.mapElement then
                r1_6.onGround = true
                r1_126()
                r1_15.groundTime = system.getTimer()
                if p56_1.other.bounce then
                    r1_21 = 1
                    local r56_0, r56_1 = r1_6:getLinearVelocity()
                    if math.abs(r56_1) > 100 then
                        r56_0 = r56_0 * 0.7
                    end
                    local r56_2 = math
                    r56_2 = r56_2.abs
                    r56_2 = r56_2(r56_1 * 1.3)
                    r56_2 = -r56_2
                    r56_2 = r56_2 < -700 and -700 or r56_2
                    r1_6:setLinearVelocity(r56_0, r56_2)
                    r1_7:setLinearVelocity(r56_0, r56_2)
                    r1_16 = 1
                    r1_21 = 2
                elseif p56_1.other.boost then
                    r1_21 = 1
                    local r56_3, r56_4 = r1_6:getLinearVelocity()
                    if r56_3 < r1_14.boostMaks then
                        local r56_5
                        if r56_3 < 0 then
                            r56_5 = r56_3 * 0.7
                        else
                            r56_5 = r56_3 * 1.3
                        end
                        local r56_6
                        if r1_14.boostMaks < r56_5 then
                            r56_6 = r1_14.boostMaks
                        else
                            r56_6 = r56_5
                        end
                        r1_6:setLinearVelocity(r56_6, r56_4)
                        r1_7:setLinearVelocity(r56_6, r56_4)
                    end
                    r1_16 = 3
                    r1_21 = 2
                elseif p56_1.other.boost2 then
                    r1_21 = 1
                    local r56_7, r56_8 = r1_6:getLinearVelocity()
                    if r56_7 < r1_14.boostMaksSlide then
                        local r56_9
                        if r56_7 < 0 then
                            r56_9 = r56_7 * 0.7
                        else
                            r56_9 = r56_7 * 1.5
                        end
                        local r56_10
                        if r1_14.boostMaksSlide < r56_9 then
                            r56_10 = r1_14.boostMaksSlide
                        else
                            r56_10 = r56_9
                        end
                        r1_6:setLinearVelocity(r56_10, r56_8)
                        r1_7:setLinearVelocity(r56_10, r56_8)
                    end
                    r1_16 = 3
                    r1_21 = 2
                elseif p56_1.other.slow then
                    r1_21 = 1
                    local r56_11, r56_12 = r1_6:getLinearVelocity()
                    if r1_14.slowMaks < r56_11 then
                        local r56_13 = r56_11 * 0.8
                        if r56_13 < r1_14.slowMaks then
                            r56_13 = r1_14.slowMaks
                        end
                        r1_6:setLinearVelocity(r56_13, r56_12)
                        r1_7:setLinearVelocity(r56_13, r56_12)
                    end
                    r1_16 = 4
                    r1_21 = 2
                else
                    r1_16 = 1
                end
            elseif p56_1.other.powerUp and r1_24 == 0 and r1_130() then
                if p1_4 then
                    p56_1.other.blendMode = "add"
                    local r56_14 = { p56_1.other }

                    local function r56_15(p57_0) -- proto#57 params=1 locals=0 upvalues=2 vararg=false lines=1044-1044
                        return r1_129(r56_14)
                    end

                    timer.performWithDelay(200, r56_15, 1)
                    r1_39("pickup")
                    r1_23 = system.getTimer()
                end
                if r1_1.gameType == 1 or p1_4 then
                    r1_117()
                end
                if r1_15.powerUpAtTimes == 2 and p1_4 then
                    p56_1.other:setFillColor(0.5450980392156862, 0.5137254901960784, 0.47058823529411764, 1)
                end
                if r1_1.gameType ~= 1 and p1_4 then
                    r1_1.tcpClient.sendPacketGotPU(math.round(p56_1.other.x), math.round(p56_1.other.y), p1_0, r1_24)
                end
            end
        elseif p56_1.phase == "ended" and p56_1.other.mapElement then
            timer.performWithDelay(300, r1_127, 1)
        end
    end

    local r1_132 = 1

    local function r1_133() -- proto#58 params=0 locals=16 upvalues=6 vararg=false lines=1072-1116
        local r58_0, r58_1 = r1_6:getLinearVelocity()
        if r58_1 < -400 then
            r58_1 = r58_1 / 2
        end
        if r58_0 > 50 then
            local r58_2 = #r1_27
            if r1_18 < r58_2 then
                table.remove(r1_27)
                table.remove(r1_27)
            end
            table.insert(r1_27, 1, r58_0)
            table.insert(r1_27, 2, r58_1)
            r58_2 = 0
            local r58_3 = 0
            local r58_4 = #r1_27
            for r58_5 = 1, r58_4, 2 do
                r58_2 = r58_2 + r1_27[r58_5]
                r58_3 = r58_3 + r1_27[r58_5 + 1]
            end
            local r58_6 = r58_2 / r1_18
            local r58_7 = r58_3 / r1_18
            local r58_8 = math.atan(r58_7 / r58_6)
            local r58_9 = math.deg(r58_8)
            r58_9 = r58_9 > 90 and 89 or r58_9 < -90 and -89 or r58_9
            r1_8.rotation = r58_9
        end
        if r1_132 > 5 then
            r1_132 = 0
            r1_63()
        end
        r1_132 = r1_132 + 1
    end

    local r1_134 = 0
    local r1_135 = true

    local function r1_136() -- proto#59 params=0 locals=10 upvalues=12 vararg=false lines=1120-1190
        if not r1_25.startedClean and not r1_25.disconnected then
            if r1_135 then
                r1_135 = false
                r1_134 = system.getTimer()
                r1_6.bodyType = "dynamic"
                if r1_24 == 9 and p1_4 then
                    r1_116()
                end
            end
            local r59_0, r59_1 = r1_6:getLinearVelocity()
            if r1_21 == 1 then
                r1_134 = system.getTimer()
            else
                r1_21 = 0
                local r59_2 = r59_0
                local r59_3 = r1_14.accelerateX
                local r59_4 = system.getTimer()
                local r59_5 = (r59_4 - r1_134) * 0.01
                r1_134 = r59_4
                r59_3 = r59_3 * r59_5
                if r59_0 < r1_14.topSpeedX * 0.2 then
                    r59_3 = r59_3 * 4
                elseif r59_0 < r1_14.topSpeedX * 0.5 then
                    r59_3 = r59_3 * 2
                end
                if r1_6.onGround then
                    r59_0 = r59_0 + r59_3
                else
                    r59_0 = r59_0 + r59_3 * 0.4
                end
                if r1_14.topSpeedX < r59_0 and r59_1 <= 20 then
                    if r59_0 - r1_14.topSpeedX < r59_3 * 1.5 then
                        r59_0 = r1_14.topSpeedX
                    else
                        r59_0 = r59_0 * 0.9
                    end
                elseif r1_14.topSpeedX * 1.5 < r59_0 and r59_1 > 0 then
                    if r59_0 - r1_14.topSpeedX < r59_3 * 1.5 then
                        r59_0 = r1_14.topSpeedX * 1.5
                    else
                        r59_0 = r59_0 * 0.9
                    end
                end
                if r1_25.playerDead then
                    r59_0 = 0
                    r1_6:setLinearVelocity(r59_0, r59_1)
                    r1_7:setLinearVelocity(r59_0, r59_1)
                elseif r1_21 == 0 and r1_16 == 1 then
                    r1_6:setLinearVelocity(r59_0, r59_1)
                    r1_7:setLinearVelocity(r59_0, r59_1)
                elseif r1_21 == 0 and r1_16 == 3 and r59_0 < r1_14.topSpeedX then
                    r1_6:setLinearVelocity(r59_0, r59_1)
                    r1_7:setLinearVelocity(r59_0, r59_1)
                elseif r1_21 == 0 and r59_2 < r1_14.topSpeedX * 0.4 then
                    r1_6:setLinearVelocity(r59_0, r59_1)
                    r1_7:setLinearVelocity(r59_0, r59_1)
                end
            end
            r1_128(r59_0)
        end
    end

    local function r1_137() -- proto#60 params=0 locals=0 upvalues=2 vararg=false lines=1193-1201
        if r1_25.playerDead then
            return false
        end
        if r1_6.onGround then
            return true
        end
        return false
    end

    local function r1_138() -- proto#61 params=0 locals=3 upvalues=6 vararg=false lines=1204-1221
        r1_15.lastJumpTime = system.getTimer()
        r1_21 = 1
        local r61_0, r61_1 = r1_6:getLinearVelocity()
        if r1_14.topSpeedX * 0.2 < r61_0 then
            if r1_16 == 4 then
                r61_0 = r61_0 * 0.8
            else
                r61_0 = r61_0 * 0.7
            end
        end
        r1_6:setLinearVelocity(r61_0, 0)
        r1_7:setLinearVelocity(r61_0, 0)
        r1_6:applyForce(0, -200, r1_6.x, r1_6.y)
        r1_7:applyForce(0, -200, r1_7.x, r1_7.y)
        r1_16 = 1
        r1_21 = 2
    end

    local function r1_139() -- proto#62 params=0 locals=3 upvalues=6 vararg=false lines=1224-1243
        if not r1_25.startedClean then
            local r62_0, r62_1 = r1_6:getLinearVelocity()
            if r1_6.onGround then
                if r62_0 <= 0.1 then
                    r1_123()
                    r1_6:setLinearVelocity(0, r62_1)
                    r1_7:setLinearVelocity(0, r62_1)
                else
                    local r62_2 = r62_0 * 0.55
                    r1_128(r62_2)
                    r1_6:setLinearVelocity(r62_2, r62_1)
                    r1_7:setLinearVelocity(r62_2, r62_1)
                end
            end
            if r1_12 then
                r1_12.inGoal()
            end
        end
    end

    local function r1_140() -- proto#63 params=0 locals=0 upvalues=1 vararg=false lines=1245-1247
        return r1_15.goalTime
    end

    local function r1_141(p64_0) -- proto#64 params=1 locals=0 upvalues=1 vararg=false lines=1249-1251
        r1_15.goalTime = p64_0
    end

    local function r1_142() -- proto#65 params=0 locals=0 upvalues=1 vararg=false lines=1253-1255
        return p1_1
    end

    local function r1_143() -- proto#66 params=0 locals=0 upvalues=1 vararg=false lines=1257-1259
        return r1_11
    end

    local function r1_144(p67_0) -- proto#67 params=1 locals=0 upvalues=0 vararg=false lines=1261-1266
        p67_0 = p67_0 * 100
        p67_0 = math.floor(p67_0)
        p67_0 = p67_0 * 0.01
        return p67_0
    end

    local function r1_145(p68_0) -- proto#68 params=1 locals=6 upvalues=3 vararg=false lines=1268-1291
        local r68_0, r68_1 = r1_6:getLinearVelocity()
        local r68_2 = r1_6.x
        local r68_3 = r1_6.y
        r68_0 = r1_144(r68_0)
        r68_1 = r1_144(r68_1)
        r68_2 = r1_144(r68_2)
        r68_3 = r1_144(r68_3)
        local r68_4 = { x = r68_2, y = r68_3, vX = r68_0, vY = r68_1 }
        if p68_0 then
            r68_4.s = r1_15.currentGameTime
        end
        return r68_4
    end

    local function r1_146() -- proto#69 params=0 locals=0 upvalues=1 vararg=false lines=1293-1296
        return (r1_145(false))
    end

    local function r1_147() -- proto#70 params=0 locals=0 upvalues=1 vararg=false lines=1298-1301
        return (r1_145(true))
    end

    local function r1_148() -- proto#71 params=0 locals=0 upvalues=1 vararg=false lines=1303-1305
        return r1_15.currentGameTime
    end

    local function r1_149(p72_0) -- proto#72 params=1 locals=0 upvalues=1 vararg=false lines=1307-1309
        r1_15.currentGameTime = p72_0
    end

    local function r1_150(p73_0) -- proto#73 params=1 locals=0 upvalues=1 vararg=false lines=1311-1313
        r1_30 = p73_0
    end

    local function r1_151() -- proto#74 params=0 locals=0 upvalues=1 vararg=false lines=1315-1317
        return r1_9
    end

    local function r1_152() -- proto#75 params=0 locals=0 upvalues=1 vararg=false lines=1319-1321
        return r1_10
    end

    local function r1_153() -- proto#76 params=0 locals=0 upvalues=1 vararg=false lines=1323-1325
        return r1_7
    end

    local function r1_154() -- proto#77 params=0 locals=0 upvalues=3 vararg=false lines=1327-1331
        r1_31()
        r1_25.shieldActive = true
        r1_102()
    end

    local function r1_155() -- proto#78 params=0 locals=0 upvalues=3 vararg=false lines=1334-1338
        r1_31()
        r1_25.armorActive = true
        r1_91()
    end

    local function r1_156() -- proto#79 params=0 locals=0 upvalues=6 vararg=false lines=1341-1349
        r1_31()
        r1_25.speedActive = true
        r1_14.topSpeedX = r1_14.topSpeedX * 1.5
        r1_14.accelerateX = r1_14.accelerateX * 1.5
        r1_6:applyForce(300, 0, r1_6.x, r1_6.y)
        r1_7:applyForce(300, 0, r1_7.x, r1_7.y)
        r1_87()
    end

    local function r1_157(p80_0) -- proto#80 params=1 locals=4 upvalues=6 vararg=false lines=1352-1367
        if p1_5[p1_0].x < p1_5[p80_0].x then
            r1_6:applyForce(100, 0, r1_6.x, r1_6.y)
            r1_7:applyForce(100, 0, r1_7.x, r1_7.y)
            r1_96.x = 40
            local r80_0 = r1_96
            local r80_1 = math.abs(r1_96.xScale)
            r80_1 = -r80_1
            r80_0.xScale = r80_1
        else
            r1_6:setLinearVelocity(0, 0)
            r1_7:setLinearVelocity(0, 0)
            r1_6:applyForce(-400, 0, r1_6.x, r1_6.y)
            r1_7:applyForce(-400, 0, r1_7.x, r1_7.y)
            r1_96.x = -40
            r1_96.xScale = math.abs(r1_96.xScale)
        end
        r1_98()
    end

    local function r1_158() -- proto#81 params=0 locals=0 upvalues=2 vararg=false lines=1369-1374
        r1_6:setLinearVelocity(0, 0)
        r1_7:setLinearVelocity(0, 0)
        r1_6:applyForce(-300, -150, r1_6.x, r1_6.y)
        r1_7:applyForce(-300, -150, r1_7.x, r1_7.y)
    end

    function r1_31() -- proto#82 params=0 locals=0 upvalues=4 vararg=false lines=1376-1388
        if r1_25.shieldActive then
            r1_100()
        end
        if r1_25.armorActive then
            r1_90()
        end
        if r1_25.speedActive then
            r1_86(true)
        end
    end

    local function r1_159() -- proto#83 params=0 locals=0 upvalues=1 vararg=false lines=1390-1392
        r1_74()
    end

    local function r1_160() -- proto#84 params=0 locals=19 upvalues=1 vararg=false lines=1394-1425
        local r84_0 = 8
        local r84_1 = 5
        local r84_2 = 150
        local r84_3, r84_4 = 50, 10
        local r84_5 = {}
        for r84_6 = 1, r84_3, 5 do
            table.insert(r84_5, 1, { x = r84_6 - 25, y = r84_6 / r84_3 * r84_4, line = nil })
            if r84_1 < #r84_5 then
                table.remove(r84_5)
            end
            for r84_7, r84_8 in ipairs(r84_5) do
                local r84_9 = display.newLine(r84_8.x, r84_8.y, r84_6 - 25, r84_6 / r84_3 * r84_4)
                r1_6:insert(r84_9)
                r84_9.strokeWidth = r84_0 * (r84_6 / r84_3)
                transition.to(r84_9, {
                    time = r84_2, alpha = 0, strokeWidth = 0, tag = "ninjaTrans",
                    onComplete = function(p85_0) -- proto#85 params=1 locals=0 upvalues=1 vararg=false lines=1417-1417
                        r84_9:removeSelf()
                    end
                })
            end
        end
        while #r84_5 > 0 do
            table.remove(r84_5)
        end
    end

    local function r1_161() -- proto#86 params=0 locals=0 upvalues=1 vararg=false lines=1427-1429
        r1_13.bladeImage.alpha = 0
    end

    local function r1_162() -- proto#87 params=0 locals=0 upvalues=1 vararg=false lines=1431-1434
        r1_13.bladeImage.alpha = 1
        transition.to(r1_13.bladeImage, { time = 200, rotation = 355 })
    end

    local function r1_163() -- proto#88 params=0 locals=0 upvalues=1 vararg=false lines=1436-1438
        r1_13.trapImage.alpha = 0
    end

    local function r1_164() -- proto#89 params=0 locals=0 upvalues=1 vararg=false lines=1440-1442
        r1_13.trapImage.alpha = 1
    end

    local function r1_165() -- proto#90 params=0 locals=0 upvalues=1 vararg=false lines=1444-1446
        r1_13.bounceTrapImage.alpha = 0
    end

    local function r1_166() -- proto#91 params=0 locals=0 upvalues=1 vararg=false lines=1448-1450
        r1_13.bounceTrapImage.alpha = 1
    end

    local function r1_167() -- proto#92 params=0 locals=0 upvalues=3 vararg=false lines=1453-1457
        r1_95()
        r1_40(p1_0, 7, p1_0)
    end

    local function r1_168() -- proto#93 params=0 locals=0 upvalues=3 vararg=false lines=1461-1466
        if not r1_25.playerDead and r1_6 then
            r1_14.topSpeedX = r1_14.tempSpeedX
            r1_6.alpha = 1
        end
    end

    local function r1_169() -- proto#94 params=0 locals=0 upvalues=1 vararg=false lines=1468-1472
        if r1_6 then
            r1_6.alpha = 0
        end
    end

    local function r1_170() -- proto#95 params=0 locals=0 upvalues=4 vararg=false lines=1474-1483
        r1_25.playerDead = false
        r1_56()
        r1_168()
        if r1_25.speedActive then
            r1_86(false)
        end
    end

    local function r1_171(p96_0) -- proto#96 params=1 locals=0 upvalues=1 vararg=false lines=1485-1487
        r1_40 = p96_0
    end

    local function r1_172() -- proto#97 params=0 locals=3 upvalues=3 vararg=false lines=1489-1508
        local r97_0 = 5000
        local r97_1 = #p1_5
        for r97_2 = 1, r97_1 do
            if r97_2 ~= p1_0 and r1_6.x - p1_5[r97_2].x < r97_0 then
                r97_0 = r1_6.x - p1_5[r97_2].x
            end
            local r97_3 = p1_5[r97_2].x + 2000
            if r1_6.x < r97_3 and r97_2 ~= p1_0 then
                return 0
            end
        end
        if r97_0 < 2500 then
            return 1
        end
        return 2
    end

    local function r1_173() -- proto#98 params=0 locals=0 upvalues=1 vararg=false lines=1510-1514
        if r1_6 then
            r1_6.bodyType = "static"
        end
    end

    local function r1_174() -- proto#99 params=0 locals=0 upvalues=2 vararg=false lines=1516-1521
        if r1_6 then
            r1_6:setLinearVelocity(0, 0)
            r1_7:setLinearVelocity(0, 0)
        end
    end

    local function r1_175() -- proto#100 params=0 locals=0 upvalues=5 vararg=false lines=1523-1532
        if r1_6 and not r1_25.startedClean then
            pcall(r1_174)
            r1_25.disconnected = true
            r1_25.playerInvulnerable = true
            r1_6.alpha = 0.5
            r1_42.alpha = 1
            timer.performWithDelay(10, r1_173, 1)
        end
    end

    local function r1_176() -- proto#101 params=0 locals=0 upvalues=1 vararg=false lines=1534-1536
        return r1_25.disconnected
    end

    local function r1_177(p102_0, p102_1, p102_2) -- proto#102 params=3 locals=2 upvalues=24 vararg=false lines=1538-1626
        if p102_0 == 1 then
            r1_39("blade_hit")
        elseif p102_0 == 2 then
            r1_39("trap_hit")
        elseif p102_0 == 3 then
            r1_159()
            r1_39("lightning_hit")
        elseif p102_0 == 9 then
            r1_39("trap_hit")
            r1_160()
        end
        if p102_1 == 1 then
            r1_40(p102_2, p102_0, p1_0)
            local r102_0 = 1000
            if r1_19 == 1 then
                if r1_172() == 1 then
                    r102_0 = 1500
                elseif r1_172() == 2 then
                    r102_0 = 2000
                end
            end
            r1_25.playerDead = true
            r1_25.playerInvulnerable = true
            r1_51()
            if r1_12 then
                r1_12.botDied()
            end
            if p102_0 == 1 then
                r1_69()
                r1_110()
                timer.performWithDelay(600, r1_26.dropBrain, 1)
                timer.performWithDelay(1500, r1_26.readyBrain, 1)
                timer.performWithDelay(r102_0, r1_170, 1)
            elseif p102_0 == 2 or p102_0 == 9 then
                r1_66()
                r1_110()
                timer.performWithDelay(10, r1_26.dropHead, 1)
                timer.performWithDelay(1500, r1_26.readyHead, 1)
                timer.performWithDelay(r102_0, r1_170, 1)
            elseif p102_0 == 3 then
                r1_72()
                timer.performWithDelay(600, r1_169, 1)
                timer.performWithDelay(600, r1_26.dropSkull, 1)
                timer.performWithDelay(1500, r1_26.readySkull, 1)
                timer.performWithDelay(r102_0, r1_170, 1)
            end
            if r1_25.speedActive then
                r1_85.alpha = 0
            end
            r1_6:setLinearVelocity(0, 0)
            r1_7:setLinearVelocity(0, 0)
            if r1_14.topSpeedX > 0 then
                r1_14.tempSpeedX = r1_14.topSpeedX
                r1_14.topSpeedX = 0
            end
        elseif p102_1 == 2 then
            r1_90()
        elseif p102_1 ~= 3 and p102_1 == 4 then
            if p102_0 == 7 then
                r1_157(p102_2)
            elseif p102_0 == 8 then
                r1_39("bounce_hit")
                r1_158(p102_2)
                r1_40(p102_2, p102_0, p1_0)
            end
        end
    end

    local function r1_178(p103_0, p103_1) -- proto#103 params=2 locals=3 upvalues=5 vararg=false lines=1629-1659
        if not (r1_15.goalTime == -1 and not r1_25.playerInvulnerable) then
            return
        end
        local r103_0 = {}
        local r103_1 = r1_25.shieldActive and 3
            or r1_25.armorActive and 2
            or p103_1 == 7 and 4
            or p103_1 == 8 and 4
            or 1
        r1_177(p103_1, r103_1, p103_0)
        local r103_2 = { k = p103_0, p = p103_1, h = r103_1 }
        r103_0 = r103_2
        r103_2 = r1_30
        if r103_2 then
            r1_30(r1_146(), r103_0)
        end
        return r103_1
    end

    local function r1_179() -- proto#104 params=0 locals=2 upvalues=4 vararg=false lines=1661-1671
        if p1_4 then
            return
        end
        if not r1_25.startedClean then
            local r104_0, r104_1 = r1_7:getLinearVelocity()
            r1_6:setLinearVelocity(r104_0, r104_1)
            r1_6.x = r1_7.x
            r1_6.y = r1_7.y
        end
    end

    local function r1_180() -- proto#105 params=0 locals=9 upvalues=7 vararg=false lines=1673-1710
        if p1_4 then
            return
        end
        if r1_15.goalTime > 0 or r1_1.gameType == 1 then
            return
        end
        local r105_0 = r1_6.x
        local r105_1 = r1_6.y
        local r105_2 = r1_7.x
        local r105_3 = r1_7.y
        local r105_4 = r105_0 - r105_2
        local r105_5 = r105_1 - r105_3
        local r105_6 = 20
        if r1_25.playerDead then
            if math.abs(r105_4) < 2 then
                r105_0 = r105_2
            elseif r105_4 < 0 then
                r105_0 = r105_0 - 1
            else
                r105_0 = r105_0 + 1
            end
            r1_6.x = r105_0
            return
        end
        if math.abs(r105_5) > 50 or math.abs(r105_4) > 100 then
            r1_179()
        elseif r105_0 < r105_2 + r105_6 then
            r1_6:applyForce(3, 0, r1_6.x, r1_6.y)
        elseif r105_2 + r105_6 < r105_0 then
            r1_6:applyForce(-3, 0, r1_6.x, r1_6.y)
        end
    end

    local function r1_181(p106_0, p106_1, p106_2, p106_3, p106_4, p106_5) -- proto#106 params=6 locals=0 upvalues=5 vararg=false lines=1713-1736
        if not r1_25.startedClean then
            if p106_5 then
                if not (r1_15.currentUDID < p106_5) then
                    return
                end
                r1_15.currentUDID = p106_5
            end
            r1_7:setLinearVelocity(p106_2, p106_3)
            r1_7.x = p106_0
            r1_7.y = p106_1
            if p106_4 and p106_4 == "i" then
                r1_179()
            else
                r1_6:setLinearVelocity(p106_2, p106_3)
            end
        end
    end

    local function r1_182(p107_0) -- proto#107 params=1 locals=0 upvalues=1 vararg=false lines=1738-1740
        r1_38 = p107_0
    end

    function r1_39(p108_0) -- proto#108 params=1 locals=0 upvalues=4 vararg=false lines=1742-1748
        r1_38(p108_0, r1_34[r1_36])
        r1_36 = r1_36 + 1
        if r1_33 < r1_36 then
            r1_36 = 1
        end
    end

    local function r1_183(p109_0) -- proto#109 params=1 locals=2 upvalues=3 vararg=false lines=1750-1759
        if p109_0 == r1_37 then
            return 1
        end
        r1_37 = p109_0
        for r109_0 = 1, r1_33 do
            local r109_1 = r1_34[r109_0]
            audio.setVolume(p109_0, { channel = r109_1 })
        end
    end

    local function r1_184() -- proto#110 params=0 locals=0 upvalues=22 vararg=false lines=1761-1793
        r1_25.startedClean = true
        r1_26.startedCleanNow()
        r1_6:removeEventListener("collision", r1_6)
        r1_99:removeEventListener("sprite", r1_101)
        r1_70:removeEventListener("sprite", r1_71)
        r1_73:removeEventListener("sprite", r1_75)
        r1_67:removeEventListener("sprite", r1_68)
        r1_64:removeEventListener("sprite", r1_65)
        r1_85:removeEventListener("sprite", r1_88)
        r1_96:removeEventListener("sprite", r1_97)
        r1_93:removeEventListener("sprite", r1_94)
        transition.cancel("ninjaTrans")
        if r1_12 then
            r1_12.cleanBot()
        end
        if r1_57 then
            r1_57:dispose()
        end
        r1_7:removeSelf()
        r1_7 = nil
        r1_6:removeSelf()
        r1_6 = nil
    end

    if r1_41.spriteItem then
        r1_8:insert(r1_41.spriteItem)
    end
    r1_8:insert(r1_85)
    r1_8:insert(r1_41.spriteBody)
    local r1_185 = r1_8
    r1_185:insert(r1_41.spriteBoots)
    if r1_41.spriteHat then
        r1_8:insert(r1_41.spriteHat)
    end
    r1_185 = r1_6
    r1_185:insert(r1_8)
    r1_6:insert(r1_13.bladeImage)
    r1_6:insert(r1_13.trapImage)
    r1_6:insert(r1_13.bounceTrapImage)
    r1_6:insert(r1_13.ninjaPlayerImage)
    r1_6:insert(r1_70)
    r1_6:insert(r1_67)
    r1_185 = r1_6
    local r1_186, r1_187 = r1_185.insert, r1_64
    r1_186(r1_185, r1_187)
    r1_185 = r1_6
    r1_186 = r1_185.insert
    r1_187 = r1_99
    r1_186(r1_185, r1_187)
    r1_185 = r1_6
    r1_186 = r1_185.insert
    r1_187 = r1_89
    r1_186(r1_185, r1_187)
    r1_185 = r1_6
    r1_186 = r1_185.insert
    r1_187 = r1_96
    r1_186(r1_185, r1_187)
    r1_185 = r1_6
    r1_186 = r1_185.insert
    r1_187 = r1_93
    r1_186(r1_185, r1_187)
    r1_186 = nil
    r1_185 = -3
    r1_187 = r1_2.getAvatarName
    r1_187 = r1_187(r1_53)
    if r1_187 == "fox" then
        r1_186 = 2
    elseif r1_187 == "bear" then
        r1_186 = 7
    elseif r1_187 == "turtle" then
        r1_186 = 8
    elseif r1_187 == "skunk" then
        r1_186, r1_185 = 6, -2
    elseif r1_187 == "bunny" then
        r1_186 = 5
    elseif r1_187 == "panda" then
        r1_186, r1_185 = 5, 0
    elseif r1_187 == "doe" then
        r1_186, r1_185 = 2, -2
    elseif r1_187 == "beaver" then
        r1_186, r1_185 = 5, -4
    elseif r1_187 == "parrot" then
        r1_186, r1_185 = 2, 1
    elseif r1_187 == "penguin" then
        r1_186, r1_185 = 3, 0
    elseif r1_187 == "cat" then
        r1_186, r1_185 = 1, 2
    elseif r1_187 == "squirrel" then
        r1_186, r1_185 = 4, 0
    elseif r1_187 == "gecko" then
        r1_186, r1_185 = 4, 0
    elseif r1_187 == "polarbear" then
        r1_186, r1_185 = 4, -1
    elseif r1_187 == "cheeta" then
        r1_186, r1_185 = 2, 2
    elseif r1_187 == "mouse" then
        r1_186, r1_185 = 4, 0
    elseif r1_187 == "panther" then
        r1_186, r1_185 = 4, 1
    elseif r1_187 == "tiger" then
        r1_186 = 2
    elseif r1_187 == "whiteTiger" then
        r1_186, r1_185 = 2, -2
    elseif r1_187 == "crocodile" then
        r1_186 = 5
    elseif r1_187 == "camel" then
        r1_186, r1_185 = 1, 0
    elseif r1_187 == "unicorn" then
        r1_186 = 2
    elseif r1_187 == "hedgehog" then
        r1_185 = 2
    end
    r1_11:insert(r1_43)
    r1_11:insert(r1_41.spriteHeadBar)
    local r1_188 = r1_11
    r1_188:insert(r1_13.ninjaBarImage)
    r1_11.anchorChildren = true
    r1_11.anchorX = 0.5
    r1_11.anchorY = 1
    r1_41.spriteHeadBar.y = r1_186
    r1_41.spriteHeadBar.x = r1_185
    r1_188 = r1_11
    r1_188:insert(r1_42)
    r1_42.alpha = 0
    r1_42.y = 5
    r1_42.x = 1
    r1_13.ninjaBarImage.alpha = 0
    r1_13.ninjaBarImage.y = -20
    local r1_189 = { 12, 12, 9, 15, 4, 17, -4, 17, -9, 15, -12, 12, -15, 7, 15, 7 }
    r1_188 = { 15, -9, 15, 7, -15, 7, -15, -9 }
    local r1_190 = { -15, -9, -4, -18, 4, -18, 15, -9 }
    if p1_4 or r1_1.gameType == 1 then
        physics.addBody(r1_6, {
            density = 1.27, friction = 0, shape = r1_188, bounce = 0.1,
            filter = remotePlayerCollisionFilter
        }, {
            density = 0, friction = 0, shape = r1_189, bounce = 0.1,
            filter = localPlayerCollisionFilter
        }, {
            density = 0, friction = 0, shape = r1_190, bounce = 0.1,
            filter = remotePlayerCollisionFilter
        })
    else
        physics.addBody(r1_6, {
            density = 1.27, friction = 0, shape = r1_188, bounce = 0.1,
            filter = remotePlayerCollisionFilter
        }, {
            density = 0, friction = 0, shape = r1_189, bounce = 0.1,
            filter = remotePlayerCollisionFilter
        }, {
            density = 0, friction = 0, shape = r1_190, bounce = 0.1,
            filter = remotePlayerCollisionFilter
        })
    end
    local r1_191, r1_192 = physics.addBody, r1_7
    local r1_193 = {
        density = 1.27, friction = 0, shape = r1_188, bounce = 0.1,
        filter = remotePlayerCollisionFilter
    }
    local r1_194 = {
        density = 0, friction = 0, shape = r1_189, bounce = 0.1,
        filter = remotePlayerCollisionFilter
    }
    local r1_195 = {
        density = 0, friction = 0, shape = r1_190, bounce = 0.1,
        filter = remotePlayerCollisionFilter
    }
    r1_191(r1_192, r1_193, r1_194, r1_195)
    timer.performWithDelay(10, r1_173, 1)
    r1_6.isSleepingAllowed = false
    r1_191 = 296 + p1_0 * 40
    r1_6.x = r1_191
    r1_6.y = p1_6
    r1_6.id = p1_0
    r1_6.player = true
    r1_6.onGround = true
    r1_6.isFixedRotation = true
    r1_6.mobileUser = false
    r1_6.ninjaMark = false
    r1_191 = r1_6.x
    r1_7.x = r1_191
    r1_191 = r1_6.y
    r1_7.y = r1_191
    r1_7.isFixedRotation = true
    r1_7.isSleepingAllowed = false
    r1_191 = r1_13.bladeImage
    r1_191.alpha = 0
    r1_13.trapImage.alpha = 0
    r1_13.bounceTrapImage.alpha = 0
    r1_13.ninjaPlayerImage.alpha = 0
    r1_13.ninjaPlayerImage.y = -43
    r1_96.alpha = 0

    function r1_191() -- proto#111 params=0 locals=1 upvalues=4 vararg=false lines=1964-1970
        r1_12 = r1_4.new(r1_6)
        local r111_0 = math.random(335, 345)
        r1_14.defaultTopSpeed = r111_0
        r1_14.topSpeedX = r111_0
        r1_14.tempSpeedX = r111_0
    end

    if isSimulator and r1_1.gameDataTable.bot and p1_4 then
        r1_191()
    elseif r1_1.gameType == 1 and not p1_4 then
        r1_191()
    end

    function r1_192(p112_0, p112_1, p112_2) -- proto#112 params=3 locals=0 upvalues=1 vararg=false lines=1980-1984
        if r1_12 then
            r1_12.setGameFunction(p112_0, p112_1, p112_2)
        end
    end

    r1_6.collision = r1_131
    r1_6.onCollisionPowerUp = r1_178
    r1_6.stopPlayer = r1_139
    r1_6.accelerate = r1_136
    r1_6.getPowerUp = r1_118
    r1_6.usedPowerUp = r1_122
    r1_6.setPlayerPosition = r1_111
    r1_6.getUsername = r1_142
    r1_6.jump = r1_138
    r1_6.canJump = r1_137
    r1_6.speedPowerUp = r1_156
    r1_6.shieldPowerUp = r1_154
    r1_6.armorPowerUp = r1_155
    r1_6.calculateRotation = r1_133
    r1_6.getPlayerGoalTime = r1_140
    r1_6.setPlayerGoalTime = r1_141
    r1_6.getCurrentGameTime = r1_148
    r1_6.setCurrentGameTime = r1_149
    r1_6.getPlayerHead = r1_143
    r1_6.setPlayerHit = r1_150
    r1_6.playHitAnimation = r1_177
    r1_6.getPlayerStatus = r1_146
    r1_6.getPlayerFinish = r1_147
    r1_6.getBodyPartsGroup = r1_151
    r1_6.pauseSprite = r1_123
    r1_6.createBladeAnimation = r1_162
    r1_6.removeBladeAnimation = r1_161
    r1_6.createTrapAnimation = r1_164
    r1_6.removeTrapAnimation = r1_163
    r1_6.createBounceTrapAnimation = r1_166
    r1_6.removeBounceTrapAnimation = r1_165
    r1_6.createMagnetAnimation = r1_167
    r1_6.corrigateOtherPlayers = r1_181
    r1_6.addPlaySoundFunction = r1_182
    r1_6.playSound = r1_39
    r1_6.setSoundVolume = r1_183
    r1_6.setUpdatePowerUpImageFunction = r1_112
    r1_6.getScreenGroup = r1_152
    r1_6.showCloud = r1_84
    r1_6.setKillMessageFunction = r1_171
    r1_6.clean = r1_184
    r1_6.setDisconnected = r1_175
    r1_6.isDisconnected = r1_176
    r1_6.setBotModuleFunction = r1_192
    r1_6.addNinjaMark = r1_114
    r1_6.playPowerUpJumpEffect = r1_92
    r1_6.interpolation = r1_180
    r1_6.getGhostGroup = r1_153
    r1_6.forcePlayer = r1_179
    r1_6.tutorialPause = r1_124
    r1_6.setPowerUp = r1_120
    r1_6.canOtherPlayerUsePU = r1_121
    r1_195 = "addEventListener"
    r1_194 = r1_6
    r1_194[r1_195](r1_194, "collision", r1_6)
    r1_195 = "addEventListener"
    r1_194 = r1_99
    r1_194[r1_195](r1_194, "sprite", r1_101)
    r1_195 = "addEventListener"
    r1_194 = r1_70
    r1_194[r1_195](r1_194, "sprite", r1_71)
    r1_195 = "addEventListener"
    r1_194 = r1_67
    r1_194[r1_195](r1_194, "sprite", r1_68)
    r1_195 = "addEventListener"
    r1_194 = r1_64
    r1_194[r1_195](r1_194, "sprite", r1_65)
    r1_195 = "addEventListener"
    r1_194 = r1_73
    r1_194[r1_195](r1_194, "sprite", r1_75)
    r1_195 = "addEventListener"
    r1_194 = r1_96
    r1_194[r1_195](r1_194, "sprite", r1_97)
    r1_195 = "addEventListener"
    r1_194 = r1_85
    r1_194[r1_195](r1_194, "sprite", r1_88)
    r1_195 = "addEventListener"
    r1_194 = r1_93
    r1_194[r1_195](r1_194, "sprite", r1_94)
    r1_26.readySkull()
    r1_26.readyHead()
    r1_26.readyBrain()
    return r1_6
end

return r0_0
