import { request as _request } from 'http';

const options = {
  host: 'localhost',
  port: 3000, // Your app's port
  timeout: 2000, // Timeout to wait for a response (in milliseconds)
};

const request = _request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('ERROR', err);
  process.exit(1);
});

request.end();
