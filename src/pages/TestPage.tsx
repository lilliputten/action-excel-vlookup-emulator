import React from 'react';

import './TestPage.css';

import { versionInfo } from '@/config/env';
import reactLogo from '@/assets/react.svg';

import viteLogo from '/vite.svg';

export function TestPage() {
  const [count, setCount] = React.useState(0);
  const [result, _setResult] = React.useState('');

  return (
    <div className="relative flex flex-col gap-4 overflow-auto p-4">
      <div className="flex items-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-bold text-5xl">Vite + React</h1>

      <h2 className="text-bold text-2xl">API request result:</h2>
      <div className="relative flex flex-col gap-4 p-4 text-xs opacity-50">
        <pre>versionInfo: {versionInfo}</pre>
        <pre>result: {result}</pre>
      </div>
      <div className="card">
        <button className="btn btn-blue" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}
