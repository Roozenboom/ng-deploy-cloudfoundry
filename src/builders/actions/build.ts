import { BuilderContext } from '@angular-devkit/architect';
import { Options } from '../../utils/types';

export async function build(context: BuilderContext, options: Options) {
  if (options.noBuild) {
    context.logger.info(`🏗️ Skipping build`);
  } else {
    const project = context.target!.project;

    context.logger.info(`📦 Building your application "${project}". Configuration: "${options.configuration}"`);

    const build = await context.scheduleTarget({
      target: 'build',
      project: project,
      configuration: options.configuration
    });

    await build.result;
  }
}
