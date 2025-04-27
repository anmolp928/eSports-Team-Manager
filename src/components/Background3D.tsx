
import { useEffect, useRef } from "react";

const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add Three.js script dynamically to avoid issues with SSR
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    
    script.onload = () => {
      if (!containerRef.current) return;
      
      // @ts-ignore - Three is loaded from CDN
      const THREE = window.THREE;
      
      // Create scene, camera and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // transparent background
      
      containerRef.current.appendChild(renderer.domElement);

      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1500;
      
      const positionArray = new Float32Array(particlesCount * 3);
      const colorArray = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount * 3; i++) {
        // Position
        positionArray[i] = (Math.random() - 0.5) * 15;
        
        // Color - use green/cyan theme
        if (i % 3 === 0) {
          colorArray[i] = 0; // R
        } else if (i % 3 === 1) {
          colorArray[i] = Math.random() * 0.8 + 0.2; // G
        } else {
          colorArray[i] = Math.random() * 0.5; // B
        }
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      
      // Material
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
      });
      
      // Create mesh
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      
      // Add some larger glowing points
      const glowGeometry = new THREE.BufferGeometry();
      const glowCount = 20;
      const glowPositions = new Float32Array(glowCount * 3);
      
      for (let i = 0; i < glowCount * 3; i++) {
        glowPositions[i] = (Math.random() - 0.5) * 10;
      }
      
      glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
      
      const glowMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        color: 0x33ff99,
      });
      
      const glowPoints = new THREE.Points(glowGeometry, glowMaterial);
      scene.add(glowPoints);

      // Position camera
      camera.position.z = 5;
      
      // Mouse tracking for parallax effect
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      
      const onDocumentMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
      };
      
      document.addEventListener('mousemove', onDocumentMouseMove);
      
      // Handle window resize
      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', onWindowResize);
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Smooth follow for parallax
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
        
        glowPoints.rotation.y -= 0.001;
        glowPoints.rotation.x -= 0.0005;
        
        // Move camera slightly based on mouse position
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', onWindowResize);
        document.removeEventListener('mousemove', onDocumentMouseMove);
        
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default Background3D;
