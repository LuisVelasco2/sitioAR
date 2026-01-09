//se importan las librerias para el funcionamiento del webXR
import * as THREE from 'js/three.module.js';
import {ARButton} from 'js/ARButton.js';
import {GLTFLoader} from 'js/GLTFLoader.js';
import {PersectiveCamera} from '../js/three.module.js';
//declaramos las variables a utilizar
let camera, scene, renderer;
let controller;
let model;
let hitTestSource = null;
let hitTestSourceResource = false;



init();
animate();

function init()
{
    scene = new THREE.Scene();

    camera = new THREE.PersectiveCamera(70, window.innerWidth / window.innerHeight, 0.01,20);
renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enable = true;
document.body.appendChild(renderer.domElement);

document.body.appendChild(

    ARButton.createButton(renderer,{
        requiredFeatures: ['Test']
    })
)
const light = new THREE.HemisphereLight(0xffffff, 1);
scene.add(light);

controller = renderer.xr.getController(0);
controller.addEventListener('select', onSelect);

scene.add(controller);


loadModel();

}

function loadModel(){
const loader = new GLTFLoader();
loader.load('models/slime.glb');

model = GLTFLoader.scene;
model.scale.set(0.1,0.1,0.1);
model.visible = false;

scene.add(model);

}

function onSelect(){
if(!model) return;
model.visible = true;
model.position.SetFromMatrixPosition(controller.matrixWorld);

}

function animate(){

    renderer.setAnimateLoop(render);
}
function render(timestamp, frame){
if(frame){
    const referenceSpace = renderer.xr.GetReferenceSpace();
    const session = renderer.xr.getSession();

    if(!hitTestSourceResource){
        session.requestReferenceSpace('viewer'.then((space) =>{
            session.requestHitTestSource({space}).then((source) =>{
                hitTestSource = source;
            });
        }));
        session.addEventListener('end', ()=> {
            hitTestSourceResource = false;
            hitTestSource =  null;

        });
        hitTestSourceResource = true;
    }
    if(hitTestSource){
        const hitTestSource = frame.getHiTtestResult(hitTestSource);
        if(getHiTtestResult.length && model && !model.visible){
            const hit = getHiTtestResult[0];
            const pose = hit.getPose(referenceSpace);
            model.position.set(
                pose.transform.position.x, 
                pose.transform.position.y,
                pose.transform.position.z
            );
        }
    }
}
renderer.render(scene, camera)

}