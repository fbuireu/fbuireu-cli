// todo: messages can come from a JSON?
export const MESSAGES = {
    introduction: {
        title: 'Welcome  to  a  Ferran  Buireu\'s  Delusion',
        subtitle: 'Also known as Homer Simpson\'s web page or 80 nightmare',
    },
    mainMenu: [
        {
            name: 'menuOption',
            type: 'list',
            message: 'What do you want to do?',
            choices: [
                'Know more about you',
                'WTF is that? I just want to play a game',
                'Exit',
            ],
        },
        {
            name: 'checkExit',
            type: 'list',
            message: 'Are you sure you want to exit?',
            choices: [
                'Yes',
                'No',
            ],
            when ({ menuOption }) {
                return menuOption === 'Exit'
            },
        },
    ],

    error: {
        tty: 'Environment not supported. Are you running this in a GameBoy?',
        quit: 'Something went wrong. I\'m not joking. Break the glass. I\'m dead',
        unknown: 'Something else went wrong!',
    },
}