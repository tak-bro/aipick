import { describe } from 'manten';

describe('aipick', ({ runTestSuite }) => {
    runTestSuite(import('./specs/cli/index.js'));
    runTestSuite(import('./specs/openai/index.js'));
    runTestSuite(import('./specs/config.js'));
    runTestSuite(import('./specs/git-hook.js'));
});
