/* eslint-disable import/no-extraneous-dependencies */
import { exec } from 'child_process';
import Listr from 'listr';
import fs from 'fs';
import fse from 'fs-extra';
import moment from 'moment';
import archiver from 'archiver';
import packageJson from './package.json';

const PATH_SRC = './src';
const PATH_DIST = './dist';
const PATH_ARCHIVE = './archive';


function clean(dir) {
  fse.removeSync(dir);
}

function createDistFolder(dir) {
  fse.ensureDirSync(dir);
}

function compileScript(src, dist) {
  return new Promise((resolve) => {
    exec(`npx babel ${src} --out-dir ${dist} --extensions ".ts,.js"`, (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

function createPackageJson(basePackage) {
  const builtPackageJson = {
    name: basePackage.name,
    version: basePackage.version,
    dependencies: basePackage.dependencies,
    scripts: {
      start: 'whoami && ls -al /tmp && npm install && node index.js',
    },
  };
  fse.writeJsonSync(`${PATH_DIST}/package.json`, builtPackageJson, {
    spaces: 2,
  });
}

function createZip(src, dir, file) {
  fse.ensureDirSync(dir);
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${dir}/${file}`);
    const archive = archiver('zip');

    output.on('end', () => {
      console.log('output end');
      resolve();
    });

    archive.on('error', (err) => {
      console.log('archive error');
      reject(err);
    });

    archive.on('end', () => {
      console.log('archive end');
      resolve();
    });

    archive.pipe(output);
    archive.directory(src, false);
    archive.finalize();
  });
}

function getCurrentBranch() {
  return new Promise((resolve) => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
      if (err) throw err;
      resolve(stdout.replace(/[\n\r]+/g, '').replace(/\//g, '.'));
    });
  });
}

function getArchiveName(version, branch) {
  return `api-${branch}-${version}-${moment().format('YYYYMMDDHHmm')}.zip`;
}

let archiveFilename;
const tasks = new Listr([
  {
    title: 'Cleaning.',
    task: () => clean(PATH_DIST),
  },
  {
    title: 'Create dist folder',
    task: () => createDistFolder(PATH_DIST),
  },
  {
    title: 'Compile source',
    task: () => compileScript(PATH_SRC, PATH_DIST),
  },
  {
    title: 'Create package.json',
    task: () => createPackageJson(packageJson),
  },
  {
    title: 'Create zip file.',
    task: async () => {
      archiveFilename = await getArchiveName(
        packageJson.version,
        await getCurrentBranch(),
      );
      return createZip(PATH_DIST, PATH_ARCHIVE, archiveFilename);
    },
  },
]);

tasks.run().then(() => {
  console.log('Build done.');
  console.log(`${archiveFilename} is generated.`);
}).catch((err) => {
  console.log('Build failed.');
  console.error(err);
});
