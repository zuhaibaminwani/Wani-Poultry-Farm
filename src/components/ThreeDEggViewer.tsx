import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Sun, Eye, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreeDEggViewerProps {
  eggColorName?: string;
  breedName?: string;
  interactive?: boolean;
}

// Convert descriptive eggshell names to accurate realistic hex colors
function getEggHexColor(colorDescription: string = ''): number {
  const lower = colorDescription.toLowerCase();
  if (lower.includes('dark brown') || lower.includes('rich tinted brown')) {
    return 0xb2774e; // Rich warm brown
  }
  if (lower.includes('brown')) {
    return 0xc99368; // Standard brown
  }
  if (lower.includes('chalk white') || lower.includes('pure white') || lower.includes('white')) {
    return 0xf4f3ee; // Chalk white
  }
  if (lower.includes('cream') || lower.includes('light tint') || lower.includes('tinted')) {
    return 0xfaebd7; // Antique warm cream
  }
  if (lower.includes('tan') || lower.includes('buff')) {
    return 0xd9b38c; // Warm tan
  }
  return 0xd8a97c; // Default healthy natural farm egg tint
}

export const ThreeDEggViewer: React.FC<ThreeDEggViewerProps> = ({
  eggColorName = 'Rich Brown',
  breedName = 'Heritage Poultry',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isCandling, setIsCandling] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for scene manipulation
  const eggMeshRef = useRef<THREE.Mesh | null>(null);
  const candlingLightRef = useRef<THREE.PointLight | null>(null);
  const embryoRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clean previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff6ea, 2.0);
    mainLight.position.set(4, 5, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x90b49c, 1.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Internal Candling Point Light
    const candlingLight = new THREE.PointLight(0xff5500, 0, 6);
    candlingLight.position.set(0, -0.2, 0);
    scene.add(candlingLight);
    candlingLightRef.current = candlingLight;

    // Create authentic 3D Egg Geometry using revolving mathematical hen's egg curve
    // Hügelschäffer parametric curve for poultry egg
    const points: THREE.Vector2[] = [];
    const segments = 48;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI; // 0 to PI
      // Standard hen egg cross section formula
      const y = -Math.cos(t) * 1.5; // Height from -1.5 to 1.5
      const asymmetry = 1 - 0.22 * Math.cos(t); // Taper toward top
      const x = Math.sin(t) * 1.08 * asymmetry; // Width
      points.push(new THREE.Vector2(Math.max(0, x), y));
    }

    const eggGeometry = new THREE.LatheGeometry(points, 64);
    eggGeometry.computeVertexNormals();

    const baseColor = getEggHexColor(eggColorName);
    const eggMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.65,
      metalness: 0.05,
      transparent: true,
      opacity: 0.98,
    });

    const eggMesh = new THREE.Mesh(eggGeometry, eggMaterial);
    eggMesh.castShadow = true;
    eggMesh.receiveShadow = true;
    eggMesh.rotation.z = 0.12; // Slight natural resting tilt
    scene.add(eggMesh);
    eggMeshRef.current = eggMesh;

    // Inside Embryo for 3D Candling Mode (vein & blastoderm shadow)
    const embryoGeo = new THREE.SphereGeometry(0.42, 24, 24);
    embryoGeo.scale(1, 1.3, 0.7);
    const embryoMat = new THREE.MeshBasicMaterial({
      color: 0x4a0e0e,
      transparent: true,
      opacity: 0,
    });
    const embryoMesh = new THREE.Mesh(embryoGeo, embryoMat);
    embryoMesh.position.set(0.1, -0.1, 0);
    eggMesh.add(embryoMesh);
    embryoRef.current = embryoMesh;

    // Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(4, 4);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.65;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Mouse & Touch Drag Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !eggMesh) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      eggMesh.rotation.y += deltaX * 0.015;
      eggMesh.rotation.x += deltaY * 0.015;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (eggMesh) {
        if (autoRotate && !isDragging) {
          eggMesh.rotation.y += delta * 0.65;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [eggColorName]);

  // Update Candling Mode in 3D Scene
  useEffect(() => {
    if (candlingLightRef.current && eggMeshRef.current && embryoRef.current) {
      const eggMat = eggMeshRef.current.material as THREE.MeshStandardMaterial;
      const embryoMat = embryoRef.current.material as THREE.MeshBasicMaterial;

      if (isCandling) {
        candlingLightRef.current.intensity = 18;
        eggMat.roughness = 0.45;
        eggMat.opacity = 0.82;
        eggMat.color.setHex(0xffaa55); // Warm backlit amber
        embryoMat.opacity = 0.75;
      } else {
        candlingLightRef.current.intensity = 0;
        eggMat.roughness = 0.65;
        eggMat.opacity = 0.98;
        eggMat.color.setHex(getEggHexColor(eggColorName));
        embryoMat.opacity = 0;
      }
    }
  }, [isCandling, eggColorName]);

  return (
    <div className="relative w-full h-full min-h-[260px] flex flex-col items-center justify-center bg-gradient-to-b from-[#143224]/30 via-stone-900/10 to-stone-950/20 rounded-2xl border border-stone-200/80 overflow-hidden select-none">
      
      {/* 3D Canvas Mount */}
      <div 
        ref={containerRef} 
        className="w-full h-56 sm:h-64 cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate in 3D space"
      />

      {/* 3D Overlay Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>3D Egg Inspector: {eggColorName}</span>
      </div>

      {/* Interactive Controls Bar */}
      {interactive && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs">
          <div className="flex items-center gap-1.5">
            {/* Candling Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCandling(!isCandling)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                isCandling
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-amber-200'
              }`}
              title="Toggle Day 7 Candling View (Reveals internal embryo veins)"
            >
              <Sun className={`w-3.5 h-3.5 ${isCandling ? 'animate-spin' : ''}`} />
              <span>{isCandling ? 'Candling Mode ON' : '3D Candling'}</span>
            </button>

            {/* Auto Rotate Toggle */}
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                autoRotate ? 'bg-red-800 text-white' : 'bg-white/10 text-stone-300'
              }`}
              title="Toggle Auto-Rotation"
            >
              <RotateCw className="w-3 h-3" />
              <span>{autoRotate ? 'Spin' : 'Paused'}</span>
            </button>
          </div>

          <span className="text-[10px] text-stone-300 hidden sm:inline font-mono">
            Drag to Rotate 360°
          </span>
        </div>
      )}

    </div>
  );
};
