import path from 'path';

import { type Options, execaNode } from 'execa';
import { type FileTree, type FsFixture, createFixture as createFixtureBase } from 'fs-fixture';

const aipickPath = path.resolve('./dist/cli.mjs');

const createAipick = (fixture: FsFixture) => {
    const homeEnv = {
        HOME: fixture.path, // Linux
        USERPROFILE: fixture.path, // Windows
    };

    return (args?: string[], options?: Options) =>
        execaNode(aipickPath, args, {
            cwd: fixture.path,
            ...options,
            extendEnv: false,
            env: {
                ...homeEnv,
                ...options?.env,
            },

            // Block tsx nodeOptions
            nodeOptions: [],
        });
};

export const createFixture = async (source?: string | FileTree) => {
    const fixture = await createFixtureBase(source);
    const aipick = createAipick(fixture);

    return {
        fixture,
        aipick,
    };
};

export const files = Object.freeze({
    '.aipick': `generate=${process.env.generate}`,
    'data.json': Array.from({ length: 10 }, (_, i) => `${i}. Lorem ipsum dolor sit amet`).join('\n'),
});
