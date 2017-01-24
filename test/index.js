const should = require('should');
const path = require('path');
const lib = require('../');
const Render = lib.render;

describe('render', function() {

	it('should render with props', function(done) {
		const fn = path.join(__dirname, 'props.vue');
		Render(fn, {msg:'from props'}).then(result => {
			should(result).have.property('body');
			should(result).have.property('vm');
			should(result).have.property('component');
			should(result.body).be.equal('<div>Hello from props</div>');
			done();
		}).catch(done);
	});

	it('should render with data', function(done) {
		const fn = path.join(__dirname, 'data.vue');
		Render(fn).then(result => {
			should(result).have.property('body');
			should(result).have.property('vm');
			should(result).have.property('component');
			should(result.body).be.equal('<div>Hello from data</div>');
			done();
		}).catch(done);
	});

	it('should render with computed', function(done) {
		const fn = path.join(__dirname, 'computed.vue');
		Render(fn).then(result => {
			should(result).have.property('body');
			should(result).have.property('vm');
			should(result).have.property('component');
			should(result.body).match(/<div>Hello "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{2,}Z"<\/div>/);
			done();
		}).catch(done);
	});

	it('should render with canvas', function(done) {
		const fn = path.join(__dirname, 'canvas.vue');
		Render(fn).then(result => {
			should(result).have.property('body');
			should(result).have.property('vm');
			should(result).have.property('component');
			should(result.body).be.equal('<canvas width="150" height="200"></canvas>');
			const url = result.el.toDataURL('image/png');
			should(url).be.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAABmJLR0QA/wD/AP+gvaeTAAABT0lEQVR4nO3dywkCMQBAwSgWpfVoH2IfFmRX2sKu5LmyzJxDPvDIMRkDAAAAAACY57B04GuMd7mRXzmvODPfO269AfZJWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEXitNXCz3HdaOXbfe58l8fc+fbBjUVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFYvFrM/N/Jp396gv/xI1FQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIQFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsHMf6/QGSOGG0WMAAAAASUVORK5CYII=');
			done();
		}).catch(done);
	});

	it('should render with ES6 import', function(done) {
		const fn = path.join(__dirname, 'babel.vue');
		Render(fn).then(result => {
			should(result).have.property('body');
			should(result).have.property('vm');
			should(result).have.property('component');
			should(result.body).be.equal('<div>foo</div>');
			done();
		}).catch(done);
	});

	it('should render with PNG import and custom webpack loader', function(done) {
		const fn = path.join(__dirname, 'png.vue');
		// pass in a custom loader which is merged into our config
		const config = {
			module: {
				loaders: [
					{
						test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
						loader: 'url-loader'
					}
				]
			}
		};
		Render(fn, null, config).then(result => {
			should(result).have.property('body');
			should(result).have.property('vm');
			should(result).have.property('component');
			should(result.body).match(/<img src="data:image\/png;base64,iVBORw0KGgoA/);
			done();
		}).catch(done);
	});

});
