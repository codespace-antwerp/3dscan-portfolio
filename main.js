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
const pointer = new THREE.Vector2(99999,99999);

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // console.log(pointer);
  
}


window.addEventListener( 'pointermove', onPointerMove );


const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0.2, 1);
scene.add(directionalLight);

camera.position.z = 5;

controls.minDistance = 1.7
controls.maxDistance = 8

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
    console.log(intersects[ i ].object)
		intersects[ i ].object.material.color.set( 0xff0000 );
	}

  // cube.rotation.x += 0.01;
  objectGroup.rotation.y += 0.0007;

  renderer.render(scene, camera);
}

animate();




