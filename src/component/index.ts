import {basename, extname, normalize, strings} from '@angular-devkit/core';
import {classify} from '@angular-devkit/core/src/utils/strings';
import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import generateComponent from '@schematics/angular/component/index';
import {buildRelativePath, findModuleFromOptions, MODULE_EXT} from '@schematics/angular/utility/find-module';
import {Schema} from './schema';

export default function(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    createModuleExtraOptions(tree, _options);
    return generateComponent(_options);
  }
}

/**
 * Добавление информации о модуле, в который будет импортироваться компонент, в options
 *
 * @param tree
 * @param _options
 */
function createModuleExtraOptions(tree: Tree, _options: Schema) {
  if (_options.skipImport) {
    return;
  }

  const modulePath = findModuleFromOptions(tree, _options);

  if (modulePath) {
    // таким же образом строятся пути в @schematics/angular, поэтому не удивляйтесь
    const specFilePath = normalize(
      `/${_options.path}/` +
      (_options.flat ? '' : strings.dasherize(_options.name) + '/') +
      strings.dasherize(_options.name) +
      '.spec.ts',
    );

    const moduleFileName = basename(modulePath).split(MODULE_EXT)[0];
    _options.moduleName = classify(`${moduleFileName}Module`);
    _options.moduleRelativePath = buildRelativePath(specFilePath, modulePath).split(extname(modulePath))[0];
  }
}
