import readline from 'readline';

import chalk from 'chalk';
import figlet from 'figlet';
import ora, { Ora } from 'ora';

export class ConsoleManager {
    private title = 'aipick';

    printTitle() {
        console.log(figlet.textSync(this.title, { font: 'Small' }));
    }

    displaySpinner(text: string): Ora {
        return ora(text).start();
    }

    stopSpinner(spinner: Ora) {
        spinner.stop();
        spinner.clear();
    }

    printAnalyzed() {
        console.log(`\n${chalk.bold.green('✔')} ${chalk.bold(`Changes analyzed`)}`);
    }

    printCommitted() {
        console.log(`\n${chalk.bold.green('✔')} ${chalk.bold(`Successfully committed!`)}`);
    }

    printCopied() {
        console.log(`\n${chalk.bold.green('✔')} ${chalk.bold(`Successfully copied! Press 'Ctrl + V' to paste`)}`);
    }

    printSavedCommitMessage() {
        console.log(`\n${chalk.bold.green('✔')} ${chalk.bold(`Saved commit message`)}`);
    }

    printCancelledCopied() {
        console.log(`\n${chalk.bold.yellow('⚠')} ${chalk.yellow('Copy cancelled')}`);
    }

    printErrorMessage(message: string) {
        console.log(`\n${chalk.bold.red('✖')} ${chalk.red(`${message}`)}`);
    }

    moveCursorUp() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.moveCursor(process.stdout, 0, -1);
        rl.close();
    }

    moveCursorDown() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.moveCursor(process.stdout, 0, 1);
        rl.close();
    }
}
