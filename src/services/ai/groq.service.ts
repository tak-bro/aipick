import chalk from 'chalk';
import Groq from 'groq-sdk';
import { GroqError } from 'groq-sdk/error';
import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';
import { Observable, catchError, concatMap, from, map, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { AIResponse, AIService, AIServiceParams } from './ai.service.js';
import { createLogResponse } from '../../utils/log.js';
import { DEFAULT_PROMPT_OPTIONS, PromptOptions, generatePrompt } from '../../utils/prompt.js';

export class GroqService extends AIService {
    private groq: Groq;

    constructor(private readonly params: AIServiceParams) {
        super(params);
        this.colors = {
            primary: '#f55036',
            secondary: '#fff',
        };
        this.serviceName = chalk.bgHex(this.colors.primary).hex(this.colors.secondary).bold('[Groq]');
        this.errorPrefix = chalk.red.bold(`[Groq]`);
        this.groq = new Groq({ apiKey: this.params.config.key });
    }

    generateChoice$(): Observable<ReactiveListChoice> {
        return fromPromise(this.generateResponses()).pipe(
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

    private async generateResponses(): Promise<AIResponse[]> {
        try {
            const userMessage = this.params.userMessage;
            const { generate, systemPrompt, systemPromptPath, logging, temperature } = this.params.config;
            const maxTokens = this.params.config['max-tokens'];
            const promptOptions: PromptOptions = {
                ...DEFAULT_PROMPT_OPTIONS,
                generate,
                userMessage,
                systemPrompt,
                systemPromptPath,
            };
            const generatedSystemPrompt = generatePrompt(promptOptions);

            const chatCompletion = await this.groq.chat.completions.create(
                {
                    messages: [
                        {
                            role: 'system',
                            content: generatedSystemPrompt,
                        },
                        {
                            role: 'user',
                            content: userMessage,
                        },
                    ],
                    model: this.params.config.model,
                    max_tokens: maxTokens,
                    temperature,
                },
                {
                    timeout: this.params.config.timeout,
                }
            );

            const result = chatCompletion.choices[0].message.content || '';
            logging && createLogResponse('Groq', userMessage, generatedSystemPrompt, result);
            return this.sanitizeResponse(result, generate, this.params.config.ignoreBody);
        } catch (error) {
            throw error as any;
        }
    }

    handleError$ = (error: GroqError) => {
        let simpleMessage = 'An error occurred';
        const regex = /"message":\s*"([^"]*)"/;
        const match = error.message.match(regex);
        if (match && match[1]) {
            simpleMessage = match[1];
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const message = `${error['status']} ${simpleMessage}`;
        return of({
            name: `${this.errorPrefix} ${message}`,
            value: simpleMessage,
            isError: true,
            disabled: true,
        });
    };
}
