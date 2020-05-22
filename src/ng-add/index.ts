import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { AngularJson } from '../utils/angular-json';
import { Options } from '../utils/types';

export function ngAdd(options: Options): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([addDeployCloudFoundry(options)])(tree, context);
  };
}

export function addDeployCloudFoundry(options: Options): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const project = new AngularJson(tree, options);

    project.addDeployArchitect({
      builder: 'ng-deploy-cloudfoundry:deploy',
      options: {
        sso: options.sso,
        skipSslValidation: options.skipSslValidation
      }
    });
  };
}
