import chalk from 'chalk';
import inquirer from 'inquirer';
import ReactiveListPrompt, { ChoiceItem, ReactiveListChoice, ReactiveListLoader } from 'inquirer-reactive-list-prompt';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { sortByDisabled } from '../utils/utils.js';

const defaultLoader = {
    isLoading: false,
    startOption: {
        text: 'Generating responses',
    },
};

const emptyResponses = `No responses were generated`;

export class ReactivePromptManager {
    private choices$: BehaviorSubject<ChoiceItem[]> = new BehaviorSubject<ChoiceItem[]>([]);
    private loader$: BehaviorSubject<ReactiveListLoader> = new BehaviorSubject<ReactiveListLoader>(defaultLoader);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {}

    initPrompt(showDescription: boolean = true) {
        inquirer.registerPrompt('reactiveListPrompt', ReactiveListPrompt);
        return inquirer.prompt({
            type: 'reactiveListPrompt',
            name: 'aipickPrompt',
            message: 'Pick a response to copy: ',
            emptyMessage: `⚠ ${emptyResponses}`,
            loop: false,
            showDescription,
            descPageSize: 15,
            choices$: this.choices$,
            loader$: this.loader$,
            // @ts-ignore ignore
            pickKey: 'short',
        });
    }

    startLoader() {
        this.loader$.next({ isLoading: true });
    }

    refreshChoices(choice: ReactiveListChoice) {
        const { value, isError } = choice;
        if (!choice || !value) {
            return;
        }
        this.choices$.next([...this.currentChoices, choice].sort(sortByDisabled));
    }

    checkErrorOnChoices() {
        const isAllError = this.choices$
            .getValue()
            .map(choice => choice as ReactiveListChoice)
            .every(value => value?.isError || value?.disabled);

        if (isAllError) {
            this.alertNoGeneratedMessage();
            this.logEmptyCommitMessage();
            process.exit(1);
            return;
        }
        this.stopLoaderOnSuccess();
    }

    completeSubject() {
        this.choices$.complete();
        this.loader$.complete();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private alertNoGeneratedMessage() {
        this.loader$.next({
            isLoading: false,
            message: emptyResponses,
            stopOption: {
                doneFrame: '⚠', // '✖'
                color: 'yellow', // 'red'
            },
        });
    }

    private stopLoaderOnSuccess() {
        this.loader$.next({ isLoading: false, message: 'Responses generated' });
    }

    private logEmptyCommitMessage() {
        console.log(`${chalk.bold.yellow('⚠')} ${chalk.yellow(`${emptyResponses}`)}`);
    }

    private get currentChoices(): ReactiveListChoice[] {
        return this.choices$.getValue().map(origin => origin as ReactiveListChoice);
    }
}
