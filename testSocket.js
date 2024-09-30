const ws = new WebSocket(websocketUrl);

  ws.on('open', () => {
    console.info(`Successfully connected to WebSocket at ${websocketUrl}.`);
    ws.close();
    resolve();
  });

  ws.on('error', (err) => {
    reject(new Error(`WebSocket connection failed at ${websocketUrl}: ${err.message}`));
  });
