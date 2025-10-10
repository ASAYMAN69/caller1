const express = require('express');
let fetchFn;
try {
  fetchFn = fetch; 
} catch (e) {
  fetchFn = require('node-fetch'); 
}

// === Config Variables ===
const listen = '/l';
const call = ['https://invoiza.onrender.com/l', 'https://caller1.onrender.com/l'];

// === Initialize Express App ===
const app = express();
app.use(express.json());

// === Route Listener ===
app.all(listen, (req, res) => {
  res.json({ status: 'active' });
});

// === Function to Randomly Call APIs (Fire-and-Forget) ===
function callApisContinuously() {
  (async function loop() {
    while (true) {
      try {
        // Fire-and-forget each call
        call.forEach((url) => {
          console.log(`[${new Date().toISOString()}] Triggering call to: ${url}`);
          fetchFn(url).catch((err) => {
            console.error(`Error calling ${url}: ${err.message}`);
          });
        });

        // Random delay (1–10 seconds)
        const delaySeconds = Math.floor(Math.random() * 10) + 1;
        console.log(`Next round of calls in ${delaySeconds} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));

      } catch (err) {
        console.error('Unexpected error in call loop:', err.message);
      }
    }
  })();
}

// === Start Server and Begin Calling Loop ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, route: ${listen}`);
  callApisContinuously();
});
