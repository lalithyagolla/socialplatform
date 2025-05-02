// This is a mock service worker file that would intercept fetch requests in a real app
// For demo purposes only - this would be replaced with a real backend API
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isAdmin: false
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true
  }
];

const mockFeeds = [
  // Feed items would be here
];

const mockTransactions = [
  // Transaction data would be here
];

self.addEventListener('fetch', (event) => {
  // Mock API handlers would be implemented here
});