import EventEmitter from 'eventemitter3'
import DrawStyle from './DrawStyle'
import { getDist } from './utils'
/**
 * 2019/4/15
 * wangli
 */

//画布尺寸
const size = { width: 5120, height: 2880 }
//创建一个画布对象
const createCanvas = function () {
    let cvs = document.createElement('canvas')
    cvs.width = size.width
    cvs.height = size.height
    return cvs
}
export default class EPaint extends EventEmitter {
    /**
     * 构建线条实例
     * @param {object} data 初始化数据 
     * @param {objcet} style 默认样式颜色
     */
    constructor(data, ctx, style) {
        super()
        this.__afresh = true
        this.trackData = data || []
        this.style = { lineWidth: 2, fillStyle: "#333333", strokeStyle: "#333333", lineJoin: "round", lineCap: "round" }
        this.startPiont = { x: 0, y: 0 }
        this.size = 2
        this.follow = 6
        this.currentType = 'line'
        this.tempTrack = []
        this.clearData = []
        this.ctx = ctx || createCanvas().getContext("2d")
        if (style) Object.assign(this.style, style)
        Object.assign(this.ctx, this.style)
    }
    /**
     * 划线样式
     * @param {objcet} style 
     */
    setLineStyle(style) {
        Object.assign(this.style, style)
        Object.assign(this.ctx, this.style)
    }
    /**
     * 开始绘画位置
     * @param {point} track 
     */
    beginPoint(track) {
        this.tempTrack = Object.values(track)
        this.startPiont = track
        if (this.currentType != 'line') {
            this.drawPolygon({ data: Object.values(track), type: this.currentType, size: this.size, follow: this.follow, style: this.style })
            this.update()
        }
    }
    /**
     * 绘画当前位置坐标
     * @param {point} track 
     */
    movePoint(track) {
        var x = this.startPiont.x, y = this.startPiont.y, x2 = track.x, y2 = track.y
        if (this.currentType == 'line') {
            this.tempTrack.push(...Object.values(track))
            this.drawPolygon({ data: [x, y, x2, y2], type: this.currentType, style: this.style })
            this.startPiont = track
            this.update()
        } else if (getDist(x, y, x2, y2) > this.follow) {
            this.tempTrack.push(...Object.values(track))
            this.drawPolygon({ data: [x2, y2], type: this.currentType, size: this.size, follow: this.follow, style: this.style })
            this.startPiont = track
            this.update()
        }
    }
    /**
     * 结束当前绘画路径
     */
    trackOver() {
        if (this.currentType == 'line') {
            this.trackData.push({ action: "drawing", type: this.currentType, style: Object.assign({}, this.style), data: [...this.tempTrack] })
        } else {
            this.trackData.push({ action: "drawing", type: this.currentType, size: this.size, follow: this.follow, style: Object.assign({}, this.style), data: [...this.tempTrack] })
        }
        this.update()
    }
    /**
     * 清除位置（橡皮路径）
     * @param {rect} rect 
     */
    clear(rect) {
        this.clearData.push(rect.x, rect.y, rect.width, rect.height)
        this.clearPolygon([rect.x, rect.y, rect.width, rect.height])
        this.update()
    }
    //结束橡皮路径()
    clearOver() {
        this.trackData.push({ action: "clearRect", data: [...this.clearData] })
        this.clearData = []
        this.update()
    }
    /**
     * 清空画布重新绘制历史纪录
     */
    drawHistory() {
        // 清空画布重新绘制
        this.ctx.clearRect(0, 0, size.width, size.height)
        for (var key in this.trackData) {
            switch (this.trackData[key].action) {
                case 'drawing':
                    this.drawPolygon(this.trackData[key])
                    break;
                case 'clearRect':
                    this.clearPolygon(this.trackData[key].data)
                    break;
            }
        }
        this.update()
    }
    /**
     * 绘制数据
     * @param {array} track 
     * @param {string} style 
     */
    drawPolygon(value) {
        var track = value.data, type = value.type || 'line', startX = track[0], startY = track[1]
        Object.assign(this.ctx, value.style)
        if (value.type == 'line') {
            for (var i = 2, lg = track.length; i < lg; i += 2) {
                var endX = track[i], endY = track[i + 1]
                if (DrawStyle[type]) DrawStyle[type].call(this.ctx, { startX, startY, endX, endY })
                startX = endX, startY = endY
            }
        } else if (DrawStyle[type]) {
            for (var i = 0, lg = track.length; i < lg; i += 2) {
                DrawStyle[type].call(this.ctx, { x: track[i], y: track[i + 1], size: value.size })
            }
        }
    }
    clearPolygon(track) {
        for (var i = 0, lg = track.length; i < lg; i += 4) {
            this.ctx.clearRect(track[i], track[i + 1], track[i + 2], track[i + 3])
        }
    }
    /**
     * 撤销，后退
     */
    revoke() {
        this.trackData.pop()
        this.tempTrack = []
        this.clearData = []
        this.drawHistory()
    }
    /**
     * 设置绘图数据
     * @param {array} value 
     */
    setData(value) {
        this.trackData = value
        this.drawHistory()
    }
    update() {
        this.emit('update', this)
    }
    get canvas() {
        return this.ctx.canvas
    }
    get data() {
        return this.trackData
    }
}