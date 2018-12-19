# GODev-Alexa-Skill-Samples

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Alexa TIBCO](images/Alexa-TIBCO.jpg?raw=true "TIBCO Amazon Alexa Bots")

## TIBCO Cloud Integration LiveApps Sample
### Overview
... coming soon in 2019, stay tuned!

## TIBCO Cloud Integration Flogo Sample
### Overview
Simple Sample of calling a TCI Flogo Service from Amazon Alexa, to get a Case count for TIBCO Cloud LiveApps.
This is just a technical Sample, using AWS SDK Core Functionalities to connect to TIBCO Services, by keeping the Source on AWS Lambda as tiny as possible.

### Configuration
to get the sample working within your Alexa / AWS Developer Account install Amazon Alexa ASK CLI. The only String that need to be change in the Lambda Index.js is the 'endpoint: 'https://<<your location>>.integration.cloud.tibcoapps.com/<<your TCI Service ID>>'' to point to your TIBCO Cloud Integration Service Endpoint.

### Deployment
The full Skill can be deployed quickly and globally using Amazon Alexa ASK CLI with the following commands:
- switch to you Alexa Development Folder
- >ask init
- >ask deploy [--no-wait]

This will create the Alexa Skill, configure it for global Endpoints (see '.ask/config' and 'skill.json') finally the Lamdba Function is automatically created in 'NA', 'EU', and 'FE'.

### TCI Flogo Service
The graphically defined connect TIBCO Flogo Service looks like below, and just consume some ready to uses TIBCO Cloud LiveApps Connectors.

![Alexa TIBCO Flogo LiveApps](images/basicFlogoFlow.png?raw=true "basic TIBCO Flogo flow connected to LiveApps")

Full TCI Flogo Implementation JSON [here](flogo-json/Alexa-Skill-Data-Service.json)
You just have to configure to point to you TIBCO Cloud LiveApps Application.

## TIBCO ActiveMatrix BPM Case Management Demo
### Overview
Unofficial Demo Skill to demonstrate integration between TIBCO ActiveMatrix BPM and Amazon Alexa.
This Implementation is a bit older, and got no updates a while ago!

Full Source, and technical Details available on here.
It include own Version Install Details (e.g. to run as Alexa for Business) and Setup hints as well.

### Technology
This Skill is based created as Lambda Function using NodeJS JavaScript, to execute Calls to ActiveMatrix BPM the public REST API is used.

For Alexa Intents this one is used for [Englisch](bpmbot/Intents/intents_en.json) and here the one for [German](bpmbot/Intents/intents_de.json).
The Lambda YAML looks like [this](bpmbot/bpmbot.yaml), but much more importantly here the full Source of the '[index.js](bpmbot/index.js)'.

The full packaged NodeJS Source and required 'node_modules' available for download as [ZIP here](bpmbot/zip/bpmbot.zip).
Note: This package is quite big, in the meantime I moved on to use AWS SDK Core for all kinds of Service Calls, with this you can keep Lambda function quite smaller. (see TCI Sample)

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
other helpful once ...
- Alexa Skills Kit SDK for NodeJS: https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
- Amazon Developer Portal: https://developer.amazon.com/home.html
- Amazon Lambda Console: https://console.aws.amazon.com/lambda/home
- TIBCO ActiveMatrix BPM: https://www.tibco.com/products/tibco-activematrix-bpm
