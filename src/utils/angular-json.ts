import { JsonParseMode, parseJson } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from 'schematics-utilities';
import { Options } from './types';

export class AngularJson {
  tree: Tree;
  path: string;
  content: string;
  schema: WorkspaceSchema;
  projectName: string;
  project: WorkspaceProject;

  constructor(tree: Tree, options: Options) {
    this.tree = tree;
    this.path = this.getPath();
    this.content = this.getContent();
    this.schema = this.getSchema();

    this.projectName = this.getProjectName(options);
    this.project = this.getProject();
  }

  getPath() {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(file => this.tree.exists(file))[0];
    return path;
  }

  getContent() {
    const configBuffer = this.tree.read(this.path);
    if (configBuffer === null) {
      throw new SchematicsException(`Could not find angular.json`);
    }
    return configBuffer.toString();
  }

  getSchema() {
    let schema: WorkspaceSchema;
    try {
      schema = (parseJson(this.content, JsonParseMode.Loose) as {}) as WorkspaceSchema;
    } catch (e) {
      throw new SchematicsException(`Could not parse angular.json: ` + e.message);
    }

    return schema;
  }

  getProjectName(options: Options) {
    let projectName = options.project;

    if (!projectName) {
      if (this.schema.defaultProject) {
        projectName = this.schema.defaultProject;
      } else {
        throw new SchematicsException('No project selected and no default project in the workspace');
      }
    }

    return projectName;
  }
  getProject() {
    const project = this.schema.projects[this.projectName];
    if (!project) {
      throw new SchematicsException('Project is not defined in this workspace');
    }

    if (project.projectType !== 'application') {
      throw new SchematicsException(`Deploy requires a project type of "application" in angular.json`);
    }

    if (
      !project.architect ||
      !project.architect.build ||
      !project.architect.build.options ||
      !project.architect.build.options.outputPath
    ) {
      throw new SchematicsException(
        `Cannot read the output path (architect.build.options.outputPath) of project "${this.projectName}" in angular.json`
      );
    }

    return project;
  }

  addDeployArchitect(config: any) {
    if (!this.project || !this.project.architect) {
      throw new SchematicsException('An error has occured during modification of angular.json');
    }
    this.project.architect['deploy'] = config;

    this.updateTree();
  }

  updateTree() {
    this.tree.overwrite(this.path, JSON.stringify(this.schema, null, 2));
  }
}
