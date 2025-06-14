
// Service Worker for PWA and Push Notifications
const CACHE_NAME = 'sustainconnect-v2';
const STATIC_CACHE = 'sustainconnect-static-v2';
const DYNAMIC_CACHE = 'sustainconnect-dynamic-v2';

// Resources to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Handle different types of requests
  if (STATIC_ASSETS.some(asset => request.url.endsWith(asset))) {
    // Cache first for static assets
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.url.includes('/api/') || request.url.includes('supabase')) {
    // Network first for API calls
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Stale while revalidate for other resources
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Cache first strategy - good for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network first strategy - good for API calls
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale while revalidate strategy - good for pages
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Push event handler
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  const options = {
    body: 'You have a new delivery update!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.message || options.body;
      options.title = data.title || 'SustainConnect';
      options.data = { ...options.data, ...data };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('SustainConnect', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/delivery/active-deliveries')
    );
  } else if (event.action === 'close') {
    return;
  } else {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'delivery-update') {
    event.waitUntil(syncDeliveryUpdates());
  } else if (event.tag === 'offline-actions') {
    event.waitUntil(syncOfflineActions());
  }
});

async function syncDeliveryUpdates() {
  try {
    console.log('Syncing delivery updates...');
    // Handle delivery updates when back online
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function syncOfflineActions() {
  try {
    console.log('Syncing offline actions...');
    // Handle queued actions when back online
  } catch (error) {
    console.error('Offline sync failed:', error);
  }
}
