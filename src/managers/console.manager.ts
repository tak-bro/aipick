import readline from 'readline';

import chalk from 'chalk';
import figlet from 'figlet';

export class ConsoleManager {
    private title = 'aipick';

    printTitle() {
        console.log(figlet.textSync(this.title, { font: 'Small' }));
    }

    printCopied() {
        console.log(`\n${chalk.bold.green('✔')} ${chalk.bold(`Successfully copied! Press 'Ctrl + V' to paste`)}`);
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
}
