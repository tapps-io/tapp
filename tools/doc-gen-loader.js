/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-use-before-define */
'use strict';
const path = require('path');
const docgen = require('react-docgen');

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

/** WORK IN PROGRESS - used for creating markdown documentation */
module.exports = function DocGenLoader(source) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions({}, options, 'Doc Gen Loader');

  const context = options.context || this.rootContext;

  const url = loaderUtils.interpolateName(this, options.name || 'docs/[name].md', {
    context,
    source,
    regExp: options.regExp,
  });

  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url, this.resourcePath, context);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    this.emitFile(outputPath, parseSource(source, path.extname(this.resource)));
  }

  return source;
};

function parseSource(source, extension) {
  const lang = identifyLang(extension);
  try {
    const component = docgen.parse(source);
    return generateMarkdown(component, source, lang);
  } catch (e) {
    return `Not a react component, but the source is below:\n\n${mdCode(source, lang)}`;
  }
}

function generateMarkdown(component, source, lang) {
  const sections = [
    generateTOC(Object.entries(component.props).sort(), component.methods),
    generateTitle(component.displayName),
    generateDescription(component.description),
    generateProps(component.props, lang),
    generateMethods(component.methods, lang),
    generateSource(source, lang),
    generateNavigation(component.displayName),
  ];
  return sections.join(`\n`);
}

//------------------------------------------------------------------------------------
// SECTIONS
//------------------------------------------------------------------------------------

function generateTitle(name) {
  return `# \`<${name} />\`\n`;
}

function generateDescription(description) {
  return description + '\n';
}

function generateProps(props, lang) {
  if (!props || isEmpty(props)) return '';
  return (
    `## :key: Props\n\n` +
    Object.keys(props)
      .sort()
      .map(function(propName) {
        return generateProp(propName, props[propName], lang);
      })
      .join('\n')
  );
}

function generateMethods(methods, lang) {
  if (!methods || !methods.length) return '';
  return (
    `## :zap: Methods\n\n` +
    methods
      .sort()
      .map(method => generateMethod(method, lang))
      .join('\n')
  );
}

function generateSource(source, lang) {
  return `## :hammer: Source\n\n` + mdCode(source, lang);
}

function generateNavigation(name) {
  return `\n---\nGo to [[Home]] or back to the [Top](#${name.toLowerCase()}-)`;
}

function generateTOC(props, methods) {
  let toc = '**This page**\n\n';
  if (props && props.length) {
    toc += '* [Props](#key-props)\n';
    toc += props
      .map(([name, prop]) => `  * [${name}](#${name.toLowerCase()}${prop.required ? '-required' : ''})`)
      .join('\n');
    toc += '\n';
  }
  if (methods && methods.length) {
    toc += '* [Methods](#zap-methods)\n';
    toc += methods
      .map(
        ({ name, modifiers }) =>
          `  * [${name}](#${name.toLowerCase()}${modifiers && modifiers.length ? '-' + modifiers.join('-') : ''})`,
      )
      .join('\n');
    toc += '\n';
  }
  toc += '* [Source](#hammer-source)\n\n';
  toc += '---\n';
  return toc;
}

//------------------------------------------------------------------------------------
// VALUES
//------------------------------------------------------------------------------------

function generateProp(name, prop, lang) {
  return (
    `### ${name}${prop.required ? ' [required]' : ''}\n\n` +
    (prop.description ? prop.description + '\n\n' : '') +
    (prop.tsType ? mdCode(prop.tsType.raw || prop.tsType.name, lang) : '') +
    '\n'
  );
}

function generateMethod(method, lang) {
  return (
    `### ${method.name} ${formatModifiers(method.modifiers)}\n\n` +
    (method.description ? method.description + '\n\n' : '') +
    mdCode(
      `${method.modifiers ? method.modifiers.join(' ') + ' ' : ''}${method.name}(${
        method.params ? formatParams(method.params) : ''
      }): ${method.returns ? (method.returns.type ? method.returns.type.name : 'any') : 'void'}`,
      lang,
    ) +
    '\n\n' +
    (method.params ? formatParams(method.params, true) : '') +
    '\n\n' +
    (method.returns ? formatReturns(method.returns, true) : '**Returns:** `void`') +
    '\n'
  );
}

//------------------------------------------------------------------------------------
// FORMATTERS
//------------------------------------------------------------------------------------

function formatModifiers(modifiers) {
  return modifiers.map(modifier => `[${modifier}]`).join(' ') + ' ';
}

function formatParams(params, table = false) {
  if (!table) {
    return params
      .map(param => `${param.name}${param.optional ? '?' : ''}: ${param.type ? param.type.name : 'any'}`)
      .join(', ');
  }
  return mdTable([
    ['Parameter', 'Type', 'Required', 'Description'],
    ...params.map(param => [
      param.name,
      `\`${param.type ? param.type.name : 'any'}\``,
      !param.optional,
      param.description || 'none',
    ]),
  ]);
}

function formatReturns(returns) {
  return `**Returns:** \`${returns.type ? returns.type.name : 'any'}\` - ${returns.description}`;
}

//------------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------------

function mdCode(source, lang = 'javascript') {
  return `\`\`\`${lang}\n${source}\n\`\`\``;
}

function mdTable(rows) {
  return (
    rows
      .map(
        (row, i) =>
          row.map(col => `|${col}`).join('') +
          (i == 0 ? '|\n' + row.map(col => `|${'-'.repeat(col.length)}`).join('') : ''),
      )
      .join('|\n') + '|'
  );
}

function isEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

function identifyLang(extension) {
  switch (extension.toLowerCase()) {
    case '.json':
      return 'json';
    case '.js':
    case '.jsx':
      return 'javascript';
    case '.ts':
    case '.tsx':
      return 'typescript';
  }
}
