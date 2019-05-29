# jest-environment-detox

## Pitch & Anti-pitch

- Inspired by [jest-environment-puppeteer](https://github.com/smooth-code/jest-puppeteer/tree/master/packages/jest-environment-puppeteer) implementation
- Allow a detox server to be shared between multiple test suites
- Make sure app is not reinstalled between test suites (Fixes [#1331](https://github.com/wix/Detox/issues/1279) and [#1331](https://github.com/wix/Detox/issues/1331))
- **Anti-pitch**: Uses detox & jest private APIs
- **Anti-pitch**: Somewhat opionated


## Usage

1. Add dependency

	```
	yarn add -D jest-environment-detox
	```

1. Update your Jest configuration:

	```json
	{
	  "globalSetup": "jest-environment-detox/setup",
	  "globalTeardown": "jest-environment-detox/teardown"
	}
	```

1. Update your `detox.init` call

	```js
	// ./jest/setup.js
		
	import { getDetoxSession } from 'jest-environment-detox';
	  
	const config = require('../package.json').detox;
	
	beforeAll(async () => {
		await detox.init({
			...config,
			session: getDetoxSession(process.env.JEST_WORKER_ID),
		}, {
			launchApp: false,
			reuse: true,
		});
	});
	 	 
	```
