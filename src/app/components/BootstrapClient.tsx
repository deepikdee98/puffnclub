'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Bootstrap CSS is loaded via CDN in app/layout.tsx head
    // Import Bootstrap JS only if needed on client
    try {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    } catch (e) {
      // If module not present (using CDN), safely ignore
      console.warn('Bootstrap JS local require skipped. Using CDN.');
    }
  }, []);

  return null;
}