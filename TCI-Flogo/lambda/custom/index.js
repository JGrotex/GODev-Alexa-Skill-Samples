'use strict';

const AWS = require('aws-sdk');

// --------------- Skill translations -----------------------

var locale ="en";
const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Tibco Flogo',
            WELCOME: 'Welcome',
            WELCOME_FIRST: 'Welcome to Tibco Flogo',
            YOU_HAVE: 'Your have currently',
            CASES: 'open Cases.',
            HELP: 'Help',
            HELP_MESSAGE: 'this is a simple Sample. You can ask, „my Cases“ ... How can I help you?',
            REPROMPT: 'You can ask me anything.',
            MORE_QUESTION: 'Do you have more Questions?',
            THANKS: 'Thanks!',
            THANKS_BYE: 'see you next time.',
            ERROR: 'Error during Service Call.'
        },
    },
    'de': {
        translation: {
            SKILL_NAME: 'Tibco Flogo',
            WELCOME: 'Willkommen',
            WELCOME_FIRST: 'Willkommen zu Tibco Flogo',
            YOU_HAVE: 'Du hast zur Zeit',
            CASES: 'offene Vorgänge.',
            HELP: 'Hilfe',
            HELP_MESSAGE: 'Dies ist ein einfaches Beispiel. Du kannst sagen, „meine Vorgänge“ ... Wie kann ich dir helfen?',
            REPROMPT: 'Du kanst mich alles Fragen.',
            MORE_QUESTION: 'Hast du weitere Fragen?',
            THANKS: 'Vielen Dank!',
            THANKS_BYE: 'Bis zum nächsten Mal.',
            ERROR: 'Error während Service Call.'
        },
    },
};

// --------------- TCI Service Decriptor -----------------------

// define target API as service
const svc = new AWS.Service({
 
    // TIBCO Cloud Integartion base API URL --> can be secured a bit more with e.g. TIBCO Mashery
    endpoint: 'https://eu-west-1.integration.cloud.tibcoapps.com/<<your TCI Service ID>>',
 
    // don't parse API responses (optional)
	// you can define 'shapes' of all your endpoint responses
    convertResponseTypes: false,
 
    // TCI Flogo API REST
    apiConfig: {
        metadata: {
            protocol: 'rest-json' // we assume our API is JSON-based
        },
        operations: {
 
			// TCI Flogo custom Endpoint
            // get Data by a record id
            getData: {
                http: {
                    method: 'GET',
                    requestUri: '/cases'
                },
                input: {
                    type: 'structure',
                    required: [ ]
                }
            }
        }
    }
});
 
// disable AWS region specific endpoint handling
svc.isGlobalEndpoint = true;

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = t("WELCOME");
    const speechOutput = t("WELCOME_FIRST");

    const repromptText = t("REPROMPT");
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = t("THANKS");
    const speechOutput = t("THANKS_BYE");
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getHelp(callback) {
    const cardTitle = t("HELP");
    let repromptText = t("MORE_QUESTION");
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    speechOutput = t("HELP_MESSAGE");;

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getRESTdata(intent, session, callback) {
    const cardTitle = t("CASES");
    const repromptText = t("MORE_QUESTION");
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    svc.getData({}, (err, data) => {

        if (err) {
            console.error('>>> operation error:', err);
            speechOutput = t("ERROR");
            return callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }

        //console.log('data:', data);
        var obj = JSON.parse(data.data);
    
        speechOutput = t("YOU_HAVE") + " " + obj.length + " " + t("CASES");
        
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'getdata') {
        getRESTdata(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getHelp(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}

// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {

    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);
        
        locale=event.request.locale;

        /**
         * Uncomment this if statement and populate with your skill's application ID to 
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /**if (event.session.application.applicationId !== 'amzn1.ask.skill.some...') {
            callback('Invalid Application ID');
        }*/

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};

// --------------- Helper Functions -----------------------

//translation function
//Sample t("WELCOME")
function t(key) {
    try {
        var lang=locale.split("-")[0];
        return eval("languageStrings[lang].translation."+key);
    } catch (e) {
        return key;
    }
}