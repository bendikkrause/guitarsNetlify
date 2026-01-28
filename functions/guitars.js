const guitars = require('../guitarData.js');

exports.handler = async (event) => {
    const { httpMethod, body, queryStringParameters } = event;

    if (httpMethod === 'GET') {
        // Get guitars logic
        return {
            statusCode: 200,
            body: JSON.stringify(guitars)
        };
    }

    if (httpMethod === 'POST') {
        const { v4: uuidv4 } = await import('uuid');
        const newGuitar = JSON.parse(body);
        newGuitar.id = uuidv4();
        guitars.push(newGuitar);

        return {
            statusCode: 201,
            body: JSON.stringify(newGuitar)
        };
    }

    if (httpMethod === 'DELETE') {
        const { id } = queryStringParameters || {};
        
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Guitar ID is required' })
            };
        }

        const index = guitars.findIndex(guitar => guitar.id === id);
        
        if (index === -1) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Guitar not found' })
            };
        }

        const deletedGuitar = guitars.splice(index, 1)[0];
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Guitar deleted successfully', guitar: deletedGuitar })
        };
    }

    // Handle unsupported methods
    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
    };
};