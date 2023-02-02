import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
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

const OBJECT_DATABASE = {
  Erangel_poster: {
    image: "images/Erangel.jpg",
    text: "Visual identity for the fictional island Erangel. (Poster and id-card concept) (2021)",
  },
  Metropolis: {
    image: "images/MetropolisM.jpg",
    text: "Metropolis M issue 6 redesign. (2022)",
  },
  Chain: {
    image: "images/Erangel.jpg",
    text: "Visual identity for the fictional island Erangel. (Poster and id-card concept) (2021)",
  },
  MHdr_poster: {
    image: "images/MHdr_poster.jpg",
    text: "Film poster for Mulholland Drive, by David Lynch. (2022)",
  },
  PHP: {
    image: "images/PHP.jpg",
    text: "Drawing system made of paper. (2022)",
  },
  Transversal: {
    image: "images/Transversal.jpg",
    text: "Transversal display font, made with diagonals at an angle of 87°. (2021)",
  },
  tape: {
    image: "images/tape.jpg",
    text: "Tape gadget against pedants. (2021) ",
  },
  printsheet: {
    image: "images/printsheet.jpg",
    text: "Printsheet for printer testing. (2021)",
  },
  Chapter_3: {
    image: "Chapter3.gif",
    text: "Publication of my project -Chapter 3- A third chapter to A.Abbot's Flatland, a new perspective on reality.",
  },
};

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

loader.load("models/Chapter_3.glb", function (gltf) {
  objectGroup.add(gltf.scene);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(99999, 99999);
let popupVisible = false;

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // console.log(pointer);
}

function onPointerDown(event) {
  if (activeObject && !popupVisible) {
    console.log(activeObject.name);
    // Animate object scale
    gsap.to(activeObject.scale, { x: 2.0, y: 2.0, z: 2.0 });

    // Look up the data for the object
    const data = OBJECT_DATABASE[activeObject.name];
    // Change the image src
    document.querySelector(".popup-image").src = data.image;
    // Change the text
    document.querySelector(".popup-text").innerHTML = data.text;
    // Show the popup
    document.querySelector(".popup-wrapper").classList.add("visible");
    popupVisible = true;
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
      child.material.transparent = false;
      child.material.opacity = 1;
    }
  });

  // calculate objects intersecting the picking ray
  if (!popupVisible) {
    activeObject = null;
    const intersects = raycaster.intersectObjects(objectGroup.children);
    if (intersects.length > 0) {
      //intersects[0].object.material.color.set(0xff00ff);
      intersects[0].object.material.transparent = true;
      intersects[0].object.material.opacity = 0.3;
      activeObject = intersects[0].object;
    }
  }

  // cube.rotation.x += 0.01;
  objectGroup.rotation.y += 0.0007;

  renderer.render(scene, camera);
}

animate();

document.querySelectorAll(".popup-close").forEach((popup) =>
  popup.addEventListener("click", () => {
    document
      .querySelectorAll(".popup-wrapper")
      .forEach((wrapper) => wrapper.classList.remove("visible"));
    popupVisible = false;
    // Animate object scale
    if (activeObject) {
      gsap.to(activeObject.scale, { x: 1.0, y: 1.0, z: 1.0 });
    }
  })
);

document.querySelector("#about-button").addEventListener("click", () => {
  // Show the popup
  document.querySelector("#about-popup-wrapper").classList.add("visible");
  popupVisible = true;
});
