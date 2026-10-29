-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.getSpriteSheetData() -- proto#1 params=0 locals=5 upvalues=0 vararg=false lines=16-37
    return {
        frames = {
            {
                name = "Bolt.png", spriteColorRect = { x = 7, y = 22, width = 240, height = 368 },
                textureRect = { x = 2, y = 2, width = 240, height = 368 },
                spriteSourceSize = { width = 254, height = 396 }, spriteTrimmed = true,
                textureRotated = false
            },
            {
                name = "Bolt2.png", spriteColorRect = { x = 17, y = 43, width = 218, height = 334 },
                textureRect = { x = 244, y = 2, width = 218, height = 334 },
                spriteSourceSize = { width = 254, height = 396 }, spriteTrimmed = true,
                textureRotated = false
            }
        }
    }
end

return r0_0
