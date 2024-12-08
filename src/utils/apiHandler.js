export async function sendRequest(method, url, headers = {}, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    }

    // Add body for POST, PUT, PATCH requests
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        // Parsing the body as JSON if it's a string
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
      } catch (e) {
        options.body = body;
      }
    }

    const startTime = performance.now()
    const response = await fetch(url, options)
    const endTime = performance.now()

    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // For DELETE requests that return no content
    if (response.status === 204) {
      responseData = 'Resource deleted successfully';
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      time: Math.round(endTime - startTime),
    }
  } catch (error) {
    throw {
      error: true,
      message: error.message,
      details: error
    }
  }
}