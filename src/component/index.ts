import {basename, extname, normalize, strings} from '@angular-devkit/core';
import {classify} from '@angular-devkit/core/src/utils/strings';
import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import generateComponent from '@schematics/angular/component/index';
import {buildDefaultPath, getWorkspace} from '@schematics/angular/utility/workspace';
import {parseName} from '@schematics/angular/utility/parse-name';
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
async function createModuleExtraOptions(tree: Tree, _options: Schema) {
  // копируем опции, чтобы не засорять ненужными данными, но при этом иметь возможность их дополнять и передавать в служебные методы
  const options = {..._options}

  if (options.skipImport) {
    return;
  }

  // код ниже по получению path скопирован из схематики Angular
  // подозреваю всё потому, что Angular теперь требует обязательное указание проекта, а опцию defaultProject в angular.json упразднили
  const workspace = await getWorkspace(tree);
  const project = workspace.projects.get(options.project as string);

  if (!project) {
    return;
  }

  if (options.path === undefined) {
    options.path = buildDefaultPath(project);
  }

  const modulePath = findModuleFromOptions(tree, options);
  
  if (modulePath) {
    // эта строчка взята из @schematics/angular:component в Angular, для подготовки к поиску подходящего модуля
    const parsedPath = parseName(options.path as string, options.name);

    // таким же образом строятся пути в @schematics/angular, в функции buildRelativeModulePath (которая не экспортирована, поэтому нельзя её использовать тут)
    const specFilePath = normalize(
      `/${parsedPath.path}/` +
      (options.flat ? '' : strings.dasherize(parsedPath.name) + '/') +
      strings.dasherize(parsedPath.name) +
      '.spec.ts',
    );

    // дополняем исходные опции необходимыми параметрами
    const moduleFileName = basename(modulePath).split(MODULE_EXT)[0];
    _options.moduleName = classify(`${moduleFileName}Module`);
    // то же самое делается в функции buildRelativeModulePath в схематике @schematics/angular, но я ещё убираю расширение у файла модуля
    _options.moduleRelativePath = buildRelativePath(specFilePath, modulePath).split(extname(modulePath))[0];
  }
}
