import * as THREE from "three";
import Project from "../../../Project";
import Environment from "../../Environment";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const ACTIVE_CLASS = "active";
const OBJECT_SELECTOR = ".js-world__raging-sea-shading";

export default class RagingSeaShading {
    constructor() {
        this.project = new Project();

        this.htmlEl = document.querySelector(OBJECT_SELECTOR);

        this.time = this.project.time;
        this.debug = this.project.debug;
        this.scene = this.project.scene;
        this.resources = this.project.resources;
        // this.audioHandler = this.project.audioHandler;

        this.debugFolders = [];

        this.eventName = "toggle";
        this.isActiveHtml = this.htmlEl.classList.contains(ACTIVE_CLASS);
        this.isInited = false;

        this.initComponent();
    }

    initComponent = () => {
        this.setDebugObj();

        if (this.isActiveHtml) this.initMesh();

        this.htmlEl?.addEventListener(this.eventName, () => {
            this.initMesh();
        });
    };

    toggle = (el) => {
        console.log(el === this.htmlEl);
        let isSameEl = el === this.htmlEl;
        if (isSameEl) {
            this.initMesh();
        } else {
            this.destroy();
        }
    };

    initMesh = () => {
        if (this.isInited) return;
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.setDebug();
        this.isInited = true;
    };

    setDebugObj = () => {
        this.debugObj = {
            depthColor: new THREE.Color("#000"),
            surfaceColor: new THREE.Color("#00c6c8"),
            testObj: false,
        };
    };

    setGeometry = () => {
        this.geometry = new THREE.PlaneGeometry(2, 2, 500, 500);
        this.geometry.deleteAttribute("normal");
        this.geometry.deleteAttribute("uv");
    };

    setMaterial = () => {
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            fog: false,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uBigWavesElevation: { value: 0.15 },
                uBigWavesFrequency: {
                    value: new THREE.Vector2(3.5, 2.0),
                },
                uBigWavesSpeed: { value: 0.7 },

                uShift: { value: 0.026 },
                uPointLight: { value: true },
                uPointLightPos: { value: new THREE.Vector3(0.0, 0.5, 0.0) },
                uPointLightIntensity: { value: 2.0 },
                uPointLightDecay: { value: 0.8 },
                uPointLightSpecularPower: { value: 30.0 },

                uDirectionalLight: { value: false },
                uDirectionalLightPos: { value: new THREE.Vector3(0.0, 0.5, 0.0) },
                uDirectionalLightIntensity: { value: 1.0 },
                uDirectionalLightSpecularPower: { value: 30.0 },

                uSmallWavesCount: { value: 2.0 },
                uSmallWavesFrequency: { value: 3.1 },
                uSmallWavesElevation: { value: 0.2 },
                uSmallWavesSpeed: { value: 0.2 },

                // uVolume: { value: this.audioHandler.volume },

                uFoamColor: { value: this.debugObj?.foamColor },
                uFoamOffset: { value: 0.01 },
                uFoamMultiplier: { value: 12.0 },

                uDepthColor: { value: this.debugObj?.depthColor },
                uSurfaceColor: { value: this.debugObj?.surfaceColor },
                // uColorOffset: { value: 0.9 },
                // uColorMultiplier: { value: 1 },

                uColorOffset: { value: 0.4 },
                uColorMultiplier: { value: 1.7 },
                ...THREE.UniformsLib["fog"],
            },
        });
    };

    setMesh = () => {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.scene?.add(this.mesh);

        this.addTestObject();
    };

    /**
     * Add test object (box) to the scene
     */
    addTestObject = () => {
        if (this.debugObj.testObj) {
            this.testObj = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial());
            this.scene.add(this.testObj);
        } else {
            this.destroyTestObj();
        }
    };

    destroyTestObj = () => {
        this.testObj?.material?.dispose();
        this.testObj?.geometry?.dispose();
        this.scene?.remove(this.testObj);
    };

    setDebug = () => {
        if (!this.debug || !this.debug.gui) return;
        this.addBigWavesTweaks();
        this.addSmallWavesTweaks();
        this.addColorsTweaks();
        this.addShadingTweaks();
        this.addLightsTweaks();
        this.addTestObjTweaks();
    };

    addTestObjTweaks = () => {
        const object = this.debug.gui?.addFolder("Object").close();
        this.debugFolders.push(object);

        object
            .add(this.debugObj, "testObj")
            .name("Add object")
            .onChange((value) => {
                if (value) {
                    this.addTestObject();
                } else {
                    this.destroyTestObj();
                }
            });
    };

    addLightsTweaks = () => {
        const lights = this.debug.gui?.addFolder("Lights").close();

        const lightsObj = { lightType: "Point" };
        this.debugFolders.push(lights);

        lights
            .add(lightsObj, "lightType", ["Point", "Directional"])
            .name("Choose Light")
            .onChange((value) => {
                if (value == "Point") {
                    this.material.uniforms.uPointLight.value = true;
                    this.material.uniforms.uDirectionalLight.value = false;
                } else {
                    this.material.uniforms.uPointLight.value = false;
                    this.material.uniforms.uDirectionalLight.value = true;
                }
            });

        lights.add(this.material.uniforms.uPointLightPos.value, "x", -2.0, 2.0, 0.001).name("Point.X");
        lights.add(this.material.uniforms.uPointLightPos.value, "y", -2.0, 2.0, 0.001).name("Point.Y");
        lights.add(this.material.uniforms.uPointLightPos.value, "z", -2.0, 2.0, 0.001).name("Point.Z");
        lights.add(this.material.uniforms.uPointLightIntensity, "value", 0.0, 10.0, 0.001).name("Point.Intensity");
        lights.add(this.material.uniforms.uPointLightDecay, "value", 0.0, 2.0, 0.001).name("Point.Decay");
        lights.add(this.material.uniforms.uPointLightSpecularPower, "value", 0.01, 100.0, 0.001).name("Point.Specular");

        lights.add(this.material.uniforms.uDirectionalLightPos.value, "x", -2.0, 2.0, 0.001).name("Dir.X");
        lights.add(this.material.uniforms.uDirectionalLightPos.value, "y", -2.0, 2.0, 0.001).name("Dir.Y");
        lights.add(this.material.uniforms.uDirectionalLightPos.value, "z", -2.0, 2.0, 0.001).name("Dir.Z");
        lights.add(this.material.uniforms.uDirectionalLightIntensity, "value", 0.0, 10.0, 0.001).name("Dir.Intensity");
        lights
            .add(this.material.uniforms.uDirectionalLightSpecularPower, "value", 0.01, 100.0, 0.001)
            .name("Dir.Specular");
    };

    addShadingTweaks = () => {
        const shading = this.debug.gui?.addFolder("Shading").close();
        this.debugFolders.push(shading);
        shading.add(this.material?.uniforms.uShift, "value", 0.0001, 0.2, 0.001).name("Shading detalization");
    };

    addBigWavesTweaks = () => {
        const bigWaves = this.debug.gui?.addFolder("Big Waves").close();
        this.debugFolders.push(bigWaves);

        bigWaves.add(this.material?.uniforms.uBigWavesFrequency.value, "x", 0, 10, 0.001).name("Frequency X");
        bigWaves.add(this.material?.uniforms.uBigWavesFrequency.value, "y", 0, 10, 0.001).name("Frequency Y");
        bigWaves.add(this.material?.uniforms.uBigWavesElevation, "value", 0, 10, 0.001).name("Elevation");
        bigWaves.add(this.material?.uniforms.uBigWavesSpeed, "value", 0, 10, 0.001).name("Speed");
    };

    addSmallWavesTweaks = () => {
        const smallWaves = this.debug.gui?.addFolder("Small Waves").close();
        this.debugFolders.push(smallWaves);

        smallWaves.add(this.material.uniforms.uSmallWavesCount, "value", 0, 10, 0.001).name("Count");
        smallWaves.add(this.material.uniforms.uSmallWavesFrequency, "value", 0, 10, 0.001).name("Frequency");
        smallWaves.add(this.material.uniforms.uSmallWavesElevation, "value", 0, 2, 0.001).name("Elevation");
        smallWaves.add(this.material.uniforms.uSmallWavesSpeed, "value", 0, 10, 0.001).name("Speed");
    };

    addColorsTweaks = () => {
        const colorsFolder = this.debug.gui?.addFolder("Colors").close();
        this.debugFolders.push(colorsFolder);

        colorsFolder
            .addColor(this.debugObj, "surfaceColor")
            .name("Surface color")
            .onChange((value) => {
                this.material.uniforms.uSurfaceColor.value = value;
            });

        colorsFolder
            .addColor(this.debugObj, "depthColor")
            .name("Depth color")
            .onChange((value) => {
                this.material.uniforms.uDepthColor.value = value;
            });
        colorsFolder.add(this.material.uniforms.uColorOffset, "value", 0, 3, 0.001).name("Offset");
        colorsFolder.add(this.material.uniforms.uColorMultiplier, "value", 0, 10, 0.001).name("Multiplier");
    };

    update = () => {
        if (this.isInited) {
            this.material.uniforms.uTime.value = this.time?.elapsed;
            // this.material.uniforms.uVolume.value = this.audioHandler.volume;
        }

        if (this.testObj) {
            this.testObj.position.y = this.calcBigWavesElevation(this.testObj.position);
        }
    };

    calcBigWavesElevation = (position) => {
        return (
            Math.sin(
                position.x * this.material.uniforms.uBigWavesFrequency.value.x +
                    this.time?.elapsed * this.material.uniforms.uBigWavesSpeed.value
            ) *
            Math.sin(
                position.z * this.material.uniforms.uBigWavesFrequency.value.y +
                    this.time?.elapsed * this.material.uniforms.uBigWavesSpeed.value
            ) *
            this.material.uniforms.uBigWavesElevation.value
        );
    };

    destroy = () => {
        this.scene?.remove(this.mesh);
        this.material?.dispose();
        this.geometry?.dispose();
        this.isInited = false;

        this.debugFolders.forEach((folder) => {
            folder.destroy();
        });

        this.destroyTestObj();
    };
}
