-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = require("storyboard")
local r0_1 = r0_0.newScene()
local r0_2 = require("rewardedVideoModule")
local r0_3 = require("videoModule")
local r0_4, r0_5, r0_6, r0_7, r0_8, r0_9, r0_10, r0_11, r0_12, r0_13, r0_14, r0_15, r0_16, r0_17, r0_18, r0_19, r0_20, r0_21, r0_22, r0_23, r0_24, r0_25, r0_26, r0_27 = nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil
local r0_28 = nil

function r0_1.createScene(p1_0, p1_1) -- proto#1 params=2 locals=36 upvalues=20 vararg=false lines=28-377
    local r1_0 = p1_0.view
    local r1_1 = require("gui")
    local r1_2 = nil
    local r1_3 = false
    r0_18 = false
    local r1_4 = require("createSprite")
    local r1_5 = { 1, 1, 1, 1 }
    local r1_6 = r0_0.gameDataTable.font
    r0_19 = 0
    if not r0_0.playerInfo then
        r0_0.playerInfo = r0_0.database.getPlayerInformation()
    end

    local function r1_7() -- proto#2 params=0 locals=3 upvalues=1 vararg=false lines=44-49
        r0_0.gameDataTable.playerListNames[1] = {
            username = r0_0.playerInfo.username, avatar = r0_0.database.getAvatarData()
        }
        r0_0.gameType = 1
        r0_0.gameDataTable.mapSelected = 38
        r0_0.gotoScene("gamePlay")
    end

    local function r1_8() -- proto#3 params=0 locals=0 upvalues=1 vararg=false lines=51-54
        r0_0.gotoScene("registerScene")
        r0_0.purgeScene("mainMenu")
    end

    local function r1_9(p4_0) -- proto#4 params=1 locals=1 upvalues=2 vararg=false lines=56-66
        if "clicked" == p4_0.action then
            local r4_0 = p4_0.index
            r0_14 = nil
            if 1 ~= r4_0 and 2 == r4_0 then
                timer.performWithDelay(200, r1_8, 1)
            end
        end
    end

    function r0_20(p5_0) -- proto#5 params=1 locals=4 upvalues=3 vararg=false lines=68-100
        if r0_14 then
            native.cancelAlert(r0_14)
            r0_14 = nil
        end
        if p5_0 == 1 then
            r0_14 = native.showAlert("Trail", "You must create a user to add friends.", {
                "Cancel", "Register"
            }, r1_9)
        elseif p5_0 == 2 then
            r0_14 = native.showAlert("Trail", "You must create a user to edit your avatar.", {
                "Cancel", "Register"
            }, r1_9)
        elseif p5_0 == 3 then
            local r5_0 = native.showAlert
            local r5_1 = r0_0.localized.get("No connection")
            local r5_2 = r0_0.localized.get("Trying to reconnect")
            local r5_3 = { r0_0.localized.get("Ok") }
            r0_14 = r5_0(r5_1, r5_2, r5_3)
        elseif p5_0 == 4 then
            r0_14 = native.showAlert("Trail", "You must create a user to view the highscore table.", {
                "Cancel", "Register"
            }, r1_9)
        elseif p5_0 == 5 then
            r0_14 = native.showAlert("Server message", r0_0.errorTable.market, { "Ok" })
        elseif p5_0 == 6 then
            r0_14 = native.showAlert("Server message", r0_0.errorTable.ranking, { "Ok" })
        elseif p5_0 == 7 then
            r0_14 = native.showAlert("Server message", r0_0.errorTable.friends, { "Ok" })
        elseif p5_0 == 8 then
            r0_14 = native.showAlert("Server message", r0_0.errorTable.server, { "Ok" })
        elseif p5_0 == 9 then
            r0_14 = native.showAlert("Server message", r0_0.errorTable.earnCoins, { "Ok" })
        elseif p5_0 == 10 then
            r0_14 = native.showAlert("Server message", r0_0.errorTable.dinodash, { "Ok" })
        elseif p5_0 == 11 then
            r0_14 = native.showAlert("Server message", "Waiting for server... Try again.", { "Ok" })
        end
    end

    local function r1_10(p6_0) -- proto#6 params=1 locals=0 upvalues=6 vararg=false lines=103-122
        if r0_0.config.tutorial then
            if not r0_0.playerInfo then
                r0_20(11)
                return
            end
            if r0_23 then
                r1_0:insert(r0_23)
                r0_23.alpha = 1
            end
            if r0_22 then
                r1_0:insert(r0_22)
                r0_22.alpha = 1
            end
            timer.performWithDelay(100, r1_7, 1)
        else
            r0_0.gotoScene("playMenu")
        end
        return true
    end

    local function r1_11(p7_0) -- proto#7 params=1 locals=0 upvalues=1 vararg=false lines=124-127
        r0_0.gotoScene("settings")
        return true
    end

    local function r1_12(p8_0) -- proto#8 params=1 locals=0 upvalues=2 vararg=false lines=129-141
        if r0_0.errorTable.ranking then
            r0_20(6)
        elseif r0_0.gameDataTable.tryIt == 0 then
            if r0_0.tcpSocial.isConnected() then
                r0_0.gotoScene("ranking")
            else
                r0_20(3)
            end
        else
            r0_20(4)
        end
    end

    local function r1_13(p9_0) -- proto#9 params=1 locals=0 upvalues=2 vararg=false lines=143-156
        if r0_0.errorTable.friends then
            r0_20(7)
        elseif r0_0.gameDataTable.tryIt == 0 then
            if r0_0.tcpSocial.isConnected() then
                r0_0.tcpSocial.sendPacket({ m = "m" })
                r0_0.gotoScene("friends")
            else
                r0_20(3)
            end
        else
            r0_20(1)
        end
    end

    local function r1_14(p10_0) -- proto#10 params=1 locals=0 upvalues=2 vararg=false lines=158-172
        if r0_0.errorTable.market then
            r0_20(5)
        elseif r0_0.gameDataTable.tryIt == 0 then
            if r0_0.tcpSocial.isConnected() then
                r0_0.gotoScene("marketplace")
                r0_0.database.resetMarketNotification()
            else
                r0_20(3)
            end
        else
            r0_20(2)
        end
    end

    local function r1_15(p11_0) -- proto#11 params=1 locals=0 upvalues=2 vararg=false lines=174-183
        if r0_0.errorTable.earnCoins then
            r0_20(9)
        elseif r0_0.tcpSocial.isConnected() then
            r0_0.gotoScene("earnCoins")
        else
            r0_20(3)
        end
    end

    local function r1_16(p12_0) -- proto#12 params=1 locals=0 upvalues=2 vararg=false lines=185-194
        if r0_0.errorTable.dinodash then
            r0_20(9)
        elseif r0_0.tcpSocial.isConnected() then
            r0_0.showOverlay("dinodash", { isModal = true })
        else
            r0_20(3)
        end
    end

    local function r1_17(p13_0) -- proto#13 params=1 locals=1 upvalues=7 vararg=false lines=196-209
        print("clicked show video main menu")
        if r0_0.tcpSocial.isConnected() then
            r0_2.setActiveVideoData(2, r0_2.getMainMenuRewardedVideoCoinsToEarn(), 1)
            local r13_0 = r0_0.database.getSound() == 0
            r0_3.showVideo(r13_0)
            r0_25()
            r0_26(true)
            r0_11.showButton(false)
        else
            r0_20(3)
        end
    end

    function r0_24(p14_0) -- proto#14 params=1 locals=0 upvalues=2 vararg=false lines=214-235
        if p14_0.m == "l" then
            if p14_0.a == 1 then
                r1_3 = true
            elseif p14_0.a ~= 2 and p14_0.a ~= 3 and p14_0.a == 4 then

            end
            r0_18 = true
            return true
        end
        if r0_18 then
            return true
        end
        return false
    end

    if r0_0.gameDataTable.tryIt == 0 then
        r0_0.playerInfo = r0_0.database.getPlayerInformation()
        r0_0.comm.startSocialTCP(r0_24)
    end
    local r1_18 = display.newImageRect("images/gui/background/background_mainMenu.png", 480, 320)
    r1_18.x = display.contentWidth * 0.5
    r1_18.y = display.contentHeight * 0.5
    r1_0:insert(r1_18)
    local r1_19 = r1_1.newButton
    local r1_20 = {}
    r1_20.image = "images/gui/button/play.png"
    r1_20.width = 120
    r1_20.height = 60
    r1_20.onRelease = r1_10
    r1_20.x = display.contentWidth * 0.5
    local r1_21 = display.contentHeight * 0.575
    r1_20.y = r1_21
    r1_20.displayGroup = r1_0
    r1_21 = nil
    r1_19 = r1_19(r1_20)
    r0_4 = r1_19
    r1_19 = r1_1.newButton
    r1_20 = {
        image = "images/gui/button/settings.png", width = 50, height = 50, onRelease = r1_11, x = 30
    }
    local r1_22 = display.contentHeight - 30
    r1_20.y = r1_22
    r1_20.displayGroup = r1_0
    r1_22 = nil
    r1_19 = r1_19(r1_20)
    r0_5 = r1_19
    r1_19 = r1_1.newButton
    r1_20 = {
        image = "images/gui/button/ranking.png", width = 50, height = 50, onRelease = r1_12, x = 85
    }
    local r1_23 = display.contentHeight - 30
    r1_20.y = r1_23
    r1_20.displayGroup = r1_0
    r1_23 = nil
    r1_19 = r1_19(r1_20)
    r0_6 = r1_19
    r1_19 = r1_1.newButton
    r1_20 = {
        image = "images/gui/button/social.png", width = 50, height = 50, onRelease = r1_13, x = 140
    }
    local r1_24 = display.contentHeight - 30
    r1_20.y = r1_24
    r1_20.displayGroup = r1_0
    r1_24 = nil
    r1_19 = r1_19(r1_20)
    r0_8 = r1_19
    r1_19 = r1_1.newButton
    r1_20 = {}
    r1_20.image = "images/gui/button/market.png"
    r1_20.width = 80
    r1_20.height = 50
    r1_20.onRelease = r1_14
    r1_20.x = display.contentWidth - 50
    local r1_25 = display.contentHeight - 30
    r1_20.y = r1_25
    r1_20.displayGroup = r1_0
    r1_25 = nil
    r1_19 = r1_19(r1_20)
    r0_7 = r1_19
    r1_19 = r1_1.newButton
    r1_20 = {}
    r1_20.image = "images/gui/button/earnCoins.png"
    r1_20.width = 50
    r1_20.height = 50
    r1_20.onRelease = r1_15
    r1_20.x = display.contentWidth - 120
    local r1_26 = display.contentHeight - 30
    r1_20.y = r1_26
    r1_20.displayGroup = r1_0
    r1_26 = nil
    r1_19 = r1_19(r1_20)
    r0_9 = r1_19
    r1_19 = r1_1.newButton
    r1_20 = {}
    r1_20.image = "images/gui/button/FRA.png"
    r1_20.width = 80
    r1_20.height = 50
    r1_20.onRelease = r1_16
    r1_20.x = display.contentWidth - 190
    local r1_27 = display.contentHeight - 30
    r1_20.y = r1_27
    r1_20.displayGroup = r1_0
    r1_27 = nil
    r1_19 = r1_19(r1_20)
    r0_10 = r1_19
    r1_19 = r0_10
    r1_19.isVisible = false
    r1_19 = {}
    r1_20 = { r = 0, g = 0, b = 0 }
    r1_19.highlight = r1_20
    r1_20 = { r = 0, g = 0, b = 0 }
    r1_19.shadow = r1_20
    r1_20 = {}
    r1_20.string = "+" .. 250
    r1_20.x = 10
    r1_20.y = 10
    r1_20.size = 16
    local r1_28 = { 0.23529411764705882, 1, 0 }
    r1_20.color = r1_28
    r1_20.embossColor = r1_19
    r1_28 = r1_1.newButton
    local r1_29 = {
        image = "images/gui/button/videoAd.png", width = 75, height = 45, text = r1_20,
        onRelease = r1_17
    }
    local r1_30 = display.contentWidth - 42
    r1_29.x = r1_30
    r1_29.y = 30
    r1_29.displayGroup = r1_0
    r1_30 = nil
    r1_28 = r1_28(r1_29)
    r0_11 = r1_28
    r1_28 = r0_11
    r1_28 = r1_28.showButton
    r1_28(false)
    r1_28 = r1_4.updateAvatar
    r1_28(r0_0.database.getAvatarData())
    r1_28 = r0_0
    r1_28 = r1_28.config.tutorial
    if r1_28 then
        r0_23 = display.newImageRect("images/gui/background/login.png", 480, 320)
        r0_23.x = display.contentWidth * 0.5
        r0_23.y = display.contentHeight * 0.5
        r1_0:insert(r0_23)
        r0_23.alpha = 0
        r0_22 = display.newText(r0_0.localized.get("LoadingGame"), 0, 0, r1_6, 54)
        r0_22:setFillColor(r1_5[1], r1_5[2], r1_5[3], r1_5[4])
        r0_22.xScale = 0.5
        r0_22.yScale = 0.5
        r0_22.x = display.contentWidth * 0.5
        r0_22.y = display.contentHeight * 0.5
        r1_0:insert(r0_22)
        r0_22.alpha = 0
    end
end

function r0_1.enterScene(p15_0, p15_1) -- proto#15 params=2 locals=16 upvalues=24 vararg=false lines=381-620
    local r15_0 = p15_0.view
    local r15_1 = r0_0.gameDataTable.font
    local r15_2 = 22
    local r15_3 = { 1, 1, 1, 1 }
    local r15_4 = true
    local r15_5, r15_6 = nil, nil
    local r15_7 = false

    function r0_25() -- proto#16 params=0 locals=1 upvalues=5 vararg=false lines=392-415
        if r0_0.getCurrentSceneName() == "mainMenu" then
            local r16_0 = r0_0.database.getMoney()
            r16_0 = r16_0 == nil and 100000 or r16_0
            if r15_5 then
                r15_5:removeSelf()
                r15_5 = nil
            end
            r15_5 = display.newText(r16_0, 0, 0, r15_1, 39)
            r15_5:setFillColor(r15_3[1], r15_3[2], r15_3[3], r15_3[4])
            r15_5.xScale = 0.5
            r15_5.yScale = 0.5
            r15_5.anchorX = 0
            r15_5.anchorY = 0.5
            r15_5.x = 30
            r15_5.y = 25
            r15_0:insert(r15_5)
        end
    end

    r15_6 = display.newImageRect("images/gui/extra/coin.png", 16, 16)
    r15_6.anchorX = 0
    r15_6.anchorY = 0.5
    r15_6.x = 10
    r15_6.y = 25
    r15_0:insert(r15_6)
    if r15_5 then
        r15_0:insert(r15_5)
    end

    function r0_26(p17_0) -- proto#17 params=1 locals=0 upvalues=2 vararg=false lines=426-431
        if r15_5 then
            r15_5.isVisible = p17_0
        end
        r15_6.isVisible = p17_0
    end

    r0_26(false)
    if r0_0.showDinoDash then
        r0_10.isVisible = true
        if r0_0.database.shouldSownFunRunPopup() then
            r0_0.database.haveShownFunRunPopup()
            r0_0.showOverlay("dinodash", { isModal = true })
        end
    end

    function r0_27() -- proto#18 params=0 locals=0 upvalues=4 vararg=false lines=444-449
        if r0_3.isVideoAvailable() and r0_2.shouldShowMainMenuRewardedVideo() and not r15_7 then
            r15_7 = true
            r0_11.showButton(true)
        end
    end

    r0_27()
    Runtime:addEventListener("loadedVideoEvent", r0_27)

    local function r15_8() -- proto#19 params=0 locals=0 upvalues=8 vararg=false lines=453-464
        if r0_0.getCurrentSceneName() == "mainMenu" then
            r0_6.addListener()
            r0_8.addListener()
            r0_4.addListener()
            r0_5.addListener()
            r0_9.addListener()
            r0_10.addListener()
            r0_11.addListener()
        end
    end

    local function r15_9() -- proto#20 params=0 locals=0 upvalues=2 vararg=false lines=466-470
        if r0_0.getCurrentSceneName() == "mainMenu" then
            r0_7.addListener()
        end
    end

    local function r15_10() -- proto#21 params=0 locals=2 upvalues=8 vararg=false lines=473-511
        local r21_0 = r0_0.comm.getNumberOfNotifications()
        if r21_0 > 0 then
            r21_0 = r21_0 > 99 and 99 or r21_0
            if r0_12 then
                r0_12:removeSelf()
                r0_12 = nil
            end
            r0_12 = display.newImageRect("images/gui/mainMenu/alert.png", 20, 20)
            r0_12.x = r0_8.x + 23
            r0_12.y = r0_8.y - 20
            r15_0:insert(r0_12)
            if r0_13 then
                r0_13:removeSelf()
                r0_13 = nil
            end
            r0_13 = display.newText(r21_0, 0, 0, r15_1, r15_2 * 1.8)
            r0_13:setFillColor(r15_3[1], r15_3[2], r15_3[3], r15_3[4])
            r0_13.xScale = 0.5
            r0_13.yScale = 0.5
            r0_13.x = r0_12.x
            r0_13.y = r0_12.y
            r15_0:insert(r0_13)
        else
            if r0_12 then
                r0_12:removeSelf()
                r0_12 = nil
            end
            if r0_13 then
                r0_13:removeSelf()
                r0_13 = nil
            end
        end
    end

    r15_10()

    local function r15_11() -- proto#22 params=0 locals=1 upvalues=8 vararg=false lines=515-553
        local r22_0 = r0_0.database.getMarketNotification()
        if r22_0.number > 0 then
            if r22_0.number > 99 then
                r22_0.number = 99
            end
            if r0_16 then
                r0_16:removeSelf()
                r0_16 = nil
            end
            r0_16 = display.newImageRect("images/gui/mainMenu/alert.png", 20, 20)
            r0_16.x = r0_7.x + 34
            r0_16.y = r0_7.y - 20
            r15_0:insert(r0_16)
            if r0_17 then
                r0_17:removeSelf()
                r0_17 = nil
            end
            r0_17 = display.newText(r22_0.number, 0, 0, r15_1, r15_2 * 1.8)
            r0_17:setFillColor(r15_3[1], r15_3[2], r15_3[3], r15_3[4])
            r0_17.xScale = 0.5
            r0_17.yScale = 0.5
            r0_17.x = r0_16.x
            r0_17.y = r0_16.y
            r15_0:insert(r0_17)
        else
            if r0_16 then
                r0_16:removeSelf()
                r0_16 = nil
            end
            if r0_17 then
                r0_17:removeSelf()
                r0_17 = nil
            end
        end
    end

    r15_11()

    local function r15_12(p23_0) -- proto#23 params=1 locals=0 upvalues=6 vararg=false lines=557-569
        if p23_0.m then
            r15_10()
        end
        if p23_0.m == "x" then
            r0_25()
            r0_21 = timer.performWithDelay(1500, function() -- proto#24 params=0 locals=0 upvalues=1 vararg=false lines=564-564
                r0_26(false)
            end, 1)
        end
        r0_18 = r0_24(p23_0)
    end

    timer.performWithDelay(200, r15_8, 1)
    timer.performWithDelay(400, r15_9, 1)
    r0_0.comm.setCallback(r15_12)

    local function r15_13() -- proto#25 params=0 locals=0 upvalues=3 vararg=false lines=577-584
        if r0_0.gameDataTable.tryIt == 0 and not r0_14 and r0_18 then

        end
    end

    r0_15 = timer.performWithDelay(6000, r15_13, 1)
    r0_0.tcpSocial.setReceiveInterval(nil)

    local function r15_14() -- proto#26 params=0 locals=0 upvalues=1 vararg=false lines=591-596
        if isSimulator and r0_0.gameDataTable.bot then
            r0_0.gotoScene("playMenu")
        end
    end

    timer.performWithDelay(2000, r15_14, 1)
    if r0_0.oldVersion then
        r0_0.gotoUpdateScene = true
        r0_0.gotoScene("updateScene", "fade", 200)
    end
    r0_0.enterMainMenu = true
    if r0_0.errorTable.server and r0_0.errorTable.showServerError then
        r0_0.errorTable.showServerError = false
        r0_20(8)
    end
    if r0_0.config.openPostLobby then
        r0_0.totalGamesPlayed = 3
        r0_0.database.setEarnCoins({})
        r0_0.gotoScene("postLobby")
    end
end

function r0_1.exitScene(p27_0, p27_1) -- proto#27 params=2 locals=1 upvalues=20 vararg=false lines=624-685
    r0_4.removeListener()
    r0_5.removeListener()
    r0_6.removeListener()
    r0_7.removeListener()
    r0_8.removeListener()
    r0_9.removeListener()
    r0_10.removeListener()
    r0_11.removeListener()
    Runtime:removeEventListener("loadedVideoEvent", r0_27)
    if r0_12 then
        r0_12:removeSelf()
        r0_12 = nil
    end
    if r0_13 then
        r0_13:removeSelf()
        r0_13 = nil
    end
    if r0_16 then
        r0_16:removeSelf()
        r0_16 = nil
    end
    if r0_17 then
        r0_17:removeSelf()
        r0_17 = nil
    end
    if r0_14 then
        native.cancelAlert(r0_14)
        r0_14 = nil
    end
    if r0_15 then
        timer.cancel(r0_15)
        r0_15 = nil
    end
    if r0_22 then
        r0_22:removeSelf()
        r0_22 = nil
    end
    if r0_23 then
        r0_23:removeSelf()
        r0_23 = nil
    end
    if r0_21 then
        timer.cancel(r0_21)
        r0_21 = nil
    end
    r0_26(false)
    r0_0.comm.setCallback(function(p28_0) -- proto#28 params=1 locals=0 upvalues=0 vararg=false lines=681-681

    end)
end

function r0_1.destroyScene(p29_0, p29_1) -- proto#29 params=2 locals=0 upvalues=1 vararg=false lines=689-695
    r0_24 = nil
end

r0_1:addEventListener("createScene", r0_1)
r0_1:addEventListener("enterScene", r0_1)
local r0_29 = r0_1
local r0_30, r0_31 = r0_29.addEventListener, r0_1
r0_30(r0_29, "exitScene", r0_31)
r0_29 = r0_1
r0_30 = r0_29.addEventListener
r0_31 = r0_1
r0_30(r0_29, "destroyScene", r0_31)
return r0_1
