import { FONTS } from '../data/fonts.js';

export function pickNerdFont(){
    return FONTS[(Math.random() * FONTS.length) | 0]
}


