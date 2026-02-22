const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const API_URL = 'https://simstudio.ai/api/workflows/c63a2d64-d6b1-4b40-9057-f350d5b2b075/execute';
const API_KEY = 'sk-sim-Gy3SlBZ8oM6Y3au99qVAeLZfdelO_NeL';
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
        console.log('Calling API:', API_URL);
        console.log('Request body:', event.body);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: event.body
        });
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response body:', text.substring(0, 500));
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
        console.error('Fetch error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message,
                type: error.name
            })
        };
    }
};
