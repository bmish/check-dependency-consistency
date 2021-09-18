import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { getDirectoriesInPath } from './fs.js';
import type { PackageJson } from 'type-fest';

export function getPackageJsonPaths(
  root: string,
  ignorePackage: string[]
): string[] {
  const packages = getPackages(root);

  ignorePackage?.forEach((ignoredPackage) => {
    if (!packages.includes(ignoredPackage)) {
      throw new Error(
        `Specified option '--ignore-package ${ignoredPackage}', but no such package detected.`
      );
    }
  });

  return packages
    .filter((pkg) => !ignorePackage || !ignorePackage.includes(pkg))
    .map((pkg: string) => join(root, pkg, 'package.json'));
}

function getPackages(root: string): string[] {
  return getWorkspaces(root).flatMap((packageLocation: string) => {
    if (packageLocation.includes('*')) {
      const packageLocationWithoutStar = packageLocation.replace('*', '');
      return getDirectoriesInPath(join(root, packageLocationWithoutStar)).map(
        (pkg) => join(packageLocationWithoutStar, pkg)
      );
    } else {
      return packageLocation;
    }
  });
}

export function getWorkspaces(root: string): string[] {
  const workspacePackageJsonPath = join(root, 'package.json');
  if (!existsSync(workspacePackageJsonPath)) {
    throw new Error('No package.json found at provided path.');
  }

  const workspacePackageJson: PackageJson = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf-8')
  );

  if (!workspacePackageJson.workspaces) {
    throw new Error(
      'package.json at provided path does not specify `workspaces`.'
    );
  }

  if (!Array.isArray(workspacePackageJson.workspaces)) {
    throw new TypeError('package.json `workspaces` is not a string array.');
  }

  return workspacePackageJson.workspaces;
}
