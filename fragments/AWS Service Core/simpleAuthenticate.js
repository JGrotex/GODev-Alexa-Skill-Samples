'use strict';

// ---------  Draft Sample  ------------
// never tested so far, need some time to do more testing on this ...

// Note this is JUST A DRAFT Idea!!!

//ToDo:
// Steps to perform
// - https://sso-ext.tibco.com/as/token.oauth2
// - https://<<your location>>.liveapps.cloud.tibco.com/idm/v1/login-oauth
// - create Case

//
// --------------- TIBCO Cloud Service Descriptor -----------------------

// load AWS SDK module, which is always included in the runtime environment
const AWS = require('aws-sdk');

// define our target API as a "service"
const service = new AWS.Service({

    // the API base URL
    endpoint: 'https://sso-ext.tibco.com',

    // don't parse API responses
    // (this is optional if you want to define shapes of all your endpoint responses)
    convertResponseTypes: false,

    // and now, our API endpoints
    apiConfig: {
        metadata: {
            protocol: 'rest-json' // we assume our API is JSON-based
        },
        operations: {

            // API authentication endpoint
            Authenticate: {
                http: {
                    method: 'GET',
                    requestUri: '/as/token.oauth2?grant_type=password'
                },
                input: {
                    type: 'structure',
                    required: [ 'username', 'password' ],
                    members: {
                        'username': {
                            // include it as a query string parameter in the call URL
                            location: 'header',
                            // parameter name
                            locationName: 'username'
                        },
                        'password': {
                            location: 'header', //header, querystring, binary ?
                            locationName: 'password',
                            // don't show the Password in the logs
                            sensitive: true
                        }
                    }
                },
                // get the authentication token from the response
                output: {
                    type: 'structure',
                    members: {
                        'AccessToken': {
                            // the token is returned as an HTTP response header
                            location: 'header',
                            // the header name
                            locationName: 'AccessToken'
                        }
                    }
                }
            },

            // example of how to send JSON data in the request body, to create a LiveApps case
            CreateCase: {
                http: {
                    method: 'POST',
                    requestUri: '/case'
                },
                input: {
                    type: 'structure',
                    required: [ 'auth', 'data' ],
                    // use 'data' for input request payload to LiveApps
                    payload: 'data',
                    members: {
                        'auth': {
                            location: 'header',
                            locationName: 'Authorization',
                            sensitive: true
                        },
                        'data': {
                            type: 'structure',
                            required: [ 'firstName', 'lastName' ],
                            // shape of body object
                            members: {
                                'firstName': {},
                                'lastName': {},
								'eMail': {}
                            }
                        }
                    }
                }
            }
        }
    }
});

// disable AWS region related login in the SDK
service.isGlobalEndpoint = true;

//
// --------------- TIBCO Cloud Service Call -----------------------

// and now we can call our target API!
exports.handler = function(event, context, callback) {

    // POST TIBCO Cloud authenticate
    service.authenticate({
        username: '<<your user account>>',
        password: '<<Secret Pass>>'
    }, (err, data) => {

        if (err) {
            console.error(':>> login error:', err);
            return callback(err);
        }

		// POST create LiveApps Case
        service.createCase({
            auth: `Bearer ${data.authToken}`,
            data: {
                firstName: 'George',
                lastName: 'Miller',
				eMail: 'gmiller@somedomain.com'
            }
        }, (err, data) => {

            if (err) {
                console.error(':>> operation error:', err);
                return callback(err);
            }

            console.log('new case created:', data);
            callback();
        });
    });
};

//more Details in AWS-SDK-JS
