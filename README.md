# GODev-Alexa-Skill-Samples

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## TIBCO Casemanagement Demo

![Alexa TIBCO](images/Alexa-TIBCO.jpg?raw=true "TIBCO BPM Bot on Amazon Alexa")

### Overview
Unofficial Demo Skill to demonstrate integration between TIBCO ActiveMatrix BPM and Amazon Alexa.

Full Source, and technical Details available on here.
It include own Version Install Details (e.g. to run as Alexa for Business) and Setup hints as well.

### Technology
This Skill is based created as Lambda Function using NodeJS JavaScript, to execute Calls to ActiveMatrix BPM the public REST API is used.

For Alexa Intents this one is used for [Englisch](bpmbot/Intents/intents_en.json) and here the one for [German](bpmbot/Intents/intents_de.json).
The Lambda YAML looks like [this](bpmbot/bpmbot.yaml), but much more importantly here the full Source of the '[index.js](bpmbot/index.js)'.

The full packaged NodeJS Source and requiered 'node_modules' available for download as [ZIP here](bpmbot/zip/bpmbot.zip).

### available Commands
The Skill is available in English and German, just try them out ... here some samples

<b>English</b>
- Alexa, start TIBCO Casemanagement Demo
- what can I do here
- my Work Items
- my Cases

<b>German</b>
- Alexa, start TIBCO Vorgangsteuerungs Demo
- Was kann ich hier machen
- meine Aufgaben
- meine Vorgänge

### Installation & Hints
You like to create your own running Version from this BPM Bot, just follow the [Step-by-Step](bpmbot/docs/install-guide.md) Guide.

### Links
more GODev SKILL Details can be found here: http://www.godev.de/GOLib/alexa-bpm.html

#### other Links
other helpfull once ...
- Alexa Skills Kit SDK for NodeJS: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
- Amazon Developer Portal: https://developer.amazon.com/home.html
- Amazon Lambda Console: https://console.aws.amazon.com/lambda/home
- TIBCO ActiveMatrix BPM: https://www.tibco.com/products/tibco-activematrix-bpm 
