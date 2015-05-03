module.exports = {
	suites: {
		'send tests': {
			exec: 'node',
			tests: 'test/send.test'
		},
		'virutal files': {
			exec: 'node',
			tests: 'test/virtual.test'
		},
		'examples': {
			exec: 'node',
			tests: 'test/examples.test'
		}
	}
};