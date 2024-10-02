import JSZip from 'jszip';

export type {};
declare const self: ServiceWorkerGlobalScope;

console.log("The Worker Ran");

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/styles/pico.min.css',
  '/app.js',
  '/manifest.json',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
  // '/downloads/video.mp4'
];

self.addEventListener('install', event => {
  console.log("The Worker Installed", event);
  event.waitUntil((async () => {
    const cache = await caches.open("pwa-assets");
    await cache.addAll(ASSETS_TO_CACHE);
  })()); 
  // Activate worker immediately
  self.skipWaiting()
});

self.addEventListener('activate', event => {
  console.log("The Worker Activated", event);
  
  // Become available to all pages
  event.waitUntil(self.clients.claim());
});

addEventListener('fetch', (event: FetchEvent) => {
  console.log("The Worker Fetched", event.request.url);
  event.respondWith(cacheFirst(event.request));
});

addEventListener('message', event => {
  console.log("The Worker Received a Message", event);
  if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
    if (event.data.type === 'downloadCourse') {
      downloadCourse(event.data.path, event.data.courseId, event.source!);
    }
  }
  // event.source.postMessage("Hello from the worker!");
});

async function cacheFirst(request: Request) {
  return (await caches.match(request)) || await fetch(request);
  // return (await fileFromCache(request)) || await fetch(request);
}

// Disabled because this currently applies to all PDFs, but it does work
async function fileFromCache(request: Request): Promise<Response | undefined> {
  const response = await caches.match(request);
  if (response && request.url.endsWith('.pdf')) {
    response.headers.set('Content-Disposition', 'attachment; filename="test2.pdf');
  }

  return Promise.resolve(response);
}

async function downloadCourse(path: string, courseId: string, client: MessageEventSource) {
  client.postMessage({ type: 'statusUpdate', courseId, status: 'Downloading' });
  const resp = await fetch(path);
  client.postMessage({ type: 'statusUpdate', courseId, status: 'Saving' });
  const zipBlob = await resp.blob();
  const zip = await new JSZip().loadAsync(zipBlob);
  const cache = await caches.open(`course-${courseId}`);

  const paths: string[] = [];
  zip.forEach((path, fileData) => {
    if (!fileData.dir) {
      paths.push(path);
    }
  })

  for (const path of paths) {
    const mime = mimeFromExtension(path);
    const fileData = await zip.file(path)!.async("blob");
    await cache.put(`/courses/${courseId}/${path}`, new Response(fileData, { headers: { 'Content-Type': mime } }));
  }
  client.postMessage({ type: 'statusUpdate', courseId, status: 'Ready' });
}

function mimeFromExtension(path: string) {
  const extension = path.split('.').pop();
  switch (extension) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'woff':
      return 'font/woff';
    case 'woff2':
      return 'font/woff2';
    case 'ttf':
      return 'font/ttf';
    case 'xml':
      return 'application/xml';
    case 'pdf':
      return 'application/pdf';
    case 'ico':
      return 'image/x-icon';
    default:
      console.log(`Unknown extension: ${extension}`);
      return 'text/plain';
  }
}
