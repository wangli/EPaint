import EventEmitter from 'eventemitter3'
import DrawStyle from './DrawStyle'
import { getDist } from './utils'
/**
 * 2019/4/15
 * wangli
 * v0.1.2
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
     * @param {object} ctx getContext 2d对象 
     * @param {objcet} style 默认样式颜色
     */
    constructor(data, ctx, style) {
        super()
        this.__afresh = true
        // 是否绘制连续线条
        this.isline = true
        // 绘制的路径
        this.trackData = data || []
        // 默认样式
        this.style = { lineWidth: 2, fillStyle: "#333333", strokeStyle: "#333333", lineJoin: "round", lineCap: "round" }
        // 当前开始位置
        this.startPiont = { x: 0, y: 0 }
        // 绘制类型
        this.currentType = 'line'
        // 临时路径
        this.tempTrack = []
        // 清楚画布的数据
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
     *  {x:val,y:val}
     */
    beginPoint(track) {
        this.tempTrack = Object.values(track)
        this.startPiont = track
        this.isline = (typeof DrawStyle[this.currentType].isline == 'undefined') ? true : false;
        if (this.currentType != 'line' && this.isline) {
            this.drawPolygon({ data: Object.values(track), type: this.currentType, style: this.style, option: DrawStyle[this.currentType].option })
            this.update()
        }
    }
    /**
     * 绘画当前位置坐标
     * @param {point} track 
     */
    movePoint(track) {
        var x = this.startPiont.x, y = this.startPiont.y, x2 = track.x, y2 = track.y
        if (this.isline) {
            if (getDist(x, y, x2, y2) > (DrawStyle[this.currentType].follow || 0)) {
                // 移动绘制的跟随间隔距离
                this.tempTrack.push(...Object.values(track))
                this.drawPolygon({ data: [x, y, x2, y2], type: this.currentType, style: this.style, option: DrawStyle[this.currentType].option })
                this.startPiont = track
                this.update()
            }
        } else {
            this.drawHistory()
            this.tempTrack[2] = x2;
            this.tempTrack[3] = y2;
            this.drawPolygon({ data: [x, y, x2, y2], type: this.currentType, style: this.style, option: DrawStyle[this.currentType].option })
            this.update()
        }
    }
    /**
     * 结束当前绘画路径
     */
    trackOver() {
        // 保存路径数据
        this.trackData.push({
            action: "drawing",
            type: this.currentType,
            style: Object.assign({}, this.style),
            data: [...this.tempTrack],
            option: DrawStyle[this.currentType].option
        })
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
        var track = value.data, type = value.type || 'line', startX = track[0], startY = track[1], option = value.option || {}
        Object.assign(this.ctx, value.style)
        if (DrawStyle[type]) {
            try {
                for (var i = 2, lg = track.length; i < lg; i += 2) {
                    var endX = track[i], endY = track[i + 1]
                    DrawStyle[type].execute.call(this.ctx, startX, startY, endX, endY, option)
                    startX = endX, startY = endY
                }
            } catch (error) {
                console.warn(error);
            }
        }
    }
    // 清除路径
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
    /**
     * 设置画笔类型
     * @param {string} value 
     * @param {object} develop 
     * 切换画笔，同时也是临时扩展画笔
     */
    setType(value, develop) {
        this.currentType = value
        if (develop) Object.assign(DrawStyle, { [value]: develop })
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