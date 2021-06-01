/* eslint-env browser */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'purecss';
import 'purecss/build/grids-responsive.css';
import './index.css';
import * as Tone from 'tone';

const NORMALIZE = 1.701651585922511;

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

  const carrier = new Tone.Oscillator(100, 'sine');

  const modMultiply = new Tone.Gain(NORMALIZE * 100); // mod up and down by 100 hz
  const modAdder = new Tone.Add(440); // Offset by carrier hz (440)
  const modulator = new Tone.Oscillator(843, 'sine').chain(modMultiply, modAdder); // chain the swing and the offset
  modAdder.connect(carrier.frequency); // the offset output is sent to the carrier

  const outGain = new Tone.Gain(0.8).toDestination();

  // start both
  modulator.start();
  carrier.connect(outGain).start();
});
