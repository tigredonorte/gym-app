const { request } = require('http');
const { URL } = require('url');

const healthCheck = async () => {
  try {
    console.info('Starting health check...');
    const [apiResponse] = await Promise.allSettled([
      checkAPIHealth('http://nginx/api/'),
    ]);

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

healthCheck();
