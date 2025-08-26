// Three.js Animation for Hero Section

// Initialize Three.js scene when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the hero canvas container exists
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Create particles for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position particles in a sphere
        const radius = 20 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);
        
        // Random scale for each particle
        scaleArray[i / 3] = Math.random() * 0.5 + 0.1;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Create particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        color: 0x4f46e5,
        transparent: true,
        opacity: 0.8
    });
    
    // Create particles system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particleSystem);
    
    // Create central globe
    const globeGeometry = new THREE.IcosahedronGeometry(8, 1);
    const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x4f46e5,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    group.add(globe);
    
    // Create floating objects (books, graduation caps, etc.)
    const createFloatingObject = (geometry, material, position, scale) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.scale.set(scale, scale, scale);
        mesh.userData = {
            rotationSpeed: {
                x: Math.random() * 0.01 - 0.005,
                y: Math.random() * 0.01 - 0.005,
                z: Math.random() * 0.01 - 0.005
            },
            floatSpeed: Math.random() * 0.005 + 0.002,
            floatDistance: Math.random() * 0.5 + 0.5,
            initialY: position.y,
            floatOffset: Math.random() * Math.PI * 2
        };
        group.add(mesh);
        return mesh;
    };
    
    // Create book-like objects
    const bookGeometry = new THREE.BoxGeometry(2, 3, 0.5);
    const bookMaterial = new THREE.MeshPhongMaterial({ color: 0x10b981 });
    
    const floatingObjects = [];
    
    // Add several books at different positions
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 15;
        const position = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius / 2,
            z: Math.sin(angle) * radius
        };
        
        const book = createFloatingObject(bookGeometry, bookMaterial, position, 0.8);
        floatingObjects.push(book);
    }
    
    // Create graduation cap objects
    const capGeometry = new THREE.ConeGeometry(1, 0.5, 4);
    const capMaterial = new THREE.MeshPhongMaterial({ color: 0xf59e0b });
    
    // Add several caps at different positions
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const radius = 12;
        const position = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius / 3 + 5,
            z: Math.sin(angle) * radius
        };
        
        const cap = createFloatingObject(capGeometry, capMaterial, position, 1);
        floatingObjects.push(cap);
    }
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate the entire group slowly
        group.rotation.y += 0.002;
        
        // Rotate the globe
        globe.rotation.x += 0.003;
        globe.rotation.y += 0.005;
        
        // Animate floating objects
        const time = Date.now() * 0.001;
        floatingObjects.forEach(obj => {
            // Apply individual rotation
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;
            
            // Apply floating motion
            obj.position.y = obj.userData.initialY + 
                Math.sin(time + obj.userData.floatOffset) * 
                obj.userData.floatDistance;
        });
        
        // Rotate particles slightly
        particleSystem.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    };
    
    // Start animation loop
    animate();
    
    // Add mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });
    
    // Update camera position based on mouse movement
    const updateCamera = () => {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        
        camera.lookAt(scene.position);
        
        requestAnimationFrame(updateCamera);
    };
    
    updateCamera();
});