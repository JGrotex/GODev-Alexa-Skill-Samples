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

//
// --------------- TCI Service Call -----------------------

// disable AWS region related login in the SDK
service.isGlobalEndpoint = true;

function getCases() {

    service.getData({}, (err, data) => {
        if (err) {
            console.error(':>> operation error:', err);
            return callback(err);
        }

        console.log('data:', data);

    });
}
