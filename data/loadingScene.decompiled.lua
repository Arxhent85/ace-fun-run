-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = require("storyboard")
local r0_1 = r0_0.newScene()

function r0_1.createScene(p1_0, p1_1) -- proto#1 params=2 locals=21 upvalues=1 vararg=false lines=14-46
    local r1_0 = p1_0.view
    local r1_1, r1_2, r1_3, r1_4, r1_5 = nil, nil, nil, nil, nil
    local r1_6 = r0_0.gameDataTable.font
    local r1_7 = 22
    local r1_8 = { 1, 1, 1, 1 }
    do
        local r1_9 = nil
    end
    local r1_10 = display.newImageRect("images/gui/background/startScreen.png", 480, 320)
    r1_10.x = display.contentWidth * 0.5
    r1_10.y = display.contentHeight * 0.5
    r1_0:insert(r1_10)
    local r1_11 = display.newRect(0, 0, 200, 20)
    r1_11.strokeWidth = 1
    r1_11:setStrokeColor(1, 1, 1)
    r1_11:setFillColor(1, 1, 1, 0)
    r1_11.x = display.contentWidth * 0.5
    r1_11.y = display.contentHeight * 0.5
    r1_0:insert(r1_11)
    local r1_12 = display.newText(r0_0.localized.get("DirtybitGame"), 0, 0, r1_6, r1_7 * 2)
    r1_12:setFillColor(r1_8[1], r1_8[2], r1_8[3], r1_8[4])
    r1_12.xScale = 0.5
    r1_12.yScale = 0.5
    r1_12.x = display.contentWidth * 0.5
    r1_12.y = display.contentHeight * 0.7
    r1_0:insert(r1_12)
end

function r0_1.enterScene(p2_0, p2_1) -- proto#2 params=2 locals=16 upvalues=1 vararg=false lines=50-240
    local r2_0 = require("sprite")
    local r2_1 = p2_0.view
    local r2_2 = 200
    local r2_3 = 240
    local r2_4 = nil
    local r2_5 = nil

    local function r2_6() -- proto#3 params=0 locals=0 upvalues=1 vararg=false lines=58-61
        r0_0.loadScene("playMenu")
        r0_0.gotoScene("mainMenu")
    end

    if r2_5 then
        r2_5:removeSelf()
    end
    local r2_7 = display.newRect(0, 0, 0, 20)
    r2_7:setFillColor(1, 1, 1, 1)
    r2_7.anchorX = 0
    r2_7.anchorY = 0.5
    r2_7.x = 140
    r2_7.y = display.contentHeight * 0.5
    r2_1:insert(r2_7)

    local function r2_8() -- proto#4 params=0 locals=5 upvalues=2 vararg=false lines=75-77
        transition.to(r2_7, { time = r2_2, width = r2_7.width + 40, x = r2_7.x })
    end

    local function r2_9() -- proto#5 params=0 locals=2 upvalues=4 vararg=false lines=79-105
        local r5_0 = r0_0.gameDataTable.sounds
        r5_0.pickup = audio.loadSound("sound/sfx_pickup.wav")
        r5_0.jump = audio.loadSound("sound/sfx_jump.wav")
        r5_0.blade_activate = audio.loadSound("sound/sfx_blade_activate.wav")
        r5_0.blade_hit = audio.loadSound("sound/sfx_blade_hit.wav")
        r5_0.trap_activate = audio.loadSound("sound/sfx_trap_activate.wav")
        r5_0.trap_hit = audio.loadSound("sound/sfx_trap_hit.wav")
        r5_0.lightning_activate = audio.loadSound("sound/sfx_lightning_activate.wav")
        r5_0.lightning_hit = audio.loadSound("sound/sfx_lightning_hit.wav")
        r5_0.speed_activate = audio.loadSound("sound/sfx_speed_activate.wav")
        r5_0.invul_activate = audio.loadSound("sound/sfx_invul_activate.wav")
        r5_0.armor_activate = audio.loadSound("sound/sfx_armor_activate.wav")
        r5_0.countdown = audio.loadSound("sound/sfx_countdown.wav")
        r5_0.start = audio.loadSound("sound/sfx_start.wav")
        r5_0.blood = audio.loadSound("sound/sfx_blood.wav")
        r5_0.magnet_activate = audio.loadSound("sound/sfx_magnet_activate.wav")
        r5_0.bounce_activate = audio.loadSound("sound/sfx_bounce_activate.wav")
        r5_0.bounce_hit = audio.loadSound("sound/sfx_bounce_hit.wav")
        r5_0.message_received = audio.loadSound("sound/sfx_message_received.wav")
        r5_0.challangeCompleted = audio.loadSound("sound/sfx_coins.wav")
        r0_0.gameDataTable.sounds = r5_0
        r2_8()
        timer.performWithDelay(r2_3, r2_6, 1)
    end

    local function r2_10() -- proto#6 params=0 locals=13 upvalues=5 vararg=false lines=107-129
        local r6_0 = r0_0.gameDataTable.animations
        local r6_1 = r2_0.newSpriteSheetFromData("images/game/powerup/bounceTrap/sprite.png", require("bounceTrapSprite").getSpriteSheetData())
        local r6_2 = r2_0.newSpriteSet(r6_1, 1, 12)
        r2_0.add(r6_2, "play", 1, 5, 70, 1)
        r2_0.add(r6_2, "reset", 5, 8, 800, 1)
        r6_0.bounceTrapSet = r6_2
        local r6_3 = r2_0.newSpriteSheetFromData("images/game/powerup/armor/sprite.png", require("armorSprite").getSpriteSheetData())
        local r6_4 = r2_0.newSpriteSet(r6_3, 1, 12)
        r2_0.add(r6_4, "normal", 1, 12, 300, 0)
        r6_0.armorSpriteSet = r6_4
        local r6_5 = r2_0.newSpriteSheetFromData("images/game/powerup/magnet/hitSprite.png", require("magnetHitSprite").getSpriteSheetData())
        local r6_6 = r2_0.newSpriteSet(r6_5, 1, 4)
        r2_0.add(r6_6, "normal", 1, 4, 400, 1)
        r6_0.magnetEffect = r6_6
        r2_8()
        timer.performWithDelay(r2_3, r2_9, 1)
    end

    local function r2_11() -- proto#7 params=0 locals=10 upvalues=5 vararg=false lines=132-154
        local r7_0 = r0_0.gameDataTable.animations
        local r7_1 = r2_0.newSpriteSheetFromData("images/game/powerup/shield/sprite.png", require("shieldSprite").getSpriteSheetData())
        local r7_2 = r2_0.newSpriteSet(r7_1, 1, 28)
        r2_0.add(r7_2, "shieldStart", 1, 12, 300, 1)
        r2_0.add(r7_2, "shieldActive", 13, 4, 300, 18)
        r2_0.add(r7_2, "shieldEnd", 17, 12, 300, 1)
        r7_0.shieldSpriteSet = r7_2
        local r7_3 = r2_0.newSpriteSheetFromData("images/game/powerup/trap/sprite.png", require("trapSprite").getSpriteSheetData())
        local r7_4 = r2_0.newSpriteSet(r7_3, 1, 10)
        r2_0.add(r7_4, "open", 4, 7, 1000, 1)
        r2_0.add(r7_4, "close", 1, 4, 70, 1)
        r7_0.trapSet = r7_4
        r2_8()
        timer.performWithDelay(r2_3, r2_10, 1)
    end

    local function r2_12() -- proto#8 params=0 locals=15 upvalues=6 vararg=false lines=156-227
        local function r8_0() -- proto#9 params=0 locals=1 upvalues=1 vararg=false lines=162-178
            if r0_0.comm and r0_0.playerInfo then
                if r0_0.tcpSocial then
                    r0_0.comm.stopTCPSocial()
                end
                if r0_0.tcpClient then
                    r0_0.tcpClient.stopTCPClient()
                end
            end
            local r9_0 = r0_0.getCurrentSceneName()
            if r9_0 ~= "mainMenu" then
                r0_0.purgeScene("mainMenu")
            end
            r0_0.gotoScene("registerScene")
            r0_0.purgeScene(r9_0)
        end

        if r0_0.database.getFacebookId() and not r0_0.facebook.isLoggedIn() then
            function r2_4(p10_0) -- proto#10 params=1 locals=0 upvalues=1 vararg=false lines=185-191
                if p10_0.phase == "login" then
                    if p10_0.isError then
                        native.showAlert("Error", "Could not login with Facebook.", { "Ok" }, r8_0)
                    end
                else
                    native.showAlert("Error", "Could not login with Facebook.", { "Ok" }, r8_0)
                end
            end

            r0_0.facebook.login({}, r2_4)
        end
        local r8_1 = r0_0.gameDataTable.animations
        r0_0.loadScene("mainMenu")
        r0_0.httpClient = require("httpClient")
        r0_0.tcpClient = require("tcpClient")
        r0_0.tcpSocial = require("tcpSocial")
        r0_0.comm = require("communicationModule")
        local r8_2 = r2_0.newSpriteSheetFromData("images/game/powerup/magnet/useSprite.png", require("magnetUseSprite").getSpriteSheetData())
        local r8_3 = r2_0.newSpriteSet(r8_2, 1, 6)
        r2_0.add(r8_3, "normal", 1, 6, 300, 1)
        r8_1.magnetUse = r8_3
        local r8_4 = r2_0.newSpriteSheetFromData("images/game/powerup/lightning/lightningBoltSprite.png", require("lightningBoltSprite").getSpriteSheetData())
        local r8_5 = r2_0.newSpriteSet(r8_4, 1, 2)
        r2_0.add(r8_5, "normal", 1, 2, 400, 2)
        r8_1.lightningBoltSet = r8_5
        r2_8()
        timer.performWithDelay(r2_3, r2_11, 1)
    end

    local r2_13 = r2_8
    r2_13()
    r2_13 = timer
    r2_13.performWithDelay(r2_3, r2_12, 1)
end

function r0_1.exitScene(p11_0, p11_1) -- proto#11 params=2 locals=0 upvalues=0 vararg=false lines=244-248

end

function r0_1.destroyScene(p12_0, p12_1) -- proto#12 params=2 locals=0 upvalues=0 vararg=false lines=252-255

end

r0_1:addEventListener("createScene", r0_1)
r0_1:addEventListener("enterScene", r0_1)
r0_1:addEventListener("exitScene", r0_1)
r0_1:addEventListener("destroyScene", r0_1)
return r0_1
