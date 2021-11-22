import {strings} from '@angular-devkit/core';
import {apply, branchAndMerge, chain, externalSchematic, mergeWith, move, Rule, SchematicContext, template, Tree, url} from '@angular-devkit/schematics';
import generateComponent from '@schematics/angular/component';
import {parseName} from '@schematics/angular/utility/parse-name';
import {Schema} from './schema';



// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export default function(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return generateComponent(_options);
  }
}
/*export default function(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const parsedPath = parseName(_options.path as string, _options.name);

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        'if-flat': (s: string) => (_options.flat ? '' : s),
        ..._options
      }),
      move(parsedPath.path)
    ]);

    return chain([
        externalSchematic('@schematics/angular', 'component', _options),
        (host, _context) => {
          _context.logger.warn(Object.entries(_options).join(' | '));
          return host;
        }
      ]
    );
  };
}*/
