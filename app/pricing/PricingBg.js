'use client';

import { useEffect, useRef } from 'react';

// A subtle, slowly-morphing colored-gradient wireframe model behind the pricing
// page — inspired by gradient wireframe 3D renders, built on Three.js loaded
// from a CDN so it adds no build dependency. Falls back silently if WebGL or
// the CDN is unavailable, or when the user prefers reduced motion.
const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

// Pulse palette stops (indigo → cyan → pink) used for the vertex gradient.
const STOPS = [
  [0x5f, 0x6e, 0xe7], // indigo  #5f6ee7
  [0x5f, 0xc9, 0xe7], // cyan    #5fc9e7
  [0x85, 0xda, 0xeb], // ice     #85daeb
  [0xff, 0x5d, 0xcc], // pink    #ff5dcc
];

function gradientColor(t) {
  // t in [0,1] → interpolate across STOPS
  const seg = Math.min(STOPS.length - 2, Math.floor(t * (STOPS.length - 1)));
  const lt = t * (STOPS.length - 1) - seg;
  const a = STOPS[seg], b = STOPS[seg + 1];
  return [
    (a[0] + (b[0] - a[0]) * lt) / 255,
    (a[1] + (b[1] - a[1]) * lt) / 255,
    (a[2] + (b[2] - a[2]) * lt) / 255,
  ];
}

export default function PricingBg() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanup = () => {};
    let cancelled = false;

    function loadThree() {
      return new Promise((resolve, reject) => {
        if (window.THREE) return resolve(window.THREE);
        const existing = document.querySelector(`script[src="${THREE_SRC}"]`);
        if (existing) {
          existing.addEventListener('load', () => resolve(window.THREE));
          existing.addEventListener('error', reject);
          return;
        }
        const s = document.createElement('script');
        s.src = THREE_SRC;
        s.async = true;
        s.onload = () => resolve(window.THREE);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    loadThree().then((THREE) => {
      if (cancelled || !mountRef.current || !THREE) return;
      const mount = mountRef.current;
      let W = mount.clientWidth || window.innerWidth;
      let H = mount.clientHeight || window.innerHeight;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch (e) { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      // Base geometry — an icosphere; we displace its vertices over time for a
      // slow, organic morph and color them by their original height.
      const geo = new THREE.IcosahedronGeometry(2.7, 4);
      const pos = geo.attributes.position;
      const n = pos.count;
      const base = new Float32Array(n * 3);
      for (let i = 0; i < n * 3; i++) base[i] = pos.array[i];

      // Per-vertex gradient colors (by normalized Y).
      const colors = new Float32Array(n * 3);
      let minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < n; i++) { const y = base[i * 3 + 1]; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      for (let i = 0; i < n; i++) {
        const t = (base[i * 3 + 1] - minY) / (maxY - minY || 1);
        const c = gradientColor(t);
        colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.MeshBasicMaterial({
        wireframe: true, vertexColors: true, transparent: true, opacity: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // A second, larger faint shell for depth.
      const geo2 = new THREE.IcosahedronGeometry(3.7, 2);
      const cols2 = new Float32Array(geo2.attributes.position.count * 3);
      for (let i = 0; i < geo2.attributes.position.count; i++) {
        const c = gradientColor(1 - i / geo2.attributes.position.count);
        cols2[i * 3] = c[0]; cols2[i * 3 + 1] = c[1]; cols2[i * 3 + 2] = c[2];
      }
      geo2.setAttribute('color', new THREE.BufferAttribute(cols2, 3));
      const mesh2 = new THREE.Mesh(geo2, new THREE.MeshBasicMaterial({
        wireframe: true, vertexColors: true, transparent: true, opacity: 0.16,
      }));
      scene.add(mesh2);

      let raf = 0;
      const start = performance.now();
      function frame(now) {
        const t = (now - start) / 1000;
        // gentle rotation
        mesh.rotation.y = t * 0.12;
        mesh.rotation.x = Math.sin(t * 0.18) * 0.25;
        mesh2.rotation.y = -t * 0.06;
        mesh2.rotation.x = Math.cos(t * 0.1) * 0.2;
        // organic vertex displacement
        const arr = pos.array;
        for (let i = 0; i < n; i++) {
          const ix = i * 3;
          const bx = base[ix], by = base[ix + 1], bz = base[ix + 2];
          const d = 1 + 0.06 * Math.sin(t * 0.8 + bx * 1.6 + by * 1.2)
                      + 0.04 * Math.cos(t * 0.6 + bz * 1.8);
          arr[ix] = bx * d; arr[ix + 1] = by * d; arr[ix + 2] = bz * d;
        }
        pos.needsUpdate = true;
        renderer.render(scene, camera);
        if (!reduce) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      if (reduce) { frame(performance.now()); } // single static draw

      function onResize() {
        W = mount.clientWidth || window.innerWidth;
        H = mount.clientHeight || window.innerHeight;
        camera.aspect = W / H; camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      }
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        geo.dispose(); geo2.dispose(); mat.dispose();
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    }).catch(() => {});

    return () => { cancelled = true; cleanup(); };
  }, []);

  return <div className="pricing-bg" aria-hidden="true" ref={mountRef} />;
}
