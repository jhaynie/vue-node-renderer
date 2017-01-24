const webpack = require('webpack'),
	MemoryFS = require('memory-fs'),
	jsdom = require('jsdom');

// we need to first do this before doing anything with Vue so that he
// thinks we're in a browser otherwise render will do nothing
require('jsdom-global')('<html><body><div id=app></div></body></html>', {
	features: {
		FetchExternalResources: ['img', 'script'],
		ProcessExternalResources: ['img', 'script'],
		QuerySelector: true
	}
});

const loaderPath = 'expose-loader?vueModule!' + require.resolve('vue-loader');
const mfs = new MemoryFS();
const globalConfig = {
  output: {
    path: '/',
    filename: 'test.build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: loaderPath
      }
    ]
  }
};

// bundle will take a vue filename (*.vue) and return the compiled JS code
const bundle = (fn) => {
	return new Promise (
		(resolve, reject) => {
			try {
				const config = Object.assign({}, globalConfig, {entry: fn});
				const webpackCompiler = webpack(config);
				webpackCompiler.outputFileSystem = mfs;
				webpackCompiler.run((err, stats) => {
					if (err) {
						return reject(err);
					}
					resolve(mfs.readFileSync('/test.build.js').toString());
				});
			} catch (ex) {
				reject(ex);
			}
		}
	);
};

const interopDefault = (module) => module ? module.__esModule ? module.default : module : module;

// loader will take a vue filename (*.vue) and return the vue instance
const loader = (fn) => {
	return new Promise (
		(resolve, reject) => {
			try {
				bundle(fn).then(code => {
					jsdom.env({
						html: '<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>',
						src: [code],
						done: (err, window) => {
							if (err) {
								return reject(err);
							}
							resolve({
								window: window,
								vue: interopDefault(window.vueModule),
								code: code
							});
						}
					});
				}).catch(reject);
			} catch (ex) {
				reject(ex);
			}
		}
	);
}

// render will take a filename (*.vue) and component props (optional) and
// create a vue component and mount it and return it's HTML and vue instance
const render = (fn, props) => {
	return new Promise (
		(resolve, reject) => {
			try {
				// suppress the vue loading message in the console
				const v = process.env.NODE_ENV;
				process.env.NODE_ENV = 'production';
				loader(fn).then(result => {
					const component = result.vue;
					const Vue = require('vue');
					const vm = new Vue({
						el: document.createElement('div'),
						render: h => h(component, {props: props})
					});
					vm.$mount('#app');
					process.env.NODE_ENV = v;
					resolve({
						component: component,
						vm: vm,
						body: vm.$el.outerHTML,
						el: vm.$el
					});
				}).catch(reject);
			} catch (ex) {
				reject(ex);
			}
		}
	);
};

module.exports.default = render;
module.exports.render = render;
module.exports.bundle = bundle;
module.exports.loader = loader;
