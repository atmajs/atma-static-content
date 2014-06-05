module.exports = {
	suites: {
		'send tests': {
			exec: 'node',
			tests: 'test/send.test'
		},
		'examples': {
			exec: 'node',
			tests: 'test/examples.test'
		}
	}
};