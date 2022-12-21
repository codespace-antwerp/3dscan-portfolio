import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const objectGroup = new THREE.Group();
scene.add(objectGroup);

const loader = new GLTFLoader();
loader.load("models/Erangel_poster.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});
loader.load("models/Metropolis.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

loader.load("models/MHdr_poster.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

loader.load("models/Chain.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

loader.load("models/PHP.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});
loader.load("models/printsheet.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

loader.load("models/tape.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

loader.load("models/Transversal.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(99999, 99999);

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // console.log(pointer);
}

function onPointerDown(event) {
  if (activeObject) {
    console.log(activeObject.name);
    // activeObject.scale.set(5, 5, 5);
  }
}

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerdown", onPointerDown);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0.2, 1);
scene.add(directionalLight);

let activeObject = null;

camera.position.z = 2;

controls.minDistance = 1.7;
controls.maxDistance = 8;

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // Remove color from all objects
  objectGroup.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xffffff);
    }
  });

  // calculate objects intersecting the picking ray
  activeObject = null;
  const intersects = raycaster.intersectObjects(objectGroup.children);
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xff00ff);
    activeObject = intersects[0].object;
  }

  // cube.rotation.x += 0.01;
  objectGroup.rotation.y += 0.0007;

  renderer.render(scene, camera);
}

animate();
