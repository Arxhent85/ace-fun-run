-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

display.setStatusBar(display.HiddenStatusBar)
system.setIdleTimer(false)
local r0_0 = system.getInfo
isAndroid = "Android" == r0_0("platformName")
r0_0 = system.getInfo
isSimulator = "simulator" == r0_0("environment")
r0_0 = { categoryBits = 1, maskBits = 10 }
localPlayerCollisionFilter = r0_0
r0_0 = { categoryBits = 16, maskBits = 2 }
remotePlayerCollisionFilter = r0_0
r0_0 = { categoryBits = 2, maskBits = 21 }
obstacleFilter = r0_0
r0_0 = { categoryBits = 4, maskBits = 2 }
powerUpFilter = r0_0
r0_0 = { categoryBits = 8, maskBits = 1 }
sensorFilter = r0_0
local r0_1 = "Brady Bunch Remastered"
if isAndroid then
    r0_1 = "BradyBunchRemastered"
end
if audio.supportsSessionProperty == true then
    audio.setSessionProperty(audio.MixMode, audio.AmbientMixMode)
    print("")
end
local r0_2 = require("storyboard")
local r0_3 = require("configuration")
local r0_4 = require("database")
r0_2.database = r0_4
r0_2.gamesPlayed = 0

function r0_4() -- proto#1 params=0 locals=1 upvalues=1 vararg=false lines=39-57
    if r0_2.gameDataTable and r0_2.gameDataTable.sounds then
        for r1_0 = 1, #r0_2.gameDataTable.sounds do
            audio.dispose(r0_2.gameDataTable.sounds[r1_0])
        end
    end
end

local function r0_5() -- proto#2 params=0 locals=0 upvalues=1 vararg=false lines=59-70
    if r0_2 and r0_2.comm and r0_2.playerInfo then
        if r0_2.tcpSocial then
            r0_2.comm.stopTCPSocial()
        end
        if r0_2.tcpClient then
            r0_2.tcpClient.stopTCPClient()
        end
    end
end

local function r0_6() -- proto#3 params=0 locals=0 upvalues=1 vararg=false lines=72-81
    if r0_2 and r0_2.comm and r0_2.playerInfo and r0_2.tcpSocial then
        r0_2.comm.stopTCPSocial()
    end
end

local function r0_7(p4_0) -- proto#4 params=1 locals=2 upvalues=1 vararg=false lines=84-100
    if "clicked" == p4_0.action then
        local r4_0 = r0_2.getCurrentSceneName()
        local r4_1 = r0_2.getPrevious()
        r0_2.gotoScene("playMenu")
        if r4_0 == "chatScene" then
            r0_2.purgeScene(r4_0)
            r0_2.purgeScene(r4_1)
        else
            r0_2.purgeScene(r4_0)
        end
        r0_2.suspendAlert = false
    end
end

local function r0_8() -- proto#5 params=0 locals=4 upvalues=2 vararg=false lines=102-108
    if not r0_2.suspendAlert then
        r0_2.suspendAlert = true
        native.showAlert(r0_2.localized.get("Disconnected"), r0_2.localized.get("YouSuspended"), {
            r0_2.localized.get("Ok")
        }, r0_7)
    end
end

local function r0_9(p6_0) -- proto#6 params=1 locals=0 upvalues=0 vararg=false lines=110-117
    print(p6_0)
    if math.random(1, 10) > 3 then
        print("supprees error")
        return true
    end
    print("show error")
end

local function r0_10(p7_0) -- proto#7 params=1 locals=2 upvalues=6 vararg=false lines=119-176
    if p7_0.type == "applicationStart" then
        r0_2.notification.clearLocalPushNotificationQueue()
    elseif p7_0.type == "applicationExit" then
        r0_5()
        r0_4()
        if isAndroid then
            Runtime:removeEventListener("unhandledError", r0_9)
        end
        Runtime:removeEventListener("system", onSystem)
    elseif p7_0.type == "applicationSuspend" then
        if r0_2.getCurrentSceneName() == "earnCoins" then
            print("keep connection open")
        elseif r0_2.getCurrentSceneName() == "postLobby" then
            print("keep connection open")
        elseif r0_2.rewardedVideoType == 2 then
            print("keep connection open")
        elseif r0_2.getCurrentSceneName() == "gamePlay" then
            r0_6()
        else
            r0_5()
        end
        r0_2.notification.queue3DayNotification()
        r0_2.notification.queue7DayNotification()
        r0_2.notification.queue30DayNotification()
    elseif p7_0.type == "applicationResume" then
        if r0_2.comm and r0_2.tcpSocial then
            if r0_2.getCurrentSceneName() == "earnCoins"
                or r0_2.getCurrentSceneName() == "postLobby"
                or r0_2.rewardedVideoType == 2 then
                if not r0_2.tcpSocial.isConnected() then
                    r0_2.comm.startSocialTCP(function(p9_0) -- proto#9 params=1 locals=0 upvalues=0 vararg=false lines=158-158

                    end)
                end
            else
                r0_2.comm.startSocialTCP(function(p8_0) -- proto#8 params=1 locals=0 upvalues=0 vararg=false lines=156-156

                end)
            end
            if r0_2.getCurrentSceneName() == "facebookScene" then
                r0_2.facebookCallback()
            elseif r0_2.getCurrentSceneName() == "lobbyQuickPlay" then
                r0_8()
            elseif r0_2.getCurrentSceneName() == "lobbyCustomPlay" then
                r0_8()
            elseif r0_2.getCurrentSceneName() == "customplay" then
                r0_8()
            elseif r0_2.getCurrentSceneName() == "chatScene" then
                r0_8()
            end
        end
        r0_2.notification.clearLocalPushNotificationQueue()
    end
end

local r0_11 = Runtime
r0_11:addEventListener("system", r0_10)
if isAndroid then
    local r0_12 = Runtime
    r0_12:addEventListener("unhandledError", r0_9)
end

local function r0_13() -- proto#10 params=0 locals=20 upvalues=2 vararg=false lines=190-307
    r0_2.database.setupTables()
    r0_2.totalGamesPlayed = r0_2.database.getNumberOfGamesPlayed()
    r0_2.localized = require("localization")
    r0_2.localized.updateLanguage()
    require("pushNotification")
    local r10_0 = r0_2
    local r10_1 = {}
    r10_0.gameDataTable = r10_1
    local r10_2 = r0_2.gameDataTable
    r10_1 = r0_2
    r10_1 = r10_1.config.version
    r10_2.version = r10_1
    r10_2 = r0_2.gameDataTable
    r10_1 = r0_2
    r10_1 = r10_1.config.serverVersion
    r10_2.serverVersion = r10_1
    r10_2 = r0_2.gameDataTable
    r10_1 = {}
    r10_2.playerListNames = r10_1
    r10_2 = r0_2.gameDataTable
    r10_1 = {}
    r10_2.sounds = r10_1
    r10_2 = r0_2.gameDataTable.sounds
    r10_1 = audio
    r10_1 = r10_1.loadSound
    r10_1 = r10_1("sound/sfx_button_press.wav")
    r10_2.buttonSound = r10_1
    r10_2 = r0_2.gameDataTable
    r10_1 = {}
    r10_2.animations = r10_1
    r10_2 = r0_2.gameDataTable.animations
    r10_1 = {}
    r10_2.avatar = r10_1
    r10_2 = r0_2.gameDataTable.animations
    r10_1 = {}
    r10_2.boots = r10_1
    r10_2 = r0_2.gameDataTable.animations
    r10_1 = {}
    r10_2.item = r10_1
    r10_2 = r0_2.gameDataTable.animations
    r10_1 = {}
    r10_2.hat = r10_1
    r0_2.gameDataTable.messageOfTheDay = ""
    r10_2 = r0_2.gameDataTable
    r10_1 = r0_1
    r10_2.font = r10_1
    r10_2 = r0_2.gameDataTable
    r10_1 = { 80, 50, 50, 290 }
    r10_2.backButton = r10_1
    r10_2 = r0_2
    r10_1 = {}
    r10_2.adsTable = r10_1
    r0_2.adsTable.use = false
    r0_2.adsTable.active = false
    r0_2.adsTable.time = 0
    r0_2.adsTable.showTime = 4000
    r0_2.adsTable.refreshRate = 72000
    r0_2.adsTable.videoSeen = 0
    local r10_3 = r0_2.adsTable
    r10_1 = {}
    r10_3.rewardedVideoTypeCounters = r10_1
    r0_2.adsTable.videoLimit = 0
    r10_3 = r0_2
    r10_1 = {}
    r10_3.errorTable = r10_1
    r0_2.errorTable.showServerError = true
    r0_2.suspendAlert = false
    r0_2.wifiOn = true
    local r10_4 = r0_2

    function r10_1() -- proto#11 params=0 locals=0 upvalues=0 vararg=false lines=242-242

    end

    r10_4.facebookCallback = r10_1
    r0_2.videoViewedTime = 0
    r0_2.showingDailyChallange = false
    local r10_5 = r0_2
    r10_1 = {}
    r10_5.onlineFriends = r10_1
    r0_2.gameType = 0
    local r10_6 = r0_2
    r10_1 = {}
    r10_6.gameInvites = r10_1
    local r10_7 = r0_2
    r10_1 = {
        "SunsetValley", "GreenHills", "CliffClimber", "CloudRoad", "BrokenBridge", "MountainView",
        "SugarSlope", "JellyCave", "CandyShop", "ChocolateTops", "FrostingFields", "LollipopRoad",
        "Bridgetown", "ForestJump", "HighPeak", "TwigPeaks", "JumpingBluffs", "HiddenCaves",
        "BridgePass"
    }
    r10_7.mapIconNames = r10_1
    local r10_8 = r0_2
    r10_1 = {
        "Sunset Valley", "Green Hills", "Cliff Climber", "Cloud Road", "Broken Bridge",
        "Mountain View", "Sugar Slope", "Jelly Cave", "Candy Shop", "Chocolate Tops",
        "Frosting Fields", "Lollipop Road", "Bridgetown", "Forest Jump", "High Peak", "Twig peaks",
        "Jumping bluffs", "Hidden caves", "Bridge Pass"
    }
    r10_8.mapIconNamesGame = r10_1
    local r10_9 = r0_2
    r10_1 = require
    r10_1 = r10_1("httpClient")
    r10_9.httpClient = r10_1
    local r10_10 = r0_2
    r10_1 = require
    r10_1 = r10_1("tcpClient")
    r10_10.tcpClient = r10_1
    local r10_11 = r0_2
    r10_1 = require
    r10_1 = r10_1("tcpSocial")
    r10_11.tcpSocial = r10_1
    local r10_12 = r0_2
    r10_1 = require
    r10_1 = r10_1("communicationModule")
    r10_12.comm = r10_1
    local r10_13 = r0_2
    r10_1 = require
    r10_1 = r10_1("lib_facebook")
    r10_13.facebook = r10_1
    local r10_14 = r0_2.facebook
    r10_1 = r0_2
    r10_1 = r10_1.config.facebook
    r10_14.FB_App_ID = r10_1
    r0_2.gameDataTable.tryIt = 0
    if r0_2.database.getPlayerInformation() then
        r0_2.gotoScene("loadingScene")
    else
        r0_2.gotoScene("registerScene")
    end
    r10_14 = r0_2
    r10_1 = require
    r10_1 = r10_1("analytics")
    r10_14.analytics = r10_1
    return true
end

local r0_14 = r0_13
r0_14()
