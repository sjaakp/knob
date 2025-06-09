/*
 *  knob.js - transform <input type="number"> into a rotary control.
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

    const mask = document.createElement('div');
    this.element.appendChild(mask);
    mask.appendChild(this.input);

    const rect = this.element.getBoundingClientRect();
    this.x = rect.left + rect.width / 2;
    this.y = rect.top + rect.height / 2;

    this.ccw = this.input.dataset.knob === 'ccw';
    this.min = this.input.min || 0;
    this.max = this.input.max || 100;

    this.onPointerMove = function (evt) {
        let arc = Math.atan2(evt.pageX - this.x, this.y - evt.pageY);
        if (arc < 0) arc += 2 * Math.PI;

        this.setArc(arc);
        this.input.value = this.arcToValue(arc);
    }.bind(this);

    this.onPointerUp = function () {
        document.removeEventListener('pointerup', this.onPointerUp);
        document.removeEventListener('pointermove', this.onPointerMove);
    }.bind(this);

    this.element.addEventListener('pointerdown', evt => {
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
        const range = this.getRange();
        return Math.round(range * rad / (2 * Math.PI) + this.min);
    },

    valueToArc(v) {
        const range = this.getRange();
        if (range === 0) return 0;
        v -= this.min;
        const r = v * 2 * Math.PI / range;
        return this.ccw ? 2 * Math.PI - r : r;
    },

    setValue(v) {
        this.input.value = v;
        this.setArc(this.valueToArc(v));
    },

    setArc(rad) {
        this.element.style.backgroundImage = this.ccw
            ? `conic-gradient(var(--knob-grey,lightgrey) 0 ${rad}rad,var(--knob-color,orange) ${rad}rad)`
            : `conic-gradient(var(--knob-color,orange) 0 ${rad}rad,var(--knob-grey,lightgrey) ${rad}rad)`;
    }
};

const style = document.createElement('style');
style.appendChild(document.createTextNode(`.knob{place-content:center;place-items:center;width:var(--knob-diameter,6em);aspect-ratio:1;border-radius:500em;
div{place-content:center;place-items:center;width:var(--knob-inner-diameter,75%);aspect-ratio:1;border-radius:500em;background-color:Canvas;user-select:none}}
[data-knob]{display:block;max-width:6ch;field-sizing:content;&:focus{outline-width:1px}}`));
document.head.appendChild(style);

document.querySelectorAll('[data-knob]').forEach(elt => {
    new Knob(elt);
});
