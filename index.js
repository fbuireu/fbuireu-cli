#!/usr/bin/env node

import fs from 'fs';
import { select, confirm } from '@inquirer/prompts';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'node:path';
import * as os from 'node:os';

const writeFileAsync = promisify(fs.writeFile);

function intro(msg) {
  console.log(chalk.bold(`\n  ${msg}\n`));
}

function outro(msg) {
  console.log(chalk.bold(`\n  ${msg}\n`));
}

function cancel(msg) {
  console.log(chalk.red(`\n  ${msg}\n`));
}

function note(msg, title) {
  console.log(`\n  ${chalk.bold(title)}\n  ${msg}\n`);
}

async function main() {
  console.clear();
  intro(chalk.underline('Welcome to my CLI Portfolio'));

  const mainMenuChoices = [
    { value: '1', name: 'I want to know more about you' },
    { value: '2', name: 'I want to know your recent experience' },
    { value: '3', name: 'Download my CV/Resume' },
    { value: '4', name: 'WTF is this? I want to leave', description: 'hello darkness my old friend...' },
  ];

  let mainMenuResponse;
  do {
    try {
      mainMenuResponse = await select({
        message: 'Please select your option',
        choices: mainMenuChoices,
      });
    } catch {
      cancel('Operation cancelled. Ciaoo ciao ciao ciao');
      process.exit(0);
    }

    switch (mainMenuResponse) {
      case '1':
        await showAboutYouSubMenu();
        break;
      case '2':
        await showExperienceSubMenu();
        break;
      case '3':
        await downloadCV();
        break;
      case '4': {
        const exitOption = await confirmExit();
        if (exitOption === 'mainMenu') {
          continue;
        }
        return process.exit(0);
      }
      default:
        break;
    }
  } while (true);
}

async function showAboutYouSubMenu() {
  const choices = [
    { value: '1', name: 'Tell me about your hobbies and interests' },
    { value: '2', name: 'Share some personal anecdotes' },
    { value: '0', name: 'Go back to main menu' },
  ];

  let response;
  do {
    try {
      response = await select({
        message: 'Please select your option',
        choices,
      });
    } catch {
      cancel('Operation cancelled. Ciaoo ciao ciao ciao');
      process.exit(0);
    }

    switch (response) {
      case '1':
        console.log('Hobbies and interests: TODO');
        break;
      case '2':
        console.log('Personal anecdotes: TODO');
        break;
      case '0':
        return;
      default:
        break;
    }
  } while (true);
}

async function showExperienceSubMenu() {
  const choices = [
    { value: '1', name: 'List your recent work experiences' },
    { value: '2', name: 'Highlight your skills and achievements' },
    { value: '0', name: 'Go back to main menu' },
  ];

  let response;
  do {
    try {
      response = await select({
        message: 'Please select your option',
        choices,
      });
    } catch {
      cancel('Operation cancelled. Ciaoo ciao ciao ciao');
      process.exit(0);
    }

    switch (response) {
      case '1':
        console.log('Recent work experiences: TODO');
        break;
      case '2':
        console.log('Skills and achievements: TODO');
        break;
      case '0':
        return;
      default:
        break;
    }
  } while (true);
}

async function downloadCV() {
  const spinner = ora('Downloading CV').start();
  try {
    const response = await fetch('https://github.com/fbuireu/fbuireu/blob/main/assets/pdf/CV-English.pdf');
    const arrayBuffer = await response.arrayBuffer();
    const timestamp = Date.now();
    const filename = `Ferran_Buireu_CV_${timestamp}.pdf`;
    const isWindows = process.platform === 'win32';
    const folder = isWindows ? path.join(process.env.USERPROFILE, 'Downloads') : path.join(os.homedir(), 'Downloads');
    const filePath = path.join(folder, filename);

    await writeFileAsync(filePath, Buffer.from(arrayBuffer));
    spinner.succeed(chalk.green('CV downloaded successfully'));
    note(`Look at ${filePath}`, '👀');
  } catch (error) {
    spinner.fail(chalk.red(`Error downloading CV: ${error.message}`));
  }
}

async function confirmExit() {
  try {
    const shouldContinue = await confirm({
      message: 'Do you want to continue?',
    });

    if (!shouldContinue) {
      const exitOption = await select({
        message: 'Ok, you are driving me crazy. What do you want to do?',
        choices: [
          { value: 'mainMenu', name: 'Return to main menu' },
          { value: 'exit', name: 'Exit' },
        ],
        default: 'mainMenu',
      });

      if (exitOption === 'mainMenu') {
        return 'mainMenu';
      } else if (exitOption === 'exit') {
        cancel('Goodbye! See you next time!\n See you');
        outro("It's been a pleasure");
        process.exit(0);
      }
    }
  } catch {
    cancel('Operation cancelled. Ciaoo ciao ciao ciao');
    process.exit(0);
  }
}

main().catch(console.error);


/* todo: finish content
*   refactor (isolate)
*   add title
*   add language support (add specific JSONs)
*   add game
*    - https://github.com/polltery/node-cli-game-example -- https://github.com/polltery/node-cli-game-example/issues/19
*   add build/release system (based on tags, etc)
*   add scripts package.json
*   add readme, license, bug
*   add tests (node:assert)
*   add renovate + automated PRs
*   migrate to TS and check drawbacks (rollup?, dist folder, package.json, caveats, etc)
*  */
