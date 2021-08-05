### Droplets, a Javascript-based Sound Installation

This code uses the WebAudio API via the ToneJS library to create an in-browser sound installation.

FM synthesis is used to create the "Droplet" instrument which creates a tone followed by detuned tone.

The current score files outline three different parameter sets to be played back on three different speaker systems/computers.

FireFox has issues with WebAudio performance playing back the included scores. Safari or Chrome should be used. It is not likely all three scores/speakers could be played on one computer without WebAudio performances glitches and audio dropouts.

Mobile phones generally have issues as well, though higher end phones have not been tested.

### Requirements

* NodeJS and npm

### Build & Run

Install dependencies:

```npm install``

To run the dev server:

```npm start```

Visit in Chrome or Safari:

http://localhost:8000

Copyright © 2021, Jon Moniaci.
