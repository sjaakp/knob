/*
 *  knob.js - transform <input type="number"> into a rotary control.
 *  Version 1.1.2
 *  (c) Sjaak Priester, Amsterdam, 2025 MIT license
 *  https://sjaakpriester.nl/software/knob
 *  https://github.com/sjaakp/knob
 */
function Knob(elmt)
{
    this.input = elmt;
    this.element = document.createElement('div');
    this.element.className = 'knob';
    this.element.id = this.input.id + '-knob';
    elmt.replaceWith(this.element);

    this.mask = document.createElement('div');
    this.element.appendChild(this.mask);
    this.mask.appendChild(this.input);

    this.ccw = !!this.input.dataset.knob.match(/ccw/);
    this.flip = !!this.input.dataset.knob.match(/flip/);

    const g = this.input.dataset.gap;
    if (g && g >= 0 && g <= 90) {
        this.gap = g * Math.PI / 180;
    }
    else this.gap = Math.PI / 6;

    this.min = +(this.input.min || 0);
    this.max = +(this.input.max || 100);

    if (this.ccw) {
        this.element.style.setProperty('--a', 'var(--knob-grey, lightgrey');
        this.element.style.setProperty('--b', 'var(--knob-color, orange');
    } else {
        this.element.style.setProperty('--a', 'var(--knob-color, orange');
        this.element.style.setProperty('--b', 'var(--knob-grey, lightgrey');
    }

    if (! this.flip) {
        this.element.style.rotate = '.5turn';
        this.mask.style.rotate = '.5turn';
    }

    this.onPointerMove = function (evt) {
        let arc = Math.atan2(evt.clientX - this.x, this.y - evt.clientY);
        if (! this.flip) arc += Math.PI;
        if (arc < 0) arc += 2 * Math.PI;

        const halfGap = this.gap / 2;
        if (arc >= halfGap && arc <= (2 * Math.PI - halfGap)) {
                this.setArc(arc);
            this.input.value = this.arcToValue(arc);
        }
    }.bind(this);

    this.onPointerUp = function () {
        document.removeEventListener('pointerup', this.onPointerUp);
        document.removeEventListener('pointermove', this.onPointerMove);
    }.bind(this);

    this.element.addEventListener('pointerdown', evt => {
        const rect = this.element.getBoundingClientRect();
        this.x = rect.left + rect.width / 2; // 1.1.2: initialize x/y at pointerdown
        this.y = rect.top + rect.height / 2;
        document.addEventListener('pointerup', this.onPointerUp);
        document.addEventListener('pointermove', this.onPointerMove);
    });

    this.input.addEventListener('input', evt => {
        this.setArc(this.valueToArc(evt.target.value));
    });

    this.setArc(this.valueToArc(this.input.value));

    // console.log(this);
}

Knob.prototype = {
    getRange() {
        return this.max - this.min;
    },

    arcToValue(rad) {
        if (this.ccw) rad = 2 * Math.PI - rad;
        rad -= this.gap / 2;
        const range = this.getRange();
        return Math.round(range * rad / (2 * Math.PI - this.gap)) + this.min;
    },

    valueToArc(v) {
        const range = this.getRange();
        if (range === 0) return 0;
        v -= this.min;
        const r = v * (2 * Math.PI - this.gap) / range + this.gap / 2;
        return this.ccw ? 2 * Math.PI - r : r;
    },

    setValue(v) {
        this.input.value = v;
        this.setArc(this.valueToArc(v));
    },

    setArc(rad) {
        const start = this.gap / 2,
            stop = 2 * Math.PI - start;
        this.element.style.backgroundImage =
            `conic-gradient(Canvas 0 ${start}rad,var(--a) ${start}rad ${rad}rad,var(--b) ${rad}rad ${stop}rad, Canvas ${stop}rad)`;
    }
};

Knob.init = () => {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(`.knob{place-content:center;place-items:center;width:var(--knob-diameter,6em);aspect-ratio:1;border-radius:500em;
div{place-content:center;place-items:center;width:var(--knob-inner-diameter,75%);aspect-ratio:1;border-radius:500em;background-color:Canvas;user-select:none}}
[data-knob]{display:block;max-width:6ch;field-sizing:content;&:focus{outline-width:1px}}`));
    document.head.appendChild(style);

    document.querySelectorAll('[type=number][data-knob]').forEach(elt => {
        new Knob(elt);
    });
}

Knob.init();