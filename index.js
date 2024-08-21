#!/usr/bin/env node

import fs from 'fs';
import {
  intro,
  outro,
  confirm,
  select,
  spinner as showSpinner,
  isCancel,
  cancel,
  text,
    note
} from '@clack/prompts';
import { promisify } from 'util';
import color from 'picocolors';
import * as path from 'node:path';
import * as os from 'node:os';

const writeFileAsync = promisify(fs.writeFile);

async function main() {
  console.clear()
  intro(color.underline('Welcome to my CLI Portfolio'));

  const mainMenuOptions = [
    { value: '1', label: 'I want to know more about you' },
    { value: '2', label: 'I want to know your recent experience' },
    { value: '3', label: 'Download my CV/Resume' },
    { value: '4', label: 'WTF is this? I want to leave', hint: 'hello darkness my old friend...' },
  ];

  let mainMenuResponse;
  do {
    mainMenuResponse = await select({
      message: 'Please select your option',
      options: mainMenuOptions,
    });

    if (isCancel(mainMenuResponse)) {
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
      case '4':
        const exitOption = await confirmExit();
        if (exitOption === 'mainMenu') {
          continue;
        }
        return process.exit(0);
      default:
        break;
    }
  } while (true);
}

async function showAboutYouSubMenu() {
  const aboutYouSubMenuOptions = [
    { value: '1', label: 'Tell me about your hobbies and interests' },
    { value: '2', label: 'Share some personal anecdotes' },
    { value: '0', label: 'Go back to main menu' },
  ];

  if (isCancel(aboutYouSubMenuOptions)) {
    cancel('Operation cancelled. Ciaoo ciao ciao ciao');
    process.exit(0);
  }

  let aboutYouSubMenuResponse;
  do {
    aboutYouSubMenuResponse = await select({
      message: 'Please select your option',
      options: aboutYouSubMenuOptions,
    });

    switch (aboutYouSubMenuResponse) {
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
  const experienceSubMenuOptions = [
    { value: '1', label: 'List your recent work experiences' },
    { value: '2', label: 'Highlight your skills and achievements' },
    { value: '0', label: 'Go back to main menu' },
  ];

  if (isCancel(experienceSubMenuOptions)) {
    cancel('Operation cancelled. Ciaoo ciao ciao ciao');
    process.exit(0);
  }

  let experienceSubMenuResponse;
  do {
    experienceSubMenuResponse = await select({
      message: 'Please select your option',
      options: experienceSubMenuOptions,
    });

    switch (experienceSubMenuResponse) {
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
  const spinner = showSpinner();
  spinner.start('Downloading CV');
  try {
    const response = await fetch('https://github.com/fbuireu/fbuireu/blob/main/assets/pdf/CV-English.pdf');
    const arrayBuffer = await response.arrayBuffer();
    const timestamp = Date.now();
    const filename = `Ferran_Buireu_CV_${timestamp}.pdf`;
    const isWindows= process.platform === 'win32'
    const folder = isWindows ? path.join(process.env.USERPROFILE, 'Downloads'): path.join(os.homedir(), 'Downloads');
    const filePath = path.join(folder, filename);

    await writeFileAsync(filePath, Buffer.from(arrayBuffer));
    spinner.stop(color.green("CV downloaded successfully"));
    note(`Look at ${filePath}`, '👀')
  } catch (error) {
    spinner.stop(color.red(`Error downloading CV: ${error.message}`))
  }
}

async function confirmExit() {
  const shouldContinue = await confirm({
    message: 'Do you want to continue?',
  });

  if (!shouldContinue) {
    const exitOption = await select({
      message: 'Ok, you are driving me crazy. What do you want to do?',
      options: [
        { value: 'mainMenu', label: 'Return to main menu' },
        { value: 'exit', label: 'Exit' },
      ],
      initialValue: 'mainMenu',
    });

    if (exitOption === 'mainMenu') {
      return 'mainMenu';
    } else if (exitOption === 'exit') {
      cancel('Goodbye! See you next time!\n See you');
      outro("It's been a pleasure");
      process.exit(0);
    }
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
