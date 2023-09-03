import { group } from "k6";
import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
    vus: 1000,
    iterations: 3500,
    thresholds: {
        'http_req_duration': ['p(95)<2000'],
    },
};


export default function(postResponse, putResponse) {
    
    group('postScenario', function () {

        postResponse = http.post('https://reqres.in/api/users/', '{"name":"morpheus","job":"leader"}', {
        headers: {
            'content-type': 'application/json',
        },
        });
        check(postResponse, { 'status equals 201': postResponse => postResponse.status.toString() === '201' })

    });

    group('putScenario', function () {

        putResponse = http.put('https://reqres.in/api/users/2', '{"name":"morpheus","job":"pedagang"}', {
        headers: {
            'Content-Type': 'application/json',
        },
        });
        check(putResponse, { 'status equals 200': putResponse => putResponse.status.toString() === '200' });
                
    });
    
      // Automatically added sleep
    sleep(2)

};


export function handleSummary(data) {
    return {
      "scenario2-result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  };