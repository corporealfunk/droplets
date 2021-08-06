import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';
import {
  minsToMs,
} from './value_utils';
import {
  pitchesJesseSolo,
  pitchSetBassB,
  pitchSetBassC,
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
    0: pitchSetBassB,
    [minsToMs(20)]: pitchSetBassC,
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
    modulatorRatio: { choose: [10 / 3, 6 / 2, 8 / 3] },
    modulatorWobbleRange: { range: [0, 0], step: 1 },
    carrierWobbleRange: { range: [2, 7], step: 1 },
    name: 'Bells Long',
    log: false,
  });
};

const synths = [
  bassSynth(),
  bellSynth(),
];

const score = {
  synths,

  start: (scoreTimeMs = 0) => {
    const output = new Tone.Gain(1);

    synths.forEach((synth) => {
      synth.start(scoreTimeMs).connect(output);
    });

    return output;
  },
};

export default score;
