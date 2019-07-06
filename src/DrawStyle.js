export default {
    line: {
        follow:0,
        option: {},
        execute(startX, startY, endX, endY) {
            this.beginPath();
            this.moveTo(startX, startY);
            this.lineTo(endX, endY)
            this.stroke()
        }
    },
    circle: {
        follow:0,
        option: { size: 2 },
        execute(startX, startY, endX, endY, size) {
            this.beginPath();
            this.arc(startX, startY, size, 0, 2 * Math.PI)
            this.fill()
        }
    },
    circle2: {
        follow:0,
        option: { size: 2, follow: 2 },
        execute(startX, startY, endX, endY, { size = 2, follow = 2 }) {

            var radian = Math.atan2(endY - startY, endX - startX);
            var place = 0
            var dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
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
}