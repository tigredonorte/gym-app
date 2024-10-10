const { request } = require('http');
const { URL } = require('url');
const { io } = require('socket.io-client');

const healthCheck = async () => {
  try {
    console.info('Starting health check...');
    const [websocketResponse, apiResponse] = await Promise.allSettled([
      checkWebSocketConnection('ws://nginx/ws'),
      checkAPIHealth('http://nginx/api/'),
    ]);

    if (websocketResponse.status === 'rejected' && apiResponse.status === 'rejected') {
      throw new Error('Both WebSocket and API health checks failed.');
    }

    if (websocketResponse.status === 'rejected') {
      throw websocketResponse.reason;
    }

    if (apiResponse.status === 'rejected') {
      throw apiResponse.reason;
    }

    console.info('Health check passed.');
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error.message);
    process.exit(1);
  }
};

const checkAPIHealth = async (apiUrl) =>  new Promise((resolve, reject) => {
  console.info(`Checking API health at: ${apiUrl}`);
  const url = new URL(apiUrl);
  const req = request({
    host: url.hostname,
    port: url.port || 80,
    timeout: 2000,
    method: 'GET',
    path: url.pathname,
  }, (res) => {
    console.info(`API response status code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.info(`Successfully connected to API at ${apiUrl}.`);
      resolve();
    } else {
      reject(new Error(`API health check failed with status code: ${res.statusCode}`));
    }
  });

  req.on('error', (err) => {
    reject(new Error(`API health check failed: ${err.message}`));
  });

  req.on('timeout', () => {
    reject(new Error('API health check timed out.'));
  });

  req.end();
});


const checkWebSocketConnection = (websocketUrl) => new Promise((resolve, reject) => {
  try {
    const url = new URL(websocketUrl);
    const path = url.pathname === '/' ? '/ws' : url.pathname;
    const urlParsed = `${url.protocol}//${url.hostname}${path}`;

    console.info(`Attempting to connect to WebSocket at: ${urlParsed}`);
    const socket = io(urlParsed, {
      path: path,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.info(`Successfully connected to WebSocket at ${websocketUrl}.`);
      socket.disconnect();
      resolve();
    });

    socket.on('connect_error', (err) => {
      console.error(`WebSocket connection error: ${err.message}`, err);
      reject(err);
    });
  } catch (error) {
    reject(new Error('WebSocket exception'));
  }
});


healthCheck();
