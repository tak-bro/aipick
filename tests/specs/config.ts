import fs from 'fs/promises';
import path from 'path';

import { expect, testSuite } from 'manten';

import { createFixture } from '../utils.js';

export default testSuite(({ describe }) => {
    describe('config', async ({ test, describe }) => {
        const { fixture, aipick } = await createFixture();
        const configPath = path.join(fixture.path, '.aipick');
        const openAiToken = 'OPENAI_KEY=sk-abc';

        test('set unknown config file', async () => {
            const { stderr } = await aipick(['config', 'set', 'UNKNOWN=1'], {
                reject: false,
            });

            expect(stderr).toMatch('Invalid config property: UNKNOWN');
        });

        test('set invalid OPENAI_KEY', async () => {
            const { stderr } = await aipick(['config', 'set', 'OPENAI_KEY=abc'], {
                reject: false,
            });

            expect(stderr).toMatch('Invalid config property OPENAI_KEY: Must start with "sk-"');
        });

        await test('set config file', async () => {
            await aipick(['config', 'set', openAiToken]);

            const configFile = await fs.readFile(configPath, 'utf8');
            expect(configFile).toMatch(openAiToken);
        });

        await test('get config file', async () => {
            const { stdout } = await aipick(['config', 'get', 'OPENAI_KEY']);
            expect(stdout).toBe(openAiToken);
        });

        await test('reading unknown config', async () => {
            await fs.appendFile(configPath, 'UNKNOWN=1');

            const { stdout, stderr } = await aipick(['config', 'get', 'UNKNOWN'], {
                reject: false,
            });

            expect(stdout).toBe('');
            expect(stderr).toBe('');
        });

        await describe('timeout', ({ test }) => {
            test('setting invalid timeout config', async () => {
                const { stderr } = await aipick(['config', 'set', 'timeout=abc'], {
                    reject: false,
                });

                expect(stderr).toMatch('Must be an integer');
            });

            test('setting valid timeout config', async () => {
                const timeout = 'timeout=20000';
                await aipick(['config', 'set', timeout]);

                const configFile = await fs.readFile(configPath, 'utf8');
                expect(configFile).toMatch(timeout);

                const get = await aipick(['config', 'get', 'timeout']);
                expect(get.stdout).toBe(timeout);
            });
        });

        await describe('max-length', ({ test }) => {
            test('must be an integer', async () => {
                const { stderr } = await aipick(['config', 'set', 'max-length=abc'], {
                    reject: false,
                });

                expect(stderr).toMatch('Must be an integer');
            });

            test('must be at least 20 characters', async () => {
                const { stderr } = await aipick(['config', 'set', 'max-length=10'], {
                    reject: false,
                });

                expect(stderr).toMatch(/must be greater than 20 characters/i);
            });

            test('updates config', async () => {
                const defaultConfig = await aipick(['config', 'get', 'max-length']);
                expect(defaultConfig.stdout).toBe('max-length=50');

                const maxLength = 'max-length=60';
                await aipick(['config', 'set', maxLength]);

                const configFile = await fs.readFile(configPath, 'utf8');
                expect(configFile).toMatch(maxLength);

                const get = await aipick(['config', 'get', 'max-length']);
                expect(get.stdout).toBe(maxLength);
            });
        });

        await test('set config file', async () => {
            await aipick(['config', 'set', openAiToken]);

            const configFile = await fs.readFile(configPath, 'utf8');
            expect(configFile).toMatch(openAiToken);
        });

        await test('get config file', async () => {
            const { stdout } = await aipick(['config', 'get', 'OPENAI_KEY']);
            expect(stdout).toBe(openAiToken);
        });

        await fixture.rm();
    });
});
