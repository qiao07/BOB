export function buildPrototypeHTML(jsCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prototype</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; }
    #root { min-height: 100vh; }
    #error-box {
      display: none;
      position: fixed; inset: 0; background: #fff5f5;
      padding: 32px; font-family: monospace; font-size: 13px; line-height: 1.6;
      color: #c00; white-space: pre-wrap; overflow: auto; z-index: 9999;
      border-left: 4px solid #f00;
    }
  </style>
</head>
<body>
  <div id="error-box"></div>
  <div id="root"></div>
  <script>
    window.onerror = function(msg, _src, line, col, err) {
      var box = document.getElementById('error-box');
      box.style.display = 'block';
      box.textContent = 'Error (line ' + line + ':' + col + '):\\n' + (err ? err.stack : msg);
    };

    try {
      ${jsCode}

      if (typeof runApp !== 'function') {
        throw new Error('runApp function not found. AI may have returned unexpected output.');
      }
      runApp(document.getElementById('root'));
    } catch(e) {
      var box = document.getElementById('error-box');
      box.style.display = 'block';
      box.textContent = 'Startup Error:\\n' + (e && e.stack ? e.stack : String(e));
    }
  </script>
</body>
</html>`
}
