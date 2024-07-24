import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';
import { Observable, of } from 'rxjs';

import { ModelConfig, ModelName } from '../../utils/config.js';
import { DEFAULT_PROMPT_OPTIONS, PromptOptions, generatePrompt } from '../../utils/prompt.js';

export interface AIResponse {
    title: string;
    value: string;
}

export interface RawAIResponse {
    summary: string;
    description?: string;
}

export interface AIServiceParams {
    config: ModelConfig<ModelName>;
    userMessage: string;
    keyName: ModelName;
}

export interface AIServiceError extends Error {
    response?: any;
}

export interface Theme {
    primary: string;
    [key: string]: string;
}

export abstract class AIService {
    protected serviceName: string;
    protected errorPrefix: string;
    protected colors: Theme;

    protected constructor(params: AIServiceParams) {
        this.serviceName = 'AI';
        this.errorPrefix = 'ERROR';
        this.colors = {
            primary: '',
        };
    }

    abstract generateChoice$(): Observable<ReactiveListChoice>;

    protected buildPrompt(userMessage: string, generate: number, systemPromptPath: string) {
        const promptOption: PromptOptions = {
            ...DEFAULT_PROMPT_OPTIONS,
            userMessage,
            generate,
            systemPromptPath,
        };
        const defaultPrompt = generatePrompt(promptOption);
        return `${defaultPrompt}}\n${userMessage}`;
    }

    protected handleError$ = (error: AIServiceError): Observable<ReactiveListChoice> => {
        let simpleMessage = 'An error occurred';
        if (error.message) {
            simpleMessage = error.message;
        }
        return of({
            name: `${this.errorPrefix} ${simpleMessage}`,
            value: simpleMessage,
            isError: true,
            disabled: true,
        });
    };

    protected sanitizeResponse(generatedText: string, maxCount: number, ignoreBody: boolean): AIResponse[] {
        try {
            const rawResponses: RawAIResponse[] = JSON.parse(generatedText);
            const filtedResponses = rawResponses.map((data: RawAIResponse) => {
                if (ignoreBody) {
                    return {
                        title: `${data.summary}`,
                        value: `${data.description}`,
                    };
                }
                return {
                    title: `${data.summary}`,
                    value: `${data.summary}${data.description ? `\n\n${data.description}` : ''}`,
                };
            });

            if (filtedResponses.length > maxCount) {
                return filtedResponses.slice(0, maxCount);
            }
            return filtedResponses;
        } catch (error) {
            const jsonPattern = /\[[\s\S]*?\]/;
            try {
                const jsonMatch = generatedText.match(jsonPattern);
                if (!jsonMatch) {
                    // No valid JSON array found in the response
                    return [];
                }
                const jsonStr = jsonMatch[0];
                const rawResponses: RawAIResponse[] = JSON.parse(jsonStr);
                const filtedResponses = rawResponses.map((data: RawAIResponse) => {
                    if (ignoreBody) {
                        return {
                            title: `${data.summary}`,
                            value: `${data.summary}`,
                        };
                    }
                    return {
                        title: `${data.summary}`,
                        value: `${data.summary}${data.description ? `\n\n${data.description}` : ''}`,
                    };
                });

                if (filtedResponses.length > maxCount) {
                    return filtedResponses.slice(0, maxCount);
                }
                return filtedResponses;
            } catch (e) {
                // Error parsing JSON
                return [];
            }
        }
    }
}
