import React, { useState } from 'react';

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const getPistonLanguage = (lang) => {
  switch (lang.toLowerCase()) {
    case 'python':
      return { language: 'python', version: '3.10.0' };
    case 'javascript':
      return { language: 'javascript', version: '18.15.0' };
    case 'java':
      return { language: 'java', version: '15.0.2' };
    case 'c++':
      return { language: 'csharp', version: '5.0.10' };
    default:
      return { language: 'python', version: '3.10.0' };
  }
};

// 1. RECEIVE 'output' AND 'updateOutput' PROPS
const OutputPanel = ({ code, language, output, updateOutput }) => {
  // 2. REMOVE THE LOCAL OUTPUT STATE
  // const [output, setOutput] = useState('Click "Run Code" to see output...');
  
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false); // Keep local error state for styling

  const runCode = async () => {
    setLoading(true);
    setIsError(false);
    // 3. UPDATE RTDB SO EVERYONE SEES THE LOADING STATE
    updateOutput('Running code...');

    const { language: pistonLang, version } = getPistonLanguage(language);

    try {
      const response = await fetch(PISTON_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: pistonLang,
          version: version,
          files: [
            {
              name: `main.${pistonLang}`,
              content: code,
            },
          ],
          stdin: "",
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
        }),
      });

      const data = await response.json();

      if (data.run.stderr) {
        setIsError(true);
        // 4. UPDATE RTDB WITH THE ERROR
        updateOutput(data.run.stderr);
      } else {
        setIsError(false);
        // 5. UPDATE RTDB WITH THE SUCCESS OUTPUT
        updateOutput(data.run.stdout || '(No output)');
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      // 6. UPDATE RTDB WITH THE FAILURE MESSAGE
      updateOutput('Failed to run code. Check the console or API status.');
    }
    setLoading(false);
  };

  return (
    <div className="h-48 flex-shrink-0 bg-gray-950 p-4 border-t border-gray-700 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-400">Output:</h3>
        <button
          onClick={runCode}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-500"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>
      </div>
      {/* 7. DISPLAY THE 'output' PROP */}
      <pre className={`flex-1 text-white whitespace-pre-wrap overflow-auto ${isError ? 'text-red-400' : ''}`}>
        {output}
      </pre>
    </div>
  );
};

export default OutputPanel;