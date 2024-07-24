import fs from 'fs';
import path from 'path';

export interface PromptOptions {
    generate: number;
    userMessage: string;
    systemPromptPath?: string;
    systemPrompt?: string;
}

export const DEFAULT_PROMPT_OPTIONS: PromptOptions = {
    generate: 1,
    userMessage: '',
    systemPrompt: '',
    systemPromptPath: '',
};

const parseTemplate = (template: string, options: PromptOptions): string => {
    return template.replace(/{(\w+)}/g, (_, key) => {
        return (
            options[key as keyof PromptOptions]?.toString() || (DEFAULT_PROMPT_OPTIONS[key as keyof PromptOptions]?.toString() as string)
        );
    });
};

const finalPrompt = (): string => {
    // TODO: add something
    return [].filter(Boolean).join('\n');
};

export const generatePrompt = (promptOptions: PromptOptions) => {
    const { systemPrompt, systemPromptPath } = promptOptions;
    if (systemPrompt) {
        return `${systemPrompt}\n${finalPrompt()}`;
    }

    if (!systemPromptPath) {
        return `${finalPrompt()}`;
    }

    try {
        const systemPromptTemplate = fs.readFileSync(path.resolve(systemPromptPath), 'utf-8');
        return `${parseTemplate(systemPromptTemplate, promptOptions)}\n${finalPrompt()}`;
    } catch (error) {
        return `${finalPrompt()}`;
    }
};
