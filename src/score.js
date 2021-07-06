import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';

const bassSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 0,
    120000: 0.5,
    300000: 1,
    600000: 0.25,
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
    lengthRange: { range: [45000, 180000], step: 5 },
    gainRange: { range: [0.1, 1.0], step: 0.1 },
  });
};

const bellSynth = () => {
  const densityEnvelope = new ControlEnvelope({
    0: 1,
    300000: 1,
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
    lengthRange: { range: [2000, 6000], step: 500 },
    gainRange: { range: [0.1, 1.0], step: 0.1 },
    tickLength: 100,
    modulatorRatio: { choose: [5 / 3, 3 / 2, 4 / 3] },
  });
};

const score = {
  start: () => bellSynth().start(),
  bassSynth: () => bassSynth().start(),
};

export default score;
