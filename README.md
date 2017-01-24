# Vue Node Renderer [![Build Status](https://travis-ci.org/jhaynie/vue-node-renderer.svg?branch=master)](https://travis-ci.org/jhaynie/vue-node-renderer)

This module makes it rather easy to load [Vue.JS](https://vuejs.org) Component files into your Node environment without much fuss.

This can be very helpful for unit testing your Vue apps server side (without the need for Karma or other browser-based test environments) or to server render them on-the-fly into a real DOM.

## Install

You can install via yarn or npm:

	yarn add vue-node-renderer
	npm install vue-node-renderer

You'll need to have the following in your app package.json for this module to work:

- webpack >=2.1
- vue >=2.1
- vue-template-compiler >=2.1

## Usage

Let's say you have this vue component:

```html
<template>
	<div>Hello {{msg}}</div>
</template>

<script>
export default {
	props: ['msg']
};
</script>
```

You can render with the following:

```javascript
const Render = require('vue-node-renderer');
Render('./test.vue', {msg:'from props'}).then(result => {
	// should be <div>Hello from props</div>
	console.log(result.body);
});
```

The Promise returned will contain the following properties:

- `body` the HTML body of the render component
- `vm` the Vue instance
- `component` the Vue component class
- `el` shortcut to the vue instance element

## Canvas Support

If your Vue component renders to the <canvas> element, make sure you install the [node-canvas](https://github.com/Automattic/node-canvas) module.

For example:

```html
<template>
	<canvas width="150" height="200"></canvas>
</template>

<script>
export default {
	mounted() {
		// use jquery to get our canvas element
		const canvas = this.$el;
		// draw a couple of boxes into the canvas
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(200,0,0)';
		ctx.fillRect(10, 10, 50, 50);
		ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
		ctx.fillRect(30, 30, 50, 50);
	}
}
</script>
```

Now you can render the canvas to a PNG:

```javascript
const Render = require('vue-node-renderer');
Render('./test.vue', {msg:'from props'}).then(result => {
	// should be data url to the PNG
	const url = result.el.toDataURL('image/png');
	console.log(url);
	// convert it to a Node Buffer so you can save it to a file, etc.
	const buf = new Buffer(url.substring('data:image/png;base64,'.length), 'base64');
});
```

## Contributions

Pull requests welcome and encouraged. I've only tested this minimally and am using with my own project.

## Credits

The [vue-loader](https://vue-loader.vuejs.org) project was helpful in understanding how to load vue files via webpack on the fly.  I also have a sample project that inspired this module called [example-vue-jsdom-canvas](https://github.com/jhaynie/example-vue-jsdom-canvas).

## License

MIT
