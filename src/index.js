/* eslint-env browser */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'purecss';
import 'purecss/build/grids-responsive.css';
import './index.css';
import * as Tone from 'tone';
import FmTone from './fm_tone';

const button = document.getElementById('go');

const carrierInput = document.getElementById('carrier');
const moudulatorInput = document.getElementById('modulator');
const modulationIndexInput = document.getElementById('modulationIndex');
const amplitudeInput = document.getElementById('amplitude');

const carrierFreq = new Tone.Signal({
  value: carrierInput.value,
});

const modulatorFreq = new Tone.Signal({
  value: parseInt(moudulatorInput.value, 10),
});

const modulationIndex = new Tone.Signal({
  value: parseInt(modulationIndexInput.value, 10),
});

const amplitude = new Tone.Signal({
  value: parseInt(amplitudeInput.value, 10) / 100,
});

carrierInput.addEventListener('change', (e) => {
  carrierFreq.value = parseInt(e.target.value, 10);
});

moudulatorInput.addEventListener('change', (e) => {
  modulatorFreq.value = parseInt(e.target.value, 10);
});

modulationIndexInput.addEventListener('change', (e) => {
  modulationIndex.value = parseInt(e.target.value, 10);
});

amplitudeInput.addEventListener('change', (e) => {
  amplitude.value = parseInt(e.target.value, 10) / 100;
});

button.addEventListener('click', async (e) => {
  e.preventDefault();
  await Tone.start();

  const outGain = new Tone.Gain(0.8).toDestination();

  const newTone = new FmTone({
    modulatorFreq,
    carrierFreq,
    modulationIndex,
    amplitude,
  });

  newTone.start().connect(outGain);
});
