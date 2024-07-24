import chalk from 'chalk';
import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';
import { Observable, catchError, concatMap, from, map, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { AIResponse, AIService, AIServiceError, AIServiceParams } from './ai.service.js';
import { generateMessage } from '../../utils/openai.js';
import { DEFAULT_PROMPT_OPTIONS, PromptOptions, generatePrompt } from '../../utils/prompt.js';

export class OpenAIService extends AIService {
    constructor(private readonly params: AIServiceParams) {
        super(params);
        this.colors = {
            primary: '#74AA9C',
            secondary: '#FFF',
        };
        this.serviceName = chalk.bgHex(this.colors.primary).hex(this.colors.secondary).bold(`[ChatGPT]`);
        this.errorPrefix = chalk.red.bold(`[ChatGPT]`);
    }

    generateChoice$(): Observable<ReactiveListChoice> {
        return fromPromise(this.generateMessages()).pipe(
            concatMap(messages => from(messages)),
            map(data => ({
                name: `${this.serviceName} ${data.title}`,
                value: data.value,
                description: data.value,
                isError: false,
            })),
            catchError(this.handleError$)
        );
    }

    handleError$ = (error: AIServiceError) => {
        let simpleMessage = 'An error occurred';
        if (error.message) {
            simpleMessage = error.message.split('\n')[0];
            const errorJson = this.extractJSONFromError(error.message);
            simpleMessage += `: ${errorJson.error.message}`;
        }
        return of({
            name: `${this.errorPrefix} ${simpleMessage}`,
            value: simpleMessage,
            isError: true,
            disabled: true,
        });
    };

    private extractJSONFromError(error: string) {
        const regex = /[{[]{1}([,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
        const matches = error.match(regex);
        if (matches) {
            return Object.assign({}, ...matches.map((m: any) => JSON.parse(m)));
        }
        return {
            error: {
                message: 'Unknown error',
            },
        };
    }

    private async generateMessages(): Promise<AIResponse[]> {
        const userMessage = this.params.userMessage;
        const { generate, systemPrompt, systemPromptPath, logging, temperature } = this.params.config;
        const promptOptions: PromptOptions = {
            ...DEFAULT_PROMPT_OPTIONS,
            generate,
            userMessage,
            systemPrompt,
            systemPromptPath,
        };
        const generatedSystemPrompt = generatePrompt(promptOptions);

        const response = await generateMessage(
            this.params.config.url,
            this.params.config.path,
            this.params.config.key,
            this.params.config.model,
            this.params.config.timeout,
            this.params.config['max-tokens'],
            this.params.config.temperature,
            userMessage,
            generatedSystemPrompt,
            this.params.config.logging,
            this.params.config.proxy
        );

        return this.sanitizeResponse(response, generate, this.params.config.ignoreBody);
    }
}
