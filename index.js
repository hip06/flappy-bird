import { settings } from "./constant.js"

const boxGame = document.getElementById('game')
const ctx = boxGame.getContext('2d')
const boxText = document.getElementById('text')
const ctxText = boxText.getContext('2d')
const bird = document.querySelector('.bird')
const btnPlay = document.querySelector('.btn-play')



class Tube {
    constructor(x, y, height, color) {
        this.x = x
        this.y = y
        this.height = height
        this.color = color
    }

    drawTube() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, settings.WIDTH_TUBE, this.height);
        ctx.fillRect(this.x, this.y + this.height + settings.DISTANCE_TWO_TUBE, settings.WIDTH_TUBE, settings.HEIGHT_SCREEN - this.height - settings.DISTANCE_TWO_TUBE);
        ctx.lineWidth = 4
        ctx.strokeStyle = '#36712A'
        ctx.strokeRect(this.x + 2, this.y - 2, settings.WIDTH_TUBE - 4, this.height)
        ctx.strokeRect(this.x + 2, this.y + this.height + settings.DISTANCE_TWO_TUBE + 2, settings.WIDTH_TUBE - 4, settings.HEIGHT_SCREEN - this.height - settings.DISTANCE_TWO_TUBE)
    }
    clearTube() {
        ctx.clearRect(this.x, this.y, settings.WIDTH_TUBE, this.height)
        ctx.clearRect(this.x, this.y + this.height + settings.DISTANCE_TWO_TUBE, settings.WIDTH_TUBE, settings.HEIGHT_SCREEN - this.height - settings.DISTANCE_TWO_TUBE)
    }
    moveLetf() {
        this.clearTube()
        this.x -= speedTube
        this.drawTube()
    }
    getCurrentX = () => this.x
    getCurrentY = () => this.y
    getCurrentHeight = () => this.height
    getCurrentYOpposite = () => this.height + settings.DISTANCE_TWO_TUBE
    getCurrentHeightOpposite = () => settings.HEIGHT_SCREEN - this.height - settings.DISTANCE_TWO_TUBE
    setNewTube = (x, height) => {
        this.x = x
        this.height = height
    }
}
class Bird {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    getCurrentY = () => this.y
    getCurrentX = () => this.x
    drawBird = () => {
        ctx.drawImage(bird, this.x, this.y, this.width, this.height)
    }
    clearBird = () => {
        ctx.clearRect(this.x, this.y, this.width, this.height)
    }
    moveDown = () => {
        this.clearBird()
        this.y += speed
        speed += acceleraion
        this.drawBird()
    }
}
class Sound {
    constructor(src) {
        this.soundEl = document.createElement("audio");
        this.soundEl.src = src
        this.soundEl.setAttribute("preload", "auto");
        this.soundEl.setAttribute("controls", "none");
        this.soundEl.style.display = "none";
        document.body.appendChild(this.soundEl);
    }
    play = () => {
        this.soundEl.play()
    }
    pause = () => {
        this.soundEl.pause()
    }
    load = () => {
        this.soundEl.load()
    }
}
let createTextScore = () => {
    ctxText.clearRect(0, 0, 150, 50)
    ctxText.font = "30px Comic Sans MS";
    ctxText.fillStyle = 'white'
    ctxText.fillText(`Score: ${score}`, 10, 30)
    ctxText.font = "20px Arial";
    ctxText.fillStyle = '#EE8840'
    ctxText.fillText(`Best: ${bestScore}`, 10, 60)
}
let createTextGameOver = () => {
    if (score > bestScore) localStorage.setItem('bestscore', score)
    ctxText.font = "30px Comic Sans MS";
    ctxText.fillStyle = 'red'
    ctxText.fillText(`Game over ~`, 210, 400)
    ctxText.font = "20px Comic Sans MS";
    ctxText.fillText(`Press C to continue`, 200, 430)
    soundCollision.pause()
    soundCollision.load()
    soundCollision.play()
}


let isEndGame = true
let checkScore = false
let speed = 0
let acceleraion = 0.75
let score = 0
let bestScore = localStorage.getItem('bestscore') || 0
let speedTube = settings.EASY
const tubeOne = new Tube(400, 0, Math.round(settings.MIN_HEIGHT_TUBE + (Math.random() * (settings.MAX_HEIGHT_TUBE - settings.MIN_HEIGHT_TUBE))), settings.COLOR_TUBE)
const tubeTwo = new Tube(700, 0, Math.round(settings.MIN_HEIGHT_TUBE + (Math.random() * (settings.MAX_HEIGHT_TUBE - settings.MIN_HEIGHT_TUBE))), settings.COLOR_TUBE)
const tubeThree = new Tube(1000, 0, Math.round(settings.MIN_HEIGHT_TUBE + (Math.random() * (settings.MAX_HEIGHT_TUBE - settings.MIN_HEIGHT_TUBE))), settings.COLOR_TUBE)
const tubes = [tubeOne, tubeTwo, tubeThree]
const birdPlay = new Bird(100, 400, 50, 50)
const soundTap = new Sound('./tap.wav')
const soundCollision = new Sound('./collision.wav')


// game loop
const run = () => {
    let interval = setInterval(() => {
        if (!isEndGame) {
            birdPlay.moveDown()
            tubeOne.moveLetf()
            tubeTwo.moveLetf()
            tubeThree.moveLetf()
            createTextScore()

            // condition for game over
            if (birdPlay.getCurrentY() >= settings.HEIGHT_SCREEN - 50 || birdPlay.getCurrentY() < - 10) {
                isEndGame = true
                createTextGameOver()
                return
            }

            tubes.forEach((item) => {
                // collision
                if (birdPlay.getCurrentX() + 40 > item.getCurrentX() && birdPlay.getCurrentX() < item.getCurrentX() + settings.WIDTH_TUBE) {
                    checkScore = true
                    if (birdPlay.getCurrentY() < item.getCurrentHeight() || birdPlay.getCurrentY() + 40 > item.getCurrentHeight() + settings.DISTANCE_TWO_TUBE) {
                        isEndGame = true
                        createTextGameOver()
                        return
                    }
                }
                // get score
                if (birdPlay.getCurrentX() >= item.getCurrentX() + settings.WIDTH_TUBE && !isEndGame && checkScore) {
                    score += 1
                    if (score >= settings.BREAK_HARD) speedTube = settings.SUPER_HARD
                    if (score >= settings.BREAK_MEDIUM && score < settings.BREAK_HARD) speedTube = settings.HARD
                    if (score >= settings.BREAK_EASY && score < settings.BREAK_MEDIUM) speedTube = settings.MEDIUM
                    checkScore = false
                }
            })


        } else {
            clearInterval(interval)
        }
        // generate new tubes
        tubes.forEach(item => {
            if (item.getCurrentX() <= -100) {
                item.setNewTube(800, Math.round(settings.MIN_HEIGHT_TUBE + (Math.random() * (settings.MAX_HEIGHT_TUBE - settings.MIN_HEIGHT_TUBE))))
            }
        })
    }, 35)

}
window.addEventListener('keypress', (event) => {
    if (event.code === 'Space' && !isEndGame) {
        soundTap.pause()
        soundTap.load()
        soundTap.play()
        speed = 0
        speed -= 7
    }
    if (event.code === 'KeyC' && isEndGame) {
        location.reload()
    }
    if (event.code === 'Space' && isEndGame) {
        start(event)
    }
})
let start = (event) => {
    event.stopPropagation()
    btnPlay.style.cssText = `display: none`
    isEndGame = false
    run()
}
btnPlay.addEventListener('click', start)


