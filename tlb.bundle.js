/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 51);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
const FRAC = 2.3283064365386963e-10; /* 2^-32 */
class RNG {
    constructor() {
        this._seed = 0;
        this._s0 = 0;
        this._s1 = 0;
        this._s2 = 0;
        this._c = 0;
    }
    getSeed() { return this._seed; }
    /**
     * Seed the number generator
     */
    setSeed(seed) {
        seed = (seed < 1 ? 1 / seed : seed);
        this._seed = seed;
        this._s0 = (seed >>> 0) * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s1 = seed * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s2 = seed * FRAC;
        this._c = 1;
        return this;
    }
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    getUniform() {
        let t = 2091639 * this._s0 + this._c * FRAC;
        this._s0 = this._s1;
        this._s1 = this._s2;
        this._c = t | 0;
        this._s2 = t - this._c;
        return this._s2;
    }
    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    getUniformInt(lowerBound, upperBound) {
        let max = Math.max(lowerBound, upperBound);
        let min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
    }
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */
    getNormal(mean = 0, stddev = 1) {
        let u, v, r;
        do {
            u = 2 * this.getUniform() - 1;
            v = 2 * this.getUniform() - 1;
            r = u * u + v * v;
        } while (r > 1 || r == 0);
        let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
        return mean + gauss * stddev;
    }
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    getPercentage() {
        return 1 + Math.floor(this.getUniform() * 100);
    }
    /**
     * @returns Randomly picked item, null when length=0
     */
    getItem(array) {
        if (!array.length) {
            return null;
        }
        return array[Math.floor(this.getUniform() * array.length)];
    }
    /**
     * @returns New array with randomized items
     */
    shuffle(array) {
        let result = [];
        let clone = array.slice();
        while (clone.length) {
            let index = clone.indexOf(this.getItem(clone));
            result.push(clone.splice(index, 1)[0]);
        }
        return result;
    }
    /**
     * @param data key=whatever, value=weight (relative probability)
     * @returns whatever
     */
    getWeightedValue(data) {
        let total = 0;
        for (let id in data) {
            total += data[id];
        }
        let random = this.getUniform() * total;
        let id, part = 0;
        for (id in data) {
            part += data[id];
            if (random < part) {
                return id;
            }
        }
        // If by some floating-point annoyance we have
        // random >= total, just return the last id.
        return id;
    }
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */
    getState() { return [this._s0, this._s1, this._s2, this._c]; }
    /**
     * Set a previously retrieved state.
     */
    setState(state) {
        this._s0 = state[0];
        this._s1 = state[1];
        this._s2 = state[2];
        this._c = state[3];
        return this;
    }
    /**
     * Returns a cloned RNG
     */
    clone() {
        let clone = new RNG();
        return clone.setState(this.getState());
    }
}
/* harmony default export */ __webpack_exports__["a"] = (new RNG().setSeed(Date.now()));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(__webpack_require__(58));

__export(__webpack_require__(59));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const color_1 = __webpack_require__(34);

exports.primary = [color_1.Color.fromHex('#FD971F'), color_1.Color.fromHex('#A6E22E'), color_1.Color.fromHex('#66D9EF'), color_1.Color.fromHex('#F92672'), color_1.Color.fromHex('#272822')];
exports.gray = [color_1.Color.fromHex('#E6E6E6'), color_1.Color.fromHex('#6f7261'), color_1.Color.fromHex('#46483d'), color_1.Color.fromHex('#272822'), color_1.Color.fromHex('#080807')];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const shape_1 = __webpack_require__(14);

const spatial_1 = __webpack_require__(1);

class Rectangle extends shape_1.AbstractShape {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static fromBounds(left, right, top, bottom) {
    return new Rectangle(left, top, right - left + 1, bottom - top + 1);
  }

  static footprint(position, direction, size) {
    const up = spatial_1.Vector.fromDirection(direction).abs();
    const right = spatial_1.Vector.fromDirection(direction).perpendicular().abs();
    const cx = Math.floor(size.x / 2);
    const cy = Math.floor(size.y / 2);
    const topLeft = position.add(right.mult(-cx)).add(up.mult(-cy));
    const bottomRight = topLeft.add(right.mult(size.x - 1)).add(up.mult(size.y - 1));
    return Rectangle.fromBounds(topLeft.x, bottomRight.x, topLeft.y, bottomRight.y);
  }

  static centerAt(x, y, size) {
    return new Rectangle(x - size, y - size, 2 * size + 1, 2 * size + 1);
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width - 1;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height - 1;
  }

  get topLeft() {
    return new spatial_1.Vector([this.left, this.top]);
  }

  get topRight() {
    return new spatial_1.Vector([this.right, this.top]);
  }

  get bottomRight() {
    return new spatial_1.Vector([this.right, this.bottom]);
  }

  get bottomLeft() {
    return new spatial_1.Vector([this.left, this.bottom]);
  }

  get center() {
    const cx = (this.left + this.right) / 2;
    const cy = (this.top + this.bottom) / 2;
    return new spatial_1.Vector([Math.floor(cx), Math.floor(cy)]);
  }

  centerOf(direction) {
    switch (direction) {
      case 'up':
        return this.centerTop;

      case 'right':
        return this.centerRight;

      case 'down':
        return this.centerBottom;

      case 'left':
        return this.centerLeft;
    }
  }

  get centerLeft() {
    const cy = (this.top + this.bottom) / 2;
    return new spatial_1.Vector([this.left, Math.floor(cy)]);
  }

  get centerRight() {
    const cy = (this.top + this.bottom) / 2;
    return new spatial_1.Vector([this.right, Math.floor(cy)]);
  }

  get centerTop() {
    const cx = (this.left + this.right) / 2;
    return new spatial_1.Vector([Math.floor(cx), this.top]);
  }

  get centerBottom() {
    const cx = (this.left + this.right) / 2;
    return new spatial_1.Vector([Math.floor(cx), this.bottom]);
  }

  plus(other) {
    return Rectangle.fromBounds(Math.min(this.left, other.left), Math.max(this.right, other.right), Math.min(this.top, other.top), Math.max(this.bottom, other.bottom));
  }

  intersect(other) {
    return Rectangle.fromBounds(Math.max(this.left, other.left), Math.min(this.right, other.right), Math.max(this.top, other.top), Math.min(this.bottom, other.bottom));
  }

  cover(other) {
    return Rectangle.fromBounds(Math.min(this.left, other.x), Math.max(this.right, other.x), Math.min(this.top, other.y), Math.max(this.bottom, other.y));
  }

  getWall(other) {
    if (this.containsVector(other)) {
      if (other.x === this.left) {
        return 'left';
      }

      if (other.x === this.right) {
        return 'right';
      }

      if (other.y === this.top) {
        return 'up';
      }

      if (other.y === this.bottom) {
        return 'down';
      }
    }

    return undefined;
  }

  bounds() {
    return this;
  }

  containsVector(p) {
    return p.x >= this.x && p.x < this.x + this.width && p.y >= this.y && p.y < this.y + this.height;
  }

  translate(t) {
    return new Rectangle(this.x + t.x, this.y + t.y, this.width, this.height);
  }

  grow(cells = 1) {
    return new Rectangle(this.x - cells, this.y - cells, this.width + 2 * cells, this.height + 2 * cells);
  }

  shrink(cells = 1) {
    const w = this.width - 2 * cells;
    const h = this.height - 2 * cells;
    return new Rectangle(w > 0 ? this.x + cells : this.x, h > 0 ? this.y + cells : this.y, w > 0 ? w : 0, h > 0 ? h : 0);
  }

  all(f) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const position = new spatial_1.Vector([j + this.x, i + this.y]);

        if (!f(position)) {
          return false;
        }
      }
    }

    return true;
  }

}

exports.Rectangle = Rectangle;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mod", function() { return mod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clamp", function() { return clamp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "format", function() { return format; });
/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
function mod(x, n) {
    return (x % n + n) % n;
}
function clamp(val, min = 0, max = 1) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}
/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
function format(template, ...args) {
    let map = format.map;
    let replacer = function (match, group1, group2, index) {
        if (template.charAt(index - 1) == "%") {
            return match.substring(1);
        }
        if (!args.length) {
            return match;
        }
        let obj = args[0];
        let group = group1 || group2;
        let parts = group.split(",");
        let name = parts.shift() || "";
        let method = map[name.toLowerCase()];
        if (!method) {
            return match;
        }
        obj = args.shift();
        let replaced = obj[method].apply(obj, parts);
        let first = name.charAt(0);
        if (first != first.toLowerCase()) {
            replaced = capitalize(replaced);
        }
        return replaced;
    };
    return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}
format.map = {
    "s": "toString"
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const array_utils_1 = __webpack_require__(7);

class Random {
  constructor(distribution) {
    this.distribution = distribution;
  }

  floatBetween(minInclusive, maxExclusive) {
    return this.distribution.sample() * (maxExclusive - minInclusive) + minInclusive;
  }

  integerBetween(minInclusive, maxInclusive) {
    const c = this.distribution.sample();
    return Math.floor(c * (maxInclusive - minInclusive + 1)) + minInclusive;
  }

  decision(probability) {
    return this.distribution.sample() < probability;
  }

  weightedDecision(weights) {
    const sum = weights.reduce((v, c) => v + c, 0);
    const pick = this.integerBetween(0, sum - 1);
    let agg = 0;

    for (let i = 0; i < weights.length; i++) {
      agg += weights[i];

      if (pick < agg) {
        return i;
      }
    }

    throw new Error('invalid input to weighted decision');
  }

  pickN(array, n = 1) {
    const a = [...array];
    const l = a.length;

    for (let i = l - 1; i >= l - n; --i) {
      array_utils_1.swap(a, i, this.integerBetween(0, i - 1));
    }

    return a.slice(l - n, l);
  }

  pick(array) {
    return array[this.integerBetween(0, array.length - 1)];
  }

  pickIndex(array) {
    return this.integerBetween(0, array.length - 1);
  }

  shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = this.integerBetween(0, i);
      const t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
  }

  insideRectangle(rectangle) {
    return new spatial_1.Vector([this.integerBetween(rectangle.left, rectangle.right), this.integerBetween(rectangle.top, rectangle.bottom)]);
  }

  betweenVectors(a, b) {
    return new spatial_1.Vector([this.integerBetween(a.x, b.x), this.integerBetween(a.y, b.y)]);
  }

}

exports.Random = Random;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromString", function() { return fromString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_", function() { return add_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply", function() { return multiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply_", function() { return multiply_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolate", function() { return interpolate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerp", function() { return lerp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolateHSL", function() { return interpolateHSL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerpHSL", function() { return lerpHSL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomize", function() { return randomize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgb2hsl", function() { return rgb2hsl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hsl2rgb", function() { return hsl2rgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRGB", function() { return toRGB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHex", function() { return toHex; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


function fromString(str) {
    let cached, r;
    if (str in CACHE) {
        cached = CACHE[str];
    }
    else {
        if (str.charAt(0) == "#") { // hex rgb
            let matched = str.match(/[0-9a-f]/gi) || [];
            let values = matched.map((x) => parseInt(x, 16));
            if (values.length == 3) {
                cached = values.map((x) => x * 17);
            }
            else {
                for (let i = 0; i < 3; i++) {
                    values[i + 1] += 16 * values[i];
                    values.splice(i, 1);
                }
                cached = values;
            }
        }
        else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { // decimal rgb
            cached = r[1].split(/\s*,\s*/).map((x) => parseInt(x));
        }
        else { // html name
            cached = [0, 0, 0];
        }
        CACHE[str] = cached;
    }
    return cached.slice();
}
/**
 * Add two or more colors
 */
function add(color1, ...colors) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            result[i] += colors[j][i];
        }
    }
    return result;
}
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 */
function add_(color1, ...colors) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            color1[i] += colors[j][i];
        }
    }
    return color1;
}
/**
 * Multiply (mix) two or more colors
 */
function multiply(color1, ...colors) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            result[i] *= colors[j][i] / 255;
        }
        result[i] = Math.round(result[i]);
    }
    return result;
}
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 */
function multiply_(color1, ...colors) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            color1[i] *= colors[j][i] / 255;
        }
        color1[i] = Math.round(color1[i]);
    }
    return color1;
}
/**
 * Interpolate (blend) two colors with a given factor
 */
function interpolate(color1, color2, factor = 0.5) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
}
const lerp = interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 */
function interpolateHSL(color1, color2, factor = 0.5) {
    let hsl1 = rgb2hsl(color1);
    let hsl2 = rgb2hsl(color2);
    for (let i = 0; i < 3; i++) {
        hsl1[i] += factor * (hsl2[i] - hsl1[i]);
    }
    return hsl2rgb(hsl1);
}
const lerpHSL = interpolateHSL;
/**
 * Create a new random color based on this one
 * @param color
 * @param diff Set of standard deviations
 */
function randomize(color, diff) {
    if (!(diff instanceof Array)) {
        diff = Math.round(_rng_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getNormal(0, diff));
    }
    let result = color.slice();
    for (let i = 0; i < 3; i++) {
        result[i] += (diff instanceof Array ? Math.round(_rng_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getNormal(0, diff[i])) : diff);
    }
    return result;
}
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 */
function rgb2hsl(color) {
    let r = color[0] / 255;
    let g = color[1] / 255;
    let b = color[2] / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max == min) {
        s = 0; // achromatic
    }
    else {
        let d = max - min;
        s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hue2rgb(p, q, t) {
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1 / 6)
        return p + (q - p) * 6 * t;
    if (t < 1 / 2)
        return q;
    if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 */
function hsl2rgb(color) {
    let l = color[2];
    if (color[1] == 0) {
        l = Math.round(l * 255);
        return [l, l, l];
    }
    else {
        let s = color[1];
        let q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        let p = 2 * l - q;
        let r = hue2rgb(p, q, color[0] + 1 / 3);
        let g = hue2rgb(p, q, color[0]);
        let b = hue2rgb(p, q, color[0] - 1 / 3);
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}
function toRGB(color) {
    let clamped = color.map(x => Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["clamp"])(x, 0, 255));
    return `rgb(${clamped.join(",")})`;
}
function toHex(color) {
    let clamped = color.map(x => Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["clamp"])(x, 0, 255).toString(16).padStart(2, "0"));
    return `#${clamped.join("")}`;
}
const CACHE = {
    "black": [0, 0, 0],
    "navy": [0, 0, 128],
    "darkblue": [0, 0, 139],
    "mediumblue": [0, 0, 205],
    "blue": [0, 0, 255],
    "darkgreen": [0, 100, 0],
    "green": [0, 128, 0],
    "teal": [0, 128, 128],
    "darkcyan": [0, 139, 139],
    "deepskyblue": [0, 191, 255],
    "darkturquoise": [0, 206, 209],
    "mediumspringgreen": [0, 250, 154],
    "lime": [0, 255, 0],
    "springgreen": [0, 255, 127],
    "aqua": [0, 255, 255],
    "cyan": [0, 255, 255],
    "midnightblue": [25, 25, 112],
    "dodgerblue": [30, 144, 255],
    "forestgreen": [34, 139, 34],
    "seagreen": [46, 139, 87],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "limegreen": [50, 205, 50],
    "mediumseagreen": [60, 179, 113],
    "turquoise": [64, 224, 208],
    "royalblue": [65, 105, 225],
    "steelblue": [70, 130, 180],
    "darkslateblue": [72, 61, 139],
    "mediumturquoise": [72, 209, 204],
    "indigo": [75, 0, 130],
    "darkolivegreen": [85, 107, 47],
    "cadetblue": [95, 158, 160],
    "cornflowerblue": [100, 149, 237],
    "mediumaquamarine": [102, 205, 170],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "slateblue": [106, 90, 205],
    "olivedrab": [107, 142, 35],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "mediumslateblue": [123, 104, 238],
    "lawngreen": [124, 252, 0],
    "chartreuse": [127, 255, 0],
    "aquamarine": [127, 255, 212],
    "maroon": [128, 0, 0],
    "purple": [128, 0, 128],
    "olive": [128, 128, 0],
    "gray": [128, 128, 128],
    "grey": [128, 128, 128],
    "skyblue": [135, 206, 235],
    "lightskyblue": [135, 206, 250],
    "blueviolet": [138, 43, 226],
    "darkred": [139, 0, 0],
    "darkmagenta": [139, 0, 139],
    "saddlebrown": [139, 69, 19],
    "darkseagreen": [143, 188, 143],
    "lightgreen": [144, 238, 144],
    "mediumpurple": [147, 112, 216],
    "darkviolet": [148, 0, 211],
    "palegreen": [152, 251, 152],
    "darkorchid": [153, 50, 204],
    "yellowgreen": [154, 205, 50],
    "sienna": [160, 82, 45],
    "brown": [165, 42, 42],
    "darkgray": [169, 169, 169],
    "darkgrey": [169, 169, 169],
    "lightblue": [173, 216, 230],
    "greenyellow": [173, 255, 47],
    "paleturquoise": [175, 238, 238],
    "lightsteelblue": [176, 196, 222],
    "powderblue": [176, 224, 230],
    "firebrick": [178, 34, 34],
    "darkgoldenrod": [184, 134, 11],
    "mediumorchid": [186, 85, 211],
    "rosybrown": [188, 143, 143],
    "darkkhaki": [189, 183, 107],
    "silver": [192, 192, 192],
    "mediumvioletred": [199, 21, 133],
    "indianred": [205, 92, 92],
    "peru": [205, 133, 63],
    "chocolate": [210, 105, 30],
    "tan": [210, 180, 140],
    "lightgray": [211, 211, 211],
    "lightgrey": [211, 211, 211],
    "palevioletred": [216, 112, 147],
    "thistle": [216, 191, 216],
    "orchid": [218, 112, 214],
    "goldenrod": [218, 165, 32],
    "crimson": [220, 20, 60],
    "gainsboro": [220, 220, 220],
    "plum": [221, 160, 221],
    "burlywood": [222, 184, 135],
    "lightcyan": [224, 255, 255],
    "lavender": [230, 230, 250],
    "darksalmon": [233, 150, 122],
    "violet": [238, 130, 238],
    "palegoldenrod": [238, 232, 170],
    "lightcoral": [240, 128, 128],
    "khaki": [240, 230, 140],
    "aliceblue": [240, 248, 255],
    "honeydew": [240, 255, 240],
    "azure": [240, 255, 255],
    "sandybrown": [244, 164, 96],
    "wheat": [245, 222, 179],
    "beige": [245, 245, 220],
    "whitesmoke": [245, 245, 245],
    "mintcream": [245, 255, 250],
    "ghostwhite": [248, 248, 255],
    "salmon": [250, 128, 114],
    "antiquewhite": [250, 235, 215],
    "linen": [250, 240, 230],
    "lightgoldenrodyellow": [250, 250, 210],
    "oldlace": [253, 245, 230],
    "red": [255, 0, 0],
    "fuchsia": [255, 0, 255],
    "magenta": [255, 0, 255],
    "deeppink": [255, 20, 147],
    "orangered": [255, 69, 0],
    "tomato": [255, 99, 71],
    "hotpink": [255, 105, 180],
    "coral": [255, 127, 80],
    "darkorange": [255, 140, 0],
    "lightsalmon": [255, 160, 122],
    "orange": [255, 165, 0],
    "lightpink": [255, 182, 193],
    "pink": [255, 192, 203],
    "gold": [255, 215, 0],
    "peachpuff": [255, 218, 185],
    "navajowhite": [255, 222, 173],
    "moccasin": [255, 228, 181],
    "bisque": [255, 228, 196],
    "mistyrose": [255, 228, 225],
    "blanchedalmond": [255, 235, 205],
    "papayawhip": [255, 239, 213],
    "lavenderblush": [255, 240, 245],
    "seashell": [255, 245, 238],
    "cornsilk": [255, 248, 220],
    "lemonchiffon": [255, 250, 205],
    "floralwhite": [255, 250, 240],
    "snow": [255, 250, 250],
    "yellow": [255, 255, 0],
    "lightyellow": [255, 255, 224],
    "ivory": [255, 255, 240],
    "white": [255, 255, 255]
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function indices(to) {
  const indices = [];

  for (let i = 0; i < to; i++) {
    indices.push(i);
  }

  return indices;
}

exports.indices = indices;

function dropAt(arr, index) {
  arr[index] = tail(arr);
  arr.pop();
}

exports.dropAt = dropAt;

function swap(arr, i0, i1) {
  const tmp = arr[i0];
  arr[i0] = arr[i1];
  arr[i1] = tmp;
}

exports.swap = swap;

function tail(arr) {
  return arr[arr.length - 1];
}

exports.tail = tail;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const character_stats_1 = __webpack_require__(23);

const features_1 = __webpack_require__(15);

const items_1 = __webpack_require__(37);

const dialogs_1 = __webpack_require__(26);

const set_space_1 = __webpack_require__(27);

const array_utils_1 = __webpack_require__(7);

const instantiate_item_1 = __webpack_require__(17);

function humanoidBodyParts() {
  return {
    head: {
      type: 'head',
      itemAttachments: ['helmet']
    },
    leftArm: {
      type: 'arm',
      itemAttachments: ['glove', 'weapon']
    },
    rightArm: {
      type: 'arm',
      itemAttachments: ['glove', 'weapon']
    },
    torso: {
      type: 'torso',
      itemAttachments: ['armor']
    },
    leftLeg: {
      type: 'leg',
      itemAttachments: ['pants', 'boots']
    },
    rightLeg: {
      type: 'leg',
      itemAttachments: ['pants', 'boots']
    }
  };
}

const charactersStatsDefinition = {
  player: {
    bodyParts: humanoidBodyParts(),
    health: 20,
    strength: 5,
    aim: 8
  },
  guard: {
    bodyParts: humanoidBodyParts(),
    health: 5,
    strength: 5,
    aim: 6
  },
  civilian: {
    bodyParts: humanoidBodyParts(),
    health: 5,
    strength: 4,
    aim: 3
  },
  eliteGuard: {
    bodyParts: humanoidBodyParts(),
    health: 11,
    strength: 8,
    aim: 6
  },
  boss: {
    bodyParts: humanoidBodyParts(),
    health: 18,
    strength: 10,
    aim: 8
  }
};
exports.characterStats = charactersStatsDefinition;
const characterCreatorsDefinition = {
  boss: (world, random, region) => createBoss(world, random, region),
  player: (world, random, region, options) => createPlayer(world, random, options.type || 'yellow_player', region),
  eliteGuard: (world, random, region) => createGuard(world, random, 'some elite guard', 'eliteGuard', 'eliteGuard', region),
  guard: (world, random, region) => createGuard(world, random, 'some guard', 'guard', 'guard', region),
  civilian: (world, random) => createCivilian(world, random, 'some guy', 'civilian', 'civilian')
};

function createBoss(world, random, region) {
  const boss = createEmptyNpc(world, 'overseer', 'boss', 'eliteGuard');
  dialogs_1.addDialog(world, boss, 'guardRandomRemarks');
  const rifle = items_1.createEntityWithItemComponent(world, 'rifle', random, region);
  const nailGun = items_1.createEntityWithItemComponent(world, 'nailGun', random, region);
  const leatherJacket = items_1.createEntityWithItemComponent(world, 'leatherJacket', random, region);
  take(world, boss, rifle);
  take(world, boss, nailGun);
  take(world, boss, leatherJacket);
  equip(world, boss, nailGun, ['leftArm']);
  equip(world, boss, leatherJacket, ['torso', 'leftArm', 'rightArm']);
  return boss;
}

exports.createBoss = createBoss;

function createPlayer(world, random, type, region) {
  const player = createCharacter(world, 'player', type);
  const width = world.getResource('map').width;
  world.editEntity(player).withComponent('player', {}).withComponent('fov', {
    fov: new set_space_1.SetSpace(width)
  }).withComponent('viewport-focus', {});
  setType(world, player, type);
  const idCard = items_1.createEntityWithItemComponent(world, 'idCard', random, region);
  const rifle = items_1.createEntityWithItemComponent(world, 'rifle', random, region);
  const sniperRifle = items_1.createEntityWithItemComponent(world, 'sniperRifle', random, region);
  const gun = items_1.createEntityWithItemComponent(world, 'gun', random, region);
  const leatherJacket = items_1.createEntityWithItemComponent(world, 'leatherJacket', random, region);
  const boots = items_1.createEntityWithItemComponent(world, 'boots', random, region);
  take(world, player, idCard);
  take(world, player, rifle);
  take(world, player, sniperRifle);
  take(world, player, gun);
  take(world, player, leatherJacket);
  take(world, player, boots);
  equip(world, player, gun, ['leftArm']);
  equip(world, player, leatherJacket, ['torso']);
  equip(world, player, boots, ['leftLeg', 'rightLeg']);
  return player;
}

exports.createPlayer = createPlayer;

function setType(world, entity, type) {
  world.editEntity(entity).withComponent('character-type', {
    type
  });
}

exports.setType = setType;

function createCivilian(world, _random, name, statsType, featureType) {
  const npc = createEmptyNpc(world, name, statsType, featureType);
  setType(world, npc, 'civilian');
  dialogs_1.addDialog(world, npc, 'civilianDialog');
  return npc;
}

exports.createCivilian = createCivilian;

function createGuard(world, random, name, statsType, featureType, region) {
  const npc = createEmptyNpc(world, name, statsType, featureType);
  world.editEntity(npc).withComponent('ai', {
    type: 'rushing',
    state: 'idle',
    interest: undefined,
    distrust: 0
  });
  const rifle = items_1.createEntityWithItemComponent(world, 'rifle', random, region);
  take(world, npc, rifle);
  equip(world, npc, rifle, ['leftArm']);
  setType(world, npc, 'henchman');
  dialogs_1.addDialog(world, npc, 'guardRandomRemarks');
  return npc;
}

exports.createGuard = createGuard;

function take(world, character, entity) {
  world.getComponent(character, 'inventory').content.push(entity);
  const activeEffects = world.getComponent(character, 'active-effects');
  activeEffects.effects = activeEffects.effects.filter(e => e.source !== entity);
}

exports.take = take;

function replacingEquip(world, character, entity, item) {
  const equipped = world.getComponent(character, 'equiped-items');
  const stats = world.getComponent(character, 'character-stats');
  const possibleBodyParts = [];
  Object.keys(stats.current.bodyParts).forEach(key => {
    const bodyPart = stats.current.bodyParts[key];
    bodyPart.itemAttachments.filter(kind => kind === item.kind).forEach(() => possibleBodyParts.push(key));
  });
  equipped.equipment.forEach(e => {
    const equipedItem = world.getComponent(e.entity, 'item').item;

    if (equipedItem.kind === item.kind) {
      const blocking = e.bodyParts.some(part => possibleBodyParts.findIndex(p => p === part) >= 0);

      if (blocking) {
        unequip(world, character, e.entity);
      }
    }
  });
  const availableBodyParts = new Set(possibleBodyParts);

  if (availableBodyParts.size >= item.attachments) {
    const bodyParts = [];
    availableBodyParts.forEach(part => {
      if (bodyParts.length < item.attachments) {
        bodyParts.push(part);
      }
    });
    equip(world, character, entity, bodyParts);
  }
}

exports.replacingEquip = replacingEquip;

function equip(world, character, entity, bodyParts) {
  const {
    item
  } = instantiate_item_1.instantiateItem(world, entity);
  world.getComponent(character, 'equiped-items').equipment.push({
    entity,
    bodyParts
  });
  const activeEffects = world.getComponent(character, 'active-effects');
  item.effects.forEach(e => activeEffects.effects.push({
    source: entity,
    effect: e,
    isCritical: false,
    isPiercing: false
  }));
}

exports.equip = equip;

function unequip(world, character, entity) {
  const equipped = world.getComponent(character, 'equiped-items');
  const attachementIndex = equipped.equipment.findIndex(e => e.entity === entity);
  array_utils_1.dropAt(equipped.equipment, attachementIndex);
}

exports.unequip = unequip;

function createEmptyNpc(world, name, statsType, featureType) {
  const character = createCharacter(world, statsType, featureType);
  return world.editEntity(character).withComponent('npc', {}).withComponent('triggers', {
    entities: [],
    type: 'dialog',
    name,
    inTurnBased: false
  }).entity;
}

exports.createEmptyNpc = createEmptyNpc;

function createCharacter(world, statsType, featureType) {
  return world.createEntity().withComponent('inventory', {
    content: []
  }).withComponent('equiped-items', {
    equipment: []
  }).withComponent('feature', {
    feature: () => features_1.features[featureType]
  }).withComponent('character-stats', character_stats_1.createCharacterStatsComponent(statsType)).withComponent('active-effects', {
    effects: []
  }).entity;
}

exports.createCharacter = createCharacter;
exports.characterCreators = characterCreatorsDefinition;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Backend; });
/**
 * @class Abstract display backend module
 * @private
 */
class Backend {
    getContainer() { return null; }
    setOptions(options) { this._options = options; }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

class ItemSelector {
  constructor(items, state = {
    focused: true,
    firstRow: 0,
    hovered: 0,
    selected: undefined
  }) {
    this.items = items;
    this.state = state;
  }

  setItems(items) {
    this.items = items;
  }

  get selected() {
    if (this.state.selected !== undefined) {
      const {
        selected
      } = this.state;
      return this.itemAtIndex(selected);
    }

    return undefined;
  }

  get hovered() {
    if (this.state.hovered !== undefined) {
      const {
        hovered
      } = this.state;
      return this.itemAtIndex(hovered);
    }

    return undefined;
  }

  get selectedIndex() {
    return this.state.selected;
  }

  get hoveredIndex() {
    return this.state.hovered;
  }

  get length() {
    return this.items.length;
  }

  itemAtIndex(line) {
    return this.items[line];
  }

  update(world, content) {
    updateSelectorState(world, this.state, content, this.length);
  }

  isItemVisible(content, index) {
    return isLineVisible(this.state, content, index);
  }

}

exports.ItemSelector = ItemSelector;

function updateSelectorState(world, current, content, availableRows) {
  const input = world.getResource('input');
  let position;

  if (input.position) {
    position = new spatial_1.Vector([input.position.x, input.position.y]);
    current.focused = content.containsVector(position);
  } else {
    current.focused = false;
  }

  const up = input.isActive('plus');
  const down = input.isActive('minus');

  if (up) {
    current.hovered--;
  }

  if (down) {
    current.hovered++;
  }

  current.hovered += availableRows;
  current.hovered %= availableRows;

  if (current.firstRow > current.hovered) {
    current.firstRow = current.hovered;
  } else if (current.firstRow <= current.hovered - content.height) {
    current.firstRow = current.hovered - content.height + 1;
  }

  current.selected = undefined;

  if (position && content.containsVector(position)) {
    const delta = position.minus(content.topLeft);
    current.hovered = delta.y + current.firstRow;

    if (input.mousePressed) {
      current.selected = delta.y + current.firstRow;
    }
  }

  if (input.isActive('accept')) {
    current.selected = current.hovered;
  }

  const numericPressed = input.numericActive();

  if (numericPressed !== undefined) {
    current.selected = numericPressed;
  }
}

exports.updateSelectorState = updateSelectorState;

function isLineVisible(current, content, index) {
  return index >= current.firstRow && index < current.firstRow + content.height;
}

exports.isLineVisible = isLineVisible;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const effects_1 = __webpack_require__(16);

const kill_1 = __webpack_require__(76);

const stats_1 = __webpack_require__(31);

const characters_1 = __webpack_require__(8);

function applyEffect(world, uniform, target, application) {
  const type = application.effect.type;
  let result;

  switch (application.effect.type) {
    case 'damage':
      result = applyDamage(world, uniform, target, application);
      break;

    case 'kill':
      kill_1.kill(world, uniform, target);
      result = {
        killed: true
      };
      break;

    case 'negate':
      result = removeAllNegativeEffects(world, target);
      break;

    case 'heal':
      result = applyHeal(world, target, application);
      break;

    default:
      result = applyStatusEffect(world, target, application);
      break;
  }

  return {
    type,
    ...result
  };
}

exports.applyEffect = applyEffect;

function clearExpiredEffects(world, entity) {
  const activeEffects = world.getComponent(entity, 'active-effects');
  activeEffects.effects = activeEffects.effects.filter(e => e.effect.duration === undefined || e.effect.duration > 0);
}

exports.clearExpiredEffects = clearExpiredEffects;

function updateEffects(world, entity, uniform) {
  const activeEffects = world.getComponent(entity, 'active-effects');
  activeEffects.effects.forEach(effect => {
    switch (effect.effect.type) {
      case 'bleed':
        applyEffect(world, uniform, entity, {
          source: entity,
          effect: effects_1.damage(1),
          isCritical: false,
          isPiercing: true
        });
        break;
    }

    if (effect.effect.duration !== undefined && effect.effect.duration > 0) {
      effect.effect.duration -= 1;
    }
  });
}

exports.updateEffects = updateEffects;

function applyDamage(world, uniform, target, application) {
  const {
    effect
  } = application;
  const stats = world.getComponent(target, 'character-stats');

  if (stats === undefined) {
    return {
      killed: false
    };
  }

  let killed = false;
  const defense = application.isPiercing ? 0 : stats_1.getDefense(world, target);
  const criticalMultiplier = application.isCritical ? stats_1.getCriticalMultiplier(world, target) : 1.0;
  const defenseMultiplier = 10 / (10 + defense);
  const finalDamage = Math.floor(Math.max(0, effect.value * defenseMultiplier * criticalMultiplier));

  if (finalDamage > 0) {
    stats.current.health = Math.max(0, stats.current.health - finalDamage);
    killed = stats.current.health === 0;
  }

  if (killed) {
    kill_1.kill(world, uniform, target);
  }

  return {
    killed,
    baseDamage: effect.value,
    finalDamage,
    defense
  };
}

exports.applyDamage = applyDamage;

function applyHeal(world, target, application) {
  const stats = world.getComponent(target, 'character-stats');

  if (stats !== undefined) {
    stats.current.health += application.effect.value || characters_1.characterStats[stats.type].health;
    stats.current.health = Math.min(characters_1.characterStats[stats.type].health);
  }

  return {};
}

exports.applyHeal = applyHeal;

function applyStatusEffect(world, target, application) {
  const activeEffects = world.getComponent(target, 'active-effects');
  activeEffects.effects.push(application);
  return {};
}

exports.applyStatusEffect = applyStatusEffect;

function removeAllNegativeEffects(world, target) {
  const activeEffects = world.getComponent(target, 'active-effects');
  activeEffects.effects = activeEffects.effects.filter(e => !e.effect.negative);
  return {};
}

exports.removeAllNegativeEffects = removeAllNegativeEffects;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const features_1 = __webpack_require__(15);

function getFeature(world, entity) {
  const feature = world.getComponent(entity, 'feature');

  if (feature) {
    return feature.feature();
  }

  return undefined;
}

exports.getFeature = getFeature;

function createFeatureFromType(world, level, position, type) {
  return createFeature(world, level, position, () => features_1.features[type]);
}

exports.createFeatureFromType = createFeatureFromType;

function createFeature(world, level, position, feature) {
  const map = world.getResource('map');
  const e = map.levels[level].getTile(position);

  if (e !== undefined) {
    throw new Error(`already a tile at position ${position.key}`);
  }

  const entity = world.createEntity().withComponent('position', {
    level,
    position
  }).withComponent('feature', {
    feature
  }).entity;
  map.levels[level].setTile(position, entity);
  return entity;
}

exports.createFeature = createFeature;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class AbstractState {
  constructor(name, usedSystems) {
    this.name = name;
    this.usedSystems = usedSystems;
  }

  start(world) {
    world.activeSystems.forEach(s => world.disableSystem(s));
    this.usedSystems.forEach(s => world.enableSystem(s));
  }

  stop(_world) {}

  isDone(world) {
    return this.usedSystems.find(s => !world.emptySystems.has(s)) === undefined;
  }

}

exports.AbstractState = AbstractState;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class AbstractShape {
  contains(s) {
    return s.all(p => this.containsVector(p));
  }

  intersects(s) {
    return s.some(p => this.containsVector(p));
  }

  equals(s) {
    return this.contains(s) && s.contains(this);
  }

  foreach(f) {
    let i = 0;
    this.all(p => {
      f(p, i);
      i++;
      return true;
    });
  }

  some(f) {
    return !this.all(p => {
      return !f(p);
    });
  }

}

exports.AbstractShape = AbstractShape;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const palettes_1 = __webpack_require__(2);

const symbols_1 = __webpack_require__(66);

function character(character, name, diffuse) {
  return {
    cover: 'none',
    blocking: true,
    lightBlocking: false,
    ground: false,
    character,
    diffuse,
    name
  };
}

function ground(name, character, diffuse) {
  return {
    cover: 'none',
    blocking: false,
    lightBlocking: false,
    ground: true,
    character,
    diffuse,
    name
  };
}

function highObstacle(name, character, diffuse) {
  return {
    cover: 'full',
    blocking: true,
    lightBlocking: true,
    ground: false,
    character,
    diffuse,
    name
  };
}

function lowObstacle(name, character, diffuse) {
  return {
    cover: 'partial',
    blocking: true,
    lightBlocking: false,
    ground: false,
    character,
    diffuse,
    name
  };
}

function decoration(name, character, diffuse) {
  return {
    cover: 'none',
    blocking: false,
    lightBlocking: false,
    ground: false,
    character,
    diffuse,
    name
  };
}

const featuresDefinition = {
  wall: highObstacle('wall', '#', palettes_1.gray[3]),
  corridor: ground('corridor', '.', palettes_1.gray[0]),
  room: ground('floor', '.', palettes_1.primary[1]),
  hub: ground('floor', '.', palettes_1.primary[0]),
  locker: highObstacle('locker', symbols_1.strangeSymbols[16], palettes_1.primary[1]),
  trash: decoration('trash', symbols_1.strangeSymbols[21], palettes_1.gray[2]),
  urinal: lowObstacle('trash', 'J', palettes_1.gray[2]),
  door: highObstacle('door', symbols_1.strangeSymbols[27], palettes_1.primary[1]),
  yellow_player: character('@', 'you', palettes_1.primary[0]),
  green_player: character('@', 'you', palettes_1.primary[1]),
  blue_player: character('@', 'you', palettes_1.primary[2]),
  red_player: character('@', 'you', palettes_1.primary[3]),
  loot: decoration('some loot', 'l', palettes_1.primary[1]),
  table: lowObstacle('a table', symbols_1.strangeSymbols[3], palettes_1.primary[1]),
  civilian: character('c', 'civilian', palettes_1.primary[1]),
  guard: character('g', 'guard', palettes_1.primary[1]),
  eliteGuard: character('g', 'elite guard', palettes_1.primary[3]),
  terminal: lowObstacle('a terminal', symbols_1.strangeSymbols[28], palettes_1.primary[1]),
  core: lowObstacle('the core', symbols_1.strangeSymbols[34], palettes_1.primary[3])
};
exports.features = featuresDefinition;
const generatorsDefinition = {
  block: index => highObstacle('a block of concrete', symbols_1.gridSymbols[[7, 5, 15, 17][index]], palettes_1.primary[1]),
  elevator: _index => lowObstacle('an elevator', symbols_1.arrows[7], palettes_1.primary[1])
};
exports.generators = generatorsDefinition;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function damage(value) {
  return {
    type: 'damage',
    negative: true,
    value
  };
}

exports.damage = damage;

function cooldown(duration) {
  return {
    type: 'cooldown',
    negative: true,
    duration
  };
}

exports.cooldown = cooldown;

function cooldownBuff(value, duration) {
  return {
    type: 'cooldown-buff',
    negative: true,
    value,
    duration
  };
}

exports.cooldownBuff = cooldownBuff;

function confuse(duration) {
  return {
    type: 'confuse',
    negative: true,
    duration
  };
}

exports.confuse = confuse;

function defend(value, duration) {
  return {
    type: 'defense',
    negative: false,
    duration,
    value
  };
}

exports.defend = defend;

function penetrate(value, duration) {
  return {
    type: 'defense',
    negative: true,
    duration,
    value: -value
  };
}

exports.penetrate = penetrate;

function stun(duration) {
  return {
    type: 'stun',
    negative: true,
    duration
  };
}

exports.stun = stun;

function immobilize(duration) {
  return {
    type: 'immobilize',
    negative: true,
    duration
  };
}

exports.immobilize = immobilize;

function aim(value, duration) {
  return {
    type: 'aim',
    negative: false,
    duration,
    value
  };
}

exports.aim = aim;

function critChance(value, duration) {
  return {
    type: 'crit-chance',
    negative: false,
    duration,
    value
  };
}

exports.critChance = critChance;

function critMultiplier(value, duration) {
  return {
    type: 'crit-multiplier',
    negative: false,
    duration,
    value
  };
}

exports.critMultiplier = critMultiplier;

function bleed() {
  return {
    type: 'bleed',
    negative: true
  };
}

exports.bleed = bleed;

function kill() {
  return {
    type: 'kill',
    negative: true
  };
}

exports.kill = kill;

function negateEffects() {
  return {
    type: 'negate',
    negative: false
  };
}

exports.negateEffects = negateEffects;

function heal() {
  return {
    type: 'heal',
    negative: false
  };
}

exports.heal = heal;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const object_utils_1 = __webpack_require__(24);

const actions_1 = __webpack_require__(25);

function instantiateItem(world, entity) {
  const component = world.getComponent(entity, 'item');
  const activeEffects = world.getComponent(entity, 'active-effects');
  const item = object_utils_1.copy(component.item);

  if (component.mods.length > 0) {
    let adjective = undefined;
    component.mods.forEach(m => {
      if (m.kind === 'active' || adjective === undefined) {
        adjective = m.adjective;
      }
    });
    item.name = `${adjective} ${item.name}`;

    if (item.actions.length > 0) {
      const passiveAction = component.mods.filter(mod => mod.kind === 'passive' && mod.action !== undefined).reduce((action, mod) => actions_1.addModification(mod.action, action), item.actions[0]);
      item.actions = [passiveAction];
      const cooldown = activeEffects.effects.find(e => e.effect.type === 'cooldown');
      component.mods.filter(mod => mod.kind === 'active' && mod.action !== undefined).forEach(mod => {
        const modAction = actions_1.addModification(mod.action, passiveAction);

        if (cooldown) {
          modAction.cooldown = cooldown.effect.duration;
        }

        item.actions.push(modAction);
      });
    }

    component.mods.filter(mod => mod.effects !== undefined).forEach(mod => item.effects.push(...mod.effects));
  }

  return {
    item,
    mods: component.mods
  };
}

exports.instantiateItem = instantiateItem;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const feature_1 = __webpack_require__(12);

const rectangle_1 = __webpack_require__(3);

const assets_1 = __webpack_require__(77);

const lore_1 = __webpack_require__(78);

function shapeOfAsset(type, position, direction) {
  const asset = assets_1.assets[type];
  return rectangle_1.Rectangle.footprint(position, direction, asset.size);
}

exports.shapeOfAsset = shapeOfAsset;

function createAsset(world, random, level, position, direction, type) {
  const shape = shapeOfAsset(type, position, direction);
  return createAssetFromShape(world, random, level, shape, type);
}

exports.createAsset = createAsset;

function createAssetFromShape(world, random, level, shape, type) {
  const entity = placeAsset(world, random, type);
  placeAssetParts(world, type, entity, level, shape);
  return entity;
}

exports.createAssetFromShape = createAssetFromShape;

function placeAsset(world, random, type) {
  const asset = assets_1.assets[type];
  const triggerInTurnBased = type === 'door';
  const entity = world.createEntity().withComponent('asset', {
    type
  }).withComponent('triggers', {
    name: asset.name,
    type: 'asset',
    entities: [],
    inTurnBased: triggerInTurnBased
  }).entity;

  if (asset.hasInventory) {
    world.editEntity(entity).withComponent('inventory', {
      content: []
    });
  }

  if (asset.dialog !== undefined) {
    world.editEntity(entity).withComponent('dialog', {
      type: asset.dialog
    });
    const lore = lore_1.sampleLoreForDialog(world, random, asset.dialog);

    if (lore !== undefined) {
      world.editEntity(entity).withComponent('lore', {
        type: lore
      });
    }
  }

  return entity;
}

function placeAssetParts(world, type, entity, level, shape) {
  const map = world.getResource('map');
  const asset = assets_1.assets[type];
  shape.foreach((p, i) => {
    const feature = asset.feature(i);

    if (feature !== undefined) {
      const tile = putTile(world, map, level, p, () => feature);
      addTrigger(world, tile, entity);
    }
  });
}

function removeAsset(world, map, entity) {
  const triggers = world.getComponent(entity, 'triggers');
  triggers.entities.forEach(tile => removeTile(world, map, tile));
  world.deleteEntity(entity);
}

exports.removeAsset = removeAsset;

function removeTile(world, map, entity) {
  const ground = world.getComponent(entity, 'ground');
  const position = world.getComponent(entity, 'position');
  map.levels[position.level].removeTile(position.position);
  feature_1.createFeature(world, position.level, position.position, ground.feature);
  world.deleteEntity(entity);
}

function putTile(world, map, level, position, feature) {
  const ground = removeGround(world, map, level, position);
  const tile = world.createEntity().withComponent('position', {
    level,
    position
  }).withComponent('feature', {
    feature
  }).withComponent('ground', {
    feature: ground
  }).entity;
  map.levels[level].setTile(position, tile);
  return tile;
}

function addTrigger(world, tile, entity) {
  world.editEntity(tile).withComponent('triggered-by', {
    entity
  });
  world.getComponent(entity, 'triggers').entities.push(tile);
}

function removeGround(world, map, level, position) {
  const entity = map.levels[level].removeTile(position);

  if (entity === undefined) {
    throw new Error(`cannot build asset on missing ground at ${position.key}`);
  }

  const feature = world.getComponent(entity, 'feature');

  if (feature === undefined || feature.feature().blocking) {
    throw new Error('cannot build asset on missing or blocking ground');
  }

  world.deleteEntity(entity);
  return feature.feature;
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const state_1 = __webpack_require__(13);

class Modal extends state_1.AbstractState {
  constructor(systems) {
    super('modal', systems.filter(s => s !== 'free-mode-control' && s !== 'player-control' && s !== 'player-round-control' && s !== 'player-interaction'));
  }

  update(_world) {}

  isDone(world) {
    const ui = world.getResource('ui');
    return !ui.isModal;
  }

  isFrameLocked() {
    return true;
  }

}

exports.Modal = Modal;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const shape_1 = __webpack_require__(14);

const rectangle_1 = __webpack_require__(3);

class FunctionalShape extends shape_1.AbstractShape {
  constructor(f, boundary) {
    super();
    this.f = f;
    this.boundary = boundary;
  }

  static lN(position, size = 1, center = false) {
    return FunctionalShape.fromMeasure(position, size, center, d => d.lN() <= size);
  }

  static l1(position, size = 1, center = false) {
    return FunctionalShape.fromMeasure(position, size, center, d => d.l1() <= size);
  }

  static empty(position) {
    const boundary = rectangle_1.Rectangle.centerAt(position.x, position.y, 0);
    return new FunctionalShape(() => false, boundary);
  }

  static l2(position, size = 1, center = false) {
    return FunctionalShape.fromMeasure(position, size, center, d => d.squaredLength() <= size * size);
  }

  static fromMeasure(position, size, center, measure) {
    const boundary = rectangle_1.Rectangle.centerAt(position.x, position.y, size);
    return new FunctionalShape(p => {
      const d = p.minus(position).abs();

      if (d.fX === 0 && d.fY === 0) {
        return center;
      }

      return measure(d);
    }, boundary);
  }

  bounds() {
    return this.boundary;
  }

  containsVector(p) {
    return this.f(p);
  }

  translate(t) {
    return new FunctionalShape(p => this.f(p.add(t)), this.boundary.translate(t));
  }

  grow() {
    return this;
  }

  shrink() {
    return this;
  }

  all(f) {
    return this.boundary.all(p => !this.f(p) || f(p));
  }

}

exports.FunctionalShape = FunctionalShape;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.turnComponents = ['wait-turn', 'start-turn', 'take-turn', 'took-turn'];

function turnBasedEntities(world) {
  return exports.turnComponents.map(c => world.components.get(c).size()).reduce((a, b) => a + b);
}

exports.turnBasedEntities = turnBasedEntities;

function isTurnBased(world, entity) {
  return exports.turnComponents.some(c => world.components.get(c).has(entity));
}

exports.isTurnBased = isTurnBased;

function clearTurnBased(world) {
  exports.turnComponents.forEach(c => world.components.get(c).clear());
}

exports.clearTurnBased = clearTurnBased;

function playerIsStruggling(world) {
  const player = world.getStorage('player').first();
  const activeEffects = world.getComponent(player, 'active-effects');
  return activeEffects.effects.find(e => e.effect.type === 'bleed') !== undefined;
}

exports.playerIsStruggling = playerIsStruggling;

function playerIsDead(world) {
  const player = world.getStorage('player').first();
  return world.hasComponent(player, 'dead');
}

exports.playerIsDead = playerIsDead;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const rectangle_1 = __webpack_require__(3);

const action_selector_1 = __webpack_require__(60);

const overview_1 = __webpack_require__(63);

const window_decoration_1 = __webpack_require__(28);

const inventory_transfer_modal_1 = __webpack_require__(74);

const inventory_1 = __webpack_require__(75);

const multiple_choice_modal_1 = __webpack_require__(79);

const tabs_1 = __webpack_require__(80);

const log_1 = __webpack_require__(81);

const movement_selector_1 = __webpack_require__(82);

const attack_selector_1 = __webpack_require__(83);

const dialogs_1 = __webpack_require__(26);

const dialog_modal_1 = __webpack_require__(84);

const random_1 = __webpack_require__(5);

const modal_1 = __webpack_require__(19);

const multiple_choice_tab_1 = __webpack_require__(85);

function runDialog(ui, world, random, dialog, player, npc, pushState) {
  const result = ui.dialogResult();

  if (!ui.dialogShowing()) {
    ui.showDialogModal(world, random, dialog, player, npc);
    pushState(new modal_1.Modal(world.activeSystemsList()));
  } else if (result !== undefined) {
    ui.hideDialogModal();
  }

  return result;
}

exports.runDialog = runDialog;
const modalOffsetY = 15;

class UIResource {
  constructor(rng) {
    this.rng = rng;
    this.kind = 'ui';
    this.visibleElements = [];
    this.isModal = false;
    this.inventoryTransferModal = undefined;
    this.multipleChoiceModal = undefined;
    this.dialogModal = undefined;
    this.tabs = undefined;
    this.actionSelector = undefined;
    this.movementSelector = undefined;
    this.attackSelector = undefined;
    this.multipleChoiceSelector = undefined;
    this.uniform = new random_1.Random(rng);
  }

  update(world) {
    if (this.isModal) {
      if (this.inventoryTransferModal !== undefined) {
        this.inventoryTransferModal.update(world);

        if (this.inventoryTransferModal.closed) {
          this.hideInventoryTransferModal();
        }
      } else if (this.multipleChoiceModal !== undefined) {
        this.multipleChoiceModal.update(world);

        if (this.multipleChoiceModal.closed) {
          this.isModal = false;
        }
      } else if (this.dialogModal !== undefined) {
        this.dialogModal.update(world);

        if (this.dialogModal.closed) {
          this.isModal = false;
        }
      }
    } else if (this.tabs !== undefined) {
      this.tabs.update(world);
    }
  }

  render(renderer) {
    if (this.tabs !== undefined) {
      this.tabs.render(renderer);
    }

    if (this.inventoryTransferModal !== undefined) {
      this.inventoryTransferModal.render(renderer);
    } else if (this.multipleChoiceModal !== undefined) {
      this.multipleChoiceModal.render(renderer);
    } else if (this.dialogModal !== undefined) {
      this.dialogModal.render(renderer);
    }
  }

  reset() {
    this.inventoryTransferModal = undefined;

    if (this.tabs !== undefined) {
      this.tabs.reset();
    }
  }

  createTabs(world, focus) {
    const viewport = world.getResource('viewport');
    const full = new rectangle_1.Rectangle(0, viewport.boundaries.y - 12, viewport.boundaries.x, 12);
    const minimized = new rectangle_1.Rectangle(viewport.boundaries.x - 20, 0, 20, 9);
    this.tabs = new tabs_1.Tabs(full, minimized);
    this.tabs.add(new log_1.LogTab());
    this.tabs.add(new inventory_1.Inventory(focus, this.uniform));
    this.tabs.add(new overview_1.Overview(focus));
  }

  showInventoryTransferModal(world, source, sourceTitle, target, targetTitle) {
    this.isModal = true;
    const viewport = world.getResource('viewport');
    const bounds = new rectangle_1.Rectangle(viewport.boundaries.x / 2 - 30, viewport.boundaries.y / 2 - modalOffsetY, 60, 20);
    this.inventoryTransferModal = inventory_transfer_modal_1.InventoryTransferModal.build(bounds, source, sourceTitle, target, targetTitle);
  }

  inventoryTransferModalShowing() {
    return this.inventoryTransferModal !== undefined;
  }

  hideInventoryTransferModal() {
    if (this.inventoryTransferModal !== undefined) {
      this.inventoryTransferModal = undefined;
    }
  }

  showMultipleChoiceModal(world, title, options) {
    this.isModal = true;
    const viewport = world.getResource('viewport');
    const window = new window_decoration_1.WindowDecoration(new rectangle_1.Rectangle(viewport.boundaries.x / 2 - 20, viewport.boundaries.y / 2 - modalOffsetY, 40, 10), title);
    this.multipleChoiceModal = new multiple_choice_modal_1.MultipleChoiceModal(window, options);
  }

  selectedModalOption() {
    if (this.multipleChoiceModal !== undefined) {
      const s = this.multipleChoiceModal.selector.selected;

      if (s !== undefined) {
        return s.entity;
      }
    }

    return undefined;
  }

  multipleChoiceModalShowing() {
    return this.multipleChoiceModal !== undefined;
  }

  hideMultipleChoiceModal() {
    if (this.multipleChoiceModal !== undefined) {
      this.multipleChoiceModal = undefined;
    }
  }

  showDialogModal(world, random, dialog, player, npc) {
    this.isModal = true;
    const viewport = world.getResource('viewport');
    const window = new window_decoration_1.WindowDecoration(new rectangle_1.Rectangle(viewport.boundaries.x / 2 - 20, viewport.boundaries.y / 2 - modalOffsetY, 40, 10), 'dialog');
    this.dialogModal = new dialog_modal_1.DialogModal(world, random, window, dialogs_1.dialogs[dialog], player, npc);
  }

  dialogResult() {
    if (this.dialogModal !== undefined) {
      return this.dialogModal.result;
    }

    return undefined;
  }

  dialogShowing() {
    return this.dialogModal !== undefined;
  }

  hideDialogModal() {
    if (this.dialogModal !== undefined) {
      this.dialogModal = undefined;
    }
  }

  hideSelectors() {
    this.movementSelector = undefined;
    this.actionSelector = undefined;
    this.attackSelector = undefined;
    this.multipleChoiceSelector = undefined;

    if (this.tabs !== undefined) {
      this.tabs.reset();
    }
  }

  showActionSelector(groups) {
    if (this.tabs !== undefined && this.actionSelector === undefined) {
      this.actionSelector = new action_selector_1.ActionSelector(groups);
      this.tabs.setFocusTab(this.actionSelector);
    }
  }

  selectedAction() {
    if (this.actionSelector !== undefined) {
      return this.actionSelector.selected;
    }

    return undefined;
  }

  showMovementSelector(target, queries, movement) {
    if (this.tabs !== undefined && this.movementSelector === undefined) {
      this.hideSelectors();
      this.movementSelector = new movement_selector_1.MovementSelector(target, queries, movement);
      this.tabs.setFocusTab(this.movementSelector);
    }
  }

  selectedMovement() {
    if (this.movementSelector !== undefined) {
      return this.movementSelector.selected;
    }

    return undefined;
  }

  showAttackSelector(target, queries, range) {
    if (this.tabs !== undefined && this.attackSelector === undefined) {
      this.hideSelectors();
      this.attackSelector = new attack_selector_1.AttackSelector(target, queries, range);
      this.tabs.setFocusTab(this.attackSelector);
    }
  }

  selectedAttack() {
    if (this.attackSelector !== undefined) {
      return this.attackSelector.selected;
    }

    return undefined;
  }

  showMultipleChoiceSelector(options) {
    if (this.tabs !== undefined && this.multipleChoiceSelector === undefined) {
      this.hideSelectors();
      this.multipleChoiceSelector = new multiple_choice_tab_1.MultipleChoiceSelector(options);
      this.tabs.setFocusTab(this.multipleChoiceSelector);
    }
  }

  selectedOption() {
    if (this.multipleChoiceSelector !== undefined) {
      return this.multipleChoiceSelector.selected;
    }

    return undefined;
  }

  hasElement(position) {
    return this.isModal && (this.inventoryTransferModal !== undefined && this.inventoryTransferModal.contains(position) || this.multipleChoiceModal !== undefined && this.multipleChoiceModal.contains(position) || this.dialogModal !== undefined && this.dialogModal.contains(position)) || this.tabs !== undefined && this.tabs.contains(position);
  }

}

exports.UIResource = UIResource;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const characters_1 = __webpack_require__(8);

const object_utils_1 = __webpack_require__(24);

function createCharacterStatsComponent(type) {
  return {
    type,
    current: object_utils_1.copy(characters_1.characterStats[type])
  };
}

exports.createCharacterStatsComponent = createCharacterStatsComponent;

function speed(_stats) {
  return 0.4;
}

exports.speed = speed;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const lodash_clonedeep_1 = __importDefault(__webpack_require__(65));

function copy(o) {
  return lodash_clonedeep_1.default(o);
}

exports.copy = copy;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const action_1 = __webpack_require__(68);

const effects_1 = __webpack_require__(16);

const object_utils_1 = __webpack_require__(24);

function movement(range) {
  return {
    kind: 'movement',
    range,
    target: 'self'
  };
}

function jump(range) {
  return {
    kind: 'jump',
    range,
    target: 'self'
  };
}

function changeEquipment() {
  return {
    kind: 'changeEquipment'
  };
}

function trigger() {
  return {
    kind: 'trigger'
  };
}

function attack(range, accuracy, effects, grants) {
  return {
    kind: 'attack',
    range,
    accuracy,
    effects,
    target: 'enemy',
    grants
  };
}

function status(effects, target = 'self') {
  return {
    kind: 'status',
    effects,
    target
  };
}

function modifySubActions(actions, attackModifier, movementModifier, effectModifier) {
  return actions.map(a => {
    switch (a.kind) {
      case 'attack':
        {
          const effects = a.effects.map(e => object_utils_1.copy(e));
          effects.forEach(e => effectModifier(e, false));
          const newAttack = attack(a.range, a.accuracy, effects);
          attackModifier(newAttack);
          return newAttack;
        }

      case 'status':
        {
          const effects = a.effects.map(e => object_utils_1.copy(e));
          effects.forEach(e => effectModifier(e, true));
          return status(effects);
        }

      case 'movement':
        {
          const movement = object_utils_1.copy(a);
          movementModifier(movement);
          return movement;
        }

      case 'trigger':
      case 'changeEquipment':
      case 'jump':
        return object_utils_1.copy(a);
    }
  });
}

function addModification(type, base) {
  switch (type) {
    case 'overcharge':
      return action_1.action('overcharge', base.cost, modifySubActions([...base.subActions, status([effects_1.cooldown(2)], 'item')], a => {
        a.accuracy = Math.max(2, a.accuracy - 2);
        a.range = a.range + 2;
        a.grants = undefined;
      }, () => null, e => {
        e.value = e.value !== undefined ? e.value + 2 : undefined;
      }), base.characterTypes);

    case 'acrobatics':
      {
        const actions = object_utils_1.copy(base.subActions);
        const firstAttack = actions.find(a => a.kind === 'attack');

        firstAttack.grants = result => {
          if (result.isCritical) {
            return [jump(6), attack(1, firstAttack.accuracy, firstAttack.effects, firstAttack.grants)];
          } else {
            return [];
          }
        };

        const chain = action_1.action('chain', 'both', [jump(6), ...actions], ['yellow_player', 'boss']);
        return chain;
      }

    case 'frenzy':
      {
        const first = object_utils_1.copy(base.subActions.find(a => a.kind === 'attack'));
        const melee = first.range === 1;
        const frenzy = action_1.action('frenzy', 'both', [first], ['yellow_player', 'red_player', 'boss']);

        first.grants = result => {
          if (result.isHit) {
            const lastAttack = frenzy.subActions[frenzy.subActions.length - 1];
            const accuracy = Math.max(2, lastAttack.accuracy - 2);

            if (melee) {
              return [status([effects_1.critChance(-1, 0), effects_1.critMultiplier(0.5, 0)]), movement(5), attack(1, accuracy, lastAttack.effects, lastAttack.grants)];
            } else {
              return [status([effects_1.aim(-1, 0)]), attack(lastAttack.range, accuracy, lastAttack.effects, lastAttack.grants)];
            }
          } else {
            return [status([effects_1.immobilize(1)])];
          }
        };

        return frenzy;
      }

    case 'doubleShot':
      return action_1.action('double shot', base.cost, [...base.subActions, ...base.subActions, status([effects_1.cooldown(2)], 'item')], base.characterTypes);

    case 'headshot':
      return action_1.action('headshot', base.cost, modifySubActions([status([effects_1.critChance(2, 1), effects_1.critMultiplier(2, 1)], 'self'), ...base.subActions, status([effects_1.cooldown(1)], 'item')], () => null, () => null, () => null), base.characterTypes);

    case 'execute':
      return action_1.action('execute', base.cost, modifySubActions([status([effects_1.critChance(2, 1), effects_1.critMultiplier(2, 1)]), ...base.subActions, status([effects_1.cooldown(1)], 'item')], a => {
        a.effects.push(effects_1.stun(1));
        a.range = Math.min(1, Math.floor(a.range / 2));
        a.grants = undefined;
      }, () => null, () => null), base.characterTypes);

    case 'bloody':
      return action_1.action(base.name, base.cost, modifySubActions(base.subActions, a => {
        a.grants = result => result.effects.some(e => e.killed) ? [status([effects_1.critChance(2, 2), effects_1.critMultiplier(1.1, 2)])] : [];
      }, () => null, () => null), base.characterTypes);

    case 'fast':
      return action_1.action(base.name, 'either', base.subActions, base.characterTypes);

    case 'mobile':
      return action_1.action('run and gun', 'action', [...base.subActions, movement(6)], base.characterTypes);

    case 'penetrating':
      return action_1.action(base.name, base.cost, modifySubActions(base.subActions, a => {
        a.effects.push(effects_1.penetrate(2, 0));
      }, () => null, () => null), base.characterTypes);

    case 'stabilizing':
      return action_1.action(base.name, base.cost, modifySubActions(base.subActions, a => {
        a.grants = result => result.isHit ? [status([effects_1.aim(2, 2)])] : [];
      }, () => null, () => null), base.characterTypes);

    case 'stunning':
      return action_1.action(base.name, base.cost, modifySubActions(base.subActions, a => {
        a.effects.push(effects_1.stun(1));
      }, () => null, () => null), base.characterTypes);

    case 'ranged':
      return action_1.action(base.name, base.cost, modifySubActions(base.subActions, a => {
        a.range += 1;
      }, () => null, () => null), base.characterTypes);

    case 'enhanced':
      return action_1.action(base.name, base.cost, modifySubActions(base.subActions, () => null, () => null, e => {
        if (e.type === 'damage') {
          e.value = Math.floor(e.value * 1.3);
        }
      }), base.characterTypes);
  }
}

exports.addModification = addModification;

function createAction(type) {
  switch (type) {
    case 'kick':
      return action_1.action('kick', 'either', [status([effects_1.critChance(4, 0)]), attack(1, 8, [effects_1.damage(4)])]);

    case 'trigger':
      return action_1.action('trigger', 'either', [trigger()]);

    case 'noMove':
      return action_1.action('no move', 'movement', []);

    case 'changeEquipment':
      return action_1.action('change equipment', 'either', [changeEquipment()]);

    case 'endTurn':
      return action_1.action('end turn', 'both', []);

    case 'bodyShield':
      return action_1.action('body shield', 'movement', [status([effects_1.defend(5, 1)])]);

    case 'move':
      return action_1.action('move', 'movement', [movement(4)]);

    case 'heal':
      return action_1.action('heal', 'either', [status([effects_1.heal(), effects_1.negateEffects()])]);

    case 'kill':
      return action_1.action('kill', 'action', [status([effects_1.kill()])]);

    case 'hit':
      return action_1.action('hit', 'action', [attack(1, 8, [effects_1.damage(3)])]);

    case 'rush':
      return action_1.action('rush', 'all', [movement(6)]);

    case 'shoot':
      return action_1.action('shoot', 'action', [attack(10, 6, [effects_1.damage(5)])]);

    case 'tighten':
      return action_1.action('tighten', 'action', [status([effects_1.defend(4, 1)])]);
  }
}

exports.createAction = createAction;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const cover_1 = __webpack_require__(38);

const inventory_1 = __webpack_require__(70);

const structure_1 = __webpack_require__(71);

const quests_1 = __webpack_require__(72);

const lores_1 = __webpack_require__(73);

function navigation(text, type) {
  return {
    text,
    type
  };
}

function nextDialog(text, dialog) {
  return {
    text,
    type: 'next_dialog',
    dialog
  };
}

function answer(text, type, target) {
  return {
    text,
    type,
    target
  };
}

function attack() {
  return answer('[attack]', 'attack');
}

function moveUp() {
  return answer('[move one level up]', 'move_level_up');
}

function moveDown() {
  return answer('[move one level down]', 'move_level_down');
}

function statelessDialog(steps) {
  return {
    steps: () => steps
  };
}

function dialog(steps) {
  return {
    steps
  };
}

function plaintextDialog(text, type = 'close') {
  return statelessDialog([{
    text: [text],
    answers: [answer('ok', type)]
  }]);
}

function doorControls(world, player) {
  const doorControlsAnswers = [];
  const position = world.getComponent(player, 'position');
  const map = world.getResource('map');
  const level = map.levels[position.level];
  const structure = level.getStructure(position.position);
  const doors = structure_1.getTriggersOfStructure(world, structure, ['door']);
  doors.forEach(door => {
    const triggers = world.getComponent(door, 'triggers');
    const p = world.getComponent(triggers.entities[0], 'position');
    const directions = cover_1.coveringDirections(p.position, position.position);
    doorControlsAnswers.push(answer(`a door to the ${directions.join(',')}`, 'trigger', door));
  });
  doorControlsAnswers.push(navigation('back', 0));
  return {
    text: ['door controls'],
    answers: doorControlsAnswers
  };
}

const dialogDefinitions = {
  startLore1: plaintextDialog('here have some lore...', 'unlock_lore'),
  startQuest1: plaintextDialog('please fetch me something...', 'start_quest'),
  terminal: dialog((world, player, owner) => {
    const mainMenuNavigation = [];
    const steps = [];
    const lore = world.getComponent(owner, 'lore');

    if (lore !== undefined) {
      const dialog = lores_1.lores[lore.type];
      mainMenuNavigation.push(nextDialog(dialog.startText, dialog.start));
    }

    steps.push(doorControls(world, player));
    mainMenuNavigation.push(navigation('door controls', steps.length));
    return [{
      text: ['terminal'],
      answers: [...mainMenuNavigation, answer('exit', 'close')]
    }, ...steps];
  }),
  core: statelessDialog([{
    text: ['ACCESS DENIED'],
    answers: [answer('ok', 'close'), attack()]
  }]),
  civilianDialog: dialog((world, _player, owner) => {
    const mainMenuNavigation = [];
    const quest = world.getComponent(owner, 'quest');

    if (quest !== undefined) {
      const {
        startText,
        start
      } = quests_1.quests[quest.type];
      mainMenuNavigation.push(nextDialog(startText, start));
    }

    return [{
      text: ['a civilian'],
      answers: [...mainMenuNavigation, answer('exit', 'close')]
    }, {
      text: civilianRandomRemarks,
      answers: [navigation('ok', 0)]
    }];
  }),
  guardRandomRemarks: statelessDialog([{
    text: ['Do you want to cry now?', 'Love a neurogender bitch, oh, it get my dick hard', "You ain't gonna let me fuck you and I feel you", "I'm icy bitch, don't look at my wrist.", 'Fuck love. All I got for hoes is hard dick and bubblegum.', 'I punched this transhumanist in the ripcage and kicked her in the stomach'],
    answers: [answer('ok', 'close'), attack()]
  }]),
  restrictedAreaCheck: dialog((world, player) => {
    const answers = [attack()];

    if (inventory_1.hasItem(world, player, 'idCard')) {
      answers.push(navigation('[show id card]', 1));
    }

    return [{
      text: ['Hey you, stop it right there. This is a restricted area.', 'Identify yourself'],
      answers
    }, {
      text: ['Ok, you can pass'],
      answers: [answer('ok', 'authorized')]
    }];
  }),
  elevator: statelessDialog([{
    text: ['Elevator controls. Please select a level'],
    answers: [moveUp(), moveDown()]
  }])
};
exports.dialogs = dialogDefinitions;

function addDialog(world, entity, type) {
  const dialog = world.createEntity().withComponent('triggered-by', {
    entity
  }).withComponent('dialog', {
    type
  }).entity;
  world.getComponent(entity, 'triggers').entities.push(dialog);
  return dialog;
}

exports.addDialog = addDialog;
const civilianRandomRemarks = ['we suspect that your sister controls the mutant rom chip and the frozen wand.', 'I apoligize for this statement', 'The CNT-FAI briefly considered joining the Comintern because they fetishized revolutionary upsurges and apparently knew nothing about politics or socialism', 'Thinking about building a railgun', 'Kinda want to hug, but like irl. for the propriocetive stimmy feels :P', 'I am, at my core, a stubborn and frustrating human who only exists to be set in my ways.', "England are gonna win. And I'm gonna post so many garbage selfies tonight", 'Love that my old man is spending his saturday swearing at remainers appearing on the news', "you think you do but you don't", 'I reject nation states', 'Woah I wish I could read', "What the hell is 'pajama'", 'Always use protection', 'Subsurface warfare is going to get lit', 'Gracious wife, gracious life', 'im about to nut these loads', 'May biqueerplatonic people find success in their lives', 'I hope hologender people are getting enough time to rest!', 'Washing my chin', 'I am still against full luxury automated communism. thats not what i aim for.', '#Javascript was a mistake.', 'we had fun looking at all the medieval babies at the art gallery today', "Oh, me? I'm strictly chillin'", "It's a comfortable dusk in the city, and you are a comfortable salmon.", 'adulthood is having your debit card declined, fashionably'];

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class SetSpace {
  constructor(width) {
    this.width = width;
    this.objects = new Uint8Array(width * width);
  }

  has(pos) {
    return this.objects[pos.index(this.width)] > 0;
  }

  set(pos) {
    this.objects[pos.index(this.width)] = 1;
  }

  byIndex(index) {
    return this.objects[index];
  }

  setAll(shape) {
    shape.foreach(pos => this.set(pos));
  }

  remove(pos) {
    const index = pos.index(this.width);
    const oldValue = this.objects[index];
    this.objects[index] = 0;
    return oldValue > 0;
  }

  clear() {
    this.objects.fill(0);
  }

  add(space) {
    for (let index = 0; index < this.width * this.width; ++index) {
      if (space.byIndex(index) > 0) {
        this.objects[index] = 1;
      }
    }
  }

}

exports.SetSpace = SetSpace;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const difference_1 = __webpack_require__(29);

const palettes_1 = __webpack_require__(2);

class WindowDecoration {
  constructor(rectangle, title, bottomCollapse = false) {
    this.rectangle = rectangle;
    this.title = title;
    this.bottomCollapse = bottomCollapse;
  }

  get topLeft() {
    return this.rectangle.topLeft;
  }

  get right() {
    return this.rectangle.right;
  }

  get bottom() {
    return this.rectangle.bottom;
  }

  get content() {
    return this.rectangle.shrink();
  }

  containsVector(vector) {
    return this.rectangle.containsVector(vector);
  }

  get width() {
    return this.rectangle.width;
  }

  render(renderer) {
    difference_1.Difference.innerBorder(this.rectangle).foreach(p => {
      if (p.y === this.rectangle.top || p.y === this.rectangle.bottom) {
        renderer.character('-', p, palettes_1.primary[1]);
      } else {
        renderer.character('|', p, palettes_1.primary[1]);
      }
    });
    const titleText = `/${this.title}/`;
    renderer.text(titleText, {
      x: this.rectangle.right - titleText.length,
      y: this.rectangle.top
    }, palettes_1.primary[1]);
  }

  update(_input) {}

}

exports.WindowDecoration = WindowDecoration;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const shape_1 = __webpack_require__(14);

class Difference extends shape_1.AbstractShape {
  constructor(baseShape, subtractionShape) {
    super();
    this.baseShape = baseShape;
    this.subtractionShape = subtractionShape;
  }

  static innerBorder(shape) {
    return new Difference(shape, shape.shrink());
  }

  bounds() {
    return this.baseShape.bounds();
  }

  containsVector(p) {
    return this.baseShape.containsVector(p) && !this.subtractionShape.containsVector(p);
  }

  grow(cells = 1) {
    return new Difference(this.baseShape.grow(cells), this.subtractionShape.grow(cells));
  }

  shrink(cells = 1) {
    return new Difference(this.baseShape.shrink(cells), this.subtractionShape.shrink(cells));
  }

  translate(t) {
    return new Difference(this.baseShape.translate(t), this.subtractionShape.translate(t));
  }

  all(f) {
    return this.bounds().all(p => {
      if (this.containsVector(p)) {
        return f(p);
      }

      return true;
    });
  }

}

exports.Difference = Difference;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const instantiate_item_1 = __webpack_require__(17);

function maximumInventoryWeight(stats) {
  return stats.current.strength * 5;
}

exports.maximumInventoryWeight = maximumInventoryWeight;

function createInventoryDescription(world, entity) {
  const inventory = world.getComponent(entity, 'inventory');
  const stats = world.getComponent(entity, 'character-stats');
  const equiped = world.getComponent(entity, 'equiped-items') || {
    equipment: []
  };
  let maximumWeight = undefined;

  if (stats !== undefined) {
    maximumWeight = maximumInventoryWeight(stats);
  }

  const inventoryItems = inventory.content.map(e => {
    const item = instantiate_item_1.instantiateItem(world, e);
    return {
      entity: e,
      item: item.item,
      mods: item.mods
    };
  });
  const currentWeight = inventoryItems.map(i => i.item.weight).reduce((a, b) => a + b, 0);
  return {
    inventory,
    items: inventoryItems,
    maximumWeight,
    currentWeight,
    equipment: equiped.equipment
  };
}

exports.createInventoryDescription = createInventoryDescription;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function getAim(world, entity) {
  if (hasEffect(world, entity, 'confuse')) {
    return 0;
  }

  const stats = world.getComponent(entity, 'character-stats');
  return stats.current.aim + reduceActiveEffects(world, entity, 'aim');
}

exports.getAim = getAim;

function getCriticalChance(world, entity) {
  return 3 + reduceActiveEffects(world, entity, 'crit-chance');
}

exports.getCriticalChance = getCriticalChance;

function getCooldownBuff(world, entity) {
  return reduceActiveEffects(world, entity, 'cooldown-buff');
}

exports.getCooldownBuff = getCooldownBuff;

function getCriticalMultiplier(world, entity) {
  return 2 + reduceActiveEffects(world, entity, 'crit-multiplier');
}

exports.getCriticalMultiplier = getCriticalMultiplier;

function getDefense(world, entity) {
  return reduceActiveEffects(world, entity, 'defense');
}

exports.getDefense = getDefense;

function getCanMove(world, entity) {
  if (hasEffect(world, entity, 'immobilize', 'stun')) {
    return false;
  }

  return !world.getComponent(entity, 'take-turn').moved;
}

exports.getCanMove = getCanMove;

function getCanAct(world, entity) {
  if (hasEffect(world, entity, 'stun')) {
    return false;
  }

  return !world.getComponent(entity, 'take-turn').acted;
}

exports.getCanAct = getCanAct;

function hasEffect(world, entity, ...types) {
  const active = world.getComponent(entity, 'active-effects');

  if (active !== undefined) {
    return active.effects.some(e => types.includes(e.effect.type));
  }

  return false;
}

exports.hasEffect = hasEffect;

function reduceActiveEffects(world, entity, type) {
  const active = world.getComponent(entity, 'active-effects');

  if (active !== undefined) {
    return active.effects.filter(e => e.effect.type === type).map(e => e.effect.value || 0).reduce((a, b) => a + b, 0);
  }

  return 0;
}

exports.reduceActiveEffects = reduceActiveEffects;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function findTriggers(world, level, shape) {
  const map = world.getResource('map');
  const seen = new Set();
  const triggers = [];
  shape.foreach(p => {
    const tile = map.levels[level].getTile(p);

    if (tile !== undefined) {
      registerTrigger(world, seen, tile, triggers);
    }

    const character = map.levels[level].getCharacter(p);

    if (character !== undefined) {
      registerTrigger(world, seen, character, triggers);
    }
  });
  return triggers;
}

exports.findTriggers = findTriggers;

function registerTrigger(world, seen, owner, triggers) {
  const entity = findTriggerOfEntity(world, owner);

  if (entity !== undefined && !seen.has(entity)) {
    seen.add(entity);
    const component = world.getComponent(entity, 'triggers');
    triggers.push({
      entity,
      component
    });
  }
}

function findTriggerOfEntity(world, entity) {
  if (world.getComponent(entity, 'triggers') !== undefined) {
    return entity;
  }

  const triggeredBy = world.getComponent(entity, 'triggered-by');

  if (triggeredBy !== undefined) {
    if (world.getComponent(triggeredBy.entity, 'triggers') !== undefined) {
      return triggeredBy.entity;
    }
  }

  return undefined;
}

exports.findTriggerOfEntity = findTriggerOfEntity;

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Term; });
/* harmony import */ var _backend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


function clearToAnsi(bg) {
    return `\x1b[0;48;5;${termcolor(bg)}m\x1b[2J`;
}
function colorToAnsi(fg, bg) {
    return `\x1b[0;38;5;${termcolor(fg)};48;5;${termcolor(bg)}m`;
}
function positionToAnsi(x, y) {
    return `\x1b[${y + 1};${x + 1}H`;
}
function termcolor(color) {
    const SRC_COLORS = 256.0;
    const DST_COLORS = 6.0;
    const COLOR_RATIO = DST_COLORS / SRC_COLORS;
    let rgb = _color_js__WEBPACK_IMPORTED_MODULE_1__["fromString"](color);
    let r = Math.floor(rgb[0] * COLOR_RATIO);
    let g = Math.floor(rgb[1] * COLOR_RATIO);
    let b = Math.floor(rgb[2] * COLOR_RATIO);
    return r * 36 + g * 6 + b * 1 + 16;
}
class Term extends _backend_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"] {
    constructor() {
        super();
        this._offset = [0, 0];
        this._cursor = [-1, -1];
        this._lastColor = "";
    }
    schedule(cb) { setTimeout(cb, 1000 / 60); }
    setOptions(options) {
        super.setOptions(options);
        let size = [options.width, options.height];
        let avail = this.computeSize();
        this._offset = avail.map((val, index) => Math.floor((val - size[index]) / 2));
    }
    clear() {
        process.stdout.write(clearToAnsi(this._options.bg));
    }
    draw(data, clearBefore) {
        // determine where to draw what with what colors
        let [x, y, ch, fg, bg] = data;
        // determine if we need to move the terminal cursor
        let dx = this._offset[0] + x;
        let dy = this._offset[1] + y;
        let size = this.computeSize();
        if (dx < 0 || dx >= size[0]) {
            return;
        }
        if (dy < 0 || dy >= size[1]) {
            return;
        }
        if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
            process.stdout.write(positionToAnsi(dx, dy));
            this._cursor[0] = dx;
            this._cursor[1] = dy;
        }
        // terminals automatically clear, but if we're clearing when we're
        // not otherwise provided with a character, just use a space instead
        if (clearBefore) {
            if (!ch) {
                ch = " ";
            }
        }
        // if we're not clearing and not provided with a character, do nothing
        if (!ch) {
            return;
        }
        // determine if we need to change colors
        let newColor = colorToAnsi(fg, bg);
        if (newColor !== this._lastColor) {
            process.stdout.write(newColor);
            this._lastColor = newColor;
        }
        // write the provided symbol to the display
        let chars = [].concat(ch);
        process.stdout.write(chars[0]);
        // update our position, given that we wrote a character
        this._cursor[0]++;
        if (this._cursor[0] >= size[0]) {
            this._cursor[0] = 0;
            this._cursor[1]++;
        }
    }
    computeFontSize() { throw new Error("Terminal backend has no notion of font size"); }
    eventToPosition(x, y) { return [x, y]; }
    computeSize() { return [process.stdout.columns, process.stdout.rows]; }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(61)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const rot = __importStar(__webpack_require__(50));

class Color {
  constructor(color) {
    this.color = color;
    this.rgb = undefined;
  }

  static fromHex(hex) {
    return new Color(rot.Color.fromString(hex));
  }

  toRgb() {
    if (this.rgb === undefined) {
      this.rgb = rot.Color.toRGB(this.color);
    }

    return this.rgb;
  }

  brightness() {
    return (this.color[0] + this.color[1] + this.color[2]) / 3;
  }

  add(other) {
    return new Color(rot.Color.add(this.color, other.color));
  }

  multiply(other) {
    return new Color(rot.Color.multiply(this.color, other.color));
  }

}

exports.Color = Color;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const items_1 = __webpack_require__(67);

const mods_1 = __webpack_require__(69);

function createEntityWithItemComponent(world, base, random, region) {
  const item = items_1.createItem(base, random, region);
  const mods = [];
  const passive = mods_1.getRandomMod(random, 'passive', item, region);

  if (passive) {
    mods.push(passive);
  }

  const active = mods_1.getRandomMod(random, 'active', item, region);

  if (active) {
    mods.push(active);
  }

  return world.createEntity().withComponent('item', {
    item,
    mods
  }).withComponent('active-effects', {
    effects: []
  }).entity;
}

exports.createEntityWithItemComponent = createEntityWithItemComponent;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const direction_1 = __webpack_require__(39);

function coveringDirections(from, to) {
  let cover = [];
  let closest = Number.MAX_VALUE;
  const fromFloor = new spatial_1.Vector([from.fX, from.fY]);
  const toFloor = new spatial_1.Vector([to.fX, to.fY]);
  direction_1.directions.forEach(direction => {
    const current = toFloor.add(spatial_1.Vector.fromDirection(direction));
    const distance = fromFloor.minus(current).squaredLength();

    if (closest > distance) {
      closest = distance;
      cover = [direction];
    } else if (closest === distance) {
      cover.push(direction);
    }
  });
  return cover;
}

exports.coveringDirections = coveringDirections;

function calculateCover(world, level, from, to) {
  const map = world.getResource('map').levels[level];
  const covers = coveringDirections(from, to);
  let bestCover = 'none';
  const toFloor = new spatial_1.Vector([to.fX, to.fY]);
  covers.forEach(direction => {
    const p = toFloor.add(spatial_1.Vector.fromDirection(direction));
    const tile = map.getTile(p);

    if (tile !== undefined) {
      const feature = world.getComponent(tile, 'feature');
      const currentCover = feature.feature().cover;

      if (bestCover === 'none' || bestCover === 'partial' && currentCover === 'full') {
        bestCover = currentCover;
      }
    }
  });
  return bestCover;
}

exports.calculateCover = calculateCover;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directions = ['up', 'right', 'down', 'left'];

function leftOf(direction) {
  switch (direction) {
    case 'up':
      return 'left';

    case 'right':
      return 'up';

    case 'down':
      return 'right';

    case 'left':
      return 'down';
  }
}

exports.leftOf = leftOf;

function rightOf(direction) {
  switch (direction) {
    case 'up':
      return 'right';

    case 'right':
      return 'down';

    case 'down':
      return 'left';

    case 'left':
      return 'up';
  }
}

exports.rightOf = rightOf;

function oppositeOf(direction) {
  switch (direction) {
    case 'up':
      return 'down';

    case 'right':
      return 'left';

    case 'down':
      return 'up';

    case 'left':
      return 'right';
  }
}

exports.oppositeOf = oppositeOf;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function consumeItem(world, consumer, item) {
  const inventory = world.getComponent(consumer, 'inventory');
  inventory.content = inventory.content.filter(i => i !== item);
}

exports.consumeItem = consumeItem;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const fighting_1 = __webpack_require__(86);

const turn_based_1 = __webpack_require__(21);

const region_1 = __webpack_require__(42);

function engage(world, ai, entity, interest, pushState) {
  const othersAlreadyFighting = turn_based_1.turnBasedEntities(world) > 0;
  ai.state = 'engaging';
  world.editEntity(entity).withComponent('wait-turn', {});

  if (!othersAlreadyFighting) {
    pushState(new fighting_1.Fighting());
  }

  const position = world.getComponent(entity, 'position');
  region_1.unauthorize(world, position, interest);
}

exports.engage = engage;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function isAuthorized(world, position, entity) {
  return getRegion(world, position).authorized.has(entity);
}

exports.isAuthorized = isAuthorized;

function authorize(world, position, entity) {
  getRegion(world, position).authorized.add(entity);
}

exports.authorize = authorize;

function unauthorize(world, position, entity) {
  getRegion(world, position).authorized.delete(entity);
}

exports.unauthorize = unauthorize;

function getRegion(world, position) {
  const map = world.getResource('map');
  const structure = map.levels[position.level].getStructure(position.position);
  const room = world.getComponent(structure, 'structure');
  return world.getComponent(room.region, 'region');
}

exports.getRegion = getRegion;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function move(world, entity, level, position) {
  const l = world.getResource('map').levels[level];

  if (l !== undefined && !l.isBlocking(world, position, entity)) {
    const oldPosition = world.getComponent(entity, 'position');
    l.removeCharacter(oldPosition.position);
    l.setCharacter(position, entity);
    world.editEntity(entity).withComponent('position', {
      level,
      position
    });
  }
}

exports.move = move;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const logic_solver_1 = __webpack_require__(91);

const array_utils_1 = __webpack_require__(7);

const retry_1 = __webpack_require__(46);

const splitter = '_';

function occur(min = 1, max) {
  const maximum = max === undefined ? min : max;
  return {
    minimum: min,
    maximum
  };
}

exports.occur = occur;

function optional(t = 1) {
  return {
    minimum: 0,
    maximum: t
  };
}

exports.optional = optional;

function layout(kind, placement, occurrence, ...types) {
  return {
    kind,
    types,
    occurrence,
    placement
  };
}

exports.layout = layout;

function embedComplexes(world, random, region, complexes) {
  if (complexes.length === 0) {
    return [];
  }

  const G = buildG(world, region, []);
  const requiredComplexes = complexes.filter(c => c.occurrence.minimum > 0).map(c => ({
    occurrence: occur(c.occurrence.minimum),
    template: c.template
  }));
  const H = buildH(requiredComplexes);
  const successfulEmbeddings = calculateEmbedding(G, H);

  if (successfulEmbeddings.length === 0) {
    return undefined;
  }

  const optionalComplexes = [];
  complexes.forEach(c => {
    for (let i = 0; i < c.occurrence.maximum - c.occurrence.minimum; ++i) {
      optionalComplexes.push({
        occurrence: occur(),
        template: c.template
      });
    }
  });
  retry_1.retry(random, optionalComplexes, c => {
    const newG = buildG(world, region, successfulEmbeddings);
    const embedding = calculateEmbedding(newG, buildH([c]));

    if (embedding.length === 1) {
      successfulEmbeddings.push(embedding[0]);
    }

    return embedding.length === 1;
  });
  return successfulEmbeddings;
}

exports.embedComplexes = embedComplexes;

function buildG(world, region, knownEmbeddings) {
  const blocked = new Set(knownEmbeddings.filter(e => e.blocking).map(e => e.embedding));
  const availableStructures = [];
  const availableStructuresLookup = new Map();
  world.getStorage('structure').foreach((entity, component) => {
    if (component.region === region) {
      availableStructuresLookup.set(entity, availableStructures.length);
      availableStructures.push(entity);
    }
  });
  const V = array_utils_1.indices(availableStructures.length);
  const E = [];
  const labels = [];
  availableStructures.forEach((s, v) => {
    const structure = world.getComponent(s, 'structure');
    labels[v] = new Set();
    labels[v].add(structure.kind);

    if (blocked.has(s)) {
      labels[v].add('blocked');
    }

    structure.connections.forEach(c => {
      const w = availableStructuresLookup.get(c);
      const e = createEdge(v, w);

      if (e !== undefined) {
        E.push(e);
      }
    });
  });
  return {
    V,
    E,
    labels,
    getData: v => availableStructures[v]
  };
}

function buildH(complexes) {
  const E = [];
  const requiredFlattenedStructures = [];
  const labels = [];
  complexes.forEach(c => {
    array_utils_1.indices(c.occurrence.minimum).forEach(() => {
      const offset = requiredFlattenedStructures.length;
      c.template.structures.forEach((s, index) => {
        const v = offset + index;
        labels[v] = new Set();

        if (s.restriction.blocking === undefined || s.restriction.blocking) {
          labels[v].add('blocking');
        }

        if (s.restriction.exact) {
          labels[v].add('exact');
        }

        if (s.restriction.kind) {
          labels[v].add('restricted');
          labels[v].add(s.restriction.kind);
        }

        const restrictions = s.restriction.connects || [];
        restrictions.forEach(i => {
          const w = offset + i;
          const e = createEdge(v, w);

          if (e !== undefined) {
            E.push(e);
          }
        });
        requiredFlattenedStructures.push(s.description);
      });
    });
  });
  const V = array_utils_1.indices(requiredFlattenedStructures.length);
  return {
    V,
    E,
    labels,
    getData: v => requiredFlattenedStructures[v]
  };
}

function createEdge(v, w) {
  if (v < w) {
    return [v, w];
  }

  return undefined;
}

function calculateEmbedding(G, H) {
  var solver = new logic_solver_1.Solver();
  H.V.forEach(w => {
    const Cvw = G.V.map(v => createLabel(v, w));

    solver.require(logic_solver_1.exactlyOne(...Cvw));
  });
  G.V.forEach(v => {
    const Cvw = H.V.filter(w => H.labels[w].has('blocking')).map(w => createLabel(v, w));

    solver.require(logic_solver_1.atMostOne(...Cvw));
  });
  H.V.forEach(w => {
    G.V.forEach(v => {
      const Cvw = createLabel(v, w);
      H.E.forEach(e => {
        const j = traverseEdge(e, w);

        if (j !== undefined) {
          const Cij = [];
          G.E.forEach(f => {
            const i = traverseEdge(f, v);

            if (i !== undefined) {
              Cij.push(createLabel(i, j));
            }
          });

          solver.require(logic_solver_1.or(logic_solver_1.not(Cvw), ...Cij));
        }
      });
    });
  });
  H.V.forEach(w => {
    G.V.forEach(v => {
      const Cvw = createLabel(v, w);
      let kindsAreDifferent = false;
      G.labels[v].forEach(l => {
        if (!H.labels[w].has(l)) {
          kindsAreDifferent = true;
        }
      });
      const isRestricted = H.labels[w].has('restricted');
      const isExact = H.labels[w].has('exact');
      const isBlocked = G.labels[v].has('blocked');

      if (kindsAreDifferent && isRestricted) {
        solver.require(logic_solver_1.not(Cvw));
      } else if (isBlocked) {
        solver.require(logic_solver_1.not(Cvw));
      } else if (isExact) {
        G.E.forEach(f => {
          const i = traverseEdge(f, v);

          if (i !== undefined) {
            const Cij = [];
            H.E.forEach(e => {
              const j = traverseEdge(e, w);

              if (j !== undefined) {
                Cij.push(createLabel(i, j));
              }
            });

            solver.require(logic_solver_1.or(logic_solver_1.not(Cvw), ...Cij));
          }
        });
      }
    });
  });
  const solution = solver.solve();
  const result = [];

  if (solution !== null) {
    solution.getTrueVars().forEach(label => {
      const [v, w] = parseLabel(label);
      result.push({
        structure: H.getData(w),
        embedding: G.getData(v),
        blocking: H.labels[w].has('blocking')
      });
    });
  }

  return result;
}

function parseLabel(label) {
  const splits = label.split(splitter);
  return [Number.parseInt(splits[0]), Number.parseInt(splits[1])];
}

function createLabel(v, w) {
  return `${v}${splitter}${w}`;
}

function traverseEdge(e, from) {
  if (e[0] === from) {
    return e[1];
  } else if (e[1] === from) {
    return e[0];
  }

  return undefined;
}

exports.traverseEdge = traverseEdge;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if ( true && !exports.nodeType) {
    if ( true && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(35), __webpack_require__(36)(module)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const array_utils_1 = __webpack_require__(7);

function retry(random, arr, f) {
  let tries = 5;

  while (arr.length > 0 && tries > 0) {
    const index = random.pickIndex(arr);

    if (f(arr[index])) {
      array_utils_1.dropAt(arr, index);
      tries = 5;
    } else {
      tries--;
    }
  }
}

exports.retry = retry;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(__webpack_require__(98));

__export(__webpack_require__(99));

__export(__webpack_require__(100));

__export(__webpack_require__(101));

__export(__webpack_require__(102));

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const instantiate_item_1 = __webpack_require__(17);

const stats_1 = __webpack_require__(31);

const actions_1 = __webpack_require__(25);

const functional_shape_1 = __webpack_require__(20);

const trigger_1 = __webpack_require__(32);

function calculateAvailableActions(world, entity, withConsumables) {
  const canAct = stats_1.getCanAct(world, entity);
  const canMove = stats_1.getCanMove(world, entity);
  const cooldownBuff = stats_1.getCooldownBuff(world, entity);
  const playerActions = buildPlayerSelectableActions(entity, canMove, canAct);
  const triggerActions = buildTriggerActions(world, entity);
  const equipmentSelectableActions = buildEquipmentSelectableActions(world, entity, canMove, canAct, cooldownBuff);
  let consumableActions = [];

  if (withConsumables) {
    consumableActions = buildConsumableSelectableActions(world, entity, canMove, canAct);
  }

  return playerActions.concat(equipmentSelectableActions).concat(consumableActions).concat(triggerActions);
}

exports.calculateAvailableActions = calculateAvailableActions;

function buildTriggerActions(world, entity) {
  const position = world.getComponent(entity, 'position');
  const neighbourhood = functional_shape_1.FunctionalShape.lN(position.position, 1, true);
  const triggers = trigger_1.findTriggers(world, position.level, neighbourhood);
  return triggers.filter(t => t.component.inTurnBased).map(t => ({
    owner: t.component.name,
    action: actions_1.createAction('trigger'),
    entity: t.entity
  }));
}

function buildPlayerSelectableActions(entity, canMove, canAct) {
  const defaultActions = ['move', 'hit', 'rush', 'noMove', 'endTurn', 'changeEquipment'];
  return defaultActions.map(a => actions_1.createAction(a)).filter(action => actionAvailable(action, canMove, canAct)).map(action => ({
    action,
    entity
  }));
}

function buildEquipmentSelectableActions(world, entity, canMove, canAct, cooldownBuff) {
  const equipment = world.getComponent(entity, 'equiped-items');
  const actions = [];
  equipment.equipment.forEach(equiped => {
    const {
      item
    } = instantiate_item_1.instantiateItem(world, equiped.entity);
    item.actions.forEach(action => {
      if (actionAvailable(action, canMove, canAct)) {
        if (action.cooldown !== undefined) {
          action.cooldown -= cooldownBuff;
        }

        actions.push({
          action,
          owner: item.shortName,
          entity: equiped.entity
        });
      }
    });
  });
  return actions;
}

function buildConsumableSelectableActions(world, entity, canMove, canAct) {
  const inventory = world.getComponent(entity, 'inventory');
  return inventory.content.map(inventoryContent => {
    const {
      item
    } = instantiate_item_1.instantiateItem(world, inventoryContent);

    if (item.kind === 'consumable' && item.actions.length > 0 && actionAvailable(item.actions[0], canMove, canAct)) {
      return {
        action: item.actions[0],
        owner: item.shortName,
        entity: inventoryContent
      };
    }

    return undefined;
  }).filter(a => a !== undefined);
}

function actionAvailable(action, canMove, canAct) {
  switch (action.cost) {
    case 'all':
      return canAct && canMove;

    case 'action':
      return canAct && !canMove;

    case 'movement':
      return canMove;

    default:
      return true;
  }
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const calculate_hit_chance_1 = __webpack_require__(105);

const apply_effect_1 = __webpack_require__(11);

function attackTarget(world, random, entity, target, attack) {
  const chance = calculate_hit_chance_1.calculateHitChance(world, entity, target, attack);
  const isHit = random.decision(chance.final);
  const isCritical = isHit && random.decision(chance.criticalHit);
  let effects = [];

  if (isHit) {
    effects = attack.effects.map(effect => apply_effect_1.applyEffect(world, random, target, {
      source: entity,
      effect,
      isCritical,
      isPiercing: false
    }));
    apply_effect_1.clearExpiredEffects(world, target);
  }

  const result = {
    isHit,
    isCritical,
    chance,
    effects
  };
  const log = world.getResource('log');
  log.attack(world, entity, target, result);
  return result;
}

exports.attackTarget = attackTarget;

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "RNG", function() { return /* reexport */ rng["a" /* default */]; });
__webpack_require__.d(__webpack_exports__, "Display", function() { return /* reexport */ display_Display; });
__webpack_require__.d(__webpack_exports__, "StringGenerator", function() { return /* reexport */ stringgenerator_StringGenerator; });
__webpack_require__.d(__webpack_exports__, "EventQueue", function() { return /* reexport */ EventQueue; });
__webpack_require__.d(__webpack_exports__, "Scheduler", function() { return /* reexport */ scheduler; });
__webpack_require__.d(__webpack_exports__, "FOV", function() { return /* reexport */ fov; });
__webpack_require__.d(__webpack_exports__, "Map", function() { return /* reexport */ lib_map; });
__webpack_require__.d(__webpack_exports__, "Noise", function() { return /* reexport */ noise; });
__webpack_require__.d(__webpack_exports__, "Path", function() { return /* reexport */ path; });
__webpack_require__.d(__webpack_exports__, "Engine", function() { return /* reexport */ Engine; });
__webpack_require__.d(__webpack_exports__, "Lighting", function() { return /* reexport */ lighting_Lighting; });
__webpack_require__.d(__webpack_exports__, "DEFAULT_WIDTH", function() { return /* reexport */ DEFAULT_WIDTH; });
__webpack_require__.d(__webpack_exports__, "DEFAULT_HEIGHT", function() { return /* reexport */ DEFAULT_HEIGHT; });
__webpack_require__.d(__webpack_exports__, "DIRS", function() { return /* reexport */ DIRS; });
__webpack_require__.d(__webpack_exports__, "KEYS", function() { return /* reexport */ KEYS; });
__webpack_require__.d(__webpack_exports__, "Util", function() { return /* binding */ Util; });
__webpack_require__.d(__webpack_exports__, "Color", function() { return /* binding */ Color; });
__webpack_require__.d(__webpack_exports__, "Text", function() { return /* binding */ Text; });

// NAMESPACE OBJECT: ./node_modules/rot-js/lib/text.js
var text_namespaceObject = {};
__webpack_require__.r(text_namespaceObject);
__webpack_require__.d(text_namespaceObject, "TYPE_TEXT", function() { return TYPE_TEXT; });
__webpack_require__.d(text_namespaceObject, "TYPE_NEWLINE", function() { return TYPE_NEWLINE; });
__webpack_require__.d(text_namespaceObject, "TYPE_FG", function() { return TYPE_FG; });
__webpack_require__.d(text_namespaceObject, "TYPE_BG", function() { return TYPE_BG; });
__webpack_require__.d(text_namespaceObject, "measure", function() { return measure; });
__webpack_require__.d(text_namespaceObject, "tokenize", function() { return tokenize; });

// EXTERNAL MODULE: ./node_modules/rot-js/lib/rng.js
var rng = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/rot-js/lib/display/backend.js
var backend = __webpack_require__(9);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/canvas.js

class canvas_Canvas extends backend["a" /* default */] {
    constructor() {
        super();
        this._ctx = document.createElement("canvas").getContext("2d");
    }
    schedule(cb) { requestAnimationFrame(cb); }
    getContainer() { return this._ctx.canvas; }
    setOptions(opts) {
        super.setOptions(opts);
        const style = (opts.fontStyle ? `${opts.fontStyle} ` : ``);
        const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
        this._ctx.font = font;
        this._updateSize();
        this._ctx.font = font;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
    }
    clear() {
        this._ctx.fillStyle = this._options.bg;
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }
    eventToPosition(x, y) {
        let canvas = this._ctx.canvas;
        let rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [-1, -1];
        }
        return this._normalizedEventToPosition(x, y);
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/util.js
var util = __webpack_require__(4);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/hex.js


/**
 * @class Hexagonal backend
 * @private
 */
class hex_Hex extends canvas_Canvas {
    constructor() {
        super();
        this._spacingX = 0;
        this._spacingY = 0;
        this._hexSize = 0;
    }
    draw(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let px = [
            (x + 1) * this._spacingX,
            y * this._spacingY + this._hexSize
        ];
        if (this._options.transpose) {
            px.reverse();
        }
        if (clearBefore) {
            this._ctx.fillStyle = bg;
            this._fill(px[0], px[1]);
        }
        if (!ch) {
            return;
        }
        this._ctx.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._ctx.fillText(chars[i], px[0], Math.ceil(px[1]));
        }
    }
    computeSize(availWidth, availHeight) {
        if (this._options.transpose) {
            availWidth += availHeight;
            availHeight = availWidth - availHeight;
            availWidth -= availHeight;
        }
        let width = Math.floor(availWidth / this._spacingX) - 1;
        let height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        if (this._options.transpose) {
            availWidth += availHeight;
            availHeight = availWidth - availHeight;
            availWidth -= availHeight;
        }
        let hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
        let hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
        let hexSize = Math.min(hexSizeWidth, hexSizeHeight);
        // compute char ratio
        let oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        let ratio = width / 100;
        hexSize = Math.floor(hexSize) + 1; // closest larger hexSize
        // FIXME char size computation does not respect transposed hexes
        let fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
        // closest smaller fontSize
        return Math.ceil(fontSize) - 1;
    }
    _normalizedEventToPosition(x, y) {
        let nodeSize;
        if (this._options.transpose) {
            x += y;
            y = x - y;
            x -= y;
            nodeSize = this._ctx.canvas.width;
        }
        else {
            nodeSize = this._ctx.canvas.height;
        }
        let size = nodeSize / this._options.height;
        y = Math.floor(y / size);
        if (Object(util["mod"])(y, 2)) { /* odd row */
            x -= this._spacingX;
            x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
        }
        else {
            x = 2 * Math.floor(x / (2 * this._spacingX));
        }
        return [x, y];
    }
    /**
     * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
     */
    _fill(cx, cy) {
        let a = this._hexSize;
        let b = this._options.border;
        const ctx = this._ctx;
        ctx.beginPath();
        if (this._options.transpose) {
            ctx.moveTo(cx - a + b, cy);
            ctx.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
            ctx.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
            ctx.lineTo(cx + a - b, cy);
            ctx.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
            ctx.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
            ctx.lineTo(cx - a + b, cy);
        }
        else {
            ctx.moveTo(cx, cy - a + b);
            ctx.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
            ctx.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
            ctx.lineTo(cx, cy + a - b);
            ctx.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
            ctx.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
            ctx.lineTo(cx, cy - a + b);
        }
        ctx.fill();
    }
    _updateSize() {
        const opts = this._options;
        const charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._hexSize = Math.floor(opts.spacing * (opts.fontSize + charWidth / Math.sqrt(3)) / 2);
        this._spacingX = this._hexSize * Math.sqrt(3) / 2;
        this._spacingY = this._hexSize * 1.5;
        let xprop;
        let yprop;
        if (opts.transpose) {
            xprop = "height";
            yprop = "width";
        }
        else {
            xprop = "width";
            yprop = "height";
        }
        this._ctx.canvas[xprop] = Math.ceil((opts.width + 1) * this._spacingX);
        this._ctx.canvas[yprop] = Math.ceil((opts.height - 1) * this._spacingY + 2 * this._hexSize);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/rect.js

/**
 * @class Rectangular backend
 * @private
 */
class rect_Rect extends canvas_Canvas {
    constructor() {
        super();
        this._spacingX = 0;
        this._spacingY = 0;
        this._canvasCache = {};
    }
    setOptions(options) {
        super.setOptions(options);
        this._canvasCache = {};
    }
    draw(data, clearBefore) {
        if (rect_Rect.cache) {
            this._drawWithCache(data);
        }
        else {
            this._drawNoCache(data, clearBefore);
        }
    }
    _drawWithCache(data) {
        let [x, y, ch, fg, bg] = data;
        let hash = "" + ch + fg + bg;
        let canvas;
        if (hash in this._canvasCache) {
            canvas = this._canvasCache[hash];
        }
        else {
            let b = this._options.border;
            canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = this._spacingX;
            canvas.height = this._spacingY;
            ctx.fillStyle = bg;
            ctx.fillRect(b, b, canvas.width - b, canvas.height - b);
            if (ch) {
                ctx.fillStyle = fg;
                ctx.font = this._ctx.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let chars = [].concat(ch);
                for (let i = 0; i < chars.length; i++) {
                    ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
                }
            }
            this._canvasCache[hash] = canvas;
        }
        this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
    }
    _drawNoCache(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        if (clearBefore) {
            let b = this._options.border;
            this._ctx.fillStyle = bg;
            this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
        }
        if (!ch) {
            return;
        }
        this._ctx.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._ctx.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._spacingX);
        let height = Math.floor(availHeight / this._spacingY);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        let boxWidth = Math.floor(availWidth / this._options.width);
        let boxHeight = Math.floor(availHeight / this._options.height);
        /* compute char ratio */
        let oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        let ratio = width / 100;
        let widthFraction = ratio * boxHeight / boxWidth;
        if (widthFraction > 1) { /* too wide with current aspect ratio */
            boxHeight = Math.floor(boxHeight / widthFraction);
        }
        return Math.floor(boxHeight / this._options.spacing);
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
    }
    _updateSize() {
        const opts = this._options;
        const charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._spacingX = Math.ceil(opts.spacing * charWidth);
        this._spacingY = Math.ceil(opts.spacing * opts.fontSize);
        if (opts.forceSquareRatio) {
            this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
        }
        this._ctx.canvas.width = opts.width * this._spacingX;
        this._ctx.canvas.height = opts.height * this._spacingY;
    }
}
rect_Rect.cache = false;

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/tile.js

/**
 * @class Tile backend
 * @private
 */
class tile_Tile extends canvas_Canvas {
    constructor() {
        super();
        this._colorCanvas = document.createElement("canvas");
    }
    draw(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let tileWidth = this._options.tileWidth;
        let tileHeight = this._options.tileHeight;
        if (clearBefore) {
            if (this._options.tileColorize) {
                this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else {
                this._ctx.fillStyle = bg;
                this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
        if (!ch) {
            return;
        }
        let chars = [].concat(ch);
        let fgs = [].concat(fg);
        let bgs = [].concat(bg);
        for (let i = 0; i < chars.length; i++) {
            let tile = this._options.tileMap[chars[i]];
            if (!tile) {
                throw new Error(`Char "${chars[i]}" not found in tileMap`);
            }
            if (this._options.tileColorize) { // apply colorization
                let canvas = this._colorCanvas;
                let context = canvas.getContext("2d");
                context.globalCompositeOperation = "source-over";
                context.clearRect(0, 0, tileWidth, tileHeight);
                let fg = fgs[i];
                let bg = bgs[i];
                context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                if (fg != "transparent") {
                    context.fillStyle = fg;
                    context.globalCompositeOperation = "source-atop";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                if (bg != "transparent") {
                    context.fillStyle = bg;
                    context.globalCompositeOperation = "destination-over";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else { // no colorizing, easy
                this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.tileWidth);
        let height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
    }
    computeFontSize() {
        throw new Error("Tile backend does not understand font size");
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    }
    _updateSize() {
        const opts = this._options;
        this._ctx.canvas.width = opts.width * opts.tileWidth;
        this._ctx.canvas.height = opts.height * opts.tileHeight;
        this._colorCanvas.width = opts.tileWidth;
        this._colorCanvas.height = opts.tileHeight;
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/color.js
var lib_color = __webpack_require__(6);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/tile-gl.js


/**
 * @class Tile backend
 * @private
 */
class tile_gl_TileGL extends backend["a" /* default */] {
    static isSupported() {
        return !!document.createElement("canvas").getContext("webgl2", { preserveDrawingBuffer: true });
    }
    constructor() {
        super();
        this._uniforms = {};
        try {
            this._gl = this._initWebGL();
        }
        catch (e) {
            alert(e.message);
        }
    }
    schedule(cb) { requestAnimationFrame(cb); }
    getContainer() { return this._gl.canvas; }
    setOptions(opts) {
        super.setOptions(opts);
        this._updateSize();
        let tileSet = this._options.tileSet;
        if (tileSet && "complete" in tileSet && !tileSet.complete) {
            tileSet.addEventListener("load", () => this._updateTexture(tileSet));
        }
        else {
            this._updateTexture(tileSet);
        }
    }
    draw(data, clearBefore) {
        const gl = this._gl;
        const opts = this._options;
        let [x, y, ch, fg, bg] = data;
        let scissorY = gl.canvas.height - (y + 1) * opts.tileHeight;
        gl.scissor(x * opts.tileWidth, scissorY, opts.tileWidth, opts.tileHeight);
        if (clearBefore) {
            if (opts.tileColorize) {
                gl.clearColor(0, 0, 0, 0);
            }
            else {
                gl.clearColor(...parseColor(bg));
            }
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        if (!ch) {
            return;
        }
        let chars = [].concat(ch);
        let bgs = [].concat(bg);
        let fgs = [].concat(fg);
        gl.uniform2fv(this._uniforms["targetPosRel"], [x, y]);
        for (let i = 0; i < chars.length; i++) {
            let tile = this._options.tileMap[chars[i]];
            if (!tile) {
                throw new Error(`Char "${chars[i]}" not found in tileMap`);
            }
            gl.uniform1f(this._uniforms["colorize"], opts.tileColorize ? 1 : 0);
            gl.uniform2fv(this._uniforms["tilesetPosAbs"], tile);
            if (opts.tileColorize) {
                gl.uniform4fv(this._uniforms["tint"], parseColor(fgs[i]));
                gl.uniform4fv(this._uniforms["bg"], parseColor(bgs[i]));
            }
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        /*
        
        
                for (let i=0;i<chars.length;i++) {
                    
                    if (this._options.tileColorize) { // apply colorization
                        let canvas = this._colorCanvas;
                        let context = canvas.getContext("2d") as CanvasRenderingContext2D;
                        context.globalCompositeOperation = "source-over";
                        context.clearRect(0, 0, tileWidth, tileHeight);
        
                        let fg = fgs[i];
                        let bg = bgs[i];
        
                        context.drawImage(
                            this._options.tileSet!,
                            tile[0], tile[1], tileWidth, tileHeight,
                            0, 0, tileWidth, tileHeight
                        );
        
                        if (fg != "transparent") {
                            context.fillStyle = fg;
                            context.globalCompositeOperation = "source-atop";
                            context.fillRect(0, 0, tileWidth, tileHeight);
                        }
        
                        if (bg != "transparent") {
                            context.fillStyle = bg;
                            context.globalCompositeOperation = "destination-over";
                            context.fillRect(0, 0, tileWidth, tileHeight);
                        }
        
                        this._ctx.drawImage(canvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
                    } else { // no colorizing, easy
                        this._ctx.drawImage(
                            this._options.tileSet!,
                            tile[0], tile[1], tileWidth, tileHeight,
                            x*tileWidth, y*tileHeight, tileWidth, tileHeight
                        );
                    }
                }
        
        */
    }
    clear() {
        const gl = this._gl;
        gl.clearColor(...parseColor(this._options.bg));
        gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.tileWidth);
        let height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
    }
    computeFontSize() {
        throw new Error("Tile backend does not understand font size");
    }
    eventToPosition(x, y) {
        let canvas = this._gl.canvas;
        let rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [-1, -1];
        }
        return this._normalizedEventToPosition(x, y);
    }
    _initWebGL() {
        let gl = document.createElement("canvas").getContext("webgl2", { preserveDrawingBuffer: true });
        window.gl = gl;
        let program = createProgram(gl, VS, FS);
        gl.useProgram(program);
        createQuad(gl);
        UNIFORMS.forEach(name => this._uniforms[name] = gl.getUniformLocation(program, name));
        this._program = program;
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.SCISSOR_TEST);
        return gl;
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    }
    _updateSize() {
        const gl = this._gl;
        const opts = this._options;
        const canvasSize = [opts.width * opts.tileWidth, opts.height * opts.tileHeight];
        gl.canvas.width = canvasSize[0];
        gl.canvas.height = canvasSize[1];
        gl.viewport(0, 0, canvasSize[0], canvasSize[1]);
        gl.uniform2fv(this._uniforms["tileSize"], [opts.tileWidth, opts.tileHeight]);
        gl.uniform2fv(this._uniforms["targetSize"], canvasSize);
    }
    _updateTexture(tileSet) {
        createTexture(this._gl, tileSet);
    }
}
const UNIFORMS = ["targetPosRel", "tilesetPosAbs", "tileSize", "targetSize", "colorize", "bg", "tint"];
const VS = `
#version 300 es

in vec2 tilePosRel;
out vec2 tilesetPosPx;

uniform vec2 tilesetPosAbs;
uniform vec2 tileSize;
uniform vec2 targetSize;
uniform vec2 targetPosRel;

void main() {
	vec2 targetPosPx = (targetPosRel + tilePosRel) * tileSize;
	vec2 targetPosNdc = ((targetPosPx / targetSize)-0.5)*2.0;
	targetPosNdc.y *= -1.0;

	gl_Position = vec4(targetPosNdc, 0.0, 1.0);
	tilesetPosPx = tilesetPosAbs + tilePosRel * tileSize;
}`.trim();
const FS = `
#version 300 es
precision highp float;

in vec2 tilesetPosPx;
out vec4 fragColor;
uniform sampler2D image;
uniform bool colorize;
uniform vec4 bg;
uniform vec4 tint;

void main() {
	fragColor = vec4(0, 0, 0, 1);

	vec4 texel = texelFetch(image, ivec2(tilesetPosPx), 0);

	if (colorize) {
		texel.rgb = tint.a * tint.rgb + (1.0-tint.a) * texel.rgb;
		fragColor.rgb = texel.a*texel.rgb + (1.0-texel.a)*bg.rgb;
		fragColor.a = texel.a + (1.0-texel.a)*bg.a;
	} else {
		fragColor = texel;
	}
}`.trim();
function createProgram(gl, vss, fss) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vss);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vs) || "");
    }
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fss);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fs) || "");
    }
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p) || "");
    }
    return p;
}
function createQuad(gl) {
    const pos = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}
function createTexture(gl, data) {
    let t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return t;
}
let colorCache = {};
function parseColor(color) {
    if (!(color in colorCache)) {
        let parsed;
        if (color == "transparent") {
            parsed = [0, 0, 0, 0];
        }
        else if (color.indexOf("rgba") > -1) {
            parsed = (color.match(/[\d.]+/g) || []).map(Number);
            for (let i = 0; i < 3; i++) {
                parsed[i] = parsed[i] / 255;
            }
        }
        else {
            parsed = lib_color["fromString"](color).map($ => $ / 255);
            parsed.push(1);
        }
        colorCache[color] = parsed;
    }
    return colorCache[color];
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/display/term.js
var term = __webpack_require__(33);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/text.js
/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
const RE_COLORS = /%([bc]){([^}]*)}/g;
// token types
const TYPE_TEXT = 0;
const TYPE_NEWLINE = 1;
const TYPE_FG = 2;
const TYPE_BG = 3;
/**
 * Measure size of a resulting text block
 */
function measure(str, maxWidth) {
    let result = { width: 0, height: 1 };
    let tokens = tokenize(str, maxWidth);
    let lineWidth = 0;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token.type) {
            case TYPE_TEXT:
                lineWidth += token.value.length;
                break;
            case TYPE_NEWLINE:
                result.height++;
                result.width = Math.max(result.width, lineWidth);
                lineWidth = 0;
                break;
        }
    }
    result.width = Math.max(result.width, lineWidth);
    return result;
}
/**
 * Convert string to a series of a formatting commands
 */
function tokenize(str, maxWidth) {
    let result = [];
    /* first tokenization pass - split texts and color formatting commands */
    let offset = 0;
    str.replace(RE_COLORS, function (match, type, name, index) {
        /* string before */
        let part = str.substring(offset, index);
        if (part.length) {
            result.push({
                type: TYPE_TEXT,
                value: part
            });
        }
        /* color command */
        result.push({
            type: (type == "c" ? TYPE_FG : TYPE_BG),
            value: name.trim()
        });
        offset = index + match.length;
        return "";
    });
    /* last remaining part */
    let part = str.substring(offset);
    if (part.length) {
        result.push({
            type: TYPE_TEXT,
            value: part
        });
    }
    return breakLines(result, maxWidth);
}
/* insert line breaks into first-pass tokenized data */
function breakLines(tokens, maxWidth) {
    if (!maxWidth) {
        maxWidth = Infinity;
    }
    let i = 0;
    let lineLength = 0;
    let lastTokenWithSpace = -1;
    while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
        let token = tokens[i];
        if (token.type == TYPE_NEWLINE) { /* reset */
            lineLength = 0;
            lastTokenWithSpace = -1;
        }
        if (token.type != TYPE_TEXT) { /* skip non-text tokens */
            i++;
            continue;
        }
        /* remove spaces at the beginning of line */
        while (lineLength == 0 && token.value.charAt(0) == " ") {
            token.value = token.value.substring(1);
        }
        /* forced newline? insert two new tokens after this one */
        let index = token.value.indexOf("\n");
        if (index != -1) {
            token.value = breakInsideToken(tokens, i, index, true);
            /* if there are spaces at the end, we must remove them (we do not want the line too long) */
            let arr = token.value.split("");
            while (arr.length && arr[arr.length - 1] == " ") {
                arr.pop();
            }
            token.value = arr.join("");
        }
        /* token degenerated? */
        if (!token.value.length) {
            tokens.splice(i, 1);
            continue;
        }
        if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */
            /* is it possible to break within this token? */
            let index = -1;
            while (1) {
                let nextIndex = token.value.indexOf(" ", index + 1);
                if (nextIndex == -1) {
                    break;
                }
                if (lineLength + nextIndex > maxWidth) {
                    break;
                }
                index = nextIndex;
            }
            if (index != -1) { /* break at space within this one */
                token.value = breakInsideToken(tokens, i, index, true);
            }
            else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
                let token = tokens[lastTokenWithSpace];
                let breakIndex = token.value.lastIndexOf(" ");
                token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
                i = lastTokenWithSpace;
            }
            else { /* force break in this token */
                token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
            }
        }
        else { /* line not long, continue */
            lineLength += token.value.length;
            if (token.value.indexOf(" ") != -1) {
                lastTokenWithSpace = i;
            }
        }
        i++; /* advance to next token */
    }
    tokens.push({ type: TYPE_NEWLINE }); /* insert fake newline to fix the last text line */
    /* remove trailing space from text tokens before newlines */
    let lastTextToken = null;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token.type) {
            case TYPE_TEXT:
                lastTextToken = token;
                break;
            case TYPE_NEWLINE:
                if (lastTextToken) { /* remove trailing space */
                    let arr = lastTextToken.value.split("");
                    while (arr.length && arr[arr.length - 1] == " ") {
                        arr.pop();
                    }
                    lastTextToken.value = arr.join("");
                }
                lastTextToken = null;
                break;
        }
    }
    tokens.pop(); /* remove fake token */
    return tokens;
}
/**
 * Create new tokens and insert them into the stream
 * @param {object[]} tokens
 * @param {int} tokenIndex Token being processed
 * @param {int} breakIndex Index within current token's value
 * @param {bool} removeBreakChar Do we want to remove the breaking character?
 * @returns {string} remaining unbroken token value
 */
function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
    let newBreakToken = {
        type: TYPE_NEWLINE
    };
    let newTextToken = {
        type: TYPE_TEXT,
        value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
    };
    tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
    return tokens[tokenIndex].value.substring(0, breakIndex);
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/constants.js
/** Default with for display and map generators */
let DEFAULT_WIDTH = 80;
/** Default height for display and map generators */
let DEFAULT_HEIGHT = 25;
const DIRS = {
    4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
};
const KEYS = {
    /** Cancel key. */
    VK_CANCEL: 3,
    /** Help key. */
    VK_HELP: 6,
    /** Backspace key. */
    VK_BACK_SPACE: 8,
    /** Tab key. */
    VK_TAB: 9,
    /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
    VK_CLEAR: 12,
    /** Return/enter key on the main keyboard. */
    VK_RETURN: 13,
    /** Reserved, but not used. */
    VK_ENTER: 14,
    /** Shift key. */
    VK_SHIFT: 16,
    /** Control key. */
    VK_CONTROL: 17,
    /** Alt (Option on Mac) key. */
    VK_ALT: 18,
    /** Pause key. */
    VK_PAUSE: 19,
    /** Caps lock. */
    VK_CAPS_LOCK: 20,
    /** Escape key. */
    VK_ESCAPE: 27,
    /** Space bar. */
    VK_SPACE: 32,
    /** Page Up key. */
    VK_PAGE_UP: 33,
    /** Page Down key. */
    VK_PAGE_DOWN: 34,
    /** End key. */
    VK_END: 35,
    /** Home key. */
    VK_HOME: 36,
    /** Left arrow. */
    VK_LEFT: 37,
    /** Up arrow. */
    VK_UP: 38,
    /** Right arrow. */
    VK_RIGHT: 39,
    /** Down arrow. */
    VK_DOWN: 40,
    /** Print Screen key. */
    VK_PRINTSCREEN: 44,
    /** Ins(ert) key. */
    VK_INSERT: 45,
    /** Del(ete) key. */
    VK_DELETE: 46,
    /***/
    VK_0: 48,
    /***/
    VK_1: 49,
    /***/
    VK_2: 50,
    /***/
    VK_3: 51,
    /***/
    VK_4: 52,
    /***/
    VK_5: 53,
    /***/
    VK_6: 54,
    /***/
    VK_7: 55,
    /***/
    VK_8: 56,
    /***/
    VK_9: 57,
    /** Colon (:) key. Requires Gecko 15.0 */
    VK_COLON: 58,
    /** Semicolon (;) key. */
    VK_SEMICOLON: 59,
    /** Less-than (<) key. Requires Gecko 15.0 */
    VK_LESS_THAN: 60,
    /** Equals (=) key. */
    VK_EQUALS: 61,
    /** Greater-than (>) key. Requires Gecko 15.0 */
    VK_GREATER_THAN: 62,
    /** Question mark (?) key. Requires Gecko 15.0 */
    VK_QUESTION_MARK: 63,
    /** Atmark (@) key. Requires Gecko 15.0 */
    VK_AT: 64,
    /***/
    VK_A: 65,
    /***/
    VK_B: 66,
    /***/
    VK_C: 67,
    /***/
    VK_D: 68,
    /***/
    VK_E: 69,
    /***/
    VK_F: 70,
    /***/
    VK_G: 71,
    /***/
    VK_H: 72,
    /***/
    VK_I: 73,
    /***/
    VK_J: 74,
    /***/
    VK_K: 75,
    /***/
    VK_L: 76,
    /***/
    VK_M: 77,
    /***/
    VK_N: 78,
    /***/
    VK_O: 79,
    /***/
    VK_P: 80,
    /***/
    VK_Q: 81,
    /***/
    VK_R: 82,
    /***/
    VK_S: 83,
    /***/
    VK_T: 84,
    /***/
    VK_U: 85,
    /***/
    VK_V: 86,
    /***/
    VK_W: 87,
    /***/
    VK_X: 88,
    /***/
    VK_Y: 89,
    /***/
    VK_Z: 90,
    /***/
    VK_CONTEXT_MENU: 93,
    /** 0 on the numeric keypad. */
    VK_NUMPAD0: 96,
    /** 1 on the numeric keypad. */
    VK_NUMPAD1: 97,
    /** 2 on the numeric keypad. */
    VK_NUMPAD2: 98,
    /** 3 on the numeric keypad. */
    VK_NUMPAD3: 99,
    /** 4 on the numeric keypad. */
    VK_NUMPAD4: 100,
    /** 5 on the numeric keypad. */
    VK_NUMPAD5: 101,
    /** 6 on the numeric keypad. */
    VK_NUMPAD6: 102,
    /** 7 on the numeric keypad. */
    VK_NUMPAD7: 103,
    /** 8 on the numeric keypad. */
    VK_NUMPAD8: 104,
    /** 9 on the numeric keypad. */
    VK_NUMPAD9: 105,
    /** * on the numeric keypad. */
    VK_MULTIPLY: 106,
    /** + on the numeric keypad. */
    VK_ADD: 107,
    /***/
    VK_SEPARATOR: 108,
    /** - on the numeric keypad. */
    VK_SUBTRACT: 109,
    /** Decimal point on the numeric keypad. */
    VK_DECIMAL: 110,
    /** / on the numeric keypad. */
    VK_DIVIDE: 111,
    /** F1 key. */
    VK_F1: 112,
    /** F2 key. */
    VK_F2: 113,
    /** F3 key. */
    VK_F3: 114,
    /** F4 key. */
    VK_F4: 115,
    /** F5 key. */
    VK_F5: 116,
    /** F6 key. */
    VK_F6: 117,
    /** F7 key. */
    VK_F7: 118,
    /** F8 key. */
    VK_F8: 119,
    /** F9 key. */
    VK_F9: 120,
    /** F10 key. */
    VK_F10: 121,
    /** F11 key. */
    VK_F11: 122,
    /** F12 key. */
    VK_F12: 123,
    /** F13 key. */
    VK_F13: 124,
    /** F14 key. */
    VK_F14: 125,
    /** F15 key. */
    VK_F15: 126,
    /** F16 key. */
    VK_F16: 127,
    /** F17 key. */
    VK_F17: 128,
    /** F18 key. */
    VK_F18: 129,
    /** F19 key. */
    VK_F19: 130,
    /** F20 key. */
    VK_F20: 131,
    /** F21 key. */
    VK_F21: 132,
    /** F22 key. */
    VK_F22: 133,
    /** F23 key. */
    VK_F23: 134,
    /** F24 key. */
    VK_F24: 135,
    /** Num Lock key. */
    VK_NUM_LOCK: 144,
    /** Scroll Lock key. */
    VK_SCROLL_LOCK: 145,
    /** Circumflex (^) key. Requires Gecko 15.0 */
    VK_CIRCUMFLEX: 160,
    /** Exclamation (!) key. Requires Gecko 15.0 */
    VK_EXCLAMATION: 161,
    /** Double quote () key. Requires Gecko 15.0 */
    VK_DOUBLE_QUOTE: 162,
    /** Hash (#) key. Requires Gecko 15.0 */
    VK_HASH: 163,
    /** Dollar sign ($) key. Requires Gecko 15.0 */
    VK_DOLLAR: 164,
    /** Percent (%) key. Requires Gecko 15.0 */
    VK_PERCENT: 165,
    /** Ampersand (&) key. Requires Gecko 15.0 */
    VK_AMPERSAND: 166,
    /** Underscore (_) key. Requires Gecko 15.0 */
    VK_UNDERSCORE: 167,
    /** Open parenthesis (() key. Requires Gecko 15.0 */
    VK_OPEN_PAREN: 168,
    /** Close parenthesis ()) key. Requires Gecko 15.0 */
    VK_CLOSE_PAREN: 169,
    /* Asterisk (*) key. Requires Gecko 15.0 */
    VK_ASTERISK: 170,
    /** Plus (+) key. Requires Gecko 15.0 */
    VK_PLUS: 171,
    /** Pipe (|) key. Requires Gecko 15.0 */
    VK_PIPE: 172,
    /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
    VK_HYPHEN_MINUS: 173,
    /** Open curly bracket ({) key. Requires Gecko 15.0 */
    VK_OPEN_CURLY_BRACKET: 174,
    /** Close curly bracket (}) key. Requires Gecko 15.0 */
    VK_CLOSE_CURLY_BRACKET: 175,
    /** Tilde (~) key. Requires Gecko 15.0 */
    VK_TILDE: 176,
    /** Comma (,) key. */
    VK_COMMA: 188,
    /** Period (.) key. */
    VK_PERIOD: 190,
    /** Slash (/) key. */
    VK_SLASH: 191,
    /** Back tick (`) key. */
    VK_BACK_QUOTE: 192,
    /** Open square bracket ([) key. */
    VK_OPEN_BRACKET: 219,
    /** Back slash (\) key. */
    VK_BACK_SLASH: 220,
    /** Close square bracket (]) key. */
    VK_CLOSE_BRACKET: 221,
    /** Quote (''') key. */
    VK_QUOTE: 222,
    /** Meta key on Linux, Command key on Mac. */
    VK_META: 224,
    /** AltGr key on Linux. Requires Gecko 15.0 */
    VK_ALTGR: 225,
    /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
    VK_WIN: 91,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANA: 21,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANGUL: 21,
    /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
    VK_EISU: 22,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_JUNJA: 23,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_FINAL: 24,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANJA: 25,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANJI: 25,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_CONVERT: 28,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_NONCONVERT: 29,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_ACCEPT: 30,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_MODECHANGE: 31,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_SELECT: 41,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_PRINT: 42,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_EXECUTE: 43,
    /** Linux support for this keycode was added in Gecko 4.0.	 */
    VK_SLEEP: 95
};

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/display.js







const BACKENDS = {
    "hex": hex_Hex,
    "rect": rect_Rect,
    "tile": tile_Tile,
    "tile-gl": tile_gl_TileGL,
    "term": term["a" /* default */]
};
const DEFAULT_OPTIONS = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    transpose: false,
    layout: "rect",
    fontSize: 15,
    spacing: 1,
    border: 0,
    forceSquareRatio: false,
    fontFamily: "monospace",
    fontStyle: "",
    fg: "#ccc",
    bg: "#000",
    tileWidth: 32,
    tileHeight: 32,
    tileMap: {},
    tileSet: null,
    tileColorize: false
};
/**
 * @class Visual map display
 */
class display_Display {
    constructor(options = {}) {
        this._data = {};
        this._dirty = false; // false = nothing, true = all, object = dirty cells
        this._options = {};
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.setOptions(options);
        this.DEBUG = this.DEBUG.bind(this);
        this._tick = this._tick.bind(this);
        this._backend.schedule(this._tick);
    }
    /**
     * Debug helper, ideal as a map generator callback. Always bound to this.
     * @param {int} x
     * @param {int} y
     * @param {int} what
     */
    DEBUG(x, y, what) {
        let colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
    }
    /**
     * Clear the whole display (cover it with background color)
     */
    clear() {
        this._data = {};
        this._dirty = true;
    }
    /**
     * @see ROT.Display
     */
    setOptions(options) {
        Object.assign(this._options, options);
        if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
            if (options.layout) {
                let ctor = BACKENDS[options.layout];
                this._backend = new ctor();
            }
            this._backend.setOptions(this._options);
            this._dirty = true;
        }
        return this;
    }
    /**
     * Returns currently set options
     */
    getOptions() { return this._options; }
    /**
     * Returns the DOM node of this display
     */
    getContainer() { return this._backend.getContainer(); }
    /**
     * Compute the maximum width/height to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int[2]} cellWidth,cellHeight
     */
    computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
    }
    /**
     * Compute the maximum font size to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int} fontSize
     */
    computeFontSize(availWidth, availHeight) {
        return this._backend.computeFontSize(availWidth, availHeight);
    }
    computeTileSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.width);
        let height = Math.floor(availHeight / this._options.height);
        return [width, height];
    }
    /**
     * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
     * @param {Event} e event
     * @returns {int[2]} -1 for values outside of the canvas
     */
    eventToPosition(e) {
        let x, y;
        if ("touches" in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        return this._backend.eventToPosition(x, y);
    }
    /**
     * @param {int} x
     * @param {int} y
     * @param {string || string[]} ch One or more chars (will be overlapping themselves)
     * @param {string} [fg] foreground color
     * @param {string} [bg] background color
     */
    draw(x, y, ch, fg, bg) {
        if (!fg) {
            fg = this._options.fg;
        }
        if (!bg) {
            bg = this._options.bg;
        }
        let key = `${x},${y}`;
        this._data[key] = [x, y, ch, fg, bg];
        if (this._dirty === true) {
            return;
        } // will already redraw everything 
        if (!this._dirty) {
            this._dirty = {};
        } // first!
        this._dirty[key] = true;
    }
    /**
     * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
     * @param {int} x
     * @param {int} y
     * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
     * @param {int} [maxWidth] wrap at what width?
     * @returns {int} lines drawn
     */
    drawText(x, y, text, maxWidth) {
        let fg = null;
        let bg = null;
        let cx = x;
        let cy = y;
        let lines = 1;
        if (!maxWidth) {
            maxWidth = this._options.width - x;
        }
        let tokens = tokenize(text, maxWidth);
        while (tokens.length) { // interpret tokenized opcode stream
            let token = tokens.shift();
            switch (token.type) {
                case TYPE_TEXT:
                    let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
                    for (let i = 0; i < token.value.length; i++) {
                        let cc = token.value.charCodeAt(i);
                        let c = token.value.charAt(i);
                        // Assign to `true` when the current char is full-width.
                        isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
                        // Current char is space, whatever full-width or half-width both are OK.
                        isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
                        // The previous char is full-width and
                        // current char is nether half-width nor a space.
                        if (isPrevFullWidth && !isFullWidth && !isSpace) {
                            cx++;
                        } // add an extra position
                        // The current char is full-width and
                        // the previous char is not a space.
                        if (isFullWidth && !isPrevSpace) {
                            cx++;
                        } // add an extra position
                        this.draw(cx++, cy, c, fg, bg);
                        isPrevSpace = isSpace;
                        isPrevFullWidth = isFullWidth;
                    }
                    break;
                case TYPE_FG:
                    fg = token.value || null;
                    break;
                case TYPE_BG:
                    bg = token.value || null;
                    break;
                case TYPE_NEWLINE:
                    cx = x;
                    cy++;
                    lines++;
                    break;
            }
        }
        return lines;
    }
    /**
     * Timer tick: update dirty parts
     */
    _tick() {
        this._backend.schedule(this._tick);
        if (!this._dirty) {
            return;
        }
        if (this._dirty === true) { // draw all
            this._backend.clear();
            for (let id in this._data) {
                this._draw(id, false);
            } // redraw cached data 
        }
        else { // draw only dirty 
            for (let key in this._dirty) {
                this._draw(key, true);
            }
        }
        this._dirty = false;
    }
    /**
     * @param {string} key What to draw
     * @param {bool} clearBefore Is it necessary to clean before?
     */
    _draw(key, clearBefore) {
        let data = this._data[key];
        if (data[4] != this._options.bg) {
            clearBefore = true;
        }
        this._backend.draw(data, clearBefore);
    }
}
display_Display.Rect = rect_Rect;
display_Display.Hex = hex_Hex;
display_Display.Tile = tile_Tile;
display_Display.TileGL = tile_gl_TileGL;
display_Display.Term = term["a" /* default */];

// CONCATENATED MODULE: ./node_modules/rot-js/lib/stringgenerator.js

/**
 * @class (Markov process)-based string generator.
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
 * Offers configurable order and prior.
 */
class stringgenerator_StringGenerator {
    constructor(options) {
        this._options = {
            words: false,
            order: 3,
            prior: 0.001
        };
        Object.assign(this._options, options);
        this._boundary = String.fromCharCode(0);
        this._suffix = this._boundary;
        this._prefix = [];
        for (let i = 0; i < this._options.order; i++) {
            this._prefix.push(this._boundary);
        }
        this._priorValues = {};
        this._priorValues[this._boundary] = this._options.prior;
        this._data = {};
    }
    /**
     * Remove all learning data
     */
    clear() {
        this._data = {};
        this._priorValues = {};
    }
    /**
     * @returns {string} Generated string
     */
    generate() {
        let result = [this._sample(this._prefix)];
        while (result[result.length - 1] != this._boundary) {
            result.push(this._sample(result));
        }
        return this._join(result.slice(0, -1));
    }
    /**
     * Observe (learn) a string from a training set
     */
    observe(string) {
        let tokens = this._split(string);
        for (let i = 0; i < tokens.length; i++) {
            this._priorValues[tokens[i]] = this._options.prior;
        }
        tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */
        for (let i = this._options.order; i < tokens.length; i++) {
            let context = tokens.slice(i - this._options.order, i);
            let event = tokens[i];
            for (let j = 0; j < context.length; j++) {
                let subcontext = context.slice(j);
                this._observeEvent(subcontext, event);
            }
        }
    }
    getStats() {
        let parts = [];
        let priorCount = Object.keys(this._priorValues).length;
        priorCount--; // boundary
        parts.push("distinct samples: " + priorCount);
        let dataCount = Object.keys(this._data).length;
        let eventCount = 0;
        for (let p in this._data) {
            eventCount += Object.keys(this._data[p]).length;
        }
        parts.push("dictionary size (contexts): " + dataCount);
        parts.push("dictionary size (events): " + eventCount);
        return parts.join(", ");
    }
    /**
     * @param {string}
     * @returns {string[]}
     */
    _split(str) {
        return str.split(this._options.words ? /\s+/ : "");
    }
    /**
     * @param {string[]}
     * @returns {string}
     */
    _join(arr) {
        return arr.join(this._options.words ? " " : "");
    }
    /**
     * @param {string[]} context
     * @param {string} event
     */
    _observeEvent(context, event) {
        let key = this._join(context);
        if (!(key in this._data)) {
            this._data[key] = {};
        }
        let data = this._data[key];
        if (!(event in data)) {
            data[event] = 0;
        }
        data[event]++;
    }
    /**
     * @param {string[]}
     * @returns {string}
     */
    _sample(context) {
        context = this._backoff(context);
        let key = this._join(context);
        let data = this._data[key];
        let available = {};
        if (this._options.prior) {
            for (let event in this._priorValues) {
                available[event] = this._priorValues[event];
            }
            for (let event in data) {
                available[event] += data[event];
            }
        }
        else {
            available = data;
        }
        return rng["a" /* default */].getWeightedValue(available);
    }
    /**
     * @param {string[]}
     * @returns {string[]}
     */
    _backoff(context) {
        if (context.length > this._options.order) {
            context = context.slice(-this._options.order);
        }
        else if (context.length < this._options.order) {
            context = this._prefix.slice(0, this._options.order - context.length).concat(context);
        }
        while (!(this._join(context) in this._data) && context.length > 0) {
            context = context.slice(1);
        }
        return context;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/eventqueue.js
class EventQueue {
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    constructor() {
        this._time = 0;
        this._events = [];
        this._eventTimes = [];
    }
    /**
     * @returns {number} Elapsed time
     */
    getTime() { return this._time; }
    /**
     * Clear all scheduled events
     */
    clear() {
        this._events = [];
        this._eventTimes = [];
        return this;
    }
    /**
     * @param {?} event
     * @param {number} time
     */
    add(event, time) {
        let index = this._events.length;
        for (let i = 0; i < this._eventTimes.length; i++) {
            if (this._eventTimes[i] > time) {
                index = i;
                break;
            }
        }
        this._events.splice(index, 0, event);
        this._eventTimes.splice(index, 0, time);
    }
    /**
     * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
     * @returns {? || null} The event previously added by addEvent, null if no event available
     */
    get() {
        if (!this._events.length) {
            return null;
        }
        let time = this._eventTimes.splice(0, 1)[0];
        if (time > 0) { /* advance */
            this._time += time;
            for (let i = 0; i < this._eventTimes.length; i++) {
                this._eventTimes[i] -= time;
            }
        }
        return this._events.splice(0, 1)[0];
    }
    /**
     * Get the time associated with the given event
     * @param {?} event
     * @returns {number} time
     */
    getEventTime(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return undefined;
        }
        return this._eventTimes[index];
    }
    /**
     * Remove an event from the queue
     * @param {?} event
     * @returns {bool} success?
     */
    remove(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return false;
        }
        this._remove(index);
        return true;
    }
    ;
    /**
     * Remove an event from the queue
     * @param {int} index
     */
    _remove(index) {
        this._events.splice(index, 1);
        this._eventTimes.splice(index, 1);
    }
    ;
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/scheduler.js

class scheduler_Scheduler {
    /**
     * @class Abstract scheduler
     */
    constructor() {
        this._queue = new EventQueue();
        this._repeat = [];
        this._current = null;
    }
    /**
     * @see ROT.EventQueue#getTime
     */
    getTime() { return this._queue.getTime(); }
    /**
     * @param {?} item
     * @param {bool} repeat
     */
    add(item, repeat) {
        if (repeat) {
            this._repeat.push(item);
        }
        return this;
    }
    /**
     * Get the time the given item is scheduled for
     * @param {?} item
     * @returns {number} time
     */
    getTimeOf(item) {
        return this._queue.getEventTime(item);
    }
    /**
     * Clear all items
     */
    clear() {
        this._queue.clear();
        this._repeat = [];
        this._current = null;
        return this;
    }
    /**
     * Remove a previously added item
     * @param {?} item
     * @returns {bool} successful?
     */
    remove(item) {
        let result = this._queue.remove(item);
        let index = this._repeat.indexOf(item);
        if (index != -1) {
            this._repeat.splice(index, 1);
        }
        if (this._current == item) {
            this._current = null;
        }
        return result;
    }
    /**
     * Schedule next item
     * @returns {?}
     */
    next() {
        this._current = this._queue.get();
        return this._current;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/simple.js

/**
 * @class Simple fair scheduler (round-robin style)
 */
class simple_Simple extends scheduler_Scheduler {
    add(item, repeat) {
        this._queue.add(item, 0);
        return super.add(item, repeat);
    }
    next() {
        if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 0);
        }
        return super.next();
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/speed.js

/**
 * @class Speed-based scheduler
 */
class speed_Speed extends scheduler_Scheduler {
    /**
     * @param {object} item anything with "getSpeed" method
     * @param {bool} repeat
     * @param {number} [time=1/item.getSpeed()]
     * @see ROT.Scheduler#add
     */
    add(item, repeat, time) {
        this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());
        return super.add(item, repeat);
    }
    /**
     * @see ROT.Scheduler#next
     */
    next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 1 / this._current.getSpeed());
        }
        return super.next();
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/action.js

/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
class action_Action extends scheduler_Scheduler {
    constructor() {
        super();
        this._defaultDuration = 1; /* for newly added */
        this._duration = this._defaultDuration; /* for this._current */
    }
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */
    add(item, repeat, time) {
        this._queue.add(item, time || this._defaultDuration);
        return super.add(item, repeat);
    }
    clear() {
        this._duration = this._defaultDuration;
        return super.clear();
    }
    remove(item) {
        if (item == this._current) {
            this._duration = this._defaultDuration;
        }
        return super.remove(item);
    }
    /**
     * @see ROT.Scheduler#next
     */
    next() {
        if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, this._duration || this._defaultDuration);
            this._duration = this._defaultDuration;
        }
        return super.next();
    }
    /**
     * Set duration for the active item
     */
    setDuration(time) {
        if (this._current) {
            this._duration = time;
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/index.js



/* harmony default export */ var scheduler = ({ Simple: simple_Simple, Speed: speed_Speed, Action: action_Action });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/fov.js

;
;
class fov_FOV {
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    constructor(lightPassesCallback, options = {}) {
        this._lightPasses = lightPassesCallback;
        this._options = Object.assign({ topology: 8 }, options);
    }
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */
    _getCircle(cx, cy, r) {
        let result = [];
        let dirs, countFactor, startOffset;
        switch (this._options.topology) {
            case 4:
                countFactor = 1;
                startOffset = [0, 1];
                dirs = [
                    DIRS[8][7],
                    DIRS[8][1],
                    DIRS[8][3],
                    DIRS[8][5]
                ];
                break;
            case 6:
                dirs = DIRS[6];
                countFactor = 1;
                startOffset = [-1, 1];
                break;
            case 8:
                dirs = DIRS[4];
                countFactor = 2;
                startOffset = [-1, 1];
                break;
            default:
                throw new Error("Incorrect topology for FOV computation");
                break;
        }
        /* starting neighbor */
        let x = cx + startOffset[0] * r;
        let y = cy + startOffset[1] * r;
        /* circle */
        for (let i = 0; i < dirs.length; i++) {
            for (let j = 0; j < r * countFactor; j++) {
                result.push([x, y]);
                x += dirs[i][0];
                y += dirs[i][1];
            }
        }
        return result;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/discrete-shadowcasting.js

/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
class discrete_shadowcasting_DiscreteShadowcasting extends fov_FOV {
    compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */
        if (!this._lightPasses(x, y)) {
            return;
        }
        /* start and end angles */
        let DATA = [];
        let A, B, cx, cy, blocks;
        /* analyze surrounding cells in concentric rings, starting from the center */
        for (let r = 1; r <= R; r++) {
            let neighbors = this._getCircle(x, y, r);
            let angle = 360 / neighbors.length;
            for (let i = 0; i < neighbors.length; i++) {
                cx = neighbors[i][0];
                cy = neighbors[i][1];
                A = angle * (i - 0.5);
                B = A + angle;
                blocks = !this._lightPasses(cx, cy);
                if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
                    callback(cx, cy, r, 1);
                }
                if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
                    return;
                } /* cutoff? */
            } /* for all cells in this ring */
        } /* for all rings */
    }
    /**
     * @param {int} A start angle
     * @param {int} B end angle
     * @param {bool} blocks Does current cell block visibility?
     * @param {int[][]} DATA shadowed angle pairs
     */
    _visibleCoords(A, B, blocks, DATA) {
        if (A < 0) {
            let v1 = this._visibleCoords(0, B, blocks, DATA);
            let v2 = this._visibleCoords(360 + A, 360, blocks, DATA);
            return v1 || v2;
        }
        let index = 0;
        while (index < DATA.length && DATA[index] < A) {
            index++;
        }
        if (index == DATA.length) { /* completely new shadow */
            if (blocks) {
                DATA.push(A, B);
            }
            return true;
        }
        let count = 0;
        if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
            while (index < DATA.length && DATA[index] < B) {
                index++;
                count++;
            }
            if (count == 0) {
                return false;
            }
            if (blocks) {
                if (count % 2) {
                    DATA.splice(index - count, count, B);
                }
                else {
                    DATA.splice(index - count, count);
                }
            }
            return true;
        }
        else { /* this shadow starts outside an existing shadow, or within a starting boundary */
            while (index < DATA.length && DATA[index] < B) {
                index++;
                count++;
            }
            /* visible when outside an existing shadow, or when overlapping */
            if (A == DATA[index - count] && count == 1) {
                return false;
            }
            if (blocks) {
                if (count % 2) {
                    DATA.splice(index - count, count, A);
                }
                else {
                    DATA.splice(index - count, count, A, B);
                }
            }
            return true;
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/precise-shadowcasting.js

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
class precise_shadowcasting_PreciseShadowcasting extends fov_FOV {
    compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */
        if (!this._lightPasses(x, y)) {
            return;
        }
        /* list of all shadows */
        let SHADOWS = [];
        let cx, cy, blocks, A1, A2, visibility;
        /* analyze surrounding cells in concentric rings, starting from the center */
        for (let r = 1; r <= R; r++) {
            let neighbors = this._getCircle(x, y, r);
            let neighborCount = neighbors.length;
            for (let i = 0; i < neighborCount; i++) {
                cx = neighbors[i][0];
                cy = neighbors[i][1];
                /* shift half-an-angle backwards to maintain consistency of 0-th cells */
                A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
                A2 = [2 * i + 1, 2 * neighborCount];
                blocks = !this._lightPasses(cx, cy);
                visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
                if (visibility) {
                    callback(cx, cy, r, visibility);
                }
                if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
                    return;
                } /* cutoff? */
            } /* for all cells in this ring */
        } /* for all rings */
    }
    /**
     * @param {int[2]} A1 arc start
     * @param {int[2]} A2 arc end
     * @param {bool} blocks Does current arc block visibility?
     * @param {int[][]} SHADOWS list of active shadows
     */
    _checkVisibility(A1, A2, blocks, SHADOWS) {
        if (A1[0] > A2[0]) { /* split into two sub-arcs */
            let v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
            let v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
            return (v1 + v2) / 2;
        }
        /* index1: first shadow >= A1 */
        let index1 = 0, edge1 = false;
        while (index1 < SHADOWS.length) {
            let old = SHADOWS[index1];
            let diff = old[0] * A1[1] - A1[0] * old[1];
            if (diff >= 0) { /* old >= A1 */
                if (diff == 0 && !(index1 % 2)) {
                    edge1 = true;
                }
                break;
            }
            index1++;
        }
        /* index2: last shadow <= A2 */
        let index2 = SHADOWS.length, edge2 = false;
        while (index2--) {
            let old = SHADOWS[index2];
            let diff = A2[0] * old[1] - old[0] * A2[1];
            if (diff >= 0) { /* old <= A2 */
                if (diff == 0 && (index2 % 2)) {
                    edge2 = true;
                }
                break;
            }
        }
        let visible = true;
        if (index1 == index2 && (edge1 || edge2)) { /* subset of existing shadow, one of the edges match */
            visible = false;
        }
        else if (edge1 && edge2 && index1 + 1 == index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
            visible = false;
        }
        else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
            visible = false;
        }
        if (!visible) {
            return 0;
        } /* fast case: not visible */
        let visibleLength;
        /* compute the length of visible arc, adjust list of shadows (if blocking) */
        let remove = index2 - index1 + 1;
        if (remove % 2) {
            if (index1 % 2) { /* first edge within existing shadow, second outside */
                let P = SHADOWS[index1];
                visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove, A2);
                }
            }
            else { /* second edge within existing shadow, first outside */
                let P = SHADOWS[index2];
                visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove, A1);
                }
            }
        }
        else {
            if (index1 % 2) { /* both edges within existing shadows */
                let P1 = SHADOWS[index1];
                let P2 = SHADOWS[index2];
                visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove);
                }
            }
            else { /* both edges outside existing shadows */
                if (blocks) {
                    SHADOWS.splice(index1, remove, A1, A2);
                }
                return 1; /* whole arc visible! */
            }
        }
        let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
        return visibleLength / arcLength;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/recursive-shadowcasting.js

/** Octants used for translating recursive shadowcasting offsets */
const OCTANTS = [
    [-1, 0, 0, 1],
    [0, -1, 1, 0],
    [0, -1, -1, 0],
    [-1, 0, 0, -1],
    [1, 0, 0, -1],
    [0, 1, -1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
];
/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */
class recursive_shadowcasting_RecursiveShadowcasting extends fov_FOV {
    /**
     * Compute visibility for a 360-degree circle
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    compute(x, y, R, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        for (let i = 0; i < OCTANTS.length; i++) {
            this._renderOctant(x, y, OCTANTS[i], R, callback);
        }
    }
    /**
     * Compute visibility for a 180-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    compute180(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
        let nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
        let nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
        this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);
        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
        this._renderOctant(x, y, OCTANTS[dir], R, callback);
        this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
    }
    ;
    /**
     * Compute visibility for a 90-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    compute90(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
        this._renderOctant(x, y, OCTANTS[dir], R, callback);
        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
    }
    /**
     * Render one octant (45-degree arc) of the viewshed
     * @param {int} x
     * @param {int} y
     * @param {int} octant Octant to be rendered
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    _renderOctant(x, y, octant, R, callback) {
        //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
        this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
    }
    /**
     * Actually calculates the visibility
     * @param {int} startX The starting X coordinate
     * @param {int} startY The starting Y coordinate
     * @param {int} row The row to render
     * @param {float} visSlopeStart The slope to start at
     * @param {float} visSlopeEnd The slope to end at
     * @param {int} radius The radius to reach out to
     * @param {int} xx
     * @param {int} xy
     * @param {int} yx
     * @param {int} yy
     * @param {function} callback The callback to use when we hit a block that is visible
     */
    _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
        if (visSlopeStart < visSlopeEnd) {
            return;
        }
        for (let i = row; i <= radius; i++) {
            let dx = -i - 1;
            let dy = -i;
            let blocked = false;
            let newStart = 0;
            //'Row' could be column, names here assume octant 0 and would be flipped for half the octants
            while (dx <= 0) {
                dx += 1;
                //Translate from relative coordinates to map coordinates
                let mapX = startX + dx * xx + dy * xy;
                let mapY = startY + dx * yx + dy * yy;
                //Range of the row
                let slopeStart = (dx - 0.5) / (dy + 0.5);
                let slopeEnd = (dx + 0.5) / (dy - 0.5);
                //Ignore if not yet at left edge of Octant
                if (slopeEnd > visSlopeStart) {
                    continue;
                }
                //Done if past right edge
                if (slopeStart < visSlopeEnd) {
                    break;
                }
                //If it's in range, it's visible
                if ((dx * dx + dy * dy) < (radius * radius)) {
                    callback(mapX, mapY, i, 1);
                }
                if (!blocked) {
                    //If tile is a blocking tile, cast around it
                    if (!this._lightPasses(mapX, mapY) && i < radius) {
                        blocked = true;
                        this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
                        newStart = slopeEnd;
                    }
                }
                else {
                    //Keep narrowing if scanning across a block
                    if (!this._lightPasses(mapX, mapY)) {
                        newStart = slopeEnd;
                        continue;
                    }
                    //Block has ended
                    blocked = false;
                    visSlopeStart = newStart;
                }
            }
            if (blocked) {
                break;
            }
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/index.js



/* harmony default export */ var fov = ({ DiscreteShadowcasting: discrete_shadowcasting_DiscreteShadowcasting, PreciseShadowcasting: precise_shadowcasting_PreciseShadowcasting, RecursiveShadowcasting: recursive_shadowcasting_RecursiveShadowcasting });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/map.js

;
class map_Map {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
        this._width = width;
        this._height = height;
    }
    ;
    _fillMap(value) {
        let map = [];
        for (let i = 0; i < this._width; i++) {
            map.push([]);
            for (let j = 0; j < this._height; j++) {
                map[i].push(value);
            }
        }
        return map;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/arena.js

/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
class arena_Arena extends map_Map {
    create(callback) {
        let w = this._width - 1;
        let h = this._height - 1;
        for (let i = 0; i <= w; i++) {
            for (let j = 0; j <= h; j++) {
                let empty = (i && j && i < w && j < h);
                callback(i, j, empty ? 0 : 1);
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/dungeon.js

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
class dungeon_Dungeon extends map_Map {
    constructor(width, height) {
        super(width, height);
        this._rooms = [];
        this._corridors = [];
    }
    /**
     * Get all generated rooms
     * @returns {ROT.Map.Feature.Room[]}
     */
    getRooms() { return this._rooms; }
    /**
     * Get all generated corridors
     * @returns {ROT.Map.Feature.Corridor[]}
     */
    getCorridors() { return this._corridors; }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/features.js

;
/**
 * @class Dungeon feature; has own .create() method
 */
class Feature {
}
/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
class features_Room extends Feature {
    constructor(x1, y1, x2, y2, doorX, doorY) {
        super();
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this._doors = {};
        if (doorX !== undefined && doorY !== undefined) {
            this.addDoor(doorX, doorY);
        }
    }
    ;
    /**
     * Room of random size, with a given doors and direction
     */
    static createRandomAt(x, y, dx, dy, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        if (dx == 1) { /* to the right */
            let y2 = y - Math.floor(rng["a" /* default */].getUniform() * height);
            return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
        }
        if (dx == -1) { /* to the left */
            let y2 = y - Math.floor(rng["a" /* default */].getUniform() * height);
            return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
        }
        if (dy == 1) { /* to the bottom */
            let x2 = x - Math.floor(rng["a" /* default */].getUniform() * width);
            return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
        }
        if (dy == -1) { /* to the top */
            let x2 = x - Math.floor(rng["a" /* default */].getUniform() * width);
            return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
        }
        throw new Error("dx or dy must be 1 or -1");
    }
    /**
     * Room of random size, positioned around center coords
     */
    static createRandomCenter(cx, cy, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        let x1 = cx - Math.floor(rng["a" /* default */].getUniform() * width);
        let y1 = cy - Math.floor(rng["a" /* default */].getUniform() * height);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    }
    /**
     * Room of random size within a given dimensions
     */
    static createRandom(availWidth, availHeight, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        let left = availWidth - width - 1;
        let top = availHeight - height - 1;
        let x1 = 1 + Math.floor(rng["a" /* default */].getUniform() * left);
        let y1 = 1 + Math.floor(rng["a" /* default */].getUniform() * top);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    }
    addDoor(x, y) {
        this._doors[x + "," + y] = 1;
        return this;
    }
    /**
     * @param {function}
     */
    getDoors(cb) {
        for (let key in this._doors) {
            let parts = key.split(",");
            cb(parseInt(parts[0]), parseInt(parts[1]));
        }
        return this;
    }
    clearDoors() {
        this._doors = {};
        return this;
    }
    addDoors(isWallCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x != left && x != right && y != top && y != bottom) {
                    continue;
                }
                if (isWallCallback(x, y)) {
                    continue;
                }
                this.addDoor(x, y);
            }
        }
        return this;
    }
    debug() {
        console.log("room", this._x1, this._y1, this._x2, this._y2);
    }
    isValid(isWallCallback, canBeDugCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x == left || x == right || y == top || y == bottom) {
                    if (!isWallCallback(x, y)) {
                        return false;
                    }
                }
                else {
                    if (!canBeDugCallback(x, y)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */
    create(digCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        let value = 0;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x + "," + y in this._doors) {
                    value = 2;
                }
                else if (x == left || x == right || y == top || y == bottom) {
                    value = 1;
                }
                else {
                    value = 0;
                }
                digCallback(x, y, value);
            }
        }
    }
    getCenter() {
        return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
    }
    getLeft() { return this._x1; }
    getRight() { return this._x2; }
    getTop() { return this._y1; }
    getBottom() { return this._y2; }
}
/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
class features_Corridor extends Feature {
    constructor(startX, startY, endX, endY) {
        super();
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
        this._endsWithAWall = true;
    }
    static createRandomAt(x, y, dx, dy, options) {
        let min = options.corridorLength[0];
        let max = options.corridorLength[1];
        let length = rng["a" /* default */].getUniformInt(min, max);
        return new this(x, y, x + dx * length, y + dy * length);
    }
    debug() {
        console.log("corridor", this._startX, this._startY, this._endX, this._endY);
    }
    isValid(isWallCallback, canBeDugCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;
        let ok = true;
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            if (!canBeDugCallback(x, y)) {
                ok = false;
            }
            if (!isWallCallback(x + nx, y + ny)) {
                ok = false;
            }
            if (!isWallCallback(x - nx, y - ny)) {
                ok = false;
            }
            if (!ok) {
                length = i;
                this._endX = x - dx;
                this._endY = y - dy;
                break;
            }
        }
        /**
         * If the length degenerated, this corridor might be invalid
         */
        /* not supported */
        if (length == 0) {
            return false;
        }
        /* length 1 allowed only if the next space is empty */
        if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
            return false;
        }
        /**
         * We do not want the corridor to crash into a corner of a room;
         * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
         *
         * Situation:
         * #######1
         * .......?
         * #######2
         *
         * The corridor was dug from left to right.
         * 1, 2 - problematic corners, ? = N+1th cell (not dug)
         */
        let firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
        let secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
        this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
        if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
            return false;
        }
        return true;
    }
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    create(digCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            digCallback(x, y, 0);
        }
        return true;
    }
    createPriorityWalls(priorityWallCallback) {
        if (!this._endsWithAWall) {
            return;
        }
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;
        priorityWallCallback(this._endX + dx, this._endY + dy);
        priorityWallCallback(this._endX + nx, this._endY + ny);
        priorityWallCallback(this._endX - nx, this._endY - ny);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/uniform.js



;
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
class uniform_Uniform extends dungeon_Dungeon {
    constructor(width, height, options) {
        super(width, height);
        this._options = {
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            roomDugPercentage: 0.1,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        };
        Object.assign(this._options, options);
        this._map = [];
        this._dug = 0;
        this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
        this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */
        this._connected = []; /* list of already connected rooms */
        this._unconnected = []; /* list of remaining unconnected rooms */
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
    }
    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */
    create(callback) {
        let t1 = Date.now();
        while (1) {
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                return null;
            } /* time limit! */
            this._map = this._fillMap(1);
            this._dug = 0;
            this._rooms = [];
            this._unconnected = [];
            this._generateRooms();
            if (this._rooms.length < 2) {
                continue;
            }
            if (this._generateCorridors()) {
                break;
            }
        }
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        return this;
    }
    /**
     * Generates a suitable amount of rooms
     */
    _generateRooms() {
        let w = this._width - 2;
        let h = this._height - 2;
        let room;
        do {
            room = this._generateRoom();
            if (this._dug / (w * h) > this._options.roomDugPercentage) {
                break;
            } /* achieved requested amount of free space */
        } while (room);
        /* either enough rooms, or not able to generate more of them :) */
    }
    /**
     * Try to generate one room
     */
    _generateRoom() {
        let count = 0;
        while (count < this._roomAttempts) {
            count++;
            let room = features_Room.createRandom(this._width, this._height, this._options);
            if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                continue;
            }
            room.create(this._digCallback);
            this._rooms.push(room);
            return room;
        }
        /* no room was generated in a given number of attempts */
        return null;
    }
    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */
    _generateCorridors() {
        let cnt = 0;
        while (cnt < this._corridorAttempts) {
            cnt++;
            this._corridors = [];
            /* dig rooms into a clear map */
            this._map = this._fillMap(1);
            for (let i = 0; i < this._rooms.length; i++) {
                let room = this._rooms[i];
                room.clearDoors();
                room.create(this._digCallback);
            }
            this._unconnected = rng["a" /* default */].shuffle(this._rooms.slice());
            this._connected = [];
            if (this._unconnected.length) {
                this._connected.push(this._unconnected.pop());
            } /* first one is always connected */
            while (1) {
                /* 1. pick random connected room */
                let connected = rng["a" /* default */].getItem(this._connected);
                if (!connected) {
                    break;
                }
                /* 2. find closest unconnected */
                let room1 = this._closestRoom(this._unconnected, connected);
                if (!room1) {
                    break;
                }
                /* 3. connect it to closest connected */
                let room2 = this._closestRoom(this._connected, room1);
                if (!room2) {
                    break;
                }
                let ok = this._connectRooms(room1, room2);
                if (!ok) {
                    break;
                } /* stop connecting, re-shuffle */
                if (!this._unconnected.length) {
                    return true;
                } /* done; no rooms remain */
            }
        }
        return false;
    }
    ;
    /**
     * For a given room, find the closest one from the list
     */
    _closestRoom(rooms, room) {
        let dist = Infinity;
        let center = room.getCenter();
        let result = null;
        for (let i = 0; i < rooms.length; i++) {
            let r = rooms[i];
            let c = r.getCenter();
            let dx = c[0] - center[0];
            let dy = c[1] - center[1];
            let d = dx * dx + dy * dy;
            if (d < dist) {
                dist = d;
                result = r;
            }
        }
        return result;
    }
    _connectRooms(room1, room2) {
        /*
            room1.debug();
            room2.debug();
        */
        let center1 = room1.getCenter();
        let center2 = room2.getCenter();
        let diffX = center2[0] - center1[0];
        let diffY = center2[1] - center1[1];
        let start;
        let end;
        let dirIndex1, dirIndex2, min, max, index;
        if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
            dirIndex1 = (diffY > 0 ? 2 : 0);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getLeft();
            max = room2.getRight();
            index = 0;
        }
        else { /* first try connecting east-west walls */
            dirIndex1 = (diffX > 0 ? 1 : 3);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getTop();
            max = room2.getBottom();
            index = 1;
        }
        start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
        if (!start) {
            return false;
        }
        if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
            end = start.slice();
            let value = 0;
            switch (dirIndex2) {
                case 0:
                    value = room2.getTop() - 1;
                    break;
                case 1:
                    value = room2.getRight() + 1;
                    break;
                case 2:
                    value = room2.getBottom() + 1;
                    break;
                case 3:
                    value = room2.getLeft() - 1;
                    break;
            }
            end[(index + 1) % 2] = value;
            this._digLine([start, end]);
        }
        else if (start[index] < min - 1 || start[index] > max + 1) { /* need to switch target wall (L-like) */
            let diff = start[index] - center2[index];
            let rotation = 0;
            switch (dirIndex2) {
                case 0:
                case 1:
                    rotation = (diff < 0 ? 3 : 1);
                    break;
                case 2:
                case 3:
                    rotation = (diff < 0 ? 1 : 3);
                    break;
            }
            dirIndex2 = (dirIndex2 + rotation) % 4;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = [0, 0];
            mid[index] = start[index];
            let index2 = (index + 1) % 2;
            mid[index2] = end[index2];
            this._digLine([start, mid, end]);
        }
        else { /* use current wall pair, but adjust the line in the middle (S-like) */
            let index2 = (index + 1) % 2;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = Math.round((end[index2] + start[index2]) / 2);
            let mid1 = [0, 0];
            let mid2 = [0, 0];
            mid1[index] = start[index];
            mid1[index2] = mid;
            mid2[index] = end[index];
            mid2[index2] = mid;
            this._digLine([start, mid1, mid2, end]);
        }
        room1.addDoor(start[0], start[1]);
        room2.addDoor(end[0], end[1]);
        index = this._unconnected.indexOf(room1);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room1);
        }
        index = this._unconnected.indexOf(room2);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room2);
        }
        return true;
    }
    _placeInWall(room, dirIndex) {
        let start = [0, 0];
        let dir = [0, 0];
        let length = 0;
        switch (dirIndex) {
            case 0:
                dir = [1, 0];
                start = [room.getLeft(), room.getTop() - 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 1:
                dir = [0, 1];
                start = [room.getRight() + 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
            case 2:
                dir = [1, 0];
                start = [room.getLeft(), room.getBottom() + 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 3:
                dir = [0, 1];
                start = [room.getLeft() - 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
        }
        let avail = [];
        let lastBadIndex = -2;
        for (let i = 0; i < length; i++) {
            let x = start[0] + i * dir[0];
            let y = start[1] + i * dir[1];
            avail.push(null);
            let isWall = (this._map[x][y] == 1);
            if (isWall) {
                if (lastBadIndex != i - 1) {
                    avail[i] = [x, y];
                }
            }
            else {
                lastBadIndex = i;
                if (i) {
                    avail[i - 1] = null;
                }
            }
        }
        for (let i = avail.length - 1; i >= 0; i--) {
            if (!avail[i]) {
                avail.splice(i, 1);
            }
        }
        return (avail.length ? rng["a" /* default */].getItem(avail) : null);
    }
    /**
     * Dig a polyline.
     */
    _digLine(points) {
        for (let i = 1; i < points.length; i++) {
            let start = points[i - 1];
            let end = points[i];
            let corridor = new features_Corridor(start[0], start[1], end[0], end[1]);
            corridor.create(this._digCallback);
            this._corridors.push(corridor);
        }
    }
    _digCallback(x, y, value) {
        this._map[x][y] = value;
        if (value == 0) {
            this._dug++;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/cellular.js



;
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
class cellular_Cellular extends map_Map {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = {
            born: [5, 6, 7, 8],
            survive: [4, 5, 6, 7, 8],
            topology: 8
        };
        this.setOptions(options);
        this._dirs = DIRS[this._options.topology];
        this._map = this._fillMap(0);
    }
    /**
     * Fill the map with random values
     * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
     */
    randomize(probability) {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                this._map[i][j] = (rng["a" /* default */].getUniform() < probability ? 1 : 0);
            }
        }
        return this;
    }
    /**
     * Change options.
     * @see ROT.Map.Cellular
     */
    setOptions(options) { Object.assign(this._options, options); }
    set(x, y, value) { this._map[x][y] = value; }
    create(callback) {
        let newMap = this._fillMap(0);
        let born = this._options.born;
        let survive = this._options.survive;
        for (let j = 0; j < this._height; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }
            for (let i = widthStart; i < this._width; i += widthStep) {
                let cur = this._map[i][j];
                let ncount = this._getNeighbors(i, j);
                if (cur && survive.indexOf(ncount) != -1) { /* survive */
                    newMap[i][j] = 1;
                }
                else if (!cur && born.indexOf(ncount) != -1) { /* born */
                    newMap[i][j] = 1;
                }
            }
        }
        this._map = newMap;
        callback && this._serviceCallback(callback);
    }
    _serviceCallback(callback) {
        for (let j = 0; j < this._height; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }
            for (let i = widthStart; i < this._width; i += widthStep) {
                callback(i, j, this._map[i][j]);
            }
        }
    }
    /**
     * Get neighbor count at [i,j] in this._map
     */
    _getNeighbors(cx, cy) {
        let result = 0;
        for (let i = 0; i < this._dirs.length; i++) {
            let dir = this._dirs[i];
            let x = cx + dir[0];
            let y = cy + dir[1];
            if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
                continue;
            }
            result += (this._map[x][y] == 1 ? 1 : 0);
        }
        return result;
    }
    /**
     * Make sure every non-wall space is accessible.
     * @param {function} callback to call to display map when do
     * @param {int} value to consider empty space - defaults to 0
     * @param {function} callback to call when a new connection is made
     */
    connect(callback, value, connectionCallback) {
        if (!value)
            value = 0;
        let allFreeSpace = [];
        let notConnected = {};
        // find all free space
        let widthStep = 1;
        let widthStarts = [0, 0];
        if (this._options.topology == 6) {
            widthStep = 2;
            widthStarts = [0, 1];
        }
        for (let y = 0; y < this._height; y++) {
            for (let x = widthStarts[y % 2]; x < this._width; x += widthStep) {
                if (this._freeSpace(x, y, value)) {
                    let p = [x, y];
                    notConnected[this._pointKey(p)] = p;
                    allFreeSpace.push([x, y]);
                }
            }
        }
        let start = allFreeSpace[rng["a" /* default */].getUniformInt(0, allFreeSpace.length - 1)];
        let key = this._pointKey(start);
        let connected = {};
        connected[key] = start;
        delete notConnected[key];
        // find what's connected to the starting point
        this._findConnected(connected, notConnected, [start], false, value);
        while (Object.keys(notConnected).length > 0) {
            // find two points from notConnected to connected
            let p = this._getFromTo(connected, notConnected);
            let from = p[0]; // notConnected
            let to = p[1]; // connected
            // find everything connected to the starting point
            let local = {};
            local[this._pointKey(from)] = from;
            this._findConnected(local, notConnected, [from], true, value);
            // connect to a connected cell
            let tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
            tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);
            // now all of local is connected
            for (let k in local) {
                let pp = local[k];
                this._map[pp[0]][pp[1]] = value;
                connected[k] = pp;
                delete notConnected[k];
            }
        }
        callback && this._serviceCallback(callback);
    }
    /**
     * Find random points to connect. Search for the closest point in the larger space.
     * This is to minimize the length of the passage while maintaining good performance.
     */
    _getFromTo(connected, notConnected) {
        let from = [0, 0], to = [0, 0], d;
        let connectedKeys = Object.keys(connected);
        let notConnectedKeys = Object.keys(notConnected);
        for (let i = 0; i < 5; i++) {
            if (connectedKeys.length < notConnectedKeys.length) {
                let keys = connectedKeys;
                to = connected[keys[rng["a" /* default */].getUniformInt(0, keys.length - 1)]];
                from = this._getClosest(to, notConnected);
            }
            else {
                let keys = notConnectedKeys;
                from = notConnected[keys[rng["a" /* default */].getUniformInt(0, keys.length - 1)]];
                to = this._getClosest(from, connected);
            }
            d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
            if (d < 64) {
                break;
            }
        }
        // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
        return [from, to];
    }
    _getClosest(point, space) {
        let minPoint = null;
        let minDist = null;
        for (let k in space) {
            let p = space[k];
            let d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
            if (minDist == null || d < minDist) {
                minDist = d;
                minPoint = p;
            }
        }
        return minPoint;
    }
    _findConnected(connected, notConnected, stack, keepNotConnected, value) {
        while (stack.length > 0) {
            let p = stack.splice(0, 1)[0];
            let tests;
            if (this._options.topology == 6) {
                tests = [
                    [p[0] + 2, p[1]],
                    [p[0] + 1, p[1] - 1],
                    [p[0] - 1, p[1] - 1],
                    [p[0] - 2, p[1]],
                    [p[0] - 1, p[1] + 1],
                    [p[0] + 1, p[1] + 1],
                ];
            }
            else {
                tests = [
                    [p[0] + 1, p[1]],
                    [p[0] - 1, p[1]],
                    [p[0], p[1] + 1],
                    [p[0], p[1] - 1]
                ];
            }
            for (let i = 0; i < tests.length; i++) {
                let key = this._pointKey(tests[i]);
                if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
                    connected[key] = tests[i];
                    if (!keepNotConnected) {
                        delete notConnected[key];
                    }
                    stack.push(tests[i]);
                }
            }
        }
    }
    _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
        let a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (let xx = a[0]; xx <= b[0]; xx++) {
            this._map[xx][a[1]] = value;
            let p = [xx, a[1]];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[0] < b[0]) {
            connectionCallback(a, [b[0], a[1]]);
        }
        // x is now fixed
        let x = b[0];
        if (from[1] < to[1]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (let yy = a[1]; yy < b[1]; yy++) {
            this._map[x][yy] = value;
            let p = [x, yy];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[1] < b[1]) {
            connectionCallback([b[0], a[1]], [b[0], b[1]]);
        }
    }
    _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
        let a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        // tunnel diagonally until horizontally level
        let xx = a[0];
        let yy = a[1];
        while (!(xx == b[0] && yy == b[1])) {
            let stepWidth = 2;
            if (yy < b[1]) {
                yy++;
                stepWidth = 1;
            }
            else if (yy > b[1]) {
                yy--;
                stepWidth = 1;
            }
            if (xx < b[0]) {
                xx += stepWidth;
            }
            else if (xx > b[0]) {
                xx -= stepWidth;
            }
            else if (b[1] % 2) {
                // Won't step outside map if destination on is map's right edge
                xx -= stepWidth;
            }
            else {
                // ditto for left edge
                xx += stepWidth;
            }
            this._map[xx][yy] = value;
            let p = [xx, yy];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback) {
            connectionCallback(from, to);
        }
    }
    _freeSpace(x, y, value) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
    }
    _pointKey(p) { return p[0] + "." + p[1]; }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/digger.js




const FEATURES = {
    "room": features_Room,
    "corridor": features_Corridor
};
/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */
class digger_Digger extends dungeon_Dungeon {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = Object.assign({
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            corridorLength: [3, 10],
            dugPercentage: 0.2,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        }, options);
        this._features = {
            "room": 4,
            "corridor": 4
        };
        this._map = [];
        this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
        this._walls = {}; /* these are available for digging */
        this._dug = 0;
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
        this._priorityWallCallback = this._priorityWallCallback.bind(this);
    }
    create(callback) {
        this._rooms = [];
        this._corridors = [];
        this._map = this._fillMap(1);
        this._walls = {};
        this._dug = 0;
        let area = (this._width - 2) * (this._height - 2);
        this._firstRoom();
        let t1 = Date.now();
        let priorityWalls;
        do {
            priorityWalls = 0;
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                break;
            }
            /* find a good wall */
            let wall = this._findWall();
            if (!wall) {
                break;
            } /* no more walls */
            let parts = wall.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            let dir = this._getDiggingDirection(x, y);
            if (!dir) {
                continue;
            } /* this wall is not suitable */
            //		console.log("wall", x, y);
            /* try adding a feature */
            let featureAttempts = 0;
            do {
                featureAttempts++;
                if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
                    //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
                    this._removeSurroundingWalls(x, y);
                    this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                    break;
                }
            } while (featureAttempts < this._featureAttempts);
            for (let id in this._walls) {
                if (this._walls[id] > 1) {
                    priorityWalls++;
                }
            }
        } while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */
        this._addDoors();
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        this._walls = {};
        this._map = [];
        return this;
    }
    _digCallback(x, y, value) {
        if (value == 0 || value == 2) { /* empty */
            this._map[x][y] = 0;
            this._dug++;
        }
        else { /* wall */
            this._walls[x + "," + y] = 1;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _priorityWallCallback(x, y) { this._walls[x + "," + y] = 2; }
    ;
    _firstRoom() {
        let cx = Math.floor(this._width / 2);
        let cy = Math.floor(this._height / 2);
        let room = features_Room.createRandomCenter(cx, cy, this._options);
        this._rooms.push(room);
        room.create(this._digCallback);
    }
    /**
     * Get a suitable wall
     */
    _findWall() {
        let prio1 = [];
        let prio2 = [];
        for (let id in this._walls) {
            let prio = this._walls[id];
            if (prio == 2) {
                prio2.push(id);
            }
            else {
                prio1.push(id);
            }
        }
        let arr = (prio2.length ? prio2 : prio1);
        if (!arr.length) {
            return null;
        } /* no walls :/ */
        let id = rng["a" /* default */].getItem(arr.sort()); // sort to make the order deterministic
        delete this._walls[id];
        return id;
    }
    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */
    _tryFeature(x, y, dx, dy) {
        let featureName = rng["a" /* default */].getWeightedValue(this._features);
        let ctor = FEATURES[featureName];
        let feature = ctor.createRandomAt(x, y, dx, dy, this._options);
        if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
            //		console.log("not valid");
            //		feature.debug();
            return false;
        }
        feature.create(this._digCallback);
        //	feature.debug();
        if (feature instanceof features_Room) {
            this._rooms.push(feature);
        }
        if (feature instanceof features_Corridor) {
            feature.createPriorityWalls(this._priorityWallCallback);
            this._corridors.push(feature);
        }
        return true;
    }
    _removeSurroundingWalls(cx, cy) {
        let deltas = DIRS[4];
        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            delete this._walls[x + "," + y];
            x = cx + 2 * delta[0];
            y = cy + 2 * delta[1];
            delete this._walls[x + "," + y];
        }
    }
    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */
    _getDiggingDirection(cx, cy) {
        if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
            return null;
        }
        let result = null;
        let deltas = DIRS[4];
        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            if (!this._map[x][y]) { /* there already is another empty neighbor! */
                if (result) {
                    return null;
                }
                result = delta;
            }
        }
        /* no empty neighbor */
        if (!result) {
            return null;
        }
        return [-result[0], -result[1]];
    }
    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */
    _addDoors() {
        let data = this._map;
        function isWallCallback(x, y) {
            return (data[x][y] == 1);
        }
        ;
        for (let i = 0; i < this._rooms.length; i++) {
            let room = this._rooms[i];
            room.clearDoors();
            room.addDoors(isWallCallback);
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/ellermaze.js


/**
 * Join lists with "i" and "i+1"
 */
function addToList(i, L, R) {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
}
/**
 * Remove "i" from its list
 */
function removeFromList(i, L, R) {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
}
/**
 * Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */
class ellermaze_EllerMaze extends map_Map {
    create(callback) {
        let map = this._fillMap(1);
        let w = Math.ceil((this._width - 2) / 2);
        let rand = 9 / 24;
        let L = [];
        let R = [];
        for (let i = 0; i < w; i++) {
            L.push(i);
            R.push(i);
        }
        L.push(w - 1); /* fake stop-block at the right side */
        let j;
        for (j = 1; j + 3 < this._height; j += 2) {
            /* one row */
            for (let i = 0; i < w; i++) {
                /* cell coords (will be always empty) */
                let x = 2 * i + 1;
                let y = j;
                map[x][y] = 0;
                /* right connection */
                if (i != L[i + 1] && rng["a" /* default */].getUniform() > rand) {
                    addToList(i, L, R);
                    map[x + 1][y] = 0;
                }
                /* bottom connection */
                if (i != L[i] && rng["a" /* default */].getUniform() > rand) {
                    /* remove connection */
                    removeFromList(i, L, R);
                }
                else {
                    /* create connection */
                    map[x][y + 1] = 0;
                }
            }
        }
        /* last row */
        for (let i = 0; i < w; i++) {
            /* cell coords (will be always empty) */
            let x = 2 * i + 1;
            let y = j;
            map[x][y] = 0;
            /* right connection */
            if (i != L[i + 1] && (i == L[i] || rng["a" /* default */].getUniform() > rand)) {
                /* dig right also if the cell is separated, so it gets connected to the rest of maze */
                addToList(i, L, R);
                map[x + 1][y] = 0;
            }
            removeFromList(i, L, R);
        }
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/dividedmaze.js


/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
class dividedmaze_DividedMaze extends map_Map {
    constructor() {
        super(...arguments);
        this._stack = [];
        this._map = [];
    }
    create(callback) {
        let w = this._width;
        let h = this._height;
        this._map = [];
        for (let i = 0; i < w; i++) {
            this._map.push([]);
            for (let j = 0; j < h; j++) {
                let border = (i == 0 || j == 0 || i + 1 == w || j + 1 == h);
                this._map[i].push(border ? 1 : 0);
            }
        }
        this._stack = [
            [1, 1, w - 2, h - 2]
        ];
        this._process();
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                callback(i, j, this._map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    _process() {
        while (this._stack.length) {
            let room = this._stack.shift(); /* [left, top, right, bottom] */
            this._partitionRoom(room);
        }
    }
    _partitionRoom(room) {
        let availX = [];
        let availY = [];
        for (let i = room[0] + 1; i < room[2]; i++) {
            let top = this._map[i][room[1] - 1];
            let bottom = this._map[i][room[3] + 1];
            if (top && bottom && !(i % 2)) {
                availX.push(i);
            }
        }
        for (let j = room[1] + 1; j < room[3]; j++) {
            let left = this._map[room[0] - 1][j];
            let right = this._map[room[2] + 1][j];
            if (left && right && !(j % 2)) {
                availY.push(j);
            }
        }
        if (!availX.length || !availY.length) {
            return;
        }
        let x = rng["a" /* default */].getItem(availX);
        let y = rng["a" /* default */].getItem(availY);
        this._map[x][y] = 1;
        let walls = [];
        let w = [];
        walls.push(w); /* left part */
        for (let i = room[0]; i < x; i++) {
            this._map[i][y] = 1;
            w.push([i, y]);
        }
        w = [];
        walls.push(w); /* right part */
        for (let i = x + 1; i <= room[2]; i++) {
            this._map[i][y] = 1;
            w.push([i, y]);
        }
        w = [];
        walls.push(w); /* top part */
        for (let j = room[1]; j < y; j++) {
            this._map[x][j] = 1;
            w.push([x, j]);
        }
        w = [];
        walls.push(w); /* bottom part */
        for (let j = y + 1; j <= room[3]; j++) {
            this._map[x][j] = 1;
            w.push([x, j]);
        }
        let solid = rng["a" /* default */].getItem(walls);
        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];
            if (w == solid) {
                continue;
            }
            let hole = rng["a" /* default */].getItem(w);
            this._map[hole[0]][hole[1]] = 0;
        }
        this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
        this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
        this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
        this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/iceymaze.js


/**
 * Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 */
class iceymaze_IceyMaze extends map_Map {
    constructor(width, height, regularity = 0) {
        super(width, height);
        this._regularity = regularity;
        this._map = [];
    }
    create(callback) {
        let width = this._width;
        let height = this._height;
        let map = this._fillMap(1);
        width -= (width % 2 ? 1 : 2);
        height -= (height % 2 ? 1 : 2);
        let cx = 0;
        let cy = 0;
        let nx = 0;
        let ny = 0;
        let done = 0;
        let blocked = false;
        let dirs = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ];
        do {
            cx = 1 + 2 * Math.floor(rng["a" /* default */].getUniform() * (width - 1) / 2);
            cy = 1 + 2 * Math.floor(rng["a" /* default */].getUniform() * (height - 1) / 2);
            if (!done) {
                map[cx][cy] = 0;
            }
            if (!map[cx][cy]) {
                this._randomize(dirs);
                do {
                    if (Math.floor(rng["a" /* default */].getUniform() * (this._regularity + 1)) == 0) {
                        this._randomize(dirs);
                    }
                    blocked = true;
                    for (let i = 0; i < 4; i++) {
                        nx = cx + dirs[i][0] * 2;
                        ny = cy + dirs[i][1] * 2;
                        if (this._isFree(map, nx, ny, width, height)) {
                            map[nx][ny] = 0;
                            map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
                            cx = nx;
                            cy = ny;
                            blocked = false;
                            done++;
                            break;
                        }
                    }
                } while (!blocked);
            }
        } while (done + 1 < width * height / 4);
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    _randomize(dirs) {
        for (let i = 0; i < 4; i++) {
            dirs[i][0] = 0;
            dirs[i][1] = 0;
        }
        switch (Math.floor(rng["a" /* default */].getUniform() * 4)) {
            case 0:
                dirs[0][0] = -1;
                dirs[1][0] = 1;
                dirs[2][1] = -1;
                dirs[3][1] = 1;
                break;
            case 1:
                dirs[3][0] = -1;
                dirs[2][0] = 1;
                dirs[1][1] = -1;
                dirs[0][1] = 1;
                break;
            case 2:
                dirs[2][0] = -1;
                dirs[3][0] = 1;
                dirs[0][1] = -1;
                dirs[1][1] = 1;
                break;
            case 3:
                dirs[1][0] = -1;
                dirs[0][0] = 1;
                dirs[3][1] = -1;
                dirs[2][1] = 1;
                break;
        }
    }
    _isFree(map, x, y, width, height) {
        if (x < 1 || y < 1 || x >= width || y >= height) {
            return false;
        }
        return map[x][y];
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/rogue.js



/**
 * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @author hyakugei
 */
class rogue_Rogue extends map_Map {
    constructor(width, height, options) {
        super(width, height);
        this.map = [];
        this.rooms = [];
        this.connectedCells = [];
        options = Object.assign({
            cellWidth: 3,
            cellHeight: 3 //     ie. as an array with min-max values for each direction....
        }, options);
        /*
        Set the room sizes according to the over-all width of the map,
        and the cell sizes.
        */
        if (!options.hasOwnProperty("roomWidth")) {
            options["roomWidth"] = this._calculateRoomSize(this._width, options["cellWidth"]);
        }
        if (!options.hasOwnProperty("roomHeight")) {
            options["roomHeight"] = this._calculateRoomSize(this._height, options["cellHeight"]);
        }
        this._options = options;
    }
    create(callback) {
        this.map = this._fillMap(1);
        this.rooms = [];
        this.connectedCells = [];
        this._initRooms();
        this._connectRooms();
        this._connectUnconnectedRooms();
        this._createRandomRoomConnections();
        this._createRooms();
        this._createCorridors();
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this.map[i][j]);
                }
            }
        }
        return this;
    }
    _calculateRoomSize(size, cell) {
        let max = Math.floor((size / cell) * 0.8);
        let min = Math.floor((size / cell) * 0.25);
        if (min < 2) {
            min = 2;
        }
        if (max < 2) {
            max = 2;
        }
        return [min, max];
    }
    _initRooms() {
        // create rooms array. This is the "grid" list from the algo.
        for (let i = 0; i < this._options.cellWidth; i++) {
            this.rooms.push([]);
            for (let j = 0; j < this._options.cellHeight; j++) {
                this.rooms[i].push({ "x": 0, "y": 0, "width": 0, "height": 0, "connections": [], "cellx": i, "celly": j });
            }
        }
    }
    _connectRooms() {
        //pick random starting grid
        let cgx = rng["a" /* default */].getUniformInt(0, this._options.cellWidth - 1);
        let cgy = rng["a" /* default */].getUniformInt(0, this._options.cellHeight - 1);
        let idx;
        let ncgx;
        let ncgy;
        let found = false;
        let room;
        let otherRoom;
        let dirToCheck;
        // find  unconnected neighbour cells
        do {
            //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
            dirToCheck = [0, 2, 4, 6];
            dirToCheck = rng["a" /* default */].shuffle(dirToCheck);
            do {
                found = false;
                idx = dirToCheck.pop();
                ncgx = cgx + DIRS[8][idx][0];
                ncgy = cgy + DIRS[8][idx][1];
                if (ncgx < 0 || ncgx >= this._options.cellWidth) {
                    continue;
                }
                if (ncgy < 0 || ncgy >= this._options.cellHeight) {
                    continue;
                }
                room = this.rooms[cgx][cgy];
                if (room["connections"].length > 0) {
                    // as long as this room doesn't already coonect to me, we are ok with it.
                    if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
                        break;
                    }
                }
                otherRoom = this.rooms[ncgx][ncgy];
                if (otherRoom["connections"].length == 0) {
                    otherRoom["connections"].push([cgx, cgy]);
                    this.connectedCells.push([ncgx, ncgy]);
                    cgx = ncgx;
                    cgy = ncgy;
                    found = true;
                }
            } while (dirToCheck.length > 0 && found == false);
        } while (dirToCheck.length > 0);
    }
    _connectUnconnectedRooms() {
        //While there are unconnected rooms, try to connect them to a random connected neighbor
        //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        this.connectedCells = rng["a" /* default */].shuffle(this.connectedCells);
        let room;
        let otherRoom;
        let validRoom;
        for (let i = 0; i < this._options.cellWidth; i++) {
            for (let j = 0; j < this._options.cellHeight; j++) {
                room = this.rooms[i][j];
                if (room["connections"].length == 0) {
                    let directions = [0, 2, 4, 6];
                    directions = rng["a" /* default */].shuffle(directions);
                    validRoom = false;
                    do {
                        let dirIdx = directions.pop();
                        let newI = i + DIRS[8][dirIdx][0];
                        let newJ = j + DIRS[8][dirIdx][1];
                        if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
                            continue;
                        }
                        otherRoom = this.rooms[newI][newJ];
                        validRoom = true;
                        if (otherRoom["connections"].length == 0) {
                            break;
                        }
                        for (let k = 0; k < otherRoom["connections"].length; k++) {
                            if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                                validRoom = false;
                                break;
                            }
                        }
                        if (validRoom) {
                            break;
                        }
                    } while (directions.length);
                    if (validRoom) {
                        room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
                    }
                    else {
                        console.log("-- Unable to connect room.");
                    }
                }
            }
        }
    }
    _createRandomRoomConnections() {
        // Empty for now.
    }
    _createRooms() {
        let w = this._width;
        let h = this._height;
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        let cwp = Math.floor(this._width / cw);
        let chp = Math.floor(this._height / ch);
        let roomw;
        let roomh;
        let roomWidth = this._options["roomWidth"];
        let roomHeight = this._options["roomHeight"];
        let sx;
        let sy;
        let otherRoom;
        for (let i = 0; i < cw; i++) {
            for (let j = 0; j < ch; j++) {
                sx = cwp * i;
                sy = chp * j;
                if (sx == 0) {
                    sx = 1;
                }
                if (sy == 0) {
                    sy = 1;
                }
                roomw = rng["a" /* default */].getUniformInt(roomWidth[0], roomWidth[1]);
                roomh = rng["a" /* default */].getUniformInt(roomHeight[0], roomHeight[1]);
                if (j > 0) {
                    otherRoom = this.rooms[i][j - 1];
                    while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
                        sy++;
                    }
                }
                if (i > 0) {
                    otherRoom = this.rooms[i - 1][j];
                    while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
                        sx++;
                    }
                }
                let sxOffset = Math.round(rng["a" /* default */].getUniformInt(0, cwp - roomw) / 2);
                let syOffset = Math.round(rng["a" /* default */].getUniformInt(0, chp - roomh) / 2);
                while (sx + sxOffset + roomw >= w) {
                    if (sxOffset) {
                        sxOffset--;
                    }
                    else {
                        roomw--;
                    }
                }
                while (sy + syOffset + roomh >= h) {
                    if (syOffset) {
                        syOffset--;
                    }
                    else {
                        roomh--;
                    }
                }
                sx = sx + sxOffset;
                sy = sy + syOffset;
                this.rooms[i][j]["x"] = sx;
                this.rooms[i][j]["y"] = sy;
                this.rooms[i][j]["width"] = roomw;
                this.rooms[i][j]["height"] = roomh;
                for (let ii = sx; ii < sx + roomw; ii++) {
                    for (let jj = sy; jj < sy + roomh; jj++) {
                        this.map[ii][jj] = 0;
                    }
                }
            }
        }
    }
    _getWallPosition(aRoom, aDirection) {
        let rx;
        let ry;
        let door;
        if (aDirection == 1 || aDirection == 3) {
            rx = rng["a" /* default */].getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
            if (aDirection == 1) {
                ry = aRoom["y"] - 2;
                door = ry + 1;
            }
            else {
                ry = aRoom["y"] + aRoom["height"] + 1;
                door = ry - 1;
            }
            this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        else {
            ry = rng["a" /* default */].getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
            if (aDirection == 2) {
                rx = aRoom["x"] + aRoom["width"] + 1;
                door = rx - 1;
            }
            else {
                rx = aRoom["x"] - 2;
                door = rx + 1;
            }
            this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        return [rx, ry];
    }
    _drawCorridor(startPosition, endPosition) {
        let xOffset = endPosition[0] - startPosition[0];
        let yOffset = endPosition[1] - startPosition[1];
        let xpos = startPosition[0];
        let ypos = startPosition[1];
        let tempDist;
        let xDir;
        let yDir;
        let move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
        let moves = []; // a list of 2 element arrays
        let xAbs = Math.abs(xOffset);
        let yAbs = Math.abs(yOffset);
        let percent = rng["a" /* default */].getUniform(); // used to split the move at different places along the long axis
        let firstHalf = percent;
        let secondHalf = 1 - percent;
        xDir = xOffset > 0 ? 2 : 6;
        yDir = yOffset > 0 ? 4 : 0;
        if (xAbs < yAbs) {
            // move firstHalf of the y offset
            tempDist = Math.ceil(yAbs * firstHalf);
            moves.push([yDir, tempDist]);
            // move all the x offset
            moves.push([xDir, xAbs]);
            // move sendHalf of the  y offset
            tempDist = Math.floor(yAbs * secondHalf);
            moves.push([yDir, tempDist]);
        }
        else {
            //  move firstHalf of the x offset
            tempDist = Math.ceil(xAbs * firstHalf);
            moves.push([xDir, tempDist]);
            // move all the y offset
            moves.push([yDir, yAbs]);
            // move secondHalf of the x offset.
            tempDist = Math.floor(xAbs * secondHalf);
            moves.push([xDir, tempDist]);
        }
        this.map[xpos][ypos] = 0;
        while (moves.length > 0) {
            move = moves.pop();
            while (move[1] > 0) {
                xpos += DIRS[8][move[0]][0];
                ypos += DIRS[8][move[0]][1];
                this.map[xpos][ypos] = 0;
                move[1] = move[1] - 1;
            }
        }
    }
    _createCorridors() {
        // Draw Corridors between connected rooms
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        let room;
        let connection;
        let otherRoom;
        let wall;
        let otherWall;
        for (let i = 0; i < cw; i++) {
            for (let j = 0; j < ch; j++) {
                room = this.rooms[i][j];
                for (let k = 0; k < room["connections"].length; k++) {
                    connection = room["connections"][k];
                    otherRoom = this.rooms[connection[0]][connection[1]];
                    // figure out what wall our corridor will start one.
                    // figure out what wall our corridor will end on.
                    if (otherRoom["cellx"] > room["cellx"]) {
                        wall = 2;
                        otherWall = 4;
                    }
                    else if (otherRoom["cellx"] < room["cellx"]) {
                        wall = 4;
                        otherWall = 2;
                    }
                    else if (otherRoom["celly"] > room["celly"]) {
                        wall = 3;
                        otherWall = 1;
                    }
                    else {
                        wall = 1;
                        otherWall = 3;
                    }
                    this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
                }
            }
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/index.js








/* harmony default export */ var lib_map = ({ Arena: arena_Arena, Uniform: uniform_Uniform, Cellular: cellular_Cellular, Digger: digger_Digger, EllerMaze: ellermaze_EllerMaze, DividedMaze: dividedmaze_DividedMaze, IceyMaze: iceymaze_IceyMaze, Rogue: rogue_Rogue });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/noise.js
/**
 * Base noise generator
 */
class Noise {
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/simplex.js



const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */
class simplex_Simplex extends Noise {
    /**
     * @param gradients Random gradients
     */
    constructor(gradients = 256) {
        super();
        this._gradients = [
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1]
        ];
        let permutations = [];
        for (let i = 0; i < gradients; i++) {
            permutations.push(i);
        }
        permutations = rng["a" /* default */].shuffle(permutations);
        this._perms = [];
        this._indexes = [];
        for (let i = 0; i < 2 * gradients; i++) {
            this._perms.push(permutations[i % gradients]);
            this._indexes.push(this._perms[i] % this._gradients.length);
        }
    }
    get(xin, yin) {
        let perms = this._perms;
        let indexes = this._indexes;
        let count = perms.length / 2;
        let n0 = 0, n1 = 0, n2 = 0, gi; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        let s = (xin + yin) * F2; // Hairy factor for 2D
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let t = (i + j) * G2;
        let X0 = i - t; // Unskew the cell origin back to (x,y) space
        let Y0 = j - t;
        let x0 = xin - X0; // The x,y distances from the cell origin
        let y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1 + 2 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        let ii = Object(util["mod"])(i, count);
        let jj = Object(util["mod"])(j, count);
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            gi = indexes[ii + perms[jj]];
            let grad = this._gradients[gi];
            n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            gi = indexes[ii + i1 + perms[jj + j1]];
            let grad = this._gradients[gi];
            n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            gi = indexes[ii + 1 + perms[jj + 1]];
            let grad = this._gradients[gi];
            n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/index.js

/* harmony default export */ var noise = ({ Simplex: simplex_Simplex });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/path.js

/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
class path_Path {
    constructor(toX, toY, passableCallback, options = {}) {
        this._toX = toX;
        this._toY = toY;
        this._passableCallback = passableCallback;
        this._options = Object.assign({
            topology: 8
        }, options);
        this._dirs = DIRS[this._options.topology];
        if (this._options.topology == 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
            this._dirs = [
                this._dirs[0],
                this._dirs[2],
                this._dirs[4],
                this._dirs[6],
                this._dirs[1],
                this._dirs[3],
                this._dirs[5],
                this._dirs[7]
            ];
        }
    }
    _getNeighbors(cx, cy) {
        let result = [];
        for (let i = 0; i < this._dirs.length; i++) {
            let dir = this._dirs[i];
            let x = cx + dir[0];
            let y = cy + dir[1];
            if (!this._passableCallback(x, y)) {
                continue;
            }
            result.push([x, y]);
        }
        return result;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/dijkstra.js

/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class dijkstra_Dijkstra extends path_Path {
    constructor(toX, toY, passableCallback, options) {
        super(toX, toY, passableCallback, options);
        this._computed = {};
        this._todo = [];
        this._add(toX, toY, null);
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX, fromY, callback) {
        let key = fromX + "," + fromY;
        if (!(key in this._computed)) {
            this._compute(fromX, fromY);
        }
        if (!(key in this._computed)) {
            return;
        }
        let item = this._computed[key];
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    }
    /**
     * Compute a non-cached value
     */
    _compute(fromX, fromY) {
        while (this._todo.length) {
            let item = this._todo.shift();
            if (item.x == fromX && item.y == fromY) {
                return;
            }
            let neighbors = this._getNeighbors(item.x, item.y);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let x = neighbor[0];
                let y = neighbor[1];
                let id = x + "," + y;
                if (id in this._computed) {
                    continue;
                } /* already done */
                this._add(x, y, item);
            }
        }
    }
    _add(x, y, prev) {
        let obj = {
            x: x,
            y: y,
            prev: prev
        };
        this._computed[x + "," + y] = obj;
        this._todo.push(obj);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/astar.js

/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class astar_AStar extends path_Path {
    constructor(toX, toY, passableCallback, options = {}) {
        super(toX, toY, passableCallback, options);
        this._todo = [];
        this._done = {};
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX, fromY, callback) {
        this._todo = [];
        this._done = {};
        this._fromX = fromX;
        this._fromY = fromY;
        this._add(this._toX, this._toY, null);
        while (this._todo.length) {
            let item = this._todo.shift();
            let id = item.x + "," + item.y;
            if (id in this._done) {
                continue;
            }
            this._done[id] = item;
            if (item.x == fromX && item.y == fromY) {
                break;
            }
            let neighbors = this._getNeighbors(item.x, item.y);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let x = neighbor[0];
                let y = neighbor[1];
                let id = x + "," + y;
                if (id in this._done) {
                    continue;
                }
                this._add(x, y, item);
            }
        }
        let item = this._done[fromX + "," + fromY];
        if (!item) {
            return;
        }
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    }
    _add(x, y, prev) {
        let h = this._distance(x, y);
        let obj = {
            x: x,
            y: y,
            prev: prev,
            g: (prev ? prev.g + 1 : 0),
            h: h
        };
        /* insert into priority queue */
        let f = obj.g + obj.h;
        for (let i = 0; i < this._todo.length; i++) {
            let item = this._todo[i];
            let itemF = item.g + item.h;
            if (f < itemF || (f == itemF && h < item.h)) {
                this._todo.splice(i, 0, obj);
                return;
            }
        }
        this._todo.push(obj);
    }
    _distance(x, y) {
        switch (this._options.topology) {
            case 4:
                return (Math.abs(x - this._fromX) + Math.abs(y - this._fromY));
                break;
            case 6:
                let dx = Math.abs(x - this._fromX);
                let dy = Math.abs(y - this._fromY);
                return dy + Math.max(0, (dx - dy) / 2);
                break;
            case 8:
                return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
                break;
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/index.js


/* harmony default export */ var path = ({ Dijkstra: dijkstra_Dijkstra, AStar: astar_AStar });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/engine.js
/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
class Engine {
    constructor(scheduler) {
        this._scheduler = scheduler;
        this._lock = 1;
    }
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */
    start() { return this.unlock(); }
    /**
     * Interrupt the engine by an asynchronous action
     */
    lock() {
        this._lock++;
        return this;
    }
    /**
     * Resume execution (paused by a previous lock)
     */
    unlock() {
        if (!this._lock) {
            throw new Error("Cannot unlock unlocked engine");
        }
        this._lock--;
        while (!this._lock) {
            let actor = this._scheduler.next();
            if (!actor) {
                return this.lock();
            } /* no actors */
            let result = actor.act();
            if (result && result.then) { /* actor returned a "thenable", looks like a Promise */
                this.lock();
                result.then(this.unlock.bind(this));
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/lighting.js

;
;
;
;
/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
class lighting_Lighting {
    constructor(reflectivityCallback, options = {}) {
        this._reflectivityCallback = reflectivityCallback;
        this._options = {};
        options = Object.assign({
            passes: 1,
            emissionThreshold: 100,
            range: 10
        }, options);
        this._lights = {};
        this._reflectivityCache = {};
        this._fovCache = {};
        this.setOptions(options);
    }
    /**
     * Adjust options at runtime
     */
    setOptions(options) {
        Object.assign(this._options, options);
        if (options && options.range) {
            this.reset();
        }
        return this;
    }
    /**
     * Set the used Field-Of-View algo
     */
    setFOV(fov) {
        this._fov = fov;
        this._fovCache = {};
        return this;
    }
    /**
     * Set (or remove) a light source
     */
    setLight(x, y, color) {
        let key = x + "," + y;
        if (color) {
            this._lights[key] = (typeof (color) == "string" ? lib_color["fromString"](color) : color);
        }
        else {
            delete this._lights[key];
        }
        return this;
    }
    /**
     * Remove all light sources
     */
    clearLights() { this._lights = {}; }
    /**
     * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
     */
    reset() {
        this._reflectivityCache = {};
        this._fovCache = {};
        return this;
    }
    /**
     * Compute the lighting
     */
    compute(lightingCallback) {
        let doneCells = {};
        let emittingCells = {};
        let litCells = {};
        for (let key in this._lights) { /* prepare emitters for first pass */
            let light = this._lights[key];
            emittingCells[key] = [0, 0, 0];
            lib_color["add_"](emittingCells[key], light);
        }
        for (let i = 0; i < this._options.passes; i++) { /* main loop */
            this._emitLight(emittingCells, litCells, doneCells);
            if (i + 1 == this._options.passes) {
                continue;
            } /* not for the last pass */
            emittingCells = this._computeEmitters(litCells, doneCells);
        }
        for (let litKey in litCells) { /* let the user know what and how is lit */
            let parts = litKey.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            lightingCallback(x, y, litCells[litKey]);
        }
        return this;
    }
    /**
     * Compute one iteration from all emitting cells
     * @param emittingCells These emit light
     * @param litCells Add projected light to these
     * @param doneCells These already emitted, forbid them from further calculations
     */
    _emitLight(emittingCells, litCells, doneCells) {
        for (let key in emittingCells) {
            let parts = key.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            this._emitLightFromCell(x, y, emittingCells[key], litCells);
            doneCells[key] = 1;
        }
        return this;
    }
    /**
     * Prepare a list of emitters for next pass
     */
    _computeEmitters(litCells, doneCells) {
        let result = {};
        for (let key in litCells) {
            if (key in doneCells) {
                continue;
            } /* already emitted */
            let color = litCells[key];
            let reflectivity;
            if (key in this._reflectivityCache) {
                reflectivity = this._reflectivityCache[key];
            }
            else {
                let parts = key.split(",");
                let x = parseInt(parts[0]);
                let y = parseInt(parts[1]);
                reflectivity = this._reflectivityCallback(x, y);
                this._reflectivityCache[key] = reflectivity;
            }
            if (reflectivity == 0) {
                continue;
            } /* will not reflect at all */
            /* compute emission color */
            let emission = [0, 0, 0];
            let intensity = 0;
            for (let i = 0; i < 3; i++) {
                let part = Math.round(color[i] * reflectivity);
                emission[i] = part;
                intensity += part;
            }
            if (intensity > this._options.emissionThreshold) {
                result[key] = emission;
            }
        }
        return result;
    }
    /**
     * Compute one iteration from one cell
     */
    _emitLightFromCell(x, y, color, litCells) {
        let key = x + "," + y;
        let fov;
        if (key in this._fovCache) {
            fov = this._fovCache[key];
        }
        else {
            fov = this._updateFOV(x, y);
        }
        for (let fovKey in fov) {
            let formFactor = fov[fovKey];
            let result;
            if (fovKey in litCells) { /* already lit */
                result = litCells[fovKey];
            }
            else { /* newly lit */
                result = [0, 0, 0];
                litCells[fovKey] = result;
            }
            for (let i = 0; i < 3; i++) {
                result[i] += Math.round(color[i] * formFactor);
            } /* add light color */
        }
        return this;
    }
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     */
    _updateFOV(x, y) {
        let key1 = x + "," + y;
        let cache = {};
        this._fovCache[key1] = cache;
        let range = this._options.range;
        function cb(x, y, r, vis) {
            let key2 = x + "," + y;
            let formFactor = vis * (1 - r / range);
            if (formFactor == 0) {
                return;
            }
            cache[key2] = formFactor;
        }
        ;
        this._fov.compute(x, y, range, cb.bind(this));
        return cache;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/index.js













const Util = util;

const Color = lib_color;

const Text = text_namespaceObject;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const game_1 = __webpack_require__(52);

const world_1 = __webpack_require__(134);

const renderer_1 = __webpack_require__(136);

const world = new world_1.World();
const renderer = renderer_1.RotRenderer.createAndMount(document.getElementById('tlb'));
const game = new game_1.Game(world, renderer, 60);
game.init();
game.execute();

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tlb_1 = __webpack_require__(53);

const running_1 = __webpack_require__(116);

const map_creation_1 = __webpack_require__(118);

const queries_1 = __webpack_require__(120);

const distributions_1 = __webpack_require__(131);

class Game {
  constructor(world, renderer, targetFps) {
    this.world = world;
    this.renderer = renderer;
    this.targetFps = targetFps;
    this.computeTime = 0;
    this.frames = 0;
    this.renderTime = 0;
    this.started = 0;
    this.currentState = -1;
    this.states = [];
    this.rayCaster = new queries_1.Queries();
    this.uniform = new distributions_1.Uniform('some seed');
  }

  init() {
    tlb_1.registerComponents(this.world);
    tlb_1.registerResources(this.world, this.uniform, this.renderer);
    tlb_1.registerSystems(this.world, this.uniform, this.rayCaster, s => this.pushState(s));
    const running = new running_1.Running(this.uniform);
    const mapCreation = new map_creation_1.MapCreation();
    this.states = [running, mapCreation];
  }

  execute() {
    this.enterState();
    this.started = Date.now();
    this.tick();
  }

  tick() {
    if (this.currentState != this.states.length - 1) {
      this.enterState();
    }

    const state = this.states[this.currentState];
    let msLeft = 1000 / this.targetFps;
    const startRender = Date.now();
    this.world.updateResources();
    this.renderer.render(this.world);
    const renderDelta = Date.now() - startRender;
    msLeft -= renderDelta;
    this.renderTime += renderDelta;
    state.update(this.world, s => this.pushState(s));

    while (true) {
      const start = Date.now();
      this.world.updateSystems();
      const delta = Date.now() - start;
      msLeft -= delta;
      this.computeTime += delta;

      if (state.isFrameLocked() || state.isDone(this.world) || msLeft < delta) {
        break;
      }
    }

    if (this.currentState < this.states.length - 1) {
      state.stop(this.world);
    } else if (state.isDone(this.world)) {
      state.stop(this.world);
      this.states.pop();

      if (this.states.length === 0) {
        return;
      }
    }

    this.frames++;

    if (this.frames % 100 === 0) {
      console.log(`${this.mspf.toFixed(2)} ms per frame @${this.fps.toFixed(1)} FPS`);
      console.log(`(computation, rendering) = (${this.mscpf.toFixed(2)}, ${this.msrpf.toFixed(2)}) ms`);
      console.log(`Entities: ${this.world.entityCount}`);
      this.frames = 0;
      this.computeTime = 0;
      this.renderTime = 0;
      this.started = Date.now();
    }

    requestAnimationFrame(() => this.tick());
  }

  get fps() {
    return this.frames / ((Date.now() - this.started) / 1000);
  }

  get mspf() {
    return (this.computeTime + this.renderTime) / this.frames;
  }

  get msrpf() {
    return this.renderTime / this.frames;
  }

  get mscpf() {
    return this.computeTime / this.frames;
  }

  pushState(state) {
    this.states.push(state);
  }

  enterState() {
    this.currentState = this.states.length - 1;
    this.states[this.currentState].start(this.world);
  }

}

exports.Game = Game;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const storage_1 = __webpack_require__(54);

const fov_1 = __webpack_require__(55);

const free_mode_control_1 = __webpack_require__(56);

const npc_1 = __webpack_require__(57);

const player_control_1 = __webpack_require__(87);

const player_interaction_1 = __webpack_require__(88);

const region_builder_1 = __webpack_require__(89);

const player_round_control_1 = __webpack_require__(104);

const trigger_1 = __webpack_require__(106);

const script_1 = __webpack_require__(107);

const world_map_1 = __webpack_require__(109);

const viewport_1 = __webpack_require__(110);

const input_1 = __webpack_require__(111);

const ui_1 = __webpack_require__(22);

const log_1 = __webpack_require__(112);

const ai_round_control_1 = __webpack_require__(113);

const start_round_1 = __webpack_require__(114);

const progress_1 = __webpack_require__(115);

function registerComponents(world) {
  world.registerComponentStorage('active', new storage_1.SetStorage());
  world.registerComponentStorage('age', new storage_1.MapStorage());
  world.registerComponentStorage('ai', new storage_1.MapStorage());
  world.registerComponentStorage('asset', new storage_1.MapStorage());
  world.registerComponentStorage('character-stats', new storage_1.MapStorage());
  world.registerComponentStorage('character-type', new storage_1.MapStorage());
  world.registerComponentStorage('dead', new storage_1.SetStorage());
  world.registerComponentStorage('dialog', new storage_1.MapStorage());
  world.registerComponentStorage('feature', new storage_1.VectorStorage());
  world.registerComponentStorage('fov', new storage_1.MapStorage());
  world.registerComponentStorage('free-mode-anchor', new storage_1.SingletonStorage());
  world.registerComponentStorage('ground', new storage_1.MapStorage());
  world.registerComponentStorage('inventory', new storage_1.MapStorage());
  world.registerComponentStorage('structure', new storage_1.MapStorage());
  world.registerComponentStorage('lore', new storage_1.MapStorage());
  world.registerComponentStorage('equiped-items', new storage_1.MapStorage());
  world.registerComponentStorage('item', new storage_1.MapStorage());
  world.registerComponentStorage('npc', new storage_1.SetStorage());
  world.registerComponentStorage('overlay', new storage_1.MapStorage());
  world.registerComponentStorage('quest', new storage_1.MapStorage());
  world.registerComponentStorage('player', new storage_1.SingletonStorage());
  world.registerComponentStorage('position', new storage_1.VectorStorage());
  world.registerComponentStorage('region', new storage_1.MapStorage());
  world.registerComponentStorage('script', new storage_1.MapStorage());
  world.registerComponentStorage('active-effects', new storage_1.MapStorage());
  world.registerComponentStorage('spawn', new storage_1.SingletonStorage());
  world.registerComponentStorage('take-turn', new storage_1.MapStorage());
  world.registerComponentStorage('took-turn', new storage_1.SetStorage());
  world.registerComponentStorage('start-turn', new storage_1.SetStorage());
  world.registerComponentStorage('triggered-by', new storage_1.MapStorage());
  world.registerComponentStorage('triggers', new storage_1.MapStorage());
  world.registerComponentStorage('viewport-focus', new storage_1.SingletonStorage());
  world.registerComponentStorage('wait-turn', new storage_1.SetStorage());
}

exports.registerComponents = registerComponents;

function registerResources(world, uniform, renderer, worldWidth = 256) {
  world.registerResource(new world_map_1.WorldMapResource(worldWidth));
  world.registerResource(new viewport_1.ViewportResource(renderer.boundaries));
  world.registerResource(new input_1.InputResource(e => renderer.eventToPosition(e)));
  world.registerResource(new ui_1.UIResource(uniform));
  world.registerResource(new log_1.LogResource());
  world.registerResource(new progress_1.ProgressResource());
}

exports.registerResources = registerResources;

function registerSystems(world, uniform, queries, pushState) {
  world.registerSystem('ai-round-control', new ai_round_control_1.AiRoundControl(queries, uniform));
  world.registerSystem('fov', new fov_1.Fov(queries));
  world.registerSystem('free-mode-control', new free_mode_control_1.FreeModeControl());
  world.registerSystem('npc', new npc_1.Npc(queries, uniform, pushState));
  world.registerSystem('player-control', new player_control_1.PlayerControl());
  world.registerSystem('player-interaction', new player_interaction_1.PlayerInteraction(pushState));
  world.registerSystem('player-round-control', new player_round_control_1.PlayerRoundControl(queries, pushState, uniform));
  world.registerSystem('region-builder', new region_builder_1.RegionBuilder(uniform));
  world.registerSystem('script', new script_1.Script());
  world.registerSystem('trigger', new trigger_1.Trigger(uniform, pushState));
  world.registerSystem('start-round', new start_round_1.StartRound(uniform));
}

exports.registerSystems = registerSystems;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class SetStorage {
  constructor() {
    this.data = new Set();
  }

  size() {
    return this.data.size;
  }

  insert(entity, _) {
    this.data.add(entity);
  }

  clear() {
    this.data.clear();
  }

  get(entity) {
    return this.data.has(entity) ? {} : undefined;
  }

  remove(entity) {
    return this.data.delete(entity) ? {} : undefined;
  }

  has(entity) {
    return this.data.has(entity);
  }

  foreach(f) {
    this.data.forEach(v => f(v, {}));
  }

  first() {
    return this.data.keys().next().value;
  }

}

exports.SetStorage = SetStorage;

class SingletonStorage {
  constructor() {
    this.datum = undefined;
    this.value = undefined;
  }

  size() {
    return this.datum !== undefined ? 1 : 0;
  }

  insert(entity, value) {
    this.datum = entity;
    this.value = value;
  }

  clear() {
    this.datum = undefined;
  }

  get(entity) {
    return this.datum === entity ? this.value : undefined;
  }

  remove(entity) {
    if (this.datum === entity) {
      this.datum = undefined;
      return this.value;
    }

    return undefined;
  }

  has(entity) {
    return this.datum === entity;
  }

  foreach(f) {
    if (this.datum !== undefined) {
      f(this.datum, this.value);
    }
  }

  first() {
    return this.datum;
  }

}

exports.SingletonStorage = SingletonStorage;

class MapStorage {
  constructor() {
    this.data = new Map();
  }

  size() {
    return this.data.size;
  }

  insert(entity, value) {
    this.data.set(entity, value);
  }

  clear() {
    this.data.clear();
  }

  get(entity) {
    return this.data.get(entity);
  }

  remove(entity) {
    const value = this.get(entity);
    this.data.delete(entity);
    return value;
  }

  has(entity) {
    return this.data.has(entity);
  }

  foreach(f) {
    this.data.forEach((value, entity) => f(entity, value));
  }

  first() {
    return this.data.keys().next().value;
  }

}

exports.MapStorage = MapStorage;

class VectorStorage {
  constructor() {
    this.data = [];
    this.count = 0;
  }

  size() {
    return this.count;
  }

  insert(entity, value) {
    if (this.data[entity] === undefined) {
      this.count++;
    }

    this.data[entity] = value;
  }

  clear() {
    this.data = [];
  }

  get(entity) {
    return this.data[entity];
  }

  remove(entity) {
    if (this.data[entity] !== undefined) {
      this.count--;
    }

    const value = this.get(entity);
    delete this.data[entity];
    return value;
  }

  has(entity) {
    return this.data[entity] !== undefined;
  }

  foreach(f) {
    for (let entity = 0; entity < this.data.length; entity++) {
      const value = this.data[entity];

      if (value !== undefined) {
        f(entity, value);
      }
    }
  }

  first() {
    for (let entity = 0; entity < this.data.length; entity++) {
      const value = this.data[entity];

      if (value !== undefined) {
        return entity;
      }
    }

    return undefined;
  }

}

exports.VectorStorage = VectorStorage;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class Fov {
  constructor(queries) {
    this.queries = queries;
    this.components = ['fov', 'position'];
  }

  update(world, entity) {
    const fov = world.getComponent(entity, 'fov');
    const position = world.getComponent(entity, 'position');
    fov.fov.clear();
    this.queries.fov(world, position.level, position.position, p => fov.fov.set(p));
  }

}

exports.Fov = Fov;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class FreeModeControl {
  constructor() {
    this.components = ['free-mode-anchor', 'position'];
  }

  update(world, entity) {
    const position = world.getComponent(entity, 'position');
    const input = world.getResource('input');
    const delta = input.createMovementDelta();

    if (delta.squaredLength() > 0) {
      const newPosition = position.position.add(delta);
      world.editEntity(entity).withComponent('position', {
        level: position.level,
        position: newPosition
      });
    }
  }

}

exports.FreeModeControl = FreeModeControl;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const turn_based_1 = __webpack_require__(21);

const ui_1 = __webpack_require__(22);

const random_1 = __webpack_require__(5);

const ai_1 = __webpack_require__(41);

const region_1 = __webpack_require__(42);

class Npc {
  constructor(queries, distribution, pushState) {
    this.queries = queries;
    this.distribution = distribution;
    this.pushState = pushState;
    this.components = ['npc', 'ai', 'position'];
    this.random = new random_1.Random(distribution);
  }

  update(world, entity) {
    const position = world.getComponent(entity, 'position');
    const ai = world.getComponent(entity, 'ai');
    const ui = world.getResource('ui');

    if (ai.state === 'idle' && !ui.isModal) {
      if (ai.interest === undefined) {
        this.findInterest(world, ai, position);
      } else {
        this.tryToAuthorizeInterest(world, ai, position);
      }

      this.confrontInterest(world, entity, ai, position);
    }
  }

  findInterest(world, ai, position) {
    world.getStorage('player').foreach(player => {
      if (!region_1.isAuthorized(world, position, player)) {
        const playerPosition = world.getComponent(player, 'position');

        if (playerPosition !== undefined && playerPosition.level === position.level && playerPosition.position.minus(position.position).l1() < 10) {
          const path = this.queries.los(world, position.level, position.position, playerPosition.position, {});

          if (path !== undefined) {
            ai.interest = player;
          }
        }
      }
    });
  }

  tryToAuthorizeInterest(world, ai, position) {
    if (region_1.isAuthorized(world, position, ai.interest)) {
      ai.interest = undefined;
      ai.distrust = 0;
    }
  }

  confrontInterest(world, entity, ai, position) {
    if (ai.interest !== undefined) {
      const othersAlreadyFighting = turn_based_1.turnBasedEntities(world) > 0;

      if (othersAlreadyFighting) {
        ai_1.engage(world, ai, entity, ai.interest, this.pushState);
      } else {
        if (ai.distrust > 9) {
          const result = ui_1.runDialog(world.getResource('ui'), world, this.random, 'restrictedAreaCheck', ai.interest, entity, this.pushState);

          if (result !== undefined) {
            if (result.type === 'authorized') {
              region_1.authorize(world, position, ai.interest);
              ai.interest = undefined;
              ai.distrust = 0;
            } else {
              ai_1.engage(world, ai, entity, ai.interest, this.pushState);
            }
          }
        } else {
          ai.distrust += 1;
        }
      }
    }
  }

}

exports.Npc = Npc;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const array_utils_1 = __webpack_require__(7);

class DiscreteSpace {
  constructor(width) {
    this.width = width;
    this.objects = new Array(width * width);
  }

  get(pos) {
    return this.objects[pos.index(this.width)];
  }

  set(pos, object) {
    this.objects[pos.index(this.width)] = object;
  }

  setAll(shape, object) {
    shape.foreach(pos => this.set(pos, object));
  }

  remove(pos) {
    const index = pos.index(this.width);
    const oldValue = this.objects[index];
    delete this.objects[index];
    return oldValue;
  }

}

exports.DiscreteSpace = DiscreteSpace;

class DiscreteStackSpace {
  constructor(width) {
    this.width = width;
    this.objects = new Array(width * width);
  }

  get(pos) {
    const array = this.objects[pos.index(this.width)];

    if (array !== undefined) {
      return array_utils_1.tail(array);
    }

    return undefined;
  }

  set(pos, object) {
    let array = this.objects[pos.index(this.width)];

    if (array !== undefined) {
      array.push(object);
    } else {
      array = [object];
    }

    this.objects[pos.index(this.width)] = array;
  }

  setAll(shape, object) {
    shape.foreach(pos => this.set(pos, object));
  }

  remove(pos) {
    const array = this.objects[pos.index(this.width)];

    if (array !== undefined) {
      return array.pop();
    }

    return undefined;
  }

}

exports.DiscreteStackSpace = DiscreteStackSpace;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class Vector {
  constructor(coords) {
    this.coordinates = coords;
  }

  static fromDirection(direction) {
    switch (direction) {
      case 'up':
        return new Vector([0, -1]);

      case 'right':
        return new Vector([1, 0]);

      case 'down':
        return new Vector([0, 1]);

      case 'left':
        return new Vector([-1, 0]);
    }
  }

  static interpolate(a, b, alpha) {
    return a.add(b.minus(a).mult(alpha));
  }

  get key() {
    return this.coordinates.join(',');
  }

  index(width) {
    return Math.floor(this.x) % width + Math.floor(this.y) * width;
  }

  get center() {
    return this.add(new Vector([0.5, 0.25]));
  }

  get x() {
    return this.coordinates[0];
  }

  get fX() {
    return Math.floor(this.coordinates[0]);
  }

  get y() {
    return this.coordinates[1];
  }

  get fY() {
    return Math.floor(this.coordinates[1]);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  add(other) {
    return new Vector([this.x + other.x, this.y + other.y]);
  }

  minus(other) {
    return new Vector([this.x - other.x, this.y - other.y]);
  }

  mult(scale) {
    return new Vector([this.x * scale, this.y * scale]);
  }

  abs() {
    return new Vector([Math.abs(this.x), Math.abs(this.y)]);
  }

  bounds(other) {
    return Math.abs(other.x) < Math.abs(this.x) && Math.abs(other.y) < Math.abs(this.y);
  }

  perpendicular() {
    return new Vector([-this.y, this.x]);
  }

  squaredLength() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.squaredLength());
  }

  l1() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  lN() {
    return Math.max(Math.abs(this.x), Math.abs(this.y));
  }

  normalize() {
    return this.mult(1.0 / this.length());
  }

  isNan() {
    return Number.isNaN(this.x) || Number.isNaN(this.y);
  }

}

exports.Vector = Vector;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const subaction_stringify_1 = __webpack_require__(62);

const rectangle_1 = __webpack_require__(3);

const selector_1 = __webpack_require__(10);

function renderActions(renderer, content, actions, hovered) {
  let row = 0;
  actions.forEach((a, index) => {
    let text;
    const cooldown = a.action.cooldown ? ` (${a.action.cooldown})` : '';

    if (a.owner) {
      text = `${row + 1} ${a.owner} ${a.action.name}${cooldown}`;
    } else {
      text = `${row + 1} ${a.action.name}${cooldown}`;
    }

    renderer.text(text, content.topLeft.add(new spatial_1.Vector([0, row])), a.action.cooldown ? palettes_1.gray[2] : palettes_1.primary[1], hovered === index ? palettes_1.gray[1] : undefined);
    row++;
  });
}

class ActionSelectorFullView {
  constructor(content, selectableActions) {
    this.content = content;
    this.selectableActions = selectableActions;
    const width = Math.floor(content.width / 2);
    this.actions = new rectangle_1.Rectangle(content.left, content.top, width, content.height);
    this.descriptions = new rectangle_1.Rectangle(this.actions.right, content.top, content.width - width, content.height);
    this.selector = new selector_1.ItemSelector(this.selectableActions);
  }

  render(renderer) {
    this.renderActions(renderer);
    this.renderDescription(renderer);
  }

  get selected() {
    const selected = this.selector.selected;

    if (selected && !selected.action.cooldown) {
      return selected;
    }

    return undefined;
  }

  get hovered() {
    return this.selector.hovered;
  }

  get length() {
    return this.selector.length;
  }

  update(world) {
    this.selector.update(world, this.actions);
  }

  renderActions(renderer) {
    renderActions(renderer, this.content, this.selectableActions, this.selector.hoveredIndex);
  }

  renderDescription(renderer) {
    const hoveredAction = this.selector.hovered;

    if (hoveredAction !== undefined) {
      const {
        name,
        cost,
        subActions
      } = hoveredAction.action;
      renderer.text(name, this.descriptions.topLeft, palettes_1.primary[1]);

      switch (cost) {
        case 'action':
          renderer.text('costs action', this.descriptions.topLeft.add(new spatial_1.Vector([0, 1])), palettes_1.primary[1]);
          break;

        case 'movement':
          renderer.text('costs movement', this.descriptions.topLeft.add(new spatial_1.Vector([0, 1])), palettes_1.primary[1]);
          break;

        case 'all':
          renderer.text('costs action and movement', this.descriptions.topLeft.add(new spatial_1.Vector([0, 1])), palettes_1.primary[1]);
          break;

        case 'both':
          renderer.text('ends turn', this.descriptions.topLeft.add(new spatial_1.Vector([0, 1])), palettes_1.primary[1]);
          break;
      }

      let y = 3;
      subActions.forEach(subAction => {
        renderer.text(subaction_stringify_1.subactionStringify(subAction), this.descriptions.topLeft.add(new spatial_1.Vector([1, y])), palettes_1.primary[1]);
        y++;
      });
    } else {
      renderer.text('choose an action to perform', this.descriptions.topLeft.add(new spatial_1.Vector([1, 1])), palettes_1.primary[1]);
    }
  }

}

exports.ActionSelectorFullView = ActionSelectorFullView;

class ActionSelectorMinimizedView {
  constructor(content, actions) {
    this.content = content;
    this.actions = actions;
  }

  update(_world) {}

  render(renderer) {
    renderActions(renderer, this.content, this.actions, undefined);
  }

}

exports.ActionSelectorMinimizedView = ActionSelectorMinimizedView;

class ActionSelector {
  constructor(actions) {
    this.actions = actions;
    this.key = 'actionSelector';
    this.name = 'select your move';
    this.shortName = 'q';
    this.command = 'focus';
    this.minimizedHint = 'overview';
  }

  setFull(content) {
    this.full = new ActionSelectorFullView(content, this.actions);
  }

  setMinimized(content) {
    this.minimized = new ActionSelectorMinimizedView(content, this.actions);
  }

  get selected() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.selected;
  }

  get hovered() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.hovered;
  }

  get length() {
    if (this.full === undefined) {
      return 0;
    }

    return this.full.length;
  }

}

exports.ActionSelector = ActionSelector;

/***/ }),
/* 61 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function subactionStringify(subAction) {
  switch (subAction.kind) {
    case 'movement':
    case 'jump':
      return `${subAction.kind} ${subAction.range}`;

    case 'attack':
      const damage = subAction.effects.filter(e => e.type === 'damage')[0].value;
      const other = subAction.effects.filter(e => e.type !== 'damage').map(e => e.type[0]);
      return `${subAction.kind} ${damage} ${other}`;

    case 'status':
      return subAction.effects.map(e => e.type[0]).join(' ');

    case 'changeEquipment':
      return 'change equipment';

    case 'trigger':
      return 'trigger';
  }
}

exports.subactionStringify = subactionStringify;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const render_helpers_1 = __webpack_require__(64);

class OverviewView {
  constructor(content, focus) {
    this.content = content;
    this.state = {
      focus,
      enemies: []
    };
  }

  render(renderer) {
    let delta = new spatial_1.Vector([0, 0]);
    const down = new spatial_1.Vector([0, 1]);
    const right = new spatial_1.Vector([15, 0]);

    if (this.state.stats !== undefined) {
      const stats = this.state.stats;
      render_helpers_1.renderHealth(renderer, this.content.topLeft.add(delta), stats);
      delta = delta.add(down);
      const effects = this.state.activeEffects.effects.map(e => e.effect.type[0]).join();
      renderer.text('effects', this.content.topLeft.add(delta), palettes_1.primary[1]);
      renderer.text(`${effects}`, this.content.topLeft.add(delta).add(right), palettes_1.primary[2]);
      delta = delta.add(right.mult(2));
    }

    delta = new spatial_1.Vector([delta.x, 0]);

    if (this.state.stats !== undefined && this.state.takeTurn !== undefined) {
      renderer.text(`${this.state.takeTurn.acted ? 'action taken' : 'can act'} ${this.state.takeTurn.acted ? 'already moved' : 'can move'}`, this.content.topLeft.add(delta), palettes_1.primary[1]);
      delta = delta.add(down);
      this.state.enemies.forEach(enemy => {
        if (enemy.feature !== undefined) {
          const d = this.content.topLeft.add(delta);
          renderer.character(enemy.feature().character, d, enemy.feature().diffuse);
          renderer.text(enemy.feature().name, d.add(new spatial_1.Vector([3, 0])), palettes_1.primary[1]);
          delta = delta.add(down);
        }
      });
    }
  }

  update(world) {
    this.state.takeTurn = world.getComponent(this.state.focus, 'take-turn');
    this.state.enemies = [];
    world.getStorage('took-turn').foreach(entity => {
      const feature = world.getComponent(entity, 'feature') || {
        feature: undefined
      };
      this.state.enemies.push({
        feature: feature.feature
      });
    });
    world.getStorage('wait-turn').foreach(entity => {
      const feature = world.getComponent(entity, 'feature') || {
        feature: undefined
      };
      this.state.enemies.push({
        feature: feature.feature
      });
    });
    this.state.activeEffects = world.getComponent(this.state.focus, 'active-effects');
    this.state.stats = world.getComponent(this.state.focus, 'character-stats');
  }

}

exports.OverviewView = OverviewView;

class Overview {
  constructor(focus) {
    this.focus = focus;
    this.key = 'overview';
    this.name = 'overview';
    this.shortName = 'u';
    this.command = 'overview';
    this.minimizedHint = 'log';
  }

  setFull(content) {
    this.full = new OverviewView(content, this.focus);
  }

  setMinimized(content) {
    this.minimized = new OverviewView(content, this.focus);
  }

}

exports.Overview = Overview;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const palettes_1 = __webpack_require__(2);

const characters_1 = __webpack_require__(8);

function renderHealth(renderer, position, stats) {
  const currentValue = stats.current.health || 0;
  const maximumValue = characters_1.characterStats[stats.type].health || 0;
  const bars = Math.ceil(5 * currentValue / maximumValue);
  const bodyPartBar = `health ${'|'.repeat(bars)}`;
  const color = bars <= 2 ? palettes_1.primary[3] : palettes_1.primary[1];
  renderer.text(bodyPartBar, position, color);
}

exports.renderHealth = renderHealth;

function renderPercentage(renderer, position, key, value) {
  const percentage = Math.round(Math.min(100, value * 100));
  renderer.text(`${key} ${percentage}%`, position, percentage > 80 ? palettes_1.primary[1] : palettes_1.primary[0]);
}

exports.renderPercentage = renderPercentage;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(35), __webpack_require__(36)(module)))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockSymbols = ['▀', '▐', '▄', '▌', '█'];
exports.gridSymbols = ['─', '═', '┐', '╖', '╕', '╗', '┌', '╔', '╒', '╓', '│', '║', '└', '╙', '╘', '╚', '┘', '╝', '╛', '╜', '┬', '╥', '╤', '╦', '┤', '╡', '╢', '╣', '┼', '╫', '┴', '╨', '╧', '╩', '├', '╞', '╟', '╠', '╪', '╬'];
exports.strangeSymbols = ['ƒ', 'å', 'ß', 'π', '†', '¡', '∞', '•', '∂', '∆', '¬', '…', '≈', 'ç', 'µ', 'Á', '∏', 'Í', 'Î', 'Ó', 'Ô', '', 'Ò', 'Ú', '»', '«', 'Ç', '◊', 'Â', '¿', '‼', '░', '▒', '▓', '☉'];
exports.arrows = ['↑', '▲', '→', '►', '↓', '▼', '←', '↕', '↔'];

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const actions_1 = __webpack_require__(25);

const effects_1 = __webpack_require__(16);

function weapon(base, name, tags, description, weight, action, attachments, effects = []) {
  return {
    base,
    tags,
    kind: 'weapon',
    name,
    shortName: name,
    description,
    actions: [action],
    weight,
    attachments,
    effects
  };
}

function consumable(base, name, tags, description, weight, action) {
  return {
    base,
    tags,
    kind: 'consumable',
    attachments: 0,
    actions: [action],
    name,
    shortName: name,
    description,
    weight,
    effects: []
  };
}

function scrap(base, name, tags, description) {
  return {
    base,
    tags,
    kind: 'scrap',
    attachments: 0,
    name,
    shortName: name,
    description,
    weight: 0,
    effects: [],
    actions: []
  };
}

function equipment(base, kind, name, tags, description, weight, action, effects, attachments) {
  return {
    base,
    kind,
    tags,
    name,
    shortName: name,
    description,
    actions: [action],
    effects,
    weight,
    attachments
  };
}

function createItem(base, _random, _region) {
  switch (base) {
    case 'deathPill':
      return consumable(base, 'death pill', [], 'a pill that kills you', 1, actions_1.createAction('kill'));

    case 'bandages':
      return consumable(base, 'bandages', [], 'a bandage to stop bleeding', 1, actions_1.createAction('heal'));

    case 'gun':
      {
        return weapon(base, 'gun', ['gun'], 'a gun.', 3, actions_1.createAction('shoot'), 1);
      }

    case 'nailGun':
      {
        return weapon(base, 'nail gun', ['high-tech'], 'a tool to drive nails into wood, control panels or bodies.', 5, actions_1.createAction('shoot'), 1);
      }

    case 'rifle':
      return weapon(base, 'rifle', ['rifle'], 'a regular rifle.', 5, actions_1.createAction('shoot'), 2);

    case 'sniperRifle':
      {
        return weapon(base, 'sniper rifle', ['rifle'], '', 6, actions_1.createAction('shoot'), 2);
      }

    case 'powerGauntlet':
      {
        return weapon(base, 'power gauntlet', ['melee'], 'a powerful gauntlet, worn at one hand.', 5, actions_1.createAction('hit'), 1, [effects_1.cooldownBuff(1, undefined)]);
      }

    case 'boots':
      {
        return equipment(base, 'boots', 'boots', [], 'some boots', 2, actions_1.createAction('kick'), [effects_1.cooldownBuff(1, undefined)], 2);
      }

    case 'leatherJacket':
      return equipment(base, 'armor', 'leather jacket', [], 'a nice leather jacket', 3, actions_1.createAction('tighten'), [effects_1.defend(5, undefined)], 1);

    case 'idCard':
      return scrap(base, 'id card', [], 'id card');
  }
}

exports.createItem = createItem;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function action(name, cost, subActions, characterTypes) {
  return {
    name,
    cost,
    subActions,
    characterTypes
  };
}

exports.action = action;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const effects_1 = __webpack_require__(16);

exports.mods = [{
  kind: 'active',
  adjective: 'rapid',
  action: 'doubleShot',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  matches: [{
    kind: 'weapon',
    tags: ['gun', 'rifle', 'high-tech']
  }]
}, {
  kind: 'active',
  adjective: 'overcharged',
  action: 'overcharge',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  matches: [{
    kind: 'weapon',
    tags: ['melee', 'high-tech']
  }]
}, {
  kind: 'active',
  adjective: 'acrobatic',
  action: 'acrobatics',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  matches: [{
    kind: 'boots',
    tags: []
  }]
}, {
  kind: 'passive',
  adjective: 'critical',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  effects: [effects_1.critChance(2, undefined), effects_1.critMultiplier(1.1, undefined)],
  matches: [{
    kind: 'weapon',
    tags: ['melee', 'high-tech']
  }, {
    kind: 'armor',
    tags: []
  }, {
    kind: 'boots',
    tags: []
  }, {
    kind: 'glove',
    tags: []
  }, {
    kind: 'helmet',
    tags: []
  }, {
    kind: 'pants',
    tags: []
  }]
}, {
  kind: 'passive',
  adjective: 'cooling',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  effects: [effects_1.cooldownBuff(1, undefined)],
  matches: [{
    kind: 'weapon',
    tags: ['melee', 'high-tech']
  }, {
    kind: 'armor',
    tags: []
  }, {
    kind: 'boots',
    tags: []
  }, {
    kind: 'glove',
    tags: []
  }, {
    kind: 'helmet',
    tags: []
  }, {
    kind: 'pants',
    tags: []
  }]
}, {
  kind: 'passive',
  adjective: 'protective',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  effects: [effects_1.defend(3, undefined)],
  matches: [{
    kind: 'weapon',
    tags: ['melee', 'high-tech']
  }, {
    kind: 'armor',
    tags: []
  }, {
    kind: 'boots',
    tags: []
  }, {
    kind: 'glove',
    tags: []
  }, {
    kind: 'helmet',
    tags: []
  }, {
    kind: 'pants',
    tags: []
  }]
}, {
  kind: 'active',
  adjective: 'surgical',
  action: 'execute',
  occurs: ['blue-base', 'blue-plus'],
  matches: [{
    kind: 'weapon',
    tags: ['gun', 'rifle', 'high-tech']
  }]
}, {
  kind: 'passive',
  adjective: 'enhanced',
  action: 'enhanced',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  matches: [{
    kind: 'weapon',
    tags: []
  }]
}, {
  kind: 'passive',
  adjective: 'fast',
  action: 'fast',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  matches: [{
    kind: 'weapon',
    tags: ['gun']
  }]
}, {
  kind: 'active',
  adjective: 'truthful',
  action: 'headshot',
  occurs: ['entrance', 'yellow-base', 'yellow-plus'],
  matches: [{
    kind: 'weapon',
    tags: ['gun']
  }]
}, {
  kind: 'active',
  adjective: 'precise',
  action: 'headshot',
  occurs: ['entrance', 'blue-base', 'blue-plus'],
  matches: [{
    kind: 'weapon',
    tags: ['rifle']
  }]
}];

function getRandomMod(random, kind, item, region) {
  const availableMods = exports.mods.filter(mod => {
    const hasKind = mod.kind === kind;
    const regionMatches = mod.occurs.some(o => region === o);
    const itemMatches = mod.matches.some(m => m.kind === item.kind && (m.tags.length === 0 || m.tags.some(t => item.tags.some(tag => t === tag))));
    return hasKind && regionMatches && itemMatches;
  });
  return random.pick(availableMods);
}

exports.getRandomMod = getRandomMod;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function hasItem(world, entity, type) {
  const inventory = world.getComponent(entity, 'inventory').content;
  return inventory.some(i => world.getComponent(i, 'item').item.base === type);
}

exports.hasItem = hasItem;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function getTriggersOfStructure(world, entity, filter) {
  const structure = world.getComponent(entity, 'structure');
  const region = world.getComponent(structure.region, 'region');
  const map = world.getResource('map');
  const level = map.levels[region.level];
  const triggers = new Set();
  structure.shape.foreach(p => {
    const tile = level.getTile(p);
    const triggeredBy = world.getComponent(tile, 'triggered-by');

    if (triggeredBy !== undefined) {
      triggers.add(triggeredBy.entity);
    }
  });
  const result = [];
  triggers.forEach(e => {
    const asset = world.getComponent(e, 'asset');

    if (filter.some(t => t === asset.type)) {
      result.push(e);
    }
  });
  return result;
}

exports.getTriggersOfStructure = getTriggersOfStructure;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function quest(name, start, startText) {
  return {
    name,
    start,
    startText
  };
}

const questDefintions = {
  quest1: quest('quest1', 'startQuest1', 'something you want?')
};
exports.quests = questDefintions;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function lore(name, start, startText) {
  return {
    name,
    start,
    startText
  };
}

const loreDefinitions = {
  lore1: lore('lore1', 'startLore1', 'lore.txt')
};
exports.lores = loreDefinitions;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const window_decoration_1 = __webpack_require__(28);

const array_utils_1 = __webpack_require__(7);

const inventory_description_1 = __webpack_require__(30);

const rectangle_1 = __webpack_require__(3);

class InventoryTransferModal {
  constructor(state) {
    this.state = state;
    this.closed = false;
  }

  render(renderer) {
    const {
      leftWindow,
      rightWindow,
      leftInventory,
      rightInventory,
      leftActive,
      hovered
    } = this.state;
    this.renderInventory(renderer, leftWindow, leftInventory, leftActive, leftActive ? hovered : undefined);
    this.renderInventory(renderer, rightWindow, rightInventory, !leftActive, leftActive ? undefined : hovered);
  }

  static build(bounds, source, sourceTitle, target, targetTitle) {
    const width = Math.floor(bounds.width / 2);
    const leftWindow = new window_decoration_1.WindowDecoration(new rectangle_1.Rectangle(bounds.left, bounds.top, width, bounds.height), sourceTitle);
    const rightWindow = new window_decoration_1.WindowDecoration(new rectangle_1.Rectangle(leftWindow.right, bounds.top, bounds.width - width, bounds.height), targetTitle);
    return new InventoryTransferModal({
      left: source,
      right: target,
      leftWindow,
      rightWindow,
      leftActive: true,
      hovered: 0
    });
  }

  renderInventory(renderer, window, inventory, active, hovered) {
    window.render(renderer);
    const inventoryItems = inventory.items || [];
    let y = 0;
    inventoryItems.forEach(item => {
      const numeric = active ? `${y + 1} ` : '';
      renderer.text(`${numeric}${item.item.name} (${item.item.weight})`, window.content.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1], hovered === y ? palettes_1.gray[1] : undefined);
      y++;
    });

    if (inventory.maximumWeight !== undefined) {
      const text = `${inventory.currentWeight}/${inventory.maximumWeight}`;
      renderer.text(text, window.content.bottomRight.add(new spatial_1.Vector([-text.length, 1])), palettes_1.primary[1]);
    }
  }

  update(world) {
    this.state.leftInventory = inventory_description_1.createInventoryDescription(world, this.state.left);
    this.state.rightInventory = inventory_description_1.createInventoryDescription(world, this.state.right);
    const input = world.getResource('input');
    let position;

    if (input.position) {
      position = new spatial_1.Vector([input.position.x, input.position.y]);
    }

    if (input.isActive('cancel')) {
      this.closed = true;
    }

    const up = input.isActive('plus');
    const down = input.isActive('minus');
    const right = input.isActive('right');
    const left = input.isActive('left');

    if (up) {
      this.state.hovered--;
    }

    if (down) {
      this.state.hovered++;
    }

    if (right || left) {
      this.state.leftActive = !this.state.leftActive;
    }

    const source = this.state.leftActive ? this.state.leftInventory : this.state.rightInventory;
    const target = this.state.leftActive ? this.state.rightInventory : this.state.leftInventory;

    if (source.inventory.content.length > 0) {
      this.state.hovered += source.inventory.content.length;
      this.state.hovered %= source.inventory.content.length;
    } else {
      this.state.leftActive = !this.state.leftActive;
      this.state.hovered = 0;
    }

    let selected = undefined;

    if (input.isActive('accept')) {
      selected = this.state.hovered;
    }

    if (position) {
      const mouseInLeft = this.state.leftWindow.content.containsVector(position);
      const mouseInRight = this.state.rightWindow.content.containsVector(position);

      if (mouseInLeft || mouseInRight) {
        this.state.leftActive = mouseInLeft;
        let delta;

        if (mouseInLeft) {
          delta = position.minus(this.state.leftWindow.content.topLeft);
        } else {
          delta = position.minus(this.state.rightWindow.content.topLeft);
        }

        if (input.mousePressed) {
          selected = delta.y;
        }

        this.state.hovered = delta.y;
      }
    }

    const numeric = input.numericActive();

    if (numeric !== undefined) {
      selected = numeric;
    }

    if (selected !== undefined) {
      this.transfer(source, target, selected);
    }
  }

  transfer(source, target, index) {
    const item = source.items[index];

    if (item !== undefined) {
      const passesWeightRestriction = target.maximumWeight === undefined || target.currentWeight + item.item.weight <= target.maximumWeight;
      const isEquiped = source.equipment.some(e => e.entity === item.entity);

      if (passesWeightRestriction && !isEquiped) {
        target.inventory.content.push(source.inventory.content[index]);
        array_utils_1.dropAt(source.inventory.content, index);
      }
    }
  }

  contains(position) {
    return this.state.leftWindow.containsVector(position) || this.state.rightWindow.containsVector(position);
  }

}

exports.InventoryTransferModal = InventoryTransferModal;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const rectangle_1 = __webpack_require__(3);

const inventory_description_1 = __webpack_require__(30);

const selector_1 = __webpack_require__(10);

const consume_item_1 = __webpack_require__(40);

const characters_1 = __webpack_require__(8);

const apply_effect_1 = __webpack_require__(11);

class FullInventoryView {
  constructor(content, uniform, focus) {
    this.content = content;
    this.uniform = uniform;
    this.state = {
      focus
    };
    const width = Math.floor(content.width / 2);
    this.items = new rectangle_1.Rectangle(content.left, content.top, width, content.height);
    this.descriptions = new rectangle_1.Rectangle(this.items.right, content.top, content.width - width, content.height);
    this.itemSelector = new selector_1.ItemSelector([]);
  }

  render(renderer) {
    if (this.state.inventory !== undefined) {
      const inventory = this.state.inventory;
      this.renderInventory(renderer, inventory, this.itemSelector.hoveredIndex);

      if (this.itemSelector.hoveredIndex) {
        this.renderDescription(renderer, inventory, this.itemSelector.hoveredIndex);
      }
    }
  }

  renderInventory(renderer, inventory, hovered) {
    const inventoryItems = inventory.items || [];
    let y = 0;
    inventoryItems.forEach(item => {
      const attachement = inventory.equipment.find(e => e.entity === item.entity);
      let attached = '';

      if (attachement) {
        attached = '*';
      }

      renderer.text(`${y + 1} ${item.item.name}${attached}`, this.items.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1], hovered === y ? palettes_1.gray[1] : undefined);
      y++;
    });

    if (inventory.maximumWeight !== undefined) {
      renderer.text(`weight: ${inventory.currentWeight}/${inventory.maximumWeight}`, this.content.bottomLeft, palettes_1.primary[1]);
    }
  }

  renderDescription(renderer, inventory, index) {
    const inventoryItems = inventory.items || [];
    const inventoryItem = inventoryItems[index];
    let y = 0;

    if (inventoryItem !== undefined) {
      const item = inventoryItem.item;

      if (item.actions.length > 0) {
        y += renderer.flowText(`${item.description}`, this.descriptions.topLeft.add(new spatial_1.Vector([0, y])), this.descriptions.width, palettes_1.primary[1]);
        y += renderer.flowText('actions: ' + item.actions.map(a => a.name).join(), this.descriptions.topLeft.add(new spatial_1.Vector([0, y])), this.descriptions.width, palettes_1.primary[1]);
      }

      y += renderer.flowText('mods: ' + inventoryItem.mods.map(a => a.adjective).join(), this.descriptions.topLeft.add(new spatial_1.Vector([0, y])), this.descriptions.width, palettes_1.primary[1]);

      if (this.state.takeTurn === undefined) {
        let action = undefined;

        if (item.kind === 'consumable') {
          action = 'consume';
        } else if (item.attachments > 0) {
          const equipped = inventory.equipment.some(i => i.entity === inventoryItem.entity);
          action = equipped ? 'unequip' : 'equip';
        }

        if (action) {
          renderer.text(action, this.descriptions.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1]);
          y++;
        }
      }
    }
  }

  update(world) {
    this.state.inventory = inventory_description_1.createInventoryDescription(world, this.state.focus);
    this.state.takeTurn = world.getComponent(this.state.focus, 'take-turn');
    this.itemSelector.setItems(this.state.inventory.items);
    this.itemSelector.update(world, this.content);

    if (this.itemSelector.selectedIndex !== undefined && this.state.takeTurn === undefined) {
      this.use(world, this.itemSelector.selectedIndex);
    }
  }

  use(world, index) {
    const inventory = this.state.inventory;
    const item = inventory.inventory.content[index];
    const inventoryItems = inventory.items || [];
    const selectedItem = inventoryItems[index].item;

    if (selectedItem.kind === 'consumable' && selectedItem.actions.length > 0) {
      selectedItem.actions[0].subActions.forEach(action => {
        if (action.kind === 'status') {
          action.effects.forEach(effect => {
            apply_effect_1.applyEffect(world, this.uniform, this.state.focus, {
              source: item,
              effect,
              isCritical: false,
              isPiercing: false
            });
          });
        }
      });
      consume_item_1.consumeItem(world, this.state.focus, item);
    } else if (selectedItem.attachments > 0) {
      const attachementIndex = inventory.equipment.findIndex(e => e.entity === item);

      if (attachementIndex >= 0) {
        characters_1.unequip(world, this.state.focus, item);
      } else {
        characters_1.replacingEquip(world, this.state.focus, item, selectedItem);
      }
    }
  }

}

exports.FullInventoryView = FullInventoryView;

class MinimizedInventoryView {
  constructor(content, focus) {
    this.content = content;
    const width = Math.floor(content.width / 2);
    this.inventoryContent = new rectangle_1.Rectangle(content.left, content.top, width, content.height);
    this.state = {
      focus
    };
  }

  render(renderer) {
    if (this.state.inventory !== undefined) {
      const inventory = this.state.inventory;
      this.renderInventory(renderer, this.inventoryContent, inventory);
    }
  }

  renderInventory(renderer, content, inventory) {
    const inventoryItems = inventory.items || [];
    let y = 0;
    inventoryItems.forEach(item => {
      const attachement = inventory.equipment.find(e => e.entity === item.entity);
      let attached = '';

      if (attachement) {
        attached = '*';
      }

      renderer.text(`${item.item.name}${attached}`, content.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1]);
      y++;
    });

    if (inventory.maximumWeight !== undefined) {
      renderer.text(`inventory (${inventory.currentWeight}/${inventory.maximumWeight})`, content.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1]);
    }
  }

  update(world) {
    this.state.inventory = inventory_description_1.createInventoryDescription(world, this.state.focus);
  }

}

exports.MinimizedInventoryView = MinimizedInventoryView;

class Inventory {
  constructor(focus, uniform) {
    this.focus = focus;
    this.uniform = uniform;
    this.key = 'inventory';
    this.name = 'inventory';
    this.shortName = 'i';
    this.command = 'inventory';
    this.minimizedHint = 'overview';
  }

  setFull(content) {
    this.full = new FullInventoryView(content, this.uniform, this.focus);
  }

  setMinimized(content) {
    this.minimized = new MinimizedInventoryView(content, this.focus);
  }

}

exports.Inventory = Inventory;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const asset_1 = __webpack_require__(18);

const spatial_1 = __webpack_require__(1);

function kill(world, random, entity) {
  if (world.hasComponent(entity, 'position')) {
    const position = world.getComponent(entity, 'position');
    const inventory = world.getComponent(entity, 'inventory');
    const map = world.getResource('map');
    map.levels[position.level].removeCharacter(position.position);
    const positionFloor = new spatial_1.Vector([position.position.fX, position.position.fY]);
    const loot = asset_1.createAsset(world, random, position.level, positionFloor, 'up', 'loot');
    world.editEntity(loot).withComponent('inventory', { ...inventory
    });
    const log = world.getResource('log');
    log.died(world, entity);
  }

  world.editEntity(entity).withComponent('dead', {}).removeComponent('position').removeComponent('take-turn').removeComponent('start-turn').removeComponent('took-turn').removeComponent('wait-turn');
}

exports.kill = kill;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const features_1 = __webpack_require__(15);

const s1x1 = new spatial_1.Vector([1, 1]);
const s1x2 = new spatial_1.Vector([1, 2]);
const s3x1 = new spatial_1.Vector([3, 1]);
const s2x2 = new spatial_1.Vector([2, 2]);

function asset(name, size, dialog, feature) {
  return {
    name,
    size,
    hasInventory: true,
    dialog,
    feature
  };
}

const assetsDefinition = {
  door: asset('metal door', s3x1, undefined, () => features_1.features.door),
  locker: asset('a locker', s1x1, undefined, () => features_1.features.locker),
  trash: asset('some trash', s1x1, undefined, () => features_1.features.trash),
  loot: asset('a dead body', s1x1, undefined, () => features_1.features.loot),
  table: asset('a table', s1x2, undefined, () => features_1.features.table),
  generator: asset('a generator', s2x2, undefined, features_1.generators.block),
  elevator: asset('an elevator', s1x1, 'elevator', features_1.generators.elevator),
  terminal: asset('a terminal', s1x1, 'terminal', () => features_1.features.terminal),
  urinal: asset('a urinal', s1x1, undefined, () => features_1.features.urinal),
  core: asset('the core', s1x1, 'core', () => features_1.features.core)
};
exports.assets = assetsDefinition;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function sampleLoreForDialog(_world, _random, dialog) {
  if (dialog === 'terminal') {
    return 'lore1';
  }

  return undefined;
}

exports.sampleLoreForDialog = sampleLoreForDialog;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const selector_1 = __webpack_require__(10);

class MultipleChoiceModal {
  constructor(window, options) {
    this.window = window;
    this.options = options;
    this.closed = false;
    this.selector = new selector_1.ItemSelector(this.options);
  }

  render(renderer) {
    this.window.render(renderer);
    const options = this.options || [];
    let y = 0;
    options.forEach((option, i) => {
      renderer.text(`${i + 1} ${option.description}`, this.window.content.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1], this.selector.hoveredIndex === i ? palettes_1.gray[1] : undefined);
      y++;
    });
  }

  update(world) {
    this.selector.update(world, this.window.content);

    if (this.selector.selected !== undefined) {
      this.closed = true;
    }
  }

  contains(position) {
    return this.window.containsVector(position);
  }

}

exports.MultipleChoiceModal = MultipleChoiceModal;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const window_decoration_1 = __webpack_require__(28);

class Tabs {
  constructor(mainWindow, minimizedWindow) {
    this.mainTab = undefined;
    this.minimizedTab = undefined;
    this.tabs = [];
    this.focusTab = undefined;
    this.mainTabWindow = new window_decoration_1.WindowDecoration(mainWindow, 'tabs');
    this.minimizedTabWindow = new window_decoration_1.WindowDecoration(minimizedWindow, 'tabs');
  }

  add(tab) {
    this.tabs.push(tab);

    if (this.mainTab === undefined) {
      this.setTab(tab);
    }

    tab.setFull(this.mainTabWindow.content);
    tab.setMinimized(this.minimizedTabWindow.content);
  }

  setFocusTab(tab) {
    this.focusTab = tab;
    this.setTab(tab);
    tab.setFull(this.mainTabWindow.content);
    tab.setMinimized(this.minimizedTabWindow.content);
  }

  reset() {
    this.focusTab = undefined;
    this.setTab(this.tabs[0]);
  }

  render(renderer) {
    this.mainTabWindow.render(renderer);
    this.minimizedTabWindow.render(renderer);

    if (this.mainTab !== undefined) {
      this.mainTab.full.render(renderer);
    }

    if (this.minimizedTab !== undefined) {
      this.minimizedTab.minimized.render(renderer);
    }
  }

  update(world) {
    const input = world.getResource('input');
    this.mainTabWindow.update(input);
    const tabs = this.focusTab !== undefined ? [this.focusTab, ...this.tabs] : this.tabs;
    tabs.forEach(tab => {
      if (input.isActive(tab.command)) {
        this.setTab(tab);
      }
    });

    if (this.mainTab !== undefined) {
      this.mainTab.full.update(world);
    }

    if (this.minimizedTab !== undefined) {
      this.minimizedTab.minimized.update(world);
    }
  }

  contains(position) {
    return this.mainTabWindow.containsVector(position) || this.minimizedTabWindow.containsVector(position);
  }

  setTab(tab) {
    this.mainTab = tab;
    const tabs = this.focusTab !== undefined ? [this.focusTab, ...this.tabs] : this.tabs;
    this.minimizedTab = tabs.find(t => t.key === tab.minimizedHint) || tab;
    this.mainTabWindow.title = tabs.map(tab => {
      if (this.mainTab === tab) {
        return tab.name;
      }

      return tab.shortName;
    }).join('/');
    this.minimizedTabWindow.title = this.minimizedTab.name;
  }

}

exports.Tabs = Tabs;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

class LogView {
  constructor(content) {
    this.content = content;
    this.entries = [];
  }

  render(renderer) {
    const topLeft = this.content.topLeft;
    this.entries.forEach((entry, index) => {
      renderer.text(entry, topLeft.add(new spatial_1.Vector([0, index])), palettes_1.primary[1]);
    });
  }

  update(world) {
    const log = world.getResource('log');
    this.entries = log.getEntries(0, this.content.height);
  }

}

exports.LogView = LogView;

class LogTab {
  constructor() {
    this.key = 'log';
    this.name = 'log';
    this.shortName = 'o';
    this.command = 'log';
    this.minimizedHint = 'overview';
  }

  setFull(content) {
    this.full = new LogView(content);
  }

  setMinimized(content) {
    this.minimized = new LogView(content);
  }

}

exports.LogTab = LogTab;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const palettes_1 = __webpack_require__(2);

class MovementSelectorFullView {
  constructor(content, target, queries, movement) {
    this.content = content;
    this.target = target;
    this.queries = queries;
    this.movement = movement;
    this.isSelected = false;
  }

  render(renderer) {
    if (this.targetFeature !== undefined) {
      renderer.text(this.targetFeature.feature().name, this.content.topLeft, palettes_1.primary[0]);
    }
  }

  get selected() {
    if (this.isSelected) {
      return this.path;
    }

    return undefined;
  }

  get hovered() {
    return this.path;
  }

  get length() {
    return this.path === undefined ? 0 : this.path.cost;
  }

  update(world) {
    const input = world.getResource('input');
    const map = world.getResource('map');
    const viewport = world.getResource('viewport');

    if (input.position !== undefined) {
      const cursor = viewport.fromDisplay(input.position);
      const position = world.getComponent(this.target, 'position');
      const region = map.levels[position.level];
      const path = this.queries.shortestPath(world, position.level, position.position, cursor, {
        self: this.target,
        maximumCost: this.movement.range,
        onlyDiscovered: true,
        endInDoor: true,
        jump: this.movement.kind === 'jump'
      });

      if (path !== undefined) {
        path.path.forEach(position => {
          const tile = region.getTile(position);
          world.editEntity(tile).withComponent('overlay', {
            background: palettes_1.primary[2]
          });
        });
      }

      const targetTile = map.levels[position.level].getTile(cursor);

      if (targetTile !== undefined) {
        this.targetFeature = world.getComponent(targetTile, 'feature');
      }

      this.path = path;

      if (input.mousePressed) {
        this.isSelected = input.mousePressed;
      }
    }
  }

}

exports.MovementSelectorFullView = MovementSelectorFullView;

class MovementSelector {
  constructor(target, queries, movement) {
    this.target = target;
    this.queries = queries;
    this.movement = movement;
    this.key = 'movementSelector';
    this.name = 'select a location to move to';
    this.shortName = 'q';
    this.command = 'focus';
    this.minimizedHint = 'overview';
  }

  setFull(content) {
    this.full = new MovementSelectorFullView(content, this.target, this.queries, this.movement);
  }

  setMinimized(content) {
    this.minimized = new MovementSelectorFullView(content, this.target, this.queries, this.movement);
  }

  get selected() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.selected;
  }

  get hovered() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.hovered;
  }

  get length() {
    return 1;
  }

}

exports.MovementSelector = MovementSelector;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const palettes_1 = __webpack_require__(2);

class AttackSelectorFullView {
  constructor(content, target, queries, range) {
    this.content = content;
    this.target = target;
    this.queries = queries;
    this.range = range;
    this.isSelected = false;
  }

  render(_renderer) {}

  get selected() {
    if (this.isSelected) {
      return this.path;
    }

    return undefined;
  }

  get hovered() {
    return this.path;
  }

  get length() {
    return this.path === undefined ? 0 : this.path.cost;
  }

  update(world) {
    const input = world.getResource('input');
    const map = world.getResource('map');
    const viewport = world.getResource('viewport');
    const position = world.getComponent(this.target, 'position');
    const level = map.levels[position.level];

    if (input.position !== undefined) {
      const cursor = viewport.fromDisplay(input.position);
      const path = this.queries.los(world, position.level, position.position, cursor, {
        maximumCost: this.range
      });

      if (path !== undefined) {
        path.path.forEach(p => {
          const target = level.getCharacter(p);
          const hasEnemy = target !== undefined && target !== this.target;

          if (hasEnemy) {
            world.editEntity(target).withComponent('overlay', {
              background: palettes_1.primary[3]
            });
          } else {
            const tile = level.getTile(p);
            world.editEntity(tile).withComponent('overlay', {
              background: palettes_1.primary[1]
            });
          }
        });
        this.path = path;

        if (input.mousePressed) {
          this.isSelected = input.mousePressed;
        }
      }
    }
  }

}

exports.AttackSelectorFullView = AttackSelectorFullView;

class AttackSelector {
  constructor(target, queries, range) {
    this.target = target;
    this.queries = queries;
    this.range = range;
    this.key = 'attackSelector';
    this.name = 'select an enemy target';
    this.shortName = 'q';
    this.command = 'focus';
    this.minimizedHint = 'overview';
  }

  setFull(content) {
    this.full = new AttackSelectorFullView(content, this.target, this.queries, this.range);
  }

  setMinimized(content) {
    this.minimized = new AttackSelectorFullView(content, this.target, this.queries, this.range);
  }

  get selected() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.selected;
  }

  get hovered() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.hovered;
  }

  get length() {
    return 1;
  }

}

exports.AttackSelector = AttackSelector;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const selector_1 = __webpack_require__(10);

const dialogs_1 = __webpack_require__(26);

const rectangle_1 = __webpack_require__(3);

class DialogModal {
  constructor(world, random, window, dialog, player, owner) {
    this.random = random;
    this.window = window;
    this.player = player;
    this.owner = owner;
    this.closed = false;
    this.result = undefined;
    this.dialogState = {
      steps: [],
      current: 0
    };
    this.selectY = 0;
    this.startDialog(world, dialog);
  }

  render(renderer) {
    this.window.render(renderer);
    const step = this.dialogState.steps[this.dialogState.current];

    if (this.currentText === undefined) {
      this.currentText = this.random.pick(step.text);
    }

    let y = renderer.flowText(this.currentText, this.window.content.topLeft, this.window.width, palettes_1.primary[1]) + 1;

    if (this.selector !== undefined) {
      this.selectY = y;
      step.answers.forEach((answer, i) => {
        renderer.text(`${i + 1} ${answer.text}`, this.window.content.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1], this.selector.hoveredIndex === i ? palettes_1.gray[1] : undefined);
        y++;
      });
    }
  }

  update(world) {
    const step = this.dialogState.steps[this.dialogState.current];

    if (this.selector === undefined) {
      this.selector = new selector_1.ItemSelector(step.answers);
    }

    this.selector.update(world, new rectangle_1.Rectangle(this.window.content.x, this.window.content.y + this.selectY, this.window.content.width, step.answers.length));
    const result = this.selector.selected;

    if (result !== undefined) {
      const navigation = result.type;

      if (typeof navigation === 'number') {
        this.navigate(navigation);
      } else if (result.type === 'next_dialog') {
        this.startDialog(world, dialogs_1.dialogs[result.dialog]);
      } else {
        this.closed = true;
        this.result = result;
      }
    }
  }

  navigate(index) {
    this.dialogState.current = index;
    this.reset();
  }

  startDialog(world, dialog) {
    this.dialogState = {
      steps: dialog.steps(world, this.player, this.owner),
      current: 0
    };
    this.reset();
  }

  reset() {
    this.currentText = undefined;
    this.selector = undefined;
  }

  contains(position) {
    return this.window.containsVector(position);
  }

}

exports.DialogModal = DialogModal;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const palettes_1 = __webpack_require__(2);

const selector_1 = __webpack_require__(10);

class MultipleChoiceFullView {
  constructor(content, options) {
    this.content = content;
    this.options = options;
    this.closed = false;
    this.selector = new selector_1.ItemSelector(this.options.map(o => o.entity));
  }

  get selected() {
    return this.selector.selected;
  }

  get hovered() {
    return this.selector.hovered;
  }

  get length() {
    return this.options.length;
  }

  render(renderer) {
    const options = this.options || [];
    let y = 0;
    options.forEach((option, i) => {
      renderer.text(`${i + 1} ${option.description}`, this.content.topLeft.add(new spatial_1.Vector([0, y])), palettes_1.primary[1], this.selector.hoveredIndex === i ? palettes_1.gray[1] : undefined);
      y++;
    });
  }

  update(world) {
    this.selector.update(world, this.content);
  }

}

exports.MultipleChoiceFullView = MultipleChoiceFullView;

class MultipleChoiceSelector {
  constructor(options) {
    this.options = options;
    this.key = 'actionSelector';
    this.name = 'select your move';
    this.shortName = 'q';
    this.command = 'focus';
    this.minimizedHint = 'overview';
  }

  setFull(content) {
    this.full = new MultipleChoiceFullView(content, this.options);
  }

  setMinimized(content) {
    this.minimized = new MultipleChoiceFullView(content, this.options);
  }

  get selected() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.selected;
  }

  get hovered() {
    if (this.full === undefined) {
      return undefined;
    }

    return this.full.hovered;
  }

  get length() {
    if (this.full === undefined) {
      return 0;
    }

    return this.full.length;
  }

}

exports.MultipleChoiceSelector = MultipleChoiceSelector;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const state_1 = __webpack_require__(13);

const turn_based_1 = __webpack_require__(21);

class Fighting extends state_1.AbstractState {
  constructor() {
    super('fighting', ['start-round', 'player-round-control', 'ai-round-control', 'fov', 'npc', 'script', 'trigger']);
  }

  start(world) {
    super.start(world);
    let player = world.getStorage('player').first();

    if (!turn_based_1.isTurnBased(world, player)) {
      this.setNextEntity(world, player);
    }
  }

  stop(world) {
    super.stop(world);

    if (this.isDone(world)) {
      turn_based_1.clearTurnBased(world);
    }
  }

  update(world) {
    const noActivePlayer = world.getStorage('start-turn').size() === 0 && world.getStorage('take-turn').size() === 0;

    if (noActivePlayer) {
      let next = world.getStorage('wait-turn').first();

      if (next === undefined) {
        this.newRound(world);
        next = world.getStorage('wait-turn').first();
      }

      this.setNextEntity(world, next);
    }
  }

  isDone(world) {
    const isDead = turn_based_1.playerIsDead(world);
    const isStruggling = turn_based_1.playerIsStruggling(world);
    const onlyPlayerPlays = turn_based_1.turnBasedEntities(world) <= world.components.get('player').size();
    return isDead || onlyPlayerPlays && !isStruggling;
  }

  newRound(world) {
    world.getStorage('took-turn').foreach(entity => this.addToTurn(world, entity));
    world.getStorage('took-turn').clear();
  }

  addToTurn(world, entity) {
    world.editEntity(entity).withComponent('wait-turn', {});
  }

  setNextEntity(world, next) {
    world.editEntity(next).withComponent('start-turn', {}).removeComponent('wait-turn');
  }

  isFrameLocked() {
    return true;
  }

}

exports.Fighting = Fighting;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const character_stats_1 = __webpack_require__(23);

const position_1 = __webpack_require__(43);

class PlayerControl {
  constructor() {
    this.components = ['player', 'position', 'character-stats'];
  }

  update(world, entity) {
    const position = world.getComponent(entity, 'position');
    const stats = world.getComponent(entity, 'character-stats');
    const input = world.getResource('input');
    const delta = input.createMovementDelta();
    let newPosition = undefined;
    let newLevel = undefined;

    if (delta.squaredLength() > 0) {
      newPosition = position.position.add(delta.mult(character_stats_1.speed(stats)));
      newLevel = position.level;
    }

    if (newPosition !== undefined && newLevel !== undefined) {
      position_1.move(world, entity, newLevel, newPosition);
    }
  }

}

exports.PlayerControl = PlayerControl;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const functional_shape_1 = __webpack_require__(20);

const modal_1 = __webpack_require__(19);

const trigger_1 = __webpack_require__(32);

class PlayerInteraction {
  constructor(pushState) {
    this.pushState = pushState;
    this.components = ['player', 'position'];
  }

  update(world, entity) {
    const ui = world.getResource('ui');
    const input = world.getResource('input');
    let trigger;

    if (input.isActive('use')) {
      const position = world.getComponent(entity, 'position');
      const neighbourhood = functional_shape_1.FunctionalShape.lN(position.position, 1, true);
      const triggers = trigger_1.findTriggers(world, position.level, neighbourhood);

      if (triggers.length === 1) {
        trigger = triggers[0].entity;
      } else if (triggers.length > 1) {
        ui.showMultipleChoiceModal(world, 'interact with', triggers.map(t => ({
          entity: t.entity,
          description: t.component.name
        })));
        this.pushState(new modal_1.Modal(world.activeSystemsList()));
      }
    } else if (ui.multipleChoiceModalShowing()) {
      trigger = ui.selectedModalOption();
      ui.hideMultipleChoiceModal();
    }

    if (trigger !== undefined) {
      world.editEntity(trigger).withComponent('active', {}).withComponent('triggered-by', {
        entity
      });
    }
  }

}

exports.PlayerInteraction = PlayerInteraction;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const feature_1 = __webpack_require__(12);

const asset_1 = __webpack_require__(18);

const complexes_1 = __webpack_require__(90);

const complex_embedder_1 = __webpack_require__(44);

const complex_filler_1 = __webpack_require__(94);

const space_partitioner_1 = __webpack_require__(97);

const partitioners = __importStar(__webpack_require__(47));

const random_1 = __webpack_require__(5);

class RegionBuilder {
  constructor(rng, dry = false) {
    this.rng = rng;
    this.dry = dry;
    this.components = ['active', 'region'];
    this.uniform = new random_1.Random(rng);
  }

  update(world, entity) {
    const region = world.getComponent(entity, 'region');
    let success = true;

    switch (region.type) {
      case 'entrance':
        success = this.buildEntrance(world, entity, region);
        break;

      case 'ground-floor':
        success = this.buildOfficeSpace(world, entity, region);
        break;

      case 'elevator':
        success = this.buildElevator(world, entity, region);
        break;

      case 'red-base':
      case 'red-plus':
      case 'green-base':
      case 'green-plus':
      case 'yellow-base':
      case 'yellow-plus':
      case 'blue-base':
      case 'blue-plus':
        success = this.buildOfficeSpace(world, entity, region);
        break;

      case 'core':
        success = this.buildCore(world, entity, region);
        break;
    }

    if (success) {
      world.editEntity(entity).removeComponent('active');
    } else {
      console.error('region failed', region);
    }
  }

  buildElevator(world, entity, region) {
    const partition = {
      type: 'final',
      kind: 'hub',
      shape: region.shape.shrink(),
      exits: region.exits
    };
    return this.tryToBuildPartition(world, entity, region, partition);
  }

  buildOfficeSpace(world, entity, region) {
    const partitioner = new space_partitioner_1.SpacePartitioner(this.rng);
    partitioner.registerPartitioner(new partitioners.CorridorSplit(3, 10));
    partitioner.registerPartitioner(new partitioners.RoomSplit(8));
    partitioner.registerPartitioner(new partitioners.OutsetCorridorSplit(3, 8));
    const partition = partitioner.partition(region.shape, region.exits);
    return this.tryToBuildPartition(world, entity, region, partition);
  }

  buildEntrance(world, entity, region) {
    const partitioner = new space_partitioner_1.SpacePartitioner(this.rng);
    partitioner.registerPartitioner(new partitioners.OutsetCorridorSplit(3, 8));
    const partition = partitioner.partition(region.shape, region.exits);
    return this.tryToBuildPartition(world, entity, region, partition);
  }

  buildCore(world, entity, region) {
    const partitioner = new space_partitioner_1.SpacePartitioner(this.rng);
    partitioner.registerPartitioner(new partitioners.KnossosMaze());
    const partition = partitioner.partition(region.shape, region.exits);
    return this.tryToBuildPartition(world, entity, region, partition);
  }

  printPartition(partition, tab = '') {
    switch (partition.type) {
      case 'final':
        {
          const bounds = partition.shape.bounds();
          return `${tab}+${partition.kind} - ${bounds.x}, ${bounds.y}, ${bounds.width}, ${bounds.height}`;
        }

      case 'node':
        {
          const bounds = partition.shape.bounds();
          return `${tab}+${partition.type} - ${bounds.x}, ${bounds.y}, ${bounds.width}, ${bounds.height}\n${partition.partitions.map(p => this.printPartition(p, tab + '| ')).join('\n')}`;
        }
    }
  }

  tryToBuildPartition(world, entity, region, partition) {
    const root = this.fillPartitionWithStructure(world, entity, partition);
    const embeddings = this.findEmbedding(world, entity, root);

    if (embeddings !== undefined) {
      if (!this.dry) {
        const map = world.getResource('map');
        this.renderPartition(world, map, region.level, partition);
        embeddings.forEach(e => complex_filler_1.fill(world, map, region.level, e.embedding, this.uniform, e.structure));
      }

      return true;
    } else {
      this.removeStructures(world, entity);
      return false;
    }
  }

  fillPartitionWithStructure(world, region, partition) {
    switch (partition.type) {
      case 'node':
        {
          const structures = partition.partitions.map(p => this.fillPartitionWithStructure(world, region, p));
          partition.connections.forEach(e => {
            const from = structures[e.from];
            const to = structures[e.to];
            world.getComponent(from, 'structure').connections.push(to);
            world.getComponent(to, 'structure').connections.push(from);
          });
          return structures[partition.exit];
        }

      case 'final':
        {
          const entity = world.createEntity().withComponent('structure', {
            kind: partition.kind,
            shape: partition.shape,
            connections: [],
            region
          }).entity;
          partition.entity = entity;
          return entity;
        }
    }
  }

  removeStructures(world, region) {
    const structures = [];
    world.getStorage('structure').foreach((e, s) => {
      if (s.region === region) {
        structures.push(e);
      }
    });
    structures.forEach(e => world.deleteEntity(e));
  }

  findEmbedding(world, entity, structure) {
    const s = world.getComponent(structure, 'structure');

    if (s.region === entity) {
      const region = world.getComponent(entity, 'region');
      const params = complexes_1.regionParams[region.type];
      return complex_embedder_1.embedComplexes(world, this.uniform, entity, params);
    }

    return [];
  }

  renderPartition(world, map, level, partition) {
    switch (partition.type) {
      case 'node':
        {
          partition.partitions.map(partition => this.renderPartition(world, map, level, partition));
          break;
        }

      case 'final':
        {
          const entity = partition.entity;

          if (partition.kind === 'room') {
            this.renderRoom(world, map, level, entity, partition.shape, partition.kind);
            this.renderExits(world, map, level, entity, partition.shape, partition.exits);
            this.renderDoors(world, map, level, partition.shape, partition.exits);
          } else if (partition.kind === 'corridor') {
            this.renderRoom(world, map, level, entity, partition.shape, partition.kind);
            this.renderExits(world, map, level, entity, partition.shape, partition.exits);
          } else if (partition.kind === 'hub') {
            this.renderRoom(world, map, level, entity, partition.shape, partition.kind);
            this.renderExits(world, map, level, entity, partition.shape, partition.exits);
            this.renderDoors(world, map, level, partition.shape, partition.exits);
          }
        }
    }
  }

  renderExits(world, map, level, entity, shape, positions) {
    const bounds = shape.bounds();
    positions.forEach(exit => {
      if (map.levels[level].getStructure(exit) === undefined) {
        const direction = bounds.grow().getWall(exit);

        if (direction !== undefined) {
          const shape = asset_1.shapeOfAsset('door', exit, direction);
          shape.foreach(position => {
            this.setTile(world, map, level, position, entity, 'corridor');
          });
        }
      }
    });
  }

  renderDoors(world, map, level, shape, positions) {
    const bounds = shape.bounds();
    positions.forEach(exit => {
      if (map.levels[level].tileMatches(world, exit, f => f !== undefined && f.feature().ground)) {
        const direction = bounds.grow().getWall(exit);

        if (direction !== undefined) {
          const shape = asset_1.shapeOfAsset('door', exit, direction);
          asset_1.createAssetFromShape(world, this.uniform, level, shape, 'door');
        }
      }
    });
  }

  renderRoom(world, map, level, entity, shape, floor) {
    shape.foreach(position => {
      this.setTile(world, map, level, position, entity, floor);
    });
  }

  setTile(world, map, level, position, entity, floor) {
    feature_1.createFeatureFromType(world, level, position, floor);
    map.levels[level].setStructure(position, entity);
  }

}

exports.RegionBuilder = RegionBuilder;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const complex_embedder_1 = __webpack_require__(44);

const characters_1 = __webpack_require__(8);

function restriction(restriction) {
  return restriction;
}

const complexesDefinition = {
  entrance: {
    structures: [{
      description: {
        decorations: [],
        containers: [complex_embedder_1.layout('regular', 'wall', complex_embedder_1.occur(8), 'urinal')],
        loots: [],
        npcs: [],
        bosses: []
      },
      restriction: restriction({
        kind: 'room'
      })
    }]
  },
  theCore: {
    structures: [{
      description: {
        decorations: [],
        containers: [complex_embedder_1.layout('default', 'wall', complex_embedder_1.occur(8), 'generator'), complex_embedder_1.layout('default', 'center', complex_embedder_1.occur(1), 'core')],
        loots: [],
        npcs: [],
        bosses: []
      },
      restriction: restriction({
        kind: 'room'
      })
    }]
  },
  anEncounter: {
    structures: [{
      description: {
        decorations: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), 'trash')],
        containers: [complex_embedder_1.layout('default', 'wall', complex_embedder_1.occur(1), 'locker')],
        loots: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), 'nailGun', 'leatherJacket'), complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), 'powerGauntlet')],
        npcs: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), characters_1.characterCreators.eliteGuard, characters_1.characterCreators.guard)],
        bosses: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), characters_1.characterCreators.boss)]
      },
      restriction: restriction({
        kind: 'room'
      })
    }]
  },
  toilettes: {
    structures: [{
      description: {
        decorations: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(5), 'trash')],
        containers: [complex_embedder_1.layout('default', 'wall', complex_embedder_1.occur(1), 'urinal')],
        loots: [],
        npcs: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1, 3), characters_1.characterCreators.civilian)],
        bosses: []
      },
      restriction: restriction({
        kind: 'room',
        exact: true,
        connects: [1]
      })
    }, {
      description: {
        decorations: [],
        containers: [],
        loots: [],
        npcs: [],
        bosses: []
      },
      restriction: restriction({
        kind: 'corridor',
        connects: [0]
      })
    }]
  },
  guardsStation: {
    structures: [{
      description: {
        decorations: [],
        containers: [],
        loots: [],
        npcs: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), (world, random, region, options) => {
          const civilian = characters_1.characterCreators.civilian(world, random, region, options);
          world.editEntity(civilian).withComponent('quest', {
            type: 'quest1'
          });
          return civilian;
        })],
        bosses: []
      },
      restriction: restriction({
        kind: 'corridor',
        connects: [1]
      })
    }, {
      description: {
        decorations: [],
        containers: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(4), 'table')],
        loots: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), 'bandages', 'deathPill')],
        npcs: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(2), characters_1.characterCreators.eliteGuard), complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(3), characters_1.characterCreators.guard)],
        bosses: []
      },
      restriction: restriction({
        kind: 'room',
        connects: [2, 0]
      })
    }, {
      description: {
        decorations: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), 'terminal')],
        containers: [complex_embedder_1.layout('default', 'wall', complex_embedder_1.occur(5), 'locker')],
        loots: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(5), 'sniperRifle'), complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(3), 'bandages'), complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(5), 'leatherJacket')],
        npcs: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(1), characters_1.characterCreators.eliteGuard, characters_1.characterCreators.guard)],
        bosses: []
      },
      restriction: restriction({
        kind: 'room',
        connects: [1],
        exact: true
      })
    }]
  },
  generators: {
    structures: [{
      description: {
        decorations: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(3), 'generator')],
        containers: [complex_embedder_1.layout('default', 'random', complex_embedder_1.optional(1), 'locker')],
        loots: [complex_embedder_1.layout('default', 'random', complex_embedder_1.occur(2), 'bandages')],
        npcs: [],
        bosses: []
      },
      restriction: restriction({
        kind: 'corridor'
      })
    }]
  },
  elevator: {
    structures: [{
      description: {
        decorations: [complex_embedder_1.layout('default', 'center', complex_embedder_1.occur(1), 'elevator')],
        containers: [],
        loots: [],
        npcs: [],
        bosses: []
      },
      restriction: restriction({
        kind: 'hub'
      })
    }]
  }
};
exports.complexes = complexesDefinition;
exports.regionParams = {
  'red-base': [],
  'red-plus': [],
  'green-base': [],
  'green-plus': [],
  'yellow-base': [],
  'yellow-plus': [],
  'blue-base': [],
  'blue-plus': [],
  'ground-floor': [{
    occurrence: complex_embedder_1.occur(1, 2),
    template: exports.complexes.anEncounter
  }, {
    occurrence: complex_embedder_1.occur(1),
    template: exports.complexes.guardsStation
  }, {
    occurrence: complex_embedder_1.occur(1, 2),
    template: exports.complexes.toilettes
  }, {
    occurrence: complex_embedder_1.occur(1, 2),
    template: exports.complexes.generators
  }],
  entrance: [{
    occurrence: complex_embedder_1.occur(1),
    template: exports.complexes.entrance
  }],
  elevator: [{
    occurrence: complex_embedder_1.occur(1),
    template: exports.complexes.elevator
  }],
  core: [{
    occurrence: complex_embedder_1.occur(1),
    template: exports.complexes.theCore
  }]
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var MiniSat = __webpack_require__(92);
var _ = __webpack_require__(45);
var Logic;
Logic = {};

////////// TYPE TESTERS


// Set the `description` property of a tester function and return the function.
var withDescription = function (description, tester) {
  tester.description = description;
  return tester;
};

// Create a function (x) => (x instanceof constructor), but possibly before
// constructor is available.  For example, if Logic.Formula hasn't been
// assigned yet, passing Logic for `obj` and "Formula" for `constructorName`
// will still work.
var lazyInstanceofTester = function (description, obj, constructorName) {
  return withDescription(description, function (x) {
    return x instanceof obj[constructorName];
  });
};


///// PUBLIC TYPE TESTERS

// All variables have a name and a number.  The number is mainly used
// internally, and it's what's given to MiniSat.  Names and numbers
// are interchangeable, which is convenient for doing manipulation
// of terms in a way that works before or after variable names are
// converted to numbers.

// Term: a variable name or variable number, optionally
// negated (meaning "boolean not").  For example,
// `1`, `-1`, `"foo"`, or `"-foo"`.  All variables have
// internal numbers that start at 1, so "foo" might be
// variable number 1, for example.  Any number of leading
// "-" will be parsed in the string form, but we try to
// keep it to either one or zero of them.

Logic.isNumTerm = withDescription('a NumTerm (non-zero integer)',
                                  function (x) {
                                    // 32-bit integer, but not 0
                                    return (x === (x | 0)) && x !== 0;
                                  });

// NameTerm must not be empty, or just `-` characters, or look like a
// number.  Specifically, it can't be zero or more `-` followed by
// zero or more digits.
Logic.isNameTerm = withDescription('a NameTerm (string)',
                                   function (x) {
                                     return (typeof x === 'string') &&
                                       ! /^-*[0-9]*$/.test(x);
                                   });

Logic.isTerm = withDescription('a Term (appropriate string or number)',
                               function (x) {
                                 return Logic.isNumTerm(x) ||
                                   Logic.isNameTerm(x);
                               });

// WholeNumber: a non-negative integer (0 is allowed)
Logic.isWholeNumber = withDescription('a whole number (integer >= 0)',
                                      function (x) {
                                        return (x === (x | 0)) && x >= 0;
                                      });

Logic.isFormula = lazyInstanceofTester('a Formula', Logic, 'Formula');
Logic.isClause = lazyInstanceofTester('a Clause', Logic, 'Clause');
Logic.isBits = lazyInstanceofTester('a Bits', Logic, 'Bits');

///// UNDOCUMENTED TYPE TESTERS

Logic._isInteger = withDescription(
  'an integer', function (x) { return x === (x | 0); });

Logic._isFunction = withDescription(
  'a Function', function (x) { return typeof x === 'function'; });

Logic._isString = withDescription(
  'a String', function (x) { return typeof x === 'string'; });

Logic._isArrayWhere = function (tester) {
  var description = 'an array';
  if (tester.description) {
    description += ' of ' + tester.description;
  }
  return withDescription(description, function (x) {
    if (! _.isArray(x)) {
      return false;
    } else {
      for (var i = 0; i < x.length; i++) {
        if (! tester(x[i])) {
          return false;
        }
      }
      return true;
    }
  });
};

Logic._isFormulaOrTerm = withDescription('a Formula or Term',
                                         function (x) {
                                           return Logic.isFormula(x) ||
                                             Logic.isTerm(x);
                                         });


Logic._isFormulaOrTermOrBits = withDescription('a Formula, Term, or Bits',
                                               function (x) {
                                                 return Logic.isFormula(x) ||
                                                   Logic.isBits(x) ||
                                                   Logic.isTerm(x);
                                               });
Logic._MiniSat = MiniSat; // Expose for testing and poking around

// import the private testers from types.js
var isInteger = Logic._isInteger;
var isFunction = Logic._isFunction;
var isString = Logic._isString;
var isArrayWhere = Logic._isArrayWhere;
var isFormulaOrTerm = Logic._isFormulaOrTerm;
var isFormulaOrTermOrBits = Logic._isFormulaOrTermOrBits;

Logic._assert = function (value, tester, description) {
  if (! tester(value)) {
    var displayValue = (typeof value === 'string' ? JSON.stringify(value) :
                        value);
    throw new Error(displayValue + " is not " +
                    (tester.description || description));
  }
};

// Call this as `if (assert) assertNumArgs(...)`
var assertNumArgs = function (actual, expected, funcName) {
  if (actual !== expected) {
    throw new Error("Expected " + expected + " args in " + funcName +
                    ", got " + actual);
  }
};

// Call `assert` as: `if (assert) assert(...)`.
// This local variable temporarily set to `null` inside
// `Logic.disablingAssertions`.
var assert = Logic._assert;

// Like `if (assert) assert(...)` but usable from other files in the package.
Logic._assertIfEnabled = function (value, tester, description) {
  if (assert) assert(value, tester, description);
};

// Disabling runtime assertions speeds up clause generation.  Assertions
// are disabled when the local variable `assert` is null instead of
// `Logic._assert`.
Logic.disablingAssertions = function (f) {
  var oldAssert = assert;
  try {
    assert = null;
    return f();
  } finally {
    assert = oldAssert;
  }
};

// Back-compat.
Logic._disablingTypeChecks = Logic.disablingAssertions;

////////////////////

// Takes a Formula or Term, returns a Formula or Term.
// Unlike other operators, if you give it a Term,
// you will get a Term back (of the same type, NameTerm
// or NumTerm).
Logic.not = function (operand) {
  if (assert) assert(operand, isFormulaOrTerm);

  if (operand instanceof Logic.Formula) {
    return new Logic.NotFormula(operand);
  } else {
    // Term
    if (typeof operand === 'number') {
      return -operand;
    } else if (operand.charAt(0) === '-') {
      return operand.slice(1);
    } else {
      return '-' + operand;
    }
  }
};

Logic.NAME_FALSE = "$F";
Logic.NAME_TRUE = "$T";
Logic.NUM_FALSE = 1;
Logic.NUM_TRUE = 2;

Logic.TRUE = Logic.NAME_TRUE;
Logic.FALSE = Logic.NAME_FALSE;

// Abstract base class.  Subclasses are created using _defineFormula.
Logic.Formula = function () {};

Logic._defineFormula = function (constructor, typeName, methods) {
  if (assert) assert(constructor, isFunction);
  if (assert) assert(typeName, isString);

  constructor.prototype = new Logic.Formula();
  constructor.prototype.type = typeName;
  if (methods) {
    _.extend(constructor.prototype, methods);
  }
};

// Returns a list of Clauses that together require the Formula to be
// true, or false (depending on isTrue; both cases must be
// implemented).  A single Clause may also be returned.  The
// implementation should call the termifier to convert terms and
// formulas to NumTerms specific to a solver instance, and use them to
// construct a Logic.Clause.
Logic.Formula.prototype.generateClauses = function (isTrue, termifier) {
  throw new Error("Cannot generate this Formula; it must be expanded");
};
// All Formulas have a globally-unique id so that Solvers can track them.
// It is assigned lazily.
Logic.Formula._nextGuid = 1;
Logic.Formula.prototype._guid = null;
Logic.Formula.prototype.guid = function () {
  if (this._guid === null) {
    this._guid = Logic.Formula._nextGuid++;
  }
  return this._guid;
};

// A "clause" is a disjunction of terms, e.g. "A or B or (not C)",
// which we write "A v B v -C".  Logic.Clause is mainly an internal
// Solver data structure, which is the final result of formula
// generation and mapping variable names to numbers, before passing
// the clauses to MiniSat.
Logic.Clause = function (/*formulaOrArray, ...*/) {
  var terms = _.flatten(arguments);
  if (assert) assert(terms, isArrayWhere(Logic.isNumTerm));

  this.terms = terms; // immutable [NumTerm]
};

// Returns a new Clause with the extra term or terms appended
Logic.Clause.prototype.append = function (/*formulaOrArray, ...*/) {
  return new Logic.Clause(this.terms.concat(_.flatten(arguments)));
};

var FormulaInfo = function () {
  // We generate a variable when a Formula is used.
  this.varName = null; // string name of variable
  this.varNum = null; // number of variable (always positive)

  // A formula variable that is used only in the positive or only
  // in the negative doesn't need the full set of clauses that
  // establish a bidirectional implication between the formula and the
  // variable.  For example, in the formula `Logic.or("A", "B")`, with the
  // formula variable `$or1`, the full set of clauses is `A v B v
  // -$or1; -A v $or1; -B v $or1`.  If both `$or1` and `-$or1` appear
  // elsewhere in the set of clauses, then all three of these clauses
  // are required.  However, somewhat surprisingly, if only `$or1` appears,
  // then only the first is necessary.  If only `-$or1` appears, then only
  // the second and third are necessary.
  //
  // Suppose the formula A v B is represented by the variable $or1,
  // and $or1 is only used positively. It's important that A v B being
  // false forces $or1 to be false, so that when $or1 is used it has
  // the appropriate effect. For example, if we have the clause $or1 v
  // C, then A v B being false should force $or1 to be false, which
  // forces C to be true. So we generate the clause A v B v
  // -$or1. (The implications of this clause are: If A v B is false,
  // $or1 must be false. If $or1 is true, A v B must be true.)
  //
  // However, in the case where A v B is true, we don't actually
  // need to insist that the solver set $or1 to true, as long as we
  // are ok with relaxing the relationship between A v B and $or1
  // and getting a "wrong" value for $or1 in the solution. Suppose
  // the solver goes to work and at some point determines A v B to
  // be true. It could set $or1 to true, satisfying all the clauses
  // where it appears, or it could set $or1 to false, which only
  // constrains the solution space and doesn't open up any new
  // solutions for other variables. If the solver happens to find a
  // solution where A v B is true and $or1 is false, we know there
  // is a similar solution that makes all the same assignments
  // except it assigns $or1 to true.
  //
  // If a formula is used only negatively, a similar argument applies
  // but with signs flipped, and if it is used both positively and
  // negatively, both kinds of clauses must be generated.
  //
  // See the mention of "polarity" in the MiniSat+ paper
  // (http://minisat.se/downloads/MiniSat+.pdf).
  //
  // These flags are set when generation has been done for the positive
  // case or the negative case, so that we only generate each one once.
  this.occursPositively = false;
  this.occursNegatively = false;

  // If a Formula has been directly required or forbidden, we can
  // replace it by TRUE or FALSE in subsequent clauses.  Track the
  // information here.
  this.isRequired = false;
  this.isForbidden = false;
};


// The "termifier" interface is provided to a Formula's
// generateClauses method, which must use it to generate Clause
// objects.
//
// The reason for this approach is that it gives the Formula control
// over the clauses returned, but it gives the Solver control over
// Formula generation.
Logic.Termifier = function (solver) {
  this.solver = solver;
};

// The main entry point, the `clause` method takes a list of
// FormulaOrTerms and converts it to a Clause containing NumTerms, *by
// replacing Formulas with their variables*, creating the variable if
// necessary.  For example, if an OrFormula is represented by the
// variable `$or1`, it will be replaced by the numeric version of
// `$or1` to make the Clause.  When the Clause is actually used, it
// will trigger generation of the clauses that relate `$or1` to the
// operands of the OrFormula.
Logic.Termifier.prototype.clause = function (/*args*/) {
  var self = this;
  var formulas = _.flatten(arguments);
  if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));

  return new Logic.Clause(_.map(formulas, function (f) {
    return self.term(f);
  }));
};

// The `term` method performs the mapping from FormulaOrTerm to
// NumTerm.  It's called by `clause` and could be called directly
// from a Formula's generateClauses if it was useful for some
// reason.
Logic.Termifier.prototype.term = function (formula) {
  return this.solver._formulaToTerm(formula);
};

// The `generate` method generates clauses for a Formula (or
// Term).  It should be used carefully, because it works quite
// differently from passing a Formula into `clause`, which is the
// normal way for one Formula to refer to another.  When you use a
// Formula in `clause`, it is replaced by the Formula's variable,
// and the Solver handles generating the Formula's clauses once.
// When you use `generate`, this system is bypassed, and the
// Formula's generateClauses method is called pretty much directly,
// returning the array of Clauses.
Logic.Termifier.prototype.generate = function (isTrue, formula) {
  return this.solver._generateFormula(isTrue, formula, this);
};


Logic.Solver = function () {
  var self = this;

  self.clauses = []; // mutable [Clause]
  self._num2name = [null]; // no 0th var
  self._name2num = {}; // (' '+vname) -> vnum

  // true and false
  var F = self.getVarNum(Logic.NAME_FALSE, false, true); // 1
  var T = self.getVarNum(Logic.NAME_TRUE, false, true); // 2
  if (F !== Logic.NUM_FALSE || T !== Logic.NUM_TRUE) {
    throw new Error("Assertion failure: $T and $F have wrong numeric value");
  }
  self._F_used = false;
  self._T_used = false;
  // It's important that these clauses are elements 0 and 1
  // of the clauses array, so that they can optionally be stripped
  // off.  For example, _clauseData takes advantage of this fact.
  self.clauses.push(new Logic.Clause(-Logic.NUM_FALSE));
  self.clauses.push(new Logic.Clause(Logic.NUM_TRUE));

  self._formulaInfo = {}; // Formula guid -> FormulaInfo
  // For generating formula variables like "$or1", "$or2", "$and1", "$and2"
  self._nextFormulaNumByType = {}; // Formula type -> next var id
  // Map of Formulas whose info has `false` for either
  // `occursPositively` or `occursNegatively`
  self._ungeneratedFormulas = {}; // varNum -> Formula

  self._numClausesAddedToMiniSat = 0;
  self._unsat = false; // once true, no solution henceforth
  self._minisat = new MiniSat(); // this takes some time

  self._termifier = new Logic.Termifier(self);
};

// Get a var number for vname, assigning it a number if it is new.
// Setting "noCreate" to true causes the function to return 0 instead of
// creating a new variable.
// Setting "_createInternals" to true grants the ability to create $ variables.
Logic.Solver.prototype.getVarNum = function (vname, noCreate, _createInternals) {
  var key = ' '+vname;
  if (_.has(this._name2num, key)) {
    return this._name2num[key];
  } else if (noCreate) {
    return 0;
  } else {
    if (vname.charAt(0) === "$" && ! _createInternals) {
      throw new Error("Only generated variable names can start with $");
    }
    var vnum = this._num2name.length;
    this._name2num[key] = vnum;
    this._num2name.push(vname);
    return vnum;
  }
};

Logic.Solver.prototype.getVarName = function (vnum) {
  if (assert) assert(vnum, isInteger);

  var num2name = this._num2name;
  if (vnum < 1 || vnum >= num2name.length) {
    throw new Error("Bad variable num: " + vnum);
  } else {
    return num2name[vnum];
  }
};

// Converts a Term to a NumTerm (if it isn't already).  This is done
// when a Formula creates Clauses for a Solver, since Clauses require
// NumTerms.  NumTerms stay the same, while a NameTerm like "-foo"
// might become (say) the number -3.  If a NameTerm names a variable
// that doesn't exist, it is automatically created, unless noCreate
// is passed, in which case 0 is returned instead.
Logic.Solver.prototype.toNumTerm = function (t, noCreate) {
  var self = this;

  if (assert) assert(t, Logic.isTerm);

  if (typeof t === 'number') {
    return t;
  } else { // string
    var not = false;
    while (t.charAt(0) === '-') {
      t = t.slice(1);
      not = ! not;
    }
    var n = self.getVarNum(t, noCreate);
    if (! n) {
      return 0; // must be the noCreate case
    } else {
      return (not ? -n : n);
    }
  }
};

// Converts a Term to a NameTerm (if it isn't already).
Logic.Solver.prototype.toNameTerm = function (t) {
  var self = this;

  if (assert) assert(t, Logic.isTerm);

  if (typeof t === 'string') {
    // canonicalize, removing leading "--"
    while (t.slice(0, 2) === '--') {
      t = t.slice(2);
    }
    return t;
  } else { // number
    var not = false;
    if (t < 0) {
      not = true;
      t = -t;
    }
    t = self.getVarName(t);
    if (not) {
      t = '-' + t;
    }
    return t;
  }
};

Logic.Solver.prototype._addClause = function (cls, _extraTerms,
                                              _useTermOverride) {
  var self = this;

  if (assert) assert(cls, Logic.isClause);

  var extraTerms = null;
  if (_extraTerms) {
    extraTerms = _extraTerms;
    if (assert) assert(extraTerms, isArrayWhere(Logic.isNumTerm));
  }

  var usedF = false;
  var usedT = false;

  var numRealTerms = cls.terms.length;
  if (extraTerms) {
    // extraTerms are added to the clause as is.  Formula variables in
    // extraTerms do not cause Formula clause generation, which is
    // necessary to implement Formula clause generation.
    cls = cls.append(extraTerms);
  }

  for (var i = 0; i < cls.terms.length; i++) {
    var t = cls.terms[i];
    var v = (t < 0) ? -t : t;
    if (v === Logic.NUM_FALSE) {
      usedF = true;
    } else if (v === Logic.NUM_TRUE) {
      usedT = true;
    } else if (v < 1 || v >= self._num2name.length) {
      throw new Error("Bad variable number: " + v);
    } else if (i < numRealTerms) {
      if (_useTermOverride) {
        _useTermOverride(t);
      } else {
        self._useFormulaTerm(t);
      }
    }
  }

  this._F_used = (this._F_used || usedF);
  this._T_used = (this._T_used || usedT);

  this.clauses.push(cls);
};

// When we actually use a Formula variable, generate clauses for it,
// based on whether the usage is positive or negative.  For example,
// if the Formula `Logic.or("X", "Y")` is represented by `$or1`, which
// is variable number 5, then when you actually use 5 or -5 in a clause,
// the clauses "X v Y v -5" (when you use 5) or "-X v 5; -Y v 5"
// (when you use -5) will be generated.  The clause "X v Y v -5"
// is equivalent to "5 => X v Y" (or -(X v Y) => -5), while the clauses
// "-X v 5; -Y v 5" are equivalent to "-5 => -X; -5 => -Y" (or
// "X => 5; Y => 5").

Logic.Solver.prototype._useFormulaTerm = function (t, _addClausesOverride) {
  var self = this;
  if (assert) assert(t, Logic.isNumTerm);
  var v = (t < 0) ? -t : t;

  if (! _.has(self._ungeneratedFormulas, v)) {
    return;
  }

  // using a Formula's var; maybe have to generate clauses
  // for the Formula
  var formula = self._ungeneratedFormulas[v];
  var info = self._getFormulaInfo(formula);
  var positive = t > 0;

  // To avoid overflowing the JS stack, defer calls to addClause.
  // The way we get overflows is when Formulas are deeply nested
  // (which happens naturally when you call Logic.sum or
  // Logic.weightedSum on a long list of terms), which causes
  // addClause to call useFormulaTerm to call addClause, and so
  // on.  Approach:  The outermost useFormulaTerm keeps a list
  // of clauses to add, and then adds them in a loop using a
  // special argument to addClause that passes a special argument
  // to useFormulaTerm that causes those clauses to go into the
  // list too.  Code outside of `_useFormulaTerm` and `_addClause(s)`
  // does not have to pass these special arguments to call them.
  var deferredAddClauses = null;
  var addClauses;
  if (! _addClausesOverride) {
    deferredAddClauses = [];
    addClauses = function (clauses, extraTerms) {
      deferredAddClauses.push({clauses: clauses,
                               extraTerms: extraTerms});
    };
  } else {
    addClauses = _addClausesOverride;
  }

  if (positive && ! info.occursPositively) {
    // generate clauses for the formula.
    // Eg, if we use variable `X` which represents the formula
    // `A v B`, add the clause `A v B v -X`.
    // By using the extraTerms argument to addClauses, we avoid
    // treating this as a negative occurrence of X.
    info.occursPositively = true;
    var clauses = self._generateFormula(true, formula);
    addClauses(clauses, [-v]);
  } else if ((! positive) && ! info.occursNegatively) {
    // Eg, if we have the term `-X` where `X` represents the
    // formula `A v B`, add the clauses `-A v X` and `-B v X`.
    // By using the extraTerms argument to addClauses, we avoid
    // treating this as a positive occurrence of X.
    info.occursNegatively = true;
    var clauses = self._generateFormula(false, formula);
    addClauses(clauses, [v]);
  }
  if (info.occursPositively && info.occursNegatively) {
    delete self._ungeneratedFormulas[v];
  }

  if (! (deferredAddClauses && deferredAddClauses.length)) {
    return;
  }

  var useTerm = function (t) {
    self._useFormulaTerm(t, addClauses);
  };
  // This is the loop that turns recursion into iteration.
  // When addClauses calls useTerm, which calls useFormulaTerm,
  // the nested useFormulaTerm will add any clauses to our
  // own deferredAddClauses list.
  while (deferredAddClauses.length) {
    var next = deferredAddClauses.pop();
    self._addClauses(next.clauses, next.extraTerms, useTerm);
  }
};

Logic.Solver.prototype._addClauses = function (array, _extraTerms,
                                               _useTermOverride) {
  if (assert) assert(array, isArrayWhere(Logic.isClause));
  var self = this;
  _.each(array, function (cls) {
    self._addClause(cls, _extraTerms, _useTermOverride);
  });
};

Logic.Solver.prototype.require = function (/*formulaOrArray, ...*/) {
  this._requireForbidImpl(true, _.flatten(arguments));
};

Logic.Solver.prototype.forbid = function (/*formulaOrArray, ...*/) {
  this._requireForbidImpl(false, _.flatten(arguments));
};

Logic.Solver.prototype._requireForbidImpl = function (isRequire, formulas) {
  var self = this;
  if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));

  _.each(formulas, function (f) {
    if (f instanceof Logic.NotFormula) {
      self._requireForbidImpl(!isRequire, [f.operand]);
    } else if (f instanceof Logic.Formula) {
      var info = self._getFormulaInfo(f);
      if (info.varNum !== null) {
        var sign = isRequire ? 1 : -1;
        self._addClause(new Logic.Clause(sign*info.varNum));
      } else {
        self._addClauses(self._generateFormula(isRequire, f));
      }
      if (isRequire) {
        info.isRequired = true;
      } else {
        info.isForbidden = true;
      }
    } else {
      self._addClauses(self._generateFormula(isRequire, f));
    }
  });
};

Logic.Solver.prototype._generateFormula = function (isTrue, formula, _termifier) {
  var self = this;
  if (assert) assert(formula, isFormulaOrTerm);

  if (formula instanceof Logic.NotFormula) {
    return self._generateFormula(!isTrue, formula.operand);
  } else if (formula instanceof Logic.Formula) {
    var info = self._getFormulaInfo(formula);
    if ((isTrue && info.isRequired) ||
        (!isTrue && info.isForbidden)) {
      return [];
      } else if ((isTrue && info.isForbidden) ||
                 (!isTrue && info.isRequired)) {
        return [new Logic.Clause()]; // never satisfied clause
      } else {
        var ret = formula.generateClauses(isTrue,
                                          _termifier || self._termifier);
        return _.isArray(ret) ? ret : [ret];
      }
  } else { // Term
    var t = self.toNumTerm(formula);
    var sign = isTrue ? 1 : -1;
    if (t === sign*Logic.NUM_TRUE || t === -sign*Logic.NUM_FALSE) {
      return [];
    } else if (t === sign*Logic.NUM_FALSE || t === -sign*Logic.NUM_TRUE) {
      return [new Logic.Clause()]; // never satisfied clause
    } else {
      return [new Logic.Clause(sign*t)];
    }
  }
};

// Get clause data as an array of arrays of integers,
// for testing and debugging purposes.
Logic.Solver.prototype._clauseData = function () {
  var clauses = _.pluck(this.clauses, 'terms');
  if (! this._T_used) {
    clauses.splice(1, 1);
  }
  if (! this._F_used) {
    clauses.splice(0, 1);
  }
  return clauses;
};

// Get clause data as an array of human-readable strings,
// for testing and debugging purposes.
// A clause might look like "A v -B" (where "v" represents
// and OR operator).
Logic.Solver.prototype._clauseStrings = function () {
  var self = this;
  var clauseData = self._clauseData();
  return _.map(clauseData, function (clause) {
    return _.map(clause, function (nterm) {
      var str = self.toNameTerm(nterm);
      if (/\s/.test(str)) {
        // write name in quotes for readability.  we don't bother
        // making this string machine-parsable in the general case.
        var sign = '';
        if (str.charAt(0) === '-') {
          // temporarily remove '-'
          sign = '-';
          str = str.slice(1);
        }
        str = sign + '"' + str + '"';
      }
      return str;
    }).join(' v ');
  });
};

Logic.Solver.prototype._getFormulaInfo = function (formula, _noCreate) {
  var self = this;
  var guid = formula.guid();
  if (! self._formulaInfo[guid]) {
    if (_noCreate) {
      return null;
    }
    self._formulaInfo[guid] = new FormulaInfo();
  }
  return self._formulaInfo[guid];
};

// Takes a Formula or an array of Formulas, returns a NumTerm or
// array of NumTerms.
Logic.Solver.prototype._formulaToTerm = function (formula) {
  var self = this;

  if (_.isArray(formula)) {
    if (assert) assert(formula, isArrayWhere(isFormulaOrTerm));
    return _.map(formula, _.bind(self._formulaToTerm, self));
  } else {
    if (assert) assert(formula, isFormulaOrTerm);
  }

  if (formula instanceof Logic.NotFormula) {
    // shortcut that avoids creating a variable called
    // something like "$not1" when you use Logic.not(formula).
    return Logic.not(self._formulaToTerm(formula.operand));
  } else if (formula instanceof Logic.Formula) {
    var info = this._getFormulaInfo(formula);
    if (info.isRequired) {
      return Logic.NUM_TRUE;
    } else if (info.isForbidden) {
      return Logic.NUM_FALSE;
    } else if (info.varNum === null) {
      // generate a Solver-local formula variable like "$or1"
      var type = formula.type;
      if (! this._nextFormulaNumByType[type]) {
        this._nextFormulaNumByType[type] = 1;
      }
      var numForVarName = this._nextFormulaNumByType[type]++;
      info.varName = "$" + formula.type + numForVarName;
      info.varNum = this.getVarNum(info.varName, false, true);
      this._ungeneratedFormulas[info.varNum] = formula;
    }
    return info.varNum;
  } else {
    // formula is a Term
    return self.toNumTerm(formula);
  }
};

Logic.or = function (/*formulaOrArray, ...*/) {
  var args = _.flatten(arguments);
  if (args.length === 0) {
    return Logic.FALSE;
  } else if (args.length === 1) {
    if (assert) assert(args[0], isFormulaOrTerm);
    return args[0];
  } else {
    return new Logic.OrFormula(args);
  }
};

Logic.OrFormula = function (operands) {
  if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
  this.operands = operands;
};

Logic._defineFormula(Logic.OrFormula, 'or', {
  generateClauses: function (isTrue, t) {
    if (isTrue) {
      // eg A v B v C
      return t.clause(this.operands);
    } else {
      // eg -A; -B; -C
      var result = [];
      _.each(this.operands, function (o) {
        result.push.apply(result, t.generate(false, o));
      });
      return result;
    }
  }
});

Logic.NotFormula = function (operand) {
  if (assert) assert(operand, isFormulaOrTerm);
  this.operand = operand;
};

// No generation or simplification for 'not'; it is
// simplified away by the solver itself.
Logic._defineFormula(Logic.NotFormula, 'not');

Logic.and = function (/*formulaOrArray, ...*/) {
  var args = _.flatten(arguments);
  if (args.length === 0) {
    return Logic.TRUE;
  } else if (args.length === 1) {
    if (assert) assert(args[0], isFormulaOrTerm);
    return args[0];
  } else {
    return new Logic.AndFormula(args);
  }
};

Logic.AndFormula = function (operands) {
  if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
  this.operands = operands;
};

Logic._defineFormula(Logic.AndFormula, 'and', {
  generateClauses: function (isTrue, t) {
    if (isTrue) {
      // eg A; B; C
      var result = [];
      _.each(this.operands, function (o) {
        result.push.apply(result, t.generate(true, o));
      });
      return result;
    } else {
      // eg -A v -B v -C
      return t.clause(_.map(this.operands, Logic.not));
    }
  }
});

// Group `array` into groups of N, where the last group
// may be shorter than N.  group([a,b,c,d,e], 3) => [[a,b,c],[d,e]]
var group = function (array, N) {
  var ret = [];
  for (var i = 0; i < array.length; i += N) {
    ret.push(array.slice(i, i+N));
  }
  return ret;
};

Logic.xor = function (/*formulaOrArray, ...*/) {
  var args = _.flatten(arguments);
  if (args.length === 0) {
    return Logic.FALSE;
  } else if (args.length === 1) {
    if (assert) assert(args[0], isFormulaOrTerm);
    return args[0];
  } else {
    return new Logic.XorFormula(args);
  }
};

Logic.XorFormula = function (operands) {
  if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
  this.operands = operands;
};

Logic._defineFormula(Logic.XorFormula, 'xor', {
  generateClauses: function (isTrue, t) {
    var args = this.operands;
    var not = Logic.not;
    if (args.length > 3) {
      return t.generate(
        isTrue,
        Logic.xor(
          _.map(group(this.operands, 3), function (group) {
            return Logic.xor(group);
          })));
    } else if (isTrue) { // args.length <= 3
      if (args.length === 0) {
        return t.clause(); // always fail
      } else if (args.length === 1) {
        return t.clause(args[0]);
      } else if (args.length === 2) {
        var A = args[0], B = args[1];
        return [t.clause(A, B), // A v B
                t.clause(not(A), not(B))]; // -A v -B
      } else if (args.length === 3) {
        var A = args[0], B = args[1], C = args[2];
        return [t.clause(A, B, C), // A v B v C
                t.clause(A, not(B), not(C)), // A v -B v -C
                t.clause(not(A), B, not(C)), // -A v B v -C
                t.clause(not(A), not(B), C)]; // -A v -B v C
      }
    } else { // !isTrue, args.length <= 3
      if (args.length === 0) {
        return []; // always succeed
      } else if (args.length === 1) {
        return t.clause(not(args[0]));
      } else if (args.length === 2) {
        var A = args[0], B = args[1];
        return [t.clause(A, not(B)), // A v -B
                t.clause(not(A), B)]; // -A v B
      } else if (args.length === 3) {
        var A = args[0], B = args[1], C = args[2];
        return [t.clause(not(A), not(B), not(C)), // -A v -B v -C
                t.clause(not(A), B, C), // -A v B v C
                t.clause(A, not(B), C), // A v -B v C
                t.clause(A, B, not(C))]; // A v B v -C
      }
    }
  }
});

Logic.atMostOne = function (/*formulaOrArray, ...*/) {
  var args = _.flatten(arguments);
  if (args.length <= 1) {
    return Logic.TRUE;
  } else {
    return new Logic.AtMostOneFormula(args);
  }
};

Logic.AtMostOneFormula = function (operands) {
  if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
  this.operands = operands;
};

Logic._defineFormula(Logic.AtMostOneFormula, 'atMostOne', {
  generateClauses: function (isTrue, t) {
     var args = this.operands;
     var not = Logic.not;
     if (args.length <= 1) {
       return []; // always succeed
     } else if (args.length === 2) {
       return t.generate(isTrue, Logic.not(Logic.and(args)));
     } else if (isTrue && args.length === 3) {
       // Pick any two args; at least one is false (they aren't
       // both true).  This strategy would also work for
       // N>3, and could provide a speed-up by having more clauses
       // (N^2) but fewer propagation steps.  No speed-up was
       // observed on the Sudoku test from using this strategy
       // up to N=10.
       var clauses = [];
       for (var i = 0; i < args.length; i++) {
         for (var j = i+1; j < args.length; j++) {
           clauses.push(t.clause(not(args[i]), not(args[j])));
         }
       }
       return clauses;
     } else if ((! isTrue) && args.length === 3) {
       var A = args[0], B = args[1], C = args[2];
       // Pick any two args; at least one is true (they aren't
       // both false).  This only works for N=3.
       return [t.clause(A, B), t.clause(A, C), t.clause(B, C)];
     } else {
       // See the "commander variables" technique from:
       // http://www.cs.cmu.edu/~wklieber/papers/2007_efficient-cnf-encoding-for-selecting-1.pdf
       // But in short: At most one group has at least one "true",
       // and each group has at most one "true".  Formula generation
       // automatically generates the right implications.
       var groups = group(args, 3);
       var ors = _.map(groups, function (g) { return Logic.or(g); });
       if (groups[groups.length - 1].length < 2) {
         // Remove final group of length 1 so we don't generate
         // no-op clauses of one sort or another
         groups.pop();
       }
       var atMostOnes = _.map(groups, function (g) {
         return Logic.atMostOne(g);
       });
       return t.generate(isTrue, Logic.and(Logic.atMostOne(ors), atMostOnes));
     }
  }
});

Logic.implies = function (A, B) {
  if (assert) assertNumArgs(arguments.length, 2, "Logic.implies");
  return new Logic.ImpliesFormula(A, B);
};

Logic.ImpliesFormula = function (A, B) {
  if (assert) assert(A, isFormulaOrTerm);
  if (assert) assert(B, isFormulaOrTerm);
  if (assert) assertNumArgs(arguments.length, 2, "Logic.implies");
  this.A = A;
  this.B = B;
};

Logic._defineFormula(Logic.ImpliesFormula, 'implies', {
  generateClauses: function (isTrue, t) {
    return t.generate(isTrue, Logic.or(Logic.not(this.A), this.B));
  }
});

Logic.equiv = function (A, B) {
  if (assert) assertNumArgs(arguments.length, 2, "Logic.equiv");
  return new Logic.EquivFormula(A, B);
};

Logic.EquivFormula = function (A, B) {
  if (assert) assert(A, isFormulaOrTerm);
  if (assert) assert(B, isFormulaOrTerm);
  if (assert) assertNumArgs(arguments.length, 2, "Logic.equiv");
  this.A = A;
  this.B = B;
};

Logic._defineFormula(Logic.EquivFormula, 'equiv', {
  generateClauses: function (isTrue, t) {
    return t.generate(!isTrue, Logic.xor(this.A, this.B));
  }
});

Logic.exactlyOne = function (/*formulaOrArray, ...*/) {
  var args = _.flatten(arguments);
  if (args.length === 0) {
    return Logic.FALSE;
  } else if (args.length === 1) {
    if (assert) assert(args[0], isFormulaOrTerm);
    return args[0];
  } else {
    return new Logic.ExactlyOneFormula(args);
  }
};

Logic.ExactlyOneFormula = function (operands) {
  if (assert) assert(operands, isArrayWhere(isFormulaOrTerm));
  this.operands = operands;
};

Logic._defineFormula(Logic.ExactlyOneFormula, 'exactlyOne', {
  generateClauses: function (isTrue, t) {
    var args = this.operands;
    if (args.length < 3) {
      return t.generate(isTrue, Logic.xor(args));
    } else {
      return t.generate(isTrue, Logic.and(Logic.atMostOne(args),
                                          Logic.or(args)));
    }
  }
});

// List of 0 or more formulas or terms, which together represent
// a non-negative integer.  Least significant bit is first.  That is,
// the kth array element has a place value of 2^k.
Logic.Bits = function (formulaArray) {
  if (assert) assert(formulaArray, isArrayWhere(isFormulaOrTerm));
  this.bits = formulaArray; // public, immutable
};

Logic.constantBits = function (wholeNumber) {
  if (assert) assert(wholeNumber, Logic.isWholeNumber);
  var result = [];
  while (wholeNumber) {
    result.push((wholeNumber & 1) ? Logic.TRUE : Logic.FALSE);
    wholeNumber >>>= 1;
  }
  return new Logic.Bits(result);
};

Logic.variableBits = function (baseName, nbits) {
  if (assert) assert(nbits, Logic.isWholeNumber);
  var result = [];
  for (var i = 0; i < nbits; i++) {
    result.push(baseName + '$' + i);
  }
  return new Logic.Bits(result);
};

// bits1 <= bits2
Logic.lessThanOrEqual = function (bits1, bits2) {
  return new Logic.LessThanOrEqualFormula(bits1, bits2);
};

Logic.LessThanOrEqualFormula = function (bits1, bits2) {
  if (assert) assert(bits1, Logic.isBits);
  if (assert) assert(bits2, Logic.isBits);
  if (assert) assertNumArgs(arguments.length, 2, "Bits comparison function");
  this.bits1 = bits1;
  this.bits2 = bits2;
};

var genLTE = function (bits1, bits2, t, notEqual) {
  var ret = [];
  // clone so we can mutate them in place
  var A = bits1.bits.slice();
  var B = bits2.bits.slice();
  if (notEqual && ! bits2.bits.length) {
    // can't be less than 0
    return t.clause();
  }
  // if A is longer than B, the extra (high) bits
  // must be 0.
  while (A.length > B.length) {
    var hi = A.pop();
    ret.push(t.clause(Logic.not(hi)));
  }
  // now B.length >= A.length
  // Let xors[i] be (A[i] xor B[i]), or just
  // B[i] if A is too short.
  var xors = _.map(B, function (b, i) {
    if (i < A.length) {
      return Logic.xor(A[i], b);
    } else {
      return b;
    }
  });

  // Suppose we are comparing 3-bit numbers, requiring
  // that ABC <= XYZ.  Here is what we require:
  //
  // * It is false that A=1 and X=0.
  // * It is false that A=X, B=1, and Y=0.
  // * It is false that A=X, B=Y, C=1, and Y=0.
  //
  // Translating these into clauses using DeMorgan's law:
  //
  // * A=0 or X=1
  // * (A xor X) or B=0 or Y=1
  // * (A xor X) or (B xor Y) or C=0 or Y=1
  //
  // Since our arguments are LSB first, in the example
  // we would be given [C, B, A] and [Z, Y, X] as input.
  // We iterate over the first argument starting from
  // the right, and build up a clause by iterating over
  // the xors from the right.
  //
  // If we have ABC <= VWXYZ, then we still have three clauses,
  // but each one is prefixed with "V or W or", because V and W
  // are at the end of the xors array.  This is equivalent to
  // padding ABC with two zeros.

  for (var i = A.length-1; i >= 0; i--) {
    ret.push(t.clause(xors.slice(i+1), Logic.not(A[i]), B[i]));
  }
  if (notEqual) {
    ret.push.apply(ret, t.generate(true, Logic.or(xors)));
  }
  return ret;
};

Logic._defineFormula(Logic.LessThanOrEqualFormula, 'lte', {
  generateClauses: function (isTrue, t) {
    if (isTrue) {
      // bits1 <= bits2
      return genLTE(this.bits1, this.bits2, t, false);
    } else {
      // bits2 < bits1
      return genLTE(this.bits2, this.bits1, t, true);
    }
  }
});

// bits1 < bits2
Logic.lessThan = function (bits1, bits2) {
  return new Logic.LessThanFormula(bits1, bits2);
};

Logic.LessThanFormula = function (bits1, bits2) {
  if (assert) assert(bits1, Logic.isBits);
  if (assert) assert(bits2, Logic.isBits);
  if (assert) assertNumArgs(arguments.length, 2, "Bits comparison function");
  this.bits1 = bits1;
  this.bits2 = bits2;
};

Logic._defineFormula(Logic.LessThanFormula, 'lt', {
  generateClauses: function (isTrue, t) {
    if (isTrue) {
      // bits1 < bits2
      return genLTE(this.bits1, this.bits2, t, true);
    } else {
      // bits2 <= bits1
      return genLTE(this.bits2, this.bits1, t, false);
    }
  }
});

Logic.greaterThan = function (bits1, bits2) {
  return Logic.lessThan(bits2, bits1);
};

Logic.greaterThanOrEqual = function (bits1, bits2) {
  return Logic.lessThanOrEqual(bits2, bits1);
};

Logic.equalBits = function (bits1, bits2) {
  return new Logic.EqualBitsFormula(bits1, bits2);
};

Logic.EqualBitsFormula = function (bits1, bits2) {
  if (assert) assert(bits1, Logic.isBits);
  if (assert) assert(bits2, Logic.isBits);
  if (assert) assertNumArgs(arguments.length, 2, "Logic.equalBits");
  this.bits1 = bits1;
  this.bits2 = bits2;
};

Logic._defineFormula(Logic.EqualBitsFormula, 'equalBits', {
  generateClauses: function (isTrue, t) {
    var A = this.bits1.bits;
    var B = this.bits2.bits;
    var nbits = Math.max(A.length, B.length);
    var facts = [];
    for (var i = 0; i < nbits; i++) {
      if (i >= A.length) {
        facts.push(Logic.not(B[i]));
      } else if (i >= B.length) {
        facts.push(Logic.not(A[i]));
      } else {
        facts.push(Logic.equiv(A[i], B[i]));
      }
    }
    return t.generate(isTrue, Logic.and(facts));
  }
});

// Definition of full-adder and half-adder:
//
// A full-adder is a 3-input, 2-output gate producing the sum of its
// inputs as a 2-bit binary number. The most significant bit is called
// "carry", the least significant "sum". A half-adder does the same
// thing, but has only 2 inputs (and can therefore never output a
// "3").
//
// The half-adder sum bit is really just an XOR, and the carry bit
// is really just an AND.  However, they get their own formula types
// here to enhance readability of the generated clauses.

Logic.HalfAdderSum = function (formula1, formula2) {
  if (assert) assert(formula1, isFormulaOrTerm);
  if (assert) assert(formula2, isFormulaOrTerm);

  if (assert) assertNumArgs(arguments.length, 2, "Logic.HalfAdderSum");
  this.a = formula1;
  this.b = formula2;
};

Logic._defineFormula(Logic.HalfAdderSum, 'hsum', {
  generateClauses: function (isTrue, t) {
    return t.generate(isTrue, Logic.xor(this.a, this.b));
  }
});

Logic.HalfAdderCarry = function (formula1, formula2) {
  if (assert) assert(formula1, isFormulaOrTerm);
  if (assert) assert(formula2, isFormulaOrTerm);
  if (assert) assertNumArgs(arguments.length, 2, "Logic.HalfAdderCarry");
  this.a = formula1;
  this.b = formula2;
};

Logic._defineFormula(Logic.HalfAdderCarry, 'hcarry', {
  generateClauses: function (isTrue, t) {
    return t.generate(isTrue, Logic.and(this.a, this.b));
  }
});

Logic.FullAdderSum = function (formula1, formula2, formula3) {
  if (assert) assert(formula1, isFormulaOrTerm);
  if (assert) assert(formula2, isFormulaOrTerm);
  if (assert) assert(formula3, isFormulaOrTerm);
  if (assert) assertNumArgs(arguments.length, 3, "Logic.FullAdderSum");
  this.a = formula1;
  this.b = formula2;
  this.c = formula3;
};

Logic._defineFormula(Logic.FullAdderSum, 'fsum', {
  generateClauses: function (isTrue, t) {
    return t.generate(isTrue, Logic.xor(this.a, this.b, this.c));
  }
});

Logic.FullAdderCarry = function (formula1, formula2, formula3) {
  if (assert) assert(formula1, isFormulaOrTerm);
  if (assert) assert(formula2, isFormulaOrTerm);
  if (assert) assert(formula3, isFormulaOrTerm);
  if (assert) assertNumArgs(arguments.length, 3, "Logic.FullAdderCarry");
  this.a = formula1;
  this.b = formula2;
  this.c = formula3;
};

Logic._defineFormula(Logic.FullAdderCarry, 'fcarry', {
  generateClauses: function (isTrue, t) {
    return t.generate(! isTrue,
                      Logic.atMostOne(this.a, this.b, this.c));
  }
});

// Implements the Adder strategy from the MiniSat+ paper:
// http://minisat.se/downloads/MiniSat+.pdf
// "Translating Pseudo-boolean Constraints into SAT"
//
// Takes a list of list of Formulas.  The first list is bits
// to give weight 1; the second is bits to give weight 2;
// the third is bits to give weight 4; and so on.
//
// Returns an array of Logic.FormulaOrTerm.
var binaryWeightedSum = function (varsByWeight) {
  if (assert) assert(varsByWeight,
                     isArrayWhere(isArrayWhere(isFormulaOrTerm)));
  // initialize buckets to a two-level clone of varsByWeight
  var buckets = _.map(varsByWeight, _.clone);
  var lowestWeight = 0; // index of the first non-empty array
  var output = [];
  while (lowestWeight < buckets.length) {
    var bucket = buckets[lowestWeight];
    if (! bucket.length) {
      output.push(Logic.FALSE);
      lowestWeight++;
    } else if (bucket.length === 1) {
      output.push(bucket[0]);
      lowestWeight++;
    } else if (bucket.length === 2) {
      var sum = new Logic.HalfAdderSum(bucket[0], bucket[1]);
      var carry = new Logic.HalfAdderCarry(bucket[0], bucket[1]);
      bucket.length = 0;
      bucket.push(sum);
      pushToNth(buckets, lowestWeight+1, carry);
    } else {
      // Whether we take variables from the start or end of the
      // bucket (i.e. `pop` or `shift`) determines the shape of the tree.
      // Empirically, some logic problems are faster with `shift` (2x or so),
      // but `pop` gives an order-of-magnitude speed-up on the Meteor Version
      // Solver "benchmark-tests" suite (Slava's benchmarks based on data from
      // Rails).  So, `pop` it is.
      var c = bucket.pop();
      var b = bucket.pop();
      var a = bucket.pop();
      var sum = new Logic.FullAdderSum(a, b, c);
      var carry = new Logic.FullAdderCarry(a, b, c);
      bucket.push(sum);
      pushToNth(buckets, lowestWeight+1, carry);
    }
  }
  return output;
};

// Push `newItem` onto the array at arrayOfArrays[n],
// first ensuring that it exists by pushing empty
// arrays onto arrayOfArrays.
var pushToNth = function (arrayOfArrays, n, newItem) {
  while (n >= arrayOfArrays.length) {
    arrayOfArrays.push([]);
  }
  arrayOfArrays[n].push(newItem);
};

var checkWeightedSumArgs = function (formulas, weights) {
  if (assert) assert(formulas, isArrayWhere(isFormulaOrTerm));
  if (typeof weights === 'number') {
    if (assert) assert(weights, Logic.isWholeNumber);
  } else {
    if (assert) assert(weights, isArrayWhere(Logic.isWholeNumber));
    if (formulas.length !== weights.length) {
      throw new Error("Formula array and weight array must be same length" +
                      "; they are " + formulas.length + " and " + weights.length);
    }
  }
};

Logic.weightedSum = function (formulas, weights) {
  checkWeightedSumArgs(formulas, weights);

  if (formulas.length === 0) {
    return new Logic.Bits([]);
  }

  if (typeof weights === 'number') {
    weights = _.map(formulas, function () { return weights; });
  }

  var binaryWeighted = [];
  _.each(formulas, function (f, i) {
    var w = weights[i];
    var whichBit = 0;
    while (w) {
      if (w & 1) {
        pushToNth(binaryWeighted, whichBit, f);
      }
      w >>>= 1;
      whichBit++;
    }
  });

  return new Logic.Bits(binaryWeightedSum(binaryWeighted));
};

Logic.sum = function (/*formulaOrBitsOrArray, ...*/) {
  var things = _.flatten(arguments);
  if (assert) assert(things, isArrayWhere(isFormulaOrTermOrBits));

  var binaryWeighted = [];
  _.each(things, function (x) {
    if (x instanceof Logic.Bits) {
      _.each(x.bits, function (b, i) {
        pushToNth(binaryWeighted, i, b);
      });
    } else {
      pushToNth(binaryWeighted, 0, x);
    }
  });

  return new Logic.Bits(binaryWeightedSum(binaryWeighted));
};

////////////////////////////////////////

Logic.Solver.prototype.solve = function (_assumpVar) {
  var self = this;
  if (_assumpVar !== undefined) {
    if (! (_assumpVar >= 1)) {
      throw new Error("_assumpVar must be a variable number");
    }
  }

  if (self._unsat) {
    return null;
  }

  while (self._numClausesAddedToMiniSat < self.clauses.length) {
    var i = self._numClausesAddedToMiniSat;
    var terms = self.clauses[i].terms;
    if (assert) assert(terms, isArrayWhere(Logic.isNumTerm));
    var stillSat = self._minisat.addClause(terms);
    self._numClausesAddedToMiniSat++;
    if (! stillSat) {
      self._unsat = true;
      return null;
    }
  }

  if (assert) assert(this._num2name.length - 1, Logic.isWholeNumber);
  self._minisat.ensureVar(this._num2name.length - 1);

  var stillSat = (_assumpVar ?
                  self._minisat.solveAssuming(_assumpVar) :
                  self._minisat.solve());
  if (! stillSat) {
    if (! _assumpVar) {
      self._unsat = true;
    }
    return null;
  }

  return new Logic.Solution(self, self._minisat.getSolution());
};

Logic.Solver.prototype.solveAssuming = function (formula) {
  if (assert) assert(formula, isFormulaOrTerm);

  // Wrap the formula in a formula of type Assumption, so that
  // we always generate a var like `$assump123`, regardless
  // of whether `formula` is a Term, a NotFormula, an already
  // required or forbidden Formula, etc.
  var assump = new Logic.Assumption(formula);
  var assumpVar = this._formulaToTerm(assump);
  if (! (typeof assumpVar === 'number' && assumpVar > 0)) {
    throw new Error("Assertion failure: not a positive numeric term");
  }

  // Generate clauses as if we used the assumption variable in a
  // clause, in the positive.  So if we assume "A v B", we might get a
  // clause like "A v B v -$assump123" (or actually, "$or1 v
  // -$assump123"), as if we had used $assump123 in a clause.  Instead
  // of using it in a clause, though, we temporarily assume it to be
  // true.
  this._useFormulaTerm(assumpVar);

  var result = this.solve(assumpVar);
  // Tell MiniSat that we will never use assumpVar again.
  // The formula may be used again, however.  (For example, you
  // can solve assuming a formula F, and if it works, require F.)
  this._minisat.retireVar(assumpVar);

  return result;
};

Logic.Assumption = function (formula) {
  if (assert) assert(formula, isFormulaOrTerm);
  this.formula = formula;
};

Logic._defineFormula(Logic.Assumption, 'assump', {
  generateClauses: function (isTrue, t) {
    if (isTrue) {
      return t.clause(this.formula);
    } else {
      return t.clause(Logic.not(this.formula));
    }
  }
});

Logic.Solution = function (_solver, _assignment) {
  var self = this;
  self._solver = _solver;
  self._assignment = _assignment;

  // save a snapshot of which formulas have variables designated
  // for them, but where we haven't generated clauses that constrain
  // those variables in both the positive and the negative direction.
  self._ungeneratedFormulas = _.clone(_solver._ungeneratedFormulas);

  self._formulaValueCache = {};
  self._termifier = new Logic.Termifier(self._solver);
  // Normally, when a Formula uses a Termifier to generate clauses that
  // refer to other Formulas, the Termifier replaces the Formulas with
  // their variables.  We hijack this mechanism to replace the Formulas
  // with their truth variables instead, leading to recursive evaluation.
  // Note that we cache the evaluated truth values of Formulas to avoid
  // redundant evaluation.
  self._termifier.term = function (formula) {
    return self.evaluate(formula) ? Logic.NUM_TRUE : Logic.NUM_FALSE;
  };

  // When true, evaluation doesn't throw errors when
  // `evaluate` or `getWeightedSum` encounter named variables that are
  // unknown or variables that weren't present when this Solution was
  // generated.  Instead, the unknown variables are assumed to be false.
  self._ignoreUnknownVariables = false;
};

Logic.Solution.prototype.ignoreUnknownVariables = function () {
  // We only make this settable one way (false to true).
  // Setting it back and forth would be questionable, since we keep
  // a cache of Formula evaluations.
  this._ignoreUnknownVariables = true;
};

// Get a map of variables to their assignments,
// such as `{A: true, B: false, C: true}`.
// Internal variables are excluded.
Logic.Solution.prototype.getMap = function () {
  var solver = this._solver;
  var assignment = this._assignment;
  var result = {};
  for (var i = 1; i < assignment.length; i++) {
    var name = solver.getVarName(i);
    if (name && name.charAt(0) !== '$') {
      result[name] = assignment[i];
    }
  }
  return result;
};

// Get an array of variables that are assigned
// `true` by this solution, sorted by name.
// Internal variables are excluded.
Logic.Solution.prototype.getTrueVars = function () {
  var solver = this._solver;
  var assignment = this._assignment;
  var result = [];
  for (var i = 1; i < assignment.length; i++) {
    if (assignment[i]) {
      var name = solver.getVarName(i);
      if (name && name.charAt(0) !== '$') {
        result.push(name);
      }
    }
  }
  result.sort();
  return result;
};

// Get a Formula that says that the variables are assigned
// according to this solution.  (Internal variables are
// excluded.)  By forbidding this Formula and solving again,
// you can see if there are other solutions.
Logic.Solution.prototype.getFormula = function () {
  var solver = this._solver;
  var assignment = this._assignment;
  var terms = [];
  for (var i = 1; i < assignment.length; i++) {
    var name = solver.getVarName(i);
    if (name && name.charAt(0) !== '$') {
      terms.push(assignment[i] ? i : -i);
    }
  }
  return Logic.and(terms);
};

// Returns a boolean if the argument is a Formula (or Term), and an integer
// if the argument is a Logic.Bits.
Logic.Solution.prototype.evaluate = function (formulaOrBits) {
  var self = this;
  if (assert) assert(formulaOrBits, isFormulaOrTermOrBits);

  if (formulaOrBits instanceof Logic.Bits) {
    // Evaluate to an integer
    var ret = 0;
    _.each(formulaOrBits.bits, function (f, i) {
      if (self.evaluate(f)) {
        ret += 1 << i;
      }
    });
    return ret;
  }

  var solver = self._solver;
  var ignoreUnknownVariables = self._ignoreUnknownVariables;
  var assignment = self._assignment;
  var formula = formulaOrBits;
  if (formula instanceof Logic.NotFormula) {
    return ! self.evaluate(formula.operand);
  } else if (formula instanceof Logic.Formula) {
    var cachedResult = self._formulaValueCache[formula.guid()];
    if (typeof cachedResult === 'boolean') {
      return cachedResult;
    } else {
      var value;
      var info = solver._getFormulaInfo(formula, true);
      if (info && info.varNum && info.varNum < assignment.length &&
          ! _.has(self._ungeneratedFormulas, info.varNum)) {
        // as an optimization, read the value of the formula directly
        // from a variable if the formula's clauses were completely
        // generated at the time of solving.  (We must be careful,
        // because if we didn't generate both the positive and the
        // negative polarity clauses for the formula, then the formula
        // variable is not actually constrained to have the right
        // value.)
        value = assignment[info.varNum];
      } else {
        var clauses = solver._generateFormula(true, formula, self._termifier);
        var value = _.all(clauses, function (cls) {
          return _.any(cls.terms, function (t) {
            return self.evaluate(t);
          });
        });
      }
      self._formulaValueCache[formula.guid()] = value;
      return value;
    }
  } else {
    // Term; convert to numeric (possibly negative), but throw
    // an error if the name is not found.  If `ignoreUnknownVariables`
    // is set, return false instead.
    var numTerm = solver.toNumTerm(formula, true);
    if (! numTerm) {
      if (ignoreUnknownVariables) {
        return false;
      } else {
        // formula must be a NameTerm naming a variable that doesn't exist
        var vname = String(formula).replace(/^-*/, '');
        throw new Error("No such variable: " + vname);
      }
    }
    var v = numTerm;
    var isNot = false;
    if (numTerm < 0) {
      v = -v;
      isNot = true;
    }
    if (v < 1 || v >= assignment.length) {
      var vname = v;
      if (v >= 1 && v < solver._num2name.length) {
        vname = solver._num2name[v];
      }
      if (ignoreUnknownVariables) {
        return false;
      } else {
        throw new Error("Variable not part of solution: " + vname);
      }
    }
    var ret = assignment[v];
    if (isNot) {
      ret = ! ret;
    }
    return ret;
  }
};

Logic.Solution.prototype.getWeightedSum = function (formulas, weights) {
  checkWeightedSumArgs(formulas, weights);

  var total = 0;
  if (typeof weights === 'number') {
    for (var i = 0; i < formulas.length; i++) {
      total += weights * (this.evaluate(formulas[i]) ? 1 : 0);
    }
  } else {
    for (var i = 0; i < formulas.length; i++) {
      total += weights[i] * (this.evaluate(formulas[i]) ? 1 : 0);
    }
  }
  return total;
};
var getNonZeroWeightedTerms = function (costTerms, costWeights) {
  if (typeof costWeights === 'number') {
    return costWeights ? costTerms : [];
  } else {
    var terms = [];
    for (var i = 0; i < costTerms.length; i++) {
      if (costWeights[i]) {
        terms.push(costTerms[i]);
      }
    }
    return terms;
  }
};

// See comments on minimizeWeightedSum and maximizeWeightedSum.
var minMaxWS = function (solver, solution, costTerms, costWeights, options,
                         isMin) {
  var curSolution = solution;
  var curCost = curSolution.getWeightedSum(costTerms, costWeights);

  var optFormula = options && options.formula;
  var weightedSum = (optFormula || Logic.weightedSum(costTerms, costWeights));

  var progress = options && options.progress;
  var strategy = options && options.strategy;

  // array of terms with non-zero weights, populated on demand
  var nonZeroTerms = null;

  if (isMin && curCost > 0) {
    // try to skip straight to 0 cost, because if it works, it could
    // save us some time
    if (progress) {
      progress('trying', 0);
    }
    var zeroSolution = null;
    nonZeroTerms = getNonZeroWeightedTerms(costTerms, costWeights);
    var zeroSolution = solver.solveAssuming(Logic.not(Logic.or(nonZeroTerms)));
    if (zeroSolution) {
      curSolution = zeroSolution;
      curCost = 0;
    }
  }

  if (isMin && strategy === 'bottom-up') {
    for (var trialCost = 1; trialCost < curCost; trialCost++) {
      if (progress) {
        progress('trying', trialCost);
      }
      var costIsTrialCost = Logic.equalBits(
        weightedSum, Logic.constantBits(trialCost));
      var newSolution = solver.solveAssuming(costIsTrialCost);
      if (newSolution) {
        curSolution = newSolution;
        curCost = trialCost;
        break;
      }
    }
  } else if (strategy && strategy !== 'default') {
    throw new Error("Bad strategy: " + strategy);
  } else {
    strategy = 'default';
  }

  if (strategy === 'default') {
    // for minimization, count down from current cost. for maximization,
    // count up.
    while (isMin ? curCost > 0 : true) {
      if (progress) {
        progress('improving', curCost);
      }
      var improvement = (isMin ? Logic.lessThan : Logic.greaterThan)(
        weightedSum, Logic.constantBits(curCost));
      var newSolution = solver.solveAssuming(improvement);
      if (! newSolution) {
        break;
      }
      solver.require(improvement);
      curSolution = newSolution;
      curCost = curSolution.getWeightedSum(costTerms, costWeights);
    }
  }

  if (isMin && curCost === 0) {
    // express the requirement that the weighted sum be 0 in an efficient
    // way for the solver (all terms with non-zero weights must be 0)
    if (! nonZeroTerms) {
      nonZeroTerms = getNonZeroWeightedTerms(costTerms, costWeights);
    }
    solver.forbid(nonZeroTerms);
  } else {
    solver.require(Logic.equalBits(weightedSum, Logic.constantBits(curCost)));
  }

  if (progress) {
    progress('finished', curCost);
  }

  return curSolution;
};

// Minimize (or maximize) the dot product of costTerms and
// costWeights, and further, require (as in solver.require) that the
// value of the dot product be equal to the optimum found.  Returns a
// valid solution where this optimum is achieved.
//
// `solution` must be a current valid solution as returned from
// `solve` or `solveAssuming`.  It is used as a starting point (to
// evaluate the current cost).
//
// costWeights is an array (of same length as costTerms) or a single
// WholeNumber.
//
// if the caller passes options.formula, it should be the formula
// Logic.weightedSum(costTerms, costWeights).  The optimizer will use
// this existing formula rather than generating a new one (for
// efficiency).  The optimizer still wants to know the terms and
// weights, because it is more efficient for it to evaluate the
// current cost using them directly rather than the formula.
//
// options.progress: a function that takes two arguments, to call at
// particular times during optimization.  Called with arguments
// ('improving', cost) when about to search for a way to improve on
// `cost`, and called with arguments ('finished', cost) when the
// optimum is reached.  There's also ('trying', cost) when a cost
// is tried directly (which is usually done with 0 right off the bat).
//
// options.strategy: a string hinting how to go about the optimization.
// the default strategy (option absent or 'default') is to work down
// from the current cost for minimization or up from the current cost
// for maximization, and iteratively insist that the cost be made lower
// if possible.  For minimization, the alternate strategy 'bottom-up' is
// available, which starts at 0 and tries ever higher costs until one
// works.  All strategies first try and see if a cost of 0 is possible.

// ("costTerms" is kind of a misnomer since they may be Formulas or Terms.)
Logic.Solver.prototype.minimizeWeightedSum = function (solution, costTerms,
                                                       costWeights, options) {
  return minMaxWS(this, solution, costTerms, costWeights, options, true);
};

Logic.Solver.prototype.maximizeWeightedSum = function (solution, costTerms,
                                                       costWeights, options) {
  return minMaxWS(this, solution, costTerms, costWeights, options, false);
};
module.exports = Logic;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var C_MINISAT = __webpack_require__(93);
var _ = __webpack_require__(45);
var MiniSat;
MiniSat = function () {
  // A MiniSat object wraps an instance of "native" MiniSat.  You can
  // have as many MiniSat objects as you want, and they are all
  // independent.
  //
  // C is the "module" object created by Emscripten.  We wrap the
  // output of Emscripten in a closure, so each call to C_MINISAT()
  // actually instantiates a separate C environment, including
  // the "native" heap.
  //
  // The methods available on `C` include the global functions we
  // define in `logic-solver.cc`, each prefixed with `_`, and a varied
  // assortment of helpers put there by Emscripten, some of which are
  // documented here:
  // http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
  //
  // See the README in the meteor/minisat repo for more notes about
  // our build of MiniSat.
  var C = this._C = C_MINISAT();

  this._native = {
    getStackPointer: function () {
      return C.Runtime.stackSave();
    },
    setStackPointer: function (ptr) {
      C.Runtime.stackRestore(ptr);
    },
    allocateBytes: function (len) {
      return C.allocate(len, 'i8', C.ALLOC_STACK);
    },
    pushString: function (str) {
      return this.allocateBytes(C.intArrayFromString(str));
    },
    savingStack: function (func) {
      var SP = this.getStackPointer();
      try {
        return func(this, C);
      } finally {
        this.setStackPointer(SP);
      }
    }
  };

  C._createTheSolver();

  // useful log for debugging and testing
  this._clauses = [];
};


// Make sure MiniSat has allocated space in its model for v,
// even if v is unused.  If we have variables A,B,C,D which
// are numbers 1,2,3,4, for example, but we never actually use
// C and D, calling ensureVar(4) will make MiniSat give us
// solution values for them anyway.
MiniSat.prototype.ensureVar = function (v) {
  this._C._ensureVar(v);
};

// Add a clause, in the form of an array of Logic.NumTerms.
// Returns true if the problem is still satisfiable
// (as far as we know without doing more work), and false if
// we can already tell that it is unsatisfiable.
MiniSat.prototype.addClause = function (terms) {
  this._clauses.push(terms);
  return this._native.savingStack(function (native, C) {
    var termsPtr = C.allocate((terms.length+1)*4, 'i32', C.ALLOC_STACK);
    _.each(terms, function (t, i) {
      C.setValue(termsPtr + i*4, t, 'i32');
    });
    C.setValue(termsPtr + terms.length*4, 0, 'i32'); // 0-terminate
    return C._addClause(termsPtr) ? true : false;
  });
};

MiniSat.prototype.solve = function () {
  return this._C._solve() ? true : false;
};

MiniSat.prototype.solveAssuming = function (v) {
  return this._C._solveAssuming(v) ? true : false;
};

MiniSat.prototype.getSolution = function () {
  var solution = [null]; // no 0th var
  var C = this._C;
  var numVars = C._getNumVars();
  var solPtr = C._getSolution();
  for (var i = 0; i < numVars; i++) {
    // 0 is Minisat::l_True (lifted "true").
    // Internally, Minisat has three states for a variable:
    // true, false, and undetermined.  It doesn't distinguish
    // between "false" and "undetermined" in solutions though
    // (I think it sets undetermined variables to false).
    solution[i+1] = (C.getValue(solPtr+i, 'i8') === 0);
  }
  return solution;
};

MiniSat.prototype.retireVar = function (v) {
  this._C._retireVar(v);
};

// The "conflict clause" feature of MiniSat is not what it sounds
// like, unfortunately -- it doesn't help explain conflicts.
// It only tells us which assumption vars are to blame for a failed
// solveAssuming (and we only ever pass one var).
// We keep this function around in case we discover a use for it.
MiniSat.prototype.getConflictClause = function () {
  var C = this._C;
  var numTerms = C._getConflictClauseSize();
  var clausePtr = C._getConflictClause();
  var terms = [];
  for (var i = 0; i < numTerms; i++) {
    var t = C.getValue(clausePtr + i*4, 'i32');
    var v = (t >>> 1);
    var s = (t & 1) ? -1 : 1;
    terms[i] = v * s;
  }
  return terms;
};
module.exports = MiniSat;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var C_MINISAT;
// This file is generated by the meteor/minisat repo.
// See that repo's README for instructions for building it.
C_MINISAT=(function(){var module={};var require=(function(){});var process={argv:["node","minisat"],on:(function(){}),stdout:{write:(function(str){console.log("MINISAT-out:",str.replace(/\n$/,""))})},stderr:{write:(function(str){console.log("MINISAT-err:",str.replace(/\n$/,""))})}};var window=0;var Module;if(!Module)Module=(typeof Module!=="undefined"?Module:null)||{};var moduleOverrides={};for(var key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function";var ENVIRONMENT_IS_WEB=typeof window==="object";var ENVIRONMENT_IS_WORKER=typeof importScripts==="function";var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(ENVIRONMENT_IS_NODE){if(!Module["print"])Module["print"]=function print(x){process["stdout"].write(x+"\n")};if(!Module["printErr"])Module["printErr"]=function printErr(x){process["stderr"].write(x+"\n")};var nodeFS=require("fs");var nodePath=require("path");Module["read"]=function read(filename,binary){filename=nodePath["normalize"](filename);var ret=nodeFS["readFileSync"](filename);if(!ret&&filename!=nodePath["resolve"](filename)){filename=path.join(__dirname,"..","src",filename);ret=nodeFS["readFileSync"](filename)}if(ret&&!binary)ret=ret.toString();return ret};Module["readBinary"]=function readBinary(filename){return Module["read"](filename,true)};Module["load"]=function load(f){globalEval(read(f))};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}else{Module["thisProgram"]="unknown-program"}Module["arguments"]=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",(function(ex){if(!(ex instanceof ExitStatus)){throw ex}}))}else if(ENVIRONMENT_IS_SHELL){if(!Module["print"])Module["print"]=print;if(typeof printErr!="undefined")Module["printErr"]=printErr;if(typeof read!="undefined"){Module["read"]=read}else{Module["read"]=function read(){throw"no read() available (jsc?)"}}Module["readBinary"]=function readBinary(f){if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}var data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}this["Module"]=Module}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){Module["read"]=function read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof console!=="undefined"){if(!Module["print"])Module["print"]=function print(x){console.log(x)};if(!Module["printErr"])Module["printErr"]=function printErr(x){console.log(x)}}else{var TRY_USE_DUMP=false;if(!Module["print"])Module["print"]=TRY_USE_DUMP&&typeof dump!=="undefined"?(function(x){dump(x)}):(function(x){})}if(ENVIRONMENT_IS_WEB){window["Module"]=Module}else{Module["load"]=importScripts}}else{throw"Unknown runtime environment. Where are we?"}function globalEval(x){eval.call(null,x)}if(!Module["load"]&&Module["read"]){Module["load"]=function load(f){globalEval(Module["read"](f))}}if(!Module["print"]){Module["print"]=(function(){})}if(!Module["printErr"]){Module["printErr"]=Module["print"]}if(!Module["arguments"]){Module["arguments"]=[]}if(!Module["thisProgram"]){Module["thisProgram"]="./this.program"}Module.print=Module["print"];Module.printErr=Module["printErr"];Module["preRun"]=[];Module["postRun"]=[];for(var key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}var Runtime={setTempRet0:(function(value){tempRet0=value}),getTempRet0:(function(){return tempRet0}),stackSave:(function(){return STACKTOP}),stackRestore:(function(stackTop){STACKTOP=stackTop}),getNativeTypeSize:(function(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return Runtime.QUANTUM_SIZE}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0);return bits/8}else{return 0}}}}),getNativeFieldSize:(function(type){return Math.max(Runtime.getNativeTypeSize(type),Runtime.QUANTUM_SIZE)}),STACK_ALIGN:16,getAlignSize:(function(type,size,vararg){if(!vararg&&(type=="i64"||type=="double"))return 8;if(!type)return Math.min(size,8);return Math.min(size||(type?Runtime.getNativeFieldSize(type):0),Runtime.QUANTUM_SIZE)}),dynCall:(function(sig,ptr,args){if(args&&args.length){if(!args.splice)args=Array.prototype.slice.call(args);args.splice(0,0,ptr);return Module["dynCall_"+sig].apply(null,args)}else{return Module["dynCall_"+sig].call(null,ptr)}}),functionPointers:[],addFunction:(function(func){for(var i=0;i<Runtime.functionPointers.length;i++){if(!Runtime.functionPointers[i]){Runtime.functionPointers[i]=func;return 2*(1+i)}}throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."}),removeFunction:(function(index){Runtime.functionPointers[(index-2)/2]=null}),getAsmConst:(function(code,numArgs){if(!Runtime.asmConstCache)Runtime.asmConstCache={};var func=Runtime.asmConstCache[code];if(func)return func;var args=[];for(var i=0;i<numArgs;i++){args.push(String.fromCharCode(36)+i)}var source=Pointer_stringify(code);if(source[0]==='"'){if(source.indexOf('"',1)===source.length-1){source=source.substr(1,source.length-2)}else{abort("invalid EM_ASM input |"+source+"|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)")}}try{var evalled=eval("(function(Module, FS) { return function("+args.join(",")+"){ "+source+" } })")(Module,typeof FS!=="undefined"?FS:null)}catch(e){Module.printErr("error in executing inline EM_ASM code: "+e+" on: \n\n"+source+"\n\nwith args |"+args+"| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)");throw e}return Runtime.asmConstCache[code]=evalled}),warnOnce:(function(text){if(!Runtime.warnOnce.shown)Runtime.warnOnce.shown={};if(!Runtime.warnOnce.shown[text]){Runtime.warnOnce.shown[text]=1;Module.printErr(text)}}),funcWrappers:{},getFuncWrapper:(function(func,sig){assert(sig);if(!Runtime.funcWrappers[sig]){Runtime.funcWrappers[sig]={}}var sigCache=Runtime.funcWrappers[sig];if(!sigCache[func]){sigCache[func]=function dynCall_wrapper(){return Runtime.dynCall(sig,func,arguments)}}return sigCache[func]}),UTF8Processor:(function(){var buffer=[];var needed=0;this.processCChar=(function(code){code=code&255;if(buffer.length==0){if((code&128)==0){return String.fromCharCode(code)}buffer.push(code);if((code&224)==192){needed=1}else if((code&240)==224){needed=2}else{needed=3}return""}if(needed){buffer.push(code);needed--;if(needed>0)return""}var c1=buffer[0];var c2=buffer[1];var c3=buffer[2];var c4=buffer[3];var ret;if(buffer.length==2){ret=String.fromCharCode((c1&31)<<6|c2&63)}else if(buffer.length==3){ret=String.fromCharCode((c1&15)<<12|(c2&63)<<6|c3&63)}else{var codePoint=(c1&7)<<18|(c2&63)<<12|(c3&63)<<6|c4&63;ret=String.fromCharCode(((codePoint-65536)/1024|0)+55296,(codePoint-65536)%1024+56320)}buffer.length=0;return ret});this.processJSString=function processJSString(string){string=unescape(encodeURIComponent(string));var ret=[];for(var i=0;i<string.length;i++){ret.push(string.charCodeAt(i))}return ret}}),getCompilerSetting:(function(name){throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"}),stackAlloc:(function(size){var ret=STACKTOP;STACKTOP=STACKTOP+size|0;STACKTOP=STACKTOP+15&-16;return ret}),staticAlloc:(function(size){var ret=STATICTOP;STATICTOP=STATICTOP+size|0;STATICTOP=STATICTOP+15&-16;return ret}),dynamicAlloc:(function(size){var ret=DYNAMICTOP;DYNAMICTOP=DYNAMICTOP+size|0;DYNAMICTOP=DYNAMICTOP+15&-16;if(DYNAMICTOP>=TOTAL_MEMORY)enlargeMemory();return ret}),alignMemory:(function(size,quantum){var ret=size=Math.ceil(size/(quantum?quantum:16))*(quantum?quantum:16);return ret}),makeBigInt:(function(low,high,unsigned){var ret=unsigned?+(low>>>0)+ +(high>>>0)*+4294967296:+(low>>>0)+ +(high|0)*+4294967296;return ret}),GLOBAL_BASE:8,QUANTUM_SIZE:4,__dummy__:0};Module["Runtime"]=Runtime;var __THREW__=0;var ABORT=false;var EXITSTATUS=0;var undef=0;var tempValue,tempInt,tempBigInt,tempInt2,tempBigInt2,tempPair,tempBigIntI,tempBigIntR,tempBigIntS,tempBigIntP,tempBigIntD,tempDouble,tempFloat;var tempI64,tempI64b;var tempRet0,tempRet1,tempRet2,tempRet3,tempRet4,tempRet5,tempRet6,tempRet7,tempRet8,tempRet9;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}var globalScope=this;function getCFunc(ident){var func=Module["_"+ident];if(!func){try{func=eval("_"+ident)}catch(e){}}assert(func,"Cannot call unknown function "+ident+" (perhaps LLVM optimizations or closure removed it?)");return func}var cwrap,ccall;((function(){var JSfuncs={"stackSave":(function(){Runtime.stackSave()}),"stackRestore":(function(){Runtime.stackRestore()}),"arrayToC":(function(arr){var ret=Runtime.stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}),"stringToC":(function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=Runtime.stackAlloc((str.length<<2)+1);writeStringToMemory(str,ret)}return ret})};var toC={"string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]};ccall=function ccallFunc(ident,returnType,argTypes,args){var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=Runtime.stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);if(returnType==="string")ret=Pointer_stringify(ret);if(stack!==0)Runtime.stackRestore(stack);return ret};var sourceRegex=/^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;function parseJSFunc(jsfunc){var parsed=jsfunc.toString().match(sourceRegex).slice(1);return{arguments:parsed[0],body:parsed[1],returnValue:parsed[2]}}var JSsource={};for(var fun in JSfuncs){if(JSfuncs.hasOwnProperty(fun)){JSsource[fun]=parseJSFunc(JSfuncs[fun])}}cwrap=function cwrap(ident,returnType,argTypes){argTypes=argTypes||[];var cfunc=getCFunc(ident);var numericArgs=argTypes.every((function(type){return type==="number"}));var numericRet=returnType!=="string";if(numericRet&&numericArgs){return cfunc}var argNames=argTypes.map((function(x,i){return"$"+i}));var funcstr="(function("+argNames.join(",")+") {";var nargs=argTypes.length;if(!numericArgs){funcstr+="var stack = "+JSsource["stackSave"].body+";";for(var i=0;i<nargs;i++){var arg=argNames[i],type=argTypes[i];if(type==="number")continue;var convertCode=JSsource[type+"ToC"];funcstr+="var "+convertCode.arguments+" = "+arg+";";funcstr+=convertCode.body+";";funcstr+=arg+"="+convertCode.returnValue+";"}}var cfuncname=parseJSFunc((function(){return cfunc})).returnValue;funcstr+="var ret = "+cfuncname+"("+argNames.join(",")+");";if(!numericRet){var strgfy=parseJSFunc((function(){return Pointer_stringify})).returnValue;funcstr+="ret = "+strgfy+"(ret);"}if(!numericArgs){funcstr+=JSsource["stackRestore"].body.replace("()","(stack)")+";"}funcstr+="return ret})";return eval(funcstr)}}))();Module["cwrap"]=cwrap;Module["ccall"]=ccall;function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=+1?tempDouble>+0?(Math_min(+Math_floor(tempDouble/+4294967296),+4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/+4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}Module["setValue"]=setValue;function getValue(ptr,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];default:abort("invalid type for setValue: "+type)}return null}Module["getValue"]=getValue;var ALLOC_NORMAL=0;var ALLOC_STACK=1;var ALLOC_STATIC=2;var ALLOC_DYNAMIC=3;var ALLOC_NONE=4;Module["ALLOC_NORMAL"]=ALLOC_NORMAL;Module["ALLOC_STACK"]=ALLOC_STACK;Module["ALLOC_STATIC"]=ALLOC_STATIC;Module["ALLOC_DYNAMIC"]=ALLOC_DYNAMIC;Module["ALLOC_NONE"]=ALLOC_NONE;function allocate(slab,types,allocator,ptr){var zeroinit,size;if(typeof slab==="number"){zeroinit=true;size=slab}else{zeroinit=false;size=slab.length}var singleType=typeof types==="string"?types:null;var ret;if(allocator==ALLOC_NONE){ret=ptr}else{ret=[_malloc,Runtime.stackAlloc,Runtime.staticAlloc,Runtime.dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))}if(zeroinit){var ptr=ret,stop;assert((ret&3)==0);stop=ret+(size&~3);for(;ptr<stop;ptr+=4){HEAP32[ptr>>2]=0}stop=ret+size;while(ptr<stop){HEAP8[ptr++>>0]=0}return ret}if(singleType==="i8"){if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var i=0,type,typeSize,previousType;while(i<size){var curr=slab[i];if(typeof curr==="function"){curr=Runtime.getFunctionIndex(curr)}type=singleType||types[i];if(type===0){i++;continue}if(type=="i64")type="i32";setValue(ret+i,curr,type);if(previousType!==type){typeSize=Runtime.getNativeTypeSize(type);previousType=type}i+=typeSize}return ret}Module["allocate"]=allocate;function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=false;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];if(t>=128)hasUtf=true;else if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(!hasUtf){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}var utf8=new Runtime.UTF8Processor;for(i=0;i<length;i++){t=HEAPU8[ptr+i>>0];ret+=utf8.processCChar(t)}return ret}Module["Pointer_stringify"]=Pointer_stringify;function UTF16ToString(ptr){var i=0;var str="";while(1){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)return str;++i;str+=String.fromCharCode(codeUnit)}}Module["UTF16ToString"]=UTF16ToString;function stringToUTF16(str,outPtr){for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr+i*2>>1]=codeUnit}HEAP16[outPtr+str.length*2>>1]=0}Module["stringToUTF16"]=stringToUTF16;function UTF32ToString(ptr){var i=0;var str="";while(1){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)return str;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}}Module["UTF32ToString"]=UTF32ToString;function stringToUTF32(str,outPtr){var iChar=0;for(var iCodeUnit=0;iCodeUnit<str.length;++iCodeUnit){var codeUnit=str.charCodeAt(iCodeUnit);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++iCodeUnit);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr+iChar*4>>2]=codeUnit;++iChar}HEAP32[outPtr+iChar*4>>2]=0}Module["stringToUTF32"]=stringToUTF32;function demangle(func){var hasLibcxxabi=!!Module["___cxa_demangle"];if(hasLibcxxabi){try{var buf=_malloc(func.length);writeStringToMemory(func.substr(1),buf);var status=_malloc(4);var ret=Module["___cxa_demangle"](buf,0,0,status);if(getValue(status,"i32")===0&&ret){return Pointer_stringify(ret)}}catch(e){}finally{if(buf)_free(buf);if(status)_free(status);if(ret)_free(ret)}}var i=3;var basicTypes={"v":"void","b":"bool","c":"char","s":"short","i":"int","l":"long","f":"float","d":"double","w":"wchar_t","a":"signed char","h":"unsigned char","t":"unsigned short","j":"unsigned int","m":"unsigned long","x":"long long","y":"unsigned long long","z":"..."};var subs=[];var first=true;function dump(x){if(x)Module.print(x);Module.print(func);var pre="";for(var a=0;a<i;a++)pre+=" ";Module.print(pre+"^")}function parseNested(){i++;if(func[i]==="K")i++;var parts=[];while(func[i]!=="E"){if(func[i]==="S"){i++;var next=func.indexOf("_",i);var num=func.substring(i,next)||0;parts.push(subs[num]||"?");i=next+1;continue}if(func[i]==="C"){parts.push(parts[parts.length-1]);i+=2;continue}var size=parseInt(func.substr(i));var pre=size.toString().length;if(!size||!pre){i--;break}var curr=func.substr(i+pre,size);parts.push(curr);subs.push(curr);i+=pre+size}i++;return parts}function parse(rawList,limit,allowVoid){limit=limit||Infinity;var ret="",list=[];function flushList(){return"("+list.join(", ")+")"}var name;if(func[i]==="N"){name=parseNested().join("::");limit--;if(limit===0)return rawList?[name]:name}else{if(func[i]==="K"||first&&func[i]==="L")i++;var size=parseInt(func.substr(i));if(size){var pre=size.toString().length;name=func.substr(i+pre,size);i+=pre+size}}first=false;if(func[i]==="I"){i++;var iList=parse(true);var iRet=parse(true,1,true);ret+=iRet[0]+" "+name+"<"+iList.join(", ")+">"}else{ret=name}paramLoop:while(i<func.length&&limit-->0){var c=func[i++];if(c in basicTypes){list.push(basicTypes[c])}else{switch(c){case"P":list.push(parse(true,1,true)[0]+"*");break;case"R":list.push(parse(true,1,true)[0]+"&");break;case"L":{i++;var end=func.indexOf("E",i);var size=end-i;list.push(func.substr(i,size));i+=size+2;break};case"A":{var size=parseInt(func.substr(i));i+=size.toString().length;if(func[i]!=="_")throw"?";i++;list.push(parse(true,1,true)[0]+" ["+size+"]");break};case"E":break paramLoop;default:ret+="?"+c;break paramLoop}}}if(!allowVoid&&list.length===1&&list[0]==="void")list=[];if(rawList){if(ret){list.push(ret+"?")}return list}else{return ret+flushList()}}var parsed=func;try{if(func=="Object._main"||func=="_main"){return"main()"}if(typeof func==="number")func=Pointer_stringify(func);if(func[0]!=="_")return func;if(func[1]!=="_")return func;if(func[2]!=="Z")return func;switch(func[3]){case"n":return"operator new()";case"d":return"operator delete()"}parsed=parse()}catch(e){parsed+="?"}if(parsed.indexOf("?")>=0&&!hasLibcxxabi){Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling")}return parsed}function demangleAll(text){return text.replace(/__Z[\w\d_]+/g,(function(x){var y=demangle(x);return x===y?x:x+" ["+y+"]"}))}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}function stackTrace(){return demangleAll(jsStackTrace())}Module["stackTrace"]=stackTrace;var PAGE_SIZE=4096;function alignMemoryPage(x){return x+4095&-4096}var HEAP;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;var STATIC_BASE=0,STATICTOP=0,staticSealed=false;var STACK_BASE=0,STACKTOP=0,STACK_MAX=0;var DYNAMIC_BASE=0,DYNAMICTOP=0;function enlargeMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value "+TOTAL_MEMORY+", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.")}var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||67108864;var FAST_MEMORY=Module["FAST_MEMORY"]||2097152;var totalMemory=64*1024;while(totalMemory<TOTAL_MEMORY||totalMemory<2*TOTAL_STACK){if(totalMemory<16*1024*1024){totalMemory*=2}else{totalMemory+=16*1024*1024}}if(totalMemory!==TOTAL_MEMORY){Module.printErr("increasing TOTAL_MEMORY to "+totalMemory+" to be compliant with the asm.js spec");TOTAL_MEMORY=totalMemory}assert(typeof Int32Array!=="undefined"&&typeof Float64Array!=="undefined"&&!!(new Int32Array(1))["subarray"]&&!!(new Int32Array(1))["set"],"JS engine does not provide full typed array support");var buffer=new ArrayBuffer(TOTAL_MEMORY);HEAP8=new Int8Array(buffer);HEAP16=new Int16Array(buffer);HEAP32=new Int32Array(buffer);HEAPU8=new Uint8Array(buffer);HEAPU16=new Uint16Array(buffer);HEAPU32=new Uint32Array(buffer);HEAPF32=new Float32Array(buffer);HEAPF64=new Float64Array(buffer);HEAP32[0]=255;assert(HEAPU8[0]===255&&HEAPU8[3]===0,"Typed arrays 2 must be run on a little-endian system");Module["HEAP"]=HEAP;Module["buffer"]=buffer;Module["HEAP8"]=HEAP8;Module["HEAP16"]=HEAP16;Module["HEAP32"]=HEAP32;Module["HEAPU8"]=HEAPU8;Module["HEAPU16"]=HEAPU16;Module["HEAPU32"]=HEAPU32;Module["HEAPF32"]=HEAPF32;Module["HEAPF64"]=HEAPF64;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Runtime.dynCall("v",func)}else{Runtime.dynCall("vi",func,[callback.arg])}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}Module["addOnPreRun"]=Module.addOnPreRun=addOnPreRun;function addOnInit(cb){__ATINIT__.unshift(cb)}Module["addOnInit"]=Module.addOnInit=addOnInit;function addOnPreMain(cb){__ATMAIN__.unshift(cb)}Module["addOnPreMain"]=Module.addOnPreMain=addOnPreMain;function addOnExit(cb){__ATEXIT__.unshift(cb)}Module["addOnExit"]=Module.addOnExit=addOnExit;function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}Module["addOnPostRun"]=Module.addOnPostRun=addOnPostRun;function intArrayFromString(stringy,dontAddNull,length){var ret=(new Runtime.UTF8Processor).processJSString(stringy);if(length){ret.length=length}if(!dontAddNull){ret.push(0)}return ret}Module["intArrayFromString"]=intArrayFromString;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}Module["intArrayToString"]=intArrayToString;function writeStringToMemory(string,buffer,dontAddNull){var array=intArrayFromString(string,dontAddNull);var i=0;while(i<array.length){var chr=array[i];HEAP8[buffer+i>>0]=chr;i=i+1}}Module["writeStringToMemory"]=writeStringToMemory;function writeArrayToMemory(array,buffer){for(var i=0;i<array.length;i++){HEAP8[buffer+i>>0]=array[i]}}Module["writeArrayToMemory"]=writeArrayToMemory;function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;i++){HEAP8[buffer+i>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer+str.length>>0]=0}Module["writeAsciiToMemory"]=writeAsciiToMemory;function unSign(value,bits,ignore){if(value>=0){return value}return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value}function reSign(value,bits,ignore){if(value<=0){return value}var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);if(value>=half&&(bits<=32||value>half)){value=-2*half+value}return value}if(!Math["imul"]||Math["imul"](4294967295,5)!==-5)Math["imul"]=function imul(a,b){var ah=a>>>16;var al=a&65535;var bh=b>>>16;var bl=b&65535;return al*bl+(ah*bl+al*bh<<16)|0};Math.imul=Math["imul"];var Math_abs=Math.abs;var Math_cos=Math.cos;var Math_sin=Math.sin;var Math_tan=Math.tan;var Math_acos=Math.acos;var Math_asin=Math.asin;var Math_atan=Math.atan;var Math_atan2=Math.atan2;var Math_exp=Math.exp;var Math_log=Math.log;var Math_sqrt=Math.sqrt;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_pow=Math.pow;var Math_imul=Math.imul;var Math_fround=Math.fround;var Math_min=Math.min;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}Module["addRunDependency"]=addRunDependency;function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["removeRunDependency"]=removeRunDependency;Module["preloadedImages"]={};Module["preloadedAudios"]={};var memoryInitializer=null;STATIC_BASE=8;STATICTOP=STATIC_BASE+5664;__ATINIT__.push({func:(function(){__GLOBAL__I_a()})},{func:(function(){__GLOBAL__I_a127()})});allocate([78,55,77,105,110,105,115,97,116,50,48,79,117,116,79,102,77,101,109,111,114,121,69,120,99,101,112,116,105,111,110,69,0,0,0,0,0,0,0,0,88,18,0,0,8,0,0,0,78,55,77,105,110,105,115,97,116,54,79,112,116,105,111,110,69,0,0,0,0,0,0,0,88,18,0,0,56,0,0,0,10,32,32,32,32,32,32,32,32,37,115,10,0,0,0,0,0,0,0,0,80,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,0,0,0,1,0,0,0,3,0,0,0,1,0,0,0,1,0,0,0,78,55,77,105,110,105,115,97,116,49,48,66,111,111,108,79,112,116,105,111,110,69,0,0,128,18,0,0,176,0,0,0,80,0,0,0,0,0,0,0,32,32,45,37,115,44,32,45,110,111,45,37,115,0,0,0,40,100,101,102,97,117,108,116,58,32,37,115,41,10,0,0,111,110,0,0,0,0,0,0,111,102,102,0,0,0,0,0,110,111,45,0,0,0,0,0,0,0,0,0,64,1,0,0,1,0,0,0,4,0,0,0,2,0,0,0,2,0,0,0,78,55,77,105,110,105,115,97,116,57,73,110,116,79,112,116,105,111,110,69,0,0,0,0,128,18,0,0,40,1,0,0,80,0,0,0,0,0,0,0,32,32,45,37,45,49,50,115,32,61,32,37,45,56,115,32,91,0,0,0,0,0,0,0,105,109,105,110,0,0,0,0,37,52,100,0,0,0,0,0,32,46,46,32,0,0,0,0,105,109,97,120,0,0,0,0,93,32,40,100,101,102,97,117,108,116,58,32,37,100,41,10,0,0,0,0,0,0,0,0,69,82,82,79,82,33,32,118,97,108,117,101,32,60,37,115,62,32,105,115,32,116,111,111,32,108,97,114,103,101,32,102,111,114,32,111,112,116,105,111,110,32,34,37,115,34,46,10,0,0,0,0,0,0,0,0,69,82,82,79,82,33,32,118,97,108,117,101,32,60,37,115,62,32,105,115,32,116,111,111,32,115,109,97,108,108,32,102,111,114,32,111,112,116,105,111,110,32,34,37,115,34,46,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,118,97,114,45,100,101,99,97,121,0,0,0,0,0,0,0,84,104,101,32,118,97,114,105,97,98,108,101,32,97,99,116,105,118,105,116,121,32,100,101,99,97,121,32,102,97,99,116,111,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,99,108,97,45,100,101,99,97,121,0,0,0,0,0,0,0,84,104,101,32,99,108,97,117,115,101,32,97,99,116,105,118,105,116,121,32,100,101,99,97,121,32,102,97,99,116,111,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,110,100,45,102,114,101,113,0,0,0,0,0,0,0,0,84,104,101,32,102,114,101,113,117,101,110,99,121,32,119,105,116,104,32,119,104,105,99,104,32,116,104,101,32,100,101,99,105,115,105,111,110,32,104,101,117,114,105,115,116,105,99,32,116,114,105,101,115,32,116,111,32,99,104,111,111,115,101,32,97,32,114,97,110,100,111,109,32,118,97,114,105,97,98,108,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,110,100,45,115,101,101,100,0,0,0,0,0,0,0,0,85,115,101,100,32,98,121,32,116,104,101,32,114,97,110,100,111,109,32,118,97,114,105,97,98,108,101,32,115,101,108,101,99,116,105,111,110,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,99,99,109,105,110,45,109,111,100,101,0,0,0,0,0,0,67,111,110,116,114,111,108,115,32,99,111,110,102,108,105,99,116,32,99,108,97,117,115,101,32,109,105,110,105,109,105,122,97,116,105,111,110,32,40,48,61,110,111,110,101,44,32,49,61,98,97,115,105,99,44,32,50,61,100,101,101,112,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,104,97,115,101,45,115,97,118,105,110,103,0,0,0,0,67,111,110,116,114,111,108,115,32,116,104,101,32,108,101,118,101,108,32,111,102,32,112,104,97,115,101,32,115,97,118,105,110,103,32,40,48,61,110,111,110,101,44,32,49,61,108,105,109,105,116,101,100,44,32,50,61,102,117,108,108,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,110,100,45,105,110,105,116,0,0,0,0,0,0,0,0,82,97,110,100,111,109,105,122,101,32,116,104,101,32,105,110,105,116,105,97,108,32,97,99,116,105,118,105,116,121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,108,117,98,121,0,0,0,0,85,115,101,32,116,104,101,32,76,117,98,121,32,114,101,115,116,97,114,116,32,115,101,113,117,101,110,99,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,102,105,114,115,116,0,0,84,104,101,32,98,97,115,101,32,114,101,115,116,97,114,116,32,105,110,116,101,114,118,97,108,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,105,110,99,0,0,0,0,82,101,115,116,97,114,116,32,105,110,116,101,114,118,97,108,32,105,110,99,114,101,97,115,101,32,102,97,99,116,111,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,99,45,102,114,97,99,0,84,104,101,32,102,114,97,99,116,105,111,110,32,111,102,32,119,97,115,116,101,100,32,109,101,109,111,114,121,32,97,108,108,111,119,101,100,32,98,101,102,111,114,101,32,97,32,103,97,114,98,97,103,101,32,99,111,108,108,101,99,116,105,111,110,32,105,115,32,116,114,105,103,103,101,114,101,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,109,105,110,45,108,101,97,114,110,116,115,0,0,0,0,0,77,105,110,105,109,117,109,32,108,101,97,114,110,116,32,99,108,97,117,115,101,32,108,105,109,105,116,0,0,0,0,0,0,0,0,0,192,7,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,0,0,124,32,37,57,100,32,124,32,37,55,100,32,37,56,100,32,37,56,100,32,124,32,37,56,100,32,37,56,100,32,37,54,46,48,102,32,124,32,37,54,46,51,102,32,37,37,32,124,10,0,0,0,0,0,0,0,124,32,32,71,97,114,98,97,103,101,32,99,111,108,108,101,99,116,105,111,110,58,32,32,32,37,49,50,100,32,98,121,116,101,115,32,61,62,32,37,49,50,100,32,98,121,116,101,115,32,32,32,32,32,32,32,32,32,32,32,32,32,124,10,0,0,0,0,0,0,0,0,78,55,77,105,110,105,115,97,116,54,83,111,108,118,101,114,69,0,0,0,0,0,0,0,88,18,0,0,168,7,0,0,60,98,111,111,108,62,0,0,10,32,32,32,32,32,32,32,32,37,115,10,0,0,0,0,60,105,110,116,51,50,62,0,69,82,82,79,82,33,32,118,97,108,117,101,32,60,37,115,62,32,105,115,32,116,111,111,32,108,97,114,103,101,32,102,111,114,32,111,112,116,105,111,110,32,34,37,115,34,46,10,0,0,0,0,0,0,0,0,69,82,82,79,82,33,32,118,97,108,117,101,32,60,37,115,62,32,105,115,32,116,111,111,32,115,109,97,108,108,32,102,111,114,32,111,112,116,105,111,110,32,34,37,115,34,46,10,0,0,0,0,0,0,0,0,67,79,82,69,0,0,0,0,60,100,111,117,98,108,101,62,0,0,0,0,0,0,0,0,0,0,0,0,168,8,0,0,1,0,0,0,8,0,0,0,3,0,0,0,3,0,0,0,78,55,77,105,110,105,115,97,116,49,50,68,111,117,98,108,101,79,112,116,105,111,110,69,0,0,0,0,0,0,0,0,128,18,0,0,136,8,0,0,80,0,0,0,0,0,0,0,32,32,45,37,45,49,50,115,32,61,32,37,45,56,115,32,37,99,37,52,46,50,103,32,46,46,32,37,52,46,50,103,37,99,32,40,100,101,102,97,117,108,116,58,32,37,103,41,10,0,0,0,0,0,0,0,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,91,32,83,101,97,114,99,104,32,83,116,97,116,105,115,116,105,99,115,32,93,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,0,124,32,67,111,110,102,108,105,99,116,115,32,124,32,32,32,32,32,32,32,32,32,32,79,82,73,71,73,78,65,76,32,32,32,32,32,32,32,32,32,124,32,32,32,32,32,32,32,32,32,32,76,69,65,82,78,84,32,32,32,32,32,32,32,32,32,32,124,32,80,114,111,103,114,101,115,115,32,124,0,124,32,32,32,32,32,32,32,32,32,32,32,124,32,32,32,32,86,97,114,115,32,32,67,108,97,117,115,101,115,32,76,105,116,101,114,97,108,115,32,124,32,32,32,32,76,105,109,105,116,32,32,67,108,97,117,115,101,115,32,76,105,116,47,67,108,32,124,32,32,32,32,32,32,32,32,32,32,124,0,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,115,121,109,109,0,0,0,83,104,114,105,110,107,32,99,108,97,117,115,101,115,32,98,121,32,97,115,121,109,109,101,116,114,105,99,32,98,114,97,110,99,104,105,110,103,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,99,104,101,99,107,0,0,67,104,101,99,107,32,105,102,32,97,32,99,108,97,117,115,101,32,105,115,32,97,108,114,101,97,100,121,32,105,109,112,108,105,101,100,46,32,40,99,111,115,116,108,121,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,108,105,109,0,0,0,0,80,101,114,102,111,114,109,32,118,97,114,105,97,98,108,101,32,101,108,105,109,105,110,97,116,105,111,110,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,103,114,111,119,0,0,0,0,65,108,108,111,119,32,97,32,118,97,114,105,97,98,108,101,32,101,108,105,109,105,110,97,116,105,111,110,32,115,116,101,112,32,116,111,32,103,114,111,119,32,98,121,32,97,32,110,117,109,98,101,114,32,111,102,32,99,108,97,117,115,101,115,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,99,108,45,108,105,109,0,0,86,97,114,105,97,98,108,101,115,32,97,114,101,32,110,111,116,32,101,108,105,109,105,110,97,116,101,100,32,105,102,32,105,116,32,112,114,111,100,117,99,101,115,32,97,32,114,101,115,111,108,118,101,110,116,32,119,105,116,104,32,97,32,108,101,110,103,116,104,32,97,98,111,118,101,32,116,104,105,115,32,108,105,109,105,116,46,32,45,49,32,109,101,97,110,115,32,110,111,32,108,105,109,105,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,115,117,98,45,108,105,109,0,68,111,32,110,111,116,32,99,104,101,99,107,32,105,102,32,115,117,98,115,117,109,112,116,105,111,110,32,97,103,97,105,110,115,116,32,97,32,99,108,97,117,115,101,32,108,97,114,103,101,114,32,116,104,97,110,32,116,104,105,115,46,32,45,49,32,109,101,97,110,115,32,110,111,32,108,105,109,105,116,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,115,105,109,112,45,103,99,45,102,114,97,99,0,0,0,0,84,104,101,32,102,114,97,99,116,105,111,110,32,111,102,32,119,97,115,116,101,100,32,109,101,109,111,114,121,32,97,108,108,111,119,101,100,32,98,101,102,111,114,101,32,97,32,103,97,114,98,97,103,101,32,99,111,108,108,101,99,116,105,111,110,32,105,115,32,116,114,105,103,103,101,114,101,100,32,100,117,114,105,110,103,32,115,105,109,112,108,105,102,105,99,97,116,105,111,110,46,0,0,0,0,0,0,0,120,14,0,0,9,0,0,0,10,0,0,0,11,0,0,0,0,0,0,0,115,117,98,115,117,109,112,116,105,111,110,32,108,101,102,116,58,32,37,49,48,100,32,40,37,49,48,100,32,115,117,98,115,117,109,101,100,44,32,37,49,48,100,32,100,101,108,101,116,101,100,32,108,105,116,101,114,97,108,115,41,13,0,0,101,108,105,109,105,110,97,116,105,111,110,32,108,101,102,116,58,32,37,49,48,100,13,0,124,32,32,69,108,105,109,105,110,97,116,101,100,32,99,108,97,117,115,101,115,58,32,32,32,32,32,37,49,48,46,50,102,32,77,98,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,124,10,0,0,0,0,124,32,32,71,97,114,98,97,103,101,32,99,111,108,108,101,99,116,105,111,110,58,32,32,32,37,49,50,100,32,98,121,116,101,115,32,61,62,32,37,49,50,100,32,98,121,116,101,115,32,32,32,32,32,32,32,32,32,32,32,32,32,124,10,0,0,0,0,0,0,0,0,78,55,77,105,110,105,115,97,116,49,48,83,105,109,112,83,111,108,118,101,114,69,0,0,128,18,0,0,96,14,0,0,192,7,0,0,0,0,0,0,60,100,111,117,98,108,101,62,0,0,0,0,0,0,0,0,60,105,110,116,51,50,62,0,83,73,77,80,0,0,0,0,60,98,111,111,108,62,0,0,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,61,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,89,79,33,0,0,0,0,0,2,0,0,0,0,0,0,0,48,15,0,0,0,0,0,0,117,110,99,97,117,103,104,116,0,0,0,0,0,0,0,0,116,101,114,109,105,110,97,116,105,110,103,32,119,105,116,104,32,37,115,32,101,120,99,101,112,116,105,111,110,32,111,102,32,116,121,112,101,32,37,115,58,32,37,115,0,0,0,0,116,101,114,109,105,110,97,116,105,110,103,32,119,105,116,104,32,37,115,32,101,120,99,101,112,116,105,111,110,32,111,102,32,116,121,112,101,32,37,115,0,0,0,0,0,0,0,0,116,101,114,109,105,110,97,116,105,110,103,32,119,105,116,104,32,37,115,32,102,111,114,101,105,103,110,32,101,120,99,101,112,116,105,111,110,0,0,0,116,101,114,109,105,110,97,116,105,110,103,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,116,104,114,101,97,100,95,111,110,99,101,32,102,97,105,108,117,114,101,32,105,110,32,95,95,99,120,97,95,103,101,116,95,103,108,111,98,97,108,115,95,102,97,115,116,40,41,0,0,0,0,0,0,0,0,99,97,110,110,111,116,32,99,114,101,97,116,101,32,112,116,104,114,101,97,100,32,107,101,121,32,102,111,114,32,95,95,99,120,97,95,103,101,116,95,103,108,111,98,97,108,115,40,41,0,0,0,0,0,0,0,99,97,110,110,111,116,32,122,101,114,111,32,111,117,116,32,116,104,114,101,97,100,32,118,97,108,117,101,32,102,111,114,32,95,95,99,120,97,95,103,101,116,95,103,108,111,98,97,108,115,40,41,0,0,0,0,0,0,0,0,200,16,0,0,12,0,0,0,13,0,0,0,1,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,128,18,0,0,184,16,0,0,80,17,0,0,0,0,0,0,116,101,114,109,105,110,97,116,101,95,104,97,110,100,108,101,114,32,117,110,101,120,112,101,99,116,101,100,108,121,32,114,101,116,117,114,110,101,100,0,116,101,114,109,105,110,97,116,101,95,104,97,110,100,108,101,114,32,117,110,101,120,112,101,99,116,101,100,108,121,32,116,104,114,101,119,32,97,110,32,101,120,99,101,112,116,105,111,110,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,116,57,101,120,99,101,112,116,105,111,110,0,0,0,0,88,18,0,0,64,17,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,88,18,0,0,88,17,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,128,18,0,0,112,17,0,0,104,17,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,128,18,0,0,168,17,0,0,152,17,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,57,95,95,112,111,105,110,116,101,114,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,112,98,97,115,101,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,128,18,0,0,8,18,0,0,152,17,0,0,0,0,0,0,128,18,0,0,224,17,0,0,48,18,0,0,0,0,0,0,0,0,0,0,208,17,0,0,14,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,200,18,0,0,14,0,0,0,18,0,0,0,16,0,0,0,17,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,128,18,0,0,160,18,0,0,208,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,1,2,3,4,5,6,7,8,9,255,255,255,255,255,255,255,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,255,255,255,255,255,255,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,0,0,0,0,0,0,1,2,4,7,3,6,5,0,0,0,0,0,0,0,0,105,110,102,105,110,105,116,121,0,0,0,0,0,0,0,0,110,97,110,0,0,0,0,0,95,112,137,0,255,9,47,15,10,0,0,0,100,0,0,0,232,3,0,0,16,39,0,0,160,134,1,0,64,66,15,0,128,150,152,0,0,225,245,5],"i8",ALLOC_NONE,Runtime.GLOBAL_BASE);var tempDoublePtr=Runtime.alignMemory(allocate(12,"i8",ALLOC_STATIC),8);assert(tempDoublePtr%8==0);function copyTempFloat(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3]}function copyTempDouble(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3];HEAP8[tempDoublePtr+4]=HEAP8[ptr+4];HEAP8[tempDoublePtr+5]=HEAP8[ptr+5];HEAP8[tempDoublePtr+6]=HEAP8[ptr+6];HEAP8[tempDoublePtr+7]=HEAP8[ptr+7]}function _atexit(func,arg){__ATEXIT__.unshift({func:func,arg:arg})}function ___cxa_atexit(){return _atexit.apply(null,arguments)}Module["_i64Subtract"]=_i64Subtract;var ___errno_state=0;function ___setErrNo(value){HEAP32[___errno_state>>2]=value;return value}var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name){switch(name){case 30:return PAGE_SIZE;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 79:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}___setErrNo(ERRNO_CODES.EINVAL);return-1}function __ZSt18uncaught_exceptionv(){return!!__ZSt18uncaught_exceptionv.uncaught_exception}var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:(function(adjusted){if(!adjusted||EXCEPTIONS.infos[adjusted])return adjusted;for(var ptr in EXCEPTIONS.infos){var info=EXCEPTIONS.infos[ptr];if(info.adjusted===adjusted){return ptr}}return adjusted}),addRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount++}),decRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];assert(info.refcount>0);info.refcount--;if(info.refcount===0){if(info.destructor){Runtime.dynCall("vi",info.destructor,[ptr])}delete EXCEPTIONS.infos[ptr];___cxa_free_exception(ptr)}}),clearRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount=0})};function ___resumeException(ptr){if(!EXCEPTIONS.last){EXCEPTIONS.last=ptr}EXCEPTIONS.clearRef(EXCEPTIONS.deAdjust(ptr));throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}function ___cxa_find_matching_catch(){var thrown=EXCEPTIONS.last;if(!thrown){return(asm["setTempRet0"](0),0)|0}var info=EXCEPTIONS.infos[thrown];var throwntype=info.type;if(!throwntype){return(asm["setTempRet0"](0),thrown)|0}var typeArray=Array.prototype.slice.call(arguments);var pointer=Module["___cxa_is_pointer_type"](throwntype);if(!___cxa_find_matching_catch.buffer)___cxa_find_matching_catch.buffer=_malloc(4);HEAP32[___cxa_find_matching_catch.buffer>>2]=thrown;thrown=___cxa_find_matching_catch.buffer;for(var i=0;i<typeArray.length;i++){if(typeArray[i]&&Module["___cxa_can_catch"](typeArray[i],throwntype,thrown)){thrown=HEAP32[thrown>>2];info.adjusted=thrown;return(asm["setTempRet0"](typeArray[i]),thrown)|0}}thrown=HEAP32[thrown>>2];return(asm["setTempRet0"](throwntype),thrown)|0}function ___cxa_throw(ptr,type,destructor){EXCEPTIONS.infos[ptr]={ptr:ptr,adjusted:ptr,type:type,destructor:destructor,refcount:0};EXCEPTIONS.last=ptr;if(!("uncaught_exception"in __ZSt18uncaught_exceptionv)){__ZSt18uncaught_exceptionv.uncaught_exception=1}else{__ZSt18uncaught_exceptionv.uncaught_exception++}throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}Module["_memset"]=_memset;Module["_bitshift64Shl"]=_bitshift64Shl;function _abort(){Module["abort"]()}var FS=undefined;var SOCKFS=undefined;function _send(fd,buf,len,flags){var sock=SOCKFS.getSocket(fd);if(!sock){___setErrNo(ERRNO_CODES.EBADF);return-1}return _write(fd,buf,len)}function _pwrite(fildes,buf,nbyte,offset){var stream=FS.getStream(fildes);if(!stream){___setErrNo(ERRNO_CODES.EBADF);return-1}try{var slab=HEAP8;return FS.write(stream,slab,buf,nbyte,offset)}catch(e){FS.handleFSError(e);return-1}}function _write(fildes,buf,nbyte){var stream=FS.getStream(fildes);if(!stream){___setErrNo(ERRNO_CODES.EBADF);return-1}try{var slab=HEAP8;return FS.write(stream,slab,buf,nbyte)}catch(e){FS.handleFSError(e);return-1}}function _fileno(stream){stream=FS.getStreamFromPtr(stream);if(!stream)return-1;return stream.fd}function _fwrite(ptr,size,nitems,stream){var bytesToWrite=nitems*size;if(bytesToWrite==0)return 0;var fd=_fileno(stream);var bytesWritten=_write(fd,ptr,bytesToWrite);if(bytesWritten==-1){var streamObj=FS.getStreamFromPtr(stream);if(streamObj)streamObj.error=true;return 0}else{return bytesWritten/size|0}}Module["_strlen"]=_strlen;function __reallyNegative(x){return x<0||x===0&&1/x===-Infinity}function __formatString(format,varargs){var textIndex=format;var argIndex=0;function getNextArg(type){var ret;if(type==="double"){ret=(HEAP32[tempDoublePtr>>2]=HEAP32[varargs+argIndex>>2],HEAP32[tempDoublePtr+4>>2]=HEAP32[varargs+(argIndex+4)>>2],+HEAPF64[tempDoublePtr>>3])}else if(type=="i64"){ret=[HEAP32[varargs+argIndex>>2],HEAP32[varargs+(argIndex+4)>>2]]}else{type="i32";ret=HEAP32[varargs+argIndex>>2]}argIndex+=Runtime.getNativeFieldSize(type);return ret}var ret=[];var curr,next,currArg;while(1){var startTextIndex=textIndex;curr=HEAP8[textIndex>>0];if(curr===0)break;next=HEAP8[textIndex+1>>0];if(curr==37){var flagAlwaysSigned=false;var flagLeftAlign=false;var flagAlternative=false;var flagZeroPad=false;var flagPadSign=false;flagsLoop:while(1){switch(next){case 43:flagAlwaysSigned=true;break;case 45:flagLeftAlign=true;break;case 35:flagAlternative=true;break;case 48:if(flagZeroPad){break flagsLoop}else{flagZeroPad=true;break};case 32:flagPadSign=true;break;default:break flagsLoop}textIndex++;next=HEAP8[textIndex+1>>0]}var width=0;if(next==42){width=getNextArg("i32");textIndex++;next=HEAP8[textIndex+1>>0]}else{while(next>=48&&next<=57){width=width*10+(next-48);textIndex++;next=HEAP8[textIndex+1>>0]}}var precisionSet=false,precision=-1;if(next==46){precision=0;precisionSet=true;textIndex++;next=HEAP8[textIndex+1>>0];if(next==42){precision=getNextArg("i32");textIndex++}else{while(1){var precisionChr=HEAP8[textIndex+1>>0];if(precisionChr<48||precisionChr>57)break;precision=precision*10+(precisionChr-48);textIndex++}}next=HEAP8[textIndex+1>>0]}if(precision<0){precision=6;precisionSet=false}var argSize;switch(String.fromCharCode(next)){case"h":var nextNext=HEAP8[textIndex+2>>0];if(nextNext==104){textIndex++;argSize=1}else{argSize=2}break;case"l":var nextNext=HEAP8[textIndex+2>>0];if(nextNext==108){textIndex++;argSize=8}else{argSize=4}break;case"L":case"q":case"j":argSize=8;break;case"z":case"t":case"I":argSize=4;break;default:argSize=null}if(argSize)textIndex++;next=HEAP8[textIndex+1>>0];switch(String.fromCharCode(next)){case"d":case"i":case"u":case"o":case"x":case"X":case"p":{var signed=next==100||next==105;argSize=argSize||4;var currArg=getNextArg("i"+argSize*8);var origArg=currArg;var argText;if(argSize==8){currArg=Runtime.makeBigInt(currArg[0],currArg[1],next==117)}if(argSize<=4){var limit=Math.pow(256,argSize)-1;currArg=(signed?reSign:unSign)(currArg&limit,argSize*8)}var currAbsArg=Math.abs(currArg);var prefix="";if(next==100||next==105){if(argSize==8&&i64Math)argText=i64Math.stringify(origArg[0],origArg[1],null);else argText=reSign(currArg,8*argSize,1).toString(10)}else if(next==117){if(argSize==8&&i64Math)argText=i64Math.stringify(origArg[0],origArg[1],true);else argText=unSign(currArg,8*argSize,1).toString(10);currArg=Math.abs(currArg)}else if(next==111){argText=(flagAlternative?"0":"")+currAbsArg.toString(8)}else if(next==120||next==88){prefix=flagAlternative&&currArg!=0?"0x":"";if(argSize==8&&i64Math){if(origArg[1]){argText=(origArg[1]>>>0).toString(16);var lower=(origArg[0]>>>0).toString(16);while(lower.length<8)lower="0"+lower;argText+=lower}else{argText=(origArg[0]>>>0).toString(16)}}else if(currArg<0){currArg=-currArg;argText=(currAbsArg-1).toString(16);var buffer=[];for(var i=0;i<argText.length;i++){buffer.push((15-parseInt(argText[i],16)).toString(16))}argText=buffer.join("");while(argText.length<argSize*2)argText="f"+argText}else{argText=currAbsArg.toString(16)}if(next==88){prefix=prefix.toUpperCase();argText=argText.toUpperCase()}}else if(next==112){if(currAbsArg===0){argText="(nil)"}else{prefix="0x";argText=currAbsArg.toString(16)}}if(precisionSet){while(argText.length<precision){argText="0"+argText}}if(currArg>=0){if(flagAlwaysSigned){prefix="+"+prefix}else if(flagPadSign){prefix=" "+prefix}}if(argText.charAt(0)=="-"){prefix="-"+prefix;argText=argText.substr(1)}while(prefix.length+argText.length<width){if(flagLeftAlign){argText+=" "}else{if(flagZeroPad){argText="0"+argText}else{prefix=" "+prefix}}}argText=prefix+argText;argText.split("").forEach((function(chr){ret.push(chr.charCodeAt(0))}));break};case"f":case"F":case"e":case"E":case"g":case"G":{var currArg=getNextArg("double");var argText;if(isNaN(currArg)){argText="nan";flagZeroPad=false}else if(!isFinite(currArg)){argText=(currArg<0?"-":"")+"inf";flagZeroPad=false}else{var isGeneral=false;var effectivePrecision=Math.min(precision,20);if(next==103||next==71){isGeneral=true;precision=precision||1;var exponent=parseInt(currArg.toExponential(effectivePrecision).split("e")[1],10);if(precision>exponent&&exponent>=-4){next=(next==103?"f":"F").charCodeAt(0);precision-=exponent+1}else{next=(next==103?"e":"E").charCodeAt(0);precision--}effectivePrecision=Math.min(precision,20)}if(next==101||next==69){argText=currArg.toExponential(effectivePrecision);if(/[eE][-+]\d$/.test(argText)){argText=argText.slice(0,-1)+"0"+argText.slice(-1)}}else if(next==102||next==70){argText=currArg.toFixed(effectivePrecision);if(currArg===0&&__reallyNegative(currArg)){argText="-"+argText}}var parts=argText.split("e");if(isGeneral&&!flagAlternative){while(parts[0].length>1&&parts[0].indexOf(".")!=-1&&(parts[0].slice(-1)=="0"||parts[0].slice(-1)==".")){parts[0]=parts[0].slice(0,-1)}}else{if(flagAlternative&&argText.indexOf(".")==-1)parts[0]+=".";while(precision>effectivePrecision++)parts[0]+="0"}argText=parts[0]+(parts.length>1?"e"+parts[1]:"");if(next==69)argText=argText.toUpperCase();if(currArg>=0){if(flagAlwaysSigned){argText="+"+argText}else if(flagPadSign){argText=" "+argText}}}while(argText.length<width){if(flagLeftAlign){argText+=" "}else{if(flagZeroPad&&(argText[0]=="-"||argText[0]=="+")){argText=argText[0]+"0"+argText.slice(1)}else{argText=(flagZeroPad?"0":" ")+argText}}}if(next<97)argText=argText.toUpperCase();argText.split("").forEach((function(chr){ret.push(chr.charCodeAt(0))}));break};case"s":{var arg=getNextArg("i8*");var argLength=arg?_strlen(arg):"(null)".length;if(precisionSet)argLength=Math.min(argLength,precision);if(!flagLeftAlign){while(argLength<width--){ret.push(32)}}if(arg){for(var i=0;i<argLength;i++){ret.push(HEAPU8[arg++>>0])}}else{ret=ret.concat(intArrayFromString("(null)".substr(0,argLength),true))}if(flagLeftAlign){while(argLength<width--){ret.push(32)}}break};case"c":{if(flagLeftAlign)ret.push(getNextArg("i8"));while(--width>0){ret.push(32)}if(!flagLeftAlign)ret.push(getNextArg("i8"));break};case"n":{var ptr=getNextArg("i32*");HEAP32[ptr>>2]=ret.length;break};case"%":{ret.push(curr);break};default:{for(var i=startTextIndex;i<textIndex+2;i++){ret.push(HEAP8[i>>0])}}}textIndex+=2}else{ret.push(curr);textIndex+=1}}return ret}function _fprintf(stream,format,varargs){var result=__formatString(format,varargs);var stack=Runtime.stackSave();var ret=_fwrite(allocate(result,"i8",ALLOC_STACK),1,result.length,stream);Runtime.stackRestore(stack);return ret}function _printf(format,varargs){var result=__formatString(format,varargs);var string=intArrayToString(result);if(string[string.length-1]==="\n")string=string.substr(0,string.length-1);Module.print(string);return result.length}function _pthread_once(ptr,func){if(!_pthread_once.seen)_pthread_once.seen={};if(ptr in _pthread_once.seen)return;Runtime.dynCall("v",func);_pthread_once.seen[ptr]=1}function _fputc(c,stream){var chr=unSign(c&255);HEAP8[_fputc.ret>>0]=chr;var fd=_fileno(stream);var ret=_write(fd,_fputc.ret,1);if(ret==-1){var streamObj=FS.getStreamFromPtr(stream);if(streamObj)streamObj.error=true;return-1}else{return chr}}var PTHREAD_SPECIFIC={};function _pthread_getspecific(key){return PTHREAD_SPECIFIC[key]||0}Module["_i64Add"]=_i64Add;function _fputs(s,stream){var fd=_fileno(stream);return _write(fd,s,_strlen(s))}var _stdout=allocate(1,"i32*",ALLOC_STATIC);function _puts(s){var result=Pointer_stringify(s);var string=result.substr(0);if(string[string.length-1]==="\n")string=string.substr(0,string.length-1);Module.print(string);return result.length}function _pthread_setspecific(key,value){if(!(key in PTHREAD_SPECIFIC)){return ERRNO_CODES.EINVAL}PTHREAD_SPECIFIC[key]=value;return 0}function __exit(status){Module["exit"](status)}function _exit(status){__exit(status)}var _UItoD=true;function _malloc(bytes){var ptr=Runtime.dynamicAlloc(bytes+8);return ptr+8&4294967288}Module["_malloc"]=_malloc;function ___cxa_allocate_exception(size){return _malloc(size)}function _fmod(x,y){return x%y}function _fmodl(){return _fmod.apply(null,arguments)}Module["_bitshift64Lshr"]=_bitshift64Lshr;function ___cxa_pure_virtual(){ABORT=true;throw"Pure virtual function called!"}function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}var PTHREAD_SPECIFIC_NEXT_KEY=1;function _pthread_key_create(key,destructor){if(key==0){return ERRNO_CODES.EINVAL}HEAP32[key>>2]=PTHREAD_SPECIFIC_NEXT_KEY;PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY]=0;PTHREAD_SPECIFIC_NEXT_KEY++;return 0}function ___cxa_guard_acquire(variable){if(!HEAP8[variable>>0]){HEAP8[variable>>0]=1;return 1}return 0}function ___cxa_guard_release(){}function _vfprintf(s,f,va_arg){return _fprintf(s,f,HEAP32[va_arg>>2])}function ___cxa_begin_catch(ptr){__ZSt18uncaught_exceptionv.uncaught_exception--;EXCEPTIONS.caught.push(ptr);EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));return ptr}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}Module["_memcpy"]=_memcpy;var _llvm_pow_f64=Math_pow;function _sbrk(bytes){var self=_sbrk;if(!self.called){DYNAMICTOP=alignMemoryPage(DYNAMICTOP);self.called=true;assert(Runtime.dynamicAlloc);self.alloc=Runtime.dynamicAlloc;Runtime.dynamicAlloc=(function(){abort("cannot dynamically allocate, sbrk now has control")})}var ret=DYNAMICTOP;if(bytes!=0)self.alloc(bytes);return ret}var _fabs=Math_abs;function ___errno_location(){return ___errno_state}var _BItoD=true;function _copysign(a,b){return __reallyNegative(a)===__reallyNegative(b)?a:-a}function _copysignl(){return _copysign.apply(null,arguments)}var ___dso_handle=allocate(1,"i32*",ALLOC_STATIC);var _stderr=allocate(1,"i32*",ALLOC_STATIC);___errno_state=Runtime.staticAlloc(4);HEAP32[___errno_state>>2]=0;_fputc.ret=allocate([0],"i8",ALLOC_STATIC);STACK_BASE=STACKTOP=Runtime.alignMemory(STATICTOP);staticSealed=true;STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=DYNAMICTOP=Runtime.alignMemory(STACK_MAX);assert(DYNAMIC_BASE<TOTAL_MEMORY,"TOTAL_MEMORY not big enough for stack");var ctlz_i8=allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"i8",ALLOC_DYNAMIC);var cttz_i8=allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0],"i8",ALLOC_DYNAMIC);function invoke_iiii(index,a1,a2,a3){try{return Module["dynCall_iiii"](index,a1,a2,a3)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){try{Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_vi(index,a1){try{Module["dynCall_vi"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_vii(index,a1,a2){try{Module["dynCall_vii"](index,a1,a2)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_ii(index,a1){try{return Module["dynCall_ii"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_v(index){try{Module["dynCall_v"](index)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){try{Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_iii(index,a1,a2){try{return Module["dynCall_iii"](index,a1,a2)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiii(index,a1,a2,a3,a4){try{Module["dynCall_viiii"](index,a1,a2,a3,a4)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}Module.asmGlobalArg={"Math":Math,"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array};Module.asmLibraryArg={"abort":abort,"assert":assert,"min":Math_min,"invoke_iiii":invoke_iiii,"invoke_viiiii":invoke_viiiii,"invoke_vi":invoke_vi,"invoke_vii":invoke_vii,"invoke_ii":invoke_ii,"invoke_v":invoke_v,"invoke_viiiiii":invoke_viiiiii,"invoke_iii":invoke_iii,"invoke_viiii":invoke_viiii,"_fabs":_fabs,"_llvm_pow_f64":_llvm_pow_f64,"_send":_send,"_fmod":_fmod,"___cxa_guard_acquire":___cxa_guard_acquire,"___setErrNo":___setErrNo,"_vfprintf":_vfprintf,"___cxa_allocate_exception":___cxa_allocate_exception,"___cxa_find_matching_catch":___cxa_find_matching_catch,"___cxa_guard_release":___cxa_guard_release,"_pwrite":_pwrite,"__reallyNegative":__reallyNegative,"_sbrk":_sbrk,"___cxa_begin_catch":___cxa_begin_catch,"_emscripten_memcpy_big":_emscripten_memcpy_big,"_fileno":_fileno,"___resumeException":___resumeException,"__ZSt18uncaught_exceptionv":__ZSt18uncaught_exceptionv,"_sysconf":_sysconf,"_pthread_getspecific":_pthread_getspecific,"_atexit":_atexit,"_pthread_once":_pthread_once,"_puts":_puts,"_printf":_printf,"_pthread_key_create":_pthread_key_create,"_write":_write,"___errno_location":___errno_location,"_pthread_setspecific":_pthread_setspecific,"___cxa_atexit":___cxa_atexit,"_copysign":_copysign,"_fputc":_fputc,"___cxa_throw":___cxa_throw,"__exit":__exit,"_copysignl":_copysignl,"_abort":_abort,"_fwrite":_fwrite,"_time":_time,"_fprintf":_fprintf,"__formatString":__formatString,"_fputs":_fputs,"_exit":_exit,"___cxa_pure_virtual":___cxa_pure_virtual,"_fmodl":_fmodl,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"cttz_i8":cttz_i8,"ctlz_i8":ctlz_i8,"NaN":NaN,"Infinity":Infinity,"___dso_handle":___dso_handle,"_stderr":_stderr};// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer) {
"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=env.___dso_handle|0;var p=env._stderr|0;var q=0;var r=0;var s=0;var t=0;var u=+env.NaN,v=+env.Infinity;var w=0,x=0,y=0,z=0,A=0.0,B=0,C=0,D=0,E=0.0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=0;var O=0;var P=global.Math.floor;var Q=global.Math.abs;var R=global.Math.sqrt;var S=global.Math.pow;var T=global.Math.cos;var U=global.Math.sin;var V=global.Math.tan;var W=global.Math.acos;var X=global.Math.asin;var Y=global.Math.atan;var Z=global.Math.atan2;var _=global.Math.exp;var $=global.Math.log;var aa=global.Math.ceil;var ba=global.Math.imul;var ca=env.abort;var da=env.assert;var ea=env.min;var fa=env.invoke_iiii;var ga=env.invoke_viiiii;var ha=env.invoke_vi;var ia=env.invoke_vii;var ja=env.invoke_ii;var ka=env.invoke_v;var la=env.invoke_viiiiii;var ma=env.invoke_iii;var na=env.invoke_viiii;var oa=env._fabs;var pa=env._llvm_pow_f64;var qa=env._send;var ra=env._fmod;var sa=env.___cxa_guard_acquire;var ta=env.___setErrNo;var ua=env._vfprintf;var va=env.___cxa_allocate_exception;var wa=env.___cxa_find_matching_catch;var xa=env.___cxa_guard_release;var ya=env._pwrite;var za=env.__reallyNegative;var Aa=env._sbrk;var Ba=env.___cxa_begin_catch;var Ca=env._emscripten_memcpy_big;var Da=env._fileno;var Ea=env.___resumeException;var Fa=env.__ZSt18uncaught_exceptionv;var Ga=env._sysconf;var Ha=env._pthread_getspecific;var Ia=env._atexit;var Ja=env._pthread_once;var Ka=env._puts;var La=env._printf;var Ma=env._pthread_key_create;var Na=env._write;var Oa=env.___errno_location;var Pa=env._pthread_setspecific;var Qa=env.___cxa_atexit;var Ra=env._copysign;var Sa=env._fputc;var Ta=env.___cxa_throw;var Ua=env.__exit;var Va=env._copysignl;var Wa=env._abort;var Xa=env._fwrite;var Ya=env._time;var Za=env._fprintf;var _a=env.__formatString;var $a=env._fputs;var ab=env._exit;var bb=env.___cxa_pure_virtual;var cb=env._fmodl;var db=0.0;
// EMSCRIPTEN_START_FUNCS
function nb(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+15&-16;return b|0}function ob(){return i|0}function pb(a){a=a|0;i=a}function qb(a,b){a=a|0;b=b|0;if(!q){q=a;r=b}}function rb(b){b=b|0;a[k>>0]=a[b>>0];a[k+1>>0]=a[b+1>>0];a[k+2>>0]=a[b+2>>0];a[k+3>>0]=a[b+3>>0]}function sb(b){b=b|0;a[k>>0]=a[b>>0];a[k+1>>0]=a[b+1>>0];a[k+2>>0]=a[b+2>>0];a[k+3>>0]=a[b+3>>0];a[k+4>>0]=a[b+4>>0];a[k+5>>0]=a[b+5>>0];a[k+6>>0]=a[b+6>>0];a[k+7>>0]=a[b+7>>0]}function tb(a){a=a|0;F=a}function ub(){return F|0}function vb(a){a=a|0;Ba(a|0)|0;ud()}function wb(a){a=a|0;return}function xb(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;h=i;c[b>>2]=112;c[b+4>>2]=d;c[b+8>>2]=e;c[b+12>>2]=f;c[b+16>>2]=g;if((a[144]|0)==0?(sa(144)|0)!=0:0){c[32]=0;c[33]=0;c[34]=0;Qa(19,128,o|0)|0;xa(144)}g=c[33]|0;if((g|0)==(c[34]|0)){f=(g>>1)+2&-2;f=(f|0)<2?2:f;if((f|0)>(2147483647-g|0)){d=va(1)|0;Ta(d|0,48,0)}e=c[32]|0;d=f+g|0;c[34]=d;d=Ud(e,d<<2)|0;c[32]=d;if((d|0)==0?(c[(Oa()|0)>>2]|0)==12:0){d=va(1)|0;Ta(d|0,48,0)}g=c[33]|0}c[33]=g+1;g=(c[32]|0)+(g<<2)|0;if(!g){i=h;return}c[g>>2]=b;i=h;return}function yb(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function zb(a){a=a|0;var b=0,d=0;b=i;d=c[a>>2]|0;if(!d){i=b;return}c[a+4>>2]=0;Td(d);c[a>>2]=0;c[a+8>>2]=0;i=b;return}function Ab(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function Bb(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;if((a[d>>0]|0)!=45){k=0;i=e;return k|0}f=d+1|0;g=110;j=f;k=0;while(1){h=k+1|0;if((a[j>>0]|0)!=g<<24>>24){g=1;break}j=d+(k+2)|0;if((h|0)==3){g=0;f=j;break}else{g=a[264+h>>0]|0;k=h}}if(ee(f,c[b+4>>2]|0)|0){k=0;i=e;return k|0}a[b+20>>0]=g;k=1;i=e;return k|0}function Cb(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;h=i;i=i+16|0;e=h;f=c[p>>2]|0;g=b+4|0;j=c[g>>2]|0;c[e>>2]=j;c[e+4>>2]=j;Za(f|0,216,e|0)|0;j=0;while(1){k=j>>>0<(32-((me(c[g>>2]|0)|0)<<1)|0)>>>0;Sa(32,f|0)|0;if(k)j=j+1|0;else break}c[e>>2]=(a[b+20>>0]|0)!=0?248:256;Za(f|0,232,e|0)|0;if(!d){i=h;return}c[e>>2]=c[b+8>>2];Za(f|0,88,e|0)|0;Sa(10,f|0)|0;i=h;return}function Db(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function Eb(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;i=i+16|0;h=e;g=e+8|0;if((a[d>>0]|0)!=45){n=0;i=e;return n|0}l=d+1|0;f=b+4|0;j=c[f>>2]|0;k=a[j>>0]|0;a:do if(k<<24>>24){m=0;while(1){n=m;m=m+1|0;if((a[l>>0]|0)!=k<<24>>24){b=0;break}k=a[j+m>>0]|0;l=d+(n+2)|0;if(!(k<<24>>24))break a}i=e;return b|0}while(0);if((a[l>>0]|0)!=61){n=0;i=e;return n|0}d=l+1|0;j=de(d,g,10)|0;if(!(c[g>>2]|0)){n=0;i=e;return n|0}if((j|0)>(c[b+24>>2]|0)){n=c[p>>2]|0;m=c[f>>2]|0;c[h>>2]=d;c[h+4>>2]=m;Za(n|0,416,h|0)|0;ab(1)}if((j|0)<(c[b+20>>2]|0)){n=c[p>>2]|0;m=c[f>>2]|0;c[h>>2]=d;c[h+4>>2]=m;Za(n|0,472,h|0)|0;ab(1)}c[b+28>>2]=j;n=1;i=e;return n|0}function Fb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;i=i+16|0;e=d;f=c[p>>2]|0;g=c[a+16>>2]|0;c[e>>2]=c[a+4>>2];c[e+4>>2]=g;Za(f|0,336,e|0)|0;g=c[a+20>>2]|0;if((g|0)==-2147483648)Xa(360,4,1,f|0)|0;else{c[e>>2]=g;Za(f|0,368,e|0)|0}Xa(376,4,1,f|0)|0;g=c[a+24>>2]|0;if((g|0)==2147483647)Xa(384,4,1,f|0)|0;else{c[e>>2]=g;Za(f|0,368,e|0)|0}c[e>>2]=c[a+28>>2];Za(f|0,392,e|0)|0;if(!b){i=d;return}c[e>>2]=c[a+8>>2];Za(f|0,88,e|0)|0;Sa(10,f|0)|0;i=d;return}function Gb(b){b=b|0;var d=0,e=0,f=0,g=0,j=0;g=i;c[b>>2]=1816;f=b+4|0;e=b+32|0;j=b+48|0;c[f+0>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;c[f+16>>2]=0;c[f+20>>2]=0;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;h[j>>3]=+h[75];h[b+56>>3]=+h[89];h[b+64>>3]=+h[103];h[b+72>>3]=+h[123];a[b+80>>0]=a[1364]|0;c[b+84>>2]=c[269];c[b+88>>2]=c[297];a[b+92>>0]=0;a[b+93>>0]=a[1292]|0;h[b+96>>3]=+h[204];c[b+104>>2]=c[439];c[b+108>>2]=c[359];h[b+112>>3]=+h[191];h[b+120>>3]=.3333333333333333;h[b+128>>3]=1.1;c[b+136>>2]=100;h[b+144>>3]=1.5;j=b+316|0;c[b+332>>2]=0;c[b+336>>2]=0;c[b+340>>2]=0;c[b+348>>2]=0;c[b+352>>2]=0;c[b+356>>2]=0;c[b+364>>2]=0;c[b+368>>2]=0;c[b+372>>2]=0;c[b+380>>2]=0;c[b+384>>2]=0;c[b+388>>2]=0;c[b+396>>2]=0;c[b+400>>2]=0;c[b+404>>2]=0;e=b+544|0;c[b+412>>2]=0;c[b+416>>2]=0;c[b+420>>2]=0;c[b+428>>2]=0;c[b+432>>2]=0;c[b+436>>2]=0;c[b+444>>2]=0;c[b+448>>2]=0;c[b+452>>2]=0;ke(b+152|0,0,176)|0;c[b+456>>2]=e;f=b+460|0;c[f+0>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;c[f+16>>2]=0;c[f+20>>2]=0;c[b+488>>2]=j;a[b+492>>0]=1;h[b+496>>3]=1.0;h[b+504>>3]=1.0;c[b+512>>2]=0;c[b+516>>2]=-1;j=b+520|0;f=b+536|0;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;a[f>>0]=1;f=b+540|0;c[f+0>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;c[f+16>>2]=0;gc(e,1048576);a[b+560>>0]=0;e=b+604|0;f=b+664|0;j=b+564|0;d=j+36|0;do{c[j>>2]=0;j=j+4|0}while((j|0)<(d|0));j=e+0|0;d=j+36|0;do{c[j>>2]=0;j=j+4|0}while((j|0)<(d|0));j=b+680|0;c[f+0>>2]=-1;c[f+4>>2]=-1;c[f+8>>2]=-1;c[f+12>>2]=-1;a[j>>0]=0;i=g;return}function Hb(a){a=a|0;var b=0;b=i;Ib(a);pd(a);i=b;return}function Ib(a){a=a|0;var b=0,d=0,e=0;b=i;c[a>>2]=1816;d=a+628|0;e=c[d>>2]|0;if(e){c[a+632>>2]=0;Td(e);c[d>>2]=0;c[a+636>>2]=0}d=a+616|0;e=c[d>>2]|0;if(e){c[a+620>>2]=0;Td(e);c[d>>2]=0;c[a+624>>2]=0}d=a+604|0;e=c[d>>2]|0;if(e){c[a+608>>2]=0;Td(e);c[d>>2]=0;c[a+612>>2]=0}d=a+588|0;e=c[d>>2]|0;if(e){c[a+592>>2]=0;Td(e);c[d>>2]=0;c[a+596>>2]=0}d=a+576|0;e=c[d>>2]|0;if(e){c[a+580>>2]=0;Td(e);c[d>>2]=0;c[a+584>>2]=0}d=a+564|0;e=c[d>>2]|0;if(e){c[a+568>>2]=0;Td(e);c[d>>2]=0;c[a+572>>2]=0}d=c[a+544>>2]|0;if(d)Td(d);d=a+472|0;e=c[d>>2]|0;if(e){c[a+476>>2]=0;Td(e);c[d>>2]=0;c[a+480>>2]=0}d=a+460|0;e=c[d>>2]|0;if(e){c[a+464>>2]=0;Td(e);c[d>>2]=0;c[a+468>>2]=0}hc(a+412|0);d=a+396|0;e=c[d>>2]|0;if(e){c[a+400>>2]=0;Td(e);c[d>>2]=0;c[a+404>>2]=0}d=a+380|0;e=c[d>>2]|0;if(e){c[a+384>>2]=0;Td(e);c[d>>2]=0;c[a+388>>2]=0}e=a+364|0;d=c[e>>2]|0;if(d){c[a+368>>2]=0;Td(d);c[e>>2]=0;c[a+372>>2]=0}d=a+348|0;e=c[d>>2]|0;if(e){c[a+352>>2]=0;Td(e);c[d>>2]=0;c[a+356>>2]=0}d=a+332|0;e=c[d>>2]|0;if(e){c[a+336>>2]=0;Td(e);c[d>>2]=0;c[a+340>>2]=0}d=a+316|0;e=c[d>>2]|0;if(e){c[a+320>>2]=0;Td(e);c[d>>2]=0;c[a+324>>2]=0}d=a+304|0;e=c[d>>2]|0;if(e){c[a+308>>2]=0;Td(e);c[d>>2]=0;c[a+312>>2]=0}d=a+292|0;e=c[d>>2]|0;if(e){c[a+296>>2]=0;Td(e);c[d>>2]=0;c[a+300>>2]=0}d=a+280|0;e=c[d>>2]|0;if(e){c[a+284>>2]=0;Td(e);c[d>>2]=0;c[a+288>>2]=0}d=a+268|0;e=c[d>>2]|0;if(e){c[a+272>>2]=0;Td(e);c[d>>2]=0;c[a+276>>2]=0}d=a+256|0;e=c[d>>2]|0;if(e){c[a+260>>2]=0;Td(e);c[d>>2]=0;c[a+264>>2]=0}d=a+32|0;e=c[d>>2]|0;if(e){c[a+36>>2]=0;Td(e);c[d>>2]=0;c[a+40>>2]=0}d=a+16|0;e=c[d>>2]|0;if(e){c[a+20>>2]=0;Td(e);c[d>>2]=0;c[a+24>>2]=0}e=a+4|0;d=c[e>>2]|0;if(!d){i=b;return}c[a+8>>2]=0;Td(d);c[e>>2]=0;c[a+12>>2]=0;i=b;return}function Jb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,j=0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0;f=i;i=i+16|0;k=f+4|0;j=f;g=b+580|0;m=c[g>>2]|0;if((m|0)>0){o=m+ -1|0;p=c[(c[b+576>>2]|0)+(o<<2)>>2]|0;c[g>>2]=o;g=p}else{p=b+540|0;g=c[p>>2]|0;c[p>>2]=g+1}m=b+412|0;p=g<<1;c[k>>2]=p;ic(m,k);c[j>>2]=p|1;ic(m,j);k=b+332|0;m=a[544]|0;j=g+1|0;jc(k,j);a[(c[k>>2]|0)+g>>0]=m;k=b+396|0;m=b+400|0;if((c[m>>2]|0)<(j|0)){o=b+404|0;p=c[o>>2]|0;if((p|0)<(j|0)){q=g+2-p&-2;n=(p>>1)+2&-2;n=(q|0)>(n|0)?q:n;if((n|0)>(2147483647-p|0)){q=va(1)|0;Ta(q|0,48,0)}r=c[k>>2]|0;q=n+p|0;c[o>>2]=q;q=Ud(r,q<<3)|0;c[k>>2]=q;if((q|0)==0?(c[(Oa()|0)>>2]|0)==12:0){r=va(1)|0;Ta(r|0,48,0)}}o=c[m>>2]|0;if((o|0)<(j|0))do{n=(c[k>>2]|0)+(o<<3)|0;if(n){r=n;c[r>>2]=0;c[r+4>>2]=0}o=o+1|0}while((o|0)!=(j|0));c[m>>2]=j}m=(c[k>>2]|0)+(g<<3)|0;c[m>>2]=-1;c[m+4>>2]=0;m=b+316|0;if(!(a[b+93>>0]|0))l=0.0;else{r=b+72|0;l=+h[r>>3]*1389796.0;l=l- +(~~(l/2147483647.0)|0)*2147483647.0;h[r>>3]=l;l=l/2147483647.0*1.0e-5}k=b+320|0;if((c[k>>2]|0)<(j|0)){n=b+324|0;o=c[n>>2]|0;if((o|0)<(j|0)){r=g+2-o&-2;p=(o>>1)+2&-2;p=(r|0)>(p|0)?r:p;if((p|0)>(2147483647-o|0)){r=va(1)|0;Ta(r|0,48,0)}q=c[m>>2]|0;r=p+o|0;c[n>>2]=r;r=Ud(q,r<<3)|0;c[m>>2]=r;if((r|0)==0?(c[(Oa()|0)>>2]|0)==12:0){r=va(1)|0;Ta(r|0,48,0)}}p=c[k>>2]|0;if((p|0)<(j|0)){n=c[m>>2]|0;do{o=n+(p<<3)|0;if(o)h[o>>3]=0.0;p=p+1|0}while((p|0)!=(j|0))}c[k>>2]=j}h[(c[m>>2]|0)+(g<<3)>>3]=l;kc(b+588|0,g,0);kc(b+348|0,g,1);k=b+364|0;d=a[d>>0]|0;jc(k,j);a[(c[k>>2]|0)+g>>0]=d;k=b+380|0;d=b+384|0;if((c[d>>2]|0)<(j|0)){m=b+388|0;o=c[m>>2]|0;if((o|0)<(j|0)){r=g+2-o&-2;n=(o>>1)+2&-2;n=(r|0)>(n|0)?r:n;if((n|0)>(2147483647-o|0)){r=va(1)|0;Ta(r|0,48,0)}q=c[k>>2]|0;r=n+o|0;c[m>>2]=r;r=Ud(q,r)|0;c[k>>2]=r;if((r|0)==0?(c[(Oa()|0)>>2]|0)==12:0){r=va(1)|0;Ta(r|0,48,0)}}m=c[d>>2]|0;if((m|0)<(j|0))do{n=(c[k>>2]|0)+m|0;if(n)a[n>>0]=0;m=m+1|0}while((m|0)!=(j|0));c[d>>2]=j}d=b+288|0;k=c[d>>2]|0;if((k|0)<(j|0)){r=g+2-k&-2;j=(k>>1)+2&-2;j=(r|0)>(j|0)?r:j;if((j|0)>(2147483647-k|0)){r=va(1)|0;Ta(r|0,48,0)}q=b+280|0;p=c[q>>2]|0;r=j+k|0;c[d>>2]=r;r=Ud(p,r<<2)|0;c[q>>2]=r;if((r|0)==0?(c[(Oa()|0)>>2]|0)==12:0){r=va(1)|0;Ta(r|0,48,0)}}j=b+380|0;d=(c[j>>2]|0)+g|0;k=(a[d>>0]|0)==0;if(e){if(k){r=b+200|0;q=r;q=ne(c[q>>2]|0,c[q+4>>2]|0,1,0)|0;c[r>>2]=q;c[r+4>>2]=F}}else if(!k){r=b+200|0;q=r;q=ne(c[q>>2]|0,c[q+4>>2]|0,-1,-1)|0;c[r>>2]=q;c[r+4>>2]=F}a[d>>0]=e&1;e=b+460|0;if((c[b+476>>2]|0)>(g|0)?(c[(c[b+472>>2]|0)+(g<<2)>>2]|0)>-1:0){i=f;return g|0}if(!(a[(c[j>>2]|0)+g>>0]|0)){i=f;return g|0}lc(e,g);i=f;return g|0}function Kb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=i;i=i+16|0;k=f+1|0;j=f;g=b+492|0;if(!(a[g>>0]|0)){s=0;i=f;return s|0}s=c[e>>2]|0;h=e+4|0;l=c[h>>2]|0;a[k+0>>0]=a[j+0>>0]|0;oc(s,l,k);l=c[h>>2]|0;a:do if((l|0)>0){k=b+332|0;j=a[528]|0;m=0;n=0;p=-2;while(1){s=c[e>>2]|0;o=c[s+(m<<2)>>2]|0;r=d[(c[k>>2]|0)+(o>>1)>>0]|0;t=r^o&1;q=t&255;u=j&255;if((o|0)==(p^1|0)?1:(q<<24>>24==j<<24>>24&(u>>>1^1)|u&2&t|0)!=0){b=1;break}t=a[536]|0;u=t&255;if((o|0)!=(p|0)?((u>>>1^1)&q<<24>>24==t<<24>>24|r&2&u|0)==0:0){c[s+(n<<2)>>2]=o;l=c[h>>2]|0;n=n+1|0}else o=p;m=m+1|0;if((m|0)<(l|0))p=o;else break a}i=f;return b|0}else{m=0;n=0}while(0);j=m-n|0;if((j|0)>0){l=l-j|0;c[h>>2]=l}if(!l){a[g>>0]=0;u=0;i=f;return u|0}else if((l|0)==1){t=c[c[e>>2]>>2]|0;s=t>>1;a[(c[b+332>>2]|0)+s>>0]=(t&1^1)&255^1;u=c[b+296>>2]|0;s=(c[b+396>>2]|0)+(s<<3)|0;c[s>>2]=-1;c[s+4>>2]=u;s=b+284|0;u=c[s>>2]|0;c[s>>2]=u+1;c[(c[b+280>>2]|0)+(u<<2)>>2]=t;u=(Mb(b)|0)==-1;a[g>>0]=u&1;i=f;return u|0}else{e=pc(b+544|0,e,0)|0;h=b+256|0;g=b+260|0;k=c[g>>2]|0;j=b+264|0;if((k|0)==(c[j>>2]|0)){l=(k>>1)+2&-2;l=(l|0)<2?2:l;if((l|0)>(2147483647-k|0)){u=va(1)|0;Ta(u|0,48,0)}t=c[h>>2]|0;u=l+k|0;c[j>>2]=u;u=Ud(t,u<<2)|0;c[h>>2]=u;if((u|0)==0?(c[(Oa()|0)>>2]|0)==12:0){u=va(1)|0;Ta(u|0,48,0)}k=c[g>>2]|0}c[g>>2]=k+1;g=(c[h>>2]|0)+(k<<2)|0;if(g)c[g>>2]=e;Nb(b,e);u=1;i=f;return u|0}return 0}function Lb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=c[d>>2]|0;d=f>>1;a[(c[b+332>>2]|0)+d>>0]=(f&1^1)&255^1;g=c[b+296>>2]|0;d=(c[b+396>>2]|0)+(d<<3)|0;c[d>>2]=e;c[d+4>>2]=g;e=b+284|0;d=c[e>>2]|0;c[e>>2]=d+1;c[(c[b+280>>2]|0)+(d<<2)>>2]=f;return}function Mb(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;k=i;i=i+16|0;r=k;h=b+512|0;t=c[h>>2]|0;q=b+284|0;if((t|0)>=(c[q>>2]|0)){M=0;K=0;O=-1;N=b+184|0;I=N;L=I;L=c[L>>2]|0;I=I+4|0;I=c[I>>2]|0;I=ne(L|0,I|0,M|0,K|0)|0;L=F;J=N;c[J>>2]=I;N=N+4|0;c[N>>2]=L;N=b+520|0;L=N;J=L;J=c[J>>2]|0;L=L+4|0;L=c[L>>2]|0;K=je(J|0,L|0,M|0,K|0)|0;M=F;L=N;c[L>>2]=K;N=N+4|0;c[N>>2]=M;i=k;return O|0}o=b+280|0;j=b+428|0;g=b+412|0;l=b+332|0;m=b+544|0;n=r+4|0;e=b+396|0;p=b+296|0;f=b+456|0;z=-1;s=0;do{c[h>>2]=t+1;w=c[(c[o>>2]|0)+(t<<2)>>2]|0;if(a[(c[j>>2]|0)+w>>0]|0){u=c[g>>2]|0;t=u+(w*12|0)+4|0;y=c[t>>2]|0;if((y|0)>0){u=u+(w*12|0)|0;v=0;x=0;do{B=c[u>>2]|0;A=B+(v<<3)|0;if((c[(c[c[f>>2]>>2]|0)+(c[A>>2]<<2)>>2]&3|0)!=1){N=A;O=c[N+4>>2]|0;y=B+(x<<3)|0;c[y>>2]=c[N>>2];c[y+4>>2]=O;y=c[t>>2]|0;x=x+1|0}v=v+1|0}while((v|0)<(y|0))}else{v=0;x=0}u=v-x|0;if((u|0)>0)c[t>>2]=y-u;a[(c[j>>2]|0)+w>>0]=0}t=c[g>>2]|0;s=s+1|0;u=c[t+(w*12|0)>>2]|0;t=t+(w*12|0)+4|0;x=c[t>>2]|0;v=u+(x<<3)|0;a:do if(!x){v=u;y=u}else{w=w^1;x=(x<<3)+ -1|0;B=u;y=u;while(1){while(1){b:while(1){H=c[B+4>>2]|0;O=d[(c[l>>2]|0)+(H>>1)>>0]^H&1;J=a[528]|0;I=J&255;K=I&2;I=I>>>1^1;if((O&255)<<24>>24==J<<24>>24&I|K&O){E=19;break}A=c[B>>2]|0;E=c[m>>2]|0;G=E+(A<<2)|0;C=E+(A+1<<2)|0;D=c[C>>2]|0;if((D|0)==(w|0)){O=E+(A+2<<2)|0;D=c[O>>2]|0;c[C>>2]=D;c[O>>2]=w}C=B+8|0;c[r>>2]=A;c[n>>2]=D;if((D|0)!=(H|0)?(O=d[(c[l>>2]|0)+(D>>1)>>0]^D&1,((O&255)<<24>>24==J<<24>>24&I|K&O|0)!=0):0){E=27;break}K=c[G>>2]|0;if(K>>>0<=95){E=31;break}I=c[l>>2]|0;J=a[536]|0;H=J&255;O=H&2;H=H>>>1^1;N=2;while(1){L=G+(N<<2)+4|0;M=c[L>>2]|0;P=d[I+(M>>1)>>0]^M&1;N=N+1|0;if(!((P&255)<<24>>24==J<<24>>24&H|O&P))break;if((N|0)>=(K>>>5|0)){E=32;break b}}P=E+(A+2<<2)|0;c[P>>2]=M;c[L>>2]=w;qc((c[g>>2]|0)+((c[P>>2]^1)*12|0)|0,r);if((C|0)==(v|0))break a;else B=C}if((E|0)==19){E=0;N=B;O=c[N+4>>2]|0;P=y;c[P>>2]=c[N>>2];c[P+4>>2]=O;B=B+8|0;y=y+8|0}else if((E|0)==27){E=0;O=r;P=c[O+4>>2]|0;B=y;c[B>>2]=c[O>>2];c[B+4>>2]=P;B=C;y=y+8|0}else if((E|0)==31){J=a[536]|0;E=32}if((E|0)==32){E=y+8|0;G=r;I=c[G+4>>2]|0;H=y;c[H>>2]=c[G>>2];c[H+4>>2]=I;H=D>>1;I=D&1;G=(c[l>>2]|0)+H|0;P=d[G>>0]^I;O=J&255;if((P&255)<<24>>24==J<<24>>24&(O>>>1^1)|O&2&P)break;a[G>>0]=(I^1)&255^1;y=c[p>>2]|0;B=(c[e>>2]|0)+(H<<3)|0;c[B>>2]=A;c[B+4>>2]=y;B=c[q>>2]|0;c[q>>2]=B+1;c[(c[o>>2]|0)+(B<<2)>>2]=D;B=C;y=E}if((B|0)==(v|0))break a}c[h>>2]=c[q>>2];if(C>>>0<v>>>0){z=(u+(x-C)|0)>>>3;while(1){N=C;C=C+8|0;O=c[N+4>>2]|0;P=E;c[P>>2]=c[N>>2];c[P+4>>2]=O;if(C>>>0>=v>>>0)break;else E=E+8|0}B=B+(z+2<<3)|0;y=y+(z+2<<3)|0}else{B=C;y=E}if((B|0)==(v|0)){z=A;break}else z=A}}while(0);u=v-y|0;if((u|0)>0)c[t>>2]=(c[t>>2]|0)-(u>>3);t=c[h>>2]|0}while((t|0)<(c[q>>2]|0));N=s;L=((s|0)<0)<<31>>31;P=z;O=b+184|0;J=O;M=J;M=c[M>>2]|0;J=J+4|0;J=c[J>>2]|0;J=ne(M|0,J|0,N|0,L|0)|0;M=F;K=O;c[K>>2]=J;O=O+4|0;c[O>>2]=M;O=b+520|0;M=O;K=M;K=c[K>>2]|0;M=M+4|0;M=c[M>>2]|0;L=je(K|0,M|0,N|0,L|0)|0;N=F;M=O;c[M>>2]=L;O=O+4|0;c[O>>2]=N;i=k;return P|0}function Nb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;i=i+16|0;k=d+8|0;f=d;g=c[a+544>>2]|0;e=g+(b<<2)|0;h=g+(b+1<<2)|0;j=a+412|0;l=(c[j>>2]|0)+((c[h>>2]^1)*12|0)|0;g=g+(b+2<<2)|0;m=c[g>>2]|0;c[k>>2]=b;c[k+4>>2]=m;qc(l,k);g=(c[j>>2]|0)+((c[g>>2]^1)*12|0)|0;h=c[h>>2]|0;c[f>>2]=b;c[f+4>>2]=h;qc(g,f);if(!(c[e>>2]&4)){m=a+208|0;l=m;l=ne(c[l>>2]|0,c[l+4>>2]|0,1,0)|0;c[m>>2]=l;c[m+4>>2]=F;m=a+224|0;l=m;l=ne((c[e>>2]|0)>>>5|0,0,c[l>>2]|0,c[l+4>>2]|0)|0;c[m>>2]=l;c[m+4>>2]=F;i=d;return}else{m=a+216|0;l=m;l=ne(c[l>>2]|0,c[l+4>>2]|0,1,0)|0;c[m>>2]=l;c[m+4>>2]=F;m=a+232|0;l=m;l=ne((c[e>>2]|0)>>>5|0,0,c[l>>2]|0,c[l+4>>2]|0)|0;c[m>>2]=l;c[m+4>>2]=F;i=d;return}}function Ob(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;g=i;i=i+16|0;l=g+4|0;j=g;h=c[b+544>>2]|0;f=h+(d<<2)|0;k=c[h+(d+1<<2)>>2]^1;if(!e){c[l>>2]=k;e=b+428|0;m=c[e>>2]|0;k=m+k|0;if(!(a[k>>0]|0)){a[k>>0]=1;mc(b+444|0,l);m=c[e>>2]|0}d=c[h+(d+2<<2)>>2]^1;c[j>>2]=d;d=m+d|0;if(!(a[d>>0]|0)){a[d>>0]=1;mc(b+444|0,j)}}else{j=b+412|0;e=c[j>>2]|0;l=e+(k*12|0)|0;h=h+(d+2<<2)|0;k=e+(k*12|0)+4|0;m=c[k>>2]|0;a:do if((m|0)>0){p=c[l>>2]|0;o=0;while(1){n=o+1|0;if((c[p+(o<<3)>>2]|0)==(d|0)){n=o;break a}if((n|0)<(m|0))o=n;else break}}else n=0;while(0);m=m+ -1|0;if((n|0)<(m|0)){do{e=c[l>>2]|0;m=n;n=n+1|0;o=e+(n<<3)|0;p=c[o+4>>2]|0;m=e+(m<<3)|0;c[m>>2]=c[o>>2];c[m+4>>2]=p;m=(c[k>>2]|0)+ -1|0}while((n|0)<(m|0));e=c[j>>2]|0}c[k>>2]=m;j=c[h>>2]^1;h=e+(j*12|0)|0;j=e+(j*12|0)+4|0;k=c[j>>2]|0;b:do if((k|0)>0){e=c[h>>2]|0;m=0;while(1){l=m+1|0;if((c[e+(m<<3)>>2]|0)==(d|0)){l=m;break b}if((l|0)<(k|0))m=l;else break}}else l=0;while(0);d=k+ -1|0;if((l|0)<(d|0))do{n=c[h>>2]|0;d=l;l=l+1|0;o=n+(l<<3)|0;p=c[o+4>>2]|0;d=n+(d<<3)|0;c[d>>2]=c[o>>2];c[d+4>>2]=p;d=(c[j>>2]|0)+ -1|0}while((l|0)<(d|0));c[j>>2]=d}if(!(c[f>>2]&4)){p=b+208|0;o=p;o=ne(c[o>>2]|0,c[o+4>>2]|0,-1,-1)|0;c[p>>2]=o;c[p+4>>2]=F;p=b+224|0;o=p;o=je(c[o>>2]|0,c[o+4>>2]|0,(c[f>>2]|0)>>>5|0,0)|0;c[p>>2]=o;c[p+4>>2]=F;i=g;return}else{p=b+216|0;o=p;o=ne(c[o>>2]|0,c[o+4>>2]|0,-1,-1)|0;c[p>>2]=o;c[p+4>>2]=F;p=b+232|0;o=p;o=je(c[o>>2]|0,c[o+4>>2]|0,(c[f>>2]|0)>>>5|0,0)|0;c[p>>2]=o;c[p+4>>2]=F;i=g;return}}function Pb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;h=i;g=b+544|0;m=c[g>>2]|0;f=m+(e<<2)|0;Ob(b,e,0);m=c[m+(e+1<<2)>>2]|0;j=m>>1;m=(d[(c[b+332>>2]|0)+j>>0]|0)^m&1;o=a[528]|0;n=o&255;if((((m&255)<<24>>24==o<<24>>24&(n>>>1^1)|n&2&m|0)!=0?(k=(c[b+396>>2]|0)+(j<<3)|0,l=c[k>>2]|0,(l|0)!=-1):0)?((c[g>>2]|0)+(l<<2)|0)==(f|0):0)c[k>>2]=-1;c[f>>2]=c[f>>2]&-4|1;n=c[(c[g>>2]|0)+(e<<2)>>2]|0;o=b+556|0;c[o>>2]=((((n>>>3&1)+(n>>>5)<<2)+4|0)>>>2)+(c[o>>2]|0);i=h;return}function Qb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;g=c[e>>2]|0;if(g>>>0<=31){l=0;i=f;return l|0}h=c[b+332>>2]|0;j=a[528]|0;k=j&255;l=k&2;k=k>>>1^1;b=0;while(1){m=c[e+(b<<2)+4>>2]|0;m=(d[h+(m>>1)>>0]|0)^m&1;b=b+1|0;if((m&255)<<24>>24==j<<24>>24&k|l&m){g=1;e=5;break}if((b|0)>=(g>>>5|0)){g=0;e=5;break}}if((e|0)==5){i=f;return g|0}return 0}function Rb(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;g=i;e=b+296|0;if((c[e>>2]|0)<=(d|0)){i=g;return}f=b+284|0;s=c[f>>2]|0;j=b+292|0;t=c[j>>2]|0;u=c[t+(d<<2)>>2]|0;if((s|0)>(u|0)){r=b+280|0;m=b+332|0;l=b+88|0;k=b+348|0;n=b+460|0;p=b+476|0;q=b+472|0;o=b+380|0;do{s=s+ -1|0;u=c[(c[r>>2]|0)+(s<<2)>>2]>>1;a[(c[m>>2]|0)+u>>0]=a[544]|0;t=c[l>>2]|0;if((t|0)<=1){if((t|0)==1?(s|0)>(c[(c[j>>2]|0)+((c[e>>2]|0)+ -1<<2)>>2]|0):0)h=7}else h=7;if((h|0)==7){h=0;a[(c[k>>2]|0)+u>>0]=c[(c[r>>2]|0)+(s<<2)>>2]&1}if(!((c[p>>2]|0)>(u|0)?(c[(c[q>>2]|0)+(u<<2)>>2]|0)>-1:0))h=11;if((h|0)==11?(h=0,(a[(c[o>>2]|0)+u>>0]|0)!=0):0)lc(n,u);t=c[j>>2]|0;u=c[t+(d<<2)>>2]|0}while((s|0)>(u|0));s=c[f>>2]|0}c[b+512>>2]=u;b=c[t+(d<<2)>>2]|0;if((s-b|0)>0)c[f>>2]=b;if(((c[e>>2]|0)-d|0)<=0){i=g;return}c[e>>2]=d;i=g;return}function Sb(b){b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0;d=i;f=b+72|0;q=+h[f>>3]*1389796.0;q=q- +(~~(q/2147483647.0)|0)*2147483647.0;h[f>>3]=q;l=b+464|0;if(q/2147483647.0<+h[b+64>>3]?(m=c[l>>2]|0,(m|0)!=0):0){q=q*1389796.0;q=q- +(~~(q/2147483647.0)|0)*2147483647.0;h[f>>3]=q;m=c[(c[b+460>>2]|0)+(~~(+(m|0)*(q/2147483647.0))<<2)>>2]|0;o=a[(c[b+332>>2]|0)+m>>0]|0;n=a[544]|0;p=n&255;if(((p>>>1^1)&o<<24>>24==n<<24>>24|o&2&p|0)!=0?(a[(c[b+380>>2]|0)+m>>0]|0)!=0:0){p=b+176|0;o=p;o=ne(c[o>>2]|0,c[o+4>>2]|0,1,0)|0;c[p>>2]=o;c[p+4>>2]=F}}else m=-1;n=b+460|0;p=b+332|0;o=b+380|0;while(1){if(((m|0)!=-1?(r=a[(c[p>>2]|0)+m>>0]|0,j=a[544]|0,e=j&255,g=e>>>1^1,(g&r<<24>>24==j<<24>>24|r&2&e|0)!=0):0)?(a[(c[o>>2]|0)+m>>0]|0)!=0:0)break;if(!(c[l>>2]|0)){e=-2;k=17;break}m=rc(n)|0}if((k|0)==17){i=d;return e|0}l=a[(c[b+364>>2]|0)+m>>0]|0;k=l&255;if(!(g&l<<24>>24==j<<24>>24|e&2&k)){p=a[528]|0;r=p&255;r=((r>>>1^1)&l<<24>>24==p<<24>>24|k&2&r|0)!=0|m<<1;i=d;return r|0}if(!(a[b+92>>0]|0)){r=(a[(c[b+348>>2]|0)+m>>0]|0)!=0|m<<1;i=d;return r|0}else{q=+h[f>>3]*1389796.0;q=q- +(~~(q/2147483647.0)|0)*2147483647.0;h[f>>3]=q;r=q/2147483647.0<.5|m<<1;i=d;return r|0}return 0}function Tb(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0.0,U=0;j=i;i=i+16|0;p=j+8|0;t=j+4|0;n=j;m=e+4|0;k=c[m>>2]|0;l=e+8|0;if((k|0)==(c[l>>2]|0)){q=(k>>1)+2&-2;q=(q|0)<2?2:q;if((q|0)>(2147483647-k|0)){S=va(1)|0;Ta(S|0,48,0)}R=c[e>>2]|0;S=q+k|0;c[l>>2]=S;S=Ud(R,S<<2)|0;c[e>>2]=S;if((S|0)==0?(c[(Oa()|0)>>2]|0)==12:0){S=va(1)|0;Ta(S|0,48,0)}k=c[m>>2]|0}l=(c[e>>2]|0)+(k<<2)|0;if(l){c[l>>2]=0;k=c[m>>2]|0}c[m>>2]=k+1;q=b+544|0;H=b+280|0;k=b+588|0;l=b+396|0;C=b+504|0;E=b+316|0;D=b+540|0;B=b+476|0;A=b+472|0;z=b+460|0;y=b+488|0;x=b+296|0;v=b+496|0;w=b+272|0;G=b+268|0;J=-2;I=(c[b+284>>2]|0)+ -1|0;K=0;do{L=c[q>>2]|0;d=L+(d<<2)|0;M=c[d>>2]|0;if((M&4|0)!=0?(r=+h[v>>3],S=d+(M>>>5<<2)+4|0,T=r+ +g[S>>2],g[S>>2]=T,T>1.0e20):0){O=c[w>>2]|0;if((O|0)>0){N=c[G>>2]|0;M=0;do{S=L+(c[N+(M<<2)>>2]<<2)|0;S=S+((c[S>>2]|0)>>>5<<2)+4|0;g[S>>2]=+g[S>>2]*1.0e-20;M=M+1|0}while((M|0)!=(O|0))}h[v>>3]=r*1.0e-20}J=(J|0)!=-2&1;if(J>>>0<(c[d>>2]|0)>>>5>>>0)do{M=c[d+(J<<2)+4>>2]|0;c[t>>2]=M;M=M>>1;L=(c[k>>2]|0)+M|0;do if((a[L>>0]|0)==0?(c[(c[l>>2]|0)+(M<<3)+4>>2]|0)>0:0){O=c[E>>2]|0;S=O+(M<<3)|0;T=+h[C>>3]+ +h[S>>3];h[S>>3]=T;if(T>1.0e+100){P=c[D>>2]|0;if((P|0)>0){N=0;do{S=O+(N<<3)|0;h[S>>3]=+h[S>>3]*1.0e-100;N=N+1|0}while((N|0)!=(P|0))}h[C>>3]=+h[C>>3]*1.0e-100}if((c[B>>2]|0)>(M|0)?(u=c[A>>2]|0,s=c[u+(M<<2)>>2]|0,(s|0)>-1):0){N=c[z>>2]|0;O=c[N+(s<<2)>>2]|0;a:do if(!s)R=0;else{S=s;while(1){R=S;S=S+ -1>>1;Q=N+(S<<2)|0;P=c[Q>>2]|0;U=c[c[y>>2]>>2]|0;if(!(+h[U+(O<<3)>>3]>+h[U+(P<<3)>>3]))break a;c[N+(R<<2)>>2]=P;c[u+(c[Q>>2]<<2)>>2]=R;if(!S){R=0;break}}}while(0);c[N+(R<<2)>>2]=O;c[u+(O<<2)>>2]=R}a[L>>0]=1;if((c[(c[l>>2]|0)+(M<<3)+4>>2]|0)<(c[x>>2]|0)){mc(e,t);break}else{K=K+1|0;break}}while(0);J=J+1|0}while((J|0)<((c[d>>2]|0)>>>5|0));d=c[H>>2]|0;L=c[k>>2]|0;do{J=I;I=I+ -1|0;J=c[d+(J<<2)>>2]|0;N=J>>1;M=L+N|0}while((a[M>>0]|0)==0);d=c[(c[l>>2]|0)+(N<<3)>>2]|0;a[M>>0]=0;K=K+ -1|0}while((K|0)>0);c[c[e>>2]>>2]=J^1;t=b+616|0;v=c[t>>2]|0;s=b+620|0;if(!v)w=c[s>>2]|0;else{c[s>>2]=0;w=0}u=c[m>>2]|0;if((w|0)<(u|0)){y=b+624|0;x=c[y>>2]|0;if((x|0)<(u|0)){U=u+1-x&-2;w=(x>>1)+2&-2;w=(U|0)>(w|0)?U:w;if((w|0)>(2147483647-x|0)){U=va(1)|0;Ta(U|0,48,0)}U=w+x|0;c[y>>2]=U;v=Ud(v,U<<2)|0;c[t>>2]=v;if((v|0)==0?(c[(Oa()|0)>>2]|0)==12:0){U=va(1)|0;Ta(U|0,48,0)}}w=c[s>>2]|0;b:do if((w|0)<(u|0))while(1){v=v+(w<<2)|0;if(v)c[v>>2]=0;w=w+1|0;if((w|0)==(u|0))break b;v=c[t>>2]|0}while(0);c[s>>2]=u;u=c[m>>2]|0}if((u|0)>0){w=c[t>>2]|0;v=c[e>>2]|0;x=0;do{c[w+(x<<2)>>2]=c[v+(x<<2)>>2];x=x+1|0;u=c[m>>2]|0}while((x|0)<(u|0))}v=c[b+84>>2]|0;if((v|0)==1)if((u|0)>1){n=c[e>>2]|0;o=1;v=1;while(1){u=c[n+(o<<2)>>2]|0;p=c[l>>2]|0;w=c[p+(u>>1<<3)>>2]|0;c:do if((w|0)!=-1){x=(c[q>>2]|0)+(w<<2)|0;y=c[x>>2]|0;if(y>>>0>63){w=c[k>>2]|0;z=1;while(1){U=c[x+(z<<2)+4>>2]>>1;if((a[w+U>>0]|0)==0?(c[p+(U<<3)+4>>2]|0)>0:0)break;z=z+1|0;if((z|0)>=(y>>>5|0))break c}c[n+(v<<2)>>2]=u;v=v+1|0}}else{c[n+(v<<2)>>2]=u;v=v+1|0}while(0);o=o+1|0;p=c[m>>2]|0;if((o|0)>=(p|0)){n=p;break}}}else{n=u;o=1;v=1}else if((v|0)==2)if((u|0)>1){q=1;v=1;do{w=c[e>>2]|0;u=c[w+(q<<2)>>2]|0;if((c[(c[l>>2]|0)+(u>>1<<3)>>2]|0)!=-1){c[n>>2]=u;c[p+0>>2]=c[n+0>>2];if(!(Ub(b,p)|0)){u=c[e>>2]|0;w=u;u=c[u+(q<<2)>>2]|0;o=62}}else o=62;if((o|0)==62){o=0;c[w+(v<<2)>>2]=u;v=v+1|0}q=q+1|0;u=c[m>>2]|0}while((q|0)<(u|0));n=u;o=q}else{n=u;o=1;v=1}else{n=u;o=u;v=u}U=b+240|0;S=U;S=ne(c[S>>2]|0,c[S+4>>2]|0,n|0,((n|0)<0)<<31>>31|0)|0;c[U>>2]=S;c[U+4>>2]=F;o=o-v|0;if((o|0)>0){n=n-o|0;c[m>>2]=n}U=b+248|0;S=U;S=ne(c[S>>2]|0,c[S+4>>2]|0,n|0,((n|0)<0)<<31>>31|0)|0;c[U>>2]=S;c[U+4>>2]=F;if((n|0)==1)e=0;else{e=c[e>>2]|0;if((n|0)>2){b=c[l>>2]|0;m=2;o=1;do{o=(c[b+(c[e+(m<<2)>>2]>>1<<3)+4>>2]|0)>(c[b+(c[e+(o<<2)>>2]>>1<<3)+4>>2]|0)?m:o;m=m+1|0}while((m|0)<(n|0))}else o=1;S=e+(o<<2)|0;U=c[S>>2]|0;e=e+4|0;c[S>>2]=c[e>>2];c[e>>2]=U;e=c[(c[l>>2]|0)+(U>>1<<3)+4>>2]|0}c[f>>2]=e;if((c[s>>2]|0)>0)f=0;else{i=j;return}do{a[(c[k>>2]|0)+(c[(c[t>>2]|0)+(f<<2)>>2]>>1)>>0]=0;f=f+1|0}while((f|0)<(c[s>>2]|0));i=j;return}function Ub(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=i;n=c[d>>2]|0;l=b+396|0;q=c[l>>2]|0;k=b+544|0;s=(c[k>>2]|0)+(c[q+(n>>1<<3)>>2]<<2)|0;h=b+604|0;f=b+608|0;if(c[h>>2]|0)c[f>>2]=0;g=b+588|0;j=b+612|0;b=b+616|0;o=1;while(1){if(o>>>0<(c[s>>2]|0)>>>5>>>0){r=c[s+(o<<2)+4>>2]|0;p=r>>1;if((c[q+(p<<3)+4>>2]|0)!=0?(m=a[(c[g>>2]|0)+p>>0]|0,(m+ -1<<24>>24&255)>=2):0){s=c[f>>2]|0;t=(s|0)==(c[j>>2]|0);if(m<<24>>24==3?1:(c[q+(p<<3)>>2]|0)==-1){k=8;break}if(t){q=(s>>1)+2&-2;q=(q|0)<2?2:q;if((q|0)>(2147483647-s|0)){k=24;break}u=c[h>>2]|0;t=q+s|0;c[j>>2]=t;t=Ud(u,t<<3)|0;c[h>>2]=t;if((t|0)==0?(c[(Oa()|0)>>2]|0)==12:0){k=24;break}s=c[f>>2]|0}c[f>>2]=s+1;q=(c[h>>2]|0)+(s<<3)|0;if(q){u=q;c[u>>2]=o;c[u+4>>2]=n}c[d>>2]=r;s=c[l>>2]|0;n=r;q=s;s=(c[k>>2]|0)+(c[s+(p<<3)>>2]<<2)|0;o=0}}else{n=(c[g>>2]|0)+(n>>1)|0;if(!(a[n>>0]|0)){a[n>>0]=2;mc(b,d)}n=c[f>>2]|0;if(!n){f=1;k=34;break}u=n+ -1|0;n=c[h>>2]|0;o=c[n+(u<<3)>>2]|0;n=c[n+(u<<3)+4>>2]|0;c[d>>2]=n;q=c[l>>2]|0;s=(c[k>>2]|0)+(c[q+(n>>1<<3)>>2]<<2)|0;c[f>>2]=u}o=o+1|0}if((k|0)==8){if(t){k=(s>>1)+2&-2;k=(k|0)<2?2:k;if((k|0)>(2147483647-s|0)){u=va(1)|0;Ta(u|0,48,0)}t=c[h>>2]|0;u=k+s|0;c[j>>2]=u;u=Ud(t,u<<3)|0;c[h>>2]=u;if((u|0)==0?(c[(Oa()|0)>>2]|0)==12:0){u=va(1)|0;Ta(u|0,48,0)}s=c[f>>2]|0}j=s+1|0;c[f>>2]=j;k=(c[h>>2]|0)+(s<<3)|0;if(k){j=k;c[j>>2]=0;c[j+4>>2]=n;j=c[f>>2]|0}if((j|0)>0)k=0;else{u=0;i=e;return u|0}do{l=(c[g>>2]|0)+(c[(c[h>>2]|0)+(k<<3)+4>>2]>>1)|0;if(!(a[l>>0]|0)){a[l>>0]=3;mc(b,(c[h>>2]|0)+(k<<3)+4|0);j=c[f>>2]|0}k=k+1|0}while((k|0)<(j|0));f=0;i=e;return f|0}else if((k|0)==24)Ta(va(1)|0,48,0);else if((k|0)==34){i=e;return f|0}return 0}function Vb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;j=i;i=i+32|0;h=j+16|0;g=j+12|0;k=j+8|0;f=j;n=e+20|0;l=e+16|0;if((c[n>>2]|0)>0){m=0;do{a[(c[e>>2]|0)+(c[(c[l>>2]|0)+(m<<2)>>2]|0)>>0]=0;m=m+1|0}while((m|0)<(c[n>>2]|0))}if(c[l>>2]|0)c[n>>2]=0;m=c[d>>2]|0;c[k>>2]=m;c[g>>2]=m;c[h+0>>2]=c[g+0>>2];sc(e,h,0);l=(c[e>>2]|0)+m|0;if(!(a[l>>0]|0)){a[l>>0]=1;mc(e+16|0,k)}if(!(c[b+296>>2]|0)){i=j;return}d=m>>1;o=b+588|0;a[(c[o>>2]|0)+d>>0]=1;p=c[b+284>>2]|0;n=b+292|0;s=c[c[n>>2]>>2]|0;if((p|0)>(s|0)){k=b+280|0;l=b+396|0;m=e+16|0;b=b+544|0;do{p=p+ -1|0;r=c[(c[k>>2]|0)+(p<<2)>>2]|0;q=r>>1;if(a[(c[o>>2]|0)+q>>0]|0){s=c[l>>2]|0;t=c[s+(q<<3)>>2]|0;a:do if((t|0)==-1){r=r^1;c[f>>2]=r;c[g>>2]=r;c[h+0>>2]=c[g+0>>2];sc(e,h,0);r=(c[e>>2]|0)+r|0;if(!(a[r>>0]|0)){a[r>>0]=1;mc(m,f)}}else{r=(c[b>>2]|0)+(t<<2)|0;t=c[r>>2]|0;if(t>>>0>63){u=1;while(1){v=c[r+(u<<2)+4>>2]>>1;if((c[s+(v<<3)+4>>2]|0)>0){a[(c[o>>2]|0)+v>>0]=1;t=c[r>>2]|0}u=u+1|0;if((u|0)>=(t>>>5|0))break a;s=c[l>>2]|0}}}while(0);a[(c[o>>2]|0)+q>>0]=0;s=c[c[n>>2]>>2]|0}}while((p|0)>(s|0))}a[(c[o>>2]|0)+d>>0]=0;i=j;return}function Wb(b){b=b|0;var e=0,f=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;f=i;i=i+16|0;p=f+4|0;u=f;e=b+272|0;w=c[e>>2]|0;n=+h[b+496>>3]/+(w|0);k=b+544|0;l=b+268|0;v=c[l>>2]|0;c[u>>2]=k;c[p+0>>2]=c[u+0>>2];tc(v,w,p);p=c[e>>2]|0;if((p|0)>0){m=b+332|0;o=b+396|0;q=0;v=0;do{t=c[l>>2]|0;u=c[t+(q<<2)>>2]|0;w=c[k>>2]|0;r=w+(u<<2)|0;s=c[r>>2]|0;do if(s>>>0>95){x=c[w+(u+1<<2)>>2]|0;w=x>>1;x=(d[(c[m>>2]|0)+w>>0]|0)^x&1;z=a[528]|0;y=z&255;if(((x&255)<<24>>24==z<<24>>24&(y>>>1^1)|y&2&x|0)!=0?(z=c[(c[o>>2]|0)+(w<<3)>>2]|0,(z|0)!=-1&(z|0)==(u|0)):0){j=9;break}if((q|0)>=((p|0)/2|0|0)?!(+g[r+(s>>>5<<2)+4>>2]<n):0){j=9;break}Pb(b,u)}else j=9;while(0);if((j|0)==9){j=0;c[t+(v<<2)>>2]=u;v=v+1|0}q=q+1|0;p=c[e>>2]|0}while((q|0)<(p|0))}else{q=0;v=0}j=q-v|0;if((j|0)>0)c[e>>2]=p-j;if(!(+((c[b+556>>2]|0)>>>0)>+h[b+96>>3]*+((c[b+548>>2]|0)>>>0))){i=f;return}gb[c[(c[b>>2]|0)+8>>2]&31](b);i=f;return}function Xb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;f=i;g=e+4|0;m=c[g>>2]|0;if((m|0)>0){j=b+544|0;h=b+332|0;k=0;l=0;do{u=c[e>>2]|0;p=c[u+(k<<2)>>2]|0;m=(c[j>>2]|0)+(p<<2)|0;o=c[m>>2]|0;do if(o>>>0>31){v=c[h>>2]|0;r=a[528]|0;q=r&255;w=q&2;q=q>>>1^1;s=o>>>5;t=0;do{x=c[m+(t<<2)+4>>2]|0;x=(d[v+(x>>1)>>0]|0)^x&1;t=t+1|0;if((x&255)<<24>>24==r<<24>>24&q|w&x){n=7;break}}while((t|0)<(s|0));if((n|0)==7){n=0;Pb(b,p);break}if(o>>>0>95){n=a[536]|0;q=o>>>5;p=2;do{r=m+(p<<2)+4|0;x=c[r>>2]|0;x=(d[(c[h>>2]|0)+(x>>1)>>0]|0)^x&1;w=n&255;if((x&255)<<24>>24==n<<24>>24&(w>>>1^1)|w&2&x){c[r>>2]=c[m+(q+ -1<<2)+4>>2];o=c[m>>2]|0;if(o&8){o=o>>>5;c[m+(o+ -1<<2)+4>>2]=c[m+(o<<2)+4>>2];o=c[m>>2]|0}o=o+ -32|0;c[m>>2]=o;p=p+ -1|0}p=p+1|0;q=o>>>5}while((p|0)<(q|0));p=c[e>>2]|0;u=p;p=c[p+(k<<2)>>2]|0;n=16}else n=16}else n=16;while(0);if((n|0)==16){n=0;c[u+(l<<2)>>2]=p;l=l+1|0}k=k+1|0;m=c[g>>2]|0}while((k|0)<(m|0))}else{k=0;l=0}e=k-l|0;if((e|0)<=0){i=f;return}c[g>>2]=m-e;i=f;return}function Yb(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=i;i=i+16|0;e=g+4|0;h=g;c[e>>2]=0;d=e+4|0;c[d>>2]=0;f=e+8|0;c[f>>2]=0;c[h>>2]=0;j=b+540|0;n=c[j>>2]|0;if((n|0)>0){l=b+380|0;k=b+332|0;m=0;do{if((a[(c[l>>2]|0)+m>>0]|0)!=0?(p=a[(c[k>>2]|0)+m>>0]|0,q=a[544]|0,o=q&255,((o>>>1^1)&p<<24>>24==q<<24>>24|p&2&o|0)!=0):0){nc(e,h);n=c[j>>2]|0}m=m+1|0;c[h>>2]=m}while((m|0)<(n|0))}uc(b+460|0,e);b=c[e>>2]|0;if(!b){i=g;return}c[d>>2]=0;Td(b);c[e>>2]=0;c[f>>2]=0;i=g;return}function Zb(b){b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;d=i;f=b+492|0;if((a[f>>0]|0)!=0?(Mb(b)|0)==-1:0){f=b+284|0;g=b+516|0;if((c[f>>2]|0)==(c[g>>2]|0)){s=1;i=d;return s|0}j=b+520|0;s=j;r=c[s+4>>2]|0;if((r|0)>0|(r|0)==0&(c[s>>2]|0)>>>0>0){s=1;i=d;return s|0}Xb(b,b+268|0);if(a[b+536>>0]|0){Xb(b,b+256|0);l=b+564|0;k=b+568|0;if((c[k>>2]|0)>0){n=b+588|0;m=0;do{a[(c[n>>2]|0)+(c[(c[l>>2]|0)+(m<<2)>>2]|0)>>0]=1;m=m+1|0}while((m|0)<(c[k>>2]|0))}p=c[f>>2]|0;if((p|0)>0){m=c[b+280>>2]|0;n=c[b+588>>2]|0;q=0;o=0;do{r=c[m+(q<<2)>>2]|0;if(!(a[n+(r>>1)>>0]|0)){c[m+(o<<2)>>2]=r;p=c[f>>2]|0;o=o+1|0}q=q+1|0}while((q|0)<(p|0))}else{q=0;o=0}m=q-o|0;if((m|0)>0){p=p-m|0;c[f>>2]=p}c[b+512>>2]=p;a:do if((c[k>>2]|0)>0){o=b+588|0;m=0;do{a[(c[o>>2]|0)+(c[(c[l>>2]|0)+(m<<2)>>2]|0)>>0]=0;m=m+1|0;n=c[k>>2]|0}while((m|0)<(n|0));if((n|0)>0){n=b+580|0;o=b+584|0;m=b+576|0;p=0;while(1){r=c[n>>2]|0;if((r|0)==(c[o>>2]|0)){q=(r>>1)+2&-2;q=(q|0)<2?2:q;if((q|0)>(2147483647-r|0)){e=28;break}s=c[m>>2]|0;q=q+r|0;c[o>>2]=q;q=Ud(s,q<<2)|0;c[m>>2]=q;if((q|0)==0?(c[(Oa()|0)>>2]|0)==12:0){e=28;break}r=c[n>>2]|0}else q=c[m>>2]|0;s=q+(r<<2)|0;if(s){c[s>>2]=0;r=c[n>>2]|0}c[n>>2]=r+1;s=c[l>>2]|0;c[q+(r<<2)>>2]=c[s+(p<<2)>>2];p=p+1|0;if((p|0)>=(c[k>>2]|0))break a}if((e|0)==28)Ta(va(1)|0,48,0)}else e=21}else e=21;while(0);if((e|0)==21)s=c[l>>2]|0;if(s)c[k>>2]=0}if(+((c[b+556>>2]|0)>>>0)>+h[b+96>>3]*+((c[b+548>>2]|0)>>>0))gb[c[(c[b>>2]|0)+8>>2]&31](b);Yb(b);c[g>>2]=c[f>>2];r=b+224|0;s=b+232|0;r=ne(c[s>>2]|0,c[s+4>>2]|0,c[r>>2]|0,c[r+4>>2]|0)|0;s=j;c[s>>2]=r;c[s+4>>2]=F;s=1;i=d;return s|0}a[f>>0]=0;s=0;i=d;return s|0}function _b(b,e,f){b=b|0;e=e|0;f=f|0;var j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0.0,ga=0,ha=0,ia=0,ja=0.0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0.0,ra=0,sa=0,ta=0.0;n=i;i=i+64|0;_=n;G=n+60|0;B=n+56|0;j=n+44|0;$=n+40|0;c[j>>2]=0;m=j+4|0;c[m>>2]=0;l=j+8|0;c[l>>2]=0;N=e+160|0;M=N;M=ne(c[M>>2]|0,c[M+4>>2]|0,1,0)|0;c[N>>2]=M;c[N+4>>2]=F;N=(f|0)<0;M=e+680|0;L=e+664|0;K=e+672|0;q=e+296|0;w=e+272|0;o=e+284|0;I=e+640|0;E=e+308|0;D=e+304|0;r=e+332|0;H=e+292|0;ba=e+168|0;t=e+396|0;v=e+280|0;J=e+184|0;C=e+192|0;u=e+48|0;U=e+504|0;Y=e+56|0;aa=e+496|0;ca=e+656|0;O=e+144|0;P=e+648|0;Q=e+128|0;R=e+44|0;T=e+200|0;V=e+208|0;W=e+224|0;X=e+216|0;s=e+232|0;Z=e+540|0;p=e+292|0;x=e+544|0;z=e+276|0;y=e+268|0;A=e+268|0;da=0;a:while(1){ea=N|(da|0)<(f|0);while(1){ga=Mb(e)|0;if((ga|0)!=-1)break;if(!ea){ga=41;break a}if(a[M>>0]|0){ga=41;break a}ga=L;ha=c[ga+4>>2]|0;if((ha|0)>=0?(sa=C,ra=c[sa+4>>2]|0,!(ra>>>0<ha>>>0|((ra|0)==(ha|0)?(c[sa>>2]|0)>>>0<(c[ga>>2]|0)>>>0:0))):0){ga=41;break a}ga=K;ha=c[ga+4>>2]|0;if((ha|0)>=0?(sa=J,ra=c[sa+4>>2]|0,!(ra>>>0<ha>>>0|((ra|0)==(ha|0)?(c[sa>>2]|0)>>>0<(c[ga>>2]|0)>>>0:0))):0){ga=41;break a}if((c[q>>2]|0)==0?!(Zb(e)|0):0){ga=50;break a}if(+((c[w>>2]|0)-(c[o>>2]|0)|0)>=+h[I>>3])Wb(e);while(1){ga=c[q>>2]|0;if((ga|0)>=(c[E>>2]|0)){ga=59;break}ka=c[(c[D>>2]|0)+(ga<<2)>>2]|0;ha=d[(c[r>>2]|0)+(ka>>1)>>0]|0;sa=ha^ka&1;ia=sa&255;pa=a[528]|0;ra=pa&255;if(!(ia<<24>>24==pa<<24>>24&(ra>>>1^1)|ra&2&sa)){ga=56;break}c[G>>2]=c[o>>2];nc(H,G)}if((ga|0)==56){ga=0;ra=a[536]|0;sa=ra&255;if((sa>>>1^1)&ia<<24>>24==ra<<24>>24|ha&2&sa){ga=57;break a}if((ka|0)==-2)ga=59}if((ga|0)==59){sa=ba;sa=ne(c[sa>>2]|0,c[sa+4>>2]|0,1,0)|0;ka=ba;c[ka>>2]=sa;c[ka+4>>2]=F;ka=Sb(e)|0;if((ka|0)==-2){ga=60;break a}}c[_>>2]=c[o>>2];nc(H,_);sa=ka>>1;a[(c[r>>2]|0)+sa>>0]=(ka&1^1)&255^1;ra=c[q>>2]|0;sa=(c[t>>2]|0)+(sa<<3)|0;c[sa>>2]=-1;c[sa+4>>2]=ra;sa=c[o>>2]|0;c[o>>2]=sa+1;c[(c[v>>2]|0)+(sa<<2)>>2]=ka}ra=C;ra=ne(c[ra>>2]|0,c[ra+4>>2]|0,1,0)|0;sa=C;c[sa>>2]=ra;c[sa+4>>2]=F;da=da+1|0;if(!(c[q>>2]|0)){ga=5;break}if(c[j>>2]|0)c[m>>2]=0;Tb(e,ga,j,B);Rb(e,c[B>>2]|0);if((c[m>>2]|0)==1){ra=c[c[j>>2]>>2]|0;sa=ra>>1;a[(c[r>>2]|0)+sa>>0]=(ra&1^1)&255^1;pa=c[q>>2]|0;sa=(c[t>>2]|0)+(sa<<3)|0;c[sa>>2]=-1;c[sa+4>>2]=pa;sa=c[o>>2]|0;c[o>>2]=sa+1;c[(c[v>>2]|0)+(sa<<2)>>2]=ra}else{ea=pc(x,j,1)|0;ga=c[w>>2]|0;if((ga|0)==(c[z>>2]|0)){ha=(ga>>1)+2&-2;ha=(ha|0)<2?2:ha;if((ha|0)>(2147483647-ga|0)){ga=14;break}ra=c[y>>2]|0;sa=ha+ga|0;c[z>>2]=sa;sa=Ud(ra,sa<<2)|0;c[y>>2]=sa;if((sa|0)==0?(c[(Oa()|0)>>2]|0)==12:0){ga=14;break}ga=c[w>>2]|0}c[w>>2]=ga+1;ga=(c[y>>2]|0)+(ga<<2)|0;if(ga)c[ga>>2]=ea;Nb(e,ea);ia=c[x>>2]|0;sa=ia+(ea<<2)|0;fa=+h[aa>>3];sa=sa+((c[sa>>2]|0)>>>5<<2)+4|0;ta=fa+ +g[sa>>2];g[sa>>2]=ta;if(ta>1.0e20){ha=c[w>>2]|0;if((ha|0)>0){ga=c[A>>2]|0;ka=0;do{sa=ia+(c[ga+(ka<<2)>>2]<<2)|0;sa=sa+((c[sa>>2]|0)>>>5<<2)+4|0;g[sa>>2]=+g[sa>>2]*1.0e-20;ka=ka+1|0}while((ka|0)!=(ha|0))}h[aa>>3]=fa*1.0e-20}ra=c[c[j>>2]>>2]|0;sa=ra>>1;a[(c[r>>2]|0)+sa>>0]=(ra&1^1)&255^1;pa=c[q>>2]|0;sa=(c[t>>2]|0)+(sa<<3)|0;c[sa>>2]=ea;c[sa+4>>2]=pa;sa=c[o>>2]|0;c[o>>2]=sa+1;c[(c[v>>2]|0)+(sa<<2)>>2]=ra}h[U>>3]=1.0/+h[u>>3]*+h[U>>3];h[aa>>3]=1.0/+h[Y>>3]*+h[aa>>3];sa=(c[ca>>2]|0)+ -1|0;c[ca>>2]=sa;if(sa)continue;fa=+h[O>>3]*+h[P>>3];h[P>>3]=fa;c[ca>>2]=~~fa;fa=+h[Q>>3]*+h[I>>3];h[I>>3]=fa;if((c[R>>2]|0)<=0)continue;ga=c[C>>2]|0;ea=c[T>>2]|0;oa=c[q>>2]|0;if(!oa)ha=o;else ha=c[p>>2]|0;ha=c[ha>>2]|0;na=c[V>>2]|0;ma=c[W>>2]|0;la=c[X>>2]|0;ka=s;ia=c[ka>>2]|0;ka=c[ka+4>>2]|0;ja=+(c[Z>>2]|0);qa=1.0/ja;if((oa|0)<0)ta=0.0;else{pa=0;ta=0.0;while(1){if(!pa)ra=0;else ra=c[(c[p>>2]|0)+(pa+ -1<<2)>>2]|0;if((pa|0)==(oa|0))sa=o;else sa=(c[p>>2]|0)+(pa<<2)|0;ta=ta+ +S(+qa,+(+(pa|0)))*+((c[sa>>2]|0)-ra|0);if((pa|0)==(oa|0))break;else pa=pa+1|0}}c[_>>2]=ga;c[_+4>>2]=ea-ha;c[_+8>>2]=na;c[_+12>>2]=ma;c[_+16>>2]=~~fa;c[_+20>>2]=la;sa=_+24|0;h[k>>3]=(+(ia>>>0)+4294967296.0*+(ka>>>0))/+(la|0);c[sa>>2]=c[k>>2];c[sa+4>>2]=c[k+4>>2];sa=_+32|0;h[k>>3]=ta/ja*100.0;c[sa>>2]=c[k>>2];c[sa+4>>2]=c[k+4>>2];La(1832,_|0)|0}if((ga|0)==5)a[b>>0]=a[536]|0;else if((ga|0)==14)Ta(va(1)|0,48,0);else if((ga|0)==41){fa=+(c[Z>>2]|0);ja=1.0/fa;r=c[q>>2]|0;if((r|0)<0)qa=0.0;else{q=0;qa=0.0;while(1){if(!q)s=0;else s=c[(c[p>>2]|0)+(q+ -1<<2)>>2]|0;if((q|0)==(r|0))t=o;else t=(c[p>>2]|0)+(q<<2)|0;qa=qa+ +S(+ja,+(+(q|0)))*+((c[t>>2]|0)-s|0);if((q|0)==(r|0))break;else q=q+1|0}}h[e+528>>3]=qa/fa;Rb(e,0);a[b>>0]=a[544]|0}else if((ga|0)==50)a[b>>0]=a[536]|0;else if((ga|0)==57){c[$>>2]=ka^1;sa=e+16|0;c[_+0>>2]=c[$+0>>2];Vb(e,_,sa);a[b>>0]=a[536]|0}else if((ga|0)==60)a[b>>0]=a[528]|0;b=c[j>>2]|0;if(!b){i=n;return}c[m>>2]=0;Td(b);c[j>>2]=0;c[l>>2]=0;i=n;return}function $b(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0,y=0,z=0.0,A=0,B=0;f=i;i=i+16|0;j=f;e=d+4|0;if(c[e>>2]|0)c[d+8>>2]=0;g=d+36|0;k=d+32|0;if((c[g>>2]|0)>0){l=d+16|0;m=0;do{a[(c[l>>2]|0)+(c[(c[k>>2]|0)+(m<<2)>>2]|0)>>0]=0;m=m+1|0}while((m|0)<(c[g>>2]|0))}if(c[k>>2]|0)c[g>>2]=0;k=d+492|0;if(!(a[k>>0]|0)){a[b>>0]=a[536]|0;i=f;return}l=d+152|0;y=l;y=ne(c[y>>2]|0,c[y+4>>2]|0,1,0)|0;c[l>>2]=y;c[l+4>>2]=F;z=+h[d+120>>3]*+(c[d+208>>2]|0);l=d+640|0;h[l>>3]=z;v=+(c[d+104>>2]|0);if(z<v)h[l>>3]=v;w=c[d+136>>2]|0;h[d+648>>3]=+(w|0);c[d+656>>2]=w;w=a[544]|0;l=d+44|0;if((c[l>>2]|0)>0){Ka(2288)|0;Ka(2368)|0;Ka(2448)|0;Ka(2528)|0;o=a[544]|0}else o=w;n=d+192|0;m=d+184|0;y=o&255;a:do if((y>>>1^1)&w<<24>>24==o<<24>>24|w&2&y){q=d+80|0;t=d+112|0;p=d+108|0;o=d+680|0;r=d+664|0;s=d+672|0;u=0;while(1){v=+h[t>>3];if(!(a[q>>0]|0))v=+S(+v,+(+(u|0)));else{y=u+1|0;if((u|0)>0){x=0;w=1;do{x=x+1|0;w=w<<1|1}while((w|0)<(y|0));y=w+ -1|0}else{x=0;y=0}if((y|0)!=(u|0)){w=u;do{A=y>>1;x=x+ -1|0;w=(w|0)%(A|0)|0;y=A+ -1|0}while((y|0)!=(w|0))}v=+S(+v,+(+(x|0)))}_b(j,d,~~(v*+(c[p>>2]|0)));w=a[j>>0]|0;if(a[o>>0]|0)break a;y=r;x=c[y+4>>2]|0;if((x|0)>=0?(A=n,B=c[A+4>>2]|0,!(B>>>0<x>>>0|((B|0)==(x|0)?(c[A>>2]|0)>>>0<(c[y>>2]|0)>>>0:0))):0)break a;y=s;x=c[y+4>>2]|0;if((x|0)>=0?(B=m,A=c[B+4>>2]|0,!(A>>>0<x>>>0|((A|0)==(x|0)?(c[B>>2]|0)>>>0<(c[y>>2]|0)>>>0:0))):0)break a;A=a[544]|0;B=A&255;if(!((B>>>1^1)&w<<24>>24==A<<24>>24|w&2&B))break;else u=u+1|0}}while(0);if((c[l>>2]|0)>0)Ka(2528)|0;A=a[528]|0;B=A&255;j=w&2;if(!((B>>>1^1)&w<<24>>24==A<<24>>24|j&B)){A=a[536]|0;B=A&255;if(((B>>>1^1)&w<<24>>24==A<<24>>24|j&B|0)!=0?(c[g>>2]|0)==0:0)a[k>>0]=0}else{g=d+540|0;jc(e,c[g>>2]|0);if((c[g>>2]|0)>0){j=d+332|0;k=0;do{a[(c[e>>2]|0)+k>>0]=a[(c[j>>2]|0)+k>>0]|0;k=k+1|0}while((k|0)<(c[g>>2]|0))}}Rb(d,0);a[b>>0]=w;i=f;return}function ac(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;f=i;h=b+412|0;vc(h);k=b+540|0;if((c[k>>2]|0)>0){j=b+544|0;g=0;do{l=g<<1;n=c[h>>2]|0;m=n+(l*12|0)+4|0;if((c[m>>2]|0)>0){p=n+(l*12|0)|0;o=0;do{s=(c[p>>2]|0)+(o<<3)|0;n=c[s>>2]|0;q=c[j>>2]|0;r=q+(n<<2)|0;if(!(c[r>>2]&16)){t=wc(e,r)|0;c[s>>2]=t;c[r>>2]=c[r>>2]|16;c[q+(n+1<<2)>>2]=t}else c[s>>2]=c[q+(n+1<<2)>>2];o=o+1|0}while((o|0)<(c[m>>2]|0));m=c[h>>2]|0}else m=n;n=l|1;l=m+(n*12|0)+4|0;if((c[l>>2]|0)>0){r=m+(n*12|0)|0;q=0;do{m=(c[r>>2]|0)+(q<<3)|0;p=c[m>>2]|0;o=c[j>>2]|0;n=o+(p<<2)|0;if(!(c[n>>2]&16)){t=wc(e,n)|0;c[m>>2]=t;c[n>>2]=c[n>>2]|16;c[o+(p+1<<2)>>2]=t}else c[m>>2]=c[o+(p+1<<2)>>2];q=q+1|0}while((q|0)<(c[l>>2]|0))}g=g+1|0}while((g|0)<(c[k>>2]|0))}g=b+284|0;if((c[g>>2]|0)>0){l=b+280|0;k=b+396|0;j=b+544|0;h=b+332|0;m=0;do{r=c[k>>2]|0;p=r+(c[(c[l>>2]|0)+(m<<2)>>2]>>1<<3)|0;q=c[p>>2]|0;do if((q|0)!=-1){t=c[j>>2]|0;s=t+(q<<2)|0;o=(c[s>>2]&16|0)==0;if(o){u=c[t+(q+1<<2)>>2]|0;n=u>>1;u=(d[(c[h>>2]|0)+n>>0]|0)^u&1;w=a[528]|0;v=w&255;if(!((u&255)<<24>>24==w<<24>>24&(v>>>1^1)|v&2&u))break;w=c[r+(n<<3)>>2]|0;if(!((w|0)!=-1&(w|0)==(q|0)))break;if(o){w=wc(e,s)|0;c[p>>2]=w;c[s>>2]=c[s>>2]|16;c[t+(q+1<<2)>>2]=w;break}}c[p>>2]=c[t+(q+1<<2)>>2]}while(0);m=m+1|0}while((m|0)<(c[g>>2]|0))}g=b+272|0;n=c[g>>2]|0;if((n|0)>0){j=b+268|0;h=b+544|0;m=c[j>>2]|0;k=0;l=0;do{p=m+(k<<2)|0;o=c[p>>2]|0;r=c[h>>2]|0;q=r+(o<<2)|0;s=c[q>>2]|0;if((s&3|0)!=1){if(!(s&16)){n=wc(e,q)|0;c[p>>2]=n;c[q>>2]=c[q>>2]|16;c[r+(o+1<<2)>>2]=n;n=c[j>>2]|0;m=n;n=c[n+(k<<2)>>2]|0}else{n=c[r+(o+1<<2)>>2]|0;c[p>>2]=n}c[m+(l<<2)>>2]=n;n=c[g>>2]|0;l=l+1|0}k=k+1|0}while((k|0)<(n|0))}else{k=0;l=0}h=k-l|0;if((h|0)>0)c[g>>2]=n-h;g=b+260|0;m=c[g>>2]|0;if((m|0)>0){h=b+256|0;b=b+544|0;l=c[h>>2]|0;j=0;k=0;do{n=l+(j<<2)|0;p=c[n>>2]|0;o=c[b>>2]|0;r=o+(p<<2)|0;q=c[r>>2]|0;if((q&3|0)!=1){if(!(q&16)){m=wc(e,r)|0;c[n>>2]=m;c[r>>2]=c[r>>2]|16;c[o+(p+1<<2)>>2]=m;m=c[h>>2]|0;l=m;m=c[m+(j<<2)>>2]|0}else{m=c[o+(p+1<<2)>>2]|0;c[n>>2]=m}c[l+(k<<2)>>2]=m;m=c[g>>2]|0;k=k+1|0}j=j+1|0}while((j|0)<(m|0))}else{j=0;k=0}e=j-k|0;if((e|0)<=0){i=f;return}c[g>>2]=m-e;i=f;return}function bc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;g=i;i=i+32|0;j=g;d=g+8|0;e=b+548|0;f=b+556|0;h=(c[e>>2]|0)-(c[f>>2]|0)|0;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;gc(d,h);h=d+16|0;a[h>>0]=0;ac(b,d);if((c[b+44>>2]|0)>1){k=c[d+4>>2]<<2;c[j>>2]=c[e>>2]<<2;c[j+4>>2]=k;La(1888,j|0)|0}a[b+560>>0]=a[h>>0]|0;h=b+544|0;j=c[h>>2]|0;if(j)Td(j);c[h>>2]=c[d>>2];c[e>>2]=c[d+4>>2];c[b+552>>2]=c[d+8>>2];c[f>>2]=c[d+12>>2];i=g;return}function cc(){var d=0,e=0,f=0;d=i;i=i+16|0;e=d;a[528]=0;a[536]=1;a[544]=2;xb(552,608,624,2136,2144);c[138]=2168;h[72]=0.0;h[73]=1.0;a[592]=0;a[593]=0;b[297]=b[e+0>>1]|0;b[298]=b[e+2>>1]|0;b[299]=b[e+4>>1]|0;h[75]=.95;xb(664,720,736,2136,2144);c[166]=2168;h[86]=0.0;h[87]=1.0;a[704]=0;a[705]=0;b[353]=b[e+0>>1]|0;b[354]=b[e+2>>1]|0;b[355]=b[e+4>>1]|0;h[89]=.999;xb(776,832,848,2136,2144);c[194]=2168;h[100]=0.0;h[101]=1.0;a[816]=1;a[817]=1;b[409]=b[e+0>>1]|0;b[410]=b[e+2>>1]|0;b[411]=b[e+4>>1]|0;h[103]=0.0;xb(936,992,1008,2136,2144);c[234]=2168;h[120]=0.0;h[121]=v;a[976]=0;a[977]=0;b[489]=b[e+0>>1]|0;b[490]=b[e+2>>1]|0;b[491]=b[e+4>>1]|0;h[123]=91648253.0;xb(1048,1080,1096,2136,2016);c[262]=280;f=1068|0;c[f>>2]=0;c[f+4>>2]=2;c[269]=2;xb(1160,1192,1208,2136,2016);c[290]=280;f=1180|0;c[f>>2]=0;c[f+4>>2]=2;c[297]=2;xb(1272,1296,1312,2136,1992);c[318]=160;a[1292]=0;xb(1344,1368,1376,2136,1992);c[336]=160;a[1364]=1;xb(1408,1440,1448,2136,2016);c[352]=280;f=1428|0;c[f>>2]=1;c[f+4>>2]=2147483647;c[359]=100;xb(1480,1536,1544,2136,2144);c[370]=2168;h[188]=1.0;h[189]=v;a[1520]=0;a[1521]=0;b[761]=b[e+0>>1]|0;b[762]=b[e+2>>1]|0;b[763]=b[e+4>>1]|0;h[191]=2.0;xb(1584,1640,1648,2136,2144);c[396]=2168;h[201]=0.0;h[202]=v;a[1624]=0;a[1625]=0;b[813]=b[e+0>>1]|0;b[814]=b[e+2>>1]|0;b[815]=b[e+4>>1]|0;h[204]=.2;xb(1728,1760,1776,2136,2016);c[432]=280;e=1748|0;c[e>>2]=0;c[e+4>>2]=2147483647;c[439]=0;i=d;return}function dc(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function ec(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0.0,r=0.0;e=i;i=i+16|0;j=e;g=e+8|0;if((a[d>>0]|0)!=45){o=0;i=e;return o|0}m=d+1|0;f=b+4|0;k=c[f>>2]|0;l=a[k>>0]|0;a:do if(l<<24>>24){n=0;while(1){o=n;n=n+1|0;if((a[m>>0]|0)!=l<<24>>24){b=0;break}l=a[k+n>>0]|0;m=d+(o+2)|0;if(!(l<<24>>24))break a}i=e;return b|0}while(0);if((a[m>>0]|0)!=61){o=0;i=e;return o|0}k=m+1|0;q=+ce(k,g);if(!(c[g>>2]|0)){o=0;i=e;return o|0}r=+h[b+32>>3];if(q>=r?(a[b+41>>0]|0)==0|q!=r:0){o=c[p>>2]|0;n=c[f>>2]|0;c[j>>2]=k;c[j+4>>2]=n;Za(o|0,2024,j|0)|0;ab(1)}r=+h[b+24>>3];if(q<=r?(a[b+40>>0]|0)==0|q!=r:0){o=c[p>>2]|0;n=c[f>>2]|0;c[j>>2]=k;c[j+4>>2]=n;Za(o|0,2080,j|0)|0;ab(1)}h[b+48>>3]=q;o=1;i=e;return o|0}function fc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,j=0,l=0.0,m=0,n=0.0,o=0.0,q=0;e=i;i=i+48|0;f=e;g=c[p>>2]|0;q=c[b+16>>2]|0;m=(a[b+40>>0]|0)!=0?91:40;o=+h[b+24>>3];n=+h[b+32>>3];j=(a[b+41>>0]|0)!=0?93:41;l=+h[b+48>>3];c[f>>2]=c[b+4>>2];c[f+4>>2]=q;c[f+8>>2]=m;m=f+12|0;h[k>>3]=o;c[m>>2]=c[k>>2];c[m+4>>2]=c[k+4>>2];m=f+20|0;h[k>>3]=n;c[m>>2]=c[k>>2];c[m+4>>2]=c[k+4>>2];c[f+28>>2]=j;j=f+32|0;h[k>>3]=l;c[j>>2]=c[k>>2];c[j+4>>2]=c[k+4>>2];Za(g|0,2232,f|0)|0;if(!d){i=e;return}c[f>>2]=c[b+8>>2];Za(g|0,2e3,f|0)|0;Sa(10,g|0)|0;i=e;return}function gc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;e=a+8|0;f=c[e>>2]|0;if(f>>>0<b>>>0)h=f;else{i=d;return}while(1){if(h>>>0>=b>>>0)break;h=((h>>>3)+2+(h>>>1)&-2)+h|0;c[e>>2]=h;if(h>>>0<=f>>>0){g=4;break}}if((g|0)==4)Ta(va(1)|0,48,0);e=Ud(c[a>>2]|0,h<<2)|0;if((e|0)==0?(c[(Oa()|0)>>2]|0)==12:0)Ta(va(1)|0,48,0);c[a>>2]=e;i=d;return}function hc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;e=a+32|0;d=c[e>>2]|0;if(d){c[a+36>>2]=0;Td(d);c[e>>2]=0;c[a+40>>2]=0}e=a+16|0;d=c[e>>2]|0;if(d){c[a+20>>2]=0;Td(d);c[e>>2]=0;c[a+24>>2]=0}e=c[a>>2]|0;if(!e){i=b;return}d=a+4|0;g=c[d>>2]|0;if((g|0)>0){f=0;do{j=e+(f*12|0)|0;h=c[j>>2]|0;if(h){c[e+(f*12|0)+4>>2]=0;Td(h);c[j>>2]=0;c[e+(f*12|0)+8>>2]=0;e=c[a>>2]|0;g=c[d>>2]|0}f=f+1|0}while((f|0)<(g|0))}c[d>>2]=0;Td(e);c[a>>2]=0;c[a+8>>2]=0;i=b;return}function ic(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;i=i+16|0;e=f+4|0;d=f;l=c[b>>2]|0;h=l+1|0;g=a+4|0;if((c[g>>2]|0)<(h|0)){k=a+8|0;j=c[k>>2]|0;if((j|0)<(h|0)){m=l+2-j&-2;l=(j>>1)+2&-2;l=(m|0)>(l|0)?m:l;if((l|0)>(2147483647-j|0)){m=va(1)|0;Ta(m|0,48,0)}n=c[a>>2]|0;m=l+j|0;c[k>>2]=m;m=Ud(n,m*12|0)|0;c[a>>2]=m;if((m|0)==0?(c[(Oa()|0)>>2]|0)==12:0){n=va(1)|0;Ta(n|0,48,0)}}k=c[g>>2]|0;if((k|0)<(h|0)){j=c[a>>2]|0;do{l=j+(k*12|0)|0;if(l){c[l>>2]=0;c[j+(k*12|0)+4>>2]=0;c[j+(k*12|0)+8>>2]=0}k=k+1|0}while((k|0)!=(h|0))}c[g>>2]=h;l=c[b>>2]|0}g=c[a>>2]|0;if(!(c[g+(l*12|0)>>2]|0)){m=l;n=a+16|0;c[d>>2]=m;c[e+0>>2]=c[d+0>>2];sc(n,e,0);i=f;return}c[g+(l*12|0)+4>>2]=0;m=c[b>>2]|0;n=a+16|0;c[d>>2]=m;c[e+0>>2]=c[d+0>>2];sc(n,e,0);i=f;return}function jc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;f=i;e=b+4|0;if((c[e>>2]|0)>=(d|0)){i=f;return}h=b+8|0;g=c[h>>2]|0;if((g|0)<(d|0)){k=d+1-g&-2;j=(g>>1)+2&-2;j=(k|0)>(j|0)?k:j;if((j|0)>(2147483647-g|0)){k=va(1)|0;Ta(k|0,48,0)}l=c[b>>2]|0;k=j+g|0;c[h>>2]=k;k=Ud(l,k)|0;c[b>>2]=k;if((k|0)==0?(c[(Oa()|0)>>2]|0)==12:0){l=va(1)|0;Ta(l|0,48,0)}}g=c[e>>2]|0;if((g|0)<(d|0)){b=c[b>>2]|0;do{h=b+g|0;if(h)a[h>>0]=0;g=g+1|0}while((g|0)!=(d|0))}c[e>>2]=d;i=f;return}function kc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;h=i;g=d+1|0;f=b+4|0;if((c[f>>2]|0)>=(g|0)){l=c[b>>2]|0;l=l+d|0;a[l>>0]=e;i=h;return}k=b+8|0;j=c[k>>2]|0;if((j|0)<(g|0)){m=d+2-j&-2;l=(j>>1)+2&-2;l=(m|0)>(l|0)?m:l;if((l|0)>(2147483647-j|0)){m=va(1)|0;Ta(m|0,48,0)}n=c[b>>2]|0;m=l+j|0;c[k>>2]=m;m=Ud(n,m)|0;c[b>>2]=m;if((m|0)==0?(c[(Oa()|0)>>2]|0)==12:0){n=va(1)|0;Ta(n|0,48,0)}}j=c[f>>2]|0;if((j|0)<(g|0))do{k=(c[b>>2]|0)+j|0;if(k)a[k>>0]=0;j=j+1|0}while((j|0)!=(g|0));c[f>>2]=g;n=c[b>>2]|0;n=n+d|0;a[n>>0]=e;i=h;return}function lc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;i=i+16|0;g=d;c[g>>2]=b;j=a+12|0;f=b+1|0;e=a+16|0;if((c[e>>2]|0)<(f|0)){l=a+20|0;k=c[l>>2]|0;if((k|0)<(f|0)){n=b+2-k&-2;m=(k>>1)+2&-2;m=(n|0)>(m|0)?n:m;if((m|0)>(2147483647-k|0)){n=va(1)|0;Ta(n|0,48,0)}o=c[j>>2]|0;n=m+k|0;c[l>>2]=n;n=Ud(o,n<<2)|0;c[j>>2]=n;if((n|0)==0?(c[(Oa()|0)>>2]|0)==12:0){o=va(1)|0;Ta(o|0,48,0)}}k=c[e>>2]|0;if((f|0)>(k|0))ke((c[j>>2]|0)+(k<<2)|0,-1,f-k<<2|0)|0;c[e>>2]=f}c[(c[j>>2]|0)+(b<<2)>>2]=c[a+4>>2];nc(a,g);e=c[j>>2]|0;g=c[e+(b<<2)>>2]|0;b=c[a>>2]|0;f=c[b+(g<<2)>>2]|0;if(!g){n=0;o=b+(n<<2)|0;c[o>>2]=f;o=e+(f<<2)|0;c[o>>2]=n;i=d;return}a=a+28|0;while(1){j=g;g=g+ -1>>1;k=b+(g<<2)|0;l=c[k>>2]|0;o=c[c[a>>2]>>2]|0;if(!(+h[o+(f<<3)>>3]>+h[o+(l<<3)>>3])){a=14;break}c[b+(j<<2)>>2]=l;c[e+(c[k>>2]<<2)>>2]=j;if(!g){j=0;a=14;break}}if((a|0)==14){o=b+(j<<2)|0;c[o>>2]=f;o=e+(f<<2)|0;c[o>>2]=j;i=d;return}}function mc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=a+4|0;f=c[e>>2]|0;g=a+8|0;h=c[g>>2]|0;if((f|0)==(h|0)&(h|0)<(f+1|0)){h=(f>>1)+2&-2;h=(h|0)<2?2:h;if((h|0)>(2147483647-f|0)){h=va(1)|0;Ta(h|0,48,0)}j=c[a>>2]|0;f=h+f|0;c[g>>2]=f;f=Ud(j,f<<2)|0;c[a>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0){j=va(1)|0;Ta(j|0,48,0)}}else f=c[a>>2]|0;j=c[e>>2]|0;c[e>>2]=j+1;e=f+(j<<2)|0;if(!e){i=d;return}c[e>>2]=c[b>>2];i=d;return}function nc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=a+4|0;f=c[e>>2]|0;g=a+8|0;h=c[g>>2]|0;if((f|0)==(h|0)&(h|0)<(f+1|0)){h=(f>>1)+2&-2;h=(h|0)<2?2:h;if((h|0)>(2147483647-f|0)){h=va(1)|0;Ta(h|0,48,0)}j=c[a>>2]|0;f=h+f|0;c[g>>2]=f;f=Ud(j,f<<2)|0;c[a>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0){j=va(1)|0;Ta(j|0,48,0)}}else f=c[a>>2]|0;j=c[e>>2]|0;c[e>>2]=j+1;e=f+(j<<2)|0;if(!e){i=d;return}c[e>>2]=c[b>>2];i=d;return}function oc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=i;i=i+16|0;f=e+2|0;h=e+1|0;g=e;if((d|0)<16){g=d+ -1|0;if((g|0)>0)h=0;else{i=e;return}do{f=h;h=h+1|0;if((h|0)<(d|0)){k=f;j=h;do{k=(c[b+(j<<2)>>2]|0)<(c[b+(k<<2)>>2]|0)?j:k;j=j+1|0}while((j|0)!=(d|0))}else k=f;n=b+(f<<2)|0;o=c[n>>2]|0;p=b+(k<<2)|0;c[n>>2]=c[p>>2];c[p>>2]=o}while((h|0)!=(g|0));i=e;return}j=c[b+(((d|0)/2|0)<<2)>>2]|0;m=-1;n=d;while(1){do{m=m+1|0;l=b+(m<<2)|0;k=c[l>>2]|0}while((k|0)<(j|0));do{n=n+ -1|0;o=b+(n<<2)|0;p=c[o>>2]|0}while((j|0)<(p|0));if((m|0)>=(n|0))break;c[l>>2]=p;c[o>>2]=k}a[f+0>>0]=a[h+0>>0]|0;oc(b,m,f);p=d-m|0;a[f+0>>0]=a[g+0>>0]|0;oc(l,p,f);i=e;return}function pc(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0;f=i;k=e&1;j=d[a+16>>0]|0|k;h=b+4|0;l=((j+(c[h>>2]|0)<<2)+4|0)>>>2;m=a+4|0;gc(a,l+(c[m>>2]|0)|0);e=c[m>>2]|0;l=l+e|0;c[m>>2]=l;if(l>>>0<e>>>0)Ta(va(1)|0,48,0);a=(c[a>>2]|0)+(e<<2)|0;if(!a){i=f;return e|0}j=j<<3|k<<2;c[a>>2]=c[a>>2]&-32|j;j=c[h>>2]<<5|j;c[a>>2]=j;if((c[h>>2]|0)>0){j=c[b>>2]|0;b=0;do{c[a+(b<<2)+4>>2]=c[j+(b<<2)>>2];b=b+1|0}while((b|0)<(c[h>>2]|0));j=c[a>>2]|0}if(!(j&8)){i=f;return e|0}h=j>>>5;if(j&4){g[a+(h<<2)+4>>2]=0.0;i=f;return e|0}if(!h){h=0;j=0}else{j=0;b=0;do{j=1<<((c[a+(b<<2)+4>>2]|0)>>>1&31)|j;b=b+1|0}while((b|0)<(h|0))}c[a+(h<<2)+4>>2]=j;i=f;return e|0}function qc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=a+4|0;f=c[e>>2]|0;g=a+8|0;h=c[g>>2]|0;if((f|0)==(h|0)&(h|0)<(f+1|0)){h=(f>>1)+2&-2;h=(h|0)<2?2:h;if((h|0)>(2147483647-f|0)){h=va(1)|0;Ta(h|0,48,0)}j=c[a>>2]|0;f=h+f|0;c[g>>2]=f;f=Ud(j,f<<3)|0;c[a>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0){j=va(1)|0;Ta(j|0,48,0)}}else f=c[a>>2]|0;j=c[e>>2]|0;c[e>>2]=j+1;e=f+(j<<3)|0;if(!e){i=d;return}g=b;h=c[g+4>>2]|0;j=e;c[j>>2]=c[g>>2];c[j+4>>2]=h;i=d;return}function rc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0.0,s=0;b=i;d=c[a>>2]|0;f=c[d>>2]|0;k=a+4|0;o=c[d+((c[k>>2]|0)+ -1<<2)>>2]|0;c[d>>2]=o;e=c[a+12>>2]|0;c[e+(o<<2)>>2]=0;c[e+(f<<2)>>2]=-1;o=(c[k>>2]|0)+ -1|0;c[k>>2]=o;if((o|0)<=1){i=b;return f|0}g=c[d>>2]|0;l=a+28|0;a=0;m=1;while(1){n=(a<<1)+2|0;if((n|0)<(o|0)){p=c[d+(n<<2)>>2]|0;s=c[d+(m<<2)>>2]|0;o=c[c[l>>2]>>2]|0;q=+h[o+(p<<3)>>3];r=+h[o+(s<<3)>>3];if(!(q>r)){p=s;q=r;j=6}}else{o=c[c[l>>2]>>2]|0;j=c[d+(m<<2)>>2]|0;p=j;q=+h[o+(j<<3)>>3];j=6}if((j|0)==6){j=0;n=m}if(!(q>+h[o+(g<<3)>>3]))break;c[d+(a<<2)>>2]=p;c[e+(p<<2)>>2]=a;m=n<<1|1;o=c[k>>2]|0;if((m|0)>=(o|0)){a=n;break}else a=n}c[d+(a<<2)>>2]=g;c[e+(g<<2)>>2]=a;i=b;return f|0}function sc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;k=c[d>>2]|0;d=k+1|0;g=b+4|0;if((c[g>>2]|0)>=(d|0)){i=f;return}j=b+8|0;h=c[j>>2]|0;if((h|0)<(d|0)){l=k+2-h&-2;k=(h>>1)+2&-2;k=(l|0)>(k|0)?l:k;if((k|0)>(2147483647-h|0)){l=va(1)|0;Ta(l|0,48,0)}m=c[b>>2]|0;l=k+h|0;c[j>>2]=l;l=Ud(m,l)|0;c[b>>2]=l;if((l|0)==0?(c[(Oa()|0)>>2]|0)==12:0){m=va(1)|0;Ta(m|0,48,0)}}h=c[g>>2]|0;if((h|0)<(d|0))do{a[(c[b>>2]|0)+h>>0]=e;h=h+1|0}while((h|0)!=(d|0));c[g>>2]=d;i=f;return}function tc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;e=i;i=i+16|0;h=e+8|0;f=e+4|0;j=e;if((b|0)<16){f=b+ -1|0;if((f|0)<=0){i=e;return}h=c[d>>2]|0;d=0;do{j=d;d=d+1|0;if((d|0)<(b|0)){k=c[h>>2]|0;m=j;l=d;do{n=k+(c[a+(l<<2)>>2]<<2)|0;u=c[n>>2]|0;q=u>>>5;if(u>>>0>95){o=k+(c[a+(m<<2)>>2]<<2)|0;p=(c[o>>2]|0)>>>5;if((p|0)==2)m=l;else m=+g[n+(q<<2)+4>>2]<+g[o+(p<<2)+4>>2]?l:m}l=l+1|0}while((l|0)!=(b|0))}else m=j;s=a+(j<<2)|0;t=c[s>>2]|0;u=a+(m<<2)|0;c[s>>2]=c[u>>2];c[u>>2]=t}while((d|0)!=(f|0));i=e;return}k=c[a+(((b|0)/2|0)<<2)>>2]|0;q=-1;o=b;while(1){t=q+1|0;p=a+(t<<2)|0;u=c[p>>2]|0;l=c[d>>2]|0;m=c[l>>2]|0;s=m+(u<<2)|0;r=c[s>>2]|0;q=m+(k<<2)|0;n=c[q>>2]|0;a:do if(r>>>0>95)while(1){v=n>>>5;if((v|0)!=2?!(+g[s+(r>>>5<<2)+4>>2]<+g[q+(v<<2)+4>>2]):0){q=t;break a}t=t+1|0;p=a+(t<<2)|0;u=c[p>>2]|0;s=m+(u<<2)|0;r=c[s>>2]|0;if(r>>>0<=95){q=t;break}}else q=t;while(0);o=o+ -1|0;s=a+(o<<2)|0;r=m+(k<<2)|0;b:do if(n>>>0>95)while(1){t=m+(c[s>>2]<<2)|0;v=(c[t>>2]|0)>>>5;if((v|0)!=2?!(+g[r+(n>>>5<<2)+4>>2]<+g[t+(v<<2)+4>>2]):0)break b;v=o+ -1|0;s=a+(v<<2)|0;o=v}while(0);if((q|0)>=(o|0))break;c[p>>2]=c[s>>2];c[s>>2]=u}c[f>>2]=l;c[h+0>>2]=c[f+0>>2];tc(a,q,h);v=b-q|0;c[j>>2]=l;c[h+0>>2]=c[j+0>>2];tc(p,v,h);i=e;return}function uc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0.0,s=0;e=i;f=a+4|0;j=c[f>>2]|0;g=c[a>>2]|0;if((j|0)>0){l=c[a+12>>2]|0;k=0;do{c[l+(c[g+(k<<2)>>2]<<2)>>2]=-1;k=k+1|0;j=c[f>>2]|0}while((k|0)<(j|0))}if(g){c[f>>2]=0;j=0}g=b+4|0;if((c[g>>2]|0)>0){k=a+12|0;j=0;do{s=(c[b>>2]|0)+(j<<2)|0;c[(c[k>>2]|0)+(c[s>>2]<<2)>>2]=j;nc(a,s);j=j+1|0}while((j|0)<(c[g>>2]|0));j=c[f>>2]|0}if((j|0)<=1){i=e;return}g=c[a>>2]|0;b=a+28|0;a=a+12|0;o=j;k=(j|0)/2|0;while(1){k=k+ -1|0;j=c[g+(k<<2)>>2]|0;m=k<<1|1;a:do if((m|0)<(o|0)){l=k;while(1){n=(l<<1)+2|0;if((n|0)<(o|0)){p=c[g+(n<<2)>>2]|0;s=c[g+(m<<2)>>2]|0;o=c[c[b>>2]>>2]|0;q=+h[o+(p<<3)>>3];r=+h[o+(s<<3)>>3];if(!(q>r)){p=s;q=r;d=16}}else{o=c[c[b>>2]>>2]|0;d=c[g+(m<<2)>>2]|0;p=d;q=+h[o+(d<<3)>>3];d=16}if((d|0)==16){d=0;n=m}if(!(q>+h[o+(j<<3)>>3]))break a;c[g+(l<<2)>>2]=p;c[(c[a>>2]|0)+(p<<2)>>2]=l;m=n<<1|1;o=c[f>>2]|0;if((m|0)>=(o|0)){l=n;break}else l=n}}else l=k;while(0);c[g+(l<<2)>>2]=j;c[(c[a>>2]|0)+(j<<2)>>2]=l;if((k|0)<=0)break;o=c[f>>2]|0}i=e;return}function vc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;e=i;d=b+36|0;l=c[d>>2]|0;f=b+32|0;n=c[f>>2]|0;if((l|0)>0){h=b+16|0;g=b+44|0;j=0;do{k=n+(j<<2)|0;m=c[k>>2]|0;if(a[(c[h>>2]|0)+m>>0]|0){n=c[b>>2]|0;l=n+(m*12|0)+4|0;p=c[l>>2]|0;if((p|0)>0){m=n+(m*12|0)|0;n=0;o=0;do{q=c[m>>2]|0;r=q+(n<<3)|0;if((c[(c[c[g>>2]>>2]|0)+(c[r>>2]<<2)>>2]&3|0)!=1){s=r;r=c[s+4>>2]|0;p=q+(o<<3)|0;c[p>>2]=c[s>>2];c[p+4>>2]=r;p=c[l>>2]|0;o=o+1|0}n=n+1|0}while((n|0)<(p|0))}else{n=0;o=0}m=n-o|0;if((m|0)>0)c[l>>2]=p-m;a[(c[h>>2]|0)+(c[k>>2]|0)>>0]=0;l=c[d>>2]|0;n=c[f>>2]|0}j=j+1|0}while((j|0)<(l|0))}if(!n){i=e;return}c[d>>2]=0;i=e;return}function wc(a,b){a=a|0;b=b|0;var e=0,f=0,h=0,j=0,k=0;f=i;j=c[b>>2]|0;h=j>>>2&1|(d[a+16>>0]|0);j=((h+(j>>>5)<<2)+4|0)>>>2;k=a+4|0;gc(a,j+(c[k>>2]|0)|0);e=c[k>>2]|0;j=j+e|0;c[k>>2]=j;if(j>>>0<e>>>0)Ta(va(1)|0,48,0);a=(c[a>>2]|0)+(e<<2)|0;if(!a){i=f;return e|0}h=c[b>>2]&-9|h<<3;c[a>>2]=h;if((c[b>>2]|0)>>>0>31){h=0;do{c[a+(h<<2)+4>>2]=c[b+(h<<2)+4>>2];h=h+1|0}while((h|0)<((c[b>>2]|0)>>>5|0));h=c[a>>2]|0}if(!(h&8)){i=f;return e|0}j=h>>>5;b=b+(j<<2)+4|0;if(!(h&4)){c[a+(j<<2)+4>>2]=c[b>>2];i=f;return e|0}else{g[a+(j<<2)+4>>2]=+g[b>>2];i=f;return e|0}return 0}function xc(b){b=b|0;var d=0,e=0,f=0,g=0,j=0,k=0;d=i;i=i+16|0;g=d;Gb(b);c[b>>2]=3424;c[b+684>>2]=c[719];c[b+688>>2]=c[747];c[b+692>>2]=c[785];h[b+696>>3]=+h[411];a[b+704>>0]=a[2652]|0;a[b+705>>0]=a[2724]|0;a[b+706>>0]=a[2804]|0;a[b+707>>0]=1;c[b+708>>2]=0;c[b+712>>2]=0;c[b+716>>2]=0;c[b+720>>2]=1;a[b+724>>0]=1;e=b+732|0;k=b+544|0;c[b+760>>2]=0;c[b+764>>2]=0;c[b+768>>2]=0;c[b+776>>2]=0;c[b+780>>2]=0;c[b+784>>2]=0;c[b+792>>2]=0;c[b+796>>2]=0;c[b+800>>2]=0;j=b+804|0;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;c[j>>2]=k;j=b+808|0;c[j>>2]=0;c[b+812>>2]=0;c[b+816>>2]=0;e=b+824|0;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;c[b+852>>2]=j;Qc(b+856|0,1);j=b+868|0;e=b+892|0;c[b+920>>2]=0;c[b+924>>2]=0;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;c[j+16>>2]=0;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;e=g+4|0;c[e>>2]=0;j=g+8|0;c[j>>2]=2;f=Ud(0,8)|0;c[g>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0)Ta(va(1)|0,48,0);c[f>>2]=-2;c[e>>2]=1;a[b+560>>0]=1;c[b+928>>2]=pc(k,g,0)|0;a[b+536>>0]=0;if(!f){i=d;return}c[e>>2]=0;Td(f);c[g>>2]=0;c[j>>2]=0;i=d;return}function yc(a){a=a|0;var b=0;b=i;zc(a);pd(a);i=b;return}function zc(a){a=a|0;var b=0,d=0,e=0;b=i;c[a>>2]=3424;d=a+904|0;e=c[d>>2]|0;if(e){c[a+908>>2]=0;Td(e);c[d>>2]=0;c[a+912>>2]=0}d=a+892|0;e=c[d>>2]|0;if(e){c[a+896>>2]=0;Td(e);c[d>>2]=0;c[a+900>>2]=0}d=a+876|0;e=c[d>>2]|0;if(e){c[a+880>>2]=0;Td(e);c[d>>2]=0;c[a+884>>2]=0}d=a+856|0;e=c[d>>2]|0;if(e){c[a+860>>2]=0;Td(e);c[d>>2]=0;c[a+864>>2]=0}e=a+836|0;d=c[e>>2]|0;if(d){c[a+840>>2]=0;Td(d);c[e>>2]=0;c[a+844>>2]=0}d=a+824|0;e=c[d>>2]|0;if(e){c[a+828>>2]=0;Td(e);c[d>>2]=0;c[a+832>>2]=0}d=a+808|0;e=c[d>>2]|0;if(e){c[a+812>>2]=0;Td(e);c[d>>2]=0;c[a+816>>2]=0}Rc(a+760|0);d=a+744|0;e=c[d>>2]|0;if(e){c[a+748>>2]=0;Td(e);c[d>>2]=0;c[a+752>>2]=0}d=a+732|0;e=c[d>>2]|0;if(!e){Ib(a);i=b;return}c[a+736>>2]=0;Td(e);c[d>>2]=0;c[a+740>>2]=0;Ib(a);i=b;return}function Ac(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+32|0;h=f+12|0;k=f+8|0;l=f+16|0;g=f+4|0;j=f;a[l>>0]=a[d>>0]|0;a[h+0>>0]=a[l+0>>0]|0;e=Jb(b,h,e)|0;c[k>>2]=e;kc(b+876|0,e,0);kc(b+904|0,e,0);if(!(a[b+724>>0]|0)){i=f;return e|0}l=b+808|0;d=e<<1;c[g>>2]=d;c[h+0>>2]=c[g+0>>2];Sc(l,h,0);c[j>>2]=d|1;c[h+0>>2]=c[j+0>>2];Sc(l,h,0);Tc(b+760|0,k);kc(b+744|0,e,0);Uc(b+824|0,e);i=f;return e|0}function Bc(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;k=i;i=i+32|0;h=k+4|0;r=k;p=k+16|0;c[h>>2]=0;j=h+4|0;c[j>>2]=0;l=h+8|0;c[l>>2]=0;s=a[2608]|0;a[b>>0]=s;m=e+724|0;f=(d[m>>0]&(f&1)|0)!=0;if(f){u=e+308|0;x=c[u>>2]|0;if((x|0)>0){t=e+304|0;s=e+876|0;v=0;do{w=c[(c[t>>2]|0)+(v<<2)>>2]>>1;c[r>>2]=w;w=(c[s>>2]|0)+w|0;if(!(a[w>>0]|0)){a[w>>0]=1;nc(h,r);x=c[u>>2]|0}v=v+1|0}while((v|0)<(x|0))}r=(Cc(e,g)|0)&1^1;a[b>>0]=r;g=a[2608]|0}else{g=s;r=s}x=g&255;if(!((x>>>1^1)&r<<24>>24==g<<24>>24|x&2&(r&255))){if((c[e+44>>2]|0)>0)Ka(3760)|0}else{$b(p,e);r=a[p>>0]|0;a[b>>0]=r}w=a[2608]|0;x=w&255;if((((x>>>1^1)&r<<24>>24==w<<24>>24|x&2&(r&255)|0)!=0?(a[e+707>>0]|0)!=0:0)?(q=(c[e+736>>2]|0)+ -1|0,(q|0)>0):0){b=e+732|0;p=e+4|0;do{g=c[b>>2]|0;u=c[g+(q<<2)>>2]|0;v=q+ -1|0;w=c[g+(v<<2)>>2]|0;q=c[p>>2]|0;a:do if((u|0)>1){s=a[2616]|0;r=s&255;t=r&2;r=r>>>1^1;x=v;while(1){w=d[q+(w>>1)>>0]^w&1;v=u+ -1|0;if(!((w&255)<<24>>24==s<<24>>24&r|t&w))break a;u=x+ -1|0;w=c[g+(u<<2)>>2]|0;if((v|0)>1){x=u;u=v}else{x=u;u=v;o=20;break}}}else{x=v;o=20}while(0);if((o|0)==20){o=0;a[q+(w>>1)>>0]=(w&1^1)&255^1}q=x-u|0}while((q|0)>0)}if(f?(n=c[j>>2]|0,(n|0)>0):0){o=c[h>>2]|0;f=e+876|0;p=0;do{b=c[o+(p<<2)>>2]|0;a[(c[f>>2]|0)+b>>0]=0;if(a[m>>0]|0)Vc(e,b);p=p+1|0}while((p|0)<(n|0))}e=c[h>>2]|0;if(!e){i=k;return}c[j>>2]=0;Td(e);c[h>>2]=0;c[l>>2]=0;i=k;return}function Cc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;m=i;i=i+16|0;j=m;if(!(Zb(b)|0)){H=0;i=m;return H|0}l=b+724|0;if(!(a[l>>0]|0)){H=1;i=m;return H|0}x=b+924|0;v=b+872|0;w=b+868|0;u=b+860|0;r=b+680|0;y=b+824|0;g=b+828|0;o=b+836|0;z=b+904|0;A=b+332|0;e=b+44|0;B=b+704|0;D=b+706|0;E=b+696|0;p=b+556|0;q=b+548|0;C=b+876|0;s=b+920|0;t=b+284|0;a:while(1){if(((c[x>>2]|0)<=0?(c[s>>2]|0)>=(c[t>>2]|0):0)?(c[g>>2]|0)<=0:0)break;Ic(b);G=c[v>>2]|0;H=c[w>>2]|0;F=G-H|0;if((G|0)<(H|0))F=(c[u>>2]|0)+F|0;if(!((F|0)<=0?(c[s>>2]|0)>=(c[t>>2]|0):0))n=11;if((n|0)==11?(n=0,!(Jc(b,1)|0)):0){n=12;break}H=c[g>>2]|0;if(a[r>>0]|0){n=15;break}if(!H)continue;else F=0;while(1){J=c[y>>2]|0;G=c[J>>2]|0;I=c[J+(H+ -1<<2)>>2]|0;c[J>>2]=I;H=c[o>>2]|0;c[H+(I<<2)>>2]=0;c[H+(G<<2)>>2]=-1;H=(c[g>>2]|0)+ -1|0;c[g>>2]=H;if((H|0)>1)Wc(y,0);if(a[r>>0]|0)continue a;if((a[(c[z>>2]|0)+G>>0]|0)==0?(I=a[(c[A>>2]|0)+G>>0]|0,H=a[2624]|0,J=H&255,((J>>>1^1)&I<<24>>24==H<<24>>24|I&2&J|0)!=0):0){if((c[e>>2]|0)>1&((F|0)%100|0|0)==0){c[j>>2]=c[g>>2];La(3504,j|0)|0}if(a[B>>0]|0){J=(c[C>>2]|0)+G|0;H=a[J>>0]|0;a[J>>0]=1;if(!(Lc(b,G)|0)){n=29;break a}a[(c[C>>2]|0)+G>>0]=H<<24>>24!=0&1}if((((a[D>>0]|0)!=0?(I=a[(c[A>>2]|0)+G>>0]|0,H=a[2624]|0,J=H&255,((J>>>1^1)&I<<24>>24==H<<24>>24|I&2&J|0)!=0):0)?(a[(c[C>>2]|0)+G>>0]|0)==0:0)?!(Mc(b,G)|0):0){n=35;break a}if(+((c[p>>2]|0)>>>0)>+h[E>>3]*+((c[q>>2]|0)>>>0))gb[c[(c[b>>2]|0)+8>>2]&31](b)}H=c[g>>2]|0;if(!H)continue a;else F=F+1|0}}do if((n|0)==12)a[b+492>>0]=0;else if((n|0)==15){r=c[b+824>>2]|0;if((H|0)<=0){if(!r)break}else{t=c[o>>2]|0;s=0;do{c[t+(c[r+(s<<2)>>2]<<2)>>2]=-1;s=s+1|0}while((s|0)<(c[g>>2]|0))}c[g>>2]=0}else if((n|0)==29)a[b+492>>0]=0;else if((n|0)==35)a[b+492>>0]=0;while(0);if(!d){if(+((c[p>>2]|0)>>>0)>+h[b+96>>3]*+((c[q>>2]|0)>>>0))gb[c[(c[b>>2]|0)+8>>2]&31](b)}else{d=b+744|0;p=c[d>>2]|0;if(p){c[b+748>>2]=0;Td(p);c[d>>2]=0;c[b+752>>2]=0}Xc(b+760|0,1);d=b+808|0;p=c[d>>2]|0;if(p){c[b+812>>2]=0;Td(p);c[d>>2]=0;c[b+816>>2]=0}p=b+824|0;d=c[p>>2]|0;if((c[g>>2]|0)<=0){if(d)n=48}else{n=c[o>>2]|0;o=0;do{c[n+(c[d+(o<<2)>>2]<<2)>>2]=-1;o=o+1|0}while((o|0)<(c[g>>2]|0));n=48}if((n|0)==48){c[g>>2]=0;Td(d);c[p>>2]=0;c[b+832>>2]=0}Yc(b+856|0,1);a[l>>0]=0;a[b+536>>0]=1;a[b+560>>0]=0;c[b+728>>2]=c[b+540>>2];Yb(b);gb[c[(c[b>>2]|0)+8>>2]&31](b)}if((c[e>>2]|0)>0?(f=c[b+736>>2]|0,(f|0)>0):0){h[k>>3]=+(f<<2>>>0)*9.5367431640625e-7;c[j>>2]=c[k>>2];c[j+4>>2]=c[k+4>>2];La(3528,j|0)|0}J=(a[b+492>>0]|0)!=0;i=m;return J|0}function Dc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;e=i;i=i+16|0;g=e;j=b+256|0;k=b+260|0;h=c[k>>2]|0;if((a[b+705>>0]|0)!=0?Ec(b,d)|0:0){p=1;i=e;return p|0}if(!(Kb(b,d)|0)){p=0;i=e;return p|0}if(!(a[b+724>>0]|0)){p=1;i=e;return p|0}d=c[k>>2]|0;if((d|0)!=(h+1|0)){p=1;i=e;return p|0}p=c[(c[j>>2]|0)+(d+ -1<<2)>>2]|0;c[g>>2]=p;m=(c[b+544>>2]|0)+(p<<2)|0;Zc(b+856|0,p);if((c[m>>2]|0)>>>0<=31){p=1;i=e;return p|0}l=b+760|0;k=b+808|0;j=b+744|0;h=b+924|0;d=b+824|0;n=b+840|0;b=b+836|0;o=0;do{p=m+(o<<2)+4|0;_c((c[l>>2]|0)+((c[p>>2]>>1)*12|0)|0,g);q=(c[k>>2]|0)+(c[p>>2]<<2)|0;c[q>>2]=(c[q>>2]|0)+1;a[(c[j>>2]|0)+(c[p>>2]>>1)>>0]=1;c[h>>2]=(c[h>>2]|0)+1;p=c[p>>2]>>1;if((c[n>>2]|0)>(p|0)?(f=c[(c[b>>2]|0)+(p<<2)>>2]|0,(f|0)>-1):0)Wc(d,f);o=o+1|0}while((o|0)<((c[m>>2]|0)>>>5|0));f=1;i=e;return f|0}function Ec(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;k=i;i=i+16|0;h=k+8|0;j=k+4|0;g=k;c[j>>2]=c[b+284>>2];nc(b+292|0,j);j=e+4|0;m=c[j>>2]|0;a:do if((m|0)>0){f=b+332|0;l=0;while(1){n=c[(c[e>>2]|0)+(l<<2)>>2]|0;p=d[(c[f>>2]|0)+(n>>1)>>0]|0;q=p^n&1;o=q&255;s=a[2608]|0;r=s&255;if(o<<24>>24==s<<24>>24&(r>>>1^1)|r&2&q)break;r=a[2616]|0;s=r&255;if(!((s>>>1^1)&o<<24>>24==r<<24>>24|p&2&s)){c[g>>2]=n^1;c[h+0>>2]=c[g+0>>2];Lb(b,h,-1);m=c[j>>2]|0}l=l+1|0;if((l|0)>=(m|0))break a}Rb(b,0);s=1;i=k;return s|0}while(0);s=(Mb(b)|0)!=-1;Rb(b,0);i=k;return s|0}function Fc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;i=i+16|0;g=e;f=(c[b+544>>2]|0)+(d<<2)|0;if(!(a[b+724>>0]|0)){Pb(b,d);i=e;return}if((c[f>>2]|0)>>>0<=31){Pb(b,d);i=e;return}j=b+808|0;k=b+776|0;h=b+792|0;l=0;do{m=f+(l<<2)+4|0;n=(c[j>>2]|0)+(c[m>>2]<<2)|0;c[n>>2]=(c[n>>2]|0)+ -1;Vc(b,c[m>>2]>>1);m=c[m>>2]>>1;c[g>>2]=m;m=(c[k>>2]|0)+m|0;if(!(a[m>>0]|0)){a[m>>0]=1;nc(h,g)}l=l+1|0}while((l|0)<((c[f>>2]|0)>>>5|0));Pb(b,d);i=e;return}function Gc(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;g=i;i=i+16|0;j=g+4|0;h=g;l=c[b+544>>2]|0;k=l+(e<<2)|0;Zc(b+856|0,e);if((c[k>>2]&-32|0)==64){Fc(b,e);p=c[f>>2]|0;f=c[k>>2]|0;a:do if(f>>>0>31){m=f>>>5;n=0;while(1){o=n+1|0;if((c[k+(n<<2)+4>>2]|0)==(p|0)){o=n;break a}if((o|0)<(m|0))n=o;else break}}else{m=0;o=0}while(0);n=m+ -1|0;if((o|0)<(n|0))do{f=o;o=o+1|0;c[k+(f<<2)+4>>2]=c[k+(o<<2)+4>>2];f=c[k>>2]|0;m=f>>>5;n=m+ -1|0}while((o|0)<(n|0));if(f&8){c[k+(n<<2)+4>>2]=c[k+(m<<2)+4>>2];f=c[k>>2]|0}m=f+ -32|0;c[k>>2]=m;m=m>>>5;if(!m){m=0;f=0}else{f=0;n=0;do{f=1<<((c[k+(n<<2)+4>>2]|0)>>>1&31)|f;n=n+1|0}while((n|0)<(m|0))}c[k+(m<<2)+4>>2]=f}else{Ob(b,e,1);f=c[f>>2]|0;n=c[k>>2]|0;b:do if(n>>>0>31){m=n>>>5;o=0;while(1){p=o+1|0;if((c[k+(o<<2)+4>>2]|0)==(f|0)){p=o;break b}if((p|0)<(m|0))o=p;else break}}else{m=0;p=0}while(0);o=m+ -1|0;if((p|0)<(o|0))do{n=p;p=p+1|0;c[k+(n<<2)+4>>2]=c[k+(p<<2)+4>>2];n=c[k>>2]|0;m=n>>>5;o=m+ -1|0}while((p|0)<(o|0));if(n&8){c[k+(o<<2)+4>>2]=c[k+(m<<2)+4>>2];n=c[k>>2]|0}o=n+ -32|0;c[k>>2]=o;o=o>>>5;if(!o){o=0;m=0}else{m=0;n=0;do{m=1<<((c[k+(n<<2)+4>>2]|0)>>>1&31)|m;n=n+1|0}while((n|0)<(o|0))}c[k+(o<<2)+4>>2]=m;Nb(b,e);m=f>>1;n=c[b+760>>2]|0;o=n+(m*12|0)|0;n=n+(m*12|0)+4|0;p=c[n>>2]|0;c:do if((p|0)>0){s=c[o>>2]|0;q=0;while(1){r=q+1|0;if((c[s+(q<<2)>>2]|0)==(e|0))break c;if((r|0)<(p|0))q=r;else{q=r;break}}}else q=0;while(0);p=p+ -1|0;if((q|0)<(p|0)){o=c[o>>2]|0;do{p=q;q=q+1|0;c[o+(p<<2)>>2]=c[o+(q<<2)>>2];p=(c[n>>2]|0)+ -1|0}while((q|0)<(p|0))}c[n>>2]=p;s=(c[b+808>>2]|0)+(f<<2)|0;c[s>>2]=(c[s>>2]|0)+ -1;Vc(b,m)}if((c[k>>2]&-32|0)!=32){s=1;i=g;return s|0}l=c[l+(e+1<<2)>>2]|0;k=d[(c[b+332>>2]|0)+(l>>1)>>0]|0;s=k^l&1;e=s&255;q=a[2624]|0;r=q&255;if(!(e<<24>>24==q<<24>>24&(r>>>1^1)|r&2&s)){r=a[2616]|0;s=r&255;if((s>>>1^1)&e<<24>>24==r<<24>>24|k&2&s){s=0;i=g;return s|0}}else{c[h>>2]=l;c[j+0>>2]=c[h+0>>2];Lb(b,j,-1)}s=(Mb(b)|0)==-1;i=g;return s|0}function Hc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;g=i;i=i+16|0;j=g+4|0;h=g;o=a+708|0;c[o>>2]=(c[o>>2]|0)+1;if(c[f>>2]|0)c[f+4>>2]=0;k=(c[b>>2]|0)>>>5>>>0<(c[d>>2]|0)>>>5>>>0;a=k?d:b;b=k?b:d;k=c[b>>2]|0;a:do if(k>>>0>31){d=0;b:while(1){l=c[b+(d<<2)+4>>2]|0;c:do if((l>>1|0)!=(e|0)){m=c[a>>2]|0;d:do if(m>>>0>31){n=0;while(1){o=c[a+(n<<2)+4>>2]|0;n=n+1|0;if((l^o)>>>0<2)break;if((n|0)>=(m>>>5|0))break d}if((o|0)==(l^1|0)){f=0;break b}else break c}while(0);c[j>>2]=l;mc(f,j);k=c[b>>2]|0}while(0);d=d+1|0;if((d|0)>=(k>>>5|0))break a}i=g;return f|0}while(0);d=c[a>>2]|0;if(d>>>0<=31){o=1;i=g;return o|0}j=0;do{b=c[a+(j<<2)+4>>2]|0;if((b>>1|0)!=(e|0)){c[h>>2]=b;mc(f,h);d=c[a>>2]|0}j=j+1|0}while((j|0)<(d>>>5|0));f=1;i=g;return f|0}function Ic(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;d=i;k=b+924|0;if(!(c[k>>2]|0)){i=d;return}h=b+856|0;e=b+872|0;f=b+868|0;j=b+860|0;g=b+544|0;l=0;while(1){w=c[e>>2]|0;m=c[f>>2]|0;n=w-m|0;if((w|0)<(m|0))n=(c[j>>2]|0)+n|0;if((l|0)>=(n|0))break;n=(c[g>>2]|0)+(c[(c[h>>2]|0)+(((m+l|0)%(c[j>>2]|0)|0)<<2)>>2]<<2)|0;m=c[n>>2]|0;if(!(m&3))c[n>>2]=m&-4|2;l=l+1|0}l=b+540|0;q=c[l>>2]|0;if((q|0)>0){n=b+744|0;o=b+776|0;m=b+760|0;b=b+804|0;p=0;do{if(a[(c[n>>2]|0)+p>>0]|0){r=(c[o>>2]|0)+p|0;if(a[r>>0]|0){s=c[m>>2]|0;q=s+(p*12|0)+4|0;u=c[q>>2]|0;if((u|0)>0){s=c[s+(p*12|0)>>2]|0;v=0;t=0;do{w=c[s+(v<<2)>>2]|0;if((c[(c[c[b>>2]>>2]|0)+(w<<2)>>2]&3|0)!=1){c[s+(t<<2)>>2]=w;u=c[q>>2]|0;t=t+1|0}v=v+1|0}while((v|0)<(u|0))}else{v=0;t=0}s=v-t|0;if((s|0)>0)c[q>>2]=u-s;a[r>>0]=0}r=c[m>>2]|0;q=r+(p*12|0)+4|0;t=c[q>>2]|0;if((t|0)>0){r=r+(p*12|0)|0;s=0;do{u=c[(c[r>>2]|0)+(s<<2)>>2]|0;if(!(c[(c[g>>2]|0)+(u<<2)>>2]&3)){Zc(h,u);t=(c[g>>2]|0)+(c[(c[r>>2]|0)+(s<<2)>>2]<<2)|0;c[t>>2]=c[t>>2]&-4|2;t=c[q>>2]|0}s=s+1|0}while((s|0)<(t|0))}a[(c[n>>2]|0)+p>>0]=0;q=c[l>>2]|0}p=p+1|0}while((p|0)<(q|0));l=0}else l=0;while(1){w=c[e>>2]|0;m=c[f>>2]|0;n=w-m|0;if((w|0)<(m|0))n=(c[j>>2]|0)+n|0;if((l|0)>=(n|0))break;m=(c[g>>2]|0)+(c[(c[h>>2]|0)+(((m+l|0)%(c[j>>2]|0)|0)<<2)>>2]<<2)|0;n=c[m>>2]|0;if((n&3|0)==2)c[m>>2]=n&-4;l=l+1|0}c[k>>2]=0;i=d;return}function Jc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0;e=i;i=i+16|0;m=e;x=e+12|0;g=b+856|0;l=b+872|0;q=b+868|0;j=b+860|0;u=b+680|0;f=b+920|0;h=b+284|0;t=b+280|0;r=b+544|0;s=b+928|0;o=b+44|0;n=b+776|0;v=b+692|0;p=b+804|0;k=b+760|0;C=0;F=0;D=0;a:while(1){E=c[q>>2]|0;do{A=c[l>>2]|0;B=(A|0)<(E|0);A=A-E|0;if(B)G=(c[j>>2]|0)+A|0;else G=A;if((G|0)<=0?(c[f>>2]|0)>=(c[h>>2]|0):0){f=1;j=53;break a}if(a[u>>0]|0){j=8;break a}if(B)A=(c[j>>2]|0)+A|0;if((A|0)==0?(z=c[f>>2]|0,(z|0)<(c[h>>2]|0)):0){c[f>>2]=z+1;c[(c[r>>2]|0)+((c[s>>2]|0)+1<<2)>>2]=c[(c[t>>2]|0)+(z<<2)>>2];A=(c[r>>2]|0)+(c[s>>2]<<2)|0;B=(c[A>>2]|0)>>>5;if(!B){B=0;G=0}else{G=0;E=0;do{G=1<<((c[A+(E<<2)+4>>2]|0)>>>1&31)|G;E=E+1|0}while((E|0)<(B|0))}c[A+(B<<2)+4>>2]=G;Zc(g,c[s>>2]|0);E=c[q>>2]|0}A=c[(c[g>>2]|0)+(E<<2)>>2]|0;E=E+1|0;J=c[j>>2]|0;E=(E|0)==(J|0)?0:E;c[q>>2]=E;G=c[r>>2]|0;B=G+(A<<2)|0;I=c[B>>2]|0}while((I&3|0)!=0);if(d?(c[o>>2]|0)>1:0){H=C+1|0;if(!((C|0)%1e3|0)){I=c[l>>2]|0;c[m>>2]=I-E+((I|0)<(E|0)?J:0);c[m+4>>2]=D;c[m+8>>2]=F;La(3440,m|0)|0;I=c[B>>2]|0;C=H}else C=H}E=G+(A+1<<2)|0;G=c[E>>2]>>1;if(I>>>0>63){H=c[k>>2]|0;I=I>>>5;J=1;do{P=c[B+(J<<2)+4>>2]>>1;G=(c[H+(P*12|0)+4>>2]|0)<(c[H+(G*12|0)+4>>2]|0)?P:G;J=J+1|0}while((J|0)<(I|0))}I=(c[n>>2]|0)+G|0;if(a[I>>0]|0){J=c[k>>2]|0;H=J+(G*12|0)+4|0;M=c[H>>2]|0;if((M|0)>0){J=c[J+(G*12|0)>>2]|0;L=0;K=0;do{N=c[J+(L<<2)>>2]|0;if((c[(c[c[p>>2]>>2]|0)+(N<<2)>>2]&3|0)!=1){c[J+(K<<2)>>2]=N;M=c[H>>2]|0;K=K+1|0}L=L+1|0}while((L|0)<(M|0))}else{L=0;K=0}J=L-K|0;if((J|0)>0)c[H>>2]=M-J;a[I>>0]=0}I=c[k>>2]|0;H=c[I+(G*12|0)>>2]|0;I=I+(G*12|0)+4|0;if((c[I>>2]|0)>0)J=0;else continue;while(1){N=c[B>>2]|0;if(N&3)continue a;K=c[H+(J<<2)>>2]|0;L=c[r>>2]|0;O=L+(K<<2)|0;M=c[O>>2]|0;b:do if(((!((M&3|0)!=0|(K|0)==(A|0))?(P=c[v>>2]|0,y=M>>>5,(P|0)==-1|(y|0)<(P|0)):0)?(w=N>>>5,y>>>0>=w>>>0):0)?(c[B+(w<<2)+4>>2]&~c[O+(y<<2)+4>>2]|0)==0:0){L=L+(K+1<<2)|0;do if(N>>>0>31){if(M>>>0>31){O=-2;M=0}else break b;while(1){N=c[E+(M<<2)>>2]|0;c:do if((O|0)==-2){P=0;while(1){O=c[L+(P<<2)>>2]|0;if((N|0)==(O|0)){N=-2;break c}P=P+1|0;if((N|0)==(O^1|0))break c;if(P>>>0>=y>>>0)break b}}else{P=0;while(1){if((N|0)==(c[L+(P<<2)>>2]|0)){N=O;break c}P=P+1|0;if(P>>>0>=y>>>0)break b}}while(0);M=M+1|0;if(M>>>0>=w>>>0)break;else O=N}if((N|0)==-2)break;else if((N|0)==-1)break b;c[x>>2]=N^1;c[m+0>>2]=c[x+0>>2];if(!(Gc(b,K,m)|0)){f=0;j=53;break a}F=F+1|0;J=(((N>>1|0)==(G|0))<<31>>31)+J|0;break b}while(0);Fc(b,K);D=D+1|0}while(0);J=J+1|0;if((J|0)>=(c[I>>2]|0))continue a}}if((j|0)==8){Yc(g,0);c[f>>2]=c[h>>2];P=1;i=e;return P|0}else if((j|0)==53){i=e;return f|0}return 0}function Kc(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;h=i;i=i+16|0;g=h+12|0;m=h+8|0;k=h+4|0;j=h;l=(c[b+544>>2]|0)+(f<<2)|0;if(c[l>>2]&3){r=1;i=h;return r|0}if(Qb(b,l)|0){r=1;i=h;return r|0}c[m>>2]=c[b+284>>2];nc(b+292|0,m);p=c[l>>2]|0;if(p>>>0>31){m=b+332|0;n=0;o=-2;do{q=c[l+(n<<2)+4>>2]|0;r=q>>1;if((r|0)!=(e|0)?(r=(d[(c[m>>2]|0)+r>>0]|0)^q&1,t=a[2616]|0,s=t&255,((r&255)<<24>>24==t<<24>>24&(s>>>1^1)|s&2&r|0)==0):0){c[k>>2]=q^1;c[g+0>>2]=c[k+0>>2];Lb(b,g,-1);p=c[l>>2]|0}else o=q;n=n+1|0}while((n|0)<(p>>>5|0))}else o=-2;t=(Mb(b)|0)==-1;Rb(b,0);if(!t){t=b+712|0;c[t>>2]=(c[t>>2]|0)+1;c[j>>2]=o;c[g+0>>2]=c[j+0>>2];if(!(Gc(b,f,g)|0)){t=0;i=h;return t|0}}t=1;i=h;return t|0}function Lc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;e=i;h=(c[b+776>>2]|0)+d|0;f=b+760|0;if(a[h>>0]|0){k=c[f>>2]|0;g=k+(d*12|0)+4|0;n=c[g>>2]|0;if((n|0)>0){j=b+804|0;k=c[k+(d*12|0)>>2]|0;m=0;l=0;do{o=c[k+(m<<2)>>2]|0;if((c[(c[c[j>>2]>>2]|0)+(o<<2)>>2]&3|0)!=1){c[k+(l<<2)>>2]=o;n=c[g>>2]|0;l=l+1|0}m=m+1|0}while((m|0)<(n|0))}else{m=0;l=0}j=m-l|0;if((j|0)>0)c[g>>2]=n-j;a[h>>0]=0}g=c[f>>2]|0;n=a[(c[b+332>>2]|0)+d>>0]|0;m=a[2624]|0;o=m&255;if(!((o>>>1^1)&n<<24>>24==m<<24>>24|n&2&o)){o=1;i=e;return o|0}f=g+(d*12|0)+4|0;h=c[f>>2]|0;if(!h){o=1;i=e;return o|0}a:do if((h|0)>0){g=g+(d*12|0)|0;h=0;while(1){if(!(Kc(b,d,c[(c[g>>2]|0)+(h<<2)>>2]|0)|0)){b=0;break}h=h+1|0;if((h|0)>=(c[f>>2]|0))break a}i=e;return b|0}while(0);o=Jc(b,0)|0;i=e;return o|0}function Mc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0;e=i;i=i+48|0;s=e+36|0;r=e+32|0;t=e+28|0;u=e+24|0;f=e+12|0;g=e;n=(c[b+776>>2]|0)+d|0;m=b+760|0;if(a[n>>0]|0){q=c[m>>2]|0;o=q+(d*12|0)+4|0;y=c[o>>2]|0;if((y|0)>0){p=b+804|0;q=c[q+(d*12|0)>>2]|0;w=0;v=0;do{z=c[q+(w<<2)>>2]|0;if((c[(c[c[p>>2]>>2]|0)+(z<<2)>>2]&3|0)!=1){c[q+(v<<2)>>2]=z;y=c[o>>2]|0;v=v+1|0}w=w+1|0}while((w|0)<(y|0))}else{w=0;v=0}p=w-v|0;if((p|0)>0)c[o>>2]=y-p;a[n>>0]=0}v=c[m>>2]|0;w=v+(d*12|0)|0;c[f>>2]=0;n=f+4|0;c[n>>2]=0;o=f+8|0;c[o>>2]=0;c[g>>2]=0;q=g+4|0;c[q>>2]=0;p=g+8|0;c[p>>2]=0;v=v+(d*12|0)+4|0;a:do if((c[v>>2]|0)>0){y=b+544|0;B=d<<1;A=0;do{C=(c[w>>2]|0)+(A<<2)|0;E=(c[y>>2]|0)+(c[C>>2]<<2)|0;Z=c[E>>2]|0;z=Z>>>5;b:do if(Z>>>0>31){G=0;while(1){D=G+1|0;if((c[E+(G<<2)+4>>2]|0)==(B|0)){D=G;break b}if((D|0)<(z|0))G=D;else break}}else D=0;while(0);_c((D|0)<(z|0)?f:g,C);A=A+1|0;z=c[v>>2]|0}while((A|0)<(z|0));y=c[n>>2]|0;B=(y|0)>0;if(B){C=c[q>>2]|0;K=(C|0)>0;J=b+544|0;D=c[f>>2]|0;A=c[g>>2]|0;E=b+708|0;I=b+684|0;H=b+688|0;P=0;G=0;while(1){if(K){M=D+(G<<2)|0;L=c[J>>2]|0;N=c[E>>2]|0;O=0;do{S=L+(c[M>>2]<<2)|0;U=L+(c[A+(O<<2)>>2]<<2)|0;N=N+1|0;c[E>>2]=N;Q=(c[S>>2]|0)>>>5>>>0<(c[U>>2]|0)>>>5>>>0;R=Q?U:S;U=Q?S:U;S=R+4|0;Q=U+4|0;R=c[R>>2]|0;T=R>>>5;W=T+ -1|0;U=c[U>>2]|0;c:do if(U>>>0>31){V=0;while(1){Z=c[Q+(V<<2)>>2]|0;d:do if((Z>>1|0)!=(d|0)){e:do if(R>>>0>31){Y=0;while(1){X=c[S+(Y<<2)>>2]|0;Y=Y+1|0;if((X^Z)>>>0<2)break;if((Y|0)>=(T|0))break e}if((X|0)==(Z^1|0))break c;else break d}while(0);W=W+1|0}while(0);V=V+1|0;if((V|0)>=(U>>>5|0)){x=28;break}}}else x=28;while(0);if((x|0)==28){x=0;if((P|0)>=((c[I>>2]|0)+z|0)){b=1;break a}Z=c[H>>2]|0;if((Z|0)!=-1&(W|0)>(Z|0)){b=1;break a}else P=P+1|0}O=O+1|0}while((O|0)<(C|0))}G=G+1|0;if((G|0)>=(y|0)){x=32;break}}}else{B=0;x=32}}else{y=0;B=0;x=32}while(0);f:do if((x|0)==32){a[(c[b+904>>2]|0)+d>>0]=1;z=b+380|0;A=(c[z>>2]|0)+d|0;if(a[A>>0]|0){Z=b+200|0;Y=Z;Y=ne(c[Y>>2]|0,c[Y+4>>2]|0,-1,-1)|0;c[Z>>2]=Y;c[Z+4>>2]=F}a[A>>0]=0;A=b+460|0;if(!((c[b+476>>2]|0)>(d|0)?(c[(c[b+472>>2]|0)+(d<<2)>>2]|0)>-1:0))x=36;if((x|0)==36?(a[(c[z>>2]|0)+d>>0]|0)!=0:0)lc(A,d);x=b+716|0;c[x>>2]=(c[x>>2]|0)+1;x=c[q>>2]|0;if((y|0)>(x|0)){A=b+732|0;if((x|0)>0){u=b+544|0;t=c[g>>2]|0;E=b+736|0;D=0;do{C=(c[u>>2]|0)+(c[t+(D<<2)>>2]<<2)|0;z=c[E>>2]|0;if((c[C>>2]|0)>>>0>31){G=0;H=-1;do{Z=C+(G<<2)+4|0;c[s>>2]=c[Z>>2];_c(A,s);H=(c[Z>>2]>>1|0)==(d|0)?G+z|0:H;G=G+1|0}while((G|0)<((c[C>>2]|0)>>>5|0))}else H=-1;Z=c[A>>2]|0;X=Z+(H<<2)|0;Y=c[X>>2]|0;Z=Z+(z<<2)|0;c[X>>2]=c[Z>>2];c[Z>>2]=Y;c[r>>2]=(c[C>>2]|0)>>>5;_c(A,r);D=D+1|0}while((D|0)<(x|0))}c[s>>2]=d<<1;_c(A,s);c[r>>2]=1;_c(A,r)}else{D=b+732|0;if(B){G=b+544|0;E=c[f>>2]|0;z=b+736|0;H=0;do{C=(c[G>>2]|0)+(c[E+(H<<2)>>2]<<2)|0;A=c[z>>2]|0;if((c[C>>2]|0)>>>0>31){I=0;J=-1;do{Z=C+(I<<2)+4|0;c[s>>2]=c[Z>>2];_c(D,s);J=(c[Z>>2]>>1|0)==(d|0)?I+A|0:J;I=I+1|0}while((I|0)<((c[C>>2]|0)>>>5|0))}else J=-1;Z=c[D>>2]|0;X=Z+(J<<2)|0;Y=c[X>>2]|0;Z=Z+(A<<2)|0;c[X>>2]=c[Z>>2];c[Z>>2]=Y;c[r>>2]=(c[C>>2]|0)>>>5;_c(D,r);H=H+1|0}while((H|0)<(y|0))}c[t>>2]=d<<1|1;_c(D,t);c[u>>2]=1;_c(D,u)}if((c[v>>2]|0)>0){r=0;do{Fc(b,c[(c[w>>2]|0)+(r<<2)>>2]|0);r=r+1|0}while((r|0)<(c[v>>2]|0))}r=b+628|0;g:do if(B){s=b+544|0;w=c[f>>2]|0;A=c[g>>2]|0;if((x|0)>0)v=0;else{r=0;while(1){r=r+1|0;if((r|0)>=(y|0))break g}}do{u=w+(v<<2)|0;t=0;do{Z=c[s>>2]|0;if(Hc(b,Z+(c[u>>2]<<2)|0,Z+(c[A+(t<<2)>>2]<<2)|0,d,r)|0?!(Dc(b,r)|0):0){b=0;break f}t=t+1|0}while((t|0)<(x|0));v=v+1|0}while((v|0)<(y|0))}while(0);r=c[m>>2]|0;m=r+(d*12|0)|0;s=c[m>>2]|0;if(s){c[r+(d*12|0)+4>>2]=0;Td(s);c[m>>2]=0;c[r+(d*12|0)+8>>2]=0}m=b+412|0;d=d<<1;s=c[m>>2]|0;r=s+(d*12|0)+4|0;if((c[r>>2]|0)==0?(l=s+(d*12|0)|0,k=c[l>>2]|0,(k|0)!=0):0){c[r>>2]=0;Td(k);c[l>>2]=0;c[s+(d*12|0)+8>>2]=0;s=c[m>>2]|0}k=d|1;l=s+(k*12|0)+4|0;if((c[l>>2]|0)==0?(j=s+(k*12|0)|0,h=c[j>>2]|0,(h|0)!=0):0){c[l>>2]=0;Td(h);c[j>>2]=0;c[s+(k*12|0)+8>>2]=0}b=Jc(b,0)|0;A=c[g>>2]|0}while(0);if(A){c[q>>2]=0;Td(A);c[g>>2]=0;c[p>>2]=0}g=c[f>>2]|0;if(!g){i=e;return b|0}c[n>>2]=0;Td(g);c[f>>2]=0;c[o>>2]=0;i=e;return b|0}function Nc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;if(!(a[b+724>>0]|0)){i=e;return}l=b+540|0;if((c[l>>2]|0)>0){j=b+760|0;f=b+804|0;g=b+776|0;k=b+544|0;h=0;do{n=c[j>>2]|0;m=n+(h*12|0)+4|0;p=c[m>>2]|0;if((p|0)>0){n=c[n+(h*12|0)>>2]|0;q=0;o=0;do{r=c[n+(q<<2)>>2]|0;if((c[(c[c[f>>2]>>2]|0)+(r<<2)>>2]&3|0)!=1){c[n+(o<<2)>>2]=r;p=c[m>>2]|0;o=o+1|0}q=q+1|0}while((q|0)<(p|0))}else{q=0;o=0}n=q-o|0;if((n|0)>0)c[m>>2]=p-n;a[(c[g>>2]|0)+h>>0]=0;n=c[j>>2]|0;m=n+(h*12|0)+4|0;if((c[m>>2]|0)>0){r=n+(h*12|0)|0;p=0;do{n=(c[r>>2]|0)+(p<<2)|0;o=c[n>>2]|0;q=c[k>>2]|0;s=q+(o<<2)|0;if(!(c[s>>2]&16)){t=wc(d,s)|0;c[n>>2]=t;c[s>>2]=c[s>>2]|16;c[q+(o+1<<2)>>2]=t}else c[n>>2]=c[q+(o+1<<2)>>2];p=p+1|0}while((p|0)<(c[m>>2]|0))}h=h+1|0}while((h|0)<(c[l>>2]|0))}f=b+856|0;t=c[b+872>>2]|0;g=b+868|0;m=c[g>>2]|0;k=t-m|0;if((t|0)<(m|0))k=(c[b+860>>2]|0)+k|0;a:do if((k|0)>0){h=b+860|0;j=b+544|0;while(1){l=c[(c[f>>2]|0)+(m<<2)>>2]|0;n=m+1|0;c[g>>2]=(n|0)==(c[h>>2]|0)?0:n;n=c[j>>2]|0;o=n+(l<<2)|0;m=c[o>>2]|0;if(!(m&3)){if(!(m&16)){t=wc(d,o)|0;c[o>>2]=c[o>>2]|16;c[n+(l+1<<2)>>2]=t;l=t}else l=c[n+(l+1<<2)>>2]|0;Zc(f,l)}k=k+ -1|0;if((k|0)<=0)break a;m=c[g>>2]|0}}else j=b+544|0;while(0);b=b+928|0;f=c[b>>2]|0;h=c[j>>2]|0;g=h+(f<<2)|0;if(!(c[g>>2]&16)){t=wc(d,g)|0;c[b>>2]=t;c[g>>2]=c[g>>2]|16;c[h+(f+1<<2)>>2]=t;i=e;return}else{c[b>>2]=c[h+(f+1<<2)>>2];i=e;return}}function Oc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;h=i;i=i+32|0;l=h;d=h+8|0;e=b+544|0;f=b+548|0;g=b+556|0;j=(c[f>>2]|0)-(c[g>>2]|0)|0;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;gc(d,j);j=d+16|0;k=b+560|0;a[j>>0]=a[k>>0]|0;Nc(b,d);ac(b,d);if((c[b+44>>2]|0)>1){m=c[d+4>>2]<<2;c[l>>2]=c[f>>2]<<2;c[l+4>>2]=m;La(3608,l|0)|0}a[k>>0]=a[j>>0]|0;j=c[e>>2]|0;if(j)Td(j);c[e>>2]=c[d>>2];c[f>>2]=c[d+4>>2];c[b+552>>2]=c[d+8>>2];c[g>>2]=c[d+12>>2];i=h;return}function Pc(){var d=0,e=0,f=0;d=i;i=i+16|0;e=d;a[2608]=0;a[2616]=1;a[2624]=2;xb(2632,2656,2664,3744,3752);c[658]=160;a[2652]=0;xb(2704,2728,2736,3744,3752);c[676]=160;a[2724]=0;xb(2784,2808,2816,3744,3752);c[696]=160;a[2804]=1;xb(2848,2880,2888,3744,3736);c[712]=280;f=2868|0;c[f>>2]=-2147483648;c[f+4>>2]=2147483647;c[719]=0;xb(2960,2992,3e3,3744,3736);c[740]=280;f=2980|0;c[f>>2]=-1;c[f+4>>2]=2147483647;c[747]=20;xb(3112,3144,3152,3744,3736);c[778]=280;f=3132|0;c[f>>2]=-1;c[f+4>>2]=2147483647;c[785]=1e3;xb(3240,3296,3312,3744,3720);c[810]=2168;h[408]=0.0;h[409]=v;a[3280]=0;a[3281]=0;b[1641]=b[e+0>>1]|0;b[1642]=b[e+2>>1]|0;b[1643]=b[e+4>>1]|0;h[411]=.5;i=d;return}function Qc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;c[a>>2]=0;e=a+4|0;c[e>>2]=0;f=a+8|0;c[f>>2]=0;if((b|0)<=0){i=d;return}g=b+1&-2;g=(g|0)>2?g:2;c[f>>2]=g;f=Ud(0,g<<2)|0;c[a>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0)Ta(va(1)|0,48,0);a=c[e>>2]|0;if((a|0)<(b|0))do{g=f+(a<<2)|0;if(g)c[g>>2]=0;a=a+1|0}while((a|0)!=(b|0));c[e>>2]=b;i=d;return}function Rc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;e=a+32|0;d=c[e>>2]|0;if(d){c[a+36>>2]=0;Td(d);c[e>>2]=0;c[a+40>>2]=0}e=a+16|0;d=c[e>>2]|0;if(d){c[a+20>>2]=0;Td(d);c[e>>2]=0;c[a+24>>2]=0}e=c[a>>2]|0;if(!e){i=b;return}d=a+4|0;g=c[d>>2]|0;if((g|0)>0){f=0;do{j=e+(f*12|0)|0;h=c[j>>2]|0;if(h){c[e+(f*12|0)+4>>2]=0;Td(h);c[j>>2]=0;c[e+(f*12|0)+8>>2]=0;e=c[a>>2]|0;g=c[d>>2]|0}f=f+1|0}while((f|0)<(g|0))}c[d>>2]=0;Td(e);c[a>>2]=0;c[a+8>>2]=0;i=b;return}function Sc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;b=c[b>>2]|0;g=b+1|0;f=a+4|0;if((c[f>>2]|0)>=(g|0)){k=c[a>>2]|0;k=k+(b<<2)|0;c[k>>2]=d;i=e;return}h=a+8|0;k=c[h>>2]|0;if((k|0)<(g|0)){l=b+2-k&-2;j=(k>>1)+2&-2;j=(l|0)>(j|0)?l:j;if((j|0)>(2147483647-k|0)){l=va(1)|0;Ta(l|0,48,0)}m=c[a>>2]|0;l=j+k|0;c[h>>2]=l;l=Ud(m,l<<2)|0;c[a>>2]=l;if((l|0)==0?(c[(Oa()|0)>>2]|0)==12:0){m=va(1)|0;Ta(m|0,48,0)}}k=c[f>>2]|0;if((k|0)<(g|0)){h=c[a>>2]|0;do{j=h+(k<<2)|0;if(j)c[j>>2]=0;k=k+1|0}while((k|0)!=(g|0))}c[f>>2]=g;m=c[a>>2]|0;m=m+(b<<2)|0;c[m>>2]=d;i=e;return}function Tc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;k=c[d>>2]|0;g=k+1|0;f=b+4|0;if((c[f>>2]|0)<(g|0)){j=b+8|0;h=c[j>>2]|0;if((h|0)<(g|0)){l=k+2-h&-2;k=(h>>1)+2&-2;k=(l|0)>(k|0)?l:k;if((k|0)>(2147483647-h|0)){l=va(1)|0;Ta(l|0,48,0)}m=c[b>>2]|0;l=k+h|0;c[j>>2]=l;l=Ud(m,l*12|0)|0;c[b>>2]=l;if((l|0)==0?(c[(Oa()|0)>>2]|0)==12:0){m=va(1)|0;Ta(m|0,48,0)}}j=c[f>>2]|0;if((j|0)<(g|0)){h=c[b>>2]|0;do{k=h+(j*12|0)|0;if(k){c[k>>2]=0;c[h+(j*12|0)+4>>2]=0;c[h+(j*12|0)+8>>2]=0}j=j+1|0}while((j|0)!=(g|0))}c[f>>2]=g;h=c[d>>2]|0}else h=k;f=c[b>>2]|0;if(c[f+(h*12|0)>>2]|0){c[f+(h*12|0)+4>>2]=0;h=c[d>>2]|0}d=b+16|0;f=h+1|0;g=b+20|0;if((c[g>>2]|0)>=(f|0)){i=e;return}j=b+24|0;b=c[j>>2]|0;if((b|0)<(f|0)){m=h+2-b&-2;h=(b>>1)+2&-2;h=(m|0)>(h|0)?m:h;if((h|0)>(2147483647-b|0)){m=va(1)|0;Ta(m|0,48,0)}l=c[d>>2]|0;m=h+b|0;c[j>>2]=m;m=Ud(l,m)|0;c[d>>2]=m;if((m|0)==0?(c[(Oa()|0)>>2]|0)==12:0){m=va(1)|0;Ta(m|0,48,0)}}b=c[g>>2]|0;if((b|0)<(f|0))do{a[(c[d>>2]|0)+b>>0]=0;b=b+1|0}while((b|0)!=(f|0));c[g>>2]=f;i=e;return}function Uc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;i=i+16|0;g=d;c[g>>2]=b;f=a+12|0;e=b+1|0;h=a+16|0;if((c[h>>2]|0)<(e|0)){k=a+20|0;j=c[k>>2]|0;if((j|0)<(e|0)){m=b+2-j&-2;l=(j>>1)+2&-2;l=(m|0)>(l|0)?m:l;if((l|0)>(2147483647-j|0)){m=va(1)|0;Ta(m|0,48,0)}n=c[f>>2]|0;m=l+j|0;c[k>>2]=m;m=Ud(n,m<<2)|0;c[f>>2]=m;if((m|0)==0?(c[(Oa()|0)>>2]|0)==12:0){n=va(1)|0;Ta(n|0,48,0)}}j=c[h>>2]|0;if((e|0)>(j|0))ke((c[f>>2]|0)+(j<<2)|0,-1,e-j<<2|0)|0;c[h>>2]=e}c[(c[f>>2]|0)+(b<<2)>>2]=c[a+4>>2];nc(a,g);e=c[f>>2]|0;j=c[e+(b<<2)>>2]|0;b=c[a>>2]|0;f=c[b+(j<<2)>>2]|0;if(!j){m=0;n=b+(m<<2)|0;c[n>>2]=f;n=e+(f<<2)|0;c[n>>2]=m;i=d;return}a=a+28|0;g=f<<1;h=g|1;while(1){m=j;j=j+ -1>>1;l=b+(j<<2)|0;k=c[l>>2]|0;r=c[c[a>>2]>>2]|0;o=c[r+(g<<2)>>2]|0;q=c[r+(h<<2)>>2]|0;o=we(q|0,((q|0)<0)<<31>>31|0,o|0,((o|0)<0)<<31>>31|0)|0;q=F;p=k<<1;n=c[r+(p<<2)>>2]|0;p=c[r+((p|1)<<2)>>2]|0;n=we(p|0,((p|0)<0)<<31>>31|0,n|0,((n|0)<0)<<31>>31|0)|0;p=F;if(!(q>>>0<p>>>0|(q|0)==(p|0)&o>>>0<n>>>0)){a=14;break}c[b+(m<<2)>>2]=k;c[e+(c[l>>2]<<2)>>2]=m;if(!j){m=0;a=14;break}}if((a|0)==14){r=b+(m<<2)|0;c[r>>2]=f;r=e+(f<<2)|0;c[r>>2]=m;i=d;return}}function Vc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=i;h=b+824|0;l=(c[b+840>>2]|0)>(d|0);if(l?(c[(c[b+836>>2]|0)+(d<<2)>>2]|0)>-1:0)j=7;else j=3;do if((j|0)==3){if(a[(c[b+876>>2]|0)+d>>0]|0){i=e;return}if(a[(c[b+904>>2]|0)+d>>0]|0){i=e;return}o=a[(c[b+332>>2]|0)+d>>0]|0;n=a[2624]|0;p=n&255;if((p>>>1^1)&o<<24>>24==n<<24>>24|o&2&p)if(l){j=7;break}else break;else{i=e;return}}while(0);if((j|0)==7?(f=c[b+836>>2]|0,g=f+(d<<2)|0,k=c[g>>2]|0,(k|0)>-1):0){d=c[h>>2]|0;j=c[d+(k<<2)>>2]|0;a:do if(!k)o=0;else{l=b+852|0;m=j<<1;b=m|1;while(1){o=k;k=k+ -1>>1;p=d+(k<<2)|0;n=c[p>>2]|0;u=c[c[l>>2]>>2]|0;r=c[u+(m<<2)>>2]|0;t=c[u+(b<<2)>>2]|0;r=we(t|0,((t|0)<0)<<31>>31|0,r|0,((r|0)<0)<<31>>31|0)|0;t=F;s=n<<1;q=c[u+(s<<2)>>2]|0;s=c[u+((s|1)<<2)>>2]|0;q=we(s|0,((s|0)<0)<<31>>31|0,q|0,((q|0)<0)<<31>>31|0)|0;s=F;if(!(t>>>0<s>>>0|(t|0)==(s|0)&r>>>0<q>>>0))break a;c[d+(o<<2)>>2]=n;c[f+(c[p>>2]<<2)>>2]=o;if(!k){o=0;break}}}while(0);c[d+(o<<2)>>2]=j;c[f+(j<<2)>>2]=o;Wc(h,c[g>>2]|0);i=e;return}Uc(h,d);i=e;return}function Wc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;d=i;e=c[a>>2]|0;f=c[e+(b<<2)>>2]|0;m=b<<1|1;l=a+4|0;o=c[l>>2]|0;if((m|0)>=(o|0)){p=b;q=a+12|0;o=e+(p<<2)|0;c[o>>2]=f;q=c[q>>2]|0;q=q+(f<<2)|0;c[q>>2]=p;i=d;return}h=a+28|0;k=f<<1;j=k|1;a=a+12|0;while(1){n=(b<<1)+2|0;if((n|0)<(o|0)){p=c[e+(n<<2)>>2]|0;q=c[e+(m<<2)>>2]|0;u=p<<1;o=c[c[h>>2]>>2]|0;s=c[o+(u<<2)>>2]|0;u=c[o+((u|1)<<2)>>2]|0;s=we(u|0,((u|0)<0)<<31>>31|0,s|0,((s|0)<0)<<31>>31|0)|0;u=F;t=q<<1;r=c[o+(t<<2)>>2]|0;t=c[o+((t|1)<<2)>>2]|0;r=we(t|0,((t|0)<0)<<31>>31|0,r|0,((r|0)<0)<<31>>31|0)|0;t=F;if(!(u>>>0<t>>>0|(u|0)==(t|0)&s>>>0<r>>>0)){p=q;g=7}}else{p=c[e+(m<<2)>>2]|0;o=c[c[h>>2]>>2]|0;g=7}if((g|0)==7){g=0;n=m}r=p<<1;t=c[o+(r<<2)>>2]|0;r=c[o+((r|1)<<2)>>2]|0;t=we(r|0,((r|0)<0)<<31>>31|0,t|0,((t|0)<0)<<31>>31|0)|0;r=F;u=c[o+(k<<2)>>2]|0;s=c[o+(j<<2)>>2]|0;u=we(s|0,((s|0)<0)<<31>>31|0,u|0,((u|0)<0)<<31>>31|0)|0;s=F;if(!(r>>>0<s>>>0|(r|0)==(s|0)&t>>>0<u>>>0)){g=10;break}c[e+(b<<2)>>2]=p;c[(c[a>>2]|0)+(p<<2)>>2]=b;m=n<<1|1;o=c[l>>2]|0;if((m|0)>=(o|0)){b=n;g=10;break}else b=n}if((g|0)==10){u=e+(b<<2)|0;c[u>>2]=f;u=c[a>>2]|0;u=u+(f<<2)|0;c[u>>2]=b;i=d;return}}function Xc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;h=c[a>>2]|0;if(h){e=a+4|0;f=c[e>>2]|0;a:do if((f|0)>0){g=0;while(1){j=h+(g*12|0)|0;k=c[j>>2]|0;if(k){c[h+(g*12|0)+4>>2]=0;Td(k);c[j>>2]=0;c[h+(g*12|0)+8>>2]=0;f=c[e>>2]|0}g=g+1|0;if((g|0)>=(f|0))break a;h=c[a>>2]|0}}while(0);c[e>>2]=0;if(b){Td(c[a>>2]|0);c[a>>2]=0;c[a+8>>2]=0}}e=a+16|0;f=c[e>>2]|0;if((f|0)!=0?(c[a+20>>2]=0,b):0){Td(f);c[e>>2]=0;c[a+24>>2]=0}f=a+32|0;e=c[f>>2]|0;if(!e){i=d;return}c[a+36>>2]=0;if(!b){i=d;return}Td(e);c[f>>2]=0;c[a+40>>2]=0;i=d;return}function Yc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;e=i;f=c[a>>2]|0;d=a+4|0;if(f){c[d>>2]=0;if(b){Td(f);c[a>>2]=0;c[a+8>>2]=0;f=0}}else f=0;if((c[d>>2]|0)>=1){h=a+16|0;c[h>>2]=0;h=a+12|0;c[h>>2]=0;i=e;return}h=a+8|0;g=c[h>>2]|0;if((g|0)<1){j=2-g&-2;b=(g>>1)+2&-2;b=(j|0)>(b|0)?j:b;if((b|0)>(2147483647-g|0)){j=va(1)|0;Ta(j|0,48,0)}j=b+g|0;c[h>>2]=j;f=Ud(f,j<<2)|0;c[a>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0){j=va(1)|0;Ta(j|0,48,0)}}b=c[d>>2]|0;if((b|0)<1)while(1){g=f+(b<<2)|0;if(g)c[g>>2]=0;if(!b)break;else b=b+1|0}c[d>>2]=1;j=a+16|0;c[j>>2]=0;j=a+12|0;c[j>>2]=0;i=e;return}function Zc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;i=i+16|0;d=e;f=a+16|0;j=c[f>>2]|0;c[f>>2]=j+1;c[(c[a>>2]|0)+(j<<2)>>2]=b;j=c[f>>2]|0;b=a+4|0;h=c[b>>2]|0;if((j|0)==(h|0)){c[f>>2]=0;j=0}g=a+12|0;if((c[g>>2]|0)!=(j|0)){i=e;return}Qc(d,(h*3|0)+1>>1);l=c[g>>2]|0;m=c[b>>2]|0;if((l|0)<(m|0)){j=c[a>>2]|0;k=c[d>>2]|0;m=0;while(1){h=m+1|0;c[k+(m<<2)>>2]=c[j+(l<<2)>>2];l=l+1|0;m=c[b>>2]|0;if((l|0)>=(m|0)){k=h;break}else m=h}}else k=0;h=c[a>>2]|0;if((c[f>>2]|0)>0){j=c[d>>2]|0;l=0;while(1){c[j+(k<<2)>>2]=c[h+(l<<2)>>2];l=l+1|0;if((l|0)>=(c[f>>2]|0))break;else k=k+1|0}m=c[b>>2]|0}c[g>>2]=0;c[f>>2]=m;if(!h)f=a+8|0;else{c[b>>2]=0;Td(h);c[a>>2]=0;f=a+8|0;c[f>>2]=0}c[a>>2]=c[d>>2];l=d+4|0;c[b>>2]=c[l>>2];m=d+8|0;c[f>>2]=c[m>>2];c[d>>2]=0;c[l>>2]=0;c[m>>2]=0;i=e;return}function _c(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=a+4|0;f=c[e>>2]|0;g=a+8|0;h=c[g>>2]|0;if((f|0)==(h|0)&(h|0)<(f+1|0)){h=(f>>1)+2&-2;h=(h|0)<2?2:h;if((h|0)>(2147483647-f|0)){h=va(1)|0;Ta(h|0,48,0)}j=c[a>>2]|0;f=h+f|0;c[g>>2]=f;f=Ud(j,f<<2)|0;c[a>>2]=f;if((f|0)==0?(c[(Oa()|0)>>2]|0)==12:0){j=va(1)|0;Ta(j|0,48,0)}}else f=c[a>>2]|0;j=c[e>>2]|0;c[e>>2]=j+1;e=f+(j<<2)|0;if(!e){i=d;return}c[e>>2]=c[b>>2];i=d;return}function $c(){var a=0,b=0;b=i;Ka(3864)|0;a=od(936)|0;xc(a);i=b;return a|0}function ad(a){a=a|0;var b=0;b=i;if(!a){i=b;return}gb[c[(c[a>>2]|0)+4>>2]&31](a);i=b;return}function bd(){var b=0,d=0,e=0;b=i;i=i+16|0;d=b;e=od(936)|0;xc(e);c[964]=e;Cc(e,1)|0;e=c[964]|0;a[d+0>>0]=a[3840]|0;Ac(e,d,1)|0;i=b;return}function cd(b){b=b|0;var d=0,e=0,f=0;d=i;i=i+16|0;e=d;if((c[962]|0)>=(b|0)){i=d;return}do{f=c[964]|0;a[e+0>>0]=a[3840]|0;Ac(f,e,1)|0;f=(c[962]|0)+1|0;c[962]=f}while((f|0)<(b|0));i=d;return}function dd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;g=i;i=i+32|0;h=g+16|0;e=g+4|0;j=g;c[e>>2]=0;f=e+4|0;c[f>>2]=0;d=e+8|0;c[d>>2]=0;k=c[b>>2]|0;if(k)do{l=(k|0)<0?0-k|0:k;if((c[962]|0)<(l|0))do{m=c[964]|0;a[h+0>>0]=a[3840]|0;Ac(m,h,1)|0;m=(c[962]|0)+1|0;c[962]=m}while((m|0)<(l|0));c[j>>2]=l<<1|k>>>31;mc(e,j);b=b+4|0;k=c[b>>2]|0}while((k|0)!=0);j=c[964]|0;h=j+628|0;ld(e,h);h=Dc(j,h)|0;j=c[e>>2]|0;if(!j){i=g;return h|0}c[f>>2]=0;Td(j);c[e>>2]=0;c[d>>2]=0;i=g;return h|0}function ed(){var b=0,d=0,e=0,f=0;d=i;i=i+16|0;b=d;e=c[964]|0;f=e+664|0;c[f+0>>2]=-1;c[f+4>>2]=-1;c[f+8>>2]=-1;c[f+12>>2]=-1;if(c[e+304>>2]|0)c[e+308>>2]=0;Bc(b,e,1,0);i=d;return(a[b>>0]|0)==0|0}function fd(){return(c[(c[964]|0)+4>>2]|0)+1|0}function gd(){return c[962]|0}function hd(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+32|0;h=d+16|0;f=d+4|0;j=d;c[f>>2]=0;e=f+4|0;c[e>>2]=0;g=f+8|0;c[g>>2]=0;c[j>>2]=b<<1;mc(f,j);b=c[964]|0;j=b+664|0;c[j+0>>2]=-1;c[j+4>>2]=-1;c[j+8>>2]=-1;c[j+12>>2]=-1;ld(f,b+304|0);Bc(h,b,1,0);b=(a[h>>0]|0)==0;h=c[f>>2]|0;if(!h){i=d;return b|0}c[e>>2]=0;Td(h);c[f>>2]=0;c[g>>2]=0;i=d;return b|0}function id(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+16|0;e=b;d=c[964]|0;c[e>>2]=a<<1|1;a=d+628|0;if(c[a>>2]|0)c[d+632>>2]=0;mc(a,e);Dc(d,a)|0;i=b;return}function jd(){return c[(c[964]|0)+36>>2]|0}function kd(){return c[(c[964]|0)+32>>2]|0}function ld(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;h=c[b>>2]|0;e=b+4|0;if(!h)j=c[e>>2]|0;else{c[e>>2]=0;j=0}e=a+4|0;f=c[e>>2]|0;g=b+4|0;if((j|0)<(f|0)){k=b+8|0;j=c[k>>2]|0;if((j|0)<(f|0)){m=f+1-j&-2;l=(j>>1)+2&-2;l=(m|0)>(l|0)?m:l;if((l|0)>(2147483647-j|0)){m=va(1)|0;Ta(m|0,48,0)}m=l+j|0;c[k>>2]=m;h=Ud(h,m<<2)|0;c[b>>2]=h;if((h|0)==0?(c[(Oa()|0)>>2]|0)==12:0){m=va(1)|0;Ta(m|0,48,0)}}j=c[g>>2]|0;a:do if((j|0)<(f|0))while(1){h=h+(j<<2)|0;if(h)c[h>>2]=0;j=j+1|0;if((j|0)==(f|0))break a;h=c[b>>2]|0}while(0);c[g>>2]=f;f=c[e>>2]|0}if((f|0)<=0){i=d;return}b=c[b>>2]|0;a=c[a>>2]|0;f=0;do{c[b+(f<<2)>>2]=c[a+(f<<2)>>2];f=f+1|0}while((f|0)<(c[e>>2]|0));i=d;return}function md(a,b){a=a|0;b=b|0;var d=0;d=i;i=i+16|0;c[d>>2]=b;b=c[p>>2]|0;ua(b|0,a|0,d|0)|0;Sa(10,b|0)|0;Wa()}function nd(){var a=0,b=0;a=i;i=i+16|0;if(!(Ja(4064,3)|0)){b=Ha(c[1014]|0)|0;i=a;return b|0}else md(4072,a);return 0}function od(a){a=a|0;var b=0,d=0;b=i;a=(a|0)==0?1:a;d=Sd(a)|0;if(d){i=b;return d|0}while(1){d=vd()|0;if(!d){a=4;break}jb[d&3]();d=Sd(a)|0;if(d){a=5;break}}if((a|0)==4){d=va(4)|0;c[d>>2]=4248;Ta(d|0,4296,12)}else if((a|0)==5){i=b;return d|0}return 0}function pd(a){a=a|0;var b=0;b=i;Td(a);i=b;return}function qd(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function rd(a){a=a|0;return}function sd(a){a=a|0;return 4264}function td(a){a=a|0;var b=0;b=i;i=i+16|0;jb[a&3]();md(4312,b)}function ud(){var a=0,b=0;b=nd()|0;if(((b|0)!=0?(a=c[b>>2]|0,(a|0)!=0):0)?(b=a+48|0,(c[b>>2]&-256|0)==1126902528?(c[b+4>>2]|0)==1129074247:0):0)td(c[a+12>>2]|0);b=c[968]|0;c[968]=b+0;td(b)}function vd(){var a=0;a=c[1102]|0;c[1102]=a+0;return a|0}function wd(a){a=a|0;return}function xd(a){a=a|0;return}function yd(a){a=a|0;return}function zd(a){a=a|0;return}function Ad(a){a=a|0;return}function Bd(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function Cd(a){a=a|0;var b=0;b=i;pd(a);i=b;return}function Dd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+64|0;f=e;if((a|0)==(b|0)){h=1;i=e;return h|0}if(!b){h=0;i=e;return h|0}b=Hd(b,4504,4560,0)|0;if(!b){h=0;i=e;return h|0}h=f+0|0;g=h+56|0;do{c[h>>2]=0;h=h+4|0}while((h|0)<(g|0));c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;mb[c[(c[b>>2]|0)+28>>2]&3](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){h=0;i=e;return h|0}c[d>>2]=c[f+16>>2];h=1;i=e;return h|0}function Ed(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;b=i;g=d+16|0;h=c[g>>2]|0;if(!h){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;i=b;return}if((h|0)!=(e|0)){h=d+36|0;c[h>>2]=(c[h>>2]|0)+1;c[d+24>>2]=2;a[d+54>>0]=1;i=b;return}e=d+24|0;if((c[e>>2]|0)!=2){i=b;return}c[e>>2]=f;i=b;return}function Fd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;if((c[b+8>>2]|0)!=(a|0)){i=f;return}Ed(0,b,d,e);i=f;return}function Gd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;if((a|0)==(c[b+8>>2]|0)){Ed(0,b,d,e);i=f;return}else{a=c[a+8>>2]|0;mb[c[(c[a>>2]|0)+28>>2]&3](a,b,d,e);i=f;return}}function Hd(d,e,f,g){d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;h=i;i=i+64|0;j=h;k=c[d>>2]|0;l=d+(c[k+ -8>>2]|0)|0;k=c[k+ -4>>2]|0;c[j>>2]=f;c[j+4>>2]=d;c[j+8>>2]=e;c[j+12>>2]=g;n=j+16|0;o=j+20|0;e=j+24|0;m=j+28|0;g=j+32|0;d=j+40|0;p=(k|0)==(f|0);q=n+0|0;f=q+36|0;do{c[q>>2]=0;q=q+4|0}while((q|0)<(f|0));b[n+36>>1]=0;a[n+38>>0]=0;if(p){c[j+48>>2]=1;kb[c[(c[k>>2]|0)+20>>2]&3](k,j,l,l,1,0);q=(c[e>>2]|0)==1?l:0;i=h;return q|0}fb[c[(c[k>>2]|0)+24>>2]&3](k,j,l,1,0);j=c[j+36>>2]|0;if(!j){q=(c[d>>2]|0)==1&(c[m>>2]|0)==1&(c[g>>2]|0)==1?c[o>>2]|0:0;i=h;return q|0}else if((j|0)==1){if((c[e>>2]|0)!=1?!((c[d>>2]|0)==0&(c[m>>2]|0)==1&(c[g>>2]|0)==1):0){q=0;i=h;return q|0}q=c[n>>2]|0;i=h;return q|0}else{q=0;i=h;return q|0}return 0}function Id(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;b=i;a[d+53>>0]=1;if((c[d+4>>2]|0)!=(f|0)){i=b;return}a[d+52>>0]=1;f=d+16|0;h=c[f>>2]|0;if(!h){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((g|0)==1?(c[d+48>>2]|0)==1:0)){i=b;return}a[d+54>>0]=1;i=b;return}if((h|0)!=(e|0)){h=d+36|0;c[h>>2]=(c[h>>2]|0)+1;a[d+54>>0]=1;i=b;return}e=d+24|0;f=c[e>>2]|0;if((f|0)==2)c[e>>2]=g;else g=f;if(!((g|0)==1?(c[d+48>>2]|0)==1:0)){i=b;return}a[d+54>>0]=1;i=b;return}function Jd(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0;h=i;if((b|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){i=h;return}j=d+28|0;if((c[j>>2]|0)==1){i=h;return}c[j>>2]=f;i=h;return}if((b|0)!=(c[d>>2]|0)){l=c[b+8>>2]|0;fb[c[(c[l>>2]|0)+24>>2]&3](l,d,e,f,g);i=h;return}if((c[d+16>>2]|0)!=(e|0)?(k=d+20|0,(c[k>>2]|0)!=(e|0)):0){c[d+32>>2]=f;f=d+44|0;if((c[f>>2]|0)==4){i=h;return}l=d+52|0;a[l>>0]=0;m=d+53|0;a[m>>0]=0;b=c[b+8>>2]|0;kb[c[(c[b>>2]|0)+20>>2]&3](b,d,e,e,1,g);if(a[m>>0]|0){if(!(a[l>>0]|0)){b=1;j=13}}else{b=0;j=13}do if((j|0)==13){c[k>>2]=e;m=d+40|0;c[m>>2]=(c[m>>2]|0)+1;if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0){a[d+54>>0]=1;if(b)break}else j=16;if((j|0)==16?b:0)break;c[f>>2]=4;i=h;return}while(0);c[f>>2]=3;i=h;return}if((f|0)!=1){i=h;return}c[d+32>>2]=1;i=h;return}function Kd(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;g=i;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){i=g;return}d=d+28|0;if((c[d>>2]|0)==1){i=g;return}c[d>>2]=f;i=g;return}if((c[d>>2]|0)!=(b|0)){i=g;return}if((c[d+16>>2]|0)!=(e|0)?(h=d+20|0,(c[h>>2]|0)!=(e|0)):0){c[d+32>>2]=f;c[h>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1;if((c[d+36>>2]|0)==1?(c[d+24>>2]|0)==2:0)a[d+54>>0]=1;c[d+44>>2]=4;i=g;return}if((f|0)!=1){i=g;return}c[d+32>>2]=1;i=g;return}function Ld(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;h=i;if((a|0)==(c[b+8>>2]|0)){Id(0,b,d,e,f);i=h;return}else{a=c[a+8>>2]|0;kb[c[(c[a>>2]|0)+20>>2]&3](a,b,d,e,f,g);i=h;return}}function Md(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;g=i;if((c[b+8>>2]|0)!=(a|0)){i=g;return}Id(0,b,d,e,f);i=g;return}function Nd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;i=i+16|0;f=e;c[f>>2]=c[d>>2];a=eb[c[(c[a>>2]|0)+16>>2]&1](a,b,f)|0;b=a&1;if(!a){i=e;return b|0}c[d>>2]=c[f>>2];i=e;return b|0}function Od(a){a=a|0;var b=0;b=i;if(!a)a=0;else a=(Hd(a,4504,4672,0)|0)!=0;i=b;return a&1|0}function Pd(){var a=0,b=0,d=0,e=0,f=0;a=i;i=i+16|0;b=a;a=a+12|0;d=nd()|0;if(!d)md(4040,b);d=c[d>>2]|0;if(!d)md(4040,b);f=d+48|0;e=c[f>>2]|0;f=c[f+4>>2]|0;if(!((e&-256|0)==1126902528&(f|0)==1129074247)){c[b>>2]=c[970];md(4e3,b)}if((e|0)==1126902529&(f|0)==1129074247)e=c[d+44>>2]|0;else e=d+80|0;c[a>>2]=e;f=c[d>>2]|0;d=c[f+4>>2]|0;if(eb[c[(c[4432>>2]|0)+16>>2]&1](4432,f,a)|0){f=c[a>>2]|0;e=c[970]|0;f=ib[c[(c[f>>2]|0)+8>>2]&1](f)|0;c[b>>2]=e;c[b+4>>2]=d;c[b+8>>2]=f;md(3904,b)}else{c[b>>2]=c[970];c[b+4>>2]=d;md(3952,b)}}function Qd(){var a=0;a=i;i=i+16|0;if(!(Ma(4056,20)|0)){i=a;return}else md(4128,a)}function Rd(a){a=a|0;var b=0;b=i;i=i+16|0;Td(a);if(!(Pa(c[1014]|0,0)|0)){i=b;return}else md(4184,b)}function Sd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;b=i;do if(a>>>0<245){if(a>>>0<11)a=16;else a=a+11&-8;x=a>>>3;p=c[1206]|0;w=p>>>x;if(w&3){g=(w&1^1)+x|0;f=g<<1;d=4864+(f<<2)|0;f=4864+(f+2<<2)|0;h=c[f>>2]|0;j=h+8|0;e=c[j>>2]|0;do if((d|0)!=(e|0)){if(e>>>0<(c[1210]|0)>>>0)Wa();k=e+12|0;if((c[k>>2]|0)==(h|0)){c[k>>2]=d;c[f>>2]=e;break}else Wa()}else c[1206]=p&~(1<<g);while(0);H=g<<3;c[h+4>>2]=H|3;H=h+(H|4)|0;c[H>>2]=c[H>>2]|1;H=j;i=b;return H|0}v=c[1208]|0;if(a>>>0>v>>>0){if(w){h=2<<x;h=w<<x&(h|0-h);h=(h&0-h)+ -1|0;d=h>>>12&16;h=h>>>d;j=h>>>5&8;h=h>>>j;f=h>>>2&4;h=h>>>f;g=h>>>1&2;h=h>>>g;e=h>>>1&1;e=(j|d|f|g|e)+(h>>>e)|0;h=e<<1;g=4864+(h<<2)|0;h=4864+(h+2<<2)|0;f=c[h>>2]|0;d=f+8|0;j=c[d>>2]|0;do if((g|0)!=(j|0)){if(j>>>0<(c[1210]|0)>>>0)Wa();k=j+12|0;if((c[k>>2]|0)==(f|0)){c[k>>2]=g;c[h>>2]=j;E=c[1208]|0;break}else Wa()}else{c[1206]=p&~(1<<e);E=v}while(0);H=e<<3;e=H-a|0;c[f+4>>2]=a|3;g=f+a|0;c[f+(a|4)>>2]=e|1;c[f+H>>2]=e;if(E){f=c[1211]|0;l=E>>>3;j=l<<1;h=4864+(j<<2)|0;k=c[1206]|0;l=1<<l;if(k&l){j=4864+(j+2<<2)|0;k=c[j>>2]|0;if(k>>>0<(c[1210]|0)>>>0)Wa();else{D=j;C=k}}else{c[1206]=k|l;D=4864+(j+2<<2)|0;C=h}c[D>>2]=f;c[C+12>>2]=f;c[f+8>>2]=C;c[f+12>>2]=h}c[1208]=e;c[1211]=g;H=d;i=b;return H|0}p=c[1207]|0;if(p){d=(p&0-p)+ -1|0;G=d>>>12&16;d=d>>>G;F=d>>>5&8;d=d>>>F;H=d>>>2&4;d=d>>>H;f=d>>>1&2;d=d>>>f;e=d>>>1&1;e=c[5128+((F|G|H|f|e)+(d>>>e)<<2)>>2]|0;d=(c[e+4>>2]&-8)-a|0;f=e;while(1){g=c[f+16>>2]|0;if(!g){g=c[f+20>>2]|0;if(!g)break}f=(c[g+4>>2]&-8)-a|0;H=f>>>0<d>>>0;d=H?f:d;f=g;e=H?g:e}h=c[1210]|0;if(e>>>0<h>>>0)Wa();f=e+a|0;if(e>>>0>=f>>>0)Wa();g=c[e+24>>2]|0;k=c[e+12>>2]|0;do if((k|0)==(e|0)){k=e+20|0;j=c[k>>2]|0;if(!j){k=e+16|0;j=c[k>>2]|0;if(!j){B=0;break}}while(1){l=j+20|0;m=c[l>>2]|0;if(m){j=m;k=l;continue}l=j+16|0;m=c[l>>2]|0;if(!m)break;else{j=m;k=l}}if(k>>>0<h>>>0)Wa();else{c[k>>2]=0;B=j;break}}else{j=c[e+8>>2]|0;if(j>>>0<h>>>0)Wa();h=j+12|0;if((c[h>>2]|0)!=(e|0))Wa();l=k+8|0;if((c[l>>2]|0)==(e|0)){c[h>>2]=k;c[l>>2]=j;B=k;break}else Wa()}while(0);do if(g){j=c[e+28>>2]|0;h=5128+(j<<2)|0;if((e|0)==(c[h>>2]|0)){c[h>>2]=B;if(!B){c[1207]=c[1207]&~(1<<j);break}}else{if(g>>>0<(c[1210]|0)>>>0)Wa();h=g+16|0;if((c[h>>2]|0)==(e|0))c[h>>2]=B;else c[g+20>>2]=B;if(!B)break}h=c[1210]|0;if(B>>>0<h>>>0)Wa();c[B+24>>2]=g;g=c[e+16>>2]|0;do if(g)if(g>>>0<h>>>0)Wa();else{c[B+16>>2]=g;c[g+24>>2]=B;break}while(0);g=c[e+20>>2]|0;if(g)if(g>>>0<(c[1210]|0)>>>0)Wa();else{c[B+20>>2]=g;c[g+24>>2]=B;break}}while(0);if(d>>>0<16){H=d+a|0;c[e+4>>2]=H|3;H=e+(H+4)|0;c[H>>2]=c[H>>2]|1}else{c[e+4>>2]=a|3;c[e+(a|4)>>2]=d|1;c[e+(d+a)>>2]=d;h=c[1208]|0;if(h){g=c[1211]|0;k=h>>>3;l=k<<1;h=4864+(l<<2)|0;j=c[1206]|0;k=1<<k;if(j&k){j=4864+(l+2<<2)|0;k=c[j>>2]|0;if(k>>>0<(c[1210]|0)>>>0)Wa();else{A=j;z=k}}else{c[1206]=j|k;A=4864+(l+2<<2)|0;z=h}c[A>>2]=g;c[z+12>>2]=g;c[g+8>>2]=z;c[g+12>>2]=h}c[1208]=d;c[1211]=f}H=e+8|0;i=b;return H|0}}}else if(a>>>0<=4294967231){z=a+11|0;a=z&-8;B=c[1207]|0;if(B){A=0-a|0;z=z>>>8;if(z)if(a>>>0>16777215)C=31;else{G=(z+1048320|0)>>>16&8;H=z<<G;F=(H+520192|0)>>>16&4;H=H<<F;C=(H+245760|0)>>>16&2;C=14-(F|G|C)+(H<<C>>>15)|0;C=a>>>(C+7|0)&1|C<<1}else C=0;D=c[5128+(C<<2)>>2]|0;a:do if(!D){F=0;z=0}else{if((C|0)==31)z=0;else z=25-(C>>>1)|0;F=0;E=a<<z;z=0;while(1){G=c[D+4>>2]&-8;H=G-a|0;if(H>>>0<A>>>0)if((G|0)==(a|0)){A=H;F=D;z=D;break a}else{A=H;z=D}H=c[D+20>>2]|0;D=c[D+(E>>>31<<2)+16>>2]|0;F=(H|0)==0|(H|0)==(D|0)?F:H;if(!D)break;else E=E<<1}}while(0);if((F|0)==0&(z|0)==0){H=2<<C;B=B&(H|0-H);if(!B)break;H=(B&0-B)+ -1|0;D=H>>>12&16;H=H>>>D;C=H>>>5&8;H=H>>>C;E=H>>>2&4;H=H>>>E;G=H>>>1&2;H=H>>>G;F=H>>>1&1;F=c[5128+((C|D|E|G|F)+(H>>>F)<<2)>>2]|0}if(F)while(1){H=(c[F+4>>2]&-8)-a|0;B=H>>>0<A>>>0;A=B?H:A;z=B?F:z;B=c[F+16>>2]|0;if(B){F=B;continue}F=c[F+20>>2]|0;if(!F)break}if((z|0)!=0?A>>>0<((c[1208]|0)-a|0)>>>0:0){f=c[1210]|0;if(z>>>0<f>>>0)Wa();d=z+a|0;if(z>>>0>=d>>>0)Wa();e=c[z+24>>2]|0;g=c[z+12>>2]|0;do if((g|0)==(z|0)){h=z+20|0;g=c[h>>2]|0;if(!g){h=z+16|0;g=c[h>>2]|0;if(!g){x=0;break}}while(1){j=g+20|0;k=c[j>>2]|0;if(k){g=k;h=j;continue}j=g+16|0;k=c[j>>2]|0;if(!k)break;else{g=k;h=j}}if(h>>>0<f>>>0)Wa();else{c[h>>2]=0;x=g;break}}else{h=c[z+8>>2]|0;if(h>>>0<f>>>0)Wa();j=h+12|0;if((c[j>>2]|0)!=(z|0))Wa();f=g+8|0;if((c[f>>2]|0)==(z|0)){c[j>>2]=g;c[f>>2]=h;x=g;break}else Wa()}while(0);do if(e){f=c[z+28>>2]|0;g=5128+(f<<2)|0;if((z|0)==(c[g>>2]|0)){c[g>>2]=x;if(!x){c[1207]=c[1207]&~(1<<f);break}}else{if(e>>>0<(c[1210]|0)>>>0)Wa();f=e+16|0;if((c[f>>2]|0)==(z|0))c[f>>2]=x;else c[e+20>>2]=x;if(!x)break}f=c[1210]|0;if(x>>>0<f>>>0)Wa();c[x+24>>2]=e;e=c[z+16>>2]|0;do if(e)if(e>>>0<f>>>0)Wa();else{c[x+16>>2]=e;c[e+24>>2]=x;break}while(0);e=c[z+20>>2]|0;if(e)if(e>>>0<(c[1210]|0)>>>0)Wa();else{c[x+20>>2]=e;c[e+24>>2]=x;break}}while(0);b:do if(A>>>0>=16){c[z+4>>2]=a|3;c[z+(a|4)>>2]=A|1;c[z+(A+a)>>2]=A;f=A>>>3;if(A>>>0<256){h=f<<1;e=4864+(h<<2)|0;g=c[1206]|0;f=1<<f;do if(!(g&f)){c[1206]=g|f;w=4864+(h+2<<2)|0;v=e}else{f=4864+(h+2<<2)|0;g=c[f>>2]|0;if(g>>>0>=(c[1210]|0)>>>0){w=f;v=g;break}Wa()}while(0);c[w>>2]=d;c[v+12>>2]=d;c[z+(a+8)>>2]=v;c[z+(a+12)>>2]=e;break}e=A>>>8;if(e)if(A>>>0>16777215)e=31;else{G=(e+1048320|0)>>>16&8;H=e<<G;F=(H+520192|0)>>>16&4;H=H<<F;e=(H+245760|0)>>>16&2;e=14-(F|G|e)+(H<<e>>>15)|0;e=A>>>(e+7|0)&1|e<<1}else e=0;f=5128+(e<<2)|0;c[z+(a+28)>>2]=e;c[z+(a+20)>>2]=0;c[z+(a+16)>>2]=0;g=c[1207]|0;h=1<<e;if(!(g&h)){c[1207]=g|h;c[f>>2]=d;c[z+(a+24)>>2]=f;c[z+(a+12)>>2]=d;c[z+(a+8)>>2]=d;break}h=c[f>>2]|0;if((e|0)==31)e=0;else e=25-(e>>>1)|0;c:do if((c[h+4>>2]&-8|0)!=(A|0)){e=A<<e;while(1){g=h+(e>>>31<<2)+16|0;f=c[g>>2]|0;if(!f)break;if((c[f+4>>2]&-8|0)==(A|0)){p=f;break c}else{e=e<<1;h=f}}if(g>>>0<(c[1210]|0)>>>0)Wa();else{c[g>>2]=d;c[z+(a+24)>>2]=h;c[z+(a+12)>>2]=d;c[z+(a+8)>>2]=d;break b}}else p=h;while(0);f=p+8|0;e=c[f>>2]|0;H=c[1210]|0;if(p>>>0>=H>>>0&e>>>0>=H>>>0){c[e+12>>2]=d;c[f>>2]=d;c[z+(a+8)>>2]=e;c[z+(a+12)>>2]=p;c[z+(a+24)>>2]=0;break}else Wa()}else{H=A+a|0;c[z+4>>2]=H|3;H=z+(H+4)|0;c[H>>2]=c[H>>2]|1}while(0);H=z+8|0;i=b;return H|0}}}else a=-1;while(0);p=c[1208]|0;if(p>>>0>=a>>>0){e=p-a|0;d=c[1211]|0;if(e>>>0>15){c[1211]=d+a;c[1208]=e;c[d+(a+4)>>2]=e|1;c[d+p>>2]=e;c[d+4>>2]=a|3}else{c[1208]=0;c[1211]=0;c[d+4>>2]=p|3;H=d+(p+4)|0;c[H>>2]=c[H>>2]|1}H=d+8|0;i=b;return H|0}p=c[1209]|0;if(p>>>0>a>>>0){G=p-a|0;c[1209]=G;H=c[1212]|0;c[1212]=H+a;c[H+(a+4)>>2]=G|1;c[H+4>>2]=a|3;H=H+8|0;i=b;return H|0}do if(!(c[1324]|0)){p=Ga(30)|0;if(!(p+ -1&p)){c[1326]=p;c[1325]=p;c[1327]=-1;c[1328]=-1;c[1329]=0;c[1317]=0;c[1324]=(Ya(0)|0)&-16^1431655768;break}else Wa()}while(0);x=a+48|0;p=c[1326]|0;w=a+47|0;A=p+w|0;p=0-p|0;v=A&p;if(v>>>0<=a>>>0){H=0;i=b;return H|0}z=c[1316]|0;if((z|0)!=0?(G=c[1314]|0,H=G+v|0,H>>>0<=G>>>0|H>>>0>z>>>0):0){H=0;i=b;return H|0}d:do if(!(c[1317]&4)){B=c[1212]|0;e:do if(B){z=5272|0;while(1){C=c[z>>2]|0;if(C>>>0<=B>>>0?(y=z+4|0,(C+(c[y>>2]|0)|0)>>>0>B>>>0):0)break;z=c[z+8>>2]|0;if(!z){o=181;break e}}if(z){A=A-(c[1209]|0)&p;if(A>>>0<2147483647){p=Aa(A|0)|0;if((p|0)==((c[z>>2]|0)+(c[y>>2]|0)|0)){z=A;o=190}else{z=A;o=191}}else z=0}else o=181}else o=181;while(0);do if((o|0)==181){y=Aa(0)|0;if((y|0)!=(-1|0)){A=y;z=c[1325]|0;p=z+ -1|0;if(!(p&A))z=v;else z=v-A+(p+A&0-z)|0;p=c[1314]|0;A=p+z|0;if(z>>>0>a>>>0&z>>>0<2147483647){H=c[1316]|0;if((H|0)!=0?A>>>0<=p>>>0|A>>>0>H>>>0:0){z=0;break}p=Aa(z|0)|0;if((p|0)==(y|0)){p=y;o=190}else o=191}else z=0}else z=0}while(0);f:do if((o|0)==190){if((p|0)!=(-1|0)){q=z;o=201;break d}}else if((o|0)==191){o=0-z|0;do if((p|0)!=(-1|0)&z>>>0<2147483647&x>>>0>z>>>0?(u=c[1326]|0,u=w-z+u&0-u,u>>>0<2147483647):0)if((Aa(u|0)|0)==(-1|0)){Aa(o|0)|0;z=0;break f}else{z=u+z|0;break}while(0);if((p|0)==(-1|0))z=0;else{q=z;o=201;break d}}while(0);c[1317]=c[1317]|4;o=198}else{z=0;o=198}while(0);if((((o|0)==198?v>>>0<2147483647:0)?(t=Aa(v|0)|0,s=Aa(0)|0,(t|0)!=(-1|0)&(s|0)!=(-1|0)&t>>>0<s>>>0):0)?(r=s-t|0,q=r>>>0>(a+40|0)>>>0,q):0){p=t;q=q?r:z;o=201}if((o|0)==201){r=(c[1314]|0)+q|0;c[1314]=r;if(r>>>0>(c[1315]|0)>>>0)c[1315]=r;r=c[1212]|0;g:do if(r){t=5272|0;while(1){s=c[t>>2]|0;v=t+4|0;w=c[v>>2]|0;if((p|0)==(s+w|0)){o=213;break}u=c[t+8>>2]|0;if(!u)break;else t=u}if(((o|0)==213?(c[t+12>>2]&8|0)==0:0)?r>>>0>=s>>>0&r>>>0<p>>>0:0){c[v>>2]=w+q;d=(c[1209]|0)+q|0;e=r+8|0;if(!(e&7))e=0;else e=0-e&7;H=d-e|0;c[1212]=r+e;c[1209]=H;c[r+(e+4)>>2]=H|1;c[r+(d+4)>>2]=40;c[1213]=c[1328];break}s=c[1210]|0;if(p>>>0<s>>>0){c[1210]=p;s=p}v=p+q|0;t=5272|0;while(1){if((c[t>>2]|0)==(v|0)){o=223;break}u=c[t+8>>2]|0;if(!u)break;else t=u}if((o|0)==223?(c[t+12>>2]&8|0)==0:0){c[t>>2]=p;h=t+4|0;c[h>>2]=(c[h>>2]|0)+q;h=p+8|0;if(!(h&7))h=0;else h=0-h&7;j=p+(q+8)|0;if(!(j&7))n=0;else n=0-j&7;o=p+(n+q)|0;k=h+a|0;j=p+k|0;m=o-(p+h)-a|0;c[p+(h+4)>>2]=a|3;h:do if((o|0)!=(r|0)){if((o|0)==(c[1211]|0)){H=(c[1208]|0)+m|0;c[1208]=H;c[1211]=j;c[p+(k+4)>>2]=H|1;c[p+(H+k)>>2]=H;break}r=q+4|0;u=c[p+(r+n)>>2]|0;if((u&3|0)==1){a=u&-8;t=u>>>3;i:do if(u>>>0>=256){l=c[p+((n|24)+q)>>2]|0;t=c[p+(q+12+n)>>2]|0;do if((t|0)==(o|0)){v=n|16;u=p+(r+v)|0;t=c[u>>2]|0;if(!t){u=p+(v+q)|0;t=c[u>>2]|0;if(!t){g=0;break}}while(1){w=t+20|0;v=c[w>>2]|0;if(v){t=v;u=w;continue}w=t+16|0;v=c[w>>2]|0;if(!v)break;else{t=v;u=w}}if(u>>>0<s>>>0)Wa();else{c[u>>2]=0;g=t;break}}else{u=c[p+((n|8)+q)>>2]|0;if(u>>>0<s>>>0)Wa();v=u+12|0;if((c[v>>2]|0)!=(o|0))Wa();s=t+8|0;if((c[s>>2]|0)==(o|0)){c[v>>2]=t;c[s>>2]=u;g=t;break}else Wa()}while(0);if(!l)break;s=c[p+(q+28+n)>>2]|0;t=5128+(s<<2)|0;do if((o|0)!=(c[t>>2]|0)){if(l>>>0<(c[1210]|0)>>>0)Wa();s=l+16|0;if((c[s>>2]|0)==(o|0))c[s>>2]=g;else c[l+20>>2]=g;if(!g)break i}else{c[t>>2]=g;if(g)break;c[1207]=c[1207]&~(1<<s);break i}while(0);o=c[1210]|0;if(g>>>0<o>>>0)Wa();c[g+24>>2]=l;s=n|16;l=c[p+(s+q)>>2]|0;do if(l)if(l>>>0<o>>>0)Wa();else{c[g+16>>2]=l;c[l+24>>2]=g;break}while(0);l=c[p+(r+s)>>2]|0;if(!l)break;if(l>>>0<(c[1210]|0)>>>0)Wa();else{c[g+20>>2]=l;c[l+24>>2]=g;break}}else{g=c[p+((n|8)+q)>>2]|0;r=c[p+(q+12+n)>>2]|0;u=4864+(t<<1<<2)|0;do if((g|0)!=(u|0)){if(g>>>0<s>>>0)Wa();if((c[g+12>>2]|0)==(o|0))break;Wa()}while(0);if((r|0)==(g|0)){c[1206]=c[1206]&~(1<<t);break}do if((r|0)==(u|0))l=r+8|0;else{if(r>>>0<s>>>0)Wa();s=r+8|0;if((c[s>>2]|0)==(o|0)){l=s;break}Wa()}while(0);c[g+12>>2]=r;c[l>>2]=g}while(0);o=p+((a|n)+q)|0;m=a+m|0}g=o+4|0;c[g>>2]=c[g>>2]&-2;c[p+(k+4)>>2]=m|1;c[p+(m+k)>>2]=m;g=m>>>3;if(m>>>0<256){l=g<<1;d=4864+(l<<2)|0;m=c[1206]|0;g=1<<g;do if(!(m&g)){c[1206]=m|g;f=4864+(l+2<<2)|0;e=d}else{l=4864+(l+2<<2)|0;g=c[l>>2]|0;if(g>>>0>=(c[1210]|0)>>>0){f=l;e=g;break}Wa()}while(0);c[f>>2]=j;c[e+12>>2]=j;c[p+(k+8)>>2]=e;c[p+(k+12)>>2]=d;break}e=m>>>8;do if(!e)e=0;else{if(m>>>0>16777215){e=31;break}G=(e+1048320|0)>>>16&8;H=e<<G;F=(H+520192|0)>>>16&4;H=H<<F;e=(H+245760|0)>>>16&2;e=14-(F|G|e)+(H<<e>>>15)|0;e=m>>>(e+7|0)&1|e<<1}while(0);l=5128+(e<<2)|0;c[p+(k+28)>>2]=e;c[p+(k+20)>>2]=0;c[p+(k+16)>>2]=0;g=c[1207]|0;f=1<<e;if(!(g&f)){c[1207]=g|f;c[l>>2]=j;c[p+(k+24)>>2]=l;c[p+(k+12)>>2]=j;c[p+(k+8)>>2]=j;break}f=c[l>>2]|0;if((e|0)==31)e=0;else e=25-(e>>>1)|0;j:do if((c[f+4>>2]&-8|0)!=(m|0)){e=m<<e;while(1){g=f+(e>>>31<<2)+16|0;l=c[g>>2]|0;if(!l)break;if((c[l+4>>2]&-8|0)==(m|0)){d=l;break j}else{e=e<<1;f=l}}if(g>>>0<(c[1210]|0)>>>0)Wa();else{c[g>>2]=j;c[p+(k+24)>>2]=f;c[p+(k+12)>>2]=j;c[p+(k+8)>>2]=j;break h}}else d=f;while(0);e=d+8|0;f=c[e>>2]|0;H=c[1210]|0;if(d>>>0>=H>>>0&f>>>0>=H>>>0){c[f+12>>2]=j;c[e>>2]=j;c[p+(k+8)>>2]=f;c[p+(k+12)>>2]=d;c[p+(k+24)>>2]=0;break}else Wa()}else{H=(c[1209]|0)+m|0;c[1209]=H;c[1212]=j;c[p+(k+4)>>2]=H|1}while(0);H=p+(h|8)|0;i=b;return H|0}e=5272|0;while(1){d=c[e>>2]|0;if(d>>>0<=r>>>0?(n=c[e+4>>2]|0,m=d+n|0,m>>>0>r>>>0):0)break;e=c[e+8>>2]|0}e=d+(n+ -39)|0;if(!(e&7))e=0;else e=0-e&7;d=d+(n+ -47+e)|0;d=d>>>0<(r+16|0)>>>0?r:d;e=d+8|0;f=p+8|0;if(!(f&7))f=0;else f=0-f&7;H=q+ -40-f|0;c[1212]=p+f;c[1209]=H;c[p+(f+4)>>2]=H|1;c[p+(q+ -36)>>2]=40;c[1213]=c[1328];c[d+4>>2]=27;c[e+0>>2]=c[1318];c[e+4>>2]=c[1319];c[e+8>>2]=c[1320];c[e+12>>2]=c[1321];c[1318]=p;c[1319]=q;c[1321]=0;c[1320]=e;e=d+28|0;c[e>>2]=7;if((d+32|0)>>>0<m>>>0)do{H=e;e=e+4|0;c[e>>2]=7}while((H+8|0)>>>0<m>>>0);if((d|0)!=(r|0)){d=d-r|0;e=r+(d+4)|0;c[e>>2]=c[e>>2]&-2;c[r+4>>2]=d|1;c[r+d>>2]=d;e=d>>>3;if(d>>>0<256){f=e<<1;d=4864+(f<<2)|0;g=c[1206]|0;e=1<<e;do if(!(g&e)){c[1206]=g|e;k=4864+(f+2<<2)|0;j=d}else{f=4864+(f+2<<2)|0;e=c[f>>2]|0;if(e>>>0>=(c[1210]|0)>>>0){k=f;j=e;break}Wa()}while(0);c[k>>2]=r;c[j+12>>2]=r;c[r+8>>2]=j;c[r+12>>2]=d;break}e=d>>>8;if(e)if(d>>>0>16777215)e=31;else{G=(e+1048320|0)>>>16&8;H=e<<G;F=(H+520192|0)>>>16&4;H=H<<F;e=(H+245760|0)>>>16&2;e=14-(F|G|e)+(H<<e>>>15)|0;e=d>>>(e+7|0)&1|e<<1}else e=0;j=5128+(e<<2)|0;c[r+28>>2]=e;c[r+20>>2]=0;c[r+16>>2]=0;f=c[1207]|0;g=1<<e;if(!(f&g)){c[1207]=f|g;c[j>>2]=r;c[r+24>>2]=j;c[r+12>>2]=r;c[r+8>>2]=r;break}f=c[j>>2]|0;if((e|0)==31)e=0;else e=25-(e>>>1)|0;k:do if((c[f+4>>2]&-8|0)!=(d|0)){e=d<<e;j=f;while(1){f=j+(e>>>31<<2)+16|0;g=c[f>>2]|0;if(!g)break;if((c[g+4>>2]&-8|0)==(d|0)){h=g;break k}else{e=e<<1;j=g}}if(f>>>0<(c[1210]|0)>>>0)Wa();else{c[f>>2]=r;c[r+24>>2]=j;c[r+12>>2]=r;c[r+8>>2]=r;break g}}else h=f;while(0);e=h+8|0;d=c[e>>2]|0;H=c[1210]|0;if(h>>>0>=H>>>0&d>>>0>=H>>>0){c[d+12>>2]=r;c[e>>2]=r;c[r+8>>2]=d;c[r+12>>2]=h;c[r+24>>2]=0;break}else Wa()}}else{H=c[1210]|0;if((H|0)==0|p>>>0<H>>>0)c[1210]=p;c[1318]=p;c[1319]=q;c[1321]=0;c[1215]=c[1324];c[1214]=-1;d=0;do{H=d<<1;G=4864+(H<<2)|0;c[4864+(H+3<<2)>>2]=G;c[4864+(H+2<<2)>>2]=G;d=d+1|0}while((d|0)!=32);d=p+8|0;if(!(d&7))d=0;else d=0-d&7;H=q+ -40-d|0;c[1212]=p+d;c[1209]=H;c[p+(d+4)>>2]=H|1;c[p+(q+ -36)>>2]=40;c[1213]=c[1328]}while(0);d=c[1209]|0;if(d>>>0>a>>>0){G=d-a|0;c[1209]=G;H=c[1212]|0;c[1212]=H+a;c[H+(a+4)>>2]=G|1;c[H+4>>2]=a|3;H=H+8|0;i=b;return H|0}}c[(Oa()|0)>>2]=12;H=0;i=b;return H|0}function Td(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;b=i;if(!a){i=b;return}q=a+ -8|0;r=c[1210]|0;if(q>>>0<r>>>0)Wa();n=c[a+ -4>>2]|0;m=n&3;if((m|0)==1)Wa();j=n&-8;h=a+(j+ -8)|0;do if(!(n&1)){u=c[q>>2]|0;if(!m){i=b;return}q=-8-u|0;n=a+q|0;m=u+j|0;if(n>>>0<r>>>0)Wa();if((n|0)==(c[1211]|0)){e=a+(j+ -4)|0;o=c[e>>2]|0;if((o&3|0)!=3){e=n;o=m;break}c[1208]=m;c[e>>2]=o&-2;c[a+(q+4)>>2]=m|1;c[h>>2]=m;i=b;return}t=u>>>3;if(u>>>0<256){e=c[a+(q+8)>>2]|0;o=c[a+(q+12)>>2]|0;p=4864+(t<<1<<2)|0;if((e|0)!=(p|0)){if(e>>>0<r>>>0)Wa();if((c[e+12>>2]|0)!=(n|0))Wa()}if((o|0)==(e|0)){c[1206]=c[1206]&~(1<<t);e=n;o=m;break}if((o|0)!=(p|0)){if(o>>>0<r>>>0)Wa();p=o+8|0;if((c[p>>2]|0)==(n|0))s=p;else Wa()}else s=o+8|0;c[e+12>>2]=o;c[s>>2]=e;e=n;o=m;break}s=c[a+(q+24)>>2]|0;t=c[a+(q+12)>>2]|0;do if((t|0)==(n|0)){u=a+(q+20)|0;t=c[u>>2]|0;if(!t){u=a+(q+16)|0;t=c[u>>2]|0;if(!t){p=0;break}}while(1){v=t+20|0;w=c[v>>2]|0;if(w){t=w;u=v;continue}v=t+16|0;w=c[v>>2]|0;if(!w)break;else{t=w;u=v}}if(u>>>0<r>>>0)Wa();else{c[u>>2]=0;p=t;break}}else{u=c[a+(q+8)>>2]|0;if(u>>>0<r>>>0)Wa();r=u+12|0;if((c[r>>2]|0)!=(n|0))Wa();v=t+8|0;if((c[v>>2]|0)==(n|0)){c[r>>2]=t;c[v>>2]=u;p=t;break}else Wa()}while(0);if(s){r=c[a+(q+28)>>2]|0;t=5128+(r<<2)|0;if((n|0)==(c[t>>2]|0)){c[t>>2]=p;if(!p){c[1207]=c[1207]&~(1<<r);e=n;o=m;break}}else{if(s>>>0<(c[1210]|0)>>>0)Wa();r=s+16|0;if((c[r>>2]|0)==(n|0))c[r>>2]=p;else c[s+20>>2]=p;if(!p){e=n;o=m;break}}r=c[1210]|0;if(p>>>0<r>>>0)Wa();c[p+24>>2]=s;s=c[a+(q+16)>>2]|0;do if(s)if(s>>>0<r>>>0)Wa();else{c[p+16>>2]=s;c[s+24>>2]=p;break}while(0);q=c[a+(q+20)>>2]|0;if(q)if(q>>>0<(c[1210]|0)>>>0)Wa();else{c[p+20>>2]=q;c[q+24>>2]=p;e=n;o=m;break}else{e=n;o=m}}else{e=n;o=m}}else{e=q;o=j}while(0);if(e>>>0>=h>>>0)Wa();m=a+(j+ -4)|0;n=c[m>>2]|0;if(!(n&1))Wa();if(!(n&2)){if((h|0)==(c[1212]|0)){w=(c[1209]|0)+o|0;c[1209]=w;c[1212]=e;c[e+4>>2]=w|1;if((e|0)!=(c[1211]|0)){i=b;return}c[1211]=0;c[1208]=0;i=b;return}if((h|0)==(c[1211]|0)){w=(c[1208]|0)+o|0;c[1208]=w;c[1211]=e;c[e+4>>2]=w|1;c[e+w>>2]=w;i=b;return}o=(n&-8)+o|0;m=n>>>3;do if(n>>>0>=256){l=c[a+(j+16)>>2]|0;m=c[a+(j|4)>>2]|0;do if((m|0)==(h|0)){n=a+(j+12)|0;m=c[n>>2]|0;if(!m){n=a+(j+8)|0;m=c[n>>2]|0;if(!m){k=0;break}}while(1){q=m+20|0;p=c[q>>2]|0;if(p){m=p;n=q;continue}p=m+16|0;q=c[p>>2]|0;if(!q)break;else{m=q;n=p}}if(n>>>0<(c[1210]|0)>>>0)Wa();else{c[n>>2]=0;k=m;break}}else{n=c[a+j>>2]|0;if(n>>>0<(c[1210]|0)>>>0)Wa();p=n+12|0;if((c[p>>2]|0)!=(h|0))Wa();q=m+8|0;if((c[q>>2]|0)==(h|0)){c[p>>2]=m;c[q>>2]=n;k=m;break}else Wa()}while(0);if(l){m=c[a+(j+20)>>2]|0;n=5128+(m<<2)|0;if((h|0)==(c[n>>2]|0)){c[n>>2]=k;if(!k){c[1207]=c[1207]&~(1<<m);break}}else{if(l>>>0<(c[1210]|0)>>>0)Wa();m=l+16|0;if((c[m>>2]|0)==(h|0))c[m>>2]=k;else c[l+20>>2]=k;if(!k)break}h=c[1210]|0;if(k>>>0<h>>>0)Wa();c[k+24>>2]=l;l=c[a+(j+8)>>2]|0;do if(l)if(l>>>0<h>>>0)Wa();else{c[k+16>>2]=l;c[l+24>>2]=k;break}while(0);h=c[a+(j+12)>>2]|0;if(h)if(h>>>0<(c[1210]|0)>>>0)Wa();else{c[k+20>>2]=h;c[h+24>>2]=k;break}}}else{k=c[a+j>>2]|0;j=c[a+(j|4)>>2]|0;a=4864+(m<<1<<2)|0;if((k|0)!=(a|0)){if(k>>>0<(c[1210]|0)>>>0)Wa();if((c[k+12>>2]|0)!=(h|0))Wa()}if((j|0)==(k|0)){c[1206]=c[1206]&~(1<<m);break}if((j|0)!=(a|0)){if(j>>>0<(c[1210]|0)>>>0)Wa();a=j+8|0;if((c[a>>2]|0)==(h|0))l=a;else Wa()}else l=j+8|0;c[k+12>>2]=j;c[l>>2]=k}while(0);c[e+4>>2]=o|1;c[e+o>>2]=o;if((e|0)==(c[1211]|0)){c[1208]=o;i=b;return}}else{c[m>>2]=n&-2;c[e+4>>2]=o|1;c[e+o>>2]=o}h=o>>>3;if(o>>>0<256){j=h<<1;d=4864+(j<<2)|0;k=c[1206]|0;h=1<<h;if(k&h){j=4864+(j+2<<2)|0;h=c[j>>2]|0;if(h>>>0<(c[1210]|0)>>>0)Wa();else{f=j;g=h}}else{c[1206]=k|h;f=4864+(j+2<<2)|0;g=d}c[f>>2]=e;c[g+12>>2]=e;c[e+8>>2]=g;c[e+12>>2]=d;i=b;return}f=o>>>8;if(f)if(o>>>0>16777215)f=31;else{v=(f+1048320|0)>>>16&8;w=f<<v;u=(w+520192|0)>>>16&4;w=w<<u;f=(w+245760|0)>>>16&2;f=14-(u|v|f)+(w<<f>>>15)|0;f=o>>>(f+7|0)&1|f<<1}else f=0;g=5128+(f<<2)|0;c[e+28>>2]=f;c[e+20>>2]=0;c[e+16>>2]=0;j=c[1207]|0;h=1<<f;a:do if(j&h){g=c[g>>2]|0;if((f|0)==31)f=0;else f=25-(f>>>1)|0;b:do if((c[g+4>>2]&-8|0)!=(o|0)){f=o<<f;while(1){j=g+(f>>>31<<2)+16|0;h=c[j>>2]|0;if(!h)break;if((c[h+4>>2]&-8|0)==(o|0)){d=h;break b}else{f=f<<1;g=h}}if(j>>>0<(c[1210]|0)>>>0)Wa();else{c[j>>2]=e;c[e+24>>2]=g;c[e+12>>2]=e;c[e+8>>2]=e;break a}}else d=g;while(0);g=d+8|0;f=c[g>>2]|0;w=c[1210]|0;if(d>>>0>=w>>>0&f>>>0>=w>>>0){c[f+12>>2]=e;c[g>>2]=e;c[e+8>>2]=f;c[e+12>>2]=d;c[e+24>>2]=0;break}else Wa()}else{c[1207]=j|h;c[g>>2]=e;c[e+24>>2]=g;c[e+12>>2]=e;c[e+8>>2]=e}while(0);w=(c[1214]|0)+ -1|0;c[1214]=w;if(!w)d=5280|0;else{i=b;return}while(1){d=c[d>>2]|0;if(!d)break;else d=d+8|0}c[1214]=-1;i=b;return}function Ud(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;do if(a){if(b>>>0>4294967231){c[(Oa()|0)>>2]=12;e=0;break}if(b>>>0<11)e=16;else e=b+11&-8;e=fe(a+ -8|0,e)|0;if(e){e=e+8|0;break}e=Sd(b)|0;if(!e)e=0;else{f=c[a+ -4>>2]|0;f=(f&-8)-((f&3|0)==0?8:4)|0;pe(e|0,a|0,(f>>>0<b>>>0?f:b)|0)|0;Td(a)}}else e=Sd(b)|0;while(0);i=d;return e|0}function Vd(a){a=a|0;if((a|0)==32)a=1;else a=(a+ -9|0)>>>0<5;return a&1|0}function Wd(b,e,f,g,h){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;j=i;if(e>>>0>36){c[(Oa()|0)>>2]=22;s=0;t=0;F=s;i=j;return t|0}k=b+4|0;l=b+100|0;do{m=c[k>>2]|0;if(m>>>0<(c[l>>2]|0)>>>0){c[k>>2]=m+1;o=d[m>>0]|0}else o=Zd(b)|0}while((Vd(o)|0)!=0);do if((o|0)==43|(o|0)==45){m=((o|0)==45)<<31>>31;n=c[k>>2]|0;if(n>>>0<(c[l>>2]|0)>>>0){c[k>>2]=n+1;o=d[n>>0]|0;break}else{o=Zd(b)|0;break}}else m=0;while(0);n=(e|0)==0;do if((e&-17|0)==0&(o|0)==48){o=c[k>>2]|0;if(o>>>0<(c[l>>2]|0)>>>0){c[k>>2]=o+1;o=d[o>>0]|0}else o=Zd(b)|0;if((o|32|0)!=120)if(n){e=8;f=46;break}else{f=32;break}e=c[k>>2]|0;if(e>>>0<(c[l>>2]|0)>>>0){c[k>>2]=e+1;o=d[e>>0]|0}else o=Zd(b)|0;if((d[o+5321>>0]|0)>15){g=(c[l>>2]|0)==0;if(!g)c[k>>2]=(c[k>>2]|0)+ -1;if(!f){Yd(b,0);s=0;t=0;F=s;i=j;return t|0}if(g){s=0;t=0;F=s;i=j;return t|0}c[k>>2]=(c[k>>2]|0)+ -1;s=0;t=0;F=s;i=j;return t|0}else{e=16;f=46}}else{e=n?10:e;if((d[o+5321>>0]|0)>>>0<e>>>0)f=32;else{if(c[l>>2]|0)c[k>>2]=(c[k>>2]|0)+ -1;Yd(b,0);c[(Oa()|0)>>2]=22;s=0;t=0;F=s;i=j;return t|0}}while(0);if((f|0)==32)if((e|0)==10){e=o+ -48|0;if(e>>>0<10){n=0;do{n=(n*10|0)+e|0;e=c[k>>2]|0;if(e>>>0<(c[l>>2]|0)>>>0){c[k>>2]=e+1;o=d[e>>0]|0}else o=Zd(b)|0;e=o+ -48|0}while(e>>>0<10&n>>>0<429496729);p=0}else{n=0;p=0}e=o+ -48|0;if(e>>>0<10){do{q=we(n|0,p|0,10,0)|0;r=F;s=((e|0)<0)<<31>>31;t=~s;if(r>>>0>t>>>0|(r|0)==(t|0)&q>>>0>~e>>>0)break;n=ne(q|0,r|0,e|0,s|0)|0;p=F;e=c[k>>2]|0;if(e>>>0<(c[l>>2]|0)>>>0){c[k>>2]=e+1;o=d[e>>0]|0}else o=Zd(b)|0;e=o+ -48|0}while(e>>>0<10&(p>>>0<429496729|(p|0)==429496729&n>>>0<2576980378));if(e>>>0<=9){e=10;f=72}}}else f=46;a:do if((f|0)==46){if(!(e+ -1&e)){f=a[5584+((e*23|0)>>>5&7)>>0]|0;r=a[o+5321>>0]|0;n=r&255;if(n>>>0<e>>>0){o=n;n=0;do{n=o|n<<f;o=c[k>>2]|0;if(o>>>0<(c[l>>2]|0)>>>0){c[k>>2]=o+1;s=d[o>>0]|0}else s=Zd(b)|0;r=a[s+5321>>0]|0;o=r&255}while(o>>>0<e>>>0&n>>>0<134217728);p=0}else{p=0;n=0;s=o}o=oe(-1,-1,f|0)|0;q=F;if((r&255)>>>0>=e>>>0|(p>>>0>q>>>0|(p|0)==(q|0)&n>>>0>o>>>0)){o=s;f=72;break}while(1){n=le(n|0,p|0,f|0)|0;p=F;n=r&255|n;r=c[k>>2]|0;if(r>>>0<(c[l>>2]|0)>>>0){c[k>>2]=r+1;s=d[r>>0]|0}else s=Zd(b)|0;r=a[s+5321>>0]|0;if((r&255)>>>0>=e>>>0|(p>>>0>q>>>0|(p|0)==(q|0)&n>>>0>o>>>0)){o=s;f=72;break a}}}r=a[o+5321>>0]|0;f=r&255;if(f>>>0<e>>>0){n=0;do{n=f+(ba(n,e)|0)|0;f=c[k>>2]|0;if(f>>>0<(c[l>>2]|0)>>>0){c[k>>2]=f+1;q=d[f>>0]|0}else q=Zd(b)|0;r=a[q+5321>>0]|0;f=r&255}while(f>>>0<e>>>0&n>>>0<119304647);p=0}else{n=0;p=0;q=o}if((r&255)>>>0<e>>>0){f=xe(-1,-1,e|0,0)|0;o=F;while(1){if(p>>>0>o>>>0|(p|0)==(o|0)&n>>>0>f>>>0){o=q;f=72;break a}s=we(n|0,p|0,e|0,0)|0;t=F;r=r&255;if(t>>>0>4294967295|(t|0)==-1&s>>>0>~r>>>0){o=q;f=72;break a}n=ne(r|0,0,s|0,t|0)|0;p=F;q=c[k>>2]|0;if(q>>>0<(c[l>>2]|0)>>>0){c[k>>2]=q+1;q=d[q>>0]|0}else q=Zd(b)|0;r=a[q+5321>>0]|0;if((r&255)>>>0>=e>>>0){o=q;f=72;break}}}else{o=q;f=72}}while(0);if((f|0)==72)if((d[o+5321>>0]|0)>>>0<e>>>0){do{f=c[k>>2]|0;if(f>>>0<(c[l>>2]|0)>>>0){c[k>>2]=f+1;f=d[f>>0]|0}else f=Zd(b)|0}while((d[f+5321>>0]|0)>>>0<e>>>0);c[(Oa()|0)>>2]=34;p=h;n=g}if(c[l>>2]|0)c[k>>2]=(c[k>>2]|0)+ -1;if(!(p>>>0<h>>>0|(p|0)==(h|0)&n>>>0<g>>>0)){if(!((g&1|0)!=0|0!=0|(m|0)!=0)){c[(Oa()|0)>>2]=34;t=ne(g|0,h|0,-1,-1)|0;s=F;F=s;i=j;return t|0}if(p>>>0>h>>>0|(p|0)==(h|0)&n>>>0>g>>>0){c[(Oa()|0)>>2]=34;s=h;t=g;F=s;i=j;return t|0}}t=((m|0)<0)<<31>>31;t=je(n^m|0,p^t|0,m|0,t|0)|0;s=F;F=s;i=j;return t|0}



function Xd(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,G=0.0,H=0,I=0.0,J=0.0,K=0.0,L=0.0;g=i;i=i+512|0;k=g;if(!e){e=24;j=-149}else if((e|0)==2){e=53;j=-1074}else if((e|0)==1){e=53;j=-1074}else{J=0.0;i=g;return+J}n=b+4|0;o=b+100|0;do{h=c[n>>2]|0;if(h>>>0<(c[o>>2]|0)>>>0){c[n>>2]=h+1;w=d[h>>0]|0}else w=Zd(b)|0}while((Vd(w)|0)!=0);do if((w|0)==43|(w|0)==45){h=1-(((w|0)==45&1)<<1)|0;m=c[n>>2]|0;if(m>>>0<(c[o>>2]|0)>>>0){c[n>>2]=m+1;w=d[m>>0]|0;break}else{w=Zd(b)|0;break}}else h=1;while(0);r=0;do{if((w|32|0)!=(a[5600+r>>0]|0))break;do if(r>>>0<7){m=c[n>>2]|0;if(m>>>0<(c[o>>2]|0)>>>0){c[n>>2]=m+1;w=d[m>>0]|0;break}else{w=Zd(b)|0;break}}while(0);r=r+1|0}while(r>>>0<8);do if((r|0)==3)p=23;else if((r|0)!=8){m=(f|0)!=0;if(r>>>0>3&m)if((r|0)==8)break;else{p=23;break}a:do if(!r){r=0;do{if((w|32|0)!=(a[5616+r>>0]|0))break a;do if(r>>>0<2){s=c[n>>2]|0;if(s>>>0<(c[o>>2]|0)>>>0){c[n>>2]=s+1;w=d[s>>0]|0;break}else{w=Zd(b)|0;break}}while(0);r=r+1|0}while(r>>>0<3)}while(0);if(!r){do if((w|0)==48){m=c[n>>2]|0;if(m>>>0<(c[o>>2]|0)>>>0){c[n>>2]=m+1;m=d[m>>0]|0}else m=Zd(b)|0;if((m|32|0)!=120){if(!(c[o>>2]|0)){w=48;break}c[n>>2]=(c[n>>2]|0)+ -1;w=48;break}k=c[n>>2]|0;if(k>>>0<(c[o>>2]|0)>>>0){c[n>>2]=k+1;z=d[k>>0]|0;x=0}else{z=Zd(b)|0;x=0}while(1){if((z|0)==46){p=70;break}else if((z|0)!=48){k=0;m=0;s=0;r=0;w=0;y=0;G=1.0;t=0;q=0.0;break}k=c[n>>2]|0;if(k>>>0<(c[o>>2]|0)>>>0){c[n>>2]=k+1;z=d[k>>0]|0;x=1;continue}else{z=Zd(b)|0;x=1;continue}}if((p|0)==70){k=c[n>>2]|0;if(k>>>0<(c[o>>2]|0)>>>0){c[n>>2]=k+1;z=d[k>>0]|0}else z=Zd(b)|0;if((z|0)==48){s=0;r=0;do{k=c[n>>2]|0;if(k>>>0<(c[o>>2]|0)>>>0){c[n>>2]=k+1;z=d[k>>0]|0}else z=Zd(b)|0;s=ne(s|0,r|0,-1,-1)|0;r=F}while((z|0)==48);k=0;m=0;x=1;w=1;y=0;G=1.0;t=0;q=0.0}else{k=0;m=0;s=0;r=0;w=1;y=0;G=1.0;t=0;q=0.0}}b:while(1){B=z+ -48|0;do if(B>>>0>=10){A=z|32;C=(z|0)==46;if(!((A+ -97|0)>>>0<6|C))break b;if(C)if(!w){s=m;r=k;w=1;break}else{z=46;break b}else{B=(z|0)>57?A+ -87|0:B;p=83;break}}else p=83;while(0);if((p|0)==83){p=0;do if(!((k|0)<0|(k|0)==0&m>>>0<8)){if((k|0)<0|(k|0)==0&m>>>0<14){J=G*.0625;I=J;q=q+J*+(B|0);break}if((B|0)==0|(y|0)!=0)I=G;else{y=1;I=G;q=q+G*.5}}else{I=G;t=B+(t<<4)|0}while(0);m=ne(m|0,k|0,1,0)|0;k=F;x=1;G=I}z=c[n>>2]|0;if(z>>>0<(c[o>>2]|0)>>>0){c[n>>2]=z+1;z=d[z>>0]|0;continue}else{z=Zd(b)|0;continue}}if(!x){e=(c[o>>2]|0)==0;if(!e)c[n>>2]=(c[n>>2]|0)+ -1;if(f){if(!e?(l=c[n>>2]|0,c[n>>2]=l+ -1,(w|0)!=0):0)c[n>>2]=l+ -2}else Yd(b,0);J=+(h|0)*0.0;i=g;return+J}p=(w|0)==0;l=p?m:s;p=p?k:r;if((k|0)<0|(k|0)==0&m>>>0<8)do{t=t<<4;m=ne(m|0,k|0,1,0)|0;k=F}while((k|0)<0|(k|0)==0&m>>>0<8);do if((z|32|0)==112){m=he(b,f)|0;k=F;if((m|0)==0&(k|0)==-2147483648)if(!f){Yd(b,0);J=0.0;i=g;return+J}else{if(!(c[o>>2]|0)){m=0;k=0;break}c[n>>2]=(c[n>>2]|0)+ -1;m=0;k=0;break}}else if(!(c[o>>2]|0)){m=0;k=0}else{c[n>>2]=(c[n>>2]|0)+ -1;m=0;k=0}while(0);l=le(l|0,p|0,2)|0;l=ne(l|0,F|0,-32,-1)|0;k=ne(l|0,F|0,m|0,k|0)|0;l=F;if(!t){J=+(h|0)*0.0;i=g;return+J}if((l|0)>0|(l|0)==0&k>>>0>(0-j|0)>>>0){c[(Oa()|0)>>2]=34;J=+(h|0)*1.7976931348623157e+308*1.7976931348623157e+308;i=g;return+J}H=j+ -106|0;E=((H|0)<0)<<31>>31;if((l|0)<(E|0)|(l|0)==(E|0)&k>>>0<H>>>0){c[(Oa()|0)>>2]=34;J=+(h|0)*2.2250738585072014e-308*2.2250738585072014e-308;i=g;return+J}if((t|0)>-1)do{t=t<<1;if(!(q>=.5))G=q;else{G=q+-1.0;t=t|1}q=q+G;k=ne(k|0,l|0,-1,-1)|0;l=F}while((t|0)>-1);j=je(32,0,j|0,((j|0)<0)<<31>>31|0)|0;j=ne(k|0,l|0,j|0,F|0)|0;H=F;if(0>(H|0)|0==(H|0)&e>>>0>j>>>0)if((j|0)<0){e=0;p=126}else{e=j;p=124}else p=124;if((p|0)==124)if((e|0)<53)p=126;else{j=e;G=+(h|0);I=0.0}if((p|0)==126){I=+(h|0);j=e;G=I;I=+Va(+(+_d(1.0,84-e|0)),+I)}H=(j|0)<32&q!=0.0&(t&1|0)==0;q=G*(H?0.0:q)+(I+G*+(((H&1)+t|0)>>>0))-I;if(!(q!=0.0))c[(Oa()|0)>>2]=34;J=+$d(q,k);i=g;return+J}while(0);m=j+e|0;l=0-m|0;B=0;while(1){if((w|0)==46){p=137;break}else if((w|0)!=48){D=0;C=0;A=0;break}r=c[n>>2]|0;if(r>>>0<(c[o>>2]|0)>>>0){c[n>>2]=r+1;w=d[r>>0]|0;B=1;continue}else{w=Zd(b)|0;B=1;continue}}if((p|0)==137){p=c[n>>2]|0;if(p>>>0<(c[o>>2]|0)>>>0){c[n>>2]=p+1;w=d[p>>0]|0}else w=Zd(b)|0;if((w|0)==48){D=0;C=0;do{D=ne(D|0,C|0,-1,-1)|0;C=F;p=c[n>>2]|0;if(p>>>0<(c[o>>2]|0)>>>0){c[n>>2]=p+1;w=d[p>>0]|0}else w=Zd(b)|0}while((w|0)==48);B=1;A=1}else{D=0;C=0;A=1}}c[k>>2]=0;z=w+ -48|0;E=(w|0)==46;c:do if(z>>>0<10|E){p=k+496|0;y=0;x=0;t=0;s=0;r=0;d:while(1){do if(E)if(!A){D=y;C=x;A=1}else break d;else{E=ne(y|0,x|0,1,0)|0;x=F;H=(w|0)!=48;if((s|0)>=125){if(!H){y=E;break}c[p>>2]=c[p>>2]|1;y=E;break}y=k+(s<<2)|0;if(t)z=w+ -48+((c[y>>2]|0)*10|0)|0;c[y>>2]=z;t=t+1|0;z=(t|0)==9;y=E;B=1;t=z?0:t;s=(z&1)+s|0;r=H?E:r}while(0);w=c[n>>2]|0;if(w>>>0<(c[o>>2]|0)>>>0){c[n>>2]=w+1;w=d[w>>0]|0}else w=Zd(b)|0;z=w+ -48|0;E=(w|0)==46;if(!(z>>>0<10|E)){p=160;break c}}z=(B|0)!=0;p=168}else{y=0;x=0;t=0;s=0;r=0;p=160}while(0);do if((p|0)==160){z=(A|0)==0;D=z?y:D;C=z?x:C;z=(B|0)!=0;if(!(z&(w|32|0)==101))if((w|0)>-1){p=168;break}else{p=170;break}z=he(b,f)|0;w=F;do if((z|0)==0&(w|0)==-2147483648)if(!f){Yd(b,0);J=0.0;i=g;return+J}else{if(!(c[o>>2]|0)){z=0;w=0;break}c[n>>2]=(c[n>>2]|0)+ -1;z=0;w=0;break}while(0);b=ne(z|0,w|0,D|0,C|0)|0;C=F}while(0);if((p|0)==168)if(c[o>>2]|0){c[n>>2]=(c[n>>2]|0)+ -1;if(z)b=D;else p=171}else p=170;if((p|0)==170)if(z)b=D;else p=171;if((p|0)==171){c[(Oa()|0)>>2]=22;Yd(b,0);J=0.0;i=g;return+J}n=c[k>>2]|0;if(!n){J=+(h|0)*0.0;i=g;return+J}if((b|0)==(y|0)&(C|0)==(x|0)&((x|0)<0|(x|0)==0&y>>>0<10)?e>>>0>30|(n>>>e|0)==0:0){J=+(h|0)*+(n>>>0);i=g;return+J}H=(j|0)/-2|0;E=((H|0)<0)<<31>>31;if((C|0)>(E|0)|(C|0)==(E|0)&b>>>0>H>>>0){c[(Oa()|0)>>2]=34;J=+(h|0)*1.7976931348623157e+308*1.7976931348623157e+308;i=g;return+J}H=j+ -106|0;E=((H|0)<0)<<31>>31;if((C|0)<(E|0)|(C|0)==(E|0)&b>>>0<H>>>0){c[(Oa()|0)>>2]=34;J=+(h|0)*2.2250738585072014e-308*2.2250738585072014e-308;i=g;return+J}if(t){if((t|0)<9){n=k+(s<<2)|0;o=c[n>>2]|0;do{o=o*10|0;t=t+1|0}while((t|0)!=9);c[n>>2]=o}s=s+1|0}if((r|0)<9?(r|0)<=(b|0)&(b|0)<18:0){if((b|0)==9){J=+(h|0)*+((c[k>>2]|0)>>>0);i=g;return+J}if((b|0)<9){J=+(h|0)*+((c[k>>2]|0)>>>0)/+(c[5632+(8-b<<2)>>2]|0);i=g;return+J}H=e+27+(ba(b,-3)|0)|0;n=c[k>>2]|0;if((H|0)>30|(n>>>H|0)==0){J=+(h|0)*+(n>>>0)*+(c[5632+(b+ -10<<2)>>2]|0);i=g;return+J}}n=(b|0)%9|0;if(!n){n=0;o=0}else{f=(b|0)>-1?n:n+9|0;p=c[5632+(8-f<<2)>>2]|0;if(s){r=1e9/(p|0)|0;n=0;o=0;t=0;do{D=k+(t<<2)|0;E=c[D>>2]|0;H=((E>>>0)/(p>>>0)|0)+o|0;c[D>>2]=H;o=ba((E>>>0)%(p>>>0)|0,r)|0;E=t;t=t+1|0;if((E|0)==(n|0)&(H|0)==0){n=t&127;b=b+ -9|0}}while((t|0)!=(s|0));if(o){c[k+(s<<2)>>2]=o;s=s+1|0}}else{n=0;s=0}o=0;b=9-f+b|0}e:while(1){f=k+(n<<2)|0;if((b|0)<18){do{r=0;f=s+127|0;while(1){f=f&127;p=k+(f<<2)|0;t=le(c[p>>2]|0,0,29)|0;t=ne(t|0,F|0,r|0,0)|0;r=F;if(r>>>0>0|(r|0)==0&t>>>0>1e9){H=xe(t|0,r|0,1e9,0)|0;t=ye(t|0,r|0,1e9,0)|0;r=H}else r=0;c[p>>2]=t;p=(f|0)==(n|0);if(!((f|0)!=(s+127&127|0)|p))s=(t|0)==0?f:s;if(p)break;else f=f+ -1|0}o=o+ -29|0}while((r|0)==0)}else{if((b|0)!=18)break;do{if((c[f>>2]|0)>>>0>=9007199){b=18;break e}r=0;p=s+127|0;while(1){p=p&127;t=k+(p<<2)|0;w=le(c[t>>2]|0,0,29)|0;w=ne(w|0,F|0,r|0,0)|0;r=F;if(r>>>0>0|(r|0)==0&w>>>0>1e9){H=xe(w|0,r|0,1e9,0)|0;w=ye(w|0,r|0,1e9,0)|0;r=H}else r=0;c[t>>2]=w;t=(p|0)==(n|0);if(!((p|0)!=(s+127&127|0)|t))s=(w|0)==0?p:s;if(t)break;else p=p+ -1|0}o=o+ -29|0}while((r|0)==0)}n=n+127&127;if((n|0)==(s|0)){H=s+127&127;s=k+((s+126&127)<<2)|0;c[s>>2]=c[s>>2]|c[k+(H<<2)>>2];s=H}c[k+(n<<2)>>2]=r;b=b+9|0}f:while(1){f=s+1&127;p=k+((s+127&127)<<2)|0;while(1){t=(b|0)==18;r=(b|0)>27?9:1;while(1){w=0;while(1){x=w+n&127;if((x|0)==(s|0)){w=2;break}y=c[k+(x<<2)>>2]|0;z=c[5624+(w<<2)>>2]|0;if(y>>>0<z>>>0){w=2;break}x=w+1|0;if(y>>>0>z>>>0)break;if((x|0)<2)w=x;else{w=x;break}}if((w|0)==2&t)break f;o=r+o|0;if((n|0)==(s|0))n=s;else break}t=(1<<r)+ -1|0;w=1e9>>>r;x=n;y=0;do{D=k+(n<<2)|0;E=c[D>>2]|0;H=(E>>>r)+y|0;c[D>>2]=H;y=ba(E&t,w)|0;H=(n|0)==(x|0)&(H|0)==0;n=n+1&127;b=H?b+ -9|0:b;x=H?n:x}while((n|0)!=(s|0));if(!y){n=x;continue}if((f|0)!=(x|0))break;c[p>>2]=c[p>>2]|1;n=x}c[k+(s<<2)>>2]=y;n=x;s=f}b=n&127;if((b|0)==(s|0)){c[k+(f+ -1<<2)>>2]=0;s=f}G=+((c[k+(b<<2)>>2]|0)>>>0);b=n+1&127;if((b|0)==(s|0)){s=s+1&127;c[k+(s+ -1<<2)>>2]=0}q=+(h|0);I=q*(G*1.0e9+ +((c[k+(b<<2)>>2]|0)>>>0));h=o+53|0;j=h-j|0;if((j|0)<(e|0))if((j|0)<0){e=0;b=1;p=244}else{e=j;b=1;p=243}else{b=0;p=243}if((p|0)==243)if((e|0)<53)p=244;else{G=0.0;J=0.0}if((p|0)==244){L=+Va(+(+_d(1.0,105-e|0)),+I);K=+cb(+I,+(+_d(1.0,53-e|0)));G=L;J=K;I=L+(I-K)}f=n+2&127;do if((f|0)!=(s|0)){k=c[k+(f<<2)>>2]|0;do if(k>>>0>=5e8){if(k>>>0>5e8){J=q*.75+J;break}if((n+3&127|0)==(s|0)){J=q*.5+J;break}else{J=q*.75+J;break}}else{if((k|0)==0?(n+3&127|0)==(s|0):0)break;J=q*.25+J}while(0);if((53-e|0)<=1)break;if(+cb(+J,1.0)!=0.0)break;J=J+1.0}while(0);q=I+J-G;do if((h&2147483647|0)>(-2-m|0)){if(+Q(+q)>=9007199254740992.0){b=(b|0)!=0&(e|0)==(j|0)?0:b;o=o+1|0;q=q*.5}if((o+50|0)<=(l|0)?!((b|0)!=0&J!=0.0):0)break;c[(Oa()|0)>>2]=34}while(0);L=+$d(q,o);i=g;return+L}else if((r|0)==3){e=c[n>>2]|0;if(e>>>0<(c[o>>2]|0)>>>0){c[n>>2]=e+1;e=d[e>>0]|0}else e=Zd(b)|0;if((e|0)==40)e=1;else{if(!(c[o>>2]|0)){L=u;i=g;return+L}c[n>>2]=(c[n>>2]|0)+ -1;L=u;i=g;return+L}while(1){h=c[n>>2]|0;if(h>>>0<(c[o>>2]|0)>>>0){c[n>>2]=h+1;h=d[h>>0]|0}else h=Zd(b)|0;if(!((h+ -48|0)>>>0<10|(h+ -65|0)>>>0<26)?!((h+ -97|0)>>>0<26|(h|0)==95):0)break;e=e+1|0}if((h|0)==41){L=u;i=g;return+L}h=(c[o>>2]|0)==0;if(!h)c[n>>2]=(c[n>>2]|0)+ -1;if(!m){c[(Oa()|0)>>2]=22;Yd(b,0);L=0.0;i=g;return+L}if((e|0)==0|h){L=u;i=g;return+L}do{e=e+ -1|0;c[n>>2]=(c[n>>2]|0)+ -1}while((e|0)!=0);q=u;i=g;return+q}else{if(c[o>>2]|0)c[n>>2]=(c[n>>2]|0)+ -1;c[(Oa()|0)>>2]=22;Yd(b,0);L=0.0;i=g;return+L}}while(0);if((p|0)==23){e=(c[o>>2]|0)==0;if(!e)c[n>>2]=(c[n>>2]|0)+ -1;if(!(r>>>0<4|(f|0)==0|e))do{c[n>>2]=(c[n>>2]|0)+ -1;r=r+ -1|0}while(r>>>0>3)}L=+(h|0)*v;i=g;return+L}function Yd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;c[a+104>>2]=b;f=c[a+8>>2]|0;e=c[a+4>>2]|0;g=f-e|0;c[a+108>>2]=g;if((b|0)!=0&(g|0)>(b|0)){c[a+100>>2]=e+b;i=d;return}else{c[a+100>>2]=f;i=d;return}}function Zd(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0;f=i;j=b+104|0;l=c[j>>2]|0;if(!((l|0)!=0?(c[b+108>>2]|0)>=(l|0):0))k=3;if((k|0)==3?(e=be(b)|0,(e|0)>=0):0){k=c[j>>2]|0;j=c[b+8>>2]|0;if((k|0)!=0?(g=c[b+4>>2]|0,h=k-(c[b+108>>2]|0)+ -1|0,(j-g|0)>(h|0)):0)c[b+100>>2]=g+h;else c[b+100>>2]=j;g=c[b+4>>2]|0;if(j){l=b+108|0;c[l>>2]=j+1-g+(c[l>>2]|0)}b=g+ -1|0;if((d[b>>0]|0|0)==(e|0)){l=e;i=f;return l|0}a[b>>0]=e;l=e;i=f;return l|0}c[b+100>>2]=0;l=-1;i=f;return l|0}function _d(a,b){a=+a;b=b|0;var d=0,e=0;d=i;if((b|0)>1023){a=a*8.98846567431158e+307;e=b+ -1023|0;if((e|0)>1023){b=b+ -2046|0;b=(b|0)>1023?1023:b;a=a*8.98846567431158e+307}else b=e}else if((b|0)<-1022){a=a*2.2250738585072014e-308;e=b+1022|0;if((e|0)<-1022){b=b+2044|0;b=(b|0)<-1022?-1022:b;a=a*2.2250738585072014e-308}else b=e}b=le(b+1023|0,0,52)|0;e=F;c[k>>2]=b;c[k+4>>2]=e;a=a*+h[k>>3];i=d;return+a}function $d(a,b){a=+a;b=b|0;var c=0;c=i;a=+_d(a,b);i=c;return+a}function ae(b){b=b|0;var d=0,e=0,f=0;e=i;f=b+74|0;d=a[f>>0]|0;a[f>>0]=d+255|d;f=b+20|0;d=b+44|0;if((c[f>>2]|0)>>>0>(c[d>>2]|0)>>>0)eb[c[b+36>>2]&1](b,0,0)|0;c[b+16>>2]=0;c[b+28>>2]=0;c[f>>2]=0;f=c[b>>2]|0;if(!(f&20)){f=c[d>>2]|0;c[b+8>>2]=f;c[b+4>>2]=f;f=0;i=e;return f|0}if(!(f&4)){f=-1;i=e;return f|0}c[b>>2]=f|32;f=-1;i=e;return f|0}function be(a){a=a|0;var b=0,e=0;b=i;i=i+16|0;e=b;if((c[a+8>>2]|0)==0?(ae(a)|0)!=0:0)a=-1;else if((eb[c[a+32>>2]&1](a,e,1)|0)==1)a=d[e>>0]|0;else a=-1;i=b;return a|0}function ce(a,b){a=a|0;b=b|0;var d=0,e=0,f=0.0,g=0,h=0;d=i;i=i+112|0;e=d;h=e+0|0;g=h+112|0;do{c[h>>2]=0;h=h+4|0}while((h|0)<(g|0));g=e+4|0;c[g>>2]=a;h=e+8|0;c[h>>2]=-1;c[e+44>>2]=a;c[e+76>>2]=-1;Yd(e,0);f=+Xd(e,1,1);e=(c[g>>2]|0)-(c[h>>2]|0)+(c[e+108>>2]|0)|0;if(!b){i=d;return+f}if(e)a=a+e|0;c[b>>2]=a;i=d;return+f}function de(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+112|0;g=e;c[g>>2]=0;f=g+4|0;c[f>>2]=a;c[g+44>>2]=a;if((a|0)<0)c[g+8>>2]=-1;else c[g+8>>2]=a+2147483647;c[g+76>>2]=-1;Yd(g,0);d=Wd(g,d,1,-2147483648,0)|0;if(!b){i=e;return d|0}c[b>>2]=a+((c[f>>2]|0)+(c[g+108>>2]|0)-(c[g+8>>2]|0));i=e;return d|0}function ee(b,c){b=b|0;c=c|0;var d=0,e=0,f=0;d=i;f=a[b>>0]|0;e=a[c>>0]|0;if(f<<24>>24==0?1:f<<24>>24!=e<<24>>24)c=f;else{do{b=b+1|0;c=c+1|0;f=a[b>>0]|0;e=a[c>>0]|0}while(!(f<<24>>24==0?1:f<<24>>24!=e<<24>>24));c=f}i=d;return(c&255)-(e&255)|0}function fe(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;f=a+4|0;e=c[f>>2]|0;l=e&-8;j=a+l|0;m=c[1210]|0;h=e&3;if(!((h|0)!=1&a>>>0>=m>>>0&a>>>0<j>>>0))Wa();g=a+(l|4)|0;p=c[g>>2]|0;if(!(p&1))Wa();if(!h){if(b>>>0<256){r=0;i=d;return r|0}if(l>>>0>=(b+4|0)>>>0?(l-b|0)>>>0<=c[1326]<<1>>>0:0){r=a;i=d;return r|0}r=0;i=d;return r|0}if(l>>>0>=b>>>0){h=l-b|0;if(h>>>0<=15){r=a;i=d;return r|0}c[f>>2]=e&1|b|2;c[a+(b+4)>>2]=h|3;c[g>>2]=c[g>>2]|1;ge(a+b|0,h);r=a;i=d;return r|0}if((j|0)==(c[1212]|0)){g=(c[1209]|0)+l|0;if(g>>>0<=b>>>0){r=0;i=d;return r|0}r=g-b|0;c[f>>2]=e&1|b|2;c[a+(b+4)>>2]=r|1;c[1212]=a+b;c[1209]=r;r=a;i=d;return r|0}if((j|0)==(c[1211]|0)){h=(c[1208]|0)+l|0;if(h>>>0<b>>>0){r=0;i=d;return r|0}g=h-b|0;if(g>>>0>15){c[f>>2]=e&1|b|2;c[a+(b+4)>>2]=g|1;c[a+h>>2]=g;e=a+(h+4)|0;c[e>>2]=c[e>>2]&-2;e=a+b|0}else{c[f>>2]=e&1|h|2;e=a+(h+4)|0;c[e>>2]=c[e>>2]|1;e=0;g=0}c[1208]=g;c[1211]=e;r=a;i=d;return r|0}if(p&2){r=0;i=d;return r|0}g=(p&-8)+l|0;if(g>>>0<b>>>0){r=0;i=d;return r|0}h=g-b|0;o=p>>>3;do if(p>>>0>=256){n=c[a+(l+24)>>2]|0;o=c[a+(l+12)>>2]|0;do if((o|0)==(j|0)){p=a+(l+20)|0;o=c[p>>2]|0;if(!o){p=a+(l+16)|0;o=c[p>>2]|0;if(!o){k=0;break}}while(1){r=o+20|0;q=c[r>>2]|0;if(q){o=q;p=r;continue}q=o+16|0;r=c[q>>2]|0;if(!r)break;else{o=r;p=q}}if(p>>>0<m>>>0)Wa();else{c[p>>2]=0;k=o;break}}else{p=c[a+(l+8)>>2]|0;if(p>>>0<m>>>0)Wa();m=p+12|0;if((c[m>>2]|0)!=(j|0))Wa();q=o+8|0;if((c[q>>2]|0)==(j|0)){c[m>>2]=o;c[q>>2]=p;k=o;break}else Wa()}while(0);if(n){m=c[a+(l+28)>>2]|0;o=5128+(m<<2)|0;if((j|0)==(c[o>>2]|0)){c[o>>2]=k;if(!k){c[1207]=c[1207]&~(1<<m);break}}else{if(n>>>0<(c[1210]|0)>>>0)Wa();m=n+16|0;if((c[m>>2]|0)==(j|0))c[m>>2]=k;else c[n+20>>2]=k;if(!k)break}j=c[1210]|0;if(k>>>0<j>>>0)Wa();c[k+24>>2]=n;m=c[a+(l+16)>>2]|0;do if(m)if(m>>>0<j>>>0)Wa();else{c[k+16>>2]=m;c[m+24>>2]=k;break}while(0);j=c[a+(l+20)>>2]|0;if(j)if(j>>>0<(c[1210]|0)>>>0)Wa();else{c[k+20>>2]=j;c[j+24>>2]=k;break}}}else{k=c[a+(l+8)>>2]|0;l=c[a+(l+12)>>2]|0;p=4864+(o<<1<<2)|0;if((k|0)!=(p|0)){if(k>>>0<m>>>0)Wa();if((c[k+12>>2]|0)!=(j|0))Wa()}if((l|0)==(k|0)){c[1206]=c[1206]&~(1<<o);break}if((l|0)!=(p|0)){if(l>>>0<m>>>0)Wa();m=l+8|0;if((c[m>>2]|0)==(j|0))n=m;else Wa()}else n=l+8|0;c[k+12>>2]=l;c[n>>2]=k}while(0);if(h>>>0<16){c[f>>2]=g|e&1|2;r=a+(g|4)|0;c[r>>2]=c[r>>2]|1;r=a;i=d;return r|0}else{c[f>>2]=e&1|b|2;c[a+(b+4)>>2]=h|3;r=a+(g|4)|0;c[r>>2]=c[r>>2]|1;ge(a+b|0,h);r=a;i=d;return r|0}return 0}function ge(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;h=a+b|0;l=c[a+4>>2]|0;do if(!(l&1)){p=c[a>>2]|0;if(!(l&3)){i=d;return}l=a+(0-p)|0;m=p+b|0;r=c[1210]|0;if(l>>>0<r>>>0)Wa();if((l|0)==(c[1211]|0)){e=a+(b+4)|0;n=c[e>>2]|0;if((n&3|0)!=3){e=l;n=m;break}c[1208]=m;c[e>>2]=n&-2;c[a+(4-p)>>2]=m|1;c[h>>2]=m;i=d;return}s=p>>>3;if(p>>>0<256){e=c[a+(8-p)>>2]|0;n=c[a+(12-p)>>2]|0;o=4864+(s<<1<<2)|0;if((e|0)!=(o|0)){if(e>>>0<r>>>0)Wa();if((c[e+12>>2]|0)!=(l|0))Wa()}if((n|0)==(e|0)){c[1206]=c[1206]&~(1<<s);e=l;n=m;break}if((n|0)!=(o|0)){if(n>>>0<r>>>0)Wa();o=n+8|0;if((c[o>>2]|0)==(l|0))q=o;else Wa()}else q=n+8|0;c[e+12>>2]=n;c[q>>2]=e;e=l;n=m;break}q=c[a+(24-p)>>2]|0;s=c[a+(12-p)>>2]|0;do if((s|0)==(l|0)){u=16-p|0;t=a+(u+4)|0;s=c[t>>2]|0;if(!s){t=a+u|0;s=c[t>>2]|0;if(!s){o=0;break}}while(1){v=s+20|0;u=c[v>>2]|0;if(u){s=u;t=v;continue}u=s+16|0;v=c[u>>2]|0;if(!v)break;else{s=v;t=u}}if(t>>>0<r>>>0)Wa();else{c[t>>2]=0;o=s;break}}else{t=c[a+(8-p)>>2]|0;if(t>>>0<r>>>0)Wa();r=t+12|0;if((c[r>>2]|0)!=(l|0))Wa();u=s+8|0;if((c[u>>2]|0)==(l|0)){c[r>>2]=s;c[u>>2]=t;o=s;break}else Wa()}while(0);if(q){s=c[a+(28-p)>>2]|0;r=5128+(s<<2)|0;if((l|0)==(c[r>>2]|0)){c[r>>2]=o;if(!o){c[1207]=c[1207]&~(1<<s);e=l;n=m;break}}else{if(q>>>0<(c[1210]|0)>>>0)Wa();r=q+16|0;if((c[r>>2]|0)==(l|0))c[r>>2]=o;else c[q+20>>2]=o;if(!o){e=l;n=m;break}}r=c[1210]|0;if(o>>>0<r>>>0)Wa();c[o+24>>2]=q;p=16-p|0;q=c[a+p>>2]|0;do if(q)if(q>>>0<r>>>0)Wa();else{c[o+16>>2]=q;c[q+24>>2]=o;break}while(0);p=c[a+(p+4)>>2]|0;if(p)if(p>>>0<(c[1210]|0)>>>0)Wa();else{c[o+20>>2]=p;c[p+24>>2]=o;e=l;n=m;break}else{e=l;n=m}}else{e=l;n=m}}else{e=a;n=b}while(0);l=c[1210]|0;if(h>>>0<l>>>0)Wa();m=a+(b+4)|0;o=c[m>>2]|0;if(!(o&2)){if((h|0)==(c[1212]|0)){v=(c[1209]|0)+n|0;c[1209]=v;c[1212]=e;c[e+4>>2]=v|1;if((e|0)!=(c[1211]|0)){i=d;return}c[1211]=0;c[1208]=0;i=d;return}if((h|0)==(c[1211]|0)){v=(c[1208]|0)+n|0;c[1208]=v;c[1211]=e;c[e+4>>2]=v|1;c[e+v>>2]=v;i=d;return}n=(o&-8)+n|0;m=o>>>3;do if(o>>>0>=256){k=c[a+(b+24)>>2]|0;o=c[a+(b+12)>>2]|0;do if((o|0)==(h|0)){o=a+(b+20)|0;m=c[o>>2]|0;if(!m){o=a+(b+16)|0;m=c[o>>2]|0;if(!m){j=0;break}}while(1){p=m+20|0;q=c[p>>2]|0;if(q){m=q;o=p;continue}q=m+16|0;p=c[q>>2]|0;if(!p)break;else{m=p;o=q}}if(o>>>0<l>>>0)Wa();else{c[o>>2]=0;j=m;break}}else{m=c[a+(b+8)>>2]|0;if(m>>>0<l>>>0)Wa();p=m+12|0;if((c[p>>2]|0)!=(h|0))Wa();l=o+8|0;if((c[l>>2]|0)==(h|0)){c[p>>2]=o;c[l>>2]=m;j=o;break}else Wa()}while(0);if(k){m=c[a+(b+28)>>2]|0;l=5128+(m<<2)|0;if((h|0)==(c[l>>2]|0)){c[l>>2]=j;if(!j){c[1207]=c[1207]&~(1<<m);break}}else{if(k>>>0<(c[1210]|0)>>>0)Wa();l=k+16|0;if((c[l>>2]|0)==(h|0))c[l>>2]=j;else c[k+20>>2]=j;if(!j)break}h=c[1210]|0;if(j>>>0<h>>>0)Wa();c[j+24>>2]=k;k=c[a+(b+16)>>2]|0;do if(k)if(k>>>0<h>>>0)Wa();else{c[j+16>>2]=k;c[k+24>>2]=j;break}while(0);h=c[a+(b+20)>>2]|0;if(h)if(h>>>0<(c[1210]|0)>>>0)Wa();else{c[j+20>>2]=h;c[h+24>>2]=j;break}}}else{j=c[a+(b+8)>>2]|0;a=c[a+(b+12)>>2]|0;b=4864+(m<<1<<2)|0;if((j|0)!=(b|0)){if(j>>>0<l>>>0)Wa();if((c[j+12>>2]|0)!=(h|0))Wa()}if((a|0)==(j|0)){c[1206]=c[1206]&~(1<<m);break}if((a|0)!=(b|0)){if(a>>>0<l>>>0)Wa();b=a+8|0;if((c[b>>2]|0)==(h|0))k=b;else Wa()}else k=a+8|0;c[j+12>>2]=a;c[k>>2]=j}while(0);c[e+4>>2]=n|1;c[e+n>>2]=n;if((e|0)==(c[1211]|0)){c[1208]=n;i=d;return}}else{c[m>>2]=o&-2;c[e+4>>2]=n|1;c[e+n>>2]=n}b=n>>>3;if(n>>>0<256){a=b<<1;h=4864+(a<<2)|0;j=c[1206]|0;b=1<<b;if(j&b){a=4864+(a+2<<2)|0;j=c[a>>2]|0;if(j>>>0<(c[1210]|0)>>>0)Wa();else{g=a;f=j}}else{c[1206]=j|b;g=4864+(a+2<<2)|0;f=h}c[g>>2]=e;c[f+12>>2]=e;c[e+8>>2]=f;c[e+12>>2]=h;i=d;return}f=n>>>8;if(f)if(n>>>0>16777215)f=31;else{u=(f+1048320|0)>>>16&8;v=f<<u;t=(v+520192|0)>>>16&4;v=v<<t;f=(v+245760|0)>>>16&2;f=14-(t|u|f)+(v<<f>>>15)|0;f=n>>>(f+7|0)&1|f<<1}else f=0;g=5128+(f<<2)|0;c[e+28>>2]=f;c[e+20>>2]=0;c[e+16>>2]=0;a=c[1207]|0;h=1<<f;if(!(a&h)){c[1207]=a|h;c[g>>2]=e;c[e+24>>2]=g;c[e+12>>2]=e;c[e+8>>2]=e;i=d;return}g=c[g>>2]|0;if((f|0)==31)f=0;else f=25-(f>>>1)|0;a:do if((c[g+4>>2]&-8|0)!=(n|0)){f=n<<f;a=g;while(1){h=a+(f>>>31<<2)+16|0;g=c[h>>2]|0;if(!g)break;if((c[g+4>>2]&-8|0)==(n|0))break a;else{f=f<<1;a=g}}if(h>>>0<(c[1210]|0)>>>0)Wa();c[h>>2]=e;c[e+24>>2]=a;c[e+12>>2]=e;c[e+8>>2]=e;i=d;return}while(0);f=g+8|0;h=c[f>>2]|0;v=c[1210]|0;if(!(g>>>0>=v>>>0&h>>>0>=v>>>0))Wa();c[h+12>>2]=e;c[f>>2]=e;c[e+8>>2]=h;c[e+12>>2]=g;c[e+24>>2]=0;i=d;return}function he(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;g=a+4|0;h=c[g>>2]|0;f=a+100|0;if(h>>>0<(c[f>>2]|0)>>>0){c[g>>2]=h+1;j=d[h>>0]|0}else j=Zd(a)|0;if((j|0)==43|(j|0)==45){k=c[g>>2]|0;h=(j|0)==45&1;if(k>>>0<(c[f>>2]|0)>>>0){c[g>>2]=k+1;j=d[k>>0]|0}else j=Zd(a)|0;if((j+ -48|0)>>>0>9&(b|0)!=0?(c[f>>2]|0)!=0:0)c[g>>2]=(c[g>>2]|0)+ -1}else h=0;if((j+ -48|0)>>>0>9){if(!(c[f>>2]|0)){j=-2147483648;k=0;F=j;i=e;return k|0}c[g>>2]=(c[g>>2]|0)+ -1;j=-2147483648;k=0;F=j;i=e;return k|0}else b=0;do{b=j+ -48+(b*10|0)|0;j=c[g>>2]|0;if(j>>>0<(c[f>>2]|0)>>>0){c[g>>2]=j+1;j=d[j>>0]|0}else j=Zd(a)|0}while((j+ -48|0)>>>0<10&(b|0)<214748364);k=((b|0)<0)<<31>>31;if((j+ -48|0)>>>0<10)do{k=we(b|0,k|0,10,0)|0;b=F;j=ne(j|0,((j|0)<0)<<31>>31|0,-48,-1)|0;b=ne(j|0,F|0,k|0,b|0)|0;k=F;j=c[g>>2]|0;if(j>>>0<(c[f>>2]|0)>>>0){c[g>>2]=j+1;j=d[j>>0]|0}else j=Zd(a)|0}while((j+ -48|0)>>>0<10&((k|0)<21474836|(k|0)==21474836&b>>>0<2061584302));if((j+ -48|0)>>>0<10)do{j=c[g>>2]|0;if(j>>>0<(c[f>>2]|0)>>>0){c[g>>2]=j+1;j=d[j>>0]|0}else j=Zd(a)|0}while((j+ -48|0)>>>0<10);if(c[f>>2]|0)c[g>>2]=(c[g>>2]|0)+ -1;g=(h|0)!=0;h=je(0,0,b|0,k|0)|0;j=g?F:k;k=g?h:b;F=j;i=e;return k|0}function ie(){}function je(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=b-d-(c>>>0>a>>>0|0)>>>0;return(F=b,a-c>>>0|0)|0}function ke(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;i=b&3;h=d|d<<8|d<<16|d<<24;g=f&~3;if(i){i=b+4-i|0;while((b|0)<(i|0)){a[b>>0]=d;b=b+1|0}}while((b|0)<(g|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b>>0]=d;b=b+1|0}return b-e|0}function le(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){F=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}F=a<<c-32;return 0}function me(b){b=b|0;var c=0;c=b;while(a[c>>0]|0)c=c+1|0;return c-b|0}function ne(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;c=a+c>>>0;return(F=b+d+(c>>>0<a>>>0|0)>>>0,c|0)|0}function oe(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){F=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}F=0;return b>>>c-32|0}function pe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return Ca(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if(!e)return f|0;a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function qe(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){F=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}F=(b|0)<0?-1:0;return b>>c-32|0}function re(b){b=b|0;var c=0;c=a[n+(b>>>24)>>0]|0;if((c|0)<8)return c|0;c=a[n+(b>>16&255)>>0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>8&255)>>0]|0;if((c|0)<8)return c+16|0;return(a[n+(b&255)>>0]|0)+24|0}function se(b){b=b|0;var c=0;c=a[m+(b&255)>>0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)>>0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)>>0]|0;if((c|0)<8)return c+16|0;return(a[m+(b>>>24)>>0]|0)+24|0}function te(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;f=a&65535;d=b&65535;c=ba(d,f)|0;e=a>>>16;d=(c>>>16)+(ba(d,e)|0)|0;b=b>>>16;a=ba(b,f)|0;return(F=(d>>>16)+(ba(b,e)|0)+(((d&65535)+a|0)>>>16)|0,d+a<<16|c&65535|0)|0}function ue(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;j=b>>31|((b|0)<0?-1:0)<<1;i=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;f=d>>31|((d|0)<0?-1:0)<<1;e=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;h=je(j^a,i^b,j,i)|0;g=F;b=f^j;a=e^i;a=je((ze(h,g,je(f^c,e^d,f,e)|0,F,0)|0)^b,F^a,b,a)|0;return a|0}function ve(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+8|0;j=f|0;h=b>>31|((b|0)<0?-1:0)<<1;g=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;l=e>>31|((e|0)<0?-1:0)<<1;k=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;b=je(h^a,g^b,h,g)|0;a=F;ze(b,a,je(l^d,k^e,l,k)|0,F,j)|0;a=je(c[j>>2]^h,c[j+4>>2]^g,h,g)|0;b=F;i=f;return(F=b,a)|0}function we(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;f=c;a=te(e,f)|0;c=F;return(F=(ba(b,f)|0)+(ba(d,e)|0)+c|c&0,a|0|0)|0}function xe(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a=ze(a,b,c,d,0)|0;return a|0}function ye(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;g=i;i=i+8|0;f=g|0;ze(a,b,d,e,f)|0;i=g;return(F=c[f+4>>2]|0,c[f>>2]|0)|0}function ze(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;h=a;j=b;i=j;l=d;g=e;k=g;if(!i){g=(f|0)!=0;if(!k){if(g){c[f>>2]=(h>>>0)%(l>>>0);c[f+4>>2]=0}k=0;m=(h>>>0)/(l>>>0)>>>0;return(F=k,m)|0}else{if(!g){l=0;m=0;return(F=l,m)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;l=0;m=0;return(F=l,m)|0}}m=(k|0)==0;do if(l){if(!m){k=(re(k|0)|0)-(re(i|0)|0)|0;if(k>>>0<=31){m=k+1|0;l=31-k|0;a=k-31>>31;j=m;b=h>>>(m>>>0)&a|i<<l;a=i>>>(m>>>0)&a;k=0;l=h<<l;break}if(!f){l=0;m=0;return(F=l,m)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;l=0;m=0;return(F=l,m)|0}k=l-1|0;if(k&l){l=(re(l|0)|0)+33-(re(i|0)|0)|0;p=64-l|0;m=32-l|0;n=m>>31;o=l-32|0;a=o>>31;j=l;b=m-1>>31&i>>>(o>>>0)|(i<<m|h>>>(l>>>0))&a;a=a&i>>>(l>>>0);k=h<<p&n;l=(i<<p|h>>>(o>>>0))&n|h<<m&l-33>>31;break}if(f){c[f>>2]=k&h;c[f+4>>2]=0}if((l|0)==1){o=j|b&0;p=a|0|0;return(F=o,p)|0}else{p=se(l|0)|0;o=i>>>(p>>>0)|0;p=i<<32-p|h>>>(p>>>0)|0;return(F=o,p)|0}}else{if(m){if(f){c[f>>2]=(i>>>0)%(l>>>0);c[f+4>>2]=0}o=0;p=(i>>>0)/(l>>>0)>>>0;return(F=o,p)|0}if(!h){if(f){c[f>>2]=0;c[f+4>>2]=(i>>>0)%(k>>>0)}o=0;p=(i>>>0)/(k>>>0)>>>0;return(F=o,p)|0}l=k-1|0;if(!(l&k)){if(f){c[f>>2]=a|0;c[f+4>>2]=l&i|b&0}o=0;p=i>>>((se(k|0)|0)>>>0);return(F=o,p)|0}k=(re(k|0)|0)-(re(i|0)|0)|0;if(k>>>0<=30){a=k+1|0;l=31-k|0;j=a;b=i<<l|h>>>(a>>>0);a=i>>>(a>>>0);k=0;l=h<<l;break}if(!f){o=0;p=0;return(F=o,p)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;o=0;p=0;return(F=o,p)|0}while(0);if(!j){g=l;e=0;i=0}else{h=d|0|0;g=g|e&0;e=ne(h,g,-1,-1)|0;d=F;i=0;do{m=l;l=k>>>31|l<<1;k=i|k<<1;m=b<<1|m>>>31|0;n=b>>>31|a<<1|0;je(e,d,m,n)|0;p=F;o=p>>31|((p|0)<0?-1:0)<<1;i=o&1;b=je(m,n,o&h,(((p|0)<0?-1:0)>>31|((p|0)<0?-1:0)<<1)&g)|0;a=F;j=j-1|0}while((j|0)!=0);g=l;e=0}h=0;if(f){c[f>>2]=b;c[f+4>>2]=a}o=(k|0)>>>31|(g|h)<<1|(h<<1|k>>>31)&0|e;p=(k<<1|0>>>31)&-2|i;return(F=o,p)|0}function Ae(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return eb[a&1](b|0,c|0,d|0)|0}function Be(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;fb[a&3](b|0,c|0,d|0,e|0,f|0)}function Ce(a,b){a=a|0;b=b|0;gb[a&31](b|0)}function De(a,b,c){a=a|0;b=b|0;c=c|0;hb[a&3](b|0,c|0)}function Ee(a,b){a=a|0;b=b|0;return ib[a&1](b|0)|0}function Fe(a){a=a|0;jb[a&3]()}function Ge(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;kb[a&3](b|0,c|0,d|0,e|0,f|0,g|0)}function He(a,b,c){a=a|0;b=b|0;c=c|0;return lb[a&3](b|0,c|0)|0}function Ie(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;mb[a&3](b|0,c|0,d|0,e|0)}function Je(a,b,c){a=a|0;b=b|0;c=c|0;ca(0);return 0}function Ke(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ca(1)}function Le(a){a=a|0;ca(2)}function Me(a,b){a=a|0;b=b|0;ca(3)}function Ne(a){a=a|0;ca(4);return 0}function Oe(){ca(5)}function Pe(){bb()}function Qe(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;ca(6)}function Re(a,b){a=a|0;b=b|0;ca(7);return 0}function Se(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ca(8)}




// EMSCRIPTEN_END_FUNCS
// (start of meteor/midamble.js)
// This "midamble" is hacked into the output JS in a place
// where it has access to the inner function generated
// by Emscripten, the one that starts with "use asm".
// NOTE: This doesn't work with minification on!
/////setInnerMalloc = function (hookedMalloc) {
/////  _malloc = hookedMalloc;
/////};
/////setInnerFree = function (hookedFree) {
/////  _free = hookedFree;
/////};
// (end of meteor/midamble.js)
var eb=[Je,Dd];var fb=[Ke,Kd,Jd,Ke];var gb=[Le,wb,yb,Ab,Db,Ib,Hb,bc,dc,zc,yc,Oc,rd,qd,yd,Bd,zd,Ad,Cd,zb,Rd,Le,Le,Le,Le,Le,Le,Le,Le,Le,Le,Le];var hb=[Me,Cb,Fb,fc];var ib=[Ne,sd];var jb=[Oe,Pe,Pd,Qd];var kb=[Qe,Md,Ld,Qe];var lb=[Re,Bb,Eb,ec];var mb=[Se,Fd,Gd,Se];return{_yo:$c,_strlen:me,_retireVar:id,_bitshift64Lshr:oe,_unyo:ad,_solve:ed,_bitshift64Shl:le,_getSolution:fd,___cxa_is_pointer_type:Od,_memset:ke,_getNumVars:gd,_memcpy:pe,_getConflictClauseSize:jd,_addClause:dd,_i64Subtract:je,_createTheSolver:bd,_realloc:Ud,_i64Add:ne,_solveAssuming:hd,___cxa_can_catch:Nd,_ensureVar:cd,_getConflictClause:kd,_free:Td,_malloc:Sd,__GLOBAL__I_a:cc,__GLOBAL__I_a127:Pc,runPostSets:ie,stackAlloc:nb,stackSave:ob,stackRestore:pb,setThrew:qb,setTempRet0:tb,getTempRet0:ub,dynCall_iiii:Ae,dynCall_viiiii:Be,dynCall_vi:Ce,dynCall_vii:De,dynCall_ii:Ee,dynCall_v:Fe,dynCall_viiiiii:Ge,dynCall_iii:He,dynCall_viiii:Ie}})


// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg,Module.asmLibraryArg,buffer);var _yo=Module["_yo"]=asm["_yo"];var _strlen=Module["_strlen"]=asm["_strlen"];var _retireVar=Module["_retireVar"]=asm["_retireVar"];var _bitshift64Lshr=Module["_bitshift64Lshr"]=asm["_bitshift64Lshr"];var _unyo=Module["_unyo"]=asm["_unyo"];var _solve=Module["_solve"]=asm["_solve"];var _bitshift64Shl=Module["_bitshift64Shl"]=asm["_bitshift64Shl"];var _getSolution=Module["_getSolution"]=asm["_getSolution"];var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=asm["___cxa_is_pointer_type"];var _memset=Module["_memset"]=asm["_memset"];var _getNumVars=Module["_getNumVars"]=asm["_getNumVars"];var _memcpy=Module["_memcpy"]=asm["_memcpy"];var _getConflictClauseSize=Module["_getConflictClauseSize"]=asm["_getConflictClauseSize"];var _addClause=Module["_addClause"]=asm["_addClause"];var _i64Subtract=Module["_i64Subtract"]=asm["_i64Subtract"];var _createTheSolver=Module["_createTheSolver"]=asm["_createTheSolver"];var _realloc=Module["_realloc"]=asm["_realloc"];var _i64Add=Module["_i64Add"]=asm["_i64Add"];var _solveAssuming=Module["_solveAssuming"]=asm["_solveAssuming"];var ___cxa_can_catch=Module["___cxa_can_catch"]=asm["___cxa_can_catch"];var _ensureVar=Module["_ensureVar"]=asm["_ensureVar"];var _getConflictClause=Module["_getConflictClause"]=asm["_getConflictClause"];var _free=Module["_free"]=asm["_free"];var _malloc=Module["_malloc"]=asm["_malloc"];var __GLOBAL__I_a=Module["__GLOBAL__I_a"]=asm["__GLOBAL__I_a"];var __GLOBAL__I_a127=Module["__GLOBAL__I_a127"]=asm["__GLOBAL__I_a127"];var runPostSets=Module["runPostSets"]=asm["runPostSets"];var dynCall_iiii=Module["dynCall_iiii"]=asm["dynCall_iiii"];var dynCall_viiiii=Module["dynCall_viiiii"]=asm["dynCall_viiiii"];var dynCall_vi=Module["dynCall_vi"]=asm["dynCall_vi"];var dynCall_vii=Module["dynCall_vii"]=asm["dynCall_vii"];var dynCall_ii=Module["dynCall_ii"]=asm["dynCall_ii"];var dynCall_v=Module["dynCall_v"]=asm["dynCall_v"];var dynCall_viiiiii=Module["dynCall_viiiiii"]=asm["dynCall_viiiiii"];var dynCall_iii=Module["dynCall_iii"]=asm["dynCall_iii"];var dynCall_viiii=Module["dynCall_viiii"]=asm["dynCall_viiii"];Runtime.stackAlloc=asm["stackAlloc"];Runtime.stackSave=asm["stackSave"];Runtime.stackRestore=asm["stackRestore"];Runtime.setTempRet0=asm["setTempRet0"];Runtime.getTempRet0=asm["getTempRet0"];var i64Math=(function(){var goog={math:{}};goog.math.Long=(function(low,high){this.low_=low|0;this.high_=high|0});goog.math.Long.IntCache_={};goog.math.Long.fromInt=(function(value){if(-128<=value&&value<128){var cachedObj=goog.math.Long.IntCache_[value];if(cachedObj){return cachedObj}}var obj=new goog.math.Long(value|0,value<0?-1:0);if(-128<=value&&value<128){goog.math.Long.IntCache_[value]=obj}return obj});goog.math.Long.fromNumber=(function(value){if(isNaN(value)||!isFinite(value)){return goog.math.Long.ZERO}else if(value<=-goog.math.Long.TWO_PWR_63_DBL_){return goog.math.Long.MIN_VALUE}else if(value+1>=goog.math.Long.TWO_PWR_63_DBL_){return goog.math.Long.MAX_VALUE}else if(value<0){return goog.math.Long.fromNumber(-value).negate()}else{return new goog.math.Long(value%goog.math.Long.TWO_PWR_32_DBL_|0,value/goog.math.Long.TWO_PWR_32_DBL_|0)}});goog.math.Long.fromBits=(function(lowBits,highBits){return new goog.math.Long(lowBits,highBits)});goog.math.Long.fromString=(function(str,opt_radix){if(str.length==0){throw Error("number format error: empty string")}var radix=opt_radix||10;if(radix<2||36<radix){throw Error("radix out of range: "+radix)}if(str.charAt(0)=="-"){return goog.math.Long.fromString(str.substring(1),radix).negate()}else if(str.indexOf("-")>=0){throw Error('number format error: interior "-" character: '+str)}var radixToPower=goog.math.Long.fromNumber(Math.pow(radix,8));var result=goog.math.Long.ZERO;for(var i=0;i<str.length;i+=8){var size=Math.min(8,str.length-i);var value=parseInt(str.substring(i,i+size),radix);if(size<8){var power=goog.math.Long.fromNumber(Math.pow(radix,size));result=result.multiply(power).add(goog.math.Long.fromNumber(value))}else{result=result.multiply(radixToPower);result=result.add(goog.math.Long.fromNumber(value))}}return result});goog.math.Long.TWO_PWR_16_DBL_=1<<16;goog.math.Long.TWO_PWR_24_DBL_=1<<24;goog.math.Long.TWO_PWR_32_DBL_=goog.math.Long.TWO_PWR_16_DBL_*goog.math.Long.TWO_PWR_16_DBL_;goog.math.Long.TWO_PWR_31_DBL_=goog.math.Long.TWO_PWR_32_DBL_/2;goog.math.Long.TWO_PWR_48_DBL_=goog.math.Long.TWO_PWR_32_DBL_*goog.math.Long.TWO_PWR_16_DBL_;goog.math.Long.TWO_PWR_64_DBL_=goog.math.Long.TWO_PWR_32_DBL_*goog.math.Long.TWO_PWR_32_DBL_;goog.math.Long.TWO_PWR_63_DBL_=goog.math.Long.TWO_PWR_64_DBL_/2;goog.math.Long.ZERO=goog.math.Long.fromInt(0);goog.math.Long.ONE=goog.math.Long.fromInt(1);goog.math.Long.NEG_ONE=goog.math.Long.fromInt(-1);goog.math.Long.MAX_VALUE=goog.math.Long.fromBits(4294967295|0,2147483647|0);goog.math.Long.MIN_VALUE=goog.math.Long.fromBits(0,2147483648|0);goog.math.Long.TWO_PWR_24_=goog.math.Long.fromInt(1<<24);goog.math.Long.prototype.toInt=(function(){return this.low_});goog.math.Long.prototype.toNumber=(function(){return this.high_*goog.math.Long.TWO_PWR_32_DBL_+this.getLowBitsUnsigned()});goog.math.Long.prototype.toString=(function(opt_radix){var radix=opt_radix||10;if(radix<2||36<radix){throw Error("radix out of range: "+radix)}if(this.isZero()){return"0"}if(this.isNegative()){if(this.equals(goog.math.Long.MIN_VALUE)){var radixLong=goog.math.Long.fromNumber(radix);var div=this.div(radixLong);var rem=div.multiply(radixLong).subtract(this);return div.toString(radix)+rem.toInt().toString(radix)}else{return"-"+this.negate().toString(radix)}}var radixToPower=goog.math.Long.fromNumber(Math.pow(radix,6));var rem=this;var result="";while(true){var remDiv=rem.div(radixToPower);var intval=rem.subtract(remDiv.multiply(radixToPower)).toInt();var digits=intval.toString(radix);rem=remDiv;if(rem.isZero()){return digits+result}else{while(digits.length<6){digits="0"+digits}result=""+digits+result}}});goog.math.Long.prototype.getHighBits=(function(){return this.high_});goog.math.Long.prototype.getLowBits=(function(){return this.low_});goog.math.Long.prototype.getLowBitsUnsigned=(function(){return this.low_>=0?this.low_:goog.math.Long.TWO_PWR_32_DBL_+this.low_});goog.math.Long.prototype.getNumBitsAbs=(function(){if(this.isNegative()){if(this.equals(goog.math.Long.MIN_VALUE)){return 64}else{return this.negate().getNumBitsAbs()}}else{var val=this.high_!=0?this.high_:this.low_;for(var bit=31;bit>0;bit--){if((val&1<<bit)!=0){break}}return this.high_!=0?bit+33:bit+1}});goog.math.Long.prototype.isZero=(function(){return this.high_==0&&this.low_==0});goog.math.Long.prototype.isNegative=(function(){return this.high_<0});goog.math.Long.prototype.isOdd=(function(){return(this.low_&1)==1});goog.math.Long.prototype.equals=(function(other){return this.high_==other.high_&&this.low_==other.low_});goog.math.Long.prototype.notEquals=(function(other){return this.high_!=other.high_||this.low_!=other.low_});goog.math.Long.prototype.lessThan=(function(other){return this.compare(other)<0});goog.math.Long.prototype.lessThanOrEqual=(function(other){return this.compare(other)<=0});goog.math.Long.prototype.greaterThan=(function(other){return this.compare(other)>0});goog.math.Long.prototype.greaterThanOrEqual=(function(other){return this.compare(other)>=0});goog.math.Long.prototype.compare=(function(other){if(this.equals(other)){return 0}var thisNeg=this.isNegative();var otherNeg=other.isNegative();if(thisNeg&&!otherNeg){return-1}if(!thisNeg&&otherNeg){return 1}if(this.subtract(other).isNegative()){return-1}else{return 1}});goog.math.Long.prototype.negate=(function(){if(this.equals(goog.math.Long.MIN_VALUE)){return goog.math.Long.MIN_VALUE}else{return this.not().add(goog.math.Long.ONE)}});goog.math.Long.prototype.add=(function(other){var a48=this.high_>>>16;var a32=this.high_&65535;var a16=this.low_>>>16;var a00=this.low_&65535;var b48=other.high_>>>16;var b32=other.high_&65535;var b16=other.low_>>>16;var b00=other.low_&65535;var c48=0,c32=0,c16=0,c00=0;c00+=a00+b00;c16+=c00>>>16;c00&=65535;c16+=a16+b16;c32+=c16>>>16;c16&=65535;c32+=a32+b32;c48+=c32>>>16;c32&=65535;c48+=a48+b48;c48&=65535;return goog.math.Long.fromBits(c16<<16|c00,c48<<16|c32)});goog.math.Long.prototype.subtract=(function(other){return this.add(other.negate())});goog.math.Long.prototype.multiply=(function(other){if(this.isZero()){return goog.math.Long.ZERO}else if(other.isZero()){return goog.math.Long.ZERO}if(this.equals(goog.math.Long.MIN_VALUE)){return other.isOdd()?goog.math.Long.MIN_VALUE:goog.math.Long.ZERO}else if(other.equals(goog.math.Long.MIN_VALUE)){return this.isOdd()?goog.math.Long.MIN_VALUE:goog.math.Long.ZERO}if(this.isNegative()){if(other.isNegative()){return this.negate().multiply(other.negate())}else{return this.negate().multiply(other).negate()}}else if(other.isNegative()){return this.multiply(other.negate()).negate()}if(this.lessThan(goog.math.Long.TWO_PWR_24_)&&other.lessThan(goog.math.Long.TWO_PWR_24_)){return goog.math.Long.fromNumber(this.toNumber()*other.toNumber())}var a48=this.high_>>>16;var a32=this.high_&65535;var a16=this.low_>>>16;var a00=this.low_&65535;var b48=other.high_>>>16;var b32=other.high_&65535;var b16=other.low_>>>16;var b00=other.low_&65535;var c48=0,c32=0,c16=0,c00=0;c00+=a00*b00;c16+=c00>>>16;c00&=65535;c16+=a16*b00;c32+=c16>>>16;c16&=65535;c16+=a00*b16;c32+=c16>>>16;c16&=65535;c32+=a32*b00;c48+=c32>>>16;c32&=65535;c32+=a16*b16;c48+=c32>>>16;c32&=65535;c32+=a00*b32;c48+=c32>>>16;c32&=65535;c48+=a48*b00+a32*b16+a16*b32+a00*b48;c48&=65535;return goog.math.Long.fromBits(c16<<16|c00,c48<<16|c32)});goog.math.Long.prototype.div=(function(other){if(other.isZero()){throw Error("division by zero")}else if(this.isZero()){return goog.math.Long.ZERO}if(this.equals(goog.math.Long.MIN_VALUE)){if(other.equals(goog.math.Long.ONE)||other.equals(goog.math.Long.NEG_ONE)){return goog.math.Long.MIN_VALUE}else if(other.equals(goog.math.Long.MIN_VALUE)){return goog.math.Long.ONE}else{var halfThis=this.shiftRight(1);var approx=halfThis.div(other).shiftLeft(1);if(approx.equals(goog.math.Long.ZERO)){return other.isNegative()?goog.math.Long.ONE:goog.math.Long.NEG_ONE}else{var rem=this.subtract(other.multiply(approx));var result=approx.add(rem.div(other));return result}}}else if(other.equals(goog.math.Long.MIN_VALUE)){return goog.math.Long.ZERO}if(this.isNegative()){if(other.isNegative()){return this.negate().div(other.negate())}else{return this.negate().div(other).negate()}}else if(other.isNegative()){return this.div(other.negate()).negate()}var res=goog.math.Long.ZERO;var rem=this;while(rem.greaterThanOrEqual(other)){var approx=Math.max(1,Math.floor(rem.toNumber()/other.toNumber()));var log2=Math.ceil(Math.log(approx)/Math.LN2);var delta=log2<=48?1:Math.pow(2,log2-48);var approxRes=goog.math.Long.fromNumber(approx);var approxRem=approxRes.multiply(other);while(approxRem.isNegative()||approxRem.greaterThan(rem)){approx-=delta;approxRes=goog.math.Long.fromNumber(approx);approxRem=approxRes.multiply(other)}if(approxRes.isZero()){approxRes=goog.math.Long.ONE}res=res.add(approxRes);rem=rem.subtract(approxRem)}return res});goog.math.Long.prototype.modulo=(function(other){return this.subtract(this.div(other).multiply(other))});goog.math.Long.prototype.not=(function(){return goog.math.Long.fromBits(~this.low_,~this.high_)});goog.math.Long.prototype.and=(function(other){return goog.math.Long.fromBits(this.low_&other.low_,this.high_&other.high_)});goog.math.Long.prototype.or=(function(other){return goog.math.Long.fromBits(this.low_|other.low_,this.high_|other.high_)});goog.math.Long.prototype.xor=(function(other){return goog.math.Long.fromBits(this.low_^other.low_,this.high_^other.high_)});goog.math.Long.prototype.shiftLeft=(function(numBits){numBits&=63;if(numBits==0){return this}else{var low=this.low_;if(numBits<32){var high=this.high_;return goog.math.Long.fromBits(low<<numBits,high<<numBits|low>>>32-numBits)}else{return goog.math.Long.fromBits(0,low<<numBits-32)}}});goog.math.Long.prototype.shiftRight=(function(numBits){numBits&=63;if(numBits==0){return this}else{var high=this.high_;if(numBits<32){var low=this.low_;return goog.math.Long.fromBits(low>>>numBits|high<<32-numBits,high>>numBits)}else{return goog.math.Long.fromBits(high>>numBits-32,high>=0?0:-1)}}});goog.math.Long.prototype.shiftRightUnsigned=(function(numBits){numBits&=63;if(numBits==0){return this}else{var high=this.high_;if(numBits<32){var low=this.low_;return goog.math.Long.fromBits(low>>>numBits|high<<32-numBits,high>>>numBits)}else if(numBits==32){return goog.math.Long.fromBits(high,0)}else{return goog.math.Long.fromBits(high>>>numBits-32,0)}}});var navigator={appName:"Modern Browser"};var dbits;var canary=0xdeadbeefcafe;var j_lm=(canary&16777215)==15715070;function BigInteger(a,b,c){if(a!=null)if("number"==typeof a)this.fromNumber(a,b,c);else if(b==null&&"string"!=typeof a)this.fromString(a,256);else this.fromString(a,b)}function nbi(){return new BigInteger(null)}function am1(i,x,w,j,c,n){while(--n>=0){var v=x*this[i++]+w[j]+c;c=Math.floor(v/67108864);w[j++]=v&67108863}return c}function am2(i,x,w,j,c,n){var xl=x&32767,xh=x>>15;while(--n>=0){var l=this[i]&32767;var h=this[i++]>>15;var m=xh*l+h*xl;l=xl*l+((m&32767)<<15)+w[j]+(c&1073741823);c=(l>>>30)+(m>>>15)+xh*h+(c>>>30);w[j++]=l&1073741823}return c}function am3(i,x,w,j,c,n){var xl=x&16383,xh=x>>14;while(--n>=0){var l=this[i]&16383;var h=this[i++]>>14;var m=xh*l+h*xl;l=xl*l+((m&16383)<<14)+w[j]+c;c=(l>>28)+(m>>14)+xh*h;w[j++]=l&268435455}return c}if(j_lm&&navigator.appName=="Microsoft Internet Explorer"){BigInteger.prototype.am=am2;dbits=30}else if(j_lm&&navigator.appName!="Netscape"){BigInteger.prototype.am=am1;dbits=26}else{BigInteger.prototype.am=am3;dbits=28}BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=(1<<dbits)-1;BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz";var BI_RC=new Array;var rr,vv;rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv)BI_RC[rr++]=vv;rr="a".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;rr="A".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;function int2char(n){return BI_RM.charAt(n)}function intAt(s,i){var c=BI_RC[s.charCodeAt(i)];return c==null?-1:c}function bnpCopyTo(r){for(var i=this.t-1;i>=0;--i)r[i]=this[i];r.t=this.t;r.s=this.s}function bnpFromInt(x){this.t=1;this.s=x<0?-1:0;if(x>0)this[0]=x;else if(x<-1)this[0]=x+DV;else this.t=0}function nbv(i){var r=nbi();r.fromInt(i);return r}function bnpFromString(s,b){var k;if(b==16)k=4;else if(b==8)k=3;else if(b==256)k=8;else if(b==2)k=1;else if(b==32)k=5;else if(b==4)k=2;else{this.fromRadix(s,b);return}this.t=0;this.s=0;var i=s.length,mi=false,sh=0;while(--i>=0){var x=k==8?s[i]&255:intAt(s,i);if(x<0){if(s.charAt(i)=="-")mi=true;continue}mi=false;if(sh==0)this[this.t++]=x;else if(sh+k>this.DB){this[this.t-1]|=(x&(1<<this.DB-sh)-1)<<sh;this[this.t++]=x>>this.DB-sh}else this[this.t-1]|=x<<sh;sh+=k;if(sh>=this.DB)sh-=this.DB}if(k==8&&(s[0]&128)!=0){this.s=-1;if(sh>0)this[this.t-1]|=(1<<this.DB-sh)-1<<sh}this.clamp();if(mi)BigInteger.ZERO.subTo(this,this)}function bnpClamp(){var c=this.s&this.DM;while(this.t>0&&this[this.t-1]==c)--this.t}function bnToString(b){if(this.s<0)return"-"+this.negate().toString(b);var k;if(b==16)k=4;else if(b==8)k=3;else if(b==2)k=1;else if(b==32)k=5;else if(b==4)k=2;else return this.toRadix(b);var km=(1<<k)-1,d,m=false,r="",i=this.t;var p=this.DB-i*this.DB%k;if(i-->0){if(p<this.DB&&(d=this[i]>>p)>0){m=true;r=int2char(d)}while(i>=0){if(p<k){d=(this[i]&(1<<p)-1)<<k-p;d|=this[--i]>>(p+=this.DB-k)}else{d=this[i]>>(p-=k)&km;if(p<=0){p+=this.DB;--i}}if(d>0)m=true;if(m)r+=int2char(d)}}return m?r:"0"}function bnNegate(){var r=nbi();BigInteger.ZERO.subTo(this,r);return r}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(a){var r=this.s-a.s;if(r!=0)return r;var i=this.t;r=i-a.t;if(r!=0)return this.s<0?-r:r;while(--i>=0)if((r=this[i]-a[i])!=0)return r;return 0}function nbits(x){var r=1,t;if((t=x>>>16)!=0){x=t;r+=16}if((t=x>>8)!=0){x=t;r+=8}if((t=x>>4)!=0){x=t;r+=4}if((t=x>>2)!=0){x=t;r+=2}if((t=x>>1)!=0){x=t;r+=1}return r}function bnBitLength(){if(this.t<=0)return 0;return this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(n,r){var i;for(i=this.t-1;i>=0;--i)r[i+n]=this[i];for(i=n-1;i>=0;--i)r[i]=0;r.t=this.t+n;r.s=this.s}function bnpDRShiftTo(n,r){for(var i=n;i<this.t;++i)r[i-n]=this[i];r.t=Math.max(this.t-n,0);r.s=this.s}function bnpLShiftTo(n,r){var bs=n%this.DB;var cbs=this.DB-bs;var bm=(1<<cbs)-1;var ds=Math.floor(n/this.DB),c=this.s<<bs&this.DM,i;for(i=this.t-1;i>=0;--i){r[i+ds+1]=this[i]>>cbs|c;c=(this[i]&bm)<<bs}for(i=ds-1;i>=0;--i)r[i]=0;r[ds]=c;r.t=this.t+ds+1;r.s=this.s;r.clamp()}function bnpRShiftTo(n,r){r.s=this.s;var ds=Math.floor(n/this.DB);if(ds>=this.t){r.t=0;return}var bs=n%this.DB;var cbs=this.DB-bs;var bm=(1<<bs)-1;r[0]=this[ds]>>bs;for(var i=ds+1;i<this.t;++i){r[i-ds-1]|=(this[i]&bm)<<cbs;r[i-ds]=this[i]>>bs}if(bs>0)r[this.t-ds-1]|=(this.s&bm)<<cbs;r.t=this.t-ds;r.clamp()}function bnpSubTo(a,r){var i=0,c=0,m=Math.min(a.t,this.t);while(i<m){c+=this[i]-a[i];r[i++]=c&this.DM;c>>=this.DB}if(a.t<this.t){c-=a.s;while(i<this.t){c+=this[i];r[i++]=c&this.DM;c>>=this.DB}c+=this.s}else{c+=this.s;while(i<a.t){c-=a[i];r[i++]=c&this.DM;c>>=this.DB}c-=a.s}r.s=c<0?-1:0;if(c<-1)r[i++]=this.DV+c;else if(c>0)r[i++]=c;r.t=i;r.clamp()}function bnpMultiplyTo(a,r){var x=this.abs(),y=a.abs();var i=x.t;r.t=i+y.t;while(--i>=0)r[i]=0;for(i=0;i<y.t;++i)r[i+x.t]=x.am(0,y[i],r,i,0,x.t);r.s=0;r.clamp();if(this.s!=a.s)BigInteger.ZERO.subTo(r,r)}function bnpSquareTo(r){var x=this.abs();var i=r.t=2*x.t;while(--i>=0)r[i]=0;for(i=0;i<x.t-1;++i){var c=x.am(i,x[i],r,2*i,0,1);if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1))>=x.DV){r[i+x.t]-=x.DV;r[i+x.t+1]=1}}if(r.t>0)r[r.t-1]+=x.am(i,x[i],r,2*i,0,1);r.s=0;r.clamp()}function bnpDivRemTo(m,q,r){var pm=m.abs();if(pm.t<=0)return;var pt=this.abs();if(pt.t<pm.t){if(q!=null)q.fromInt(0);if(r!=null)this.copyTo(r);return}if(r==null)r=nbi();var y=nbi(),ts=this.s,ms=m.s;var nsh=this.DB-nbits(pm[pm.t-1]);if(nsh>0){pm.lShiftTo(nsh,y);pt.lShiftTo(nsh,r)}else{pm.copyTo(y);pt.copyTo(r)}var ys=y.t;var y0=y[ys-1];if(y0==0)return;var yt=y0*(1<<this.F1)+(ys>1?y[ys-2]>>this.F2:0);var d1=this.FV/yt,d2=(1<<this.F1)/yt,e=1<<this.F2;var i=r.t,j=i-ys,t=q==null?nbi():q;y.dlShiftTo(j,t);if(r.compareTo(t)>=0){r[r.t++]=1;r.subTo(t,r)}BigInteger.ONE.dlShiftTo(ys,t);t.subTo(y,y);while(y.t<ys)y[y.t++]=0;while(--j>=0){var qd=r[--i]==y0?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);if((r[i]+=y.am(0,qd,r,j,0,ys))<qd){y.dlShiftTo(j,t);r.subTo(t,r);while(r[i]<--qd)r.subTo(t,r)}}if(q!=null){r.drShiftTo(ys,q);if(ts!=ms)BigInteger.ZERO.subTo(q,q)}r.t=ys;r.clamp();if(nsh>0)r.rShiftTo(nsh,r);if(ts<0)BigInteger.ZERO.subTo(r,r)}function bnMod(a){var r=nbi();this.abs().divRemTo(a,null,r);if(this.s<0&&r.compareTo(BigInteger.ZERO)>0)a.subTo(r,r);return r}function Classic(m){this.m=m}function cConvert(x){if(x.s<0||x.compareTo(this.m)>=0)return x.mod(this.m);else return x}function cRevert(x){return x}function cReduce(x){x.divRemTo(this.m,null,x)}function cMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}function cSqrTo(x,r){x.squareTo(r);this.reduce(r)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;function bnpInvDigit(){if(this.t<1)return 0;var x=this[0];if((x&1)==0)return 0;var y=x&3;y=y*(2-(x&15)*y)&15;y=y*(2-(x&255)*y)&255;y=y*(2-((x&65535)*y&65535))&65535;y=y*(2-x*y%this.DV)%this.DV;return y>0?this.DV-y:-y}function Montgomery(m){this.m=m;this.mp=m.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<m.DB-15)-1;this.mt2=2*m.t}function montConvert(x){var r=nbi();x.abs().dlShiftTo(this.m.t,r);r.divRemTo(this.m,null,r);if(x.s<0&&r.compareTo(BigInteger.ZERO)>0)this.m.subTo(r,r);return r}function montRevert(x){var r=nbi();x.copyTo(r);this.reduce(r);return r}function montReduce(x){while(x.t<=this.mt2)x[x.t++]=0;for(var i=0;i<this.m.t;++i){var j=x[i]&32767;var u0=j*this.mpl+((j*this.mph+(x[i]>>15)*this.mpl&this.um)<<15)&x.DM;j=i+this.m.t;x[j]+=this.m.am(0,u0,x,i,0,this.m.t);while(x[j]>=x.DV){x[j]-=x.DV;x[++j]++}}x.clamp();x.drShiftTo(this.m.t,x);if(x.compareTo(this.m)>=0)x.subTo(this.m,x)}function montSqrTo(x,r){x.squareTo(r);this.reduce(r)}function montMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}Montgomery.prototype.convert=montConvert;Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return(this.t>0?this[0]&1:this.s)==0}function bnpExp(e,z){if(e>4294967295||e<1)return BigInteger.ONE;var r=nbi(),r2=nbi(),g=z.convert(this),i=nbits(e)-1;g.copyTo(r);while(--i>=0){z.sqrTo(r,r2);if((e&1<<i)>0)z.mulTo(r2,g,r);else{var t=r;r=r2;r2=t}}return z.revert(r)}function bnModPowInt(e,m){var z;if(e<256||m.isEven())z=new Classic(m);else z=new Montgomery(m);return this.exp(e,z)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);function bnpFromRadix(s,b){this.fromInt(0);if(b==null)b=10;var cs=this.chunkSize(b);var d=Math.pow(b,cs),mi=false,j=0,w=0;for(var i=0;i<s.length;++i){var x=intAt(s,i);if(x<0){if(s.charAt(i)=="-"&&this.signum()==0)mi=true;continue}w=b*w+x;if(++j>=cs){this.dMultiply(d);this.dAddOffset(w,0);j=0;w=0}}if(j>0){this.dMultiply(Math.pow(b,j));this.dAddOffset(w,0)}if(mi)BigInteger.ZERO.subTo(this,this)}function bnpChunkSize(r){return Math.floor(Math.LN2*this.DB/Math.log(r))}function bnSigNum(){if(this.s<0)return-1;else if(this.t<=0||this.t==1&&this[0]<=0)return 0;else return 1}function bnpDMultiply(n){this[this.t]=this.am(0,n-1,this,0,0,this.t);++this.t;this.clamp()}function bnpDAddOffset(n,w){if(n==0)return;while(this.t<=w)this[this.t++]=0;this[w]+=n;while(this[w]>=this.DV){this[w]-=this.DV;if(++w>=this.t)this[this.t++]=0;++this[w]}}function bnpToRadix(b){if(b==null)b=10;if(this.signum()==0||b<2||b>36)return"0";var cs=this.chunkSize(b);var a=Math.pow(b,cs);var d=nbv(a),y=nbi(),z=nbi(),r="";this.divRemTo(d,y,z);while(y.signum()>0){r=(a+z.intValue()).toString(b).substr(1)+r;y.divRemTo(d,y,z)}return z.intValue().toString(b)+r}function bnIntValue(){if(this.s<0){if(this.t==1)return this[0]-this.DV;else if(this.t==0)return-1}else if(this.t==1)return this[0];else if(this.t==0)return 0;return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnpAddTo(a,r){var i=0,c=0,m=Math.min(a.t,this.t);while(i<m){c+=this[i]+a[i];r[i++]=c&this.DM;c>>=this.DB}if(a.t<this.t){c+=a.s;while(i<this.t){c+=this[i];r[i++]=c&this.DM;c>>=this.DB}c+=this.s}else{c+=this.s;while(i<a.t){c+=a[i];r[i++]=c&this.DM;c>>=this.DB}c+=a.s}r.s=c<0?-1:0;if(c>0)r[i++]=c;else if(c<-1)r[i++]=this.DV+c;r.t=i;r.clamp()}BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.addTo=bnpAddTo;var Wrapper={abs:(function(l,h){var x=new goog.math.Long(l,h);var ret;if(x.isNegative()){ret=x.negate()}else{ret=x}HEAP32[tempDoublePtr>>2]=ret.low_;HEAP32[tempDoublePtr+4>>2]=ret.high_}),ensureTemps:(function(){if(Wrapper.ensuredTemps)return;Wrapper.ensuredTemps=true;Wrapper.two32=new BigInteger;Wrapper.two32.fromString("4294967296",10);Wrapper.two64=new BigInteger;Wrapper.two64.fromString("18446744073709551616",10);Wrapper.temp1=new BigInteger;Wrapper.temp2=new BigInteger}),lh2bignum:(function(l,h){var a=new BigInteger;a.fromString(h.toString(),10);var b=new BigInteger;a.multiplyTo(Wrapper.two32,b);var c=new BigInteger;c.fromString(l.toString(),10);var d=new BigInteger;c.addTo(b,d);return d}),stringify:(function(l,h,unsigned){var ret=(new goog.math.Long(l,h)).toString();if(unsigned&&ret[0]=="-"){Wrapper.ensureTemps();var bignum=new BigInteger;bignum.fromString(ret,10);ret=new BigInteger;Wrapper.two64.addTo(bignum,ret);ret=ret.toString(10)}return ret}),fromString:(function(str,base,min,max,unsigned){Wrapper.ensureTemps();var bignum=new BigInteger;bignum.fromString(str,base);var bigmin=new BigInteger;bigmin.fromString(min,10);var bigmax=new BigInteger;bigmax.fromString(max,10);if(unsigned&&bignum.compareTo(BigInteger.ZERO)<0){var temp=new BigInteger;bignum.addTo(Wrapper.two64,temp);bignum=temp}var error=false;if(bignum.compareTo(bigmin)<0){bignum=bigmin;error=true}else if(bignum.compareTo(bigmax)>0){bignum=bigmax;error=true}var ret=goog.math.Long.fromString(bignum.toString());HEAP32[tempDoublePtr>>2]=ret.low_;HEAP32[tempDoublePtr+4>>2]=ret.high_;if(error)throw"range error"})};return Wrapper})();if(memoryInitializer){if(typeof Module["locateFile"]==="function"){memoryInitializer=Module["locateFile"](memoryInitializer)}else if(Module["memoryInitializerPrefixURL"]){memoryInitializer=Module["memoryInitializerPrefixURL"]+memoryInitializer}if(ENVIRONMENT_IS_NODE||ENVIRONMENT_IS_SHELL){var data=Module["readBinary"](memoryInitializer);HEAPU8.set(data,STATIC_BASE)}else{addRunDependency("memory initializer");Browser.asyncLoad(memoryInitializer,(function(data){HEAPU8.set(data,STATIC_BASE);removeRunDependency("memory initializer")}),(function(data){throw"could not load memory initializer "+memoryInitializer}))}}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var preloadStartTime=null;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"]&&shouldRunNow)run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};Module["callMain"]=Module.callMain=function callMain(args){assert(runDependencies==0,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");assert(__ATPRERUN__.length==0,"cannot call main when preRun functions remain to be called");args=args||[];ensureInitRuntime();var argc=args.length+1;function pad(){for(var i=0;i<4-1;i++){argv.push(0)}}var argv=[allocate(intArrayFromString(Module["thisProgram"]),"i8",ALLOC_NORMAL)];pad();for(var i=0;i<argc-1;i=i+1){argv.push(allocate(intArrayFromString(args[i]),"i8",ALLOC_NORMAL));pad()}argv.push(0);argv=allocate(argv,"i32",ALLOC_NORMAL);initialStackTop=STACKTOP;try{var ret=Module["_main"](argc,argv,0);exit(ret)}catch(e){if(e instanceof ExitStatus){return}else if(e=="SimulateInfiniteLoop"){Module["noExitRuntime"]=true;return}else{if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);throw e}}finally{calledMain=true}};function run(args){args=args||Module["arguments"];if(preloadStartTime===null)preloadStartTime=Date.now();if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(ENVIRONMENT_IS_WEB&&preloadStartTime!==null){Module.printErr("pre-main prep time: "+(Date.now()-preloadStartTime)+" ms")}if(Module["_main"]&&shouldRunNow){Module["callMain"](args)}postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=Module.run=run;function exit(status){if(Module["noExitRuntime"]){return}ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(ENVIRONMENT_IS_NODE){process["stdout"]["once"]("drain",(function(){process["exit"](status)}));console.log(" ");setTimeout((function(){process["exit"](status)}),500)}else if(ENVIRONMENT_IS_SHELL&&typeof quit==="function"){quit(status)}throw new ExitStatus(status)}Module["exit"]=Module.exit=exit;function abort(text){if(text){Module.print(text);Module.printErr(text)}ABORT=true;EXITSTATUS=1;var extra="\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";throw"abort() at "+stackTrace()+extra}Module["abort"]=Module.abort=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"]){shouldRunNow=false}run();var origMalloc=Module._malloc;var origFree=Module._free;var MEMSTATS={totalMemory:Module.HEAPU8.length,heapUsed:0};var MEMSTATS_DATA={pointerToSizeMap:{},getSizeOfPointer:(function(ptr){return MEMSTATS_DATA.pointerToSizeMap[ptr]})};Module.MEMSTATS=MEMSTATS;Module.MEMSTATS_DATA=MEMSTATS_DATA;var hookedMalloc=(function(size){var ptr=origMalloc(size);if(!ptr){return 0}MEMSTATS.heapUsed+=size;MEMSTATS_DATA.pointerToSizeMap[ptr]=size;return ptr});var hookedFree=(function(ptr){if(ptr){MEMSTATS.heapUsed-=MEMSTATS_DATA.getSizeOfPointer(ptr)||0;delete MEMSTATS_DATA.pointerToSizeMap[ptr]}return origFree(ptr)});Module._malloc=hookedMalloc;Module._free=hookedFree;_malloc=hookedMalloc;_free=hookedFree;var setInnerMalloc,setInnerFree;if(setInnerMalloc){setInnerMalloc(hookedMalloc);setInnerFree(hookedFree)}return module.exports});if(true){module.exports=C_MINISAT}





/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const direction_1 = __webpack_require__(39);

const spatial_1 = __webpack_require__(1);

const retry_1 = __webpack_require__(46);

const asset_1 = __webpack_require__(18);

const features_1 = __webpack_require__(15);

const items_1 = __webpack_require__(37);

const place_character_1 = __webpack_require__(95);

function fill(world, map, level, entity, random, description) {
  const structure = world.getComponent(entity, 'structure');
  const region = world.getComponent(structure.region, 'region');
  const sampledContainers = {
    center: [],
    wall: [],
    random: []
  };
  description.containers.forEach(c => {
    sampledContainers[c.placement].push(...sampleSpawn(random, c));
  });
  const containers = placeAssets(world, map, level, random, sampledContainers, structure.shape.bounds());
  const sampledDecorations = {
    center: [],
    wall: [],
    random: []
  };
  description.decorations.forEach(c => {
    sampledDecorations[c.placement].push(...sampleSpawn(random, c));
  });
  placeAssets(world, map, level, random, sampledDecorations, structure.shape.bounds());
  const sampledItems = [];
  description.loots.forEach(l => sampledItems.push(...sampleSpawn(random, l)));
  const sampledCharacters = [];
  description.npcs.forEach(l => sampledCharacters.push(...sampleSpawn(random, l)));
  placeCharacterRandomly(world, map, level, random, region.type, sampledCharacters, structure.shape.bounds());

  if (containers.length > 0) {
    const createdItems = sampledItems.map(i => items_1.createEntityWithItemComponent(world, i, random, region.type));
    createdItems.forEach(item => {
      const container = random.pick(containers);
      world.getComponent(container, 'inventory').content.push(item);
    });
  }
}

exports.fill = fill;

function sampleSpawn(random, layout) {
  const amount = random.integerBetween(layout.occurrence.minimum, layout.occurrence.maximum);
  const result = [];

  for (let i = 0; i < amount; i++) {
    result.push(random.pick(layout.types));
  }

  return result;
}

function placeAssets(world, map, level, random, placements, bounds) {
  return [...placeAssetAtWalls(world, map, level, random, placements.wall, bounds), ...placeAssetRandomly(world, map, level, random, placements.random, bounds), ...placeAssetCentered(world, map, level, random, placements.center, bounds)];
}

function placeAssetAtWalls(world, map, level, random, assets, bounds) {
  const placedAssets = [];
  retry_1.retry(random, assets, a => {
    const direction = random.pick(direction_1.directions);
    const directionIntoRoom = direction_1.oppositeOf(direction);
    const center = bounds.centerOf(direction);
    const h = Math.floor(bounds.height / 2);
    const offset = spatial_1.Vector.fromDirection(direction).perpendicular().mult(random.integerBetween(-h, h));
    const p = center.add(offset);
    const shape = asset_1.shapeOfAsset(a, p, directionIntoRoom);
    const isFree = shape.all(p => map.levels[level].tileMatches(world, p, t => t !== undefined && (t.feature() === features_1.features.room || t.feature() === features_1.features.corridor)));

    if (isFree) {
      placedAssets.push(asset_1.createAssetFromShape(world, random, level, shape, a));
    }

    return isFree;
  });
  return placedAssets;
}

function placeAssetRandomly(world, map, level, random, assets, bounds) {
  const placedAssets = [];
  retry_1.retry(random, assets, a => {
    const direction = random.pick(direction_1.directions);
    const position = new spatial_1.Vector([random.integerBetween(bounds.left, bounds.right), random.integerBetween(bounds.top, bounds.bottom)]);
    const shape = asset_1.shapeOfAsset(a, position, direction);
    const isFree = shape.all(p => canPlace(world, map, level, p));

    if (isFree) {
      placedAssets.push(asset_1.createAssetFromShape(world, random, level, shape, a));
    }

    return isFree;
  });
  return placedAssets;
}

function placeAssetCentered(world, map, level, random, assets, bounds) {
  const placedAssets = [];
  retry_1.retry(random, assets, a => {
    const direction = random.pick(direction_1.directions);
    const position = bounds.center;
    const shape = asset_1.shapeOfAsset(a, position, direction);
    const isFree = shape.all(p => canPlace(world, map, level, p));

    if (isFree) {
      placedAssets.push(asset_1.createAssetFromShape(world, random, level, shape, a));
    }

    return isFree;
  });
  return placedAssets;
}

function placeCharacterRandomly(world, map, level, random, region, characters, bounds) {
  const placedCharacters = [];
  retry_1.retry(random, characters, creator => {
    const position = new spatial_1.Vector([random.integerBetween(bounds.left, bounds.right), random.integerBetween(bounds.top, bounds.bottom)]);
    const isFree = canPlace(world, map, level, position);

    if (isFree) {
      const character = creator(world, random, region, {});
      place_character_1.placeCharacter(world, character, level, position);
      placedCharacters.push(character);
    }

    return isFree;
  });
  return placedCharacters;
}

function canPlace(world, map, level, position) {
  return map.levels[level].tileMatches(world, position, t => t !== undefined && t.feature().ground);
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const position_1 = __webpack_require__(96);

function placeCharacter(world, entity, level, position) {
  const map = world.getResource('map');
  map.levels[level].setCharacter(position, entity);
  world.editEntity(entity).withComponent('position', position_1.centeredPosition(level, position));
}

exports.placeCharacter = placeCharacter;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function centeredPosition(level, position) {
  return {
    level,
    position: position.center
  };
}

exports.centeredPosition = centeredPosition;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const random_1 = __webpack_require__(5);

const partitioners = __importStar(__webpack_require__(47));

class SpacePartitioner {
  constructor(rng) {
    this.random = new random_1.Random(rng);
    this.partitioners = [new partitioners.NoSplit(10)];
  }

  registerPartitioner(partitioner) {
    this.partitioners.push(partitioner);
  }

  partition(shape, exits) {
    const partitioners = this.partitioners.filter(p => p.canPartition(shape, exits) && p.weight > 0);
    let partitioner = this.partitioners[0];

    if (partitioners.length > 0) {
      const decision = this.random.weightedDecision(partitioners.map(p => p.weight));
      partitioner = partitioners[decision];
    }

    return partitioner.partition(this, this.random, shape, exits);
  }

  createRoom(shape, exits) {
    return {
      type: 'final',
      shape,
      exits,
      kind: 'room'
    };
  }

  createCorridor(shape, exits) {
    return {
      type: 'final',
      shape,
      exits,
      kind: 'corridor'
    };
  }

  exitConnectsShape(shape, exit) {
    return shape.bounds().grow().containsVector(exit);
  }

}

exports.SpacePartitioner = SpacePartitioner;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const rectangle_1 = __webpack_require__(3);

class CorridorSplit {
  constructor(corridorWidth, maxRoomWidth) {
    this.corridorWidth = corridorWidth;
    this.maxRoomWidth = maxRoomWidth;
    this.weight = 20;
  }

  canPartition(shape, exits) {
    const exit = exits[0];
    const bounds = shape.bounds().grow();
    const axis = bounds.top === exit.y || bounds.bottom === exit.y ? 'x' : 'y';
    const minimalSideLength = Math.min(bounds.width, bounds.height);
    const minimalSplitSidelength = axis === 'x' ? Math.min(exit.x - bounds.left, bounds.right - exit.x) : Math.min(exit.y - bounds.top, bounds.bottom - exit.y);
    const axisIsSplittable = minimalSplitSidelength > this.maxRoomWidth + Math.ceil(this.corridorWidth / 2);
    return axisIsSplittable && minimalSideLength > this.maxRoomWidth;
  }

  partition(context, random, shape, exits) {
    const [head, ...tail] = exits;
    const bounds = shape.bounds();
    const axis = bounds.grow().top === head.y || bounds.grow().bottom === head.y ? 'x' : 'y';
    const split = axis === 'x' ? head.x - bounds.left : head.y - bounds.top;
    const [left, middle, right] = this.split(bounds, axis, split - Math.ceil(this.corridorWidth / 2), this.corridorWidth);
    const yOffset = spatial_1.Vector.fromDirection('down').mult(4);
    const xOffset = spatial_1.Vector.fromDirection('right').mult(4);
    const leftExit = axis === 'x' ? random.betweenVectors(left.grow().topRight.add(yOffset), left.grow().bottomRight.minus(yOffset)) : random.betweenVectors(left.grow().bottomLeft.add(xOffset), left.grow().bottomRight.minus(xOffset));
    const rightExit = axis === 'x' ? random.betweenVectors(right.grow().topLeft.add(yOffset), right.grow().bottomLeft.minus(yOffset)) : random.betweenVectors(right.grow().topLeft.add(xOffset), right.grow().topRight.minus(xOffset));
    const leftTail = tail.filter(e => context.exitConnectsShape(left, e));
    const rightTail = tail.filter(e => context.exitConnectsShape(right, e));
    return {
      shape,
      type: 'node',
      exit: 1,
      partitions: [context.partition(left, [leftExit, ...leftTail]), context.createCorridor(middle, exits), context.partition(right, [rightExit, ...rightTail])],
      connections: [{
        from: 0,
        to: 1
      }, {
        from: 1,
        to: 2
      }]
    };
  }

  split(r, axis, split, width) {
    let a;
    let b;
    let c;

    if (axis === 'x') {
      a = rectangle_1.Rectangle.fromBounds(r.left, r.left + split - 1, r.top, r.bottom);
      b = rectangle_1.Rectangle.fromBounds(a.right + 2, a.right + 1 + width, r.top, r.bottom);
      c = rectangle_1.Rectangle.fromBounds(b.right + 2, r.right, r.top, r.bottom);
    } else {
      a = rectangle_1.Rectangle.fromBounds(r.left, r.right, r.top, r.top + split - 1);
      b = rectangle_1.Rectangle.fromBounds(r.left, r.right, a.bottom + 2, a.bottom + 1 + width);
      c = rectangle_1.Rectangle.fromBounds(r.left, r.right, b.bottom + 2, r.bottom);
    }

    return [a, b, c];
  }

}

exports.CorridorSplit = CorridorSplit;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class NoSplit {
  constructor(maxRoomWidth) {
    this.maxRoomWidth = maxRoomWidth;
    this.weight = 2;
  }

  canPartition(shape) {
    return shape.bounds().width <= this.maxRoomWidth || shape.bounds().height <= this.maxRoomWidth;
  }

  partition(context, _random, shape, exits) {
    return context.createRoom(shape, exits);
  }

}

exports.NoSplit = NoSplit;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const difference_1 = __webpack_require__(29);

class OutsetCorridorSplit {
  constructor(outerWidth, minInnerWidth) {
    this.outerWidth = outerWidth;
    this.minInnerWidth = minInnerWidth;
    this.weight = 1;
  }

  canPartition(shape) {
    const bounds = shape.bounds();
    const width = Math.min(bounds.width, bounds.height);
    return width - this.outerWidth - 1 > this.minInnerWidth;
  }

  partition(context, _random, shape, exits) {
    const inner = shape.shrink(this.outerWidth + 1);
    const outer = new difference_1.Difference(shape, inner.grow());
    const leftExit = inner.bounds().grow().centerLeft;
    return {
      shape,
      type: 'node',
      exit: 1,
      partitions: [context.partition(inner, [leftExit]), context.createCorridor(outer, exits)],
      connections: [{
        from: 0,
        to: 1
      }]
    };
  }

}

exports.OutsetCorridorSplit = OutsetCorridorSplit;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const rectangle_1 = __webpack_require__(3);

class RoomSplit {
  constructor(minRoomWidth) {
    this.minRoomWidth = minRoomWidth;
    this.weight = 10;
  }

  canPartition(shape, exits) {
    const exit = exits[0];
    const bounds = shape.bounds().grow();
    const axis = bounds.top === exit.y || bounds.bottom === exit.y ? 'y' : 'x';
    const sideLength = axis === 'x' ? bounds.width : bounds.height;
    return sideLength > 2 * this.minRoomWidth;
  }

  partition(context, random, shape, exits) {
    const [head, ...tail] = exits;
    const bounds = shape.bounds();
    const axis = bounds.grow().top === head.y || bounds.grow().bottom === head.y ? 'y' : 'x';
    const sideLength = axis === 'x' ? bounds.width : bounds.height;
    const split = random.integerBetween(this.minRoomWidth, sideLength - this.minRoomWidth);
    let [left, right] = this.split(bounds, axis, split);
    let exit = axis === 'x' ? left.grow().centerRight : left.grow().centerBottom;

    if (context.exitConnectsShape(right, head)) {
      ;
      [left, right] = [right, left];
    }

    const leftTail = tail.filter(e => context.exitConnectsShape(left, e));
    const rightTail = tail.filter(e => context.exitConnectsShape(right, e));
    return {
      shape,
      type: 'node',
      exit: 0,
      partitions: [context.partition(left, [head, exit, ...leftTail]), context.partition(right, [exit, ...rightTail])],
      connections: [{
        from: 0,
        to: 1
      }]
    };
  }

  split(r, axis, split) {
    let a;
    let b;

    if (axis === 'x') {
      a = rectangle_1.Rectangle.fromBounds(r.left, r.left + split, r.top, r.bottom);
      b = rectangle_1.Rectangle.fromBounds(a.right + 2, r.right, r.top, r.bottom);
    } else {
      a = rectangle_1.Rectangle.fromBounds(r.left, r.right, r.top, r.top + split);
      b = rectangle_1.Rectangle.fromBounds(r.left, r.right, a.bottom + 2, r.bottom);
    }

    return [a, b];
  }

}

exports.RoomSplit = RoomSplit;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const rectangle_1 = __webpack_require__(3);

const difference_1 = __webpack_require__(29);

const union_1 = __webpack_require__(103);

class KnossosMaze {
  constructor() {
    this.weight = 1;
  }

  canPartition(_shape) {
    return true;
  }

  partition(context, _random, shape, exits) {
    const corridorWidth = 2;
    const wallWidth = 1;
    const center = new rectangle_1.Rectangle(shape.bounds().center.x - 5, shape.bounds().center.y, 10, 10);
    const c1 = new rectangle_1.Rectangle(center.bottomRight.x + 1, center.bottomRight.y - corridorWidth + 1, corridorWidth + wallWidth, corridorWidth);
    const c2 = new rectangle_1.Rectangle(center.topRight.x + wallWidth + 1, center.topRight.y - corridorWidth - wallWidth, corridorWidth, wallWidth + center.height);
    const c3 = new rectangle_1.Rectangle(center.topLeft.x - wallWidth - corridorWidth, center.topLeft.y - corridorWidth - wallWidth, corridorWidth + 2 * wallWidth + center.width, corridorWidth);
    const c4 = new rectangle_1.Rectangle(center.topLeft.x - wallWidth - corridorWidth, center.topLeft.y - wallWidth, corridorWidth, center.height + wallWidth);
    const c5 = new rectangle_1.Rectangle(center.bottomLeft.x - 2 * corridorWidth - 2 * wallWidth, center.bottomLeft.y - corridorWidth + 1, corridorWidth + wallWidth, corridorWidth);
    const c6 = new rectangle_1.Rectangle(center.topLeft.x - 2 * corridorWidth - 2 * wallWidth, center.topLeft.y - 2 * corridorWidth - 2 * wallWidth, corridorWidth, center.height - corridorWidth + 2 * (wallWidth + corridorWidth));
    const c7 = new rectangle_1.Rectangle(center.topLeft.x - corridorWidth - 2 * wallWidth, center.topLeft.y - 2 * corridorWidth - 2 * wallWidth, center.width + 3 * corridorWidth + 4 * wallWidth, corridorWidth);
    const c8 = new rectangle_1.Rectangle(center.topRight.x + corridorWidth + 2 * wallWidth + 1, center.topRight.y - corridorWidth - 2 * wallWidth, corridorWidth, center.height + 2 * corridorWidth + 3 * wallWidth);
    const c9 = new rectangle_1.Rectangle(center.bottomRight.x + 1, center.bottomRight.y + wallWidth + 1, corridorWidth + 2 * wallWidth, corridorWidth);
    const c10 = new rectangle_1.Rectangle(center.bottomRight.x + 1, center.bottomRight.y + wallWidth + 1 + corridorWidth, corridorWidth, corridorWidth + wallWidth);
    const c11 = new rectangle_1.Rectangle(center.bottomRight.x + 1 + corridorWidth, center.bottomRight.y + 2 * wallWidth + 1 + corridorWidth, 2 * corridorWidth + 3 * wallWidth, corridorWidth);
    const c12 = new rectangle_1.Rectangle(center.topRight.x + 2 * corridorWidth + 3 * wallWidth + 1, center.topRight.y - 3 * corridorWidth - 3 * wallWidth, corridorWidth, center.height + 4 * corridorWidth + 5 * wallWidth);
    const c13 = new rectangle_1.Rectangle(center.topLeft.x - 3 * corridorWidth - 3 * wallWidth, center.topLeft.y - 3 * corridorWidth - 3 * wallWidth, center.width + 5 * corridorWidth + 6 * wallWidth, corridorWidth);
    const c14 = new rectangle_1.Rectangle(center.topLeft.x - 3 * corridorWidth - 3 * wallWidth, center.topLeft.y - 2 * corridorWidth - 3 * wallWidth, corridorWidth, center.height + 3 * corridorWidth + 4 * wallWidth);
    const c15 = new rectangle_1.Rectangle(center.topLeft.x - 2 * corridorWidth - 3 * wallWidth, center.bottomRight.y + wallWidth + 1, center.width + 2 * corridorWidth + 2 * wallWidth, corridorWidth);
    const c16 = new rectangle_1.Rectangle(center.bottomRight.x + 1 - wallWidth - corridorWidth, center.bottomRight.y + wallWidth + 1 + corridorWidth, corridorWidth, corridorWidth + wallWidth);
    const maze = union_1.Union.of(center, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16);
    const outer = new difference_1.Difference(shape, maze.grow());
    return {
      shape,
      type: 'node',
      exit: 1,
      partitions: [context.createRoom(center, [c1.grow().centerLeft]), context.createCorridor(c1, [c2.grow().centerBottom]), context.createCorridor(c2, [c3.grow().centerRight]), context.createCorridor(c3, [c4.grow().centerTop]), context.createCorridor(c4, [c5.grow().centerRight]), context.createCorridor(c5, [c6.grow().centerBottom]), context.createCorridor(c6, [c7.grow().centerLeft]), context.createCorridor(c7, [c8.grow().centerTop]), context.createCorridor(c8, [c9.grow().centerRight]), context.createCorridor(c9, [c10.grow().centerTop]), context.createCorridor(c10, [c11.grow().centerLeft]), context.createCorridor(c11, [c12.grow().centerBottom]), context.createCorridor(c12, [c13.grow().centerRight]), context.createCorridor(c13, [c14.grow().centerLeft]), context.createCorridor(c14, [c15.grow().centerLeft]), context.createCorridor(c15, [c16.grow().centerTop]), context.createCorridor(c16, [c16.grow().centerBottom]), context.createCorridor(outer, exits)],
      connections: [{
        from: 0,
        to: 1
      }, {
        from: 1,
        to: 2
      }, {
        from: 2,
        to: 3
      }, {
        from: 3,
        to: 4
      }, {
        from: 4,
        to: 5
      }, {
        from: 5,
        to: 6
      }, {
        from: 6,
        to: 7
      }, {
        from: 7,
        to: 8
      }, {
        from: 8,
        to: 9
      }, {
        from: 9,
        to: 10
      }, {
        from: 10,
        to: 11
      }, {
        from: 11,
        to: 12
      }, {
        from: 12,
        to: 13
      }, {
        from: 13,
        to: 14
      }, {
        from: 14,
        to: 15
      }, {
        from: 15,
        to: 16
      }]
    };
  }

}

exports.KnossosMaze = KnossosMaze;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const shape_1 = __webpack_require__(14);

class Union extends shape_1.AbstractShape {
  constructor(shape1, shape2) {
    super();
    this.shape1 = shape1;
    this.shape2 = shape2;
  }

  static of(...shapes) {
    return shapes.reduce((p, c) => new Union(p, c));
  }

  bounds() {
    return this.shape1.bounds().plus(this.shape2.bounds());
  }

  containsVector(p) {
    return this.shape1.containsVector(p) || this.shape2.containsVector(p);
  }

  grow(cells = 1) {
    return new Union(this.shape1.grow(cells), this.shape2.grow(cells));
  }

  shrink(cells = 1) {
    return new Union(this.shape1.shrink(cells), this.shape2.shrink(cells));
  }

  translate(t) {
    return new Union(this.shape1.translate(t), this.shape2.translate(t));
  }

  all(f) {
    return this.bounds().all(p => {
      if (this.containsVector(p)) {
        return f(p);
      }

      return true;
    });
  }

}

exports.Union = Union;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const available_actions_1 = __webpack_require__(48);

const random_1 = __webpack_require__(5);

const attack_target_1 = __webpack_require__(49);

const consume_item_1 = __webpack_require__(40);

const apply_effect_1 = __webpack_require__(11);

const inventory_description_1 = __webpack_require__(30);

const instantiate_item_1 = __webpack_require__(17);

const characters_1 = __webpack_require__(8);

const modal_1 = __webpack_require__(19);

class PlayerRoundControl {
  constructor(queries, pushState, rng) {
    this.queries = queries;
    this.pushState = pushState;
    this.rng = rng;
    this.components = ['take-turn', 'player', 'position'];
    this.random = new random_1.Random(rng);
  }

  update(world, entity) {
    const script = world.getComponent(entity, 'script');
    const takeTurn = world.getComponent(entity, 'take-turn');
    const isInAnimation = script !== undefined;

    if (!isInAnimation) {
      const turnIsOver = takeTurn.acted && takeTurn.moved;

      if (!turnIsOver) {
        const availableActions = available_actions_1.calculateAvailableActions(world, entity, true);
        this.doTurn(world, entity, takeTurn, availableActions);
      } else {
        this.endTurn(world, entity);
      }
    }
  }

  doTurn(world, entity, takeTurn, availableActions) {
    const ui = world.getResource('ui');
    const input = world.getResource('input');

    if (takeTurn.selectionState === undefined) {
      ui.showActionSelector(availableActions);
      takeTurn.selectionState = {
        currentSubAction: 0,
        skippedActions: 0
      };
    } else if (takeTurn.selectionState.selection === undefined) {
      const selection = ui.selectedAction();

      if (selection !== undefined) {
        takeTurn.selectionState.selection = selection;
        ui.hideSelectors();
      }
    } else {
      const skip = input.isActive('cancel');
      const action = takeTurn.selectionState.selection.action;
      const subActionCount = action.subActions.length;
      const allDone = takeTurn.selectionState.currentSubAction >= subActionCount;

      if (!allDone) {
        if (skip) {
          takeTurn.selectionState.currentSubAction += 1;
          takeTurn.selectionState.skippedActions += 1;
        } else {
          const currentSubAction = action.subActions[takeTurn.selectionState.currentSubAction];
          const done = this.handleSubAction(world, entity, action, currentSubAction, takeTurn.selectionState);

          if (done) {
            takeTurn.selectionState.currentSubAction += 1;
          }
        }
      } else {
        apply_effect_1.clearExpiredEffects(world, entity);
        const action = takeTurn.selectionState.selection.action;
        const noActionsOrAtLeastOneActionTaken = subActionCount == 0 || subActionCount - takeTurn.selectionState.skippedActions > 0;

        if (noActionsOrAtLeastOneActionTaken) {
          switch (action.cost) {
            case 'action':
              takeTurn.acted = true;
              break;

            case 'movement':
              takeTurn.moved = true;
              break;

            case 'either':
              if (takeTurn.moved) {
                takeTurn.acted = true;
              } else {
                takeTurn.moved = true;
              }

              break;

            case 'all':
            case 'both':
              takeTurn.acted = true;
              takeTurn.moved = true;
              break;
          }
        }

        takeTurn.selectionState = undefined;
      }
    }
  }

  handleSubAction(world, entity, action, subAction, state) {
    switch (subAction.kind) {
      case 'attack':
        if (state.target === undefined) {
          state.target = this.findTarget(world, entity, subAction);
          return false;
        } else {
          const result = attack_target_1.attackTarget(world, this.random, entity, state.target, subAction);

          if (subAction.grants) {
            action.subActions.splice(state.currentSubAction + 1, 0, ...subAction.grants(result));
          }

          state.target = undefined;
          return true;
        }

      case 'movement':
      case 'jump':
        return this.move(world, entity, subAction);

      case 'status':
        state.skippedActions += 1;
        return this.status(world, entity, subAction, state.selection.entity);

      case 'changeEquipment':
        return this.changeEquipment(world, entity);

      case 'trigger':
        return this.trigger(world, entity, state.selection.entity);
    }
  }

  endTurn(world, entity) {
    world.editEntity(entity).removeComponent('take-turn').withComponent('took-turn', {});
  }

  move(world, entity, movement) {
    const ui = world.getResource('ui');
    ui.showMovementSelector(entity, this.queries, movement);
    const path = ui.selectedMovement();

    if (path !== undefined) {
      ui.hideSelectors();
      world.editEntity(entity).withComponent('script', {
        path: path.path
      });
      return true;
    }

    return false;
  }

  findTarget(world, entity, attack) {
    const viewport = world.getResource('viewport');
    const map = world.getResource('map');
    const ui = world.getResource('ui');
    ui.showAttackSelector(entity, this.queries, attack.range);
    const path = ui.selectedAttack();

    if (path !== undefined) {
      for (let i = 0; i < path.path.length; ++i) {
        const region = map.levels[viewport.level];
        let target = region.getCharacter(path.path[i]);
        const hasEnemy = target !== undefined && target !== entity;

        if (hasEnemy) {
          ui.hideSelectors();
          return target;
        }
      }
    }

    return undefined;
  }

  status(world, entity, status, item) {
    const target = status.target === 'item' ? item : entity;
    status.effects.forEach(effect => {
      apply_effect_1.applyEffect(world, this.random, target, {
        source: item,
        effect,
        isCritical: false,
        isPiercing: false
      });
    });
    const itemComponent = world.getComponent(item, 'item');

    if (itemComponent !== undefined && itemComponent.item.kind === 'consumable') {
      consume_item_1.consumeItem(world, entity, item);
    }

    return true;
  }

  trigger(world, entity, target) {
    world.editEntity(target).withComponent('active', {}).withComponent('triggered-by', {
      entity
    });
    return true;
  }

  changeEquipment(world, entity) {
    const ui = world.getResource('ui');
    let selection = undefined;
    const inventory = inventory_description_1.createInventoryDescription(world, entity);

    if (!ui.multipleChoiceModalShowing()) {
      const items = inventory.items.filter(i => i.item.attachments > 0).map(i => ({
        entity: i.entity,
        description: i.item.name + (inventory.equipment.some(e => e.entity === i.entity) ? '*' : '')
      }));
      ui.showMultipleChoiceModal(world, 'choose item', items);
      this.pushState(new modal_1.Modal(world.activeSystemsList()));
    } else {
      selection = ui.selectedModalOption();
      ui.hideMultipleChoiceModal();
    }

    if (selection !== undefined) {
      const {
        item
      } = instantiate_item_1.instantiateItem(world, selection);
      const attachementIndex = inventory.equipment.findIndex(e => e.entity === selection);

      if (attachementIndex >= 0) {
        characters_1.unequip(world, entity, selection);
      } else {
        characters_1.replacingEquip(world, entity, selection, item);
      }

      return true;
    }

    return false;
  }

}

exports.PlayerRoundControl = PlayerRoundControl;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const cover_1 = __webpack_require__(38);

const stats_1 = __webpack_require__(31);

function calculateHitChance(world, entity, target, attack) {
  const position = world.getComponent(entity, 'position');
  const targetPosition = world.getComponent(target, 'position');
  const cover = cover_1.calculateCover(world, targetPosition.level, position.position, targetPosition.position);
  const distance = new spatial_1.Vector([position.position.fX - targetPosition.position.fX, position.position.fY - targetPosition.position.fY]).lN();
  const normalizedDistance = 10 * (distance - 1) / attack.range;
  const aim = stats_1.getAim(world, entity) / 10;
  const accuracy = attack.accuracy / 10;
  const criticalHit = stats_1.getCriticalChance(world, entity) / 10;
  const base = Math.min(aim, accuracy);
  const distancePenalty = normalizedDistance < 2 ? 0 : normalizedDistance < 5 ? 0.1 : 0.2;
  const coverPenalty = cover === 'full' ? 0.5 : cover === 'partial' ? 0.2 : 0;
  return {
    base,
    distancePenalty,
    coverPenalty,
    final: base - distancePenalty - coverPenalty,
    criticalHit
  };
}

exports.calculateHitChance = calculateHitChance;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const asset_1 = __webpack_require__(18);

const ui_1 = __webpack_require__(22);

const modal_1 = __webpack_require__(19);

const random_1 = __webpack_require__(5);

const ai_1 = __webpack_require__(41);

const position_1 = __webpack_require__(43);

class Trigger {
  constructor(rng, pushState) {
    this.rng = rng;
    this.pushState = pushState;
    this.components = ['active', 'triggers'];
    this.random = new random_1.Random(rng);
  }

  update(world, entity) {
    let handled = true;
    const triggers = world.getComponent(entity, 'triggers');

    switch (triggers.type) {
      case 'dialog':
        handled = this.handleDialog(world, entity, triggers);
        break;

      case 'asset':
        handled = this.handleAsset(world, entity, triggers);
        break;
    }

    if (handled) {
      world.editEntity(entity).removeComponent('active').removeComponent('triggered-by');
    }
  }

  handleDialog(world, entity, triggers) {
    const dialog = this.getDialog(world, entity, triggers);
    const triggeredBy = world.getComponent(entity, 'triggered-by');
    const result = ui_1.runDialog(world.getResource('ui'), world, this.random, dialog.type, triggeredBy.entity, entity, this.pushState);

    if (result !== undefined) {
      switch (result.type) {
        case 'attack':
          {
            const ai = world.getComponent(entity, 'ai');

            if (ai !== undefined) {
              ai_1.engage(world, ai, entity, triggeredBy.entity, this.pushState);
            }

            break;
          }

        case 'move_level_up':
          {
            const p = world.getComponent(triggeredBy.entity, 'position');
            position_1.move(world, triggeredBy.entity, p.level + 1, p.position);
            break;
          }

        case 'move_level_down':
          {
            const p = world.getComponent(triggeredBy.entity, 'position');
            position_1.move(world, triggeredBy.entity, p.level - 1, p.position);
            break;
          }

        case 'unlock_lore':
          {
            const lore = world.getComponent(entity, 'lore');
            world.getResource('progress').unlockLore(world, lore.type);
            break;
          }

        case 'start_quest':
          {
            const quest = world.getComponent(entity, 'quest');
            world.getResource('progress').startQuest(world, quest.type);
            break;
          }

        case 'trigger':
          {
            world.editEntity(result.target).withComponent('active', {}).withComponent('triggered-by', {
              entity: triggeredBy.entity
            });
            break;
          }
      }

      return true;
    }

    return false;
  }

  getDialog(world, entity, triggers) {
    let dialog = world.getComponent(entity, 'dialog');

    if (dialog === undefined) {
      dialog = world.getComponent(triggers.entities[0], 'dialog');
    }

    return dialog;
  }

  handleAsset(world, entity, triggers) {
    const asset = world.getComponent(entity, 'asset');

    switch (asset.type) {
      case 'door':
        return this.door(world, triggers);

      case 'loot':
        return this.loot(world, entity, triggers, true);

      case 'elevator':
      case 'terminal':
        return this.handleDialog(world, entity, triggers);

      case 'trash':
      case 'locker':
      case 'table':
        return this.loot(world, entity, triggers, false);

      case 'generator':
        this.log(world, 'clonck');
        return true;

      default:
        return true;
    }
  }

  door(world, triggers) {
    const map = world.getResource('map');
    const charactersInWay = triggers.entities.some(e => {
      const position = world.getComponent(e, 'position');
      return map.levels[position.level].getCharacter(position.position) !== undefined;
    });

    if (!charactersInWay) {
      triggers.entities.forEach(doorPart => this.swapGroundAndFeature(world, doorPart));
    }

    return true;
  }

  loot(world, entity, triggers, remove) {
    const map = world.getResource('map');
    const ui = world.getResource('ui');

    if (!ui.isModal) {
      const triggeredBy = world.getComponent(entity, 'triggered-by');
      const sourceFeature = world.getComponent(triggers.entities[0], 'feature');
      const targetFeature = world.getComponent(triggeredBy.entity, 'feature');
      const targetText = targetFeature.feature().name;
      const sourceText = sourceFeature.feature().name;
      ui.showInventoryTransferModal(world, entity, sourceText, triggeredBy.entity, targetText);
      this.pushState(new modal_1.Modal(world.activeSystemsList()));
    } else if (!ui.inventoryTransferModalShowing()) {
      ui.isModal = false;
      const inventory = world.getComponent(entity, 'inventory');

      if (remove && inventory.content.length === 0) {
        asset_1.removeAsset(world, map, entity);
      }

      return true;
    }

    return false;
  }

  log(world, text) {
    const log = world.getResource('log');
    log.text(text);
  }

  swapGroundAndFeature(world, entity) {
    const feature = world.getComponent(entity, 'feature');
    const ground = world.getComponent(entity, 'ground');
    const f = feature.feature;
    feature.feature = ground.feature;
    ground.feature = f;
  }

}

exports.Trigger = Trigger;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const character_stats_1 = __webpack_require__(23);

const line_1 = __webpack_require__(108);

const trigger_1 = __webpack_require__(32);

class Script {
  constructor() {
    this.components = ['script'];
  }

  update(world, entity) {
    const script = world.getComponent(entity, 'script');
    const nextLocation = script.path.pop();

    if (nextLocation === undefined) {
      world.editEntity(entity).removeComponent('script');
    } else {
      const done = this.moveOrTrigger(world, entity, nextLocation);

      if (!done) {
        script.path.push(nextLocation);
      }
    }
  }

  moveOrTrigger(world, entity, target) {
    const stats = world.getComponent(entity, 'character-stats');
    const current = world.getComponent(entity, 'position');
    const delta = target.center.minus(current.position).normalize();

    if (delta.isNan()) {
      console.warn('target already reached');
      return true;
    }

    const movement = delta.mult(character_stats_1.speed(stats));
    let newPosition = current.position.add(movement);
    const map = world.getResource('map');
    const level = map.levels[current.level];
    const isBlocked = level.isBlocking(world, newPosition, entity);
    const trigger = trigger_1.findTriggerOfEntity(world, level.getTile(newPosition));

    if (isBlocked && trigger !== undefined && world.getComponent(trigger, 'triggers').inTurnBased) {
      world.editEntity(trigger).withComponent('active', {}).withComponent('triggered-by', {
        entity
      });
      world.getComponent(entity, 'script').path = [];
      return false;
    } else {
      const finishLine = new line_1.Line(target.center, delta.perpendicular());
      let reached = false;

      if (finishLine.side(current.position) !== finishLine.side(newPosition)) {
        newPosition = target.center;
        reached = true;
      }

      level.removeCharacter(current.position);
      level.setCharacter(newPosition, entity);
      current.position = newPosition;
      return reached;
    }
  }

}

exports.Script = Script;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class Line {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  side(point) {
    const d = (point.x - this.origin.x) * this.direction.y - (point.y - this.origin.y) * this.direction.x;

    if (d < 0) {
      return 'left';
    } else if (d === 0) {
      return 'inside';
    } else {
      return 'right';
    }
  }

  isEqual(line) {
    return this.side(line.origin) === 'inside' && this.side(line.origin.add(line.direction)) === 'inside';
  }

}

exports.Line = Line;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const set_space_1 = __webpack_require__(27);

const rectangle_1 = __webpack_require__(3);

class Level {
  constructor(width) {
    this.boundary = new rectangle_1.Rectangle(0, 0, width, width);
    this.tiles = new spatial_1.DiscreteSpace(width);
    this.characters = new spatial_1.DiscreteStackSpace(width);
    this.structures = new spatial_1.DiscreteSpace(width);
    this.visible = new set_space_1.SetSpace(width);
    this.discovered = new set_space_1.SetSpace(width);
  }

  setTile(position, entity) {
    this.tiles.set(position, entity);
  }

  getTile(position) {
    return this.tiles.get(position);
  }

  removeTile(position) {
    return this.tiles.remove(position);
  }

  setStructure(position, entity) {
    this.structures.set(position, entity);
  }

  getStructure(position) {
    return this.structures.get(position);
  }

  setCharacter(position, entity) {
    this.characters.set(position, entity);
  }

  getCharacter(position) {
    return this.characters.get(position);
  }

  removeCharacter(position) {
    return this.characters.remove(position);
  }

  isDiscovered(position) {
    return this.discovered.has(position);
  }

  isVisible(position) {
    return this.visible.has(position);
  }

  blocksJump(world, position) {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true;
      }

      return f.feature().cover === 'full';
    });
  }

  isBlocking(world, position, self) {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true;
      }

      return f.feature().blocking;
    }) || this.characterMatches(world, position, f => {
      if (f === undefined) {
        return false;
      }

      return f.feature().blocking;
    }, self);
  }

  isLightBlocking(world, position) {
    return this.tileMatches(world, position, f => {
      if (f === undefined) {
        return true;
      }

      return f.feature().lightBlocking;
    }) || this.characterMatches(world, position, f => {
      if (f === undefined) {
        return false;
      }

      return f.feature().lightBlocking;
    });
  }

  tileMatches(world, position, predicate) {
    return this.featureMatches(world, this.tiles.get(position), predicate);
  }

  characterMatches(world, position, predicate, self) {
    const character = this.characters.get(position);

    if (character !== undefined && self !== undefined && self === character) {
      return false;
    }

    return this.featureMatches(world, character, predicate);
  }

  featureMatches(world, entity, predicate) {
    let feature;

    if (entity !== undefined) {
      feature = world.getComponent(entity, 'feature');
    }

    return predicate(feature);
  }

  isShapeFree(world, shape) {
    return this.shapeHasAll(world, shape, f => f === undefined);
  }

  isShapeBlocked(world, shape) {
    return this.shapeHasSome(world, shape, f => f !== undefined);
  }

  shapeHasAll(world, shape, predicate) {
    return shape.all(p => this.tileMatches(world, p, predicate));
  }

  shapeHasSome(world, shape, predicate) {
    return shape.some(p => this.tileMatches(world, p, predicate));
  }

}

exports.Level = Level;

class WorldMapResource {
  constructor(width) {
    this.width = width;
    this.kind = 'map';
    this.levels = [];
    this.levels.push(new Level(this.width));
    this.levels.push(new Level(this.width));
    this.levels.push(new Level(this.width));
    this.levels.push(new Level(this.width));
    this.levels.push(new Level(this.width));
    this.levels.push(new Level(this.width));
  }

  update(world) {
    world.components.get('player').foreach(player => {
      const position = world.getComponent(player, 'position');

      if (position !== undefined) {
        const level = this.levels[position.level];
        const fov = world.getComponent(player, 'fov');

        if (fov !== undefined) {
          level.visible = fov.fov;
          level.discovered.add(fov.fov);
        }
      }
    });
  }

}

exports.WorldMapResource = WorldMapResource;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const color_1 = __webpack_require__(34);

const palettes_1 = __webpack_require__(2);

const ambientColors = {
  entrance: new color_1.Color([200, 120, 120]),
  'ground-floor': new color_1.Color([80, 80, 120]),
  elevator: undefined,
  'red-base': palettes_1.primary[3],
  'red-plus': palettes_1.primary[3],
  'green-base': palettes_1.primary[1],
  'green-plus': palettes_1.primary[1],
  'yellow-base': palettes_1.primary[0],
  'yellow-plus': palettes_1.primary[0],
  'blue-base': palettes_1.primary[2],
  'blue-plus': palettes_1.primary[2],
  core: palettes_1.primary[4]
};

class ViewportResource {
  constructor(boundaries) {
    this.boundaries = boundaries;
    this.kind = 'viewport';
    this.gridLocked = false;
    this.topLeft = new spatial_1.Vector([0, 0]);
    this.level = 0;
    this.ambientColor = new color_1.Color([200, 120, 120]);
    this.layers = [];
  }

  update(world) {
    const input = world.getResource('input');

    if (input.isActive('grid')) {
      this.gridLocked = !this.gridLocked;
    }

    world.components.get('viewport-focus').foreach(focus => {
      const position = world.getComponent(focus, 'position');

      if (position !== undefined) {
        this.focus(position.level, position.position);
      }
    });
    const map = world.getResource('map');
    const structure = map.levels[this.level].getStructure(this.center());

    if (structure !== undefined) {
      const s = world.getComponent(structure, 'structure');
      const r = world.getComponent(s.region, 'region');
      const color = ambientColors[r.type];

      if (color !== undefined) {
        this.ambientColor = color;
      }
    }
  }

  center() {
    const x = this.topLeft.x + Math.floor(this.boundaries.x / 2) - 5;
    const y = this.topLeft.y + Math.floor(this.boundaries.y / 2) - 5;
    return new spatial_1.Vector([x, y]);
  }

  collectRenderables(world) {
    const renderables = [];

    for (let y = 0; y < this.boundaries.y; y++) {
      for (let x = 0; x < this.boundaries.x; x++) {
        for (let l = this.layers.length - 1; l >= 0; l--) {
          const layer = this.layers[l];
          let renderable;

          if (layer.transformed) {
            renderable = layer.getRenderable(world, this.level, this.fromDisplay({
              x,
              y
            }));
          } else {
            renderable = layer.getRenderable(world, this.level, new spatial_1.Vector([x, y]));
          }

          if (renderable.entity !== undefined) {
            renderables.push(renderable);
          }

          if (!renderable.opaque) {
            break;
          }
        }
      }
    }

    return renderables.reverse();
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  fromDisplay(p) {
    return new spatial_1.Vector([this.topLeft.x + p.x, this.topLeft.y + p.y]);
  }

  toDisplay(p, centered) {
    const position = {
      x: p.x - this.topLeft.x,
      y: p.y - this.topLeft.y
    };

    if (this.gridLocked) {
      position.x = Math.floor(position.x);
      position.y = Math.floor(position.y);
    }

    if (!this.gridLocked && centered) {
      position.x += 0.5;
      position.y += 0.25;
    }

    return position;
  }

  focus(level, position) {
    this.level = level;
    const x = position.x - Math.floor(this.boundaries.x / 2) + 5;
    const y = position.y - Math.floor(this.boundaries.y / 2) + 5;

    if (this.gridLocked) {
      this.topLeft = new spatial_1.Vector([Math.floor(x), Math.floor(y)]);
    } else {
      this.topLeft = new spatial_1.Vector([x, y]);
    }
  }

}

exports.ViewportResource = ViewportResource;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

function key(key) {
  return {
    ctrl: false,
    meta: false,
    alt: false,
    key
  };
}

exports.defaultKeyMapping = {
  left: key('h'),
  down: key('j'),
  up: key('k'),
  right: key('l'),
  use: key('e'),
  plus: key('+'),
  minus: key('-'),
  accept: key('Enter'),
  cancel: key('Escape'),
  0: key('1'),
  1: key('2'),
  2: key('3'),
  3: key('4'),
  4: key('5'),
  5: key('6'),
  6: key('7'),
  7: key('8'),
  8: key('9'),
  inventory: key('i'),
  log: key('o'),
  overview: key('u'),
  focus: key('q'),
  grid: key('g')
};

class InputResource {
  constructor(eventToPosition) {
    this.eventToPosition = eventToPosition;
    this.kind = 'input';
    this.position = undefined;
    this.mouseDown = false;
    this.mousePressed = false;
    this.mouseReleased = false;
    this.shift = false;
    this.ctrl = false;
    this.alt = false;
    this.meta = false;
    this.keyDown = new Set();
    this.keyPressed = new Set();
    this.keyReleased = new Set();
    this.mouseEvent = undefined;
    this.keyEvents = [];
    document.addEventListener('mousedown', e => this.mouseEvent = e);
    document.addEventListener('mousemove', e => this.mouseEvent = e);
    document.addEventListener('keydown', e => this.keyEvents.push(e));
    document.addEventListener('keyup', e => this.keyEvents.push(e));
  }

  update() {
    this.handleMouseEvent();
    this.handleKeyboardEvents();
  }

  isActive(command) {
    const mapped = exports.defaultKeyMapping[command];
    return this.alt === mapped.alt && this.ctrl === mapped.ctrl && this.meta === mapped.meta && this.keyPressed.has(mapped.key);
  }

  isDown(command) {
    const mapped = exports.defaultKeyMapping[command];
    return this.alt === mapped.alt && this.ctrl === mapped.ctrl && this.meta === mapped.meta && this.keyDown.has(mapped.key);
  }

  numericActive() {
    const numerics = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    return numerics.find(k => this.isActive(k));
  }

  createMovementDelta() {
    let delta = new spatial_1.Vector([0, 0]);

    if (this.isDown('left')) {
      delta = delta.add(spatial_1.Vector.fromDirection('left'));
    }

    if (this.isDown('down')) {
      delta = delta.add(spatial_1.Vector.fromDirection('down'));
    }

    if (this.isDown('up')) {
      delta = delta.add(spatial_1.Vector.fromDirection('up'));
    }

    if (this.isDown('right')) {
      delta = delta.add(spatial_1.Vector.fromDirection('right'));
    }

    return delta.normalize();
  }

  handleMouseEvent() {
    this.mouseReleased = false;
    this.mousePressed = false;

    if (this.mouseEvent) {
      this.position = this.eventToPosition(this.mouseEvent);
      const pressed = this.mouseEvent.buttons > 0;

      if (pressed) {
        if (this.position) {
          this.mousePressed = true;
          this.mouseDown = true;
        }
      } else {
        this.mouseDown = false;
        this.mouseReleased = true;
      }

      this.mouseEvent = undefined;
    }
  }

  handleKeyboardEvents() {
    this.keyPressed.clear();
    this.keyReleased.clear();

    for (const e of this.keyEvents) {
      this.shift = e.shiftKey;
      this.ctrl = e.ctrlKey;
      this.alt = e.altKey;
      this.meta = e.metaKey;

      if (e.type === 'keydown') {
        this.keyPressed.add(e.key);
        this.keyDown.add(e.key);
      } else {
        this.keyReleased.add(e.key);
        this.keyDown.delete(e.key);
      }
    }

    this.keyEvents = [];
  }

}

exports.InputResource = InputResource;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const feature_1 = __webpack_require__(12);

class LogResource {
  constructor() {
    this.kind = 'log';
    this.entries = [];
  }

  update({}) {}

  render({}) {}

  getEntries(offset, limit) {
    const start = Math.max(0, this.entries.length + offset - limit);
    const end = Math.min(this.entries.length, start + limit);
    return this.entries.slice(start, end);
  }

  text(text) {
    this.entries.push(text);
  }

  attack(world, source, target, result) {
    const subject = this.getName(world, source);
    const object = this.getName(world, target);
    let attackText = `${subject} ${this.verbify(subject, 'try')} to hit ${object} (${this.percentage(result.chance.final)} chance, ${this.percentage(result.chance.criticalHit)} crit)`;
    let hitText = `${subject} ${result.isCritical ? 'critically' : ''} ${result.isHit ? this.verbify(subject, 'hit') : this.verbify(subject, 'miss')} ${object}`;
    let applyText = `${subject} ${this.verbify(subject, 'make')} ${object}`;
    this.entries.push(attackText);
    result.effects.forEach(e => {
      if (e.type === 'damage') {
        this.entries.push(`${hitText} ${e.finalDamage}${result.isCritical ? '!' : ''}dmg (${e.defense}def)`);
      } else {
        this.entries.push(`${applyText} ${e.type}`);
      }
    });
  }

  died(world, entity) {
    const subject = this.getName(world, entity);
    this.entries.push(`${subject} died`);
  }

  percentage(value) {
    return `${Math.floor(value * 100)}%`;
  }

  getName(world, entity) {
    const feature = feature_1.getFeature(world, entity);

    if (feature !== undefined) {
      return feature.name;
    }

    return 'something';
  }

  verbify(source, verb) {
    if (source !== 'you') {
      if (verb === 'miss') {
        return 'misses';
      }

      if (verb === 'try') {
        return 'tries';
      }

      return verb + 's';
    }

    return verb;
  }

  owner(target) {
    if (target === 'you') {
      return 'your';
    }

    return `${target}'s`;
  }

}

exports.LogResource = LogResource;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const available_actions_1 = __webpack_require__(48);

const random_1 = __webpack_require__(5);

const attack_target_1 = __webpack_require__(49);

const apply_effect_1 = __webpack_require__(11);

class AiRoundControl {
  constructor(queries, distribution) {
    this.queries = queries;
    this.components = ['take-turn', 'ai', 'position'];
    this.random = new random_1.Random(distribution);
  }

  update(world, entity) {
    const script = world.getComponent(entity, 'script');
    const takeTurn = world.getComponent(entity, 'take-turn');
    const isInAnimation = script !== undefined;
    const turnIsOver = takeTurn.acted && takeTurn.moved;

    if (!isInAnimation) {
      if (!turnIsOver) {
        if (takeTurn.selectionState === undefined) {
          const availableActions = available_actions_1.calculateAvailableActions(world, entity, false);
          this.selectAction(world, entity, takeTurn, availableActions);
        } else {
          this.takeAction(world, entity, takeTurn, takeTurn.selectionState);
        }
      } else {
        this.endTurn(world, entity);
      }
    }
  }

  selectAction(world, entity, takeTurn, selectableActions) {
    const position = world.getComponent(entity, 'position');
    let target = this.findTarget(world, position.position);

    if (target !== undefined) {
      const targetPosition = world.getComponent(target, 'position');
      const path = this.queries.los(world, position.level, position.position, targetPosition.position, {});
      const movementActions = [];
      const fightActions = [];
      const allActions = [];

      for (const selectableAction of selectableActions) {
        const selectedAction = {
          entity: selectableAction.entity,
          action: selectableAction.action
        };
        const hasMovement = selectableAction.action.subActions.find(s => s.kind === 'movement') !== undefined;

        if (hasMovement) {
          movementActions.push(selectedAction);
        }

        const hasAttack = selectableAction.action.subActions.find(s => path !== undefined && s.kind === 'attack' && s.range >= path.cost) !== undefined;

        if (hasAttack) {
          fightActions.push(selectedAction);
        }

        allActions.push(selectedAction);
      }

      const dist = targetPosition.position.minus(position.position);
      let selection = undefined;
      const canGetCloser = dist.lN() > 1 && movementActions.length > 0;
      const isInSight = path !== undefined;

      if (canGetCloser) {
        selection = this.random.pick(movementActions);
      } else if (fightActions.length > 0 && isInSight) {
        selection = this.random.pick(fightActions);
      } else {
        selection = allActions.find(a => a.action.name === 'no move');
      }

      if (selection !== undefined) {
        takeTurn.selectionState = {
          skippedActions: 0,
          target,
          currentSubAction: 0,
          selection
        };
      } else {
        this.endTurn(world, entity);
      }
    } else {
      this.endTurn(world, entity);
    }
  }

  takeAction(world, entity, takeTurn, state) {
    const action = state.selection.action;
    const subActions = action.subActions.length;

    if (state.currentSubAction >= subActions) {
      apply_effect_1.clearExpiredEffects(world, entity);

      switch (action.cost) {
        case 'action':
          takeTurn.acted = true;
          break;

        case 'movement':
          takeTurn.moved = true;
          break;

        case 'either':
          if (takeTurn.moved) {
            takeTurn.acted = true;
          } else {
            takeTurn.moved = true;
          }

          break;

        case 'all':
        case 'both':
          takeTurn.acted = true;
          takeTurn.moved = true;
          break;
      }

      takeTurn.selectionState = undefined;
    } else {
      const currentAction = action.subActions[state.currentSubAction];

      switch (currentAction.kind) {
        case 'movement':
          this.move(world, entity, state.target, currentAction);
          break;

        case 'attack':
          this.attack(world, entity, state.target, currentAction);
          break;

        case 'status':
          this.status(world, entity, currentAction, state.selection.entity);
          break;
      }

      state.currentSubAction++;
    }
  }

  move(world, entity, target, movement) {
    const position = world.getComponent(entity, 'position');
    const targetPosition = world.getComponent(target, 'position');
    const path = this.queries.shortestPath(world, position.level, position.position, targetPosition.position, {
      self: entity,
      maximumCost: movement.range,
      endInDoor: true,
      bestEffort: true
    });

    if (path !== undefined && path.path.length > 0) {
      world.editEntity(entity).withComponent('script', {
        path: path.path
      });
    }
  }

  attack(world, entity, target, attack) {
    const position = world.getComponent(entity, 'position');
    const targetPosition = world.getComponent(target, 'position');
    const path = this.queries.los(world, position.level, position.position, targetPosition.position, {});

    if (path !== undefined && path.cost <= attack.range) {
      attack_target_1.attackTarget(world, this.random, entity, target, attack);
    }
  }

  findTarget(world, position) {
    let nearestPlayer;
    let bestDist = Number.MAX_SAFE_INTEGER;
    world.getStorage('player').foreach(player => {
      const playerPosition = world.getComponent(player, 'position');

      if (playerPosition !== undefined) {
        const dist = position.minus(playerPosition.position).squaredLength();

        if (nearestPlayer === undefined && dist < bestDist) {
          nearestPlayer = player;
          bestDist = dist;
        }
      }
    });
    return nearestPlayer;
  }

  status(world, entity, status, item) {
    status.effects.forEach(effect => {
      apply_effect_1.applyEffect(world, this.random, entity, {
        source: item,
        effect,
        isCritical: false,
        isPiercing: false
      });
    });
    return true;
  }

  endTurn(world, entity) {
    world.editEntity(entity).removeComponent('take-turn').withComponent('took-turn', {});
  }

}

exports.AiRoundControl = AiRoundControl;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const apply_effect_1 = __webpack_require__(11);

const random_1 = __webpack_require__(5);

class StartRound {
  constructor(rng) {
    this.components = ['start-turn'];
    this.uniform = new random_1.Random(rng);
  }

  update(world, entity) {
    apply_effect_1.clearExpiredEffects(world, entity);
    apply_effect_1.updateEffects(world, entity, this.uniform);
    world.getComponent(entity, 'inventory').content.forEach(item => {
      apply_effect_1.clearExpiredEffects(world, item);
      apply_effect_1.updateEffects(world, item, this.uniform);
    });
    world.editEntity(entity).removeComponent('start-turn').withComponent('take-turn', {
      moved: false,
      acted: false,
      selectionState: undefined
    });
  }

}

exports.StartRound = StartRound;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class ProgressResource {
  constructor() {
    this.kind = 'progress';
    this.unlockedLore = new Set();
    this.activeQuests = new Set();
  }

  update({}) {}

  render({}) {}

  unlockLore(world, lore) {
    this.unlockedLore.add(lore);
    const log = world.getResource('log');
    log.text(`You unlocked ${lore}!`);
  }

  startQuest(world, quest) {
    this.activeQuests.add(quest);
    const log = world.getResource('log');
    log.text(`You started quest ${quest}!`);
  }

}

exports.ProgressResource = ProgressResource;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const state_1 = __webpack_require__(13);

const main_menu_1 = __webpack_require__(117);

const characters_1 = __webpack_require__(8);

const random_1 = __webpack_require__(5);

class Running extends state_1.AbstractState {
  constructor(rng) {
    super('running', ['fov', 'player-control', 'player-interaction', 'npc', 'trigger', 'free-mode-control']);
    this.uniform = new random_1.Random(rng);
  }

  start(world) {
    super.start(world);

    if (world.components.get('viewport-focus').size() === 0) {
      this.createViewportFocus(world);
    }

    world.getResource('ui').reset();
  }

  createViewportFocus(world) {
    const map = world.getResource('map');
    world.components.get('spawn').foreach(spawn => {
      this.spawnPlayer(world, this.uniform, map, spawn);
    });
    this.createUILayer(world);
  }

  spawnPlayer(world, random, map, spawn) {
    const position = world.getComponent(spawn, 'position');
    const player = characters_1.characterCreators.player(world, random, 'entrance', {
      type: random.pick(['red_player', 'green_player', 'yellow_player', 'blue_player'])
    });
    world.editEntity(player).withComponent('position', { ...position
    }).withComponent('viewport-focus', {});
    const ui = world.getResource('ui');
    ui.createTabs(world, player);
    map.levels[position.level].setCharacter(position.position, player);
  }

  createUILayer(world) {
    const viewport = world.getResource('viewport');
    viewport.addLayer({
      getRenderable: (world, _, position) => {
        const ui = world.getResource('ui');
        return {
          entity: undefined,
          opaque: !ui.hasElement(position),
          centered: true
        };
      },
      transformed: false
    });
  }

  update(world, pushState) {
    const player = world.getStorage('player').first();

    if (world.hasComponent(player, 'dead')) {
      pushState(new main_menu_1.MainMenu());
    }
  }

  isFrameLocked() {
    return true;
  }

}

exports.Running = Running;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const state_1 = __webpack_require__(13);

class MainMenu extends state_1.AbstractState {
  constructor() {
    super('main-menu', ['free-mode-control']);
  }

  start(world) {
    super.start(world);
    const focus = world.getStorage('viewport-focus').first();
    world.getStorage('viewport-focus').clear();
    const position = world.getComponent(focus, 'position');

    if (position) {
      world.createEntity().withComponent('free-mode-anchor', {}).withComponent('viewport-focus', {}).withComponent('position', { ...position
      });
    }
  }

  isDone(_world) {
    return false;
  }

  update(_world) {}

  isFrameLocked() {
    return true;
  }

}

exports.MainMenu = MainMenu;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const state_1 = __webpack_require__(13);

const functional_shape_1 = __webpack_require__(20);

const feature_1 = __webpack_require__(12);

const region_creator_1 = __webpack_require__(119);

class MapCreation extends state_1.AbstractState {
  constructor() {
    super('map-creation', ['region-builder']);
  }

  start(world) {
    super.start(world);
    const viewport = world.getResource('viewport');
    const map = world.getResource('map');
    viewport.addLayer({
      getRenderable: (_world, level, position) => {
        const entity = map.levels[level].getTile(position);
        return {
          entity,
          opaque: true,
          centered: true
        };
      },
      transformed: true
    });
    viewport.addLayer({
      getRenderable: (_world, level, position) => {
        const entity = map.levels[level].getCharacter(position);
        return {
          entity,
          opaque: true,
          centered: false
        };
      },
      transformed: true
    });
    this.startRegion = region_creator_1.create(world);
  }

  update({}) {}

  stop(world) {
    super.stop(world);

    if (this.startRegion !== undefined) {
      const region = world.getComponent(this.startRegion, 'region');
      world.createEntity().withComponent('position', {
        level: region.level,
        position: region.exits[0]
      }).withComponent('spawn', {});
    }

    this.fillWalls(world);
  }

  isFrameLocked() {
    return false;
  }

  fillWalls(world) {
    const map = world.getResource('map');
    map.levels.forEach((region, index) => {
      region.boundary.foreach(p => {
        const someTileExists = functional_shape_1.FunctionalShape.lN(p, 1, false).some(p1 => {
          const e = region.getTile(p1);
          return e !== undefined && world.getComponent(e, 'feature').feature().name !== 'wall';
        });

        if (region.getTile(p) === undefined && someTileExists) {
          feature_1.createFeatureFromType(world, index, p, 'wall');
        }
      });
    });
  }

}

exports.MapCreation = MapCreation;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const rectangle_1 = __webpack_require__(3);

const spatial_1 = __webpack_require__(1);

function regionComponent(type, shape, exits, level) {
  return {
    type,
    shape,
    level,
    exits,
    authorized: new Set()
  };
}

function createRegion(world, level, type, shape, exits) {
  return world.createEntity().withComponent('region', regionComponent(type, shape, exits, level)).withComponent('active', {}).entity;
}

exports.createRegion = createRegion;
const leftRegion = new rectangle_1.Rectangle(6, 1, 49, 49);
const rightRegion = new rectangle_1.Rectangle(56, 1, 49, 49);
const leftElevator = new rectangle_1.Rectangle(1, 26, 5, 5);
const rightElevator = new rectangle_1.Rectangle(105, 26, 5, 5);
const regionConnect = new spatial_1.Vector([55, 29]);
const cyberSpaceBase = new rectangle_1.Rectangle(6, 1, 49, 49);
const cyberSpacePlus = new rectangle_1.Rectangle(56, 1, 49, 49);

function buildCore(world) {
  const coreRegion = new rectangle_1.Rectangle(6, 1, 99, 50);
  createRegion(world, 4, 'elevator', leftElevator, [leftElevator.centerRight]);
  createRegion(world, 4, 'core', coreRegion, [leftElevator.grow().centerRight, rightElevator.grow().centerLeft]);
  createRegion(world, 4, 'elevator', rightElevator, [rightElevator.centerLeft]);
}

exports.buildCore = buildCore;

function buildCyberSpace(world) {
  createRegion(world, 5, 'blue-plus', cyberSpacePlus, [cyberSpaceBase.grow().centerRight]);
  createRegion(world, 5, 'blue-base', cyberSpaceBase, [cyberSpacePlus.grow().centerLeft]);
}

exports.buildCyberSpace = buildCyberSpace;

function buildLevel(world, level, left, right) {
  createRegion(world, level, 'elevator', leftElevator, [leftElevator.centerRight]);
  createRegion(world, level, left, leftRegion, [leftElevator.grow().centerRight, regionConnect]);
  createRegion(world, level, right, rightRegion, [rightElevator.grow().centerLeft, regionConnect]);
  return createRegion(world, level, 'elevator', rightElevator, [rightElevator.centerLeft]);
}

exports.buildLevel = buildLevel;

function buildGroundFloor(world) {
  const groundFloorRegion = new rectangle_1.Rectangle(6, 1, 99, 50);
  const entranceRegion = new rectangle_1.Rectangle(56, 52, 20, 20);
  createRegion(world, 0, 'elevator', leftElevator, [leftElevator.centerRight]);
  createRegion(world, 0, 'ground-floor', groundFloorRegion, [entranceRegion.grow().centerTop]);
  createRegion(world, 0, 'elevator', rightElevator, [rightElevator.centerLeft]);
  return createRegion(world, 0, 'entrance', entranceRegion, [entranceRegion.center]);
}

exports.buildGroundFloor = buildGroundFloor;

function create(world) {
  buildCore(world);
  buildCyberSpace(world);
  buildLevel(world, 3, 'red-plus', 'green-plus');
  buildLevel(world, 2, 'yellow-plus', 'red-base');
  buildLevel(world, 1, 'green-base', 'yellow-base');
  return buildGroundFloor(world);
}

exports.create = create;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

const bfs_1 = __webpack_require__(121);

const functional_shape_1 = __webpack_require__(20);

const astar_1 = __webpack_require__(122);

const digital_line_1 = __webpack_require__(124);

const permissive_fov_1 = __webpack_require__(126);

class Queries {
  fov(world, level, origin, callback) {
    const originFloor = new spatial_1.Vector([origin.fX, origin.fY]);
    const map = world.getResource('map');
    const fov = new permissive_fov_1.PermissiveFov(map.width, map.width, (x, y) => !map.levels[level].isLightBlocking(world, new spatial_1.Vector([x, y])));
    fov.compute(originFloor.x, originFloor.y, 20, (x, y) => {
      callback(new spatial_1.Vector([x, y]));
    });
  }

  explore(world, level, origin, visit, params) {
    const map = world.getResource('map');
    const originFloor = new spatial_1.Vector([origin.fX, origin.fY]);
    const maximumDepth = params.maximumCost || Number.MAX_SAFE_INTEGER;
    const onlyDiscovered = params.onlyDiscovered || false;
    bfs_1.bfs(map.levels[level].boundary.width, originFloor, target => functional_shape_1.FunctionalShape.lN(target, 1, false), visit, (target, depth) => {
      if (depth >= maximumDepth || map.levels[level].isBlocking(world, target)) {
        return false;
      }

      return onlyDiscovered ? map.levels[level].isDiscovered(target) : true;
    });
  }

  shortestPath(world, level, origin, target, params) {
    const map = world.getResource('map').levels[level];
    const onlyDiscovered = params.onlyDiscovered || false;
    const originFloor = new spatial_1.Vector([origin.fX, origin.fY]);
    const targetFloor = new spatial_1.Vector([target.fX, target.fY]);
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER;
    const bestEffort = params.bestEffort || false;
    const endInDoor = params.endInDoor || false;
    const jump = params.jump || false;

    if (!bestEffort && map.isBlocking(world, target)) {
      return undefined;
    }

    const isBlocked = v => jump ? map.blocksJump(world, v) : map.isBlocking(world, v, params.self);

    const path = astar_1.astar(originFloor, targetFloor, (current, neighbour) => {
      if (onlyDiscovered && !map.isDiscovered(neighbour)) {
        return undefined;
      }

      if (isBlocked(neighbour)) {
        if (endInDoor && map.tileMatches(world, neighbour, f => f !== undefined && f.feature().name === 'door')) {
          return current.minus(neighbour).l1();
        }

        return undefined;
      }

      return current.minus(neighbour).l1();
    }, v => {
      if (endInDoor && !bestEffort && isBlocked(v)) {
        return functional_shape_1.FunctionalShape.empty(v);
      }

      return functional_shape_1.FunctionalShape.l1(v, 1, false);
    }, v => targetFloor.minus(v).l1(), maximumCost, bestEffort);

    if (path !== undefined && path.path.length - 1 <= maximumCost) {
      return {
        path: path.path.slice(0, path.path.length - 1),
        cost: path.cost
      };
    }

    return undefined;
  }

  los(world, level, origin, target, params) {
    const map = world.getResource('map');
    const originFloor = new spatial_1.Vector([origin.fX, origin.fY]);
    const targetFloor = new spatial_1.Vector([target.fX, target.fY]);
    const maximumCost = params.maximumCost || Number.MAX_SAFE_INTEGER;

    if (targetFloor.minus(originFloor).length() <= maximumCost) {
      const path = digital_line_1.digitalLine(originFloor, targetFloor, p => map.levels[level].isLightBlocking(world, p));

      if (path !== undefined) {
        return {
          path: path.slice(1, path.length),
          cost: path.length - 1
        };
      }
    }

    return undefined;
  }

}

exports.Queries = Queries;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const set_space_1 = __webpack_require__(27);

function bfs(width, origin, neighbourhood, visit, canVisit) {
  const visited = new set_space_1.SetSpace(width);
  visited.set(origin);
  let currentDepth = 1;
  let currentLayer = [];
  let nextLayer = [];
  putNeighboursIntoNextLayer(visited, neighbourhood(origin), currentLayer, n => canVisit(n, currentDepth));
  let finished = false;

  while (!finished) {
    const current = currentLayer.pop();

    if (current !== undefined) {
      finished = visit(current, currentDepth);
      putNeighboursIntoNextLayer(visited, neighbourhood(current), nextLayer, n => canVisit(n, currentDepth));
    } else {
      currentLayer = nextLayer;
      nextLayer = [];
      currentDepth++;

      if (currentLayer.length === 0) {
        break;
      }
    }
  }
}

exports.bfs = bfs;

function putNeighboursIntoNextLayer(visited, neighbourhood, layer, canVisit) {
  neighbourhood.foreach(neighbour => {
    if (!visited.has(neighbour) && canVisit(neighbour)) {
      layer.push(neighbour);
      visited.set(neighbour);
    }
  });
}

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const radix_heap_1 = __webpack_require__(123);

function astar(from, to, cost, neighbourhood, heuristic, maximumCost, bestEffort = false) {
  const actualMaximumCost = bestEffort ? Number.MAX_SAFE_INTEGER : maximumCost;
  const {
    parent,
    costMap,
    closest
  } = calculateAstar(from, to, cost, neighbourhood, heuristic, actualMaximumCost);

  if (bestEffort === false && closest.key !== to.key) {
    return undefined;
  }

  return extractPath(closest, parent, costMap, maximumCost);
}

exports.astar = astar;

function calculateAstar(from, to, cost, neighbourhood, heuristic, maximumCost) {
  const targetKey = to.key;
  const parent = new Map();
  const closed = new Set();
  const open = new radix_heap_1.RadixHeap(256);
  const costMap = new Map();
  let closest = from;
  let minHeuristic = heuristic(from);
  open.insert(from.key, from, minHeuristic);
  costMap.set(from.key, 0);
  parent.set(from.key, from);

  while (true) {
    const position = open.extractMin();

    if (position === undefined) {
      break;
    }

    const currentHeuristic = heuristic(position);

    if (currentHeuristic <= minHeuristic) {
      closest = position;
      minHeuristic = currentHeuristic;
    }

    const currentKey = position.key;

    if (targetKey === currentKey || currentHeuristic > 5 * minHeuristic) {
      break;
    }

    closed.add(currentKey);
    const currentCost = costMap.get(currentKey);
    neighbourhood(position).foreach(neighbor => {
      const key = neighbor.key;

      if (!closed.has(key)) {
        const distance = cost(position, neighbor);

        if (distance !== undefined) {
          const tentative = currentCost + distance;
          const previousCost = costMap.get(key) || Number.MAX_SAFE_INTEGER;

          if (tentative < previousCost && tentative <= maximumCost) {
            parent.set(key, position);
            costMap.set(key, tentative);
            const heuristicScore = tentative + heuristic(neighbor);

            if (open.getPriority(key) === undefined) {
              open.insert(key, neighbor, heuristicScore);
            } else {
              open.decreasePriority(key, heuristicScore);
            }
          }
        }
      }
    });
  }

  return {
    parent,
    costMap,
    closest
  };
}

function extractPath(to, parent, costMap, maximumCost) {
  let path = [];
  let current = to;
  let cost = costMap.get(to.key);

  while (true) {
    const key = current.key;
    const tentativeCost = costMap.get(current.key);

    if (cost > maximumCost) {
      cost = tentativeCost;
    }

    if (cost <= maximumCost) {
      path.push(current);
    }

    const parentValue = parent.get(key);

    if (parentValue === undefined) {
      return undefined;
    }

    if (current.key === parentValue.key) {
      break;
    }

    current = parentValue;
  }

  return {
    path,
    cost
  };
}

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const array_utils_1 = __webpack_require__(7);

class RadixHeap {
  constructor(maximumKeySpan) {
    this.maximumKeySpan = maximumKeySpan;
    this.bucketOfValue = new Map();
    this.buckets = [];
    this.boundaries = [];
    this.bucketCount = Math.floor(Math.log2(maximumKeySpan + 1)) + 1;
    this.boundaries[0] = 0;
    this.buckets[0] = [];
    this.boundaries[1] = 1;
    this.buckets[1] = [];
    this.boundaries[this.bucketCount + 1] = maximumKeySpan;

    for (let i = 2; i <= this.bucketCount; i++) {
      this.boundaries[i] = 2 << i - 2;
      this.buckets[i] = [];
    }
  }

  insert(key, value, priority) {
    this.insertIntoLargestPossibleBucket(key, value, priority, this.bucketCount);
  }

  getPriority(key) {
    let bucket = this.bucketOfValue.get(key);

    if (bucket === undefined) {
      return undefined;
    }

    return this.findInBucket(bucket, key);
  }

  decreasePriority(key, priority) {
    let bucket = this.bucketOfValue.get(key);

    if (bucket === undefined) {
      throw Error(`unknown bucket for key ${key}`);
    }

    const entry = this.removeFromBucket(key, bucket);
    this.insertIntoLargestPossibleBucket(key, entry.value, priority, bucket);
  }

  extractMin() {
    let result = this.buckets[0].pop();

    if (result === undefined) {
      let bucket = 1;

      while (bucket <= this.bucketCount && this.buckets[bucket].length === 0) {
        bucket++;
      }

      if (bucket > this.bucketCount) {
        return undefined;
      }

      let smallestK = Number.MAX_SAFE_INTEGER;
      const currentBucket = this.buckets[bucket];
      this.buckets[bucket] = [];

      for (let i = 0; i < currentBucket.length; i++) {
        const entry = currentBucket[i];

        if (smallestK > entry.priority) {
          smallestK = entry.priority;
        }

        this.bucketOfValue.delete(entry.key);
      }

      this.boundaries[0] = smallestK;
      this.boundaries[1] = smallestK + 1;

      for (let i = 2; i <= bucket; i++) {
        this.boundaries[i] = Math.min(this.boundaries[i - 1] + (2 << i - 2), this.boundaries[bucket + 1]);
      }

      for (let i = 0; i < currentBucket.length; i++) {
        const entry = currentBucket[i];
        this.insertIntoLargestPossibleBucket(entry.key, entry.value, entry.priority, bucket);
      }

      result = this.buckets[0].pop();
    }

    this.bucketOfValue.delete(result.key);
    return result.value;
  }

  removeFromBucket(key, bucket) {
    this.bucketOfValue.delete(key);
    const currentBucket = this.buckets[bucket];
    const index = currentBucket.findIndex(v => v.key === key);
    const entry = currentBucket[index];
    array_utils_1.dropAt(currentBucket, index);
    return entry;
  }

  insertIntoLargestPossibleBucket(key, value, priority, bucket) {
    while (this.boundaries[bucket] > priority) {
      --bucket;
    }

    this.buckets[bucket].push({
      key,
      value,
      priority
    });
    this.bucketOfValue.set(key, bucket);
  }

  findInBucket(bucket, key) {
    const currentBucket = this.buckets[bucket];
    const index = currentBucket.findIndex(v => v.key === key);
    const entry = currentBucket[index];

    if (entry !== undefined) {
      return entry.priority;
    }

    return undefined;
  }

}

exports.RadixHeap = RadixHeap;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const bresenham_1 = __webpack_require__(125);

function digitalLine(from, to, isBlocked) {
  const maxEps = Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
  const minEps = -Math.floor(maxEps / 2);

  for (let eps = -Math.floor(maxEps / 2); eps < minEps + maxEps; eps++) {
    let free = true;
    const path = [];

    for (const p of bresenham_1.bresenham(from, to, false, eps)) {
      path.push(p);

      if (isBlocked(p)) {
        free = false;
        eps += Math.max(0, maxEps - path.length);
        break;
      }
    }

    if (free) {
      return path;
    }
  }

  return undefined;
}

exports.digitalLine = digitalLine;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const spatial_1 = __webpack_require__(1);

function* bresenham(from, to, overshoot = false, initialEps = 0) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const sx = dx > 0 ? 1 : -1;
  const sy = dy > 0 ? 1 : -1;
  var eps = initialEps;

  if (adx > ady) {
    for (let x = from.x, y = from.y; overshoot || sx < 0 ? x >= to.x : x <= to.x; x += sx) {
      yield new spatial_1.Vector([x, y]);
      eps += ady;

      if (eps << 1 >= adx) {
        y += sy;
        eps -= adx;
      }
    }
  } else {
    for (let x = from.x, y = from.y; sy < 0 ? y >= to.y : y <= to.y; y += sy) {
      yield new spatial_1.Vector([x, y]);
      eps += adx;

      if (eps << 1 >= ady) {
        x += sx;
        eps -= ady;
      }
    }
  }
}

exports.bresenham = bresenham;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var View_1 = __webpack_require__(127);
var Line_1 = __webpack_require__(128);
var Point_1 = __webpack_require__(129);
var ViewBump_1 = __webpack_require__(130);
var PermissiveFov = (function () {
    function PermissiveFov(mapWidth, mapHeight, isTransparent) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.isTransparent = isTransparent;
    }
    PermissiveFov.prototype.compute = function (startX, startY, radius, setVisible) {
        var data = {
            setVisible: setVisible,
            isTransparent: this.isTransparent,
            startX: startX,
            startY: startY,
            radius: radius,
            visited: []
        };
        data.setVisible(startX, startY);
        data.visited[this.mapWidth * startY + startX] = true;
        var minExtentX = (startX < radius ? startX : radius);
        var maxExtentX = (this.mapWidth - startX <= radius ? this.mapWidth - startX - 1 : radius);
        var minExtentY = (startY < radius ? startY : radius);
        var maxExtentY = (this.mapHeight - startY <= radius ? this.mapHeight - startY - 1 : radius);
        this.computeQuadrant(data, 1, 1, maxExtentX, maxExtentY);
        this.computeQuadrant(data, 1, -1, maxExtentX, minExtentY);
        this.computeQuadrant(data, -1, -1, minExtentX, minExtentY);
        this.computeQuadrant(data, -1, 1, minExtentX, maxExtentY);
    };
    ;
    PermissiveFov.prototype.setMapDimensions = function (mapWidth, mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    };
    ;
    PermissiveFov.prototype.setIsTransparent = function (isTransparent) {
        this.isTransparent = isTransparent;
    };
    ;
    PermissiveFov.prototype.computeQuadrant = function (data, deltaX, deltaY, maxX, maxY) {
        var activeViews = [];
        var startJ;
        var maxJ;
        var maxI = maxX + maxY;
        var shallowLine = new Line_1.Line(0, 1, maxX, 0);
        var steepLine = new Line_1.Line(1, 0, 0, maxY);
        var viewIndex = 0;
        activeViews.push(new View_1.View(shallowLine, steepLine));
        for (var i = 1; i <= maxI && activeViews.length; ++i) {
            startJ = (0 > i - maxX ? 0 : i - maxX);
            maxJ = (i < maxY ? i : maxY);
            for (var j = startJ; j <= maxJ && viewIndex < activeViews.length; ++j) {
                this.visitPoint(data, i - j, j, deltaX, deltaY, viewIndex, activeViews);
            }
        }
    };
    PermissiveFov.prototype.visitPoint = function (data, x, y, deltaX, deltaY, viewIndex, activeViews) {
        var topLeft = new Point_1.Point(x, y + 1);
        var bottomRight = new Point_1.Point(x + 1, y);
        var realX = x * deltaX;
        var realY = y * deltaY;
        for (; viewIndex < activeViews.length &&
            activeViews[viewIndex].steepLine.isBelowOrCollinear(bottomRight.x, bottomRight.y); ++viewIndex) {
        }
        if (viewIndex === activeViews.length ||
            activeViews[viewIndex].shallowLine.isAboveOrCollinear(topLeft.x, topLeft.y)) {
            return;
        }
        var visitedPoint = new Point_1.Point(data.startX + realX, data.startY + realY);
        var visitedPointIndex = this.mapWidth * visitedPoint.y + visitedPoint.x;
        if (!data.visited[visitedPointIndex]) {
            data.visited[visitedPointIndex] = true;
            data.setVisible(visitedPoint.x, visitedPoint.y);
        }
        if (data.isTransparent(visitedPoint.x, visitedPoint.y)) {
            return;
        }
        var shallowLineIsAboveBottomRight = activeViews[viewIndex].shallowLine.isAbove(bottomRight.x, bottomRight.y);
        var steepLineIsBelowTopLeft = activeViews[viewIndex].steepLine.isBelow(topLeft.x, topLeft.y);
        if (shallowLineIsAboveBottomRight && steepLineIsBelowTopLeft) {
            activeViews.splice(viewIndex, 1);
        }
        else if (shallowLineIsAboveBottomRight) {
            this.addShallowBump(topLeft.x, topLeft.y, activeViews, viewIndex);
            this.checkView(activeViews, viewIndex);
        }
        else if (steepLineIsBelowTopLeft) {
            this.addSteepBump(bottomRight.x, bottomRight.y, activeViews, viewIndex);
            this.checkView(activeViews, viewIndex);
        }
        else {
            var shallowViewIndex = viewIndex;
            var steepViewIndex = ++viewIndex;
            activeViews.splice(shallowViewIndex, 0, activeViews[shallowViewIndex].clone());
            this.addSteepBump(bottomRight.x, bottomRight.y, activeViews, shallowViewIndex);
            if (!this.checkView(activeViews, shallowViewIndex)) {
                --steepViewIndex;
            }
            this.addShallowBump(topLeft.x, topLeft.y, activeViews, steepViewIndex);
            this.checkView(activeViews, steepViewIndex);
        }
    };
    PermissiveFov.prototype.addShallowBump = function (x, y, activeViews, viewIndex) {
        activeViews[viewIndex].shallowLine.setFarPoint(x, y);
        activeViews[viewIndex].shallowBump = new ViewBump_1.ViewBump(x, y, activeViews[viewIndex].shallowBump);
        for (var curBump = activeViews[viewIndex].steepBump; curBump; curBump = curBump.parent) {
            if (activeViews[viewIndex].shallowLine.isAbove(curBump.x, curBump.y)) {
                activeViews[viewIndex].shallowLine.setNearPoint(curBump.x, curBump.y);
            }
        }
    };
    PermissiveFov.prototype.addSteepBump = function (x, y, activeViews, viewIndex) {
        activeViews[viewIndex].steepLine.setFarPoint(x, y);
        activeViews[viewIndex].steepBump = new ViewBump_1.ViewBump(x, y, activeViews[viewIndex].steepBump);
        for (var curBump = activeViews[viewIndex].shallowBump; curBump; curBump = curBump.parent) {
            if (activeViews[viewIndex].steepLine.isBelow(curBump.x, curBump.y)) {
                activeViews[viewIndex].steepLine.setNearPoint(curBump.x, curBump.y);
            }
        }
    };
    PermissiveFov.prototype.checkView = function (activeViews, viewIndex) {
        if (activeViews[viewIndex].shallowLine.isLineCollinear(activeViews[viewIndex].steepLine) &&
            (activeViews[viewIndex].shallowLine.isCollinear(0, 1)
                || activeViews[viewIndex].shallowLine.isCollinear(1, 0))) {
            activeViews.splice(viewIndex, 1);
            return false;
        }
        return true;
    };
    return PermissiveFov;
}());
exports.PermissiveFov = PermissiveFov;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var View = (function () {
    function View(shallowLine, steepLine, shallowBump, steepBump) {
        this.shallowLine = shallowLine;
        this.steepLine = steepLine;
        this.shallowBump = shallowBump;
        this.steepBump = steepBump;
    }
    View.prototype.clone = function () {
        return new View(this.shallowLine.clone(), this.steepLine.clone(), this.shallowBump ? this.shallowBump.clone() : undefined, this.steepBump ? this.steepBump.clone() : undefined);
    };
    return View;
}());
exports.View = View;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Line = (function () {
    function Line(nearX, nearY, farX, farY) {
        this.nearX = nearX;
        this.nearY = nearY;
        this.farX = farX;
        this.farY = farY;
        this.deltaX = farX - nearX;
        this.deltaY = farY - nearY;
    }
    Line.prototype.clone = function () {
        return new Line(this.nearX, this.nearY, this.farX, this.farY);
    };
    Line.prototype.setNearPoint = function (nearX, nearY) {
        this.nearX = nearX;
        this.nearY = nearY;
        this.deltaX = this.farX - this.nearX;
        this.deltaY = this.farY - this.nearY;
    };
    Line.prototype.setFarPoint = function (farX, farY) {
        this.farX = farX;
        this.farY = farY;
        this.deltaX = this.farX - this.nearX;
        this.deltaY = this.farY - this.nearY;
    };
    Line.prototype.isBelow = function (x, y) {
        return this.calculateRelativeSlope(x, y) > 0;
    };
    Line.prototype.isBelowOrCollinear = function (x, y) {
        return this.calculateRelativeSlope(x, y) >= 0;
    };
    Line.prototype.isAbove = function (x, y) {
        return this.calculateRelativeSlope(x, y) < 0;
    };
    Line.prototype.isAboveOrCollinear = function (x, y) {
        return this.calculateRelativeSlope(x, y) <= 0;
    };
    Line.prototype.isCollinear = function (x, y) {
        return this.calculateRelativeSlope(x, y) === 0;
    };
    Line.prototype.isLineCollinear = function (line) {
        return this.isCollinear(line.nearX, line.nearY) && this.isCollinear(line.farX, line.farY);
    };
    Line.prototype.calculateRelativeSlope = function (x, y) {
        return this.deltaY * (this.farX - x) - this.deltaX * (this.farY - y);
    };
    return Line;
}());
exports.Line = Line;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ViewBump = (function () {
    function ViewBump(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }
    ViewBump.prototype.clone = function () {
        return new ViewBump(this.x, this.y, this.parent ? this.parent.clone() : undefined);
    };
    return ViewBump;
}());
exports.ViewBump = ViewBump;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const random_seed_1 = __webpack_require__(132);

class Uniform {
  constructor(seed) {
    this.rng = random_seed_1.create(seed);
  }

  sample() {
    return this.rng.random();
  }

}

exports.Uniform = Uniform;

class Exponential {
  constructor(distribution, lambda = 1) {
    this.distribution = distribution;
    this.lambda = lambda;
    this.scale = 1 - Math.exp(-this.lambda);
  }

  static fromSeed(seed, lambda = 1) {
    return new Exponential(new Uniform(seed), lambda);
  }

  sample() {
    const u = this.distribution.sample();
    return -Math.log(1 - this.scale * u) / this.lambda;
  }

}

exports.Exponential = Exponential;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * random-seed
 * https://github.com/skratchdot/random-seed
 *
 * This code was originally written by Steve Gibson and can be found here:
 *
 * https://www.grc.com/otg/uheprng.htm
 *
 * It was slightly modified for use in node, to pass jshint, and a few additional
 * helper functions were added.
 *
 * Copyright (c) 2013 skratchdot
 * Dual Licensed under the MIT license and the original GRC copyright/license
 * included below.
 */
/*	============================================================================
									Gibson Research Corporation
				UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
	============================================================================
	LICENSE AND COPYRIGHT:  THIS CODE IS HEREBY RELEASED INTO THE PUBLIC DOMAIN
	Gibson Research Corporation releases and disclaims ALL RIGHTS AND TITLE IN
	THIS CODE OR ANY DERIVATIVES. Anyone may be freely use it for any purpose.
	============================================================================
	This is GRC's cryptographically strong PRNG (pseudo-random number generator)
	for JavaScript. It is driven by 1536 bits of entropy, stored in an array of
	48, 32-bit JavaScript variables.  Since many applications of this generator,
	including ours with the "Off The Grid" Latin Square generator, may require
	the deteriministic re-generation of a sequence of PRNs, this PRNG's initial
	entropic state can be read and written as a static whole, and incrementally
	evolved by pouring new source entropy into the generator's internal state.
	----------------------------------------------------------------------------
	ENDLESS THANKS are due Johannes Baagoe for his careful development of highly
	robust JavaScript implementations of JS PRNGs.  This work was based upon his
	JavaScript "Alea" PRNG which is based upon the extremely robust Multiply-
	With-Carry (MWC) PRNG invented by George Marsaglia. MWC Algorithm References:
	http://www.GRC.com/otg/Marsaglia_PRNGs.pdf
	http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
	----------------------------------------------------------------------------
	The quality of this algorithm's pseudo-random numbers have been verified by
	multiple independent researchers. It handily passes the fermilab.ch tests as
	well as the "diehard" and "dieharder" test suites.  For individuals wishing
	to further verify the quality of this algorithm's pseudo-random numbers, a
	256-megabyte file of this algorithm's output may be downloaded from GRC.com,
	and a Microsoft Windows scripting host (WSH) version of this algorithm may be
	downloaded and run from the Windows command prompt to generate unique files
	of any size:
	The Fermilab "ENT" tests: http://fourmilab.ch/random/
	The 256-megabyte sample PRN file at GRC: https://www.GRC.com/otg/uheprng.bin
	The Windows scripting host version: https://www.GRC.com/otg/wsh-uheprng.js
	----------------------------------------------------------------------------
	Qualifying MWC multipliers are: 187884, 686118, 898134, 1104375, 1250205,
	1460910 and 1768863. (We use the largest one that's < 2^21)
	============================================================================ */

var stringify = __webpack_require__(133);

/*	============================================================================
This is based upon Johannes Baagoe's carefully designed and efficient hash
function for use with JavaScript.  It has a proven "avalanche" effect such
that every bit of the input affects every bit of the output 50% of the time,
which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
============================================================================
*/
var Mash = function () {
	var n = 0xefc8249d;
	var mash = function (data) {
		if (data) {
			data = data.toString();
			for (var i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				var h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000; // 2^32
			}
			return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
		} else {
			n = 0xefc8249d;
		}
	};
	return mash;
};

var uheprng = function (seed) {
	return (function () {
		var o = 48; // set the 'order' number of ENTROPY-holding 32-bit values
		var c = 1; // init the 'carry' used by the multiply-with-carry (MWC) algorithm
		var p = o; // init the 'phase' (max-1) of the intermediate variable pointer
		var s = new Array(o); // declare our intermediate variables array
		var i; // general purpose local
		var j; // general purpose local
		var k = 0; // general purpose local

		// when our "uheprng" is initially invoked our PRNG state is initialized from the
		// browser's own local PRNG. This is okay since although its generator might not
		// be wonderful, it's useful for establishing large startup entropy for our usage.
		var mash = new Mash(); // get a pointer to our high-performance "Mash" hash

		// fill the array with initial mash hash values
		for (i = 0; i < o; i++) {
			s[i] = mash(Math.random());
		}

		// this PRIVATE (internal access only) function is the heart of the multiply-with-carry
		// (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
		// 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
		// [0-1] return function, and by the random 'string(n)' function which returns 'n'
		// characters from 33 to 126.
		var rawprng = function () {
			if (++p >= o) {
				p = 0;
			}
			var t = 1768863 * s[p] + c * 2.3283064365386963e-10; // 2^-32
			return s[p] = t - (c = t | 0);
		};

		// this EXPORTED function is the default function returned by this library.
		// The values returned are integers in the range from 0 to range-1. We first
		// obtain two 32-bit fractions (from rawprng) to synthesize a single high
		// resolution 53-bit prng (0 to <1), then we multiply this by the caller's
		// "range" param and take the "floor" to return a equally probable integer.
		var random = function (range) {
			return Math.floor(range * (rawprng() + (rawprng() * 0x200000 | 0) * 1.1102230246251565e-16)); // 2^-53
		};

		// this EXPORTED function 'string(n)' returns a pseudo-random string of
		// 'n' printable characters ranging from chr(33) to chr(126) inclusive.
		random.string = function (count) {
			var i;
			var s = '';
			for (i = 0; i < count; i++) {
				s += String.fromCharCode(33 + random(94));
			}
			return s;
		};

		// this PRIVATE "hash" function is used to evolve the generator's internal
		// entropy state. It is also called by the EXPORTED addEntropy() function
		// which is used to pour entropy into the PRNG.
		var hash = function () {
			var args = Array.prototype.slice.call(arguments);
			for (i = 0; i < args.length; i++) {
				for (j = 0; j < o; j++) {
					s[j] -= mash(args[i]);
					if (s[j] < 0) {
						s[j] += 1;
					}
				}
			}
		};

		// this EXPORTED "clean string" function removes leading and trailing spaces and non-printing
		// control characters, including any embedded carriage-return (CR) and line-feed (LF) characters,
		// from any string it is handed. this is also used by the 'hashstring' function (below) to help
		// users always obtain the same EFFECTIVE uheprng seeding key.
		random.cleanString = function (inStr) {
			inStr = inStr.replace(/(^\s*)|(\s*$)/gi, ''); // remove any/all leading spaces
			inStr = inStr.replace(/[\x00-\x1F]/gi, ''); // remove any/all control characters
			inStr = inStr.replace(/\n /, '\n'); // remove any/all trailing spaces
			return inStr; // return the cleaned up result
		};

		// this EXPORTED "hash string" function hashes the provided character string after first removing
		// any leading or trailing spaces and ignoring any embedded carriage returns (CR) or Line Feeds (LF)
		random.hashString = function (inStr) {
			inStr = random.cleanString(inStr);
			mash(inStr); // use the string to evolve the 'mash' state
			for (i = 0; i < inStr.length; i++) { // scan through the characters in our string
				k = inStr.charCodeAt(i); // get the character code at the location
				for (j = 0; j < o; j++) { //	"mash" it into the UHEPRNG state
					s[j] -= mash(k);
					if (s[j] < 0) {
						s[j] += 1;
					}
				}
			}
		};

		// this EXPORTED function allows you to seed the random generator.
		random.seed = function (seed) {
			if (typeof seed === 'undefined' || seed === null) {
				seed = Math.random();
			}
			if (typeof seed !== 'string') {
				seed = stringify(seed, function (key, value) {
					if (typeof value === 'function') {
						return (value).toString();
					}
					return value;
				});
			}
			random.initState();
			random.hashString(seed);
		};

		// this handy exported function is used to add entropy to our uheprng at any time
		random.addEntropy = function ( /* accept zero or more arguments */ ) {
			var args = [];
			for (i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			hash((k++) + (new Date().getTime()) + args.join('') + Math.random());
		};

		// if we want to provide a deterministic startup context for our PRNG,
		// but without directly setting the internal state variables, this allows
		// us to initialize the mash hash and PRNG's internal state before providing
		// some hashing input
		random.initState = function () {
			mash(); // pass a null arg to force mash hash to init
			for (i = 0; i < o; i++) {
				s[i] = mash(' '); // fill the array with initial mash hash values
			}
			c = 1; // init our multiply-with-carry carry
			p = o; // init our phase
		};

		// we use this (optional) exported function to signal the JavaScript interpreter
		// that we're finished using the "Mash" hash function so that it can free up the
		// local "instance variables" is will have been maintaining.  It's not strictly
		// necessary, of course, but it's good JavaScript citizenship.
		random.done = function () {
			mash = null;
		};

		// if we called "uheprng" with a seed value, then execute random.seed() before returning
		if (typeof seed !== 'undefined') {
			random.seed(seed);
		}

		// Returns a random integer between 0 (inclusive) and range (exclusive)
		random.range = function (range) {
			return random(range);
		};

		// Returns a random float between 0 (inclusive) and 1 (exclusive)
		random.random = function () {
			return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
		};

		// Returns a random float between min (inclusive) and max (exclusive)
		random.floatBetween = function (min, max) {
			return random.random() * (max - min) + min;
		};

		// Returns a random integer between min (inclusive) and max (inclusive)
		random.intBetween = function (min, max) {
			return Math.floor(random.random() * (max - min + 1)) + min;
		};

		// when our main outer "uheprng" function is called, after setting up our
		// initial variables and entropic state, we return an "instance pointer"
		// to the internal anonymous function which can then be used to access
		// the uheprng's various exported functions.  As with the ".done" function
		// above, we should set the returned value to 'null' once we're finished
		// using any of these functions.
		return random;
	}());
};

// Modification for use in node:
uheprng.create = function (seed) {
	return new uheprng(seed);
};
module.exports = uheprng;


/***/ }),
/* 133 */
/***/ (function(module, exports) {

exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const entity_1 = __webpack_require__(135);

class World {
  constructor() {
    this.components = new Map();
    this.resources = new Map();
    this.systems = new Map();
    this.emptySystems = new Set();
    this.activeSystems = new Set();
    this.openEntities = new Set();
    this.lastEntity = -1;
  }

  get entityCount() {
    return this.lastEntity + 1 - this.openEntities.size;
  }

  registerComponentStorage(component, storage) {
    this.components.set(component, storage);
  }

  getStorage(component) {
    return this.components.get(component);
  }

  getResource(resource) {
    return this.resources.get(resource);
  }

  getComponent(entity, component) {
    const storage = this.getStorage(component);

    if (storage !== undefined) {
      return storage.get(entity);
    }

    return undefined;
  }

  hasEntity(entity) {
    return entity <= this.lastEntity && !this.openEntities.has(entity);
  }

  hasComponent(entity, component) {
    const storage = this.getStorage(component);

    if (storage !== undefined) {
      return storage.has(entity);
    }

    return false;
  }

  createEntity() {
    let entity;

    if (this.openEntities.size > 0) {
      entity = this.openEntities.values().next().value;
      this.openEntities.delete(entity);
    } else {
      entity = ++this.lastEntity;
    }

    return new entity_1.EntityModifier(this, entity);
  }

  editEntity(entity) {
    return new entity_1.EntityModifier(this, entity);
  }

  deleteEntity(entity) {
    this.editEntity(entity).delete();
    this.openEntities.add(entity);
  }

  registerSystem(name, system) {
    this.systems.set(name, system);
  }

  enableSystem(name) {
    this.activeSystems.add(name);
  }

  disableSystem(name) {
    this.activeSystems.delete(name);
  }

  activeSystemsList() {
    const l = [];
    this.activeSystems.forEach(s => l.push(s));
    return l;
  }

  registerResource(resource) {
    this.resources.set(resource.kind, resource);
  }

  updateResources() {
    for (const resource of this.resources) {
      resource[1].update(this);
    }
  }

  updateSystems() {
    this.emptySystems.clear();

    for (const name of this.activeSystems) {
      const system = this.systems.get(name);
      const firstStorage = this.getStorage(system.components[0]);
      let calls = 0;
      firstStorage.foreach(entity => {
        let callSystem = true;

        for (let i = 1; i < system.components.length; i++) {
          if (!this.hasComponent(entity, system.components[i])) {
            callSystem = false;
            break;
          }
        }

        if (callSystem) {
          system.update(this, entity);
          calls++;
        }
      });

      if (calls === 0) {
        this.emptySystems.add(name);
      }
    }
  }

}

exports.World = World;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class EntityModifier {
  constructor(world, entity) {
    this.world = world;
    this.entity = entity;
  }

  withComponent(name, component) {
    this.world.getStorage(name).insert(this.entity, component);
    return this;
  }

  removeComponent(name) {
    this.world.getStorage(name).remove(this.entity);
    return this;
  }

  delete() {
    this.world.components.forEach(s => s.remove(this.entity));
  }

}

exports.EntityModifier = EntityModifier;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const rot_js_1 = __webpack_require__(50);

const palettes_1 = __webpack_require__(2);

const feature_1 = __webpack_require__(12);

const spatial_1 = __webpack_require__(1);

class RotRenderer {
  constructor(display) {
    this.display = display;
  }

  get boundaries() {
    return new spatial_1.Vector([this.display.getOptions().width, this.display.getOptions().height]);
  }

  static createAndMount(root, displayOptions = {
    width: 60,
    height: 45,
    forceSquareRatio: true,
    fontSize: 20,
    fontFamily: 'Monaco, monospace',
    bg: palettes_1.gray[4].toRgb()
  }) {
    const display = new rot_js_1.Display(displayOptions);
    root.appendChild(display.getContainer());
    return new RotRenderer(display);
  }

  clear() {
    this.display.clear();
  }

  render(world) {
    this.clear();
    const viewport = world.getResource('viewport');
    viewport.collectRenderables(world).forEach(({
      entity,
      centered
    }) => {
      if (entity !== undefined) {
        this.renderEntity(world, viewport, entity, centered);
      }
    });
    const ui = world.getResource('ui');
    ui.render(this);
    world.components.get('overlay').clear();
  }

  renderEntity(world, viewport, entity, centered) {
    const feature = feature_1.getFeature(world, entity);
    const position = world.getComponent(entity, 'position');

    if (feature && position) {
      this.renderFeature(world, viewport, entity, centered, feature, position);
    }
  }

  renderFeature(world, viewport, entity, centered, feature, position) {
    const level = world.getResource('map').levels[position.level];
    const p = position.position;

    if (level.isDiscovered(p)) {
      const color = level.isVisible(p) ? feature.diffuse : this.computeColor(viewport.ambientColor, feature.diffuse);
      const overlay = world.getComponent(entity, 'overlay') || {
        background: undefined
      };
      const displayPosition = viewport.toDisplay(p, centered);
      this.character(feature.character, displayPosition, color, overlay.background);
    }
  }

  computeColor(ambientLight, diffuse) {
    return diffuse.multiply(ambientLight);
  }

  eventToPosition(e) {
    const p = this.display.eventToPosition(e);

    if (typeof p === 'object') {
      return {
        x: p[0],
        y: p[1]
      };
    }

    return undefined;
  }

  character(character, position, fg, bg) {
    const fgRgb = fg.toRgb();
    const bgRgb = bg ? bg.toRgb() : undefined;
    this.display.draw(position.x, position.y, character[0], fgRgb, bgRgb || null);
  }

  text(text, position, fg, bg) {
    const fgRgb = fg.toRgb();
    const bgRgb = bg ? bg.toRgb() : undefined;

    for (let idx = 0; idx < text.length; idx++) {
      this.display.draw(position.x + idx, position.y, text[idx], fgRgb, bgRgb || null);
    }
  }

  flowText(text, position, width, fg, bg) {
    const fgTag = `%c{${fg.toRgb()}}`;
    const bgTag = bg ? `%b{${bg.toRgb()}}` : '';
    return this.display.drawText(position.x, position.y, `${fgTag}${bgTag}${text}`, width);
  }

}

exports.RotRenderer = RotRenderer;

/***/ })
/******/ ]);
//# sourceMappingURL=tlb.bundle.js.map