#!/usr/bin/env node

import chalkAnimation from 'chalk-animation'
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import figlet from 'figlet'
import gradient from 'gradient-string'
import { pickNerdFont } from './utils/pickNerdFont.js'
import { MESSAGES } from './data/messages.js'

const sleep = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms))

async function welcome () {
    figlet(MESSAGES.introduction.title, {
        font: pickNerdFont(),
        horizontalLayout: 'fitted',
    }, async (error, message) => {
        if (error) {
            console.log(MESSAGES.error.quit) // handle in handleError
            process.exit(1)
        }
        console.log(`${gradient.rainbow.multiline(message)}`)
        const subtitle = chalkAnimation.rainbow(MESSAGES.introduction.subtitle)
        await sleep(2900)
        subtitle.stop()
    })
}

async function mainMenu () {
    try {
        inquirer.prompt(MESSAGES.mainMenu).
            then(({ menuOption }) => handleSelection(menuOption))
    } catch (error) {
        handleError({ error })
    }
}

const handleError = ({ error }) => {
    console.error(
        error.isTtyError ? MESSAGES.error.tty : MESSAGES.error.unknown)
    process.exit(1)
}

const exit = async () => {
    const spinner = createSpinner().start()
    await sleep(1000)
    spinner.success({ text: 'I can do that' })
    await sleep(200)
    process.exit(1)
}

const handleSelection = async (selection) => {
    if (selection === 'Exit') {
        await exit()
    } else if (selection === 'Know more about you') {
        await showCv()
    } else if (selection === 'WTF is that? I just want to play a game') {
        console.log('GAMEW')
    }
}

const showCv = async () => {
    try {
        const questions = [
            {
                type: 'list',
                name: 'survey',
                message: 'Do you want to know more about me? 1 Do you want to know more about me? 1 Do you want to know more about me? 1 Do you want to know more about me? 1 \n \n' +
                    '' +
                    '' +
                    '' +
                    '' +
                    'Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1Do you want to know more about me? 1',
                choices: ['yes', 'no'],
            },
            {
                type: 'list',
                name: 'happiness',
                message: 'Do you want to know more about me? 2',
                choices: [
                    'Very happy',
                    'Quite happy',
                    'Neutral',
                    'Not quite happy',
                    'Unhappy'],
                when (answers) {
                    return answers.survey === 'yes'
                },
            },
            {
                type: 'input',
                name: 'feedback',
                message: 'Please give us open feedback (optional)',
                when (answers) {
                    return answers.happiness === 'yes'
                },
            },
        ]
        console.log('I was born in Barcelona bla bla bla')
        inquirer.prompt(questions).then((answers) => {
            console.log(JSON.stringify(answers, null, 2))
        }).catch((error) => {
            if (error.isTtyError) {
                console.log('Your console environment is not supported!')
            } else {
                console.log(error)
            }
        })
    } catch (error) {
        if (error.isTtyError) {
            console.error('Your console environment is not supported!')
        } else {
            console.error('Something else went wrong!')
        }
    }

}

console.clear()
await welcome()
await sleep(3000)
await mainMenu()
await sleep(3000)
//createSpinner().start()

// todo: add CV as
// language support (multiple json or single json?)
// add XSS
//add condition to exit
// add game:
// - https://github.com/arvindr21/cli-adventure-games
// -https://github.com/polltery/node-cli-game-example -- https://github.com/polltery/node-cli-game-example/issues/19
// https://github.com/thormeier/minesweeper.js

// https://pakstech.com/blog/inquirer-js/
// add readme, license, etc

// "build": "tsc src/index.ts --outDir dist --module ES6"
// dist/index.js + add to gitignore
// move to organization