// 🌞 Solar System Simulation – Fixed black strip and moved sliders to bottom left

let isPaused = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // fully transparent

// Apply full screen and layering
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '-1';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

let darkMode = true;
scene.background = null;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffee88, 2.5, 150, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff33,
  emissive: 0xffdd00,
  emissiveIntensity: 3,
  transparent: true
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const textureLoader = new THREE.TextureLoader();
const sunFlareTexture = textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png");
const sunSpriteMaterial = new THREE.SpriteMaterial({ map: sunFlareTexture, color: 0xffcc66, transparent: true, opacity: 0.9 });
const sunSprite = new THREE.Sprite(sunSpriteMaterial);
sunSprite.scale.set(12, 12, 1);
sun.add(sunSprite);

const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 0.3, distance: 4, speed: 0.04 },
  { name: "Venus",   color: 0xffcc99, size: 0.5, distance: 6, speed: 0.015 },
  { name: "Earth",   color: 0x3399ff, size: 0.6, distance: 8, speed: 0.01 },
  { name: "Mars",    color: 0xff3300, size: 0.5, distance: 10, speed: 0.008 },
  { name: "Jupiter", color: 0xff9966, size: 1.2, distance: 13, speed: 0.004 },
  { name: "Saturn",  color: 0xffcc66, size: 1.0, distance: 16, speed: 0.003 },
  { name: "Uranus",  color: 0x66ffff, size: 0.8, distance: 18, speed: 0.002 },
  { name: "Neptune", color: 0x3366ff, size: 0.8, distance: 20, speed: 0.0015 }
];

const planets = [];
const planetSpeeds = {};
const clock = new THREE.Clock();

planetData.forEach(planet => {
  const orbit = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.05 });
  const orbitMesh = new THREE.Mesh(orbit, orbitMaterial);
  orbitMesh.rotation.x = Math.PI / 2;
  scene.add(orbitMesh);

  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.3, metalness: 0.7 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  planets.push({ mesh, data: planet });
  planetSpeeds[planet.name] = planet.speed;
});

function createStars(count) {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 });
  const vertices = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 400;
    const z = (Math.random() - 0.5) * 400;
    vertices.push(x, y, z);
  }
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
createStars(1000);

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  if (!isPaused) {
    const pulse = Math.sin(elapsed * 2) * 0.2 + 1;
    sunSprite.scale.set(pulse * 12, pulse * 12, 1);

    planets.forEach(planet => {
      const angle = elapsed * planetSpeeds[planet.data.name];
      const x = Math.cos(angle) * planet.data.distance;
      const z = Math.sin(angle) * planet.data.distance;
      planet.mesh.position.set(x, 0, z);
    });
  }
  renderer.render(scene, camera);
}
animate();

// UI Controls container for bottom left
const controlPanel = document.createElement("div");
controlPanel.style.position = "absolute";
controlPanel.style.bottom = "20px";
controlPanel.style.left = "20px";
controlPanel.style.background = "rgba(0, 0, 0, 0.5)";
controlPanel.style.padding = "10px";
controlPanel.style.borderRadius = "8px";
controlPanel.style.color = "white";
controlPanel.style.zIndex = "10";
document.body.appendChild(controlPanel);

planetData.forEach(planet => {
  const container = document.createElement("div");
  container.style.marginBottom = "5px";
  const label = document.createElement("label");
  label.innerText = `${planet.name} Speed: `;
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0.001";
  slider.max = "0.1";
  slider.step = "0.001";
  slider.value = planet.speed;
  slider.oninput = () => { planetSpeeds[planet.name] = parseFloat(slider.value); };
  container.appendChild(label);
  container.appendChild(slider);
  controlPanel.appendChild(container);
});


// 🎨 Theme Toggle Button
const themeBtn = document.createElement("button");
themeBtn.innerText = "🌗 Toggle Theme";
themeBtn.style.position = "absolute";
themeBtn.style.bottom = "20px";
themeBtn.style.right = "20px";
themeBtn.style.padding = "10px";
themeBtn.style.border = "none";
themeBtn.style.borderRadius = "5px";
themeBtn.style.background = "#ffffff22";
themeBtn.style.color = "white";
themeBtn.style.cursor = "pointer";
themeBtn.onclick = () => {
  darkMode = !darkMode;
  scene.background = new THREE.Color(darkMode ? 0x000000 : 0xf0f0f0);
};
document.body.appendChild(themeBtn);

// ⏯ Pause/Resume Button
const pauseBtn = document.createElement("button");
pauseBtn.innerText = "⏸ Pause";
pauseBtn.id = "pauseBtn";
pauseBtn.style.position = "absolute";
pauseBtn.style.top = "20px";
pauseBtn.style.left = "20px";
pauseBtn.style.padding = "10px";
pauseBtn.style.background = "#555";
pauseBtn.style.color = "white";
pauseBtn.style.border = "none";
pauseBtn.style.borderRadius = "5px";
pauseBtn.style.cursor = "pointer";
pauseBtn.onclick = () => {
  isPaused = !isPaused;
  pauseBtn.innerText = isPaused ? "▶ Resume" : "⏸ Pause";
};
document.body.appendChild(pauseBtn);

// 🔍 Zoom In Button
const zoomIn = document.createElement("button");
zoomIn.innerText = "➕ Zoom In";
zoomIn.style.position = "absolute";
zoomIn.style.top = "60px";
zoomIn.style.left = "20px";
zoomIn.style.padding = "8px";
zoomIn.style.background = "#44c767";
zoomIn.style.border = "none";
zoomIn.style.borderRadius = "5px";
zoomIn.style.color = "white";
zoomIn.style.cursor = "pointer";
zoomIn.onclick = () => {
  camera.position.z -= 2;
};
document.body.appendChild(zoomIn);

// 🔎 Zoom Out Button
const zoomOut = document.createElement("button");
zoomOut.innerText = "➖ Zoom Out";
zoomOut.style.position = "absolute";
zoomOut.style.top = "100px";
zoomOut.style.left = "20px";
zoomOut.style.padding = "8px";
zoomOut.style.background = "#f44336";
zoomOut.style.border = "none";
zoomOut.style.borderRadius = "5px";
zoomOut.style.color = "white";
zoomOut.style.cursor = "pointer";
zoomOut.onclick = () => {
  camera.position.z += 2;
};
document.body.appendChild(zoomOut);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
