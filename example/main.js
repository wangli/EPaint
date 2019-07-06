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
    //TODO:新增只有点击开始时才能开始绘制
    if (drawing&&window.sign_start) {
        ePaint.movePoint({
            x: evt.offsetX || evt.targetTouches[0].clientX,
            y: evt.offsetY || evt.targetTouches[0].clientY
        })
    }
}
const overDraw = function (evt) {
    drawing = false
}
var drawing = false
window.ctx = createCtx();
window.ePaint = new EPaint([], ctx)
// ePaint.setType('circle2')
ctx.fillStyle = createGradient();
ctx.fillRect(0, 0, 800, 30);


ctx.canvas.addEventListener('touchstart', startDraw)
ctx.canvas.addEventListener('touchmove', playDraw)
ctx.canvas.addEventListener('touchend', overDraw)
ctx.canvas.addEventListener('mousedown', startDraw)
ctx.canvas.addEventListener('mousemove', playDraw)
ctx.canvas.addEventListener('mouseup', overDraw)
