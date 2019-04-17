export default {
    line({ startX, startY, endX, endY }) {
        this.beginPath();
        this.moveTo(startX, startY);
        this.lineTo(endX, endY)
        this.stroke()
    },
    circle({ x, y, size }) {
        this.beginPath();
        this.arc(x, y, size, 0, 2 * Math.PI)
        this.fill()
    },
    circle2({ startX, startY, endX, endY, size = 2}) {


        var radian = Math.atan2(endY - startY, endX - startX);
        var place = 0
        while (dist > 2) {
            var end2X = startX + place * Math.cos(radian);
            var end2Y = startY + place * Math.sin(radian);
            var w = end2X - endX
            var h = end2Y - endY
            dist = Math.sqrt(w * w + h * h)
            this.beginPath();
            this.arc(end2X, end2Y, size, 0, 2 * Math.PI)
            this.fill()
            place += follow
        }
    }
}