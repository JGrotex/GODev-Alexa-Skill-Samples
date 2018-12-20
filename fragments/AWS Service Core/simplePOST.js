//
// --------------- AWS SDK Core to call any kind of custom Services -----------------------
// ... here just as Sample Fragments

// load AWS SDK module, which is always included in the runtime environment
const AWS = require('aws-sdk');

//
// --------------- TCI Service Descriptor -----------------------

// define target API as service
const service = new AWS.Service({
 
    // TIBCO Cloud Integration base API URL, can be even more secured using TIBCO Mashery.
    endpoint: 'https://<<your location>>.integration.cloud.tibcoapps.com/<<your Service Endpoint key>>',
 
    // don't parse API responses (optional)
	// you can define 'shapes' of all your endpoint responses
    convertResponseTypes: false,
 
    // TCI Flogo API REST
    apiConfig: {
        metadata: {
            protocol: 'rest-json' // assuming our API is JSON-based
        },
        operations: {
 
			// TCI Flogo custom Endpoint
            // post example how to send JSON data in the request body
            CreateCase: {
                http: {
                    method: 'POST',
                    requestUri: '/case'
                },
                input: {
                    type: 'structure',
                    required: [ 'data' ],
                    // use 'data' input within the request payload
                    payload: 'data',
                    members: {
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

//
// --------------- TCI Service Call -----------------------

// disable AWS region related login in the SDK
service.isGlobalEndpoint = true;

function postNewCaseData() {

	// POST Request with two body Parameter
    service.createCase({
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
 
        console.log('new record:', data);
        callback();
    });
}
