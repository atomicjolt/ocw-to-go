console.log("The Worker Ran");
importScripts("/scripts/jszip.min.js");

self.addEventListener('install', event => {
  console.log("The Worker Installed", event);
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', event => {
  console.log("The Worker Activated", event);
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

addEventListener('fetch', event => {
  console.log("The Worker Fetched", event);
  // if (isCacheable(event.request)) {
  event.respondWith(cacheFirstWithRefresh(event.request));
  // }
});

addEventListener('message', event => {
  console.log("The Worker Received a Message", event);
  if (typeof event.data === 'object' && !Array.isArray(event.data) && event.data !== null) {
    if (event.data.type === 'downloadCourse') {
      downloadCourse(event.data.path, event.data.courseId, event.source);
    }
  }
  // event.source.postMessage("Hello from the worker!");
});

// function isCacheable(request) {
//   const url = new URL(request.url);
//   return !url.pathname.endsWith(".json");
// }

async function cacheFirstWithRefresh(request) {
  const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open("AssetCacheV1");
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return (await caches.match(request)) || (await fetchResponsePromise);
}

async function downloadCourse(path, courseId, client) {
  console.log("The Worker is Downloading a Course", path);
  const resp = await fetch(path);
  console.log(1)
  const zipBlob = await resp.blob();
  console.log(2)
  const zip = await new JSZip.loadAsync(zipBlob);
  console.log(3)
  const cache = await caches.open(`course-${courseId}`);
  console.log(4)

  const paths = [];
  zip.forEach((path, fileData) => {
    if (!fileData.dir) {
      paths.push(path);
    }
  })

  for (const path of paths) {
    const mime = mimeFromExtension(path);
    const fileData = await zip.file(path).async("blob");
    await cache.put(`/courses/course-1/${path}`, new Response(fileData, { headers: { 'Content-Type': mime } }));
  }
}

function mimeFromExtension(path) {
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
