import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';
import {
  minsToMs,
  eighthTone,
  betweenTone,
  centsAdd,
} from './value_utils';

const bassSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0.4,
    [minsToMs(10)]: 0.75,
    [minsToMs(20)]: 1,
    [minsToMs(30)]: 0.5,
  });

  const pitchSets = {
    0: {
      choose: [
        Tone.Frequency('Bb1'),
        Tone.Frequency('C2'),
        Tone.Frequency('Eb2'),
        Tone.Frequency('F2'),
        Tone.Frequency('G2'),
      ],
    },
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 2,
    lengthRange: { range: [120000, 240000], step: 10000 },
    sustainRatioRange: { range: [0.4, 0.6], step: 0.05 },
    gainRange: { range: [0.3, 1.0], step: 0.1 },
    modulatorRatio: 5 / 3,
    modulatorWobbleRange: { range: [4, 7], step: 1 },
    carrierWobbleRange: { range: [0, 0], step: 1 },
    tickLength: 5000,
    name: 'Bass',
    log: false,
  });
};

const bellSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
    [minsToMs(5)]: 0,
    [minsToMs(12)]: 0.5,
    [minsToMs(20)]: 1,
  });

  const pitchSetA = {
    choose: [
      // Tone.Frequency('Bb3'),
      [Tone.Frequency('G3') * centsAdd(50), Tone.Frequency('F3')],
      Tone.Frequency('G3'),
      Tone.Frequency('C4') * centsAdd(35),
      Tone.Frequency('C4'),
      [Tone.Frequency('C4') * centsAdd(50), Tone.Frequency('Bb3') * centsAdd(-50)],
      Tone.Frequency('Eb4') * centsAdd(35),
      Tone.Frequency('Eb4'),
      Tone.Frequency('Eb4'),
      Tone.Frequency('Eb4'),
      // Tone.Frequency('F4'),
      [Tone.Frequency('G4') * centsAdd(50), Tone.Frequency('F4')],
      Tone.Frequency('G4') * centsAdd(35),
      Tone.Frequency('G4'),
      Tone.Frequency('G4'),
      // Tone.Frequency('Bb4'),
      [Tone.Frequency('C5') * centsAdd(50), Tone.Frequency('Bb4') * centsAdd(-50)],
      Tone.Frequency('C5') * centsAdd(35),
      Tone.Frequency('C5'),
      Tone.Frequency('C5'),
      // Tone.Frequency('Eb5'),
      // Tone.Frequency('F5'),
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
      Tone.Frequency('C4'),
      Tone.Frequency('Eb4') * centsAdd(35),
      Tone.Frequency('Eb4'),
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
      Tone.Frequency('Eb5'),
      [Tone.Frequency('F5') * centsAdd(35), Tone.Frequency('Eb5')],
      Tone.Frequency('F5'),
      Tone.Frequency('F5'),
      Tone.Frequency('F5'),
    ],
  };

  const pitchSetC = {
    choose: [
      Tone.Frequency('G3'),
      Tone.Frequency('C4') * centsAdd(35),
      Tone.Frequency('C4'),
      Tone.Frequency('Eb4') * centsAdd(35),
      Tone.Frequency('Eb4'),
      Tone.Frequency('Eb4'),
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
      Tone.Frequency('C5') * centsAdd(35),
      Tone.Frequency('C5'),
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

  /*
  const pitchSetB = {
    choose: [
      Tone.Frequency('Bb3'),
      Tone.Frequency('C4'),
      Tone.Frequency('Eb4'),
      Tone.Frequency('F4'),
      Tone.Frequency('G4'),
      Tone.Frequency('Bb4'),
      Tone.Frequency('C5'),
      Tone.Frequency('Eb5'),
      Tone.Frequency('F5'),
    ],
  };
  */

  const pitchSets = {
    0: pitchSetA,
    [minsToMs(12)]: pitchSetB,
    [minsToMs(18)]: pitchSetC,
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 8,
    lengthRange: { range: [6000, 10000], step: 1000 },
    sustainRatioRange: { range: [0.25, 0.5], step: 0.05 },
    gainRange: { range: [0.1, 0.7], step: 0.05 },
    tickLength: 100,
    modulatorRatio: { choose: [5 / 3, 3 / 2, 4 / 3] },
    modulatorWobbleRange: { range: [0, 0], step: 1 },
    carrierWobbleRange: { range: [4, 7], step: 1 },
    name: 'Bells',
    log: false,
  });
};

const hiSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
    [minsToMs(15)]: 0,
    [minsToMs(25)]: 1,
    [minsToMs(30)]: 0.5,
    [minsToMs(35)]: 0,
  });

  const pitchSets = {
    0: {
      choose: [
        [Tone.Frequency('G5') * betweenTone, Tone.Frequency('F#5') * betweenTone],
        Tone.Frequency('G5'),
        Tone.Frequency('Bb5') * eighthTone,
        Tone.Frequency('C6') * eighthTone,
        Tone.Frequency('C6'),
        Tone.Frequency('Eb6') * eighthTone,
        Tone.Frequency('Eb6'),
        Tone.Frequency('F6') * betweenTone,
        Tone.Frequency('G6'),
        Tone.Frequency('G6') * eighthTone,
        Tone.Frequency('Bb6'),
        Tone.Frequency('C7') * betweenTone,
        Tone.Frequency('C7'),
        Tone.Frequency('Eb7') * eighthTone,
        Tone.Frequency('Eb7'),
        Tone.Frequency('F7') * betweenTone,
        [Tone.Frequency('F7') * betweenTone, Tone.Frequency('F7')],
      ],
    },
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 8,
    lengthRange: { range: [2000, 5100], step: 100 },
    sustainRatioRange: { range: [0.2, 0.4], step: 0.05 },
    gainRange: { range: [0.15, 0.4], step: 0.05 },
    tickLength: 100,
    modulatorRatio: { choose: [10 / 3, 8 / 3] },
    modulatorWobbleRange: { range: [0, 0], step: 1 },
    carrierWobbleRange: { range: [4, 7], step: 1 },
    name: 'HiSynth',
    log: false,
  });
};

console.log(
  bassSynth,
  bellSynth,
  hiSynth,
);

const synths = [
  bassSynth(),
  bellSynth(),
  hiSynth(),
];

const score = {
  synths,

  start: () => {
    const output = new Tone.Gain(1);

    synths.forEach((synth) => {
      synth.start().connect(output);
    });

    return output;
  },
};

export default score;
