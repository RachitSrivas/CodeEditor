const fs = require('fs');
const http = require('http');

let isRunning = false;

async function runCode(filename) {
  if (isRunning) return;
  isRunning = true;
  console.log('\n\x1b[36m--- Executing ' + filename + ' ---\x1b[0m');
  try {
    const code = fs.readFileSync('./' + filename, 'utf-8');
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'gcc-head-c',
        code: code
      })
    });
    const result = await response.json();
    if (result.compiler_error) {
      process.stdout.write(result.compiler_error);
    }
    if (result.program_output) {
      process.stdout.write(result.program_output);
    }
    if (result.program_error) {
      process.stdout.write(result.program_error);
    }
  } catch (err) {
    console.error('Execution failed:', err.message);
  } finally {
    isRunning = false;
  }
}

runCode('main.c');

let debounceTimeout;
fs.watch('./', (eventType, filename) => {
  if (filename && filename.endsWith('c')) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      runCode(filename);
    }, 500);
  }
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<div style="font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; align-items: center; justify-content: center; text-align: center; color: #fff; background: #1e1e1e;"><h1 style="color: #61DAFB;">C Console</h1><p>Check the terminal below for output. Your code automatically re-runs on save.</p></div>');
});
server.on('error', (err) => {
  console.log('Dummy server error:', err.message);
});
server.listen(0, () => {
  console.log('\x1b[32mEnvironment ready.\x1b[0m');
});
