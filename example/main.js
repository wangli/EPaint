import EPaint from '../src'
import data from './data2'
const createCtx = function (width = 800, height = 600) {
    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    document.body.appendChild(canvas)
    canvas.style.backgroundColor = '#ffffff'
    document.body.style.backgroundColor = '#f1f1f1'
    return canvas.getContext('2d')
}
const createGradient = function () {
    var gdt = ctx2.createLinearGradient(0, 0, 800, 0)
    gdt.addColorStop(0, "rgba(255, 0, 0, 255)")
    gdt.addColorStop(0.1666, "rgba(255, 0, 255, 255)")
    gdt.addColorStop(0.3333, "rgba(0, 0, 255, 255)")
    gdt.addColorStop(0.5, "rgba(0, 255, 255, 255)")
    gdt.addColorStop(0.6666, "rgba(0, 255, 0, 255)")
    gdt.addColorStop(0.8333, "rgba(255, 255, 0, 255)")
    gdt.addColorStop(1, "rgba(255, 0, 0, 255)")
    return gdt
}
const colorBox = function (color) {
    var gdx = ctx2.createLinearGradient(740, 0, 800, 0);
    gdx.addColorStop(1, color);
    gdx.addColorStop(0, 'rgba(255,255,255,1)');
    ctx2.fillStyle = gdx;
    ctx2.fillRect(740, 0, 800, 50);
    var gdy = ctx2.createLinearGradient(740, 0, 740, 50);
    gdy.addColorStop(0, 'rgba(0,0,0,0)');
    gdy.addColorStop(1, 'rgba(0,0,0,1)');
    ctx2.fillStyle = gdy;
    ctx2.fillRect(740, 0, 800, 50);
}
const setcolor = function (evt) {
    var point = {
        x: evt.offsetX || evt.targetTouches[0].clientX,
        y: evt.offsetY || evt.targetTouches[0].clientY
    }
    var colorData = ctx2.getImageData(point.x, point.y, 1, 1).data
    var color = 'rgba(' + colorData[0] + ', ' + colorData[1] + ',' + colorData[2] + ', ' + colorData[3] + ')'
    ePaint.setLineStyle({ fillStyle: color, strokeStyle: color })
    if (point.x < 700) {
        colorBox(color)
    }
}
var clear = false;
const startDraw = function (evt) {
    var point = {
        x: evt.offsetX || evt.targetTouches[0].clientX,
        y: evt.offsetY || evt.targetTouches[0].clientY
    }
    if (clear) {
        Object.assign(point, { width: 10, height: 10 });
        ePaint.clear(point);
    } else {
        ePaint.beginPoint(point)
        drawing = true
    }
}
const playDraw = function (evt) {
    var point = {
        x: evt.offsetX || evt.targetTouches[0].clientX,
        y: evt.offsetY || evt.targetTouches[0].clientY
    }
    if (clear) {
        Object.assign(point, { width: 10, height: 10 });
        ePaint.clear(point);
    } else {
        if (drawing) {
            ePaint.movePoint(point)
        }
    }
}
const overDraw = function (evt) {
    if (clear) {
        ePaint.clearOver();
        clear = false;
    } else {
        if (drawing) ePaint.trackOver()
        drawing = false
    }
}
var drawing = false
const ctx2 = createCtx(800, 50), ctx = createCtx(), ePaint = new EPaint([], ctx)
// ePaint.setType('circle2')
ctx2.fillStyle = createGradient(ctx2);
ctx2.fillRect(0, 0, 700, 50);
ctx2.canvas.addEventListener('touchstart', setcolor)
ctx2.canvas.addEventListener('mousedown', setcolor)
colorBox('rgba(255,255,255,255)')

ctx.canvas.addEventListener('touchstart', startDraw)
ctx.canvas.addEventListener('touchmove', playDraw)
ctx.canvas.addEventListener('touchend', overDraw)
ctx.canvas.addEventListener('mousedown', startDraw)
ctx.canvas.addEventListener('mousemove', playDraw)
ctx.canvas.addEventListener('mouseup', overDraw)


window.loadData = function () {
    ePaint.setData(data)
}
window.outData = function () {
    console.log(JSON.stringify(ePaint.data))
}
window.revoke = function () {
    ePaint.revoke()
}
window.penA = function () {
    clear = false;
    ePaint.setType("line")
}
window.penB = function () {
    clear = false;
    ePaint.setType("circleline")
}
window.drawRect = function () {
    clear = false;
    ePaint.setType("rect")
}
window.drawTriant = function () {
    clear = false;
    ePaint.setType("trian")
}
window.drawCircle = function () {
    clear = false;
    ePaint.setType("circle")
}
window.drawEllipse = function () {
    clear = false;
    ePaint.setType("ellipse")
}
window.rubber = function () {
    clear = true;
}