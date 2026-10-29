-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = require("storyboard")
local r0_1 = r0_0.newScene()
local r0_2, r0_3, r0_4, r0_5, r0_6, r0_7, r0_8, r0_9 = nil, nil, nil, nil, nil, nil, nil, nil

function r0_1.createScene(p1_0, p1_1) -- proto#1 params=2 locals=17 upvalues=6 vararg=false lines=24-166
    local r1_0 = p1_0.view
    local r1_1 = require("gui")
    local r1_2 = nil

    local function r1_3() -- proto#2 params=0 locals=0 upvalues=1 vararg=false lines=30-33
        r0_0.gotoScene("registerScene")
        r0_0.purgeScene("mainMenu")
    end

    local function r1_4(p3_0) -- proto#3 params=1 locals=1 upvalues=2 vararg=false lines=35-45
        if "clicked" == p3_0.action then
            local r3_0 = p3_0.index
            r0_8 = nil
            if 1 ~= r3_0 and 2 == r3_0 then
                timer.performWithDelay(200, r1_3, 1)
            end
        end
    end

    local function r1_5(p4_0) -- proto#4 params=1 locals=8 upvalues=3 vararg=false lines=47-63
        if r0_8 then
            native.cancelAlert(r0_8)
            r0_8 = nil
        end
        if p4_0 == 1 then
            r0_8 = native.showAlert("Trail", "You must create a user to play online.", {
                "Cancel", "Register"
            }, r1_4)
        elseif p4_0 == 2 then
            r0_8 = native.showAlert("Trail", "You must create a user to play online with friends.", {
                "Cancel", "Register"
            }, r1_4)
        elseif p4_0 == 3 then
            local r4_0 = native.showAlert
            local r4_1 = r0_0.localized.get("ServerMessage")
            local r4_2 = r0_0.errorTable.quickplay
            local r4_3 = { r0_0.localized.get("Ok") }
            r0_8 = r4_0(r4_1, r4_2, r4_3)
        elseif p4_0 == 4 then
            local r4_4 = native.showAlert
            local r4_5 = r0_0.localized.get("ServerMessage")
            local r4_6 = r0_0.errorTable.friends
            local r4_7 = { r0_0.localized.get("Ok") }
            r0_8 = r4_4(r4_5, r4_6, r4_7)
        end
    end

    local function r1_6(p5_0) -- proto#5 params=1 locals=4 upvalues=1 vararg=false lines=67-77
        r0_0.gameDataTable.playerListNames[1] = {
            username = r0_0.playerInfo.username, avatar = r0_0.database.getAvatarData()
        }
        r0_0.gameDataTable.playerListNames[2] = { username = "BearBot", avatar = { 2, 1, 1, 1 } }
        r0_0.gameDataTable.playerListNames[3] = { username = "PandaBot", avatar = { 3, 4, 3, 2 } }
        r0_0.gameDataTable.playerListNames[4] = { username = "TurtleBot", avatar = { 4, 2, 4, 3 } }
        r0_0.gameType = 1
        r0_0.gotoScene("lobbySingleplayer")
        r0_0.purgeScene("playMenu")
        return true
    end

    local function r1_7(p6_0) -- proto#6 params=1 locals=0 upvalues=2 vararg=false lines=79-91
        if r0_0.errorTable.quickplay then
            r1_5(3)
        else
            if r0_0.gameDataTable.tryIt == 0 then
                r0_0.tcpSocial.setReceiveInterval(100)
                r0_0.gameType = 2
                r0_0.gotoScene("lobbyQuickPlay")
                r0_0.purgeScene("playMenu")
                return true
            end
            r1_5(1)
        end
    end

    local function r1_8(p7_0) -- proto#7 params=1 locals=0 upvalues=2 vararg=false lines=93-104
        if r0_0.errorTable.friends then
            r1_5(4)
        elseif r0_0.gameDataTable.tryIt == 0 then
            r0_0.tcpSocial.setReceiveInterval(100)
            r0_0.gameType = 3
            r0_0.gotoScene("customplay")
            r0_0.purgeScene("playMenu")
        else
            r1_5(2)
        end
    end

    local function r1_9(p8_0) -- proto#8 params=1 locals=0 upvalues=1 vararg=false lines=106-108
        r0_0.gotoScene("mainMenu")
    end

    local r1_10 = display.newImageRect("images/gui/background/background_playMenu.png", 480, 320)
    r1_10.x = display.contentWidth * 0.5
    r1_10.y = display.contentHeight * 0.5
    local r1_11 = r1_0.insert
    r1_11(r1_0, r1_10)
    r1_11 = r1_1.newButton
    local r1_12 = {}
    r1_12.image = "images/gui/button/singlePlayer.png"
    local r1_13 = {}
    local r1_14 = r0_0.localized.get("Practice")
    r1_13.string = r1_14
    r1_13.size = 20
    r1_14 = { fr = 18, es = 16 }
    r1_13.languageSizes = r1_14
    r1_13.y = 30
    r1_12.text = r1_13
    r1_12.width = 100
    r1_12.height = 100
    r1_12.onRelease = r1_6
    r1_13 = display
    r1_13 = r1_13.contentWidth
    r1_13 = r1_13 * 0.17
    r1_12.x = r1_13
    r1_13 = display
    r1_13 = r1_13.contentHeight
    r1_13 = r1_13 * 0.4
    r1_12.y = r1_13
    r1_12.displayGroup = r1_0
    r1_13 = nil
    r1_11 = r1_11(r1_12)
    r0_2 = r1_11
    r1_11 = r1_1.newButton
    r1_12 = {}
    r1_12.image = "images/gui/button/quickPlay.png"
    r1_13 = {}
    r1_14 = r0_0
    r1_14 = r1_14.localized.get
    r1_14 = r1_14("QuickPlay")
    r1_13.string = r1_14
    r1_13.size = 30
    r1_14 = { fr = 28, es = 26, ja = 18, ko = 25, de = 24 }
    r1_13.languageSizes = r1_14
    r1_13.y = 40
    r1_12.text = r1_13
    r1_12.width = 150
    r1_12.height = 150
    r1_12.onRelease = r1_7
    r1_13 = display
    r1_13 = r1_13.contentWidth
    r1_13 = r1_13 * 0.5
    r1_12.x = r1_13
    r1_13 = display
    r1_13 = r1_13.contentHeight
    r1_13 = r1_13 * 0.4
    r1_12.y = r1_13
    r1_12.displayGroup = r1_0
    r1_13 = nil
    r1_11 = r1_11(r1_12)
    r0_3 = r1_11
    r1_11 = r1_1.newButton
    r1_12 = {}
    r1_12.image = "images/gui/button/host.png"
    r1_13 = {}
    r1_14 = r0_0
    r1_14 = r1_14.localized.get
    r1_14 = r1_14("Friends")
    r1_13.string = r1_14
    r1_13.size = 20
    r1_14 = { fr = 18, es = 16 }
    r1_13.languageSizes = r1_14
    r1_13.y = 30
    r1_12.text = r1_13
    r1_12.width = 100
    r1_12.height = 100
    r1_12.onRelease = r1_8
    r1_13 = display
    r1_13 = r1_13.contentWidth
    r1_13 = r1_13 * 0.83
    r1_12.x = r1_13
    r1_13 = display
    r1_13 = r1_13.contentHeight
    r1_13 = r1_13 * 0.4
    r1_12.y = r1_13
    r1_12.displayGroup = r1_0
    r1_13 = nil
    r1_11 = r1_11(r1_12)
    r0_4 = r1_11
    r1_11 = r1_1.newButton
    r1_12 = {}
    r1_12.image = "images/gui/button/home.png"
    r1_13 = r0_0
    r1_13 = r1_13.gameDataTable.backButton[1]
    r1_12.width = r1_13
    r1_13 = r0_0
    r1_13 = r1_13.gameDataTable.backButton[2]
    r1_12.height = r1_13
    r1_12.onRelease = r1_9
    r1_13 = r0_0
    r1_13 = r1_13.gameDataTable.backButton[3]
    r1_12.x = r1_13
    r1_13 = r0_0
    r1_13 = r1_13.gameDataTable.backButton[4]
    r1_12.y = r1_13
    r1_12.displayGroup = r1_0
    r1_13 = nil
    r1_11 = r1_11(r1_12)
    r0_5 = r1_11
    r1_11 = r0_0
    r1_11 = r1_11.tcpSocial.setReceiveInterval
    r1_11(nil)
end

function r0_1.enterScene(p9_0, p9_1) -- proto#9 params=2 locals=19 upvalues=8 vararg=false lines=170-295
    local r9_0, r9_1 = false, false
    local r9_2 = p9_0.view
    local r9_3 = r0_0.gameDataTable.font
    local r9_4 = 18
    local r9_5 = { 1, 1, 1, 1 }
    r0_0.gameDataTable.playerListNames = {}
    local r9_6 = {
        "TD1", "TD2", "TD3", "TD4", "TD5", "TD6", "TD7", "TD8", "TD9", "TD10", "TD11", "TD12",
        "TD13", "TD14", "TD15", "TD16", "TD17", "TD18", "TD19", "TD20", "TD21", "TD22", "TD23",
        "TD24", "TD25", "TD26", "TD27", "TD28", "TD29", "TD30", "TD31", "TD32", "TD33", "TD34",
        "TD35", "TD36"
    }
    local r9_7 = r9_6[math.random(1, #r9_6)]
    local r9_8 = r0_0.localized.get(r9_7)
    local r9_9 = type(r0_0.gameDataTable.messageOfTheDay)
    if r9_9 == "string" and string.len(r0_0.gameDataTable.messageOfTheDay) > 1 then
        r9_8 = r0_0.gameDataTable.messageOfTheDay
    end
    r9_9 = display
    r9_9 = r9_9.newText
    r9_9 = r9_9(r9_8, 0, 0, 750, 110, r9_3, r9_4 * 1.9)
    r0_9 = r9_9
    r9_9 = r0_9
    local r9_10 = r9_9
    r9_9 = r9_10.setFillColor
    r9_9(r9_10, r9_5[1], r9_5[2], r9_5[3], r9_5[4])
    r9_9 = r0_9
    r9_9.xScale = 0.5
    r9_9 = r0_9
    r9_9.yScale = 0.5
    r9_9 = r0_9
    r9_9.anchorX = 0
    r9_9 = r0_9
    r9_9.anchorY = 0.5
    r9_9 = r0_9
    r9_9.x = display.contentWidth * 0.2
    r9_9 = r0_9
    local r9_11 = display
    r9_9.y = r9_11.contentHeight * 0.9
    r9_11 = r9_2
    r9_9 = r9_11.insert
    r9_9(r9_11, r0_9)
    r9_9 = math
    r9_9 = r9_9.randomseed
    local r9_12 = os.time()
    local r9_13 = system.getTimer()
    r9_12 = r9_12 + r9_13
    r9_13 = nil
    r9_9(r9_12)

    function r9_9(p10_0) -- proto#10 params=1 locals=0 upvalues=1 vararg=false lines=237-239
        r9_0 = true
    end

    function r0_6(p11_0) -- proto#11 params=1 locals=1 upvalues=3 vararg=false lines=241-247
        if r9_1 == true then
            r9_1 = false
            r9_0 = false
            r0_0.gotoScene("mainMenu")
        end
    end

    function r0_7(p12_0) -- proto#12 params=1 locals=1 upvalues=2 vararg=false lines=249-259
        local r12_0 = p12_0.phase
        local r12_1 = p12_0.keyName
        if r12_0 == "up" and r12_1 == "back" then
            if r9_0 then
                r9_1 = true
            end
            return true
        end
        return false
    end

    local function r9_14() -- proto#13 params=0 locals=0 upvalues=6 vararg=false lines=262-274
        if not r0_2 then
            return
        end
        if r0_0.getCurrentSceneName() == "playMenu" then
            r0_2.addListener()
            r0_3.addListener()
            r0_4.addListener()
            r0_5.addListener()
            r9_9()
        end
    end

    local r9_15 = timer.performWithDelay(200, r9_14, 1)
    local r9_16 = Runtime
    r9_16:addEventListener("key", r0_7)
    local r9_17 = Runtime
    r9_17:addEventListener("enterFrame", r0_6)
    r0_0.tcpClient.stopTCPClient()

    local function r9_18() -- proto#14 params=0 locals=0 upvalues=1 vararg=false lines=284-290
        if isSimulator and r0_0.gameDataTable.bot then
            r0_0.gameType = 2
            r0_0.gotoScene("lobbyQuickPlay")
            r0_0.purgeScene("playMenu")
        end
    end

    timer.performWithDelay(5000, r9_18, 1)
end

function r0_1.exitScene(p15_0, p15_1) -- proto#15 params=2 locals=3 upvalues=8 vararg=false lines=299-320
    r0_2.removeListener()
    r0_3.removeListener()
    r0_4.removeListener()
    r0_5.removeListener()
    if r0_9 then
        r0_9.text = ""
        r0_9 = nil
    end
    if r0_8 then
        native.cancelAlert(r0_8)
        r0_8 = nil
    end
    Runtime:removeEventListener("key", r0_7)
    Runtime:removeEventListener("enterFrame", r0_6)
end

function r0_1.destroyScene(p16_0, p16_1) -- proto#16 params=2 locals=0 upvalues=6 vararg=false lines=324-334
    r0_2 = nil
    r0_3 = nil
    r0_4 = nil
    r0_5 = nil
    r0_6 = nil
    r0_7 = nil
end

r0_1:addEventListener("createScene", r0_1)
r0_1:addEventListener("enterScene", r0_1)
r0_1:addEventListener("exitScene", r0_1)
r0_1:addEventListener("destroyScene", r0_1)
return r0_1
