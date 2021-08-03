import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';
import {
  minsToMs,
  eighthTone,
  betweenTone,
} from './value_utils';
import {
  pitchesJesseSolo,
} from './pitch_sets';

const bassSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0.8,
    [minsToMs(8)]: 0.8,
    [minsToMs(12)]: 1,
    [minsToMs(20)]: 1,
    [minsToMs(35)]: 0.5,
  });

  const pitchSets = {
    0: {
      choose: [
        Tone.Frequency('Eb2'),
        [Tone.Frequency('Eb2'), Tone.Frequency('C2')],
        Tone.Frequency('F2'),
        [Tone.Frequency('F2'), Tone.Frequency('C2')],
        [Tone.Frequency('G2'), Tone.Frequency('Eb2')],
        Tone.Frequency('Bb2'),
        Tone.Frequency('C3'),
        [Tone.Frequency('C3'), Tone.Frequency('Bb2')],
      ],
    },
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 2,
    lengthRange: { range: [120000, 220000], step: 10000 },
    sustainRatioRange: { range: [0.4, 0.6], step: 0.05 },
    gainRange: { range: [0.5, 1.0], step: 0.1 },
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
    [minsToMs(12)]: 0,
    [minsToMs(15)]: 0.8,
    [minsToMs(25)]: 0.4,
    [minsToMs(35)]: 0.25,
  });

  const pitchSets = {
    0: pitchesJesseSolo,
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 6,
    lengthRange: { range: [10000, 21000], step: 1000 },
    sustainRatioRange: { range: [0.25, 0.5], step: 0.05 },
    gainRange: { range: [0.1, 0.7], step: 0.05 },
    tickLength: 100,
    modulatorRatio: { choose: [5 / 3, 3 / 2, 4 / 3] },
    modulatorWobbleRange: { range: [0, 0], step: 1 },
    carrierWobbleRange: { range: [2, 7], step: 1 },
    name: 'Bells Long',
    log: false,
  });
};

const hiSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
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
