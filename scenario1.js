import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
    scenarios: {
        post: {
            executor: 'constant-vus', // Change executor to 'constant-vus'
            vus: 50, // Number of VUs (Virtual Users)
            duration: '60s',
            exec: 'postScenario', // Execute the postScenario function
        },
        put: {
            executor: 'constant-vus', // Change executor to 'constant-vus'
            vus: 50, // Number of VUs (Virtual Users)
            duration: '60s',
            exec: 'putScenario', // Execute the putScenario function
        },
    },
};

export function assertResponseCode (response, expectedStatusCode) {
    check(response, {
        [`Status code is ${expectedStatusCode}`]: (r) => r.status == expectedStatusCode
    });
}

export function assertResponseHeader (response, expectedContentType) {
    check(response, {
        [`Content-Type header is ${expectedContentType}`]: (r) => r.headers == expectedContentType
    });
}

export function assertResponseBody (response, fieldName, expectedValue) {
    check(response, {
        [`Response body field '${fieldName}' is '${expectedValue}'`]: (body) => body[fieldName] === expectedValue
    });
}


const baseURL = 'https://reqres.in';

// Create Scenario POST Request

export function postScenario () {
    const postEndPoint = '/api/users';
    const headers = { 'Content-Type': 'application/json' };
    const postPayLoad = JSON.stringify({
        "name": "morpheus",
        "job": "leader"
    });

    // Make a POST request with the payload
    const postResponse = http.post(`${baseURL}${postEndPoint}`, postPayLoad, { headers });

    // Make an Assertions
    assertResponseCode(postResponse, 201)
    assertResponseHeader(postResponse, `${headers}` );

};
// Create Scenario PUT Request
export function putScenario () {
    const putEndPoint = '/api/users/2';
    const headers = { 'Content-Type': 'application/json' };
    const putPayLoad = JSON.stringify({
        "name": "morpheus",
        "job": "zion resident",
    });
    // Make a PUT request with the payload
    const putResponse = http.put(`${baseURL}${putEndPoint}`, putPayLoad,  { headers });

    // Make an Assertions
    assertResponseCode(putResponse, 200);
    assertResponseHeader(putResponse, `${headers}` );
};


export function handleSummary(data) {
    return {
      "scenario1-result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  };

