import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const COLORS = ['#6B705C', '#A8B898', '#8B9A7B', '#C4D0B4', '#7A8B6A'];
const PARTICLE_COUNT = 120;
const BACTERIA_COUNT = 45;
const CELL_COUNT = 20;
const DNA_COUNT = 8;
const CONNECTION_DISTANCE = 1.8;

/* ── Build a single DNA helix segment as a Group ── */
function createDNAHelix(color) {
  const group = new THREE.Group();
  const segments = 10;
  const height = 0.7;
  const radius = 0.1;
  const strandMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7,
  });
  const rungMat = new THREE.MeshBasicMaterial({
    color: '#C4D0B4',
    transparent: true,
    opacity: 0.35,
  });
  const sphereGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const rungGeo = new THREE.CylinderGeometry(0.006, 0.006, radius * 2, 4);

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const y = t * height - height / 2;
    const angle = t * Math.PI * 4;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    // Strand nodes
    const s1 = new THREE.Mesh(sphereGeo, strandMat);
    s1.position.set(x1, y, z1);
    group.add(s1);

    const s2 = new THREE.Mesh(sphereGeo, strandMat);
    s2.position.set(x2, y, z2);
    group.add(s2);

    // Rung
    const rung = new THREE.Mesh(rungGeo, rungMat);
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;
    rung.position.set(midX, y, midZ);
    rung.lookAt(x2, y, z2);
    rung.rotateZ(Math.PI / 2);
    group.add(rung);
  }

  // Add a subtle glow halo
  const glowGeo = new THREE.SphereGeometry(0.2, 12, 12);
  const glowMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.06,
    wireframe: true,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  group.add(glow);

  return group;
}

/* ── Main component ── */
export default function ThreeParticles({ opacity = 0.5, speed = 1 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;
    camera.position.y = 0.5;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Shared geometry cache ──
    const capsuleGeo = new THREE.CapsuleGeometry(0.06, 0.18, 6, 8);
    const icosaGeo = new THREE.IcosahedronGeometry(0.1, 1);

    // ════════════════════════════════════════════════
    //  1. Background star particles
    // ════════════════════════════════════════════════
    const ptGeo = new THREE.BufferGeometry();
    const ptPos = new Float32Array(PARTICLE_COUNT * 3);
    const ptSizes = new Float32Array(PARTICLE_COUNT);
    const ptColors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 2.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      ptPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      ptPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.35;
      ptPos[i * 3 + 2] = r * Math.cos(phi) - 0.5;
      ptSizes[i] = 0.04 + Math.random() * 0.08;
      const c = new THREE.Color(COLORS[i % COLORS.length]);
      ptColors[i * 3] = c.r;
      ptColors[i * 3 + 1] = c.g;
      ptColors[i * 3 + 2] = c.b;
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    ptGeo.setAttribute('size', new THREE.BufferAttribute(ptSizes, 1));
    ptGeo.setAttribute('color', new THREE.BufferAttribute(ptColors, 3));

    // Sprite texture
    const texC = document.createElement('canvas');
    texC.width = 64; texC.height = 64;
    const tctx = texC.getContext('2d');
    const grad = tctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(texC);

    const ptMat = new THREE.PointsMaterial({
      size: 0.2,
      map: spriteTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
    });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // ════════════════════════════════════════════════
    //  2. Connection lines (constellation)
    // ════════════════════════════════════════════════
    const lineVerts = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = ptPos[i * 3] - ptPos[j * 3];
        const dy = ptPos[i * 3 + 1] - ptPos[j * 3 + 1];
        const dz = ptPos[i * 3 + 2] - ptPos[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < CONNECTION_DISTANCE && Math.random() < 0.3) {
          lineVerts.push(ptPos[i * 3], ptPos[i * 3 + 1], ptPos[i * 3 + 2]);
          lineVerts.push(ptPos[j * 3], ptPos[j * 3 + 1], ptPos[j * 3 + 2]);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: '#8B9A7B',
      transparent: true,
      opacity: 0.1,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // ════════════════════════════════════════════════
    //  3. Bacteria (rods) — InstancedMesh Capsule
    // ════════════════════════════════════════════════
    const bacteriaMat = new THREE.MeshBasicMaterial({
      color: '#8B9A7B',
      transparent: true,
      opacity: 0.5,
    });
    const bacteriaMesh = new THREE.InstancedMesh(capsuleGeo, bacteriaMat, BACTERIA_COUNT);
    const dummy = new THREE.Object3D();
    const bacteriaPositions = [];

    for (let i = 0; i < BACTERIA_COUNT; i++) {
      const r = 1.5 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.35;
      const z = r * Math.cos(phi) - 0.5;
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.6 + Math.random() * 0.8;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      bacteriaMesh.setMatrixAt(i, dummy.matrix);
      bacteriaPositions.push({ x, y, z });
    }
    bacteriaMesh.instanceMatrix.needsUpdate = true;
    scene.add(bacteriaMesh);

    // Store for animation
    const bacteriaInitial = bacteriaPositions.map(p => ({ ...p }));

    // ════════════════════════════════════════════════
    //  4. Cells (icosahedra) — InstancedMesh
    // ════════════════════════════════════════════════
    const cellMat = new THREE.MeshBasicMaterial({
      color: '#A8B898',
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const cellMesh = new THREE.InstancedMesh(icosaGeo, cellMat, CELL_COUNT);
    const cellPositions = [];

    for (let i = 0; i < CELL_COUNT; i++) {
      const r = 1.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.35;
      const z = r * Math.cos(phi) - 0.5;
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
      const s = 0.8 + Math.random() * 0.6;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      cellMesh.setMatrixAt(i, dummy.matrix);
      cellPositions.push({ x, y, z });
    }
    cellMesh.instanceMatrix.needsUpdate = true;
    scene.add(cellMesh);

    const cellInitial = cellPositions.map(p => ({ ...p }));

    // ════════════════════════════════════════════════
    //  5. DNA helices — scattered in the volume
    // ════════════════════════════════════════════════
    const dnaGroup = new THREE.Group();
    const dnaColors = ['#6B705C', '#8B9A7B', '#A8B898', '#7A8B6A'];
    const dnaEntries = [];

    for (let i = 0; i < DNA_COUNT; i++) {
      const helix = createDNAHelix(dnaColors[i % dnaColors.length]);
      const r = 0.5 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.35;
      const z = r * Math.cos(phi) - 0.5;
      helix.position.set(x, y, z);
      helix.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.6 + Math.random() * 0.5;
      helix.scale.set(s, s, s);
      dnaGroup.add(helix);
      dnaEntries.push({ obj: helix, pos: { x, y, z } });
    }
    scene.add(dnaGroup);

    // ════════════════════════════════════════════════
    //  6. Decorative rings
    // ════════════════════════════════════════════════
    const ringGroup = new THREE.Group();
    const ringColors = ['#6B705C', '#A8B898', '#8B9A7B'];
    for (let i = 0; i < 3; i++) {
      const rg = new THREE.TorusGeometry(2.2 + i * 0.8, 0.018, 20, 80);
      const rm = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.18 - i * 0.035,
        wireframe: true,
      });
      const ring = new THREE.Mesh(rg, rm);
      ring.rotation.x = Math.PI / 3.5 + i * 0.25;
      ring.rotation.y = i * 0.6;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    // ════════════════════════════════════════════════
    //  7. Inner glow sphere (wireframe)
    // ════════════════════════════════════════════════
    const glowGeo2 = new THREE.SphereGeometry(0.6, 12, 12);
    const glowMat2 = new THREE.MeshBasicMaterial({
      color: '#A8B898',
      transparent: true,
      opacity: 0.03,
      wireframe: true,
    });
    const glowSphere = new THREE.Mesh(glowGeo2, glowMat2);
    scene.add(glowSphere);

    // ── Store refs ──
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      lineMesh,
      bacteriaMesh,
      cellMesh,
      dnaGroup,
      ringGroup,
      glowSphere,
      ptGeo,
      bacteriaInitial,
      cellInitial,
    };
    const initialPtPos = new Float32Array(ptPos);

    // ── Mouse ──
    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };
    const handleTouch = (e) => {
      const touch = e.touches?.[0];
      if (touch) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: ((touch.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((touch.clientY - rect.top) / rect.height) * 2 + 1,
        };
      }
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch);

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── Animation loop ──
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime() * speed;
      const { x: mx, y: my } = mouseRef.current;

      // Rotate entire scene group based on mouse
      const rotX = my * 0.02;
      const rotY = mx * 0.03;

      particles.rotation.x += (rotX - particles.rotation.x) * 0.008;
      particles.rotation.y += (rotY - particles.rotation.y) * 0.008;
      particles.rotation.z += 0.0003;

      lineMesh.rotation.x = particles.rotation.x;
      lineMesh.rotation.y = particles.rotation.y;
      lineMesh.rotation.z = particles.rotation.z;

      bacteriaMesh.rotation.x = particles.rotation.x;
      bacteriaMesh.rotation.y = particles.rotation.y;
      bacteriaMesh.rotation.z = particles.rotation.z;

      cellMesh.rotation.x = particles.rotation.x;
      cellMesh.rotation.y = particles.rotation.y;
      cellMesh.rotation.z = particles.rotation.z;

      dnaGroup.rotation.x = particles.rotation.x;
      dnaGroup.rotation.y = particles.rotation.y;
      dnaGroup.rotation.z = particles.rotation.z;

      // Gentle floating wave on particles
      const posAttr = ptGeo.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        arr[idx] = initialPtPos[idx] + Math.sin(elapsed * 0.25 + i * 0.5) * 0.05;
        arr[idx + 1] = initialPtPos[idx + 1] + Math.sin(elapsed * 0.35 + i * 0.7) * 0.05;
        arr[idx + 2] = initialPtPos[idx + 2] + Math.sin(elapsed * 0.15 + i * 0.3) * 0.05;
      }
      posAttr.needsUpdate = true;

      // Gentle floating on bacteria instances
      const bDummy = new THREE.Object3D();
      for (let i = 0; i < BACTERIA_COUNT; i++) {
        const bi = bacteriaInitial[i];
        const waveX = Math.sin(elapsed * 0.2 + i * 0.7) * 0.06;
        const waveY = Math.sin(elapsed * 0.3 + i * 0.5) * 0.06;
        const waveZ = Math.sin(elapsed * 0.15 + i * 0.9) * 0.06;
        bacteriaMesh.getMatrixAt(i, bDummy.matrix);
        bDummy.position.set(bi.x + waveX, bi.y + waveY, bi.z + waveZ);
        bDummy.rotation.y += Math.sin(elapsed * 0.1 + i) * 0.002;
        bDummy.updateMatrix();
        bacteriaMesh.setMatrixAt(i, bDummy.matrix);
      }
      bacteriaMesh.instanceMatrix.needsUpdate = true;

      // Gentle floating on cells
      for (let i = 0; i < CELL_COUNT; i++) {
        const ci = cellInitial[i];
        const waveX = Math.sin(elapsed * 0.28 + i * 0.3) * 0.05;
        const waveY = Math.sin(elapsed * 0.38 + i * 0.6) * 0.05;
        const waveZ = Math.sin(elapsed * 0.18 + i * 0.4) * 0.05;
        cellMesh.getMatrixAt(i, bDummy.matrix);
        bDummy.position.set(ci.x + waveX, ci.y + waveY, ci.z + waveZ);
        bDummy.rotation.x += Math.sin(elapsed * 0.05 + i) * 0.003;
        bDummy.updateMatrix();
        cellMesh.setMatrixAt(i, bDummy.matrix);
      }
      cellMesh.instanceMatrix.needsUpdate = true;

      // DNA subtle bob
      dnaEntries.forEach((entry, i) => {
        entry.obj.position.y += Math.sin(elapsed * 0.2 + i * 1.2) * 0.0005;
        entry.obj.rotation.y += 0.001;
      });

      // Rings
      ringGroup.rotation.x += Math.sin(elapsed * 0.04) * 0.0008;
      ringGroup.rotation.y += 0.0008;
      ringGroup.rotation.z += Math.cos(elapsed * 0.02) * 0.0004;

      // Glow sphere pulse
      glowSphere.scale.setScalar(1 + Math.sin(elapsed * 0.3) * 0.06);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      capsuleGeo.dispose();
      icosaGeo.dispose();
      ptGeo.dispose();
      ptMat.dispose();
      spriteTex.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      bacteriaMat.dispose();
      cellMat.dispose();
      glowMat2.dispose();
    };
  }, [opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity, zIndex: 0 }}
    />
  );
}
