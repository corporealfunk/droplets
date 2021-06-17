/* eslint-env browser */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'purecss';
import 'purecss/build/grids-responsive.css';
import './index.css';
import * as Tone from 'tone';
import FmTone from './fm_tone';

const button = document.getElementById('go');
const inputHz = document.getElementById('hz');

const frequency = new Tone.Signal({
  value: inputHz.value,
});

inputHz.addEventListener('change', (e) => {
  frequency.value = parseInt(e.target.value, 10);
});

button.addEventListener('click', async (e) => {
  e.preventDefault();
  await Tone.start();

  const outGain = new Tone.Gain(0.8).toDestination();

  const newTone = new FmTone({
    moudulatorFreq: 100,
    carrierFreq: 440,
    modulationIndex: 150,
  });

  newTone.start.connect(outGain);
});
