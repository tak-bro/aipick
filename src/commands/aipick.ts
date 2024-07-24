import fs from 'fs';
import path from 'path';

import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';

import { AIRequestManager } from '../managers/ai-request.manager.js';
import { ConsoleManager } from '../managers/console.manager.js';
import { ReactivePromptManager } from '../managers/reactive-prompt.manager.js';
import { ModelName, RawConfig, getConfig, modelNames } from '../utils/config.js';
import { KnownError, handleCliError } from '../utils/error.js';

const consoleManager = new ConsoleManager();

export default async (generate: number | undefined, message: string | undefined, systemPrompt: string | undefined, rawArgv: string[]) =>
    (async () => {
        consoleManager.printTitle();

        if (!message) {
            throw new KnownError('No messages found. Please type your message through the `-m` option.');
        }

        const config = await getConfig(
            {
                generate: generate as number,
                systemPrompt: systemPrompt?.toString() as string,
            },
            rawArgv
        );

        if (config.systemPromptPath) {
            try {
                fs.readFileSync(path.resolve(config.systemPromptPath), 'utf-8');
            } catch (error) {
                throw new KnownError(`Error reading system prompt file: ${config.systemPromptPath}`);
            }
        }

        const availableAIs: ModelName[] = Object.entries(config)
            .filter(([key]) => modelNames.includes(key as ModelName))
            .map(([key, value]) => [key, value] as [ModelName, RawConfig])
            .filter(([key, value]) => {
                if (key === 'OLLAMA') {
                    return !!value && !!value.model && (value.model as string[]).length > 0;
                }
                if (key === 'HUGGINGFACE') {
                    return !!value && !!value.cookie;
                }
                // @ts-ignore ignore
                return !!value.key && value.key.length > 0;
            })
            .map(([key]) => key);

        const hasNoAvailableAIs = availableAIs.length === 0;
        if (hasNoAvailableAIs) {
            throw new KnownError('Please set at least one API key via the `aipick config set` command');
        }

        const aiRequestManager = new AIRequestManager(config, message);
        const reactivePromptManager = new ReactivePromptManager();
        const selectPrompt = reactivePromptManager.initPrompt(!config.ignoreBody);

        reactivePromptManager.startLoader();
        const subscription = aiRequestManager.createAIRequests$(availableAIs).subscribe(
            (choice: ReactiveListChoice) => reactivePromptManager.refreshChoices(choice),
            () => {
                /* empty */
            },
            () => reactivePromptManager.checkErrorOnChoices()
        );
        const answer = await selectPrompt;
        subscription.unsubscribe();
        reactivePromptManager.completeSubject();

        // NOTE: reactiveListPrompt has 2 blank lines
        consoleManager.moveCursorUp();

        const chosenMessage = answer.aipickPrompt?.value;
        if (!chosenMessage) {
            throw new KnownError('An error occurred! No selected message');
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ncp = require('copy-paste');
        ncp.copy(chosenMessage);
        consoleManager.printCopied();
        process.exit();
    })().catch(error => {
        consoleManager.printErrorMessage(error.message);
        handleCliError(error);
        process.exit(1);
    });
