const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'vibecode-starters');

const templates = [
  {
    name: 'python',
    mainFile: 'main.py',
    mainContent: 'print("Hello from Python!")\n',
    compiler: 'cpython-3.14.0',
    runCommand: null
  },
  {
    name: 'cpp',
    mainFile: 'main.cpp',
    mainContent: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}\n',
    compiler: 'gcc-head',
    runCommand: null
  },
  {
    name: 'c',
    mainFile: 'main.c',
    mainContent: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}\n',
    compiler: 'gcc-head-c',
    runCommand: null
  },
  {
    name: 'java',
    mainFile: 'Main.java',
    mainContent: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}\n',
    compiler: 'openjdk-jdk-22+36',
    runCommand: null
  },
  {
    name: 'javascript',
    mainFile: 'index.js',
    mainContent: 'console.log("Hello from JavaScript!");\n',
    runCommand: 'node'
  }
];

const getRunJsContent = (tpl) => {
  if (tpl.runCommand === 'node') {
    return `const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let child = null;
let isRunning = false;

function runCode() {
  if (isRunning && child) {
    child.kill();
  }
  isRunning = true;
  console.log('\\n\\x1b[36m--- Executing ${tpl.mainFile} ---\\x1b[0m');
  
  child = spawn('node', ['${tpl.mainFile}'], { stdio: 'inherit' });
  
  child.on('close', () => {
    isRunning = false;
  });
}

runCode();

let debounceTimeout;
fs.watch('./${tpl.mainFile}', () => {
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
  console.log('\\x1b[32mEnvironment ready.\\x1b[0m');
});
`;
  }

  return `const fs = require('fs');
const http = require('http');

let isRunning = false;

async function runCode(filename) {
  if (isRunning) return;
  isRunning = true;
  console.log('\\n\\x1b[36m--- Executing ' + filename + ' ---\\x1b[0m');
  try {
    const code = fs.readFileSync('./' + filename, 'utf-8');
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: '${tpl.compiler}',
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

runCode('${tpl.mainFile}');

let debounceTimeout;
fs.watch('./', (eventType, filename) => {
  if (filename && filename.endsWith('${tpl.mainFile.split('.').pop()}')) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      runCode(filename);
    }, 500);
  }
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<div style="font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; align-items: center; justify-content: center; text-align: center; color: #fff; background: #1e1e1e;"><h1 style="color: #61DAFB;">${tpl.name.toUpperCase()} Console</h1><p>Check the terminal below for output. Your code automatically re-runs on save.</p></div>');
});
server.on('error', (err) => {
  console.log('Dummy server error:', err.message);
});
server.listen(0, () => {
  console.log('\\x1b[32mEnvironment ready.\\x1b[0m');
});
`;
};

templates.forEach(tpl => {
  const tplDir = path.join(basePath, tpl.name);
  if (!fs.existsSync(tplDir)) {
    fs.mkdirSync(tplDir, { recursive: true });
  }

  // package.json
  const pkgJson = {
    name: `${tpl.name}-playground`,
    version: "1.0.0",
    scripts: {
      start: "node run.js"
    }
  };
  fs.writeFileSync(path.join(tplDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

  // main file
  fs.writeFileSync(path.join(tplDir, tpl.mainFile), tpl.mainContent);

  // run.js
  fs.writeFileSync(path.join(tplDir, 'run.js'), getRunJsContent(tpl));

  console.log(`Created template for ${tpl.name}`);
});
