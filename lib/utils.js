import fs from 'fs';
import path from 'path';

export const readDetoxConfigurations = async () => {
  const packageJSONPath = path.resolve(process.cwd(), 'package.json');
  const packageJSONContent = JSON.parse(fs.readFileSync(packageJSONPath, { encoding: 'utf-8' }));
  return packageJSONContent.detox.configurations;
};

export const getDetoxSession = (jestWorkerId) => {
  return {
    server: process.env[`DETOX_${jestWorkerId}_SERVER`],
    sessionId: process.env[`DETOX_${jestWorkerId}_SESSION_ID`],
  };
};
