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
	  "globalTeardown": "jest-environment-detox/teardown",
	  "testEnvironment": "jest-environment-detox"
	}
	```

1. Remove `detox.init` and `detox.cleanup` calls from your specs

	```js
	// By default ./jest/setup.js

	 beforeAll(async () => {
	   await detox.init(config); // <-- Remove this
	 });
	 	 
	 afterAll(async () => {
	   await adapter.afterAll(); // <-- Remove this
	   await detox.cleanup();
	 });
	```

