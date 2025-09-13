'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Import Bootstrap CSS
    import('bootstrap/dist/css/bootstrap.min.css');
    // Import Bootstrap JS
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}