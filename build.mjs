
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

await mkdir('public', { recursive: true });
await copyFile('index.html', 'public/index.html');

await mkdir('dist', { recursive: true });

const source = await readFile('game.ts', 'utf8');
const result = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022
  }
});

if (result.diagnostics?.some(
  d => d.category === ts.DiagnosticCategory.Error
)) {
  throw new Error('Game service transpilation failed');
}

await writeFile('dist/game-handler.mjs', result.outputText);

console.log('Render production build completed.');
