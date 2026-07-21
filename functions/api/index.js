const TMDB_API_URL = 'https://api.themoviedb.org/3';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=UTF-8'
        }
    });
}

function getTmdbCredentials(env) {
    if (env.API_READ_ACCESS_TOKEN) {
        return {
            headers: {
                Authorization: `Bearer ${env.API_READ_ACCESS_TOKEN}`
            }
        };
    }

    if (env.API_KEY) {
        return { apiKey: env.API_KEY };
    }

    return null;
}

export async function onRequestGet({ request, env }) {
    const requestUrl = new URL(request.url);
    const endpoint = requestUrl.searchParams.get('endPoint');
    const credentials = getTmdbCredentials(env);

    if (!endpoint || !endpoint.startsWith('/') || endpoint.includes('://')) {
        return jsonResponse({ error: 'A valid TMDB endpoint is required.' }, 400);
    }

    if (!credentials) {
        console.error('Missing API_READ_ACCESS_TOKEN or API_KEY environment variable.');
        return jsonResponse({ error: 'The movie API is not configured.' }, 500);
    }

    const tmdbUrl = new URL(`${TMDB_API_URL}${endpoint}`);
    const forwardedParams = requestUrl.searchParams.get('params') || '';
    const params = new URLSearchParams(forwardedParams);

    // Credentials are always supplied by the server and cannot be overridden by clients.
    params.delete('api_key');
    params.forEach((value, key) => {
        if (key) {
            tmdbUrl.searchParams.set(key, value);
        }
    });

    const headers = credentials.headers || {};
    if (credentials.apiKey) {
        tmdbUrl.searchParams.set('api_key', credentials.apiKey);
    }

    try {
        const response = await fetch(tmdbUrl, { headers });

        if (!response.ok) {
            console.error(`TMDB request failed with status ${response.status}.`);
            return jsonResponse({ error: 'Unable to fetch data from The Movie Database API.' }, 502);
        }

        return new Response(response.body, {
            status: response.status,
            headers: {
                ...corsHeaders,
                'Content-Type': response.headers.get('Content-Type') || 'application/json; charset=UTF-8'
            }
        });
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Unknown TMDB request error.');
        return jsonResponse({ error: 'Unable to fetch data from The Movie Database API.' }, 502);
    }
}

export function onRequestOptions() {
    return new Response(null, { status: 204, headers: corsHeaders });
}
