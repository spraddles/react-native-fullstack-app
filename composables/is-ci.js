/*
 ** Note: this needs to be a commonJS file for Expo EAS purposes
 * so that it can run in the EAS CI
 */

function isEasCi() {
	if (process.env.EAS_BUILD_RUNNER === 'eas-build') {
		return true
	}
	if (process.env.CI === '1') {
		return true
	}
	if (process.env.ENV_FILE === 'local') {
		return false
	}
	if (process.env.EAS_BUILD_RUNNER === 'local-build-plugin') {
		return false
	}
	if (process.env.EAS_BUILD === 'true') {
		return true
	}
	return typeof process.env.ENV_FILE === 'undefined'
}

module.exports = { isEasCi }
