/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const path = require('path');
const log = require('webpack-log');
const { JSDOM, VirtualConsole } = require('jsdom');
let HtmlWebpackPlugin;

try {
  HtmlWebpackPlugin = require('html-webpack-plugin');
} catch (error) {
  // Optional dependencies not found
}

class RenderPlugin {
  constructor(hook, options = {}) {
    if (typeof hook !== 'string' && hook.length > 0) throw 'First argument must be the root hook id.';
    this.hook = hook;
    this.options = options;
    this.options.scripts = options.scripts || [];
    if (!Array.isArray(this.options.scripts)) throw 'Scripts must be specified as an array.';
  }

  loadScript(document, src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const match = src.match(/<script(.*)>([\s\S]+)<\/script>/);
      if (match) {
        match[1]
          .split(' ')
          .filter(attr => attr.length)
          .map(attr => attr.split('='))
          .forEach(([key, value]) => script.setAttribute(key, value != undefined ? JSON.parse(value) : ''));
        script.innerHTML = match[2];
        document.body.appendChild(script);
        resolve();
      } else {
        script.src = src;
        script.onload = resolve;
        script.error = reject;
        document.body.appendChild(script);
      }
    });
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    const logger = log({
      name: 'render-plugin',
      level: this.options.logLevel || 'warn',
    });

    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync('RenderPlugin', (compilation, callback) => {
      const virtualConsole = new VirtualConsole({ omitJSDOMErrors: false }).sendTo(logger);

      const dom = new JSDOM(``, {
        // For handling security error accessing storage and resolution of relative URLs
        url: 'http://localhost/',

        // Suppress console-proxied eval() errors, but keep console proxying
        virtualConsole,

        // Don't track source locations for performance reasons
        includeNodeLocations: false,

        // Don't allow inline event handlers & script tag exec
        runScripts: 'dangerously',

        // Allow external sources to be loaded such as polyfills
        resources: 'usable',

        pretendToBeVisual: true,

        beforeParse(w) {
          w.shouldRender = true;
        },
      });

      const window = dom.window;
      const document = dom.window.document;

      // Load polyfills
      Promise.all(this.options.scripts.map(src => this.loadScript(document, src)))
        .then(() => {
          // Expect only one entrypoint
          const [moduleId, entrypoint] = compilation.entrypoints.entries().next().value;

          // Find asset source using entrypoint
          const source = compilation.assets[entrypoint.getFiles().find(file => path.extname(file) === '.js')].source();

          // Attach root element using specified hook as id
          const root = window.document.createElement('div');
          root.className = this.hook;
          window.document.body.appendChild(root);

          // Execute main JS bundle
          // window.eval(source); TODO: Evaluate how to handle props mismatch

          setTimeout(() => {
            const output = root.outerHTML;

            compilation.assets[`${moduleId}.html`] = {
              source: function() {
                return output;
              },
              size: function() {
                return output.length;
              },
            };
            entrypoint.chunks.find(chunk => chunk.name === moduleId).files.push(`${moduleId}.html`);

            window.document.body.removeChild(root);

            dom.window.close();

            if (HtmlWebpackPlugin) {
              HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('RenderPlugin', (data, callback) => {
                data.html = data.html.replace(`{{RenderPlugin}}`, output);
                callback();
              });
            }

            callback();
          });
        })
        .catch(err => {
          dom.window.close();
          logger.debug(err);
          callback();
        });
    });
  }
}

module.exports = RenderPlugin;
