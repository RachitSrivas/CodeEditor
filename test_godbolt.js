async function run() {
  const source = '#include <iostream>\\nint main() { std::cout << "Godbolt works!"; return 0; }';
  try {
    const res = await fetch('https://godbolt.org/api/compiler/cg141/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        source: source,
        options: {
          userArguments: '',
          executeParameters: { args: '' },
          compilerOptions: { executorRequest: true }
        }
      })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
run();
