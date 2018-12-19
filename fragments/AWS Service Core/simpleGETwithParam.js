//
// --------------- AWS SDK Core to call any kind of custom Services -----------------------
// ... here just as Sample Fragments

// load AWS SDK module, which is always included in the runtime environment
const AWS = require('aws-sdk');

//
// --------------- TCI Service Descriptor -----------------------

// define target API as service
const svc = new AWS.Service({
 
    // TIBCO Cloud Integartion base API URL, can be even more secured using TIBCO Mashery.
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
            // get Data by a record id
            getData: {
                http: {
                    method: 'GET',
                    requestUri: '/cases/{Id}'
                },
                input: {
                    type: 'structure',
                    required: [ ],
					members: {
                        'Id': {
                            // all kinds of validators are available
                            type: 'string',
                            // include it in the call URI
                            location: 'uri',
                            // this is the name of the placeholder in the URI
                            locationName: 'Id'
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
svc.isGlobalEndpoint = true;

function getCaseDataById() {

	// GET cases by ID, here '1'
    svc.getData({Id: "1"}, (err, data) => {
        if (err) {
            console.error(':>> operation error:', err);
            return callback(err);
        }

        console.log('data:', data);

    });
}
