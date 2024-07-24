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

const defaultPrompt = (promptOptions: PromptOptions) => {
    // TODO: add something
    const { generate } = promptOptions;
    return [].filter(Boolean).join('\n');
};

const finalPrompt = (generate: number): string => {
    return [
        `Generate exactly ${generate} response${generate !== 1 ? 's' : ''} based on the user message.`,
        `Provide your response as a JSON array containing exactly ${generate} object${generate !== 1 ? 's' : ''}, each with "summary" and "description" keys.`,
        `The array must always contain ${generate} element${generate !== 1 ? 's' : ''}, no more and no less.`,
        `Example response format:
    [
      ${Array(generate)
          .fill(null)
          .map(
              (_, index) => `{
        "summary": "Brief summary of response ${index + 1}",
        "description": "Detailed description of response ${index + 1}"
      }`
          )
          .join(',\n      ')}
    ]`,
        `Ensure that the JSON array always contains exactly ${generate} element${generate !== 1 ? 's' : ''}, even if you need to provide similar or slightly varied responses to meet this requirement.`,
        `The "summary" should be a concise overview, while the "description" should provide more detailed information.`,
        `The response should be valid JSON that can be parsed without errors.`,
    ]
        .filter(Boolean)
        .join('\n');
};

export const generatePrompt = (promptOptions: PromptOptions) => {
    const { systemPrompt, systemPromptPath, generate } = promptOptions;
    if (systemPrompt) {
        return `${systemPrompt}\n${finalPrompt(generate)}`;
    }

    if (!systemPromptPath) {
        return `${finalPrompt(generate)}`;
    }

    try {
        const systemPromptTemplate = fs.readFileSync(path.resolve(systemPromptPath), 'utf-8');
        return `${parseTemplate(systemPromptTemplate, promptOptions)}\n${finalPrompt(generate)}`;
    } catch (error) {
        return `${finalPrompt(generate)}`;
    }
};
