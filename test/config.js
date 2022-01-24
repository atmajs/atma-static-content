module.exports = {
    suites: {
        'send tests': {
            exec: 'node',
            tests: 'test/send.spec.ts'
        },
        'virutal files': {
            exec: 'node',
            tests: 'test/virtual.spec.ts'
        },
        'examples': {
            exec: 'node',
            tests: 'test/examples.spec.ts'
        }
    }
};
