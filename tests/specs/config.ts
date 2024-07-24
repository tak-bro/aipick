import fs from 'fs/promises';
import path from 'path';

import { expect, testSuite } from 'manten';

import { createFixture } from '../utils.js';

export default testSuite(({ describe }) => {
    describe('config', async ({ test, describe }) => {
        const { fixture, aipick } = await createFixture();
        const configPath = path.join(fixture.path, '.aipick');
        const generateConfig = 'generate=3';

        await test('set config file', async () => {
            await aipick(['config', 'set', generateConfig]);

            const configFile = await fs.readFile(configPath, 'utf8');
            expect(configFile).toMatch(generateConfig);
        });

        await test('get config file', async () => {
            const { stdout } = await aipick(['config', 'get', 'generate']);
            expect(stdout).toBe(generateConfig);
        });

        await fixture.rm();
    });
});
