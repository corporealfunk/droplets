import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';

const bassSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0.25,
    600000: 0.5,
    1200000: 1,
    1800000: 0.25,
  });

  const pitchSet = {
    choose: [
      Tone.Frequency('Bb1'),
      Tone.Frequency('C2'),
      Tone.Frequency('Eb2'),
      Tone.Frequency('F2'),
      Tone.Frequency('G2'),
    ],
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSet,
    polyphony: 4,
    lengthRange: { range: [120000, 240000], step: 10000 },
    gainRange: { range: [0.3, 1.0], step: 0.1 },
    modulatorRatio: 5 / 3,
    modulatorWobbleRange: { range: [4, 7], step: 1 },
    carrierWobbleRange: { range: [0, 0], step: 1 },
    tickLength: 5000,
    log: false,
  });
};

const bellSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
    900000: 0,
    1200000: 1,
    1500000: 0,
  });

  const pitchSet = {
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

  return new DensitySynth({
    densityEnvelope,
    pitchSet,
    polyphony: 8,
    lengthRange: { range: [6000, 30000], step: 1000 },
    gainRange: { range: [0.1, 0.7], step: 0.05 },
    tickLength: 100,
    modulatorRatio: { choose: [5 / 3, 3 / 2, 4 / 3] },
    modulatorWobbleRange: { range: [0, 0], step: 1 },
    carrierWobbleRange: { range: [4, 7], step: 1 },
    log: false,
  });
};

const hiSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
    900000: 0,
    1500000: 1,
  });

  const pitchSet = {
    choose: [
      Tone.Frequency('G5'),
      Tone.Frequency('G5'),
      Tone.Frequency('G5'),
      Tone.Frequency('G5'),
      Tone.Frequency('Bb5'),
      Tone.Frequency('C6'),
      Tone.Frequency('C6'),
      Tone.Frequency('C6'),
      Tone.Frequency('Eb6'),
      Tone.Frequency('Eb6'),
      Tone.Frequency('Eb6'),
      Tone.Frequency('F6'),
      Tone.Frequency('G6'),
      Tone.Frequency('G6'),
      Tone.Frequency('G6'),
      Tone.Frequency('Bb6'),
      Tone.Frequency('C7'),
      Tone.Frequency('C7'),
      Tone.Frequency('Eb7'),
      Tone.Frequency('Eb7'),
      Tone.Frequency('F7'),
    ],
  };

  return new DensitySynth({
    densityEnvelope,
    pitchSet,
    polyphony: 1,
    lengthRange: { range: [2000, 4000], step: 100 },
    gainRange: { range: [0.1, 0.6], step: 0.05 },
    tickLength: 100,
    modulatorRatio: { choose: [10 / 3, 8 / 3] },
    modulatorWobbleRange: { range: [0, 0], step: 1 },
    carrierWobbleRange: { range: [4, 7], step: 1 },
    log: false,
  });
};

console.log(bassSynth, bellSynth, hiSynth);

const score = {
  start: () => {
    const output = new Tone.Gain(1);
    bellSynth().start().connect(output);
    bassSynth().start().connect(output);
    hiSynth().start().connect(output);
    return output;
  },
};

export default score;
