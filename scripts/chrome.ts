import {existsSync} from 'node:fs';
import puppeteer, {type Browser} from 'puppeteer';

// Headless Chrome for the build scripts (diagram rendering and the checks on the built site).

/** Chrome to drive: PUPPETEER_EXECUTABLE_PATH, else a locally installed Chrome or Chromium, else Puppeteer's own. */
const findChrome = async (): Promise<string> => {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv) {
    if (!existsSync(fromEnv)) throw new Error(`PUPPETEER_EXECUTABLE_PATH points at ${fromEnv}, which does not exist`);
    return fromEnv;
  }
  const candidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ];
  const found = candidates.find((path) => existsSync(path));
  if (found) return found;
  const bundled = await puppeteer.executablePath();
  if (existsSync(bundled)) return bundled;
  throw new Error('No Chrome or Chromium found. Install one, or set PUPPETEER_EXECUTABLE_PATH to its executable.');
};

export const launchChrome = async (): Promise<Browser> =>
  puppeteer.launch({
    executablePath: await findChrome(),
    headless: true,
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  });
