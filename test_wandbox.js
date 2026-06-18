const compilers = [
  { name: 'cpp', compiler: 'gcc-head', code: '#include <iostream>\\nint main() { std::cout << "cpp works"; return 0; }' },
  { name: 'c', compiler: 'gcc-head-c', code: '#include <stdio.h>\\nint main() { printf("c works"); return 0; }' },
  { name: 'java', compiler: 'openjdk-head', code: 'class Main { public static void main(String[] args) { System.out.println("java works"); } }' },
  { name: 'python', compiler: 'cpython-head', code: 'print("python works")' }
];

async function run() {
  for (const tpl of compilers) {
    try {
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compiler: tpl.compiler, code: tpl.code })
      });
      const data = await res.json();
      console.log(tpl.name, '->', data.program_output || data.compiler_error || data);
    } catch (e) {
      console.log(tpl.name, 'error', e.message);
    }
  }
}
run();
