/* eslint-disable no-console */
import fs from 'fs';
import chalk from 'chalk';
import Detox from 'detox/src/Detox'; // eslint-disable-line
import argparse from 'detox/src/utils/argparse'; // eslint-disable-line
import environment from 'detox/src/utils/environment'; // eslint-disable-line
import * as utils from './utils';

let detoxes = [];

export const setup = async () => {
  const workers = argparse.getArgValue('workers')
    || argparse.getArgValue('maxWorkers')
    || 1;

  const configuration = argparse.getArgValue('configuration');
  const configurations = await utils.readDetoxConfigurations();
  const deviceConfig = configurations[configuration];

  console.log('');
  console.error(chalk.yellow(`> Setting up ${workers} detox servers`));

  for (let i = 0; i < workers; i += 1) {
    // HACK: Use private API to launch multiple instance of detox servers
    const detox = new Detox({ deviceConfig });

    await detox.init({ launchApp: false }); // eslint-disable-line
    detoxes[i] = detox;

    // HACK: Read generated session config from private APIs
    const sessionConfig = detox.device._sessionConfig;

    // HACK: Export session config
    const jestWorkerId = i + 1; // JEST_WORKER_ID starts from 1 instead of 0
    process.env[`DETOX_${jestWorkerId}_SERVER`] = sessionConfig.server;
    process.env[`DETOX_${jestWorkerId}_SESSION_ID`] = sessionConfig.sessionId;
  }

  // HACK: Clear lockfile and mark all launched simulator as idle'));
  const lockFilePath = environment.getDeviceLockFilePath();
  fs.writeFileSync(lockFilePath, '[]');
};

export const teardown = async () => {
  console.log('');
  console.error(chalk.yellow('> Global teardown'));

  for (let i = 0; i < detoxes.length; i += 1) {
    await detoxes[i].cleanup(); // eslint-disable-line
  }

  detoxes = null;
};
