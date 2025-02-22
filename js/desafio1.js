import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuração básica do Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Adicionar luz direcional
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Adicionar luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Função para criar uma malha triangular simples com vértices interativos
function createTriangleMesh(size) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0, 0, 0,
        size, 0, 0,
        0, size, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);

    // Adicionar vértices interativos
    const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    for (let i = 0; i < vertices.length; i += 3) {
        const vertexGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const vertex = new THREE.Mesh(vertexGeometry, vertexMaterial);
        vertex.position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
        vertex.userData = { interactive: true };
        scene.add(vertex);
    }

    return mesh;
}

// Adicionar a malha à cena
let triangleMesh = createTriangleMesh(1);
scene.add(triangleMesh);

// Posicionar a câmera
camera.position.set(0, 0, 5);

// Adicionar controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilitar amortecimento (inércia)
controls.dampingFactor = 0.25; // Fator de amortecimento
controls.screenSpacePanning = false; // Desabilitar o movimento de panning
controls.maxPolarAngle = Math.PI / 2; // Limitar o ângulo polar

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Adicionar evento de clique para os vértices interativos
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach((intersect) => {
        if (intersect.object.userData.interactive) {
            intersect.object.material.color.set(0x0000ff); // Mudar a cor ao clicar
        }
    });
});

// Adicionar evento para criar uma nova malha com o tamanho especificado
document.getElementById('create-mesh').addEventListener('click', () => {
    const size = parseFloat(document.getElementById('mesh-size').value);
    scene.remove(triangleMesh);
    triangleMesh = createTriangleMesh(size);
    scene.add(triangleMesh);
});