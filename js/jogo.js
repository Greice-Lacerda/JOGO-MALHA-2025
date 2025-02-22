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

// Função para criar uma malha triangular simples
function createTriangleMesh() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0, 0, 0,
        1, 0, 0,
        0, 1, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// Adicionar a malha à cena
const triangleMesh = createTriangleMesh();
scene.add(triangleMesh);

// Função para criar um cubo interativo
function createInteractiveCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(2, 1, 0);
    cube.userData = { interactive: true }; // Marcar como interativo
    return cube;
}

// Adicionar o cubo interativo à cena
const interactiveCube = createInteractiveCube();
scene.add(interactiveCube);

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

// Adicionar evento de clique para o cubo interativo
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach((intersect) => {
        if (intersect.object.userData.interactive) {
            intersect.object.material.color.set(0xff0000); // Mudar a cor ao clicar
        }
    });
});

// Função para parametrizar o bordo (exemplo simplificado)
function parametrizarBordo(vertices) {
    const totalLength = vertices.reduce((acc, v, i, arr) => {
        if (i < arr.length - 1) {
            return acc + v.distanceTo(arr[i + 1]);
        }
        return acc;
    }, 0);
    let length = 0;
    return vertices.map((v, i, arr) => {
        if (i < arr.length - 1) {
            length += v.distanceTo(arr[i + 1]);
        }
        const t = (2 * Math.PI * length) / totalLength;
        return new THREE.Vector2(Math.sin(t), Math.cos(t));
    });
}

// Exemplo de uso da função de parametrização
const boundaryVertices = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0)
];
const parametrizedVertices = parametrizarBordo(boundaryVertices);
console.log(parametrizedVertices);