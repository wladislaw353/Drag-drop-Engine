const $dashboard = $('.dashboard')

const width  = 100
const height = 100

let translateOffsetX = 0
let translateOffsetY = 0

let action  = false
let deleted = false
let count   = 0

const localData = localStorage.getItem('stickers')
let stickers = localData === null ? [] : JSON.parse(localData)

if (stickers.length > 0) stickers.forEach(sticker => {
    if(sticker !== null) {
        generate(sticker.x, sticker.y)
    }
})

function randomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}

function generate(sx, sy) {
    const x = (sx !== undefined ? sx : randomInteger(30, $(document).width() - 30 - width))
    const y = (sy !== undefined ? sy : randomInteger(160, $(document).height() - 30 - height))
    $dashboard.append(`<div class="sticker" style="transform: translate(${x}px, ${y}px)"></div>`)
    stickers[count] = { 'x': x, 'y': y }
    localStorage.setItem('stickers', JSON.stringify(stickers))
    count++
}

$dashboard.on('mousedown', '.sticker', (e) => {
    $(e.target).addClass('grab')
    action = true
    const stickerCoordinates = document.querySelector('.grab').getBoundingClientRect()
    translateOffsetX = e.pageX - stickerCoordinates.x
    translateOffsetY = e.pageY - stickerCoordinates.y
})

$(document).mouseup((e) => {
    if (action) {
        action = false

        const sticker = document.querySelector('.grab')
        const stickerCoordinates = sticker.getBoundingClientRect()
        
        if(deleted) {           
            delete stickers[+$('.grab').index()]
            $('.grab').remove()
            deleted = false
        } else {
            stickers[+$('.grab').index()] = { 'x': stickerCoordinates.x, 'y': stickerCoordinates.y }
        }

        count = 0
        stickers = stickers.filter((el)=> {
            if(el !== null) {
                count++
                return el
            }
        })

        localStorage.setItem('stickers', JSON.stringify(stickers))

        $('.sticker').removeClass('grab')
    }
})

$(document).mousemove((e) => {
    if (action) {
        const containerX = document.querySelector('.wrapper .container').getBoundingClientRect().x
        const containerY = document.querySelector('.wrapper .container').getBoundingClientRect().y
        if (e.clientX - translateOffsetX < containerX + 30 && e.clientY - translateOffsetY < containerY + 30) {
            $('.grab').css('transform', `translate(${containerX}px, ${containerY}px)`).addClass('delete')
            deleted = true
        } else {
            $('.grab').css('transform', `translate(${e.clientX - translateOffsetX}px, ${e.clientY - translateOffsetY}px)`).removeClass('delete')
            deleted = false
        }
    }
})

$('button').click(() => generate())