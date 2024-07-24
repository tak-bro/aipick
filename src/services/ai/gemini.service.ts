import { GoogleGenerativeAI } from '@google/generative-ai';
import chalk from 'chalk';
import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';
import { Observable, catchError, concatMap, from, map, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { AIResponse, AIService, AIServiceError, AIServiceParams } from './ai.service.js';
import { KnownError } from '../../utils/error.js';
import { createLogResponse } from '../../utils/log.js';
import { DEFAULT_PROMPT_OPTIONS, PromptOptions, generatePrompt } from '../../utils/prompt.js';

export class GeminiService extends AIService {
    private genAI: GoogleGenerativeAI;

    constructor(private readonly params: AIServiceParams) {
        super(params);
        this.colors = {
            primary: '#0077FF',
            secondary: '#fff',
        };
        this.serviceName = chalk.bgHex(this.colors.primary).hex(this.colors.secondary).bold('[Gemini]');
        this.errorPrefix = chalk.red.bold(`[Gemini]`);
        this.genAI = new GoogleGenerativeAI(this.params.config.key);
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

            const model = this.genAI.getGenerativeModel({
                model: this.params.config.model,
                systemInstruction: generatedSystemPrompt,
                generationConfig: {
                    maxOutputTokens: maxTokens,
                    temperature: this.params.config.temperature,
                },
            });
            const result = await model.generateContent(userMessage);
            const response = await result.response;
            const completion = response.text();

            logging && createLogResponse('Gemini', userMessage, generatedSystemPrompt, completion);
            return this.sanitizeResponse(completion, generate, this.params.config.ignoreBody);
        } catch (error) {
            const errorAsAny = error as any;
            if (errorAsAny.code === 'ENOTFOUND') {
                throw new KnownError(`Error connecting to ${errorAsAny.hostname} (${errorAsAny.syscall})`);
            }
            throw errorAsAny;
        }
    }

    handleError$ = (geminiError: AIServiceError) => {
        const geminiErrorMessage = geminiError.message || geminiError.toString();
        const regex = /(\[.*?\]\s*[^[]*)/g;
        const matches = [...geminiErrorMessage.matchAll(regex)];
        const result: string[] = [];
        matches.forEach(match => result.push(match[1]));

        const message = result[1] || 'An error occurred';
        return of({
            name: `${this.errorPrefix} ${message}`,
            value: message,
            isError: true,
            disabled: true,
        });
    };
}
