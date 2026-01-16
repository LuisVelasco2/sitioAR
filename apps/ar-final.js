import * as THREE from './js/three.module.js';
import { ARButton } from './js/ARButton.js';
import { GLTFLoader } from './js/GLTFLoader.js';

let camera, scene, renderer;
let controller;

function init() {

    scene = new THREE.Scene();

    // PerspectiveCamera  mal escrito
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;    // deberia de ser xr.enable = true
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(
        ARButton.createButton(renderer, {
            requiredFeatures: ['hit-test']
        })
    );

    //  el color estaba mal y scene.add estaba mal usado
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(light);

    // getController estaba mal escrito como xr-getController
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect); // la funcion no puede ir con mayuscula
    scene.add(controller);

    window.addEventListener('resize', onWindowResize);
}

function onSelect() {

    // BoxGeometry debe ser 0.1,0.1,0.1 para que se viera en la pantalla
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    // color es con : no con , profe

    const material = new THREE.MeshStandardMaterial({ color: 0xf27f5d });

    const cube = new THREE.Mesh(geometry, material);

    // falta añadir el cubo a la escena 
    scene.add(cube);

    // faltaba agregar el cubo antes
    cube.position.setFromMatrixPosition(controller.matrixWorld);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Estaba mal: renderer.setSize(window,innerWidth...
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate(); // animate falta ()
