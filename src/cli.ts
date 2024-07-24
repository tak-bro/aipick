import { cli } from 'cleye';

import aipick from './commands/aipick.js';
import configCommand from './commands/config.js';
import logCommand from './commands/log.js';
import { description, version } from '../package.json';

const rawArgv = process.argv.slice(2);

cli(
    {
        name: 'aipick',
        version,
        flags: {
            message: {
                type: String,
                description: 'Message to ask to AI',
                alias: 'm',
            },
            systemPrompt: {
                type: String,
                description: 'System prompt to let users fine-tune prompt',
                alias: 's',
            },
        },

        commands: [configCommand, logCommand],

        help: {
            description,
        },

        ignoreArgv: type => type === 'unknown-flag' || type === 'argument',
    },
    argv => {
        aipick(argv.flags.message, argv.flags.systemPrompt, rawArgv);
    },
    rawArgv
);
