import * as THREE from "three";
import Project from "../../../Project";
import Environment from "../../Environment";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const ACTIVE_CLASS = "active";
const OBJECT_SELECTOR = ".js-world__raging-sea";

export default class RagingSea {
    constructor() {
        this.project = new Project();

        this.htmlEl = document.querySelector(OBJECT_SELECTOR);

        this.time = this.project.time;
        this.debug = this.project.debug;
        this.scene = this.project.scene;
        this.resources = this.project.resources;

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
            depthColor: new THREE.Color("#186691"),
            surfaceColor: new THREE.Color("#9bd8ff"),
            foamColor: new THREE.Color("#ffffff"),
        };
    };

    setGeometry = () => {
        this.geometry = new THREE.PlaneGeometry(2, 2, 500, 500);
    };

    setMaterial = () => {
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            fog: true,
            uniforms: {
                uTime: { value: 0 },
                uBigWavesElevation: { value: 0.15 },
                uBigWavesFrequency: {
                    value: new THREE.Vector2(3.5, 2.0),
                },
                uBigWavesSpeed: { value: 0.6 },

                uSmallWavesCount: { value: 2.0 },
                uSmallWavesFrequency: { value: 6.0 },
                uSmallWavesElevation: { value: 0.1 },
                uSmallWavesSpeed: { value: 0.4 },

                uFoamColor: { value: this.debugObj?.foamColor },
                uFoamOffset: { value: 0.01 },
                uFoamMultiplier: { value: 12.0 },

                uDepthColor: { value: this.debugObj?.depthColor },
                uSurfaceColor: { value: this.debugObj?.surfaceColor },
                uColorOffset: { value: 0.2 },
                uColorMultiplier: { value: 2.5 },
                ...THREE.UniformsLib["fog"],
            },
        });
    };

    setMesh = () => {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.scene?.add(this.mesh);
    };

    setDebug = () => {
        if (!this.debug || !this.debug.gui) return;
        this.addBigWavesTweaks();
        this.addSmallWavesTweaks();
        this.addColorsTweaks();
        this.addFoamTweaks();
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

    addFoamTweaks = () => {
        const foamFolder = this.debug.gui?.addFolder("Foam").close();
        this.debugFolders.push(foamFolder);

        foamFolder
            .addColor(this.debugObj, "foamColor")
            .name("Foam color")
            .onChange((value) => {
                this.material.uniforms.uFoamColor.value = value;
            });
        foamFolder.add(this.material.uniforms.uFoamOffset, "value", 0, 3, 0.001).name("Offset");
        foamFolder.add(this.material.uniforms.uFoamMultiplier, "value", 0, 20, 0.001).name("Multiplier");
    };

    update = () => {
        if (this.isInited) this.material.uniforms.uTime.value = this.time?.elapsed;
    };

    destroy = () => {
        this.scene?.remove(this.mesh);
        this.material?.dispose();
        this.geometry?.dispose();
        this.isInited = false;

        this.debugFolders.forEach((folder) => {
            folder.destroy();
        });
    };
}
