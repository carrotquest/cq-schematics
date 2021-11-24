import {Schema as ComponentSchema} from '@schematics/angular/component/schema';

export interface Schema extends ComponentSchema {
  /**
   * Название модуля, в declarations которого добавляется компонент
   */
  moduleName?: string,

  /**
   * Относительный путь от компонента до модуля
   */
  moduleRelativePath?: string
}