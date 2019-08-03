export default {
    line: {
        follow: 0,
        option: {},
        execute(startX, startY, endX, endY) {
            this.beginPath();
            this.moveTo(startX, startY);
            this.lineTo(endX, endY)
            this.stroke()
        }
    },
    rect: {
        isline: false,
        option: {},
        execute(startX, startY, endX, endY) {
            this.beginPath();
            this.rect(startX, startY, endX - startX, endY - startY);
            this.stroke();
        }
    },
    trian: {
        isline: false,
        option: { size: 3 },
        execute(startX, startY, endX, endY) {
            var width = endX - startX;
            var height = endY - startY;
            this.beginPath();
            this.moveTo(startX, startY);
            this.lineTo(startX - width, startY + height);
            this.lineTo(endX, endY);
            this.closePath();
            this.stroke();
        }
    },
    circleline: {
        follow: 10,
        option: { size: 3 },
        execute(startX, startY, endX, endY, { size }) {
            this.beginPath();
            this.arc(startX, startY, size, 0, 2 * Math.PI)
            this.fill()
        }
    },
    circle: {
        isline: false,
        option: { size: 3 },
        execute(startX, startY, endX, endY) {
            var size = Math.abs(endX - startX)
            this.beginPath();
            this.arc(startX, startY, size, 0, 2 * Math.PI)
            this.closePath();
            this.stroke()
        }
    },
    ellipse: {
        isline: false,
        option: { size: 3 },
        execute(startX, startY, endX, endY) {
            var w = endX - startX, h = endY - startY, x = startX, y = startY;
            var k = 0.5522848;
            var ox = (w / 2) * k,
                oy = (h / 2) * k,
                xe = x + w, 
                ye = y + h, 
                xm = x + w / 2, 
                ym = y + h / 2; 
            this.beginPath();
            this.moveTo(x, ym);
            this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            this.closePath();
            this.stroke();


            // var width = endX - startX, height = endY - startY;
            // var k = (width / 0.75) / 2, w = width / 2, h = height / 2;
            // this.beginPath();
            // this.moveTo(startX, startY - h);
            // this.bezierCurveTo(startX + k, startY - h, startX + k, startY + h, startX, startY + h);
            // this.bezierCurveTo(startX - k, startY + h, startX - k, startY - h, startX, startY - h);
            // this.closePath();
            // this.stroke();


        }
    },
    circle2: {
        follow: 16,
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