// KeybindingProvider.jsx
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

export const KeybindingsContext = createContext(null);

export default function KeybindingProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // for showing fallback UI if browser blocks the shortcut
  const [fallback, setFallback] = useState({ visible: false, path: null });

  // keep a set of currently pressed physical keys (event.code)
  const pressed = useRef(new Set());
  // throttle to avoid double firing
  const lastTriggered = useRef({});

  // helper: test recent trigger
  const isRecentlyTriggered = (key, ms = 700) => {
    const now = Date.now();
    if (!lastTriggered.current[key]) return false;
    return now - lastTriggered.current[key] < ms;
  };
  const markTriggered = (key) => {
    lastTriggered.current[key] = Date.now();
  };

  useEffect(() => {
    // Map of logical shortcut -> target path
    // We'll detect combos using event.code(s) + modifier flags.
    const singleKeyMap = {
      // key code -> path (require ctrl/meta)
      KeyA: '/student/add',      // ctrl+a or ctrl+alt+a
      KeyS: '/student/active',   // ctrl+s or ctrl+alt+s
      KeyC: '/course/add',       // ctrl+c or ctrl+alt+c
      KeyP: '/payment/add',      // ctrl+p or ctrl+alt+p
      KeyT: '/transaction/add',  // ctrl+t or ctrl+alt+t  (may be reserved)
    };

    // special multi-letter chord: Ctrl+T+A -> /transaction/all
    const multiChord = {
      // set of codes required (besides ctrl/meta)
      'KeyT+KeyA': '/transaction/all',
    };

    function isTypingTarget(t) {
      const n = t?.nodeName;
      return (
        n === 'INPUT' ||
        n === 'TEXTAREA' ||
        n === 'SELECT' ||
        (t && t.isContentEditable)
      );
    }

    // attempt navigation with prevention; if prevention fails show fallback toast
    function tryNavigate(path, e) {
      // throttle by path
      if (isRecentlyTriggered(path, 700)) return;
      markTriggered(path);

      let prevented = false;
      try {
        e.preventDefault();
        prevented = !!e.defaultPrevented;
      } catch (err) {
        console.warn('preventDefault threw', err);
      }
      try { e.stopPropagation(); } catch (_) {}

      if (!prevented) {
        // Browser refused to let JS cancel the default — show fallback UI
        setFallback({ visible: true, path });
        // attempt best-effort navigation after a tiny delay
        setTimeout(() => {
          if (location.pathname !== path) {
            try { navigate(path); } catch (err) { window.location.assign(path); }
          }
        }, 50);
        return;
      }

      // prevented succeeded — navigate if necessary
      if (location.pathname !== path) {
        navigate(path);
      }
    }

    function checkAndHandle(e) {
      if (isTypingTarget(e.target)) return;

      // normalize: ctrl or meta acts as the main modifier
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (!isCtrlOrMeta) return;

      // Build current pressed codes snapshot
      const codes = new Set(pressed.current);
      // ensure current event.code is included (sometimes it may not be yet)
      if (e.code) codes.add(e.code);

      // 1) check multi-letter chords first (e.g., KeyT + KeyA)
      for (const combo of Object.keys(multiChord)) {
        const required = combo.split('+'); // e.g., ['KeyT','KeyA']
        const hasAll = required.every((c) => codes.has(c));
        if (hasAll) {
          const path = multiChord[combo];
          tryNavigate(path, e);
          return; // stop after a match
        }
      }

      // 2) check single-letter shortcuts (KeyA/KeyS/etc) — user allowed ctrl or ctrl+alt
      // We check the event.code if available, else find any of codes set
      // Prefer event.code to reduce false positives
      const codeToCheck = e.code || Array.from(codes)[0];

      if (codeToCheck && singleKeyMap[codeToCheck]) {
        const targetPath = singleKeyMap[codeToCheck];
        tryNavigate(targetPath, e);
        return;
      }

      // as defensive fallback: if event.code not present, try scanning codes for any mapped one
      for (const c of codes) {
        if (singleKeyMap[c]) {
          tryNavigate(singleKeyMap[c], e);
          return;
        }
      }
    }

    // Keydown: add to pressed set then check
    function onKeyDown(e) {
      // add pressed physical code
      if (e.code) pressed.current.add(e.code);

      // debug: (remove or comment out in production)
      // console.debug('keydown', { code: e.code, key: e.key, ctrl: e.ctrlKey, meta: e.metaKey, alt: e.altKey });

      checkAndHandle(e);
    }

    // Keyup: remove from pressed set
    function onKeyUp(e) {
      if (e.code) {
        pressed.current.delete(e.code);
      }
    }

    // When window loses focus, clear pressed set (avoid stuck keys)
    function onBlur() {
      pressed.current.clear();
    }

    const opts = { capture: true, passive: false };
    window.addEventListener('keydown', onKeyDown, opts);
    window.addEventListener('keyup', onKeyUp, opts);
    window.addEventListener('blur', onBlur);

    // Also listen on document as defensive measure
    document.addEventListener('keydown', onKeyDown, opts);
    document.addEventListener('keyup', onKeyUp, opts);

    return () => {
      window.removeEventListener('keydown', onKeyDown, opts);
      window.removeEventListener('keyup', onKeyUp, opts);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('keydown', onKeyDown, opts);
      document.removeEventListener('keyup', onKeyUp, opts);
    };
  }, [navigate, location]);

  // Simple fallback toast UI
  const FallbackToast = () => {
    if (!fallback.visible || !fallback.path) return null;
    return (
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          padding: 12,
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 6px 20px rgba(0,0,0,0.14)',
          zIndex: 9999,
          maxWidth: 320,
        }}
        role="dialog"
        aria-live="polite"
      >
        <div style={{ marginBottom: 8, fontSize: 14 }}>
          The keyboard shortcut was blocked by your browser or an extension.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              setFallback({ visible: false, path: null });
              try {
                navigate(fallback.path);
              } catch (err) {
                window.location.assign(fallback.path);
              }
            }}
          >
            Go to {fallback.path}
          </button>
          <button onClick={() => setFallback({ visible: false, path: null })}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <KeybindingsContext.Provider value={null}>
      {children}
      <FallbackToast />
    </KeybindingsContext.Provider>
  );
}
