import { BuilderContext } from '@angular-devkit/architect';
import { spawn } from 'child_process';
import { writeFile } from 'fs-extra';
import { safeDump } from 'js-yaml';

import { Options } from './types';

export async function push(context: BuilderContext, options: Options, manifestPath: string) {
  const command = 'cf';
  const params = ['push', `-f=${manifestPath}`];

  if (options.randomRoute) {
    params.push('--random-route');
  }
  context.logger.info(`🚀 Push ${context.target!.project} to Cloud Foundry`);
  await spawnProcess(command, params);
}

export async function login(context: BuilderContext, options: Options) {
  try {
    const command = 'cf';
    const params = ['target'];

    await spawnProcess(command, params);
  } catch (err) {
    const command = 'cf';
    const params = ['login'];

    if (options.sso) {
      params.push('--sso');
    }

    if (options.skipSslValidation) {
      params.push('--skip-ssl-validation');
    }

    context.logger.info(`🔑 You are not authenticated for Cloud Foundry! Let's login first.`);
    await spawnProcess(command, params);
  }
}

export async function writeManifest(context: BuilderContext, path: string) {
  const manifestJson = {
    applications: [
      {
        name: context.target!.project,
        path: '.',
        instances: 1,
        memory: '64M',
        disk_quota: '250M',
        buildpacks: ['staticfile_buildpack']
      }
    ]
  };

  await writeFile(path, safeDump(manifestJson));
}

async function spawnProcess(command: string, parameters: string[]) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, parameters, { cwd: process.cwd(), stdio: 'inherit' });

    proc.on('close', code => {
      code === 0 ? resolve() : reject(new Error(`process '${command}' failed with code: ${code}`));
    });
  });
}
