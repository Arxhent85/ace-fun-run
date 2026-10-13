-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = require("storyboard")
local r0_1 = r0_0.newScene()
local r0_2, r0_3, r0_4, r0_5, r0_6, r0_7, r0_8, r0_9, r0_10, r0_11, r0_12, r0_13, r0_14, r0_15, r0_16, r0_17, r0_18, r0_19, r0_20, r0_21, r0_22 = nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil

function r0_1.createScene(p1_0, p1_1) -- proto#1 params=2 locals=14 upvalues=18 vararg=false lines=38-152
    local r1_0 = p1_0.view
    local r1_1 = r0_0.gameDataTable.font
    local r1_2 = 40
    local r1_3 = { 1, 1, 1, 1 }
    local r1_4 = require("rewardedVideoModule")
    r1_4.clearActiveVideoData()
    r0_0.gameDataTable.gameStats = nil
    r0_10 = display.newGroup()
    r1_0:insert(r0_10)
    r0_9 = display.newGroup()
    r1_0:insert(r0_9)
    r0_8 = display.newGroup()
    r1_0:insert(r0_8)
    r0_7 = display.newGroup()
    r1_0:insert(r0_7)
    r0_5 = display.newGroup()
    r1_0:insert(r0_5)
    r0_6 = display.newGroup()
    r1_0:insert(r0_6)
    r0_11 = display.newText("", 0, 0, r1_1, r1_2 * 2.5)
    r0_11:setFillColor(r1_3[1], r1_3[2], r1_3[3], r1_3[4])
    r0_11.xScale = 0.5
    r0_11.yScale = 0.5
    r0_11.x = display.contentWidth * 0.5
    r0_11.y = display.contentHeight * 0.44
    r1_0:insert(r0_11)
    r0_21 = display.newImageRect("images/game/selfArrow.png", 15, 15)
    r0_21.x = 150
    r0_21.y = 160
    r1_0:insert(r0_21)
    r0_20 = display.newImageRect("images/game/powerup/ninja/arrow.png", 15, 15)
    r0_20.x = 150
    r0_20.y = 160
    r0_20.alpha = 0
    r1_0:insert(r0_20)
    r0_4 = display.newImageRect("images/gui/button/smallHome.png", 35, 35)
    r0_4.x = r0_4.width * 0.5 + 8
    r0_4.y = r0_4.height * 0.5 + 8
    r1_0:insert(r0_4)
    r0_13 = display.newText("22", 0, 0, r1_1, r1_2 * 2)
    r0_13:setFillColor(r1_3[1], r1_3[2], r1_3[3], r1_3[4])
    r0_13.xScale = 0.5
    r0_13.yScale = 0.5
    r0_13.x = 240
    r0_13.y = 20
    r1_0:insert(r0_13)
    r0_3 = display.newImageRect("images/transparent.png", 150, 150)
    r0_3.x = display.contentWidth - r0_3.width * 0.5
    r0_3.y = display.contentHeight - r0_3.height * 0.5
    r1_0:insert(r0_3)
    if r0_0.config.tutorial then
        r0_3.alpha = 0
    end
    r0_18 = display.newImageRect("images/gui/button/btnJump.png", 64, 64)
    r0_18.x = display.contentWidth - r0_18.width * 0.5
    r0_18.y = display.contentHeight - r0_18.height * 0.5
    r1_0:insert(r0_18)
    if r0_0.config.tutorial then
        r0_18.alpha = 0
    end
    r0_2 = display.newImageRect("images/transparent.png", 150, 150)
    r0_2.x = r0_2.width * 0.5
    r0_2.y = display.contentHeight - r0_2.height * 0.5
    r1_0:insert(r0_2)
    r0_19 = display.newImageRect("images/gui/button/btnPowerUp.png", 64, 64)
    r0_19.x = r0_19.width * 0.5
    r0_19.y = display.contentHeight - r0_19.height * 0.5
    r1_0:insert(r0_19)
    if r0_0.config.tutorial then
        r0_19.alpha = 0
    end
    r0_15 = display.newImageRect("images/game/networkAlert.png", 25, 25)
    r0_15.x = 125
    r0_15.y = 20
    r1_0:insert(r0_15)
    r0_15.alpha = 0
    r0_14 = {}
    r0_14[1] = r0_0.localized.get("1st")
    r0_14[2] = r0_0.localized.get("2nd")
    r0_14[3] = r0_0.localized.get("3rd")
    r0_14[4] = r0_0.localized.get("4th")
    audio.reserveChannels(21)
end

function r0_1.enterScene(p2_0, p2_1) -- proto#2 params=2 locals=101 upvalues=22 vararg=false lines=156-1241
    local r2_0 = p2_0.view
    local r2_1 = display.newGroup()
    local r2_2 = require("map")
    local r2_3 = require("physics")
    local r2_4 = require("powerUps")
    local r2_5 = require("player")
    local r2_6 = require("tutorialModule")
    local r2_7, r2_8 = false, true
    local r2_9 = true
    local r2_10, r2_11, r2_12, r2_13, r2_14 = false, false, false, false, false
    local r2_15 = 3
    local r2_16 = -1
    local r2_17 = 12000
    local r2_18, r2_19, r2_20 = 0, 0, 0
    local r2_21 = 0
    local r2_22 = r0_0.gameDataTable.font
    local r2_23 = 28
    local r2_24 = { 1, 1, 1, 1 }
    local r2_25 = {}
    local r2_26 = 80
    local r2_27 = {}
    local r2_28 = {}
    local r2_29, r2_30, r2_31, r2_32, r2_33, r2_34, r2_35, r2_36, r2_37, r2_38, r2_39 = nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil
    local r2_40 = r0_0.playerInfo.username
    local r2_41, r2_42 = false, nil
    system.activate("multitouch")

    local function r2_43(p3_0, p3_1) -- proto#3 params=2 locals=0 upvalues=1 vararg=false lines=202-210
        if r0_0.database.getSound() == 1 then
            if p3_1 then
                audio.play(r0_0.gameDataTable.sounds[p3_0], { channel = p3_1 })
            else
                audio.play(r0_0.gameDataTable.sounds[p3_0])
            end
        end
    end

    local r2_44 = 0.9
    local r2_45 = 0.7
    local r2_46 = 0.4
    local r2_47 = 0
    local r2_48 = display.contentWidth
    local r2_49 = display.contentWidth * 2
    local r2_50 = display.contentWidth * 4

    local function r2_51(p4_0, p4_1) -- proto#4 params=2 locals=1 upvalues=7 vararg=false lines=221-233
        local r4_0 = math.abs(p4_0 - p4_1)
        if r4_0 < r2_48 then
            return r2_44
        end
        if r4_0 < r2_49 then
            return r2_45
        end
        if r4_0 < r2_50 then
            return r2_46
        end
        return r2_47
    end

    local function r2_52(p5_0) -- proto#5 params=1 locals=7 upvalues=8 vararg=false lines=235-266
        local r5_0 = r0_0.gameDataTable.playerListNames
        for r5_1 = 1, #r5_0 do
            if r5_0[r5_1].username ~= "" then
                local r5_2 = r5_0[r5_1].username == r2_40
                local r5_3 = math.random(1, 10)
                r5_3 = r5_3 == 2 and 1 or r5_3 == 8 and 6 or r5_3
                local r5_4 = r2_27
                local r5_5 = r2_5.new(r5_1, r5_0[r5_1].username, r5_0[r5_1].avatar, r5_3, r5_2, r2_27, p5_0)
                r5_4[r5_1] = r5_5
                local r5_6 = r2_27[r5_1].addPlaySoundFunction
                r5_5 = r2_43
                r5_6(r5_5)
                r0_5:insert(r2_27[r5_1].getBodyPartsGroup())
                r0_5:insert(r2_27[r5_1])
                r0_5:insert(r2_27[r5_1].getGhostGroup())
                r2_0:insert(r2_27[r5_1].getScreenGroup())
            end
        end
        if r0_0.gameType == 1 then
            r2_8 = false
        end
    end

    local function r2_53(p6_0, p6_1) -- proto#6 params=2 locals=1 upvalues=0 vararg=false lines=268-296
        local r6_0
        if p6_0 == 0 then
            r6_0 = display.newImageRect("images/transparent.png", p6_1, p6_1)
        elseif p6_0 == 1 then
            r6_0 = display.newImageRect("images/game/powerup/blade/icon.png", p6_1, p6_1)
        elseif p6_0 == 2 then
            r6_0 = display.newImageRect("images/game/powerup/trap/icon.png", p6_1, p6_1)
        elseif p6_0 == 3 then
            r6_0 = display.newImageRect("images/game/powerup/lightning/icon.png", p6_1, p6_1)
        elseif p6_0 == 4 then
            r6_0 = display.newImageRect("images/game/powerup/speed/icon.png", p6_1, p6_1)
        elseif p6_0 == 5 then
            r6_0 = display.newImageRect("images/game/powerup/shield/icon.png", p6_1, p6_1)
        elseif p6_0 == 6 then
            r6_0 = display.newImageRect("images/game/powerup/armor/icon.png", p6_1, p6_1)
        elseif p6_0 == 7 then
            r6_0 = display.newImageRect("images/game/powerup/magnet/icon.png", p6_1, p6_1)
        elseif p6_0 == 8 then
            r6_0 = display.newImageRect("images/game/powerup/bounceTrap/icon.png", p6_1, p6_1)
        elseif p6_0 == 9 then
            r6_0 = display.newImageRect("images/game/powerup/ninja/icon.png", p6_1, p6_1)
        elseif p6_0 == 10 then
            r6_0 = display.newImageRect("images/game/powerup/jump/icon.png", p6_1, p6_1)
        elseif p6_0 == 99 then
            r6_0 = display.newImageRect("images/game/powerup/mapIcon.png", p6_1, p6_1)
        end
        return r6_0
    end

    local function r2_54() -- proto#7 params=0 locals=0 upvalues=2 vararg=false lines=299-305
        if r2_39 then
            r2_39:removeSelf()
            r2_39 = nil
            r2_13 = false
        end
    end

    local function r2_55(p8_0) -- proto#8 params=1 locals=1 upvalues=4 vararg=false lines=307-324
        if r2_39 then
            r2_39:removeSelf()
            r2_39 = nil
        end
        local r8_0
        if p8_0 > 50 then
            r8_0 = p8_0 - 50
        else
            r8_0 = p8_0
        end
        p8_0 = r8_0
        r2_39 = r2_53(p8_0, 60)
        r2_39.x = 28
        r2_39.y = display.contentHeight - 30
        r2_0:insert(r2_39)
        r2_13 = true
    end

    local function r2_56(p9_0) -- proto#9 params=1 locals=0 upvalues=1 vararg=false lines=326-328
        r2_55(p9_0)
    end

    local function r2_57() -- proto#10 params=0 locals=0 upvalues=2 vararg=false lines=330-337
        if r2_29.ninjaMark then
            r0_20.alpha = 1
        else
            r0_20.alpha = 0
        end
    end

    local function r2_58(p11_0) -- proto#11 params=1 locals=3 upvalues=4 vararg=false lines=339-341
        local r11_0 = r2_25[p11_0]
        local r11_1 = r2_27[p11_0].x
        local r11_2 = r2_2.getLength() - 10
        r11_0.x = r11_1 / r11_2 * 340 + r2_26
    end

    local function r2_59(p12_0) -- proto#12 params=1 locals=0 upvalues=2 vararg=false lines=344-348
        if p12_0 ~= r0_13.text then
            r0_13.text = r0_14[p12_0]
        end
    end

    local function r2_60(p13_0) -- proto#13 params=1 locals=0 upvalues=1 vararg=false lines=350-355
        if p13_0 and not r2_10 then
            p13_0:removeSelf()
            p13_0 = nil
        end
    end

    local function r2_61(p14_0, p14_1, p14_2) -- proto#14 params=3 locals=15 upvalues=10 vararg=false lines=357-405
        if r2_27 and not r2_10 then
            local r14_0 = r2_27[p14_0].getUsername()
            local r14_1 = r2_27[p14_2].getUsername()
            local r14_2 = 6000
            r14_1 = (p14_1 == 7 or p14_1 == 99) and "" or r14_1
            local r14_3 = display.newText(r14_1, 0, 0, r2_22, r2_23 * 1.5)
            r14_3.anchorX = 1
            r14_3.anchorY = 0
            r14_3:setFillColor(r2_24[1], r2_24[2], r2_24[3], r2_24[4])
            r14_3.xScale = 0.5
            r14_3.yScale = 0.5
            r14_3.x = display.contentWidth * 0.99
            local r14_4 = #r2_28 / 3 + 1
            local r14_5 = display.contentHeight
            r14_3.y = 0 - r14_4 * r14_5 * 0.05

            function r14_4(p15_0) -- proto#15 params=1 locals=0 upvalues=2 vararg=false lines=374-374
                return r2_60(r14_3)
            end

            timer.performWithDelay(r14_2, r14_4, 1)
            local r14_6 = r2_53(p14_1, 26)
            r14_6.anchorX = 1
            r14_6.anchorY = 0
            local r14_7 = r14_3.x
            local r14_8 = r14_3.width
            r14_6.x = r14_7 - r14_8 * 0.5
            r14_7 = #r2_28 / 3 + 1
            r14_8 = display.contentHeight
            r14_6.y = 2 - r14_7 * r14_8 * 0.05

            function r14_7(p16_0) -- proto#16 params=1 locals=0 upvalues=2 vararg=false lines=381-381
                return r2_60(r14_6)
            end

            timer.performWithDelay(r14_2, r14_7, 1)
            local r14_9 = display.newText(r14_0, 0, 0, r2_22, r2_23 * 1.5)
            r14_9.anchorX = 1
            r14_9.anchorY = 0
            r14_9:setFillColor(r2_24[1], r2_24[2], r2_24[3], r2_24[4])
            r14_9.xScale = 0.5
            r14_9.yScale = 0.5
            local r14_10 = r14_6.x
            local r14_11 = r14_6.width
            r14_9.x = r14_10 - r14_11
            r14_10 = #r2_28 / 3 + 1
            r14_11 = display.contentHeight
            r14_9.y = 0 - r14_10 * r14_11 * 0.05

            function r14_10(p17_0) -- proto#17 params=1 locals=0 upvalues=2 vararg=false lines=393-393
                return r2_60(r14_9)
            end

            timer.performWithDelay(r14_2, r14_10, 1)
            r2_28[#r2_28 + 1] = 1
            r2_28[#r2_28 + 1] = 1
            r2_28[#r2_28 + 1] = 1
            r2_1:insert(r14_3)
            r2_1:insert(r14_6)
            local r14_12 = r2_1
            r14_11 = r14_12.insert
            local r14_13 = r14_9
            r14_11(r14_12, r14_13)
            local r14_14 = r2_0
            r14_11 = r14_14.insert
            r14_13 = r2_1
            r14_11(r14_14, r14_13)
        end
    end

    local function r2_62(p18_0, p18_1, p18_2) -- proto#18 params=3 locals=3 upvalues=2 vararg=false lines=407-416
        local r18_0 = 200
        local r18_1 = r2_1.y
        r18_1 = r18_1 + display.contentHeight * 0.05
        r2_1.y = r18_1

        local function r18_2(p19_0) -- proto#19 params=1 locals=0 upvalues=4 vararg=false lines=414-414
            return r2_61(p18_0, p18_1, p18_2)
        end

        timer.performWithDelay(r18_0, r18_2, 1)
    end

    local function r2_63(p20_0) -- proto#20 params=1 locals=2 upvalues=2 vararg=false lines=418-429
        if r2_27[p20_0] and r2_29 and r2_27[p20_0].x and r2_29.x then
            if r2_27[p20_0].x < r2_29.x - 400 then
                return false
            end
            local r20_0 = r2_27[p20_0].x
            if r2_29.x + 580 < r20_0 then
                return false
            end
            return true
        end
        return false
    end

    local function r2_64() -- proto#21 params=0 locals=12 upvalues=13 vararg=false lines=431-463
        if not r2_10 and r2_29 and r2_29.x and r0_5 then
            if r0_0.config.tutorial then
                r2_6.update(r2_29)
                if r2_29.x > 4300 then
                    r0_21.alpha = 0
                    return
                end
            end
            r0_5.x = -r2_29.x + 150
            r0_5.y = -r2_29.y + 204
            r0_6.x = -r2_29.x + 150
            r0_6.y = -r2_29.y + 204
            r0_7.x = -r2_29.x * 0.8
            r0_7.y = -r2_29.y * 0.8
            r0_8.x = -r2_29.x * 0.2
            r0_8.y = -r2_29.y * 0.2
            r0_9.x = -r2_29.x * 0.05
            r0_9.y = -r2_29.y * 0.05
            if r2_7 then
                for r21_0 = 1, #r2_27 do
                    if r2_63(r21_0) then
                        r2_27[r21_0].interpolation()
                        r2_27[r21_0].calculateRotation()
                    else
                        r2_27[r21_0].forcePlayer()
                    end
                end
            end
        end
    end

    local function r2_65() -- proto#22 params=0 locals=0 upvalues=2 vararg=false lines=466-476
        if not r2_10 then
            if r0_0.gameType == 1 then
                r0_0.gotoScene("postLobbySingle")
            else
                r0_0.gotoScene("postLobby")
            end
            r0_0.purgeScene("gamePlay")
        end
    end

    local function r2_66(p23_0) -- proto#23 params=1 locals=11 upvalues=7 vararg=false lines=479-517
        if not r2_10 and not r2_14 then
            local r23_0, r23_1 = 0, 1
            local r23_2 = {}
            local r23_3 = #r2_27
            for r23_4 = 1, r23_3 do
                local r23_5 = r2_27[r23_4].getPlayerGoalTime()
                r23_5 = r23_5 == -2 and 9999999999 or r23_5
                local r23_6 = r2_27[r23_4].getUsername()
                r23_2[r23_4] = { username = r23_6, goalTime = r23_5, index = r23_4 }
                if r23_5 > 0 then
                    r23_0 = r23_0 + 1
                    if r23_5 < r2_29.getPlayerGoalTime() then
                        r23_1 = r23_1 + 1
                    end
                end
            end
            r0_0.gameDataTable.quickPlayerRankingTable = r23_2
            if p23_0 == r2_29.id then
                r2_59(r23_1)
            end
            if r23_0 == #r2_27 and not r2_14 then
                r2_14 = true
                timer.performWithDelay(2000, r2_65, 1)
            end
        end
    end

    local function r2_67() -- proto#24 params=0 locals=2 upvalues=9 vararg=false lines=519-539
        r2_29.setCurrentGameTime(system.getTimer() - r2_18)
        if r2_7 and r2_8 then
            local r24_0 = r2_29.getPlayerFinish()
            r0_0.tcpClient.sendPacketFinish(r24_0, r2_29.id)
        end
        r0_2:removeEventListener("touch", r0_2)
        r0_3:removeEventListener("touch", r0_3)
        if r0_0.gameType == 1 then
            local r24_1 = r2_29.getCurrentGameTime()
            r2_29.setPlayerGoalTime(r24_1)
            r2_62(r2_29.id, 99, r2_29.id)
            r2_66(r2_29.id)
        end
    end

    local function r2_68() -- proto#25 params=0 locals=1 upvalues=15 vararg=false lines=542-582
        if r2_7 and not r2_10 then
            r2_19 = 1
            for r25_0 = 1, #r2_27 do
                if r2_63(r25_0) or r0_0.gameType == 1 then
                    if r2_2.isInGoal(r2_27[r25_0].x) then
                        r2_27[r25_0].stopPlayer()
                        if r2_9 and r2_2.isInGoal(r2_29.x) then
                            r2_9 = false
                            r2_67()
                            if r2_35 then
                                timer.cancel(r2_35)
                                r2_35 = nil
                            end
                        end
                    else
                        r2_27[r25_0].accelerate()
                    end
                else
                    r2_27[r25_0].pauseSprite()
                end
                local r25_1 = r2_27[r25_0].x
                if r2_29.x < r25_1 then
                    r2_19 = r2_19 + 1
                end
                r2_58(r25_0)
            end
            r2_57()
            if not r2_2.isInGoal(r2_29.x) then
                r2_59(r2_19)
                r2_29.setPlayerPosition(r2_19, #r2_27 - r2_20)
            end
        end
    end

    local function r2_69() -- proto#26 params=0 locals=0 upvalues=1 vararg=false lines=584-587
        transition.to(r0_11, { time = 400, alpha = 1 })
        transition.to(r0_11, { time = 400, delay = 500, alpha = 0 })
    end

    local function r2_70() -- proto#27 params=0 locals=1 upvalues=8 vararg=false lines=589-608
        if r2_10 then
            return
        end
        r2_10 = true
        r2_3.pause()
        for r27_0 = 1, #r2_27 do
            r2_27[r27_0].pauseSprite()
        end
        if r2_29.getPlayerGoalTime() < 0 then
            r0_2:removeEventListener("touch", r0_2)
            r0_3:removeEventListener("touch", r0_3)
        end
        if r2_8 then
            r0_0.tcpClient.stopTCPClient()
        end
    end

    local function r2_71(p28_0) -- proto#28 params=1 locals=6 upvalues=2 vararg=false lines=610-628
        if r0_12 then
            r0_12:removeSelf()
            r0_12 = nil
        end
        if p28_0 == "GO!" then
            r0_12 = display.newImageRect("images/game/countdownGo.png", 129, 70)
        else
            local r28_0 = string.len
            local r28_1
            if r28_0(p28_0) > 1 then
                r28_1 = p28_0:sub(1, 1)
            else
                r28_1 = p28_0
            end
            p28_0 = r28_1
            local r28_2 = display.newImageRect
            local r28_3 = p28_0
            local r28_4 = "images/game/countdown" .. r28_3 .. ".png"
            r28_3 = 129
            r0_12 = r28_2(r28_4, r28_3, 70)
        end
        if r0_12 then
            r0_12.x = display.contentWidth * 0.5
            r0_12.y = display.contentHeight * 0.3
            r2_0:insert(r0_12)
        end
    end

    local function r2_72() -- proto#29 params=0 locals=0 upvalues=1 vararg=false lines=630-633
        transition.to(r0_12, { time = 400, alpha = 1 })
        transition.to(r0_12, { time = 400, delay = 500, alpha = 0 })
    end

    local function r2_73() -- proto#30 params=0 locals=0 upvalues=1 vararg=false lines=637-644
        if r0_0.config.tutorial then
            r0_0.gotoScene("playMenu")
        else
            r0_0.gotoScene("mainMenu")
        end
        r0_0.purgeScene("gamePlay")
    end

    local function r2_74(p31_0) -- proto#31 params=1 locals=0 upvalues=3 vararg=false lines=647-654
        if "clicked" == p31_0.action then
            r0_17 = nil
            r2_70()
            timer.performWithDelay(200, r2_73, 1)
        end
    end

    local function r2_75(p32_0) -- proto#32 params=1 locals=1 upvalues=4 vararg=false lines=657-671
        if "clicked" == p32_0.action then
            local r32_0 = p32_0.index
            r0_16 = nil
            if 1 == r32_0 then
                if r2_10 then
                    return
                end
                r2_70()
                timer.performWithDelay(200, r2_73, 1)
            elseif 2 == r32_0 then

            end
        end
    end

    local function r2_76(p33_0) -- proto#33 params=1 locals=1 upvalues=4 vararg=false lines=673-687
        if "clicked" == p33_0.action then
            local r33_0 = p33_0.index
            r0_16 = nil
            if 1 ~= r33_0 and 2 == r33_0 then
                if r2_10 then
                    return
                end
                r2_70()
                timer.performWithDelay(200, r2_73, 1)
            end
        end
    end

    local function r2_77(p34_0) -- proto#34 params=1 locals=8 upvalues=6 vararg=false lines=689-707
        if #r2_27 > 1 and not r0_17 then
            r2_70()
            if isSimulator and r0_0.gameDataTable.bot then
                timer.performWithDelay(200, r2_73, 1)
            elseif p34_0 then
                local r34_0 = native.showAlert
                local r34_1 = r0_0.localized.get("Disconnected")
                local r34_2 = r0_0.localized.get("EndingGameOtherPlayersLeft")
                local r34_3 = { r0_0.localized.get("Ok") }
                r0_17 = r34_0(r34_1, r34_2, r34_3, r2_74)
                r34_0 = r0_0.analytics.newEvent
                r34_1 = "design"
                r34_2 = {}
                r34_2.event_id = "gamePlay:all other players lost connection"
                r34_3 = r0_0.getCurrentSceneName()
                r34_2.area = r34_3
                r34_3 = nil
                r34_0(r34_1, r34_2)
            else
                local r34_4 = native.showAlert
                local r34_5 = r0_0.localized.get("Disconnected")
                local r34_6 = r0_0.localized.get("LostConnection")
                local r34_7 = { r0_0.localized.get("Ok") }
                r0_17 = r34_4(r34_5, r34_6, r34_7, r2_74)
                r34_4 = r0_0.analytics.newEvent
                r34_5 = "design"
                r34_6 = {}
                r34_6.event_id = "gamePlay:lost connection"
                r34_7 = r0_0.getCurrentSceneName()
                r34_6.area = r34_7
                r34_7 = nil
                r34_4(r34_5, r34_6)
            end
        end
    end

    local function r2_78() -- proto#35 params=0 locals=9 upvalues=6 vararg=false lines=709-724
        local r35_0 = r0_0.localized.get("QuitGame")
        if r2_8 then
            if r2_29.getPlayerGoalTime() > 0 then
                r35_0 = r0_0.localized.get("QuitGame")
            else
                r35_0 = r0_0.localized.get("QuitGameWithWarning")
            end
        end
        if isAndroid then
            local r35_1 = native.showAlert
            local r35_2 = r0_0.localized.get("Quit")
            local r35_3 = { r0_0.localized.get("Yes"), r0_0.localized.get("No") }
            r0_16 = r35_1(r35_2, r35_0, r35_3, r2_75)
        else
            local r35_4 = native.showAlert
            local r35_5 = r0_0.localized.get("Quit")
            local r35_6 = { r0_0.localized.get("No"), r0_0.localized.get("Yes") }
            r0_16 = r35_4(r35_5, r35_0, r35_6, r2_76)
        end
    end

    local function r2_79() -- proto#36 params=0 locals=4 upvalues=6 vararg=false lines=727-741
        if r2_29 then
            if math.abs(r2_29.x - r2_21) < 50 then
                r2_36 = r2_36 + 1
            else
                r2_36 = 0
            end
            if r2_36 == 3 then
                r0_0.tcpClient.stopTCPClient()
                local r36_0 = native.showAlert
                local r36_1 = r0_0.localized.get("Disconnected")
                local r36_2 = r0_0.localized.get("DidNotMove")
                local r36_3 = { r0_0.localized.get("Ok") }
                r0_17 = r36_0(r36_1, r36_2, r36_3, r2_74)
            end
            r2_21 = r2_29.x
        end
    end

    local function r2_80(p37_0) -- proto#37 params=1 locals=10 upvalues=23 vararg=false lines=744-835
        r2_16 = system.getTimer()
        if r0_15.alpha == 1 then
            r0_15.alpha = 0
        end
        if not r2_10 and p37_0 then
            if p37_0.m then
                if p37_0.m == "u" then
                    r2_27[p37_0.i].setPowerUp(p37_0.x, p37_0.y, p37_0.p)
                elseif p37_0.m ~= "e" then
                    if p37_0.m == "g" or p37_0.m == "h" or p37_0.m == "i" or p37_0.m == "j" then
                        local r37_0 = nil
                        if p37_0.m == "g" and p37_0.t then
                            r37_0 = p37_0.t
                        end
                        if p37_0.i ~= r2_29.id and r0_0.gameType ~= 1 then
                            r2_27[p37_0.i].corrigateOtherPlayers(p37_0.s.x, p37_0.s.y, p37_0.s.vX, p37_0.s.vY, p37_0.m, r37_0)
                        end
                        r2_27[p37_0.i].connected = true
                        local r37_1 = r2_51(r2_29.x, p37_0.s.x)
                        r2_27[p37_0.i].setSoundVolume(r37_1)
                        if p37_0.m == "h" then
                            if r2_27[p37_0.i].canOtherPlayerUsePU() then
                                r2_4.usePowerUp(p37_0.p.t, p37_0.i, r2_40, nil, p37_0.p.x, p37_0.p.y, r0_5, r2_0, r2_27)
                                if p37_0.p.t <= 50 then
                                    r2_27[p37_0.i].usedPowerUp()
                                end
                            else
                                r0_0.tcpClient.sendPacketReportPlayer(p37_0.i, 1)
                                print("possible cheat, do not create pu")
                            end
                        elseif p37_0.m == "i" then
                            r2_27[p37_0.i].playHitAnimation(p37_0.h.p, p37_0.h.h, p37_0.h.k)
                        elseif p37_0.m == "j" then
                            r2_27[p37_0.i].setPlayerGoalTime(p37_0.s.s)
                            r2_62(p37_0.i, 99, p37_0.i)
                            r2_66(p37_0.i)
                        end
                    elseif p37_0.m == "k" then
                        r2_27[p37_0.i].setPlayerGoalTime(-2)
                        r2_27[p37_0.i].setDisconnected()
                        r2_66(p37_0.i)
                    elseif p37_0.m == "l" then
                        r2_41 = true
                        r0_0.gameDataTable.gameStats = {}
                        r0_0.gameDataTable.gameStats = p37_0
                    end
                end
            elseif p37_0.countdownMessage then
                r2_16 = system.getTimer()
                r2_71(p37_0.countdownMessage)
                r2_72()
                if p37_0.countdownMessage == "GO!" then
                    r2_7 = true
                    r2_18 = system.getTimer()
                    local r37_2 = isSimulator
                    if r37_2 and r0_0.gameDataTable.bot then
                        r2_29.setBotModuleFunction(r2_38, r2_18, r2_42)
                    end
                    r37_2 = timer
                    r37_2 = r37_2.performWithDelay
                    r37_2 = r37_2(5000, r2_79, 0)
                    r2_35 = r37_2
                    r2_43("start")
                else
                    r2_43("countdown")
                end
            end
        end
    end

    local function r2_81(p38_0, p38_1) -- proto#38 params=2 locals=0 upvalues=3 vararg=false lines=838-842
        if r2_8 then
            r0_0.tcpClient.sendPacketHit(p38_0, p38_1, r2_29.id)
        end
    end

    local function r2_82() -- proto#39 params=0 locals=5 upvalues=9 vararg=false lines=845-873
        if r2_8 then
            local r39_0 = system.getTimer()
            local r39_1 = r39_0 - r2_16
            if r2_17 * 0.25 < r39_1 and not r2_14 and r0_15.alpha == 0 then
                r0_15.alpha = 1
            end
            r39_1 = r39_0 - r2_16
            if r2_17 < r39_1 and not r2_14 then
                r0_0.tcpClient.stopTCPClient()
                r2_77()
            end
            local r39_2 = 0
            local r39_3 = #r2_27
            for r39_4 = 1, r39_3 do
                if r2_27[r39_4].getPlayerGoalTime() == -2 then
                    r39_2 = r39_2 + 1
                end
            end
            if r39_2 ~= r2_20 then
                r2_20 = r39_2
            end
            if r2_20 == #r2_27 - 1 then
                r2_77(true)
            end
        end
    end

    local function r2_83(p40_0) -- proto#40 params=1 locals=1 upvalues=10 vararg=false lines=877-902
        if not r2_10 then
            r2_71(r2_15)
            r2_72()
            if r2_15 == r0_0.localized.get("Go") then
                r2_7 = true
                r2_18 = system.getTimer()
                for r40_0 = 1, #r2_27 do
                    r2_27[r40_0].setBotModuleFunction(r2_80, r2_18)
                end
                r2_43("start")
                timer.cancel(p40_0.source)
            else
                r2_43("countdown")
                r2_15 = r2_15 - 1
                if r2_15 == 0 then
                    r2_15 = r0_0.localized.get("Go")
                end
            end
        end
    end

    function r2_38(p41_0) -- proto#41 params=1 locals=1 upvalues=8 vararg=false lines=905-917
        if r2_8 and not r2_10 and not r2_41 then
            r2_82()
            if r2_7 then
                r2_29.setCurrentGameTime(system.getTimer() - r2_18)
                local r41_0 = r2_29.getPlayerStatus()
                r0_0.tcpClient.sendPacket(r41_0, p41_0, r2_29.id)
            end
        end
    end

    local function r2_84(p42_0) -- proto#42 params=1 locals=0 upvalues=1 vararg=false lines=918-918
        return r2_38(nil)
    end

    local function r2_85(p43_0, p43_1) -- proto#43 params=2 locals=2 upvalues=6 vararg=false lines=920-934
        if not (p43_1.phase == "began" and r2_7) then
            return
        end
        local r43_0
        if r0_0.config.tutorial then
            r43_0 = r2_6.jumpButtonClicked()
        else
            r43_0 = false
        end
        local r43_1 = r2_29.canJump()
        if r43_1 or r43_0 then
            r2_29.jump()
            r2_43("jump")
            timer.performWithDelay(10, r2_84, 1)
            r2_29.onGround = false
        end
        r43_1 = true
        return r43_1
    end

    local function r2_86(p44_0) -- proto#44 params=1 locals=0 upvalues=0 vararg=false lines=936-941
        p44_0 = p44_0 * 100
        p44_0 = math.floor(p44_0)
        p44_0 = p44_0 * 0.01
        return p44_0
    end

    local function r2_87(p45_0) -- proto#45 params=1 locals=5 upvalues=8 vararg=false lines=943-953
        local r45_0, r45_1 = r2_4.usePowerUp(p45_0, r2_29.id, r2_40, r2_29, 0, 0, r0_5, r2_0, r2_27)
        local r45_2 = r2_86(r45_0)
        local r45_3 = r2_86(r45_1)
        local r45_4 = { t = p45_0, x = r45_2, y = r45_3 }
        r2_38(r45_4)
    end

    function r2_42(p46_0, p46_1) -- proto#46 params=2 locals=6 upvalues=13 vararg=false lines=955-983
        if not (p46_1.phase == "began" and r2_7) then
            return
        end
        local r46_0
        if r0_0.config.tutorial then
            r46_0 = r2_6.puButtonClicked()
        else
            r46_0 = false
        end
        local r46_1 = r2_29.getPowerUp()
        if r46_1 > 0 and r2_13 or r46_0 then
            r2_29.usedPowerUp()
            local r46_2, r46_3 = r2_4.usePowerUp(r46_1, r2_29.id, r2_40, r2_29, 0, 0, r0_5, r2_0, r2_27)
            local r46_4 = { t = r46_1, x = r46_2, y = r46_3 }
            r2_38(r46_4)
            if r46_1 > 50 then
                local function r46_5(p47_0) -- proto#47 params=1 locals=0 upvalues=2 vararg=false lines=976-976
                    return r2_87(r46_1 - 50)
                end

                timer.performWithDelay(200, r46_5, 1)
            end
            r2_54()
        end
        return true
    end

    local function r2_88(p48_0, p48_1) -- proto#48 params=2 locals=0 upvalues=1 vararg=false lines=985-989
        if p48_1.phase == "began" then
            r2_78()
        end
    end

    local function r2_89() -- proto#49 params=0 locals=3 upvalues=2 vararg=false lines=991-1004
        local r49_0 = 0
        local r49_1 = #r2_27
        for r49_2 = 1, r49_1 do
            if r2_27[r49_2].connected == false and not r2_27[r49_2].mobileUser then
                r2_27[r49_2].setPlayerGoalTime(-2)
                r2_27[r49_2].setDisconnected()
                r49_0 = r49_0 + 1
            end
        end
        if r49_0 == #r2_27 - 1 then
            r2_77(true)
        end
    end

    local function r2_90() -- proto#50 params=0 locals=0 upvalues=8 vararg=false lines=1008-1045
        if r2_31 then
            timer.cancel(r2_31)
            r2_31 = nil
        end
        if r2_37 then
            timer.cancel(r2_37)
            r2_37 = nil
        end
        if r2_33 then
            timer.cancel(r2_33)
            r2_33 = nil
        end
        if r2_34 then
            timer.cancel(r2_34)
            r2_34 = nil
        end
        if r2_8 then
            if r2_30 then
                timer.cancel(r2_30)
                r2_30 = nil
            end
        elseif r2_32 then
            timer.cancel(r2_32)
            r2_32 = nil
        end
        if r2_35 then
            timer.cancel(r2_35)
            r2_35 = nil
        end
    end

    local function r2_91() -- proto#51 params=0 locals=0 upvalues=2 vararg=false lines=1047-1057
        if r0_17 then
            native.cancelAlert(r0_17)
            r0_17 = nil
        end
        if r0_16 then
            native.cancelAlert(r0_16)
            r0_16 = nil
        end
    end

    local function r2_92(p52_0) -- proto#52 params=1 locals=0 upvalues=1 vararg=false lines=1060-1062
        r2_11 = true
    end

    local function r2_93() -- proto#53 params=0 locals=0 upvalues=1 vararg=false lines=1064-1066
        r0_19.alpha = 1
    end

    local function r2_94() -- proto#54 params=0 locals=0 upvalues=2 vararg=false lines=1068-1071
        r0_3.alpha = 1
        r0_18.alpha = 1
    end

    local function r2_95(p55_0) -- proto#55 params=1 locals=0 upvalues=2 vararg=false lines=1073-1078
        if r2_12 == true then
            r2_12 = false
            r2_78()
        end
    end

    local function r2_96(p56_0) -- proto#56 params=1 locals=1 upvalues=2 vararg=false lines=1080-1090
        local r56_0 = p56_0.phase
        local r56_1 = p56_0.keyName
        if r56_0 == "up" and r56_1 == "back" then
            if r2_11 then
                r2_12 = true
            end
            return true
        end
        return false
    end

    local function r2_97() -- proto#57 params=0 locals=0 upvalues=8 vararg=false lines=1092-1102
        if r0_0.getCurrentSceneName() == "gamePlay" then
            r0_3.touch = r2_85
            r0_2.touch = r2_42
            r0_4.touch = r2_88
            r0_2:addEventListener("touch", r0_2)
            r0_3:addEventListener("touch", r0_3)
            r0_4:addEventListener("touch", r0_4)
            r2_92()
        end
    end

    local function r2_98() -- proto#58 params=0 locals=0 upvalues=8 vararg=false lines=1104-1112
        r2_0:insert(r0_4)
        r2_0:insert(r0_13)
        r2_0:insert(r2_1)
        r2_0:insert(r0_3)
        r2_0:insert(r0_18)
        r2_0:insert(r0_19)
        r2_0:insert(r2_39)
    end

    function r0_22() -- proto#59 params=0 locals=4 upvalues=13 vararg=false lines=1115-1154
        r2_10 = true
        r2_90()
        if r2_64 then
            Runtime:removeEventListener("enterFrame", r2_64)
            r2_64 = nil
        end
        if r2_96 then
            Runtime:removeEventListener("key", r2_96)
            r2_96 = nil
        end
        if r2_95 then
            Runtime:removeEventListener("enterFrame", r2_95)
            r2_95 = nil
        end
        system.deactivate("multitouch")
        r2_91()
        r2_4.clean()
        for r59_0 = 1, #r2_27 do
            if r2_27[r59_0] then
                r2_27[r59_0].clean()
                r2_27[r59_0] = nil
            end
        end
        r2_27 = nil
        r2_2.clean()
        r0_12 = nil
        r2_3.stop()
        r2_6.clean()
        r0_0.config.tutorial = false
    end

    local function r2_99() -- proto#60 params=0 locals=19 upvalues=43 vararg=false lines=1156-1234
        r2_3.setVelocityIterations(2)
        r2_3.setPositionIterations(4)
        r2_3.start()
        r2_3.setGravity(0, 20)
        r0_0.powerUpPositions = {}
        local r60_0 = r2_2.init(r0_0.gameDataTable.mapSelected, r0_5, r0_6, r0_7, r0_8, r0_9, r0_10)
        r2_52(r60_0)
        for r60_1 = 1, #r2_27 do
            if r2_27[r60_1].getUsername() == r2_40 then
                r2_29 = r2_27[r60_1]
                r2_19 = #r2_27 - r60_1 + 1
                r2_29.setPlayerHit(r2_81)
                r2_29.setUpdatePowerUpImageFunction(r2_56)
                r2_29.mobileUser = true
                r2_64()
            end
            r2_27[r60_1].connected = false
            r2_27[r60_1].setKillMessageFunction(r2_62)
        end
        r2_2.setMapName(r0_5, r2_29.x)
        r2_4.init()
        r2_4.addPlaySoundFunction(r2_43)
        r2_56(r2_29.getPowerUp())
        for r60_2 = 1, #r2_27 do
            local r60_3 = r2_25
            local r60_4 = r2_27[r60_2].getPlayerHead()
            r60_3[r60_2] = r60_4
            local r60_5 = r2_25[r60_2]
            r60_4 = r2_27
            r60_4 = r60_4[r60_2].x
            r60_4 = r60_4 / (r2_2.getLength() - 10)
            r60_4 = r60_4 * 340
            r60_4 = r60_4 + r2_26
            r60_5.x = r60_4
            r60_5 = r2_25[r60_2]
            r60_4 = display
            r60_4 = r60_4.contentHeight
            r60_4 = r60_4 + 2
            r60_5.y = r60_4
            r60_4 = r2_0
            r60_4:insert(r2_25[r60_2])
            if r0_0.config.tutorial then
                r2_25[r60_2].alpha = 0
            end
        end
        r2_0:insert(r2_25[r2_29.id])
        r2_59(r2_19)
        r2_31 = timer.performWithDelay(100, r2_68, 0)
        if r2_8 then
            r2_16 = system.getTimer()
            r0_0.tcpClient.changeReceiveInfo(r2_80)
            r2_30 = timer.performWithDelay(500, r2_84, 0)
            r2_34 = timer.performWithDelay(18000, r2_89, 1)
        else
            r2_32 = timer.performWithDelay(1000, r2_83, 7)
        end
        if r0_0.config.tutorial then
            r2_6.init(r2_0, r2_3)
            r2_6.setFunctions(r2_94, r2_93)
        end
        r2_98()
        Runtime:addEventListener("enterFrame", r2_64)
        r2_37 = timer.performWithDelay(500, r2_97, 1)
        Runtime:addEventListener("key", r2_96)
        Runtime:addEventListener("enterFrame", r2_95)
    end

    r2_99()
end

function r0_1.exitScene(p61_0, p61_1) -- proto#61 params=2 locals=0 upvalues=2 vararg=false lines=1245-1259
    if r0_4 then
        r0_4:removeEventListener("touch", r0_4)
    end
    if r0_22 then
        r0_22()
        r0_22 = nil
    end
end

function r0_1.destroyScene(p62_0, p62_1) -- proto#62 params=2 locals=0 upvalues=3 vararg=false lines=1263-1281
    r0_16 = nil
    r0_17 = nil
    r0_14 = nil
end

r0_1:addEventListener("createScene", r0_1)
r0_1:addEventListener("enterScene", r0_1)
r0_1:addEventListener("exitScene", r0_1)
r0_1:addEventListener("destroyScene", r0_1)
return r0_1
