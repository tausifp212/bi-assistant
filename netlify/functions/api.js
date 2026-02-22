const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// FIXED: Correct workflow URL and API key
const API_URL = 'https://sim.so/api/workflows/b96d0050-bea3-48d4-a56d-397a7c2df646/execute';
const API_KEY = 'sk-sim-hzwRhTECA4DJHSm7BZSNDM28K2ai0pt2';
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: event.body
        });
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            return { statusCode: 200, headers, body: JSON.stringify(data) };
        } catch (parseError) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Invalid JSON response',
                    raw: text.substring(0, 200),
                    status: response.status
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message, type: error.name })
        };
    }
};
