import EPaint from '../src'
const createCtx = function () {
    var canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    document.body.appendChild(canvas)
    canvas.style.backgroundColor = '#ffffff'
    document.body.style.backgroundColor = '#f1f1f1'
    return canvas.getContext('2d')
}
const createGradient = function () {
    var gdt = ctx.createLinearGradient(0, 0, 800, 0)
    gdt.addColorStop(0, "rgba(255, 0, 0, 255)")
    gdt.addColorStop(0.1666, "rgba(255, 0, 255, 255)")
    gdt.addColorStop(0.3333, "rgba(0, 0, 255, 255)")
    gdt.addColorStop(0.5, "rgba(0, 255, 255, 255)")
    gdt.addColorStop(0.6666, "rgba(0, 255, 0, 255)")
    gdt.addColorStop(0.8333, "rgba(255, 255, 0, 255)")
    gdt.addColorStop(1, "rgba(255, 0, 0, 255)")
    return gdt
}

const startDraw = function (evt) {
    var point = {
        x: evt.offsetX || evt.targetTouches[0].clientX,
        y: evt.offsetY || evt.targetTouches[0].clientY
    }
    if (point.y > 30) {
        ePaint.beginPoint(point)
        drawing = true
    } else {
        var colorData = ctx.getImageData(point.x, point.y, 1, 1).data
        var color = 'rgba(' + colorData[0] + ', ' + colorData[1] + ',' + colorData[2] + ', ' + colorData[3] + ')'
        ePaint.setLineStyle({ fillStyle: color, strokeStyle: color })
        drawing = false
    }
}
const playDraw = function (evt) {
    if (drawing) {
        ePaint.movePoint({
            x: evt.offsetX || evt.targetTouches[0].clientX,
            y: evt.offsetY || evt.targetTouches[0].clientY
        })
    }
}
const overDraw = function (evt) {
    if (drawing) ePaint.trackOver()
    drawing = false
}
var drawing = false
const ctx = createCtx(), ePaint = new EPaint([], ctx)
// ePaint.setType('circle2')
ctx.fillStyle = createGradient();
ctx.fillRect(0, 0, 800, 30);
var btn = document.createElement('div')
btn.innerText="getData"
btn.addEventListener('click',evt=>{
    console.log(JSON.stringify(ePaint))
})
document.body.appendChild(btn)

ctx.canvas.addEventListener('touchstart', startDraw)
ctx.canvas.addEventListener('touchmove', playDraw)
ctx.canvas.addEventListener('touchend', overDraw)
ctx.canvas.addEventListener('mousedown', startDraw)
ctx.canvas.addEventListener('mousemove', playDraw)
ctx.canvas.addEventListener('mouseup', overDraw)