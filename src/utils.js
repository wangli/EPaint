export function getDist(x, y, x2, y2) {
    var w = x2 - x, h = y2 - y;
    return Math.sqrt(w * w + h * h)
}