/* eslint-disable no-console */
import NodeEnvironment from 'jest-environment-node' // eslint-disable-line
import detox from 'detox'; // eslint-disable-line
import chalk from 'chalk';
import * as utils from './utils';

export default class DetoxEnvironment extends NodeEnvironment {
  async setup() {
    this._workerId = process.env.JEST_WORKER_ID;

    // HACK: Use exported session config to launch detox for this test suite
    const session = {
      server: process.env[`DETOX_${this._workerId}_SERVER`],
      sessionId: process.env[`DETOX_${this._workerId}_SESSION_ID`],
    };

    console.log('');
    console.error(chalk.yellow(`> Setting up detox-server#${this._workerId}\nsession: ${JSON.stringify(session)}`));

    const configurations = await utils.readDetoxConfigurations();
    await detox.init({
      configurations,
      session,
    }, {
      launchApp: false,
      reuse: true,
    });

    // Export detox globals
    this.global.detox = global.detox;
    this.global.device = global.device;
    this.global.element = global.element;
    this.global.expect = global.expect;
    this.global.waitFor = global.waitFor;
    this.global.by = global.by;
  }

  async teardown() {
    console.log('');
    console.error(chalk.yellow(`> Tearing down detox-server#${this._workerId}`));

    await detox.cleanup();
  }
}
