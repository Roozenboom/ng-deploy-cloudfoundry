import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from 'schematics-utilities';
import { AngularJson } from '../utils/angular-json';
import { Options } from '../utils/types';

export function ngAdd(options: Options): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([addDeployCloudFoundry(options), addPackageJsonDependencies()])(tree, context);
  };
}

function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const { version } = require('../../package.json');
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: `^${version}`, name: 'ng-deploy-cloudfoundry' }
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
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
