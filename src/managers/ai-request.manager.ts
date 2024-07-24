import chalk from 'chalk';
import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';
import { Observable, catchError, from, mergeMap, of } from 'rxjs';

import { AIServiceFactory } from '../services/ai/ai-service.factory.js';
import { AnthropicService } from '../services/ai/anthropic.service.js';
import { CodestralService } from '../services/ai/codestral.service.js';
import { CohereService } from '../services/ai/cohere.service.js';
import { GeminiService } from '../services/ai/gemini.service.js';
import { GroqService } from '../services/ai/groq.service.js';
import { HuggingFaceService } from '../services/ai/hugging-face.service.js';
import { MistralService } from '../services/ai/mistral.service.js';
import { OllamaService } from '../services/ai/ollama.service.js';
import { OpenAIService } from '../services/ai/openai.service.js';
import { ModelName, ValidConfig } from '../utils/config.js';

export class AIRequestManager {
    constructor(
        private readonly config: ValidConfig,
        private readonly userMessage: string
    ) {}

    createAIRequests$(modelNames: ModelName[]): Observable<ReactiveListChoice> {
        return from(modelNames).pipe(
            mergeMap(ai => {
                switch (ai) {
                    case 'OPENAI':
                        return AIServiceFactory.create(OpenAIService, {
                            config: this.config.OPENAI,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'GEMINI':
                        return AIServiceFactory.create(GeminiService, {
                            config: this.config.GEMINI,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'ANTHROPIC':
                        return AIServiceFactory.create(AnthropicService, {
                            config: this.config.ANTHROPIC,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'HUGGINGFACE':
                        return AIServiceFactory.create(HuggingFaceService, {
                            config: this.config.HUGGINGFACE,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'MISTRAL':
                        return AIServiceFactory.create(MistralService, {
                            config: this.config.MISTRAL,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'CODESTRAL':
                        return AIServiceFactory.create(CodestralService, {
                            config: this.config.CODESTRAL,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'OLLAMA':
                        return from(this.config.OLLAMA.model).pipe(
                            mergeMap(model => {
                                return AIServiceFactory.create(OllamaService, {
                                    config: this.config.OLLAMA,
                                    keyName: model as ModelName,
                                    userMessage: this.userMessage,
                                }).generateChoice$();
                            })
                        );
                    case 'COHERE':
                        return AIServiceFactory.create(CohereService, {
                            config: this.config.COHERE,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    case 'GROQ':
                        return AIServiceFactory.create(GroqService, {
                            config: this.config.GROQ,
                            userMessage: this.userMessage,
                            keyName: ai,
                        }).generateChoice$();
                    default:
                        const prefixError = chalk.red.bold(`[${ai}]`);
                        return of({
                            name: prefixError + ' Invalid AI type',
                            value: 'Invalid AI type',
                            isError: true,
                            disabled: true,
                        });
                }
            }),
            catchError(err => {
                const prefixError = chalk.red.bold(`[UNKNOWN]`);
                return of({
                    name: prefixError + ` ${err.message || ''}`,
                    value: 'Unknown error',
                    isError: true,
                    disabled: true,
                });
            })
        );
    }
}
