/* eslint-env browser */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'purecss';
import 'purecss/build/grids-responsive.css';
import './index.css';
import './stimulus_application';

import * as Tone from 'tone';

import score from './score';

const goRun = document.getElementById('goRun');

goRun.addEventListener('click', async (e) => {
  e.preventDefault();
  await Tone.start();

  const outGain = new Tone.Gain(0.3).toDestination();

  score.start().connect(outGain);
});
