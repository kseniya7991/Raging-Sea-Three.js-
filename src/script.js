import Waves from "./Waves/Waves";

const template = new Waves("canvas.webgl");

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import GUI from "lil-gui";
// import planeWaterVertexShader from "./shaders/planeWater/vertex.glsl";
// import planeWaterFragmentShader from "./shaders/planeWater/fragment.glsl";

// /**
//  * Base
//  */
// // Debug
// const gui = new GUI({ width: 340 });
// const debugObj = {};

// // Canvas
// const canvas = document.querySelector("canvas.webgl");

// // Scene
// const scene = new THREE.Scene();

// /**
//  * Water
//  */
// // Geometry
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
// const sphere = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);

// //Colors

// debugObj.depthColor = new THREE.Color("#186691");
// debugObj.surfaceColor = new THREE.Color("#9bd8ff");
// /* debugObj.depthColor = new THREE.Color("#fafcff");
// debugObj.surfaceColor = new THREE.Color("#00294d"); */
// debugObj.foamColor = new THREE.Color("#ffffff");

// debugObj.fogColor = new THREE.Color("#9ed2ff");

// // Material
// const waterMaterial = new THREE.ShaderMaterial({
//     vertexShader: planeWaterVertexShader,
//     fragmentShader: planeWaterFragmentShader,
//     fog: true,
//     uniforms: {
//         uTime: { value: 0 },
//         uBigWavesElevation: { value: 0.15 },
//         uBigWavesFrequency: {
//             value: new THREE.Vector2(3.5, 2.0),
//         },
//         uBigWavesSpeed: { value: 0.6 },

//         uSmallWavesCount: { value: 3.0 },
//         uSmallWavesFrequency: { value: 3.0 },
//         uSmallWavesElevation: { value: 0.1 },
//         uSmallWavesSpeed: { value: 0.2 },

//         uFoamColor: { value: debugObj.foamColor },
//         uFoamOffset: { value: 0.01 },
//         uFoamMultiplier: { value: 12.0 },

//         uDepthColor: { value: debugObj.depthColor },
//         uSurfaceColor: { value: debugObj.surfaceColor },
//         // uColorOffset: { value: 0.25 },
//         uColorOffset: { value: 0.4 },
//         uColorMultiplier: { value: 2.0 },
//         ...THREE.UniformsLib["fog"],
//     },
// });

// // Mesh
// const water = new THREE.Mesh(waterGeometry, waterMaterial);
// water.rotation.x = -Math.PI * 0.5;
// scene.add(water);

// //Gui
// const bigWaves = gui.addFolder("Big Waves").close();
// bigWaves
//     .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Frequency X");
// bigWaves
//     .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Frequency Y");
// bigWaves
//     .add(waterMaterial.uniforms.uBigWavesElevation, "value")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Elevation");
// bigWaves
//     .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Speed");

// const smallWaves = gui.addFolder("Small Waves").close();
// smallWaves
//     .add(waterMaterial.uniforms.uSmallWavesCount, "value")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Count");
// smallWaves
//     .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Frequency");
// smallWaves
//     .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
//     .min(0)
//     .max(2)
//     .step(0.001)
//     .name("Elevation");
// smallWaves
//     .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Speed");

// const colorsFolder = gui.addFolder("Colors").close();
// colorsFolder
//     .addColor(debugObj, "surfaceColor")
//     .name("Surface color")
//     .onChange((value) => {
//         waterMaterial.uniforms.uSurfaceColor.value = value;
//     });

// colorsFolder
//     .addColor(debugObj, "depthColor")
//     .name("Depth color")
//     .onChange((value) => {
//         waterMaterial.uniforms.uDepthColor.value = value;
//     });
// colorsFolder
//     .add(waterMaterial.uniforms.uColorOffset, "value")
//     .min(0)
//     .max(3)
//     .step(0.001)
//     .name("Offset");
// colorsFolder
//     .add(waterMaterial.uniforms.uColorMultiplier, "value")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("Multiplier");

// const foamFolder = gui.addFolder("Foam").close();
// foamFolder
//     .addColor(debugObj, "foamColor")
//     .name("Foam color")
//     .onChange((value) => {
//         waterMaterial.uniforms.uFoamColor.value = value;
//     });
// foamFolder
//     .add(waterMaterial.uniforms.uFoamOffset, "value")
//     .min(0)
//     .max(3)
//     .step(0.001)
//     .name("Offset");
// foamFolder
//     .add(waterMaterial.uniforms.uFoamMultiplier, "value")
//     .min(0)
//     .max(20)
//     .step(0.001)
//     .name("Multiplier");

// scene.background = new THREE.Color(debugObj.fogColor);
// scene.fog = new THREE.Fog(debugObj.fogColor, 1, 3);

// const fogFolder = gui.addFolder("Fog").close();
// fogFolder
//     .addColor(scene.fog, "color")
//     .name("Color")
//     .onChange((value) => {
//         scene.background = value;
//     });
// fogFolder.add(scene.fog, "near").min(0).max(2).step(0.001).name("Near");
// fogFolder.add(scene.fog, "far").min(1).max(10).step(0.001).name("Far");

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// };

// window.addEventListener("resize", () => {
//     // Update sizes
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;

//     // Update camera
//     camera.aspect = sizes.width / sizes.height;
//     camera.updateProjectionMatrix();

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// camera.position.set(1, 1, 1);
// scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// /**
//  * Animate
//  */
// const clock = new THREE.Clock();
// let count = 0;

// const tick = () => {
//     const elapsedTime = clock.getElapsedTime();

//     //Update materials
//     waterMaterial.uniforms.uTime.value = elapsedTime;

//     // Update controls
//     controls.update();

//     // Render
//     renderer.render(scene, camera);

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick);
// };

// tick();
