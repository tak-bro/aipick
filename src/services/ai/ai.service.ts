import { ReactiveListChoice } from 'inquirer-reactive-list-prompt';
import { Observable, of } from 'rxjs';

import { ModelConfig, ModelName } from '../../utils/config.js';
import { getFirstWordsFrom } from '../../utils/utils.js';

export interface AIResponse {
    title: string;
    value: string;
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

    protected sanitizeResponse(generatedText: string, ignoreBody: boolean): AIResponse[] {
        try {
            const title = `${getFirstWordsFrom(generatedText)}...`;
            const value = generatedText;
            return [{ title, value }];
        } catch (error) {
            return [];
        }
    }
}
