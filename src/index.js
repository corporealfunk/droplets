/* eslint-env browser */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'purecss';
import 'purecss/build/grids-responsive.css';
import './index.css';
import './stimulus_application';

import * as Tone from 'tone';
import ControlEnvelope from './control_envelope';
import DensitySynth from './density_synth';

const goRun = document.getElementById('goRun');

goRun.addEventListener('click', async (e) => {
  console.log('run');
  e.preventDefault();
  await Tone.start();

  const densityEnvelope = new ControlEnvelope({
    0: 0,
    120000: 0.5,
    300000: 1,
    600000: 0.25,
  });

  const outGain = new Tone.Gain(0.3).toDestination();

  const synth = new DensitySynth({
    densityEnvelope,
    polyphony: 4,
  });

  synth.start().connect(outGain);
  window.synth = synth;
});
