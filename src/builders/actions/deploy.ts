import { BuilderContext } from '@angular-devkit/architect';
import { join } from 'path';
import { login, push, writeManifest } from '../../utils/cloud-foundry';
import { Options } from '../../utils/types';

export async function deploy(context: BuilderContext, options: Options, projectRoot: string) {
  try {
    await login(context, options);

    const manifestPath = join(projectRoot, 'manifest.yml');
    await writeManifest(context, manifestPath);

    await push(context, options, manifestPath);

    context.logger.info('🍏 Successfully published to Cloud Foundry!');
  } catch (error) {
    context.logger.error('❌ An error occurred!');
    throw error;
  }
}
