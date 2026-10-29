-- dialect: lua5.1
-- encoding: auto
-- decompiled by unluac-rs (https://github.com/x3zvawq/unluac-rs)

local r0_0 = {}

function r0_0.getSpriteSheetData() -- proto#1 params=0 locals=31 upvalues=0 vararg=false lines=16-245
    return {
        frames = {
            {
                name = "1Start/01.png", spriteColorRect = { x = 0, y = 13, width = 88, height = 62 },
                textureRect = { x = 362, y = 92, width = 88, height = 62 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = true,
                textureRotated = false
            },
            {
                name = "1Start/02.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 272, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/03.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 182, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/04.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 362, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/05.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 272, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/06.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 182, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/07.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/08.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 362, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/09.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 272, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/10.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 182, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/11.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "1Start/12.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 2, y = 362, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "2Active/01.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 2, y = 272, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "2Active/02.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 2, y = 182, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "2Active/03.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 2, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "2Active/04.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 2, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/01.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 2, y = 362, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/02.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/03.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 182, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/04.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 272, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/05.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 362, y = 2, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/06.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/07.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 182, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/08.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 272, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/09.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 92, y = 362, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/10.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 182, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/11.png", spriteColorRect = { x = 0, y = 0, width = 88, height = 88 },
                textureRect = { x = 272, y = 92, width = 88, height = 88 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = false,
                textureRotated = false
            },
            {
                name = "3Stop/12.png", spriteColorRect = { x = 0, y = 13, width = 88, height = 62 },
                textureRect = { x = 362, y = 92, width = 88, height = 62 },
                spriteSourceSize = { width = 88, height = 88 }, spriteTrimmed = true,
                textureRotated = false
            }
        }
    }
end

return r0_0
