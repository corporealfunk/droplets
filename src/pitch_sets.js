import * as Tone from 'tone';
import {
  centsAdd,
  eighthTone,
  betweenTone,
} from './value_utils';

const pitchSetA = {
  choose: [
    [Tone.Frequency('G3') * centsAdd(50), Tone.Frequency('F3')],
    [Tone.Frequency('G3') * centsAdd(60), Tone.Frequency('F3') - centsAdd(-50)],
    Tone.Frequency('G3'),
    Tone.Frequency('C4') * centsAdd(35),
    Tone.Frequency('C4'),
    [Tone.Frequency('C4') * centsAdd(50), Tone.Frequency('Bb3') * centsAdd(-50)],
    [Tone.Frequency('C4') * centsAdd(60), Tone.Frequency('Bb3') * centsAdd(-60)],
    Tone.Frequency('Eb4') * centsAdd(35),
    Tone.Frequency('Eb4') * centsAdd(50),
    Tone.Frequency('Eb4'),
    Tone.Frequency('Eb4'),
    Tone.Frequency('Eb4'),
    [Tone.Frequency('G4') * centsAdd(50), Tone.Frequency('F4')],
    [Tone.Frequency('G4') * centsAdd(60), Tone.Frequency('F4') - centsAdd(-50)],
    Tone.Frequency('G4') * centsAdd(35),
    Tone.Frequency('G4'),
    Tone.Frequency('G4'),
    [Tone.Frequency('C5') * centsAdd(50), Tone.Frequency('Bb4') * centsAdd(-50)],
    [Tone.Frequency('C5') * centsAdd(60), Tone.Frequency('Bb4') * centsAdd(-60)],
    Tone.Frequency('C5') * centsAdd(35),
    Tone.Frequency('C5'),
    Tone.Frequency('C5'),
  ],
};

const pitchSetB = {
  choose: [
    [Tone.Frequency('G3') * centsAdd(50), Tone.Frequency('F3')],
    Tone.Frequency('G3'),
    Tone.Frequency('G3'),
    Tone.Frequency('G3'),
    [Tone.Frequency('C4') * centsAdd(50), Tone.Frequency('Bb3') * centsAdd(-50)],
    Tone.Frequency('C4') * centsAdd(35),
    Tone.Frequency('C4'),
    Tone.Frequency('C4'),
    Tone.Frequency('Eb4') * centsAdd(35),
    Tone.Frequency('Eb4'),
    Tone.Frequency('Eb4'),
    Tone.Frequency('F4'),
    Tone.Frequency('F4'),
    Tone.Frequency('F4'),
    Tone.Frequency('F4'),
    [Tone.Frequency('G4') * centsAdd(50), Tone.Frequency('F4')],
    Tone.Frequency('G4') * centsAdd(35),
    Tone.Frequency('G4'),
    Tone.Frequency('G4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    [Tone.Frequency('C5') * centsAdd(50), Tone.Frequency('Bb4') * centsAdd(-50)],
    Tone.Frequency('C5') * centsAdd(35),
    Tone.Frequency('C5'),
    Tone.Frequency('C5'),
    Tone.Frequency('Eb5') * centsAdd(35),
    Tone.Frequency('Eb5'),
    Tone.Frequency('Eb5'),
    [Tone.Frequency('F5') * centsAdd(35), Tone.Frequency('Eb5')],
    Tone.Frequency('F5'),
    Tone.Frequency('F5'),
    Tone.Frequency('F5'),
  ],
};

const pitchesJesseSolo = {
  choose: [
    [Tone.Frequency('G4') * centsAdd(50), Tone.Frequency('Eb4')],
    Tone.Frequency('G4'),
    Tone.Frequency('G4'),
    Tone.Frequency('G4'),
    [Tone.Frequency('G4'), Tone.Frequency('F5')],
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4') * centsAdd(50),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    [Tone.Frequency('C5') * centsAdd(50), Tone.Frequency('G3') * centsAdd(-50)],
    Tone.Frequency('C5') * centsAdd(35),
    Tone.Frequency('C5'),
    Tone.Frequency('C5'),
    Tone.Frequency('C5'),
    Tone.Frequency('F5') * centsAdd(50),
    Tone.Frequency('F5'),
    Tone.Frequency('F5'),
    Tone.Frequency('F5'),
  ],
};

const pitchSetC = {
  choose: [
    Tone.Frequency('G3'),
    Tone.Frequency('C4') * centsAdd(35),
    Tone.Frequency('Eb4') * centsAdd(35),
    Tone.Frequency('Eb4'),
    Tone.Frequency('Eb4'),
    Tone.Frequency('F4'),
    Tone.Frequency('F4'),
    [Tone.Frequency('G4') * centsAdd(50), Tone.Frequency('F4')],
    Tone.Frequency('G4') * centsAdd(35),
    Tone.Frequency('G4'),
    Tone.Frequency('G4'),
    Tone.Frequency('G4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('Bb4'),
    Tone.Frequency('C5') * centsAdd(35),
    Tone.Frequency('Eb5') * centsAdd(35),
    Tone.Frequency('Eb5'),
    Tone.Frequency('Eb5'),
    Tone.Frequency('Eb5'),
    [Tone.Frequency('F5') * centsAdd(35), Tone.Frequency('Eb5')],
    Tone.Frequency('F5'),
    Tone.Frequency('F5'),
    [Tone.Frequency('G5') * centsAdd(35), Tone.Frequency('F5')],
    Tone.Frequency('G5'),
    Tone.Frequency('G5'),
    Tone.Frequency('G5'),
  ],
};

const pitchSetHiA = {
  choose: [
    [Tone.Frequency('G5') * centsAdd(50), Tone.Frequency('F5') * centsAdd(-50)],
    Tone.Frequency('G5'),
    Tone.Frequency('Bb5') * eighthTone,
    [Tone.Frequency('Bb5') * centsAdd(50), Tone.Frequency('G5') * centsAdd(-50)],
    Tone.Frequency('Bb5'),
    Tone.Frequency('C6') * eighthTone,
    Tone.Frequency('C6'),
    [Tone.Frequency('C6') * centsAdd(50), Tone.Frequency('Bb5') * centsAdd(-50)],
    Tone.Frequency('Eb6') * eighthTone,
    Tone.Frequency('Eb6'),
    [Tone.Frequency('Eb6') * centsAdd(50), Tone.Frequency('C5') * centsAdd(-50)],
    Tone.Frequency('F6') * centsAdd(50),
    Tone.Frequency('F6'),
    [Tone.Frequency('F6') * centsAdd(50), Tone.Frequency('Eb5') * centsAdd(-50)],
    Tone.Frequency('G6') * centsAdd(50),
    Tone.Frequency('G6') * centsAdd(35),
    Tone.Frequency('G6'),
    [Tone.Frequency('G6') * centsAdd(50), Tone.Frequency('F6') * centsAdd(-50)],
    Tone.Frequency('Bb6'),
    Tone.Frequency('Bb6') * centsAdd(35),
    Tone.Frequency('Bb6'),
    [Tone.Frequency('Bb6') * centsAdd(50), Tone.Frequency('G6') * centsAdd(-50)],
    Tone.Frequency('C7') * centsAdd(50),
    Tone.Frequency('C7'),
    Tone.Frequency('C7'),
    [Tone.Frequency('C7') * centsAdd(50), Tone.Frequency('Bb6') * centsAdd(-50)],
    Tone.Frequency('Eb7') * centsAdd(50),
    Tone.Frequency('Eb7'),
    [Tone.Frequency('Eb7') * centsAdd(50), Tone.Frequency('C7') * centsAdd(-50)],
    Tone.Frequency('F7') * betweenTone,
    Tone.Frequency('F7'),
    [Tone.Frequency('F7') * centsAdd(50), Tone.Frequency('Eb7')],
  ],
};

const pitchSetHiB = {
  choose: [
    [Tone.Frequency('G5') * betweenTone, Tone.Frequency('F#5') * betweenTone],
    Tone.Frequency('G5'),
    Tone.Frequency('Bb5') * eighthTone,
    Tone.Frequency('Bb5') * eighthTone,
    Tone.Frequency('Bb5') * eighthTone,
    Tone.Frequency('C6') * eighthTone,
    Tone.Frequency('C6'),
    Tone.Frequency('Eb6') * eighthTone,
    Tone.Frequency('Eb6'),
    Tone.Frequency('F6') * betweenTone,
    Tone.Frequency('G6'),
    Tone.Frequency('G6') * eighthTone,
    Tone.Frequency('G6') * eighthTone,
    Tone.Frequency('G6') * eighthTone,
    Tone.Frequency('Bb6'),
    Tone.Frequency('Bb6'),
    Tone.Frequency('Bb6'),
    Tone.Frequency('C7') * betweenTone,
    Tone.Frequency('C7'),
    Tone.Frequency('Eb7') * eighthTone,
    Tone.Frequency('Eb7'),
    Tone.Frequency('Eb7'),
    Tone.Frequency('F7') * betweenTone,
    [Tone.Frequency('F7') * betweenTone, Tone.Frequency('F7')],
  ],
};

export {
  pitchSetA,
  pitchSetB,
  pitchSetC,
  pitchesJesseSolo,
  pitchSetHiA,
  pitchSetHiB,
};
