const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let child = null;
let isRunning = false;

function runCode() {
  if (isRunning && child) {
    child.kill();
  }
  isRunning = true;
  console.log('\n\x1b[36m--- Executing index.js ---\x1b[0m');
  
  child = spawn('node', ['index.js'], { stdio: 'inherit' });
  
  child.on('close', () => {
    isRunning = false;
  });
}

runCode();

let debounceTimeout;
fs.watch('./index.js', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    runCode();
  }, 500);
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<div style="font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; align-items: center; justify-content: center; text-align: center; color: #fff; background: #1e1e1e;"><h1 style="color: #f7df1e;">JavaScript Console</h1><p>Check the terminal below for output. Your code automatically re-runs on save.</p></div>');
});
server.on('error', (err) => {
  console.log('Dummy server error:', err.message);
});
server.listen(0, () => {
  console.log('\x1b[32mEnvironment ready.\x1b[0m');
});
