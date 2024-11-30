import { Buffer } from 'buffer/';
import 'highlight.js/styles/base16/tomorrow-night.css';

import hljs from 'highlight.js';

// ----------------------------------------------------------------------

declare global {
  interface Window {
    hljs: any;
    tronWeb: any;
    Buffer: Buffer;
  }
}

hljs.configure({
  languages: ['javascript', 'sh', 'bash', 'html', 'scss', 'css', 'json'],
});

if (typeof window !== 'undefined') {
  window.hljs = hljs;
}
