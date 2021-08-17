import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';
import {
  minsToMs,
} from './value_utils';
import {
  pitchSetA,
  pitchSetB,
  pitchSetC,
  pitchSetD,
  pitchSetHiA,
  pitchSetHiB,
  pitchSetBassB,
  pitchSetBassC,
  pitchSetBassD,
} from './pitch_sets';

const bassSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
    [minsToMs(1)]: 0,
    [minsToMs(1.1)]: 0.7,
    [minsToMs(12)]: 1,
    [minsToMs(26)]: 0.5,
    [minsToMs(33)]: 0,
  });

  const pitchSets = {
    0: pitchSetBassB,
    [minsToMs(15)]: pitchSetBassC,
    [minsToMs(20)]: pitchSetBassD,
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
    [minsToMs(3)]: 0,
    [minsToMs(12)]: 0.5,
    [minsToMs(17.5)]: 1,
    [minsToMs(28)]: 0.5,
    [minsToMs(34)]: 0,
  });

  const pitchSets = {
    0: pitchSetA,
    [minsToMs(12)]: pitchSetB,
    [minsToMs(17)]: pitchSetC,
    [minsToMs(25)]: pitchSetD,
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 7,
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
    [minsToMs(16)]: 0,
    [minsToMs(23)]: 1,
    [minsToMs(29)]: 0.5,
    [minsToMs(34)]: 0,
  });

  const pitchSets = {
    0: pitchSetHiA,
    [minsToMs(24)]: pitchSetHiB,
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSets,
    polyphony: 6,
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

  start: (scoreTimeMs = 0) => {
    const output = new Tone.Gain(1);

    synths.forEach((synth) => {
      synth.start(scoreTimeMs).connect(output);
    });

    return output;
  },
};

export default score;
