var Fayde;
(function (Fayde) {
    /// CODE
    /// <reference path="Enums.ts" />
    /// <reference path="../Primitives/rect.ts" />
    /// <reference path="../Engine/RenderContext.ts" />
    (function (Shapes) {
        var RawPath = (function () {
            function RawPath() {
                this._Path = [];
                this._EndX = 0.0;
                this._EndY = 0.0;
            }
            Object.defineProperty(RawPath.prototype, "EndX", {
                get: function () {
                    return this._EndX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RawPath.prototype, "EndY", {
                get: function () {
                    return this._EndY;
                },
                enumerable: true,
                configurable: true
            });
            RawPath.prototype.Move = function (x, y) {
                this._Path.push({
                    type: Shapes.PathEntryType.Move,
                    x: x,
                    y: y
                });
                this._EndX = x;
                this._EndY = y;
            };
            RawPath.prototype.Line = function (x, y) {
                this._Path.push({
                    type: Shapes.PathEntryType.Line,
                    x: x,
                    y: y
                });
                this._EndX = x;
                this._EndY = y;
            };
            RawPath.prototype.Rect = function (x, y, width, height) {
                this._Path.push({
                    type: Shapes.PathEntryType.Rect,
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
            };
            RawPath.prototype.RoundedRectFull = function (left, top, width, height, topLeft, topRight, bottomRight, bottomLeft) {
                var right = left + width;
                var bottom = top + height;
                this.Move(left + topLeft, top);
                //top edge
                this.Line(right - topRight, top);
                //top right arc
                if(topRight > 0) {
                    this.Quadratic(right, top, right, top + topRight);
                }
                //right edge
                this.Line(right, bottom - bottomRight);
                //bottom right arc
                if(bottomRight > 0) {
                    this.Quadratic(right, bottom, right - bottomRight, bottom);
                }
                //bottom edge
                this.Line(left + bottomLeft, bottom);
                //bottom left arc
                if(bottomLeft > 0) {
                    this.Quadratic(left, bottom, left, bottom - bottomLeft);
                }
                //left edge
                this.Line(left, top + topLeft);
                //top left arc
                if(topLeft > 0) {
                    this.Quadratic(left, top, left + topLeft, top);
                }
                this.Close();
            };
            RawPath.prototype.RoundedRect = function (left, top, width, height, radiusX, radiusY) {
                if(radiusX === 0.0 && radiusY === 0.0) {
                    this.Rect(left, top, width, height);
                    return;
                }
                var right = left + width;
                var bottom = top + height;
                this.Move(left + radiusX, top);
                //top edge
                this.Line(right - radiusX, top);
                //top right arc
                this.Quadratic(right, top, right, top + radiusY);
                //right edge
                this.Line(right, bottom - radiusY);
                //bottom right arc
                this.Quadratic(right, bottom, right - radiusX, bottom);
                //bottom edge
                this.Line(left + radiusX, bottom);
                //bottom left arc
                this.Quadratic(left, bottom, left, bottom - radiusY);
                //left edge
                this.Line(left, top + radiusY);
                //top left arc
                this.Quadratic(left, top, left + radiusX, top);
                this.Close();
            };
            RawPath.prototype.Quadratic = function (cpx, cpy, x, y) {
                this._Path.push({
                    type: Shapes.PathEntryType.Quadratic,
                    cpx: cpx,
                    cpy: cpy,
                    x: x,
                    y: y
                });
                this._EndX = x;
                this._EndY = y;
            };
            RawPath.prototype.Bezier = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                this._Path.push({
                    type: Shapes.PathEntryType.Bezier,
                    cp1x: cp1x,
                    cp1y: cp1y,
                    cp2x: cp2x,
                    cp2y: cp2y,
                    x: x,
                    y: y
                });
                this._EndX = x;
                this._EndY = y;
            };
            RawPath.prototype.Ellipse = function (x, y, width, height) {
                var radiusX = width / 2;
                var radiusY = height / 2;
                var right = x + width;
                var bottom = y + height;
                var centerX = x + radiusX;
                var centerY = y + radiusY;
                if(width === height) {
                    //circle
                    this.Arc(centerX, centerY, radiusX, 0, Math.PI * 2, false);
                } else {
                    //oval
                    var kappa = 0.5522848;// 4 * ((sqrt(2) - 1) / 3)
                    
                    var ox = radiusX * kappa;
                    var oy = radiusY * kappa;
                    //move to left edge, halfway down
                    this.Move(x, centerY);
                    //top left bezier curve
                    this.Bezier(x, centerY - oy, centerX - ox, y, centerX, y);
                    //top right bezier curve
                    this.Bezier(centerX + ox, y, right, centerY - oy, right, centerY);
                    //bottom right bezier curve
                    this.Bezier(right, centerY + oy, centerX + ox, bottom, centerX, bottom);
                    //bottom left bezier curve
                    this.Bezier(centerX - ox, bottom, x, centerY + oy, x, centerY);
                    this.Close();
                }
            };
            RawPath.prototype.EllipticalArc = function (width, height, rotationAngle, isLargeArcFlag, sweepDirectionFlag, ex, ey) {
                this._Path.push({
                    type: Shapes.PathEntryType.EllipticalArc,
                    width: width,
                    height: height,
                    rotationAngle: rotationAngle,
                    isLargeArcFlag: isLargeArcFlag,
                    sweepDirectionFlag: sweepDirectionFlag,
                    ex: ex,
                    ey: ey
                });
            };
            RawPath.prototype.Arc = function (x, y, r, sAngle, eAngle, aClockwise) {
                this._Path.push({
                    type: Shapes.PathEntryType.Arc,
                    x: x,
                    y: y,
                    r: r,
                    sAngle: sAngle,
                    eAngle: eAngle,
                    aClockwise: aClockwise
                });
            };
            RawPath.prototype.ArcTo = function (cpx, cpy, x, y, radius) {
                this._Path.push({
                    type: Shapes.PathEntryType.ArcTo,
                    cpx: cpx,
                    cpy: cpy,
                    x: x,
                    y: y,
                    r: radius
                });
                this._EndX = x;
                this._EndY = y;
            };
            RawPath.prototype.Close = function () {
                this._Path.push({
                    type: Shapes.PathEntryType.Close
                });
            };
            RawPath.prototype.DrawRenderCtx = function (ctx) {
                this.DrawCanvasCtx(ctx.CanvasContext);
            };
            RawPath.prototype.DrawCanvasCtx = function (canvasCtx) {
                canvasCtx.beginPath();
                var backing = this._Path;
                for(var i = 0; i < backing.length; i++) {
                    var p = backing[i];
                    switch(p.type) {
                        case Shapes.PathEntryType.Move:
                            canvasCtx.moveTo(p.x, p.y);
                            //DrawDebug("\t\tMoveTo: [X = " + p.x + "; Y = " + p.y + "]");
                            break;
                        case Shapes.PathEntryType.Line:
                            canvasCtx.lineTo(p.x, p.y);
                            //DrawDebug("\t\tLineTo: [X = " + p.x + "; Y = " + p.y + "]");
                            break;
                        case Shapes.PathEntryType.Rect:
                            canvasCtx.rect(p.x, p.y, p.width, p.height);
                            //DrawDebug("\t\tRect: [X = " + p.x + "; Y = " + p.y + "; Width = " + p.width + "; Height = " + p.height + "]");
                            break;
                        case Shapes.PathEntryType.Quadratic:
                            canvasCtx.quadraticCurveTo(p.cpx, p.cpy, p.x, p.y);
                            //DrawDebug("\t\tQuadratic: [CPX = " + p.cpx + "; CPY = " + p.cpy + "; X = " + p.x + "; Y = " + p.y + "]");
                            break;
                        case Shapes.PathEntryType.Bezier:
                            canvasCtx.bezierCurveTo(p.cp1x, p.cp1y, p.cp2x, p.cp2y, p.x, p.y);
                            break;
                        case Shapes.PathEntryType.Arc:
                            canvasCtx.arc(p.x, p.y, p.r, p.sAngle, p.eAngle, p.aClockwise);
                            break;
                        case Shapes.PathEntryType.ArcTo:
                            canvasCtx.arcTo(p.cpx, p.cpy, p.x, p.y, p.r);
                            break;
                        case Shapes.PathEntryType.Close:
                            canvasCtx.closePath();
                            break;
                    }
                }
            };
            RawPath.prototype.CalculateBounds = function (thickness) {
                var backing = this._Path;
                var startX = null;
                var startY = null;
                var xMin = null;
                var xMax = null;
                var yMin = null;
                var yMax = null;
                var xRange = null;
                var yRange = null;
                for(var i = 0; i < backing.length; i++) {
                    var p = backing[i];
                    switch(p.type) {
                        case Shapes.PathEntryType.Move:
                            if(xMin == null && yMin == null) {
                                xMin = xMax = p.x;
                                yMin = yMax = p.y;
                            } else {
                                xMin = Math.min(p.x, xMin);
                                yMin = Math.min(p.y, yMin);
                                xMax = Math.max(p.x, xMax);
                                yMax = Math.max(p.y, yMax);
                            }
                            startX = p.x;
                            startY = p.y;
                            break;
                        case Shapes.PathEntryType.Line:
                            xMin = Math.min(p.x, xMin);
                            yMin = Math.min(p.y, yMin);
                            xMax = Math.max(p.x, xMax);
                            yMax = Math.max(p.y, yMax);
                            startX = p.x;
                            startY = p.y;
                            break;
                        case Shapes.PathEntryType.Rect:
                            //does not use current x,y
                            xMin = Math.min(p.x, xMin);
                            yMin = Math.min(p.y, yMin);
                            xMax = Math.max(p.x + p.width, xMax);
                            yMax = Math.max(p.y + p.height, yMax);
                            break;
                        case Shapes.PathEntryType.Quadratic:
                            xRange = RawPath._CalculateQuadraticBezierRange(startX, p.cpx, p.x);
                            xMin = Math.min(xMin, xRange.min);
                            xMax = Math.max(xMax, xRange.max);
                            yRange = RawPath._CalculateQuadraticBezierRange(startY, p.cpy, p.y);
                            yMin = Math.min(yMin, yRange.min);
                            yMax = Math.max(yMax, yRange.max);
                            startX = p.x;
                            startY = p.y;
                            break;
                        case Shapes.PathEntryType.Bezier:
                            xRange = RawPath._CalculateCubicBezierRange(startX, p.cp1x, p.cp2x, p.x);
                            xMin = Math.min(xMin, xRange.min);
                            xMax = Math.max(xMax, xRange.max);
                            yRange = RawPath._CalculateCubicBezierRange(startY, p.cp1y, p.cp2y, p.y);
                            yMin = Math.min(yMin, yRange.min);
                            yMax = Math.max(yMax, yRange.max);
                            startX = p.x;
                            startY = p.y;
                            break;
                        case Shapes.PathEntryType.Arc:
                            //does not use current x,y
                            if(p.sAngle !== p.eAngle) {
                                var r = RawPath._CalculateArcRange(p.x, p.y, p.r, p.sAngle, p.eAngle, p.aClockwise);
                                xMin = Math.min(xMin, r.xMin);
                                xMax = Math.max(xMax, r.xMax);
                                yMin = Math.min(yMin, r.yMin);
                                yMax = Math.max(yMax, r.yMax);
                            }
                            break;
                        case Shapes.PathEntryType.ArcTo:
                            var r = RawPath._CalculateArcToRange(startX, startY, p.cpx, p.cpy, p.x, p.y, p.r);
                            xMin = Math.min(xMin, r.xMin);
                            xMax = Math.max(xMax, r.xMax);
                            yMin = Math.min(yMin, r.yMin);
                            yMax = Math.max(yMax, r.yMax);
                            startX = p.x;
                            startY = p.y;
                            break;
                    }
                }
                var r2 = new rect();
                rect.set(r2, xMin, yMin, xMax - xMin, yMax - yMin);
                return r2;
            };
            RawPath._CalculateQuadraticBezierRange = //http://pomax.nihongoresources.com/pages/bezier/
            function _CalculateQuadraticBezierRange(a, b, c) {
                var min = Math.min(a, c);
                var max = Math.max(a, c);
                // if control point lies between start/end, the bezier curve is bound by the start/end
                if(min <= b && b <= max) {
                    return {
                        min: min,
                        max: max
                    };
                }
                // x(t) = a(1-t)^2 + 2*b(1-t)t + c*t^2
                // find "change of direction" point (dx/dt = 0)
                var t = (a - b) / (a - 2 * b + c);
                var xt = (a * Math.pow(1 - t, 2)) + (2 * b * (1 - t) * t) + (c * Math.pow(t, 2));
                if(min > b) {
                    //control point is expanding the bounding box to the left
                    min = Math.min(min, xt);
                } else {
                    //control point is expanding the bounding box to the right
                    max = Math.max(max, xt);
                }
                return {
                    min: min,
                    max: max
                };
            };
            RawPath._CalculateCubicBezierRange = //http://pomax.nihongoresources.com/pages/bezier/
            function _CalculateCubicBezierRange(a, b, c, d) {
                var min = Math.min(a, d);
                var max = Math.max(a, d);
                // if control points lie between start/end, the bezier curve is bound by the start/end
                if((min <= b && b <= max) && (min <= c && c <= max)) {
                    return {
                        min: min,
                        max: max
                    };
                }
                // find "change of direction" points (dx/dt = 0)
                //xt = a(1-t)^3 + 3b(t)(1-t)^2 + 3c(1-t)(t)^2 + dt^3
                var u = 2 * a - 4 * b + 2 * c;
                var v = b - a;
                var w = -a + 3 * b + d - 3 * c;
                var rt = Math.sqrt(u * u - 4 * v * w);
                if(!isNaN(rt)) {
                    var t;
                    t = (-u + rt) / (2 * w);
                    //f(t) is only defined in [0,1]
                    if(t >= 0 && t <= 1) {
                        var ot = 1 - t;
                        var xt = (a * ot * ot * ot) + (3 * b * t * ot * ot) + (3 * c * ot * t * t) + (d * t * t * t);
                        min = Math.min(min, xt);
                        max = Math.max(max, xt);
                    }
                    t = (-u - rt) / (2 * w);
                    //f(t) is only defined in [0,1]
                    if(t >= 0 && t <= 1) {
                        var ot = 1 - t;
                        var xt = (a * ot * ot * ot) + (3 * b * t * ot * ot) + (3 * c * ot * t * t) + (d * t * t * t);
                        min = Math.min(min, xt);
                        max = Math.max(max, xt);
                    }
                }
                return {
                    min: min,
                    max: max
                };
            };
            RawPath._CalculateArcRange = function _CalculateArcRange(cx, cy, r, sa, ea, cc) {
                //start point
                var sx = cx + (r * Math.cos(sa));
                var sy = cy + (r * Math.sin(sa));
                //end point
                var ex = cx + (r * Math.cos(ea));
                var ey = cy + (r * Math.sin(ea));
                return RawPath._CalculateArcPointsRange(cx, cy, sx, sy, ex, ey, r, cc);
            };
            RawPath._CalculateArcToRange = function _CalculateArcToRange(sx, sy, cpx, cpy, ex, ey, r) {
                NotImplemented("RawPath._CalculateArcToRange");
                return {
                    xMin: sx,
                    xMax: sx,
                    yMin: sy,
                    yMax: sy
                };
                var v1x = cpx - sx;
                var v1y = cpy - sy;
                var v2x = ex - cpx;
                var v2y = ey - cpy;
                var theta_outer1 = Math.atan2(Math.abs(v1y), Math.abs(v1x));
                var theta_outer2 = Math.atan2(Math.abs(v2y), Math.abs(v2x));
                var inner_theta = Math.PI - theta_outer1 - theta_outer2;
                //distance to center of imaginary circle
                var h = r / Math.sin(inner_theta / 2);
                //cx, cy -> center of imaginary circle
                var cx = cpx + h * Math.cos(inner_theta / 2 + theta_outer2);
                var cy = cpy + h * Math.sin(inner_theta / 2 + theta_outer2);
                //distance from cp -> tangent points on imaginary circle
                var a = r / Math.tan(inner_theta / 2);
                //tangent point at start of arc
                var sx = cpx + a * Math.cos(theta_outer2 + inner_theta);
                var sy = cpy + a * Math.sin(theta_outer2 + inner_theta);
                //tangent point at end of arc
                var ex = cpx + a * Math.cos(theta_outer2);
                var ey = cpy + a * Math.sin(theta_outer2);
                var cc = true;
                var r = RawPath._CalculateArcPointsRange(cx, cy, sx, sy, ex, ey, r, cc);
                return {
                    xMin: Math.min(sx, r.xMin),
                    xMax: Math.max(sx, r.xMax),
                    yMin: Math.min(sy, r.yMin),
                    yMax: Math.max(sy, r.yMax)
                };
            };
            RawPath._CalculateArcPointsRange = function _CalculateArcPointsRange(cx, cy, sx, sy, ex, ey, r, cc) {
                var xMin = Math.min(sx, ex);
                var xMax = Math.max(sx, ex);
                var yMin = Math.min(sy, ey);
                var yMax = Math.max(sy, ey);
                var xLeft = cx - r;
                if(RawPath._ArcContainsPoint(sx, sy, ex, ey, xLeft, cy, cc)) {
                    //arc contains left edge of circle
                    xMin = Math.min(xMin, xLeft);
                }
                var xRight = cx + r;
                if(RawPath._ArcContainsPoint(sx, sy, ex, ey, xRight, cy, cc)) {
                    //arc contains right edge of circle
                    xMax = Math.max(xMax, xRight);
                }
                var yTop = cy - r;
                if(RawPath._ArcContainsPoint(sx, sy, ex, ey, cx, yTop, cc)) {
                    //arc contains top edge of circle
                    yMin = Math.min(yMin, yTop);
                }
                var yBottom = cy + r;
                if(RawPath._ArcContainsPoint(sx, sy, ex, ey, cx, yBottom, cc)) {
                    //arc contains bottom edge of circle
                    yMax = Math.max(yMax, yBottom);
                }
                return {
                    xMin: xMin,
                    xMax: xMax,
                    yMin: yMin,
                    yMax: yMax
                };
            };
            RawPath._ArcContainsPoint = function _ArcContainsPoint(sx, sy, ex, ey, cpx, cpy, cc) {
                // var a = ex - sx;
                // var b = cpx - sx;
                // var c = ey - sy;
                // var d = cpy - sy;
                // det = ad - bc;
                var n = (ex - sx) * (cpy - sy) - (cpx - sx) * (ey - sy);
                if(n === 0) {
                    return true;
                }
                // if det > 0 && counterclockwise arc --> point is on the arc
                if(n > 0 && cc) {
                    return true;
                }
                // if det < 0 && clockwise arc --> point is on the arc
                if(n < 0 && !cc) {
                    return true;
                }
                return false;
            };
            RawPath.Merge = function Merge(path1, path2) {
                path1._Path = path1._Path.concat(path2._Path);
                path1._EndX += path2._EndX;
                path1._EndY += path2._EndY;
            };
            RawPath.prototype.Serialize = function () {
                var s = "";
                var len = this._Path.length;
                var backing = this._Path;
                for(var i = 0; i < len; i++) {
                    if(i > 0) {
                        s += " ";
                    }
                    var p = backing[i];
                    switch(p.type) {
                        case Shapes.PathEntryType.Move:
                            s += "M" + p.x.toString() + " " + p.y.toString();
                            break;
                        case Shapes.PathEntryType.Line:
                            s += "L" + p.x.toString() + " " + p.y.toString();
                            break;
                        case Shapes.PathEntryType.Rect:
                            break;
                        case Shapes.PathEntryType.Quadratic:
                            s += "Q" + p.cpx.toString() + " " + p.cpy.toString() + ", " + p.x.toString() + " " + p.y.toString();
                            break;
                        case Shapes.PathEntryType.Bezier:
                            s += "C" + p.cp1x.toString() + " " + p.cp1y.toString() + ", " + p.cp2x.toString() + " " + p.cp2y.toString() + ", " + p.x.toString() + " " + p.y.toString();
                            break;
                        case Shapes.PathEntryType.EllipticalArc:
                            s += "A" + p.width.toString() + " " + p.height.toString() + " " + p.rotationAngle.toString() + " " + p.isLargeArcFlag.toString() + " " + p.sweepDirectionFlag.toString() + " " + p.ex.toString() + " " + p.ey.toString();
                            break;
                        case Shapes.PathEntryType.ArcTo:
                            break;
                        case Shapes.PathEntryType.Close:
                            s += "Z";
                            break;
                    }
                }
                return s;
            };
            return RawPath;
        })();
        Shapes.RawPath = RawPath;        
    })(Fayde.Shapes || (Fayde.Shapes = {}));
    var Shapes = Fayde.Shapes;
})(Fayde || (Fayde = {}));
//@ sourceMappingURL=RawPath.js.map
