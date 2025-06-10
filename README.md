# Knob 1.1 #

**Knob 1.1** is a JavaScript widget that changes `<input type="number">` into
a rotary control (dial), which can be manipulated by the mouse or touch device.

**Knob 1.1** should work in any modern browser. It is small code,
slightly under 3kB in size.

You can see **Knob 1.1** in action [here](http://www.sjaakpriester.nl/software/knob).

Here is **Knob 1.1**'s  [GitHub page](https://github.com/sjaakp/knob).

## Install ##

Install **Knob 1.1** with [npm](https://www.npmjs.com//):

	npm i @sjaakp/knob

You can also manually install **Knob 1.1** by
[downloading the source in ZIP-format](https://github.com/sjaakp/knob/archive/master.zip).

## Dependencies ##

**Knob 1.1** has no dependencies.

## Usage ##

#### Load resources ####

Copy `knob.js` from the `dist` directory to a reachable subdirectory of your
website. At the end of the `body` part of the HTML page,
load the **Knob 1.1** code like this:

    <script src="/<your subdirectory>/knob.js"></script>
    
#### Load from CDN ####

You may also load the **Knob 1.1** file from a content distribution
network (CDN), like so:

    <script src="https://unpkg.com/@sjaakp/knob/dist/knob.js"></script>

 
### Set-up ###

**Knob 1.1** creates itself around a HTML `<input>` of the `number`-type,
most probably inside an HTML `<form>`. The `<input>` should have a `name`,
as is common for `<form>` elements, and an `id`. 

The `<input>` should also
have an attribute `data-knob`. This doesn't need to have a value (although
it can, see under 'Appearance').

The HTML could look something like:

    <html>
        <head> ... </head>
        <body>
            ... other stuff ...
            <form>
                ... other form elements ...
                <input type="number" data-knob id="knob1" name="speed">
                ... more form elements ...
                <button type="submit">Submit</button>
            </form>
            ... more stuff ...
            <script src="/js/dist/knob.js"></script>
        </body>
    </html>

No further initializing is needed.

**Knob 1.1** uses the attributes of the 
[number input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number "MDN"),
`min`, `max`, and `value` in particular. There is no additional API.

A limitation is that **Knob 1.1** only works with whole numbers. It won't act 
well with decimal fractions. Also, the attribute `step` should be kept at its
default value of `"1"`.

## Appearance ##

If the attribute `data-knob` has a value of `"flip"` **Knob 1.1**'s ring
will be upside down. If the value is `"ccw"`, **Knob 1.1** will work in
counter-clockwise mode. Both values can also be combined.

The size of the gap in the ring can be changed by setting by the 
attribute `data-gap` to a number between 0 and 90. It is the gap size in
degrees. The default is 30.

A few aspects of **Knob 1.1**'s appearance can be adapted by setting
CSS custom properties inside the ruleset for the class of **Knob 1.1**'s
surrounding `<div>`: `.knob` (or, of course, any DOM-element 
higher in the cascade). The surrounding `<div>` will have an `id` identical
to the `id` of the `<input>` supplemented with `"-knob"`.

The properties, together with their default value:

 - **--knob-diameter**, default: `6em` 
 - **--knob-inner-diameter**, default: `75%` 
 - **--knob-color**, default: `orange` 
 - **--knob-grey**, default: `lightgrey` 

## Inspiration ##

**Knob 1.1** was inspired by Anthony Terrien's 
[jQuery-Knob](https://github.com/aterrien/jQuery-Knob "GitHub"). As the name
implies, this depends on jQuery, while **Knob 1.1** does not. On the other
hand, jQuery-Knob has a few more options.
