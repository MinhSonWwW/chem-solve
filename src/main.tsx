import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import { startClassroomSync } from './features/classroom/outbox';
import './index.css';

// autoUpdate: when a new deployment's service worker activates, reload once to show it.
registerSW({ immediate: true });
// Send class reports queued while offline, now and whenever the device reconnects.
startClassroomSync();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Honour the OS "reduce motion" setting for every motion/react animation. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>
);
