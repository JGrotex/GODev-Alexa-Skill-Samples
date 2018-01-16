/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * TIBCO BPM Demo Skill
 **/

'use strict';

var AWS = require('aws-sdk');
var request = require('sync-request');
const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var loginDetails;

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'TIBCO Case Management',
            WELCOME: 'Welcome to your Case Management',
            YOU_HAVE: 'You have currently ',
            WORKITEMS: ' active Workitems in your Inbox',
            CASES: ' active Cases',
            HELP_MESSAGE: 'You can say ask me: „my Workitems“ or „my Cases“... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            MORE_QUESTION: 'Do you have more Questions for me?',
            NO_SERVER: 'could not reach the currently configured TIBCO BPM Demo Server.',
            NO_LOGIN: 'Combination of Username and Password wrong defined.',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'TIBCO Case Management',
        },
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'TIBCO Case Management',
        },
    },
    'de': {
        translation: {
            SKILL_NAME: 'TIBCO Vorgangssteuerung',
            WELCOME: 'Willkommen zur Vorgangssteuerung',
            YOU_HAVE: 'Du hast zur Zeit ',
            WORKITEMS: ' offene Aufgaben in deinem Postfach',
            CASES: ' offene Vorgänge',
            HELP_MESSAGE: 'Du kannst sagen, „meine Aufgaben“, oder du kannst „meine Vorgänge“ sagen ... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            MORE_QUESTION: 'Hast du weitere Fragen an mich?',
            NO_SERVER: 'Der aktuell konfigurierte TIBCO BPM Demo Server konnte nicht erreicht werden.',
            NO_LOGIN: 'Kombination Benutzername und Password falsch angegeben.',
            STOP_MESSAGE: 'Auf Wiedersehen!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('Welcome');
    },
    'Welcome': function () {
        var speechOutput;
        speechOutput = this.t('WELCOME');
        
        const imageObj = {
	        smallImageUrl: 'https://www.tibco.com/blog/wp-content/uploads/2015/08/tibco-logo.jpg',
	        largeImageUrl: 'https://www.tibco.com/blog/wp-content/uploads/2015/08/tibco-logo.jpg'
            };
        
        try {
            const reprompt = this.t('HELP_MESSAGE');
            
            loginDetails = performLogin();
            if (loginDetails.errorCode != 200) {
                speechOutput = this.t('NO_LOGIN');
            } else {
                speechOutput = this.t('WELCOME') + " " + loginDetails.displayName;
            }
            this.emit(':askWithCard', speechOutput, reprompt, this.t('SKILL_NAME'), speechOutput, imageObj);
        } catch(e) {
            speechOutput = this.t('NO_SERVER');
            this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), speechOutput, imageObj);
        }
    },
    'myCases': function () {
        var speechOutput;

        var contrats = listContrat(1, loginDetails.auth);
        speechOutput = this.t('YOU_HAVE') + contrats.length + this.t('CASES');

        const reprompt = this.t('MORE_QUESTION');
        this.emit(':askWithCard', speechOutput, reprompt, this.t('SKILL_NAME'), speechOutput);
    },
    'myWorkitems': function () {
        var speechOutput;
        //JGR: just for testing ... const wicount = Math.floor(Math.random() * 10);
        var wicount = getWorkitems(loginDetails.auth);
        speechOutput = this.t('YOU_HAVE') + wicount + this.t('WORKITEMS');
        
        const reprompt = this.t('MORE_QUESTION');
        this.emit(':askWithCard', speechOutput, reprompt, this.t('SKILL_NAME'), speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};




// ----------------------------------------------------------
// Activematrix BPM API Calls
// ----------------------------------------------------------

function getOrgResources(auth) {
    // Call the AMX:BPM Service Process PF to request the status. We will get back his existing contracts

    var apiPath = '/orgresource/get/-1';

    // Construct the body of the request
    //var payload = {};
    //payload['@payloadMode'] = 'JSON';
    //payload['serializedPayload'] = "";
    //var reqBody = { payload: payload };
    
    var data = runAPIcall(auth, 'GET', apiPath);
    
    console.log('Returned body: ' + data);
    var resourceObj = data.resource;
    if (resourceObj instanceof Array) {
        resourceObj = data.resource[0];
    }

    return resourceObj['@guid'];
}

function getWorkitems(auth) {
    // Call the AMX:BPM Service Process PF to request the status. We will get back his existing contracts

    var apiPath = '/worklist/items/RESOURCE/'+loginDetails.guid+'/0/1';

    var data = runAPIcall(auth, 'GET', apiPath);
    
    console.log('Returned body: ' + data);

    return data.totalItems;
}

function listContrat(id, auth) {
    // Call the AMX:BPM Service Process PF to request the status. We will get back his existing contracts

    console.log('checking ClientID: ' + id);
	
    var pfPath = '%2FCustomerportal-chatbot%2FProcess%20Packages%2FCustomerportalChatbot.xpdl/myContrats/1.0.0';

    // Construct the body of the request
    var payload = {};
    payload['@payloadMode'] = 'JSON';
    payload['serializedPayload'] = "{\"items\":[{\"$param\":\"Request\", \"mode\":\"IN\", \"$value\":{\"$type\":\"com.example.customer.portal.chatbot.myContratsRequest\", \"clientID\": \""
        + id + "\"}}]}";
    var reqBody = { payload: payload };
    var data = runPFServiceProcess(auth, pfPath, reqBody);
    console.log('Contrat[0]: ' + data[0].numeroCompte);
    return data;
}

// ----------------------------------------------------------
// These are generic AMX:BPM API Calls used by the chatbot
// ----------------------------------------------------------

function performLogin() {
    
    // ActiveMatrix BPM Config params
    var bpmUser = process.env.BPMUSER || 'tibco-admin';
    var bpmPw = process.env.BPMPW || 'secret';
    var bpmRestUrl = process.env.BPMRESTURL || 'http://localhost:8080/bpm/rest';
    
    var loginDetails = {
        login: bpmUser,
        password: bpmPw,
		cookie: null,
		claims: null,
		firstName: '',
		lastName: '',
		errorCode: 200,
		errorMsg: ''
    };

    loginDetails.auth = 'Basic ' + new Buffer(bpmUser + ':' + bpmPw).toString('base64');

    // Get the details of this user
    var requestUrl = bpmRestUrl + '/orgresource/get/-1';
    var orgResource = request('GET', requestUrl, {
        'headers': {
            'Authorization': loginDetails.auth,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    console.log('Login response = ' + orgResource.statusCode);
    if (orgResource.statusCode != 200) {
        loginDetails.errorCode = orgResource.statusCode;
        loginDetails.errorMsg = orgResource.body.toString('utf-8');
        loginDetails.auth = null;
        console.log('Failed to login: ' + loginDetails.errorMsg);
        return loginDetails;
    }
    var orgResourceObject = JSON.parse(orgResource.body.toString('utf-8'));
    console.log('Returned body: ' + orgResource.body.toString('utf-8'));
    var resourceObj = orgResourceObject.resource;
    if (resourceObj instanceof Array) {
        resourceObj = orgResourceObject.resource[0];
    }
    loginDetails.displayName = resourceObj['@name'];
    loginDetails.guid = resourceObj['@guid'];
    console.log('Logged in as: ' + loginDetails.displayName);

   	return loginDetails;
}

function runPFServiceProcess(auth, pfPath, body) {
        // This call assumes your service process only returns one simple string response
        var options = {
            'headers': {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        if (body) {
            options['body'] = JSON.stringify(body);
        }

        // ActiveMatrix BPM Config params
        var bpmRestUrl = process.env.BPMRESTURL || 'http://localhost:8080/bpm/rest';

        var requestUrl = bpmRestUrl + '/pageflow/start/' + pfPath;
        console.log('Request URL = ' + requestUrl);
        var response = request('POST', requestUrl, options);
        console.log('Request Status Code = ' + response.statusCode);
        if (response.statusCode != 200) {
            console.log('Rest call failed: ' + response.body.toString('utf-8'));
            return -1;
        }

        var returnedData = null;
        var responseObject = JSON.parse(response.body.toString('utf-8'));
        console.log('Returned body: ' + response.body.toString('utf-8'));
        var frags = responseObject['xml-fragment'];
        if (frags && frags.pageData.payload.serializedPayload) {
            var payload = JSON.parse(frags.pageData.payload.serializedPayload);
            console.log('Payload: %s', JSON.stringify(payload));
            if (payload.items) {
                for (var i = 0; i < payload.items.length; i++) {
                    if (payload.items[i].mode == 'OUT') {
                        returnedData = payload.items[i]['$value'];
                        if (returnedData instanceof Array) {
                            returnedData = payload.items[i]['$value'];  //JGR: orginal with [0] at the end to return always no arrys
                        }
                        console.log('Returning data: %s', JSON.stringify(returnedData));
                        break;
                    }
                }
            } else {
                console.log('No items in payload');
            }
        } else {
            console.log('Rest response does not have payload');
        }
        return returnedData;
}


function runAPIcall(auth, methode, apiPath, body) {
        // This call assumes your service process only returns one simple string response
        var options = {
            'headers': {
                'Authorization': auth,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        if (body) {
            options['body'] = JSON.stringify(body);
        }

        // ActiveMatrix BPM Config params
        var bpmRestUrl = process.env.BPMRESTURL || 'http://localhost:8080/bpm/rest';

        var requestUrl = bpmRestUrl + apiPath;
        console.log('Request URL = ' + requestUrl);
        var response = request(methode, requestUrl, options);
        console.log('Request Status Code = ' + response.statusCode);
        if (response.statusCode != 200) {
            console.log('Rest call failed: ' + response.body.toString('utf-8'));
            return -1;
        }

        var returnedData = null;
        var responseObject = JSON.parse(response.body.toString('utf-8'));
        console.log('Returned body: ' + response.body.toString('utf-8'));
        
        returnedData = responseObject['xml-fragment'];

        return returnedData;
}


