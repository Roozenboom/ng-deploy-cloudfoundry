import { createBuilder, BuilderOutput, BuilderContext } from '@angular-devkit/architect';
import { experimental, normalize, getSystemPath } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { join } from 'path';

import { build, deploy } from './actions';
import { Options } from '../utils/types';

export default createBuilder<any>(
  async (options: Options, context: BuilderContext): Promise<BuilderOutput> => {
    const root = normalize(context.workspaceRoot);
    const workspace = new experimental.workspace.Workspace(root, new NodeJsSyncHost());
    await workspace.loadWorkspaceFromHost(normalize('angular.json')).toPromise();

    if (!context.target) {
      throw new Error('Cannot deploy the application without a target');
    }

    const targets = workspace.getProjectTargets(context.target.project);

    if (!targets || !targets.build || !targets.build.options || !targets.build.options.outputPath) {
      throw new Error('Cannot find the project output directory');
    }

    const projectRoot = join(getSystemPath(workspace.root), targets.build.options.outputPath);

    try {
      await build(context, options);
      await deploy(context, options, projectRoot);
    } catch (e) {
      context.logger.error(`Error when trying to deploy:`);
      context.logger.error(JSON.stringify(e));
      return { success: false };
    }

    return { success: true };
  }
);
