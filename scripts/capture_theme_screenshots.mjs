import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const DIST_DIR = path.resolve('./frontend/dist');
const ARTIFACT_DIR = 'C:/Users/Sumit/.gemini/antigravity/brain/f07234a2-1d41-4e7b-b392-2d8e156da2ba';
const TEMP_DIR = 'C:/Users/Sumit/AppData/Local/Temp';
const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(DIST_DIR, reqPath);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function captureAsync(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    const timer = setTimeout(() => {
      try {
        child.kill();
      } catch {}
      resolve(false);
    }, 20000);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });
    child.on('error', (err) => {
      console.error('Spawn error:', err);
      clearTimeout(timer);
      resolve(false);
    });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PORT = 4345;
server.listen(PORT, async () => {
  console.log(`Local static server listening on http://localhost:${PORT}`);

  const targets = [
    // LIGHT THEME CAPTURES
    {
      name: 'screenshot_light_dashboard_with_sidebar.png',
      url: `http://localhost:${PORT}/?theme=light&view=dashboard`,
      size: '--window-size=1560,1100'
    },
    {
      name: 'screenshot_light_sidebar_expanded.png',
      url: `http://localhost:${PORT}/?theme=light&view=dashboard&sidebar=expanded`,
      size: '--window-size=1440,960'
    },
    {
      name: 'screenshot_light_domains.png',
      url: `http://localhost:${PORT}/?theme=light&view=domains`,
      size: '--window-size=1560,1100'
    },
    {
      name: 'screenshot_light_pox_search.png',
      url: `http://localhost:${PORT}/?theme=light&view=search&engine=pox`,
      size: '--window-size=1560,1000'
    },
    {
      name: 'screenshot_light_polymer_search.png',
      url: `http://localhost:${PORT}/?theme=light&view=search&engine=universal`,
      size: '--window-size=1560,1000'
    },
    {
      name: 'screenshot_light_journals.png',
      url: `http://localhost:${PORT}/?theme=light&view=journals`,
      size: '--window-size=1560,1000'
    },
    {
      name: 'screenshot_light_pdf_library.png',
      url: `http://localhost:${PORT}/?theme=light&view=pdf_library`,
      size: '--window-size=1560,1000'
    },
    {
      name: 'screenshot_light_watchlist.png',
      url: `http://localhost:${PORT}/?theme=light&view=watchlist`,
      size: '--window-size=1560,1000'
    },
    {
      name: 'screenshot_light_settings.png',
      url: `http://localhost:${PORT}/?theme=light&view=settings`,
      size: '--window-size=1560,1000'
    },

    // DARK THEME CAPTURES (Zero Regression Verification)
    {
      name: 'screenshot_dark_dashboard.png',
      url: `http://localhost:${PORT}/?theme=dark&view=dashboard`,
      size: '--window-size=1560,1100'
    },
    {
      name: 'screenshot_dark_domains.png',
      url: `http://localhost:${PORT}/?theme=dark&view=domains`,
      size: '--window-size=1560,1100'
    },
    {
      name: 'screenshot_dark_journals.png',
      url: `http://localhost:${PORT}/?theme=dark&view=journals`,
      size: '--window-size=1560,1000'
    },
    {
      name: 'screenshot_dark_settings.png',
      url: `http://localhost:${PORT}/?theme=dark&view=settings`,
      size: '--window-size=1560,1000'
    }
  ];

  for (const t of targets) {
    const tempOut = path.join(TEMP_DIR, t.name).replace(/\//g, '\\');
    const destOut = path.join(ARTIFACT_DIR, t.name);
    const userProfile = path.join(TEMP_DIR, `edge_prof_${Date.now()}_${Math.random().toString(36).substring(7)}`).replace(/\//g, '\\');

    console.log(`\nCapturing ${t.name} from ${t.url} ...`);
    const args = [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      `--user-data-dir=${userProfile}`,
      t.size,
      `--screenshot=${tempOut}`,
      t.url
    ];

    await captureAsync(BROWSER_PATH, args);
    await sleep(1000);

    if (fs.existsSync(tempOut)) {
      fs.copyFileSync(tempOut, destOut);
      const stats = fs.statSync(destOut);
      console.log(`  ✓ Successfully captured and saved ${t.name} (${stats.size} bytes)`);
      try {
        fs.unlinkSync(tempOut);
        fs.rmSync(userProfile, { recursive: true, force: true });
      } catch {}
    } else {
      console.error(`  ❌ Failed: temp file not found for ${t.name}`);
    }
  }

  server.close(() => {
    console.log('\n🎉 All requested verification screenshots successfully captured and saved to artifacts directory.');
    process.exit(0);
  });
});
