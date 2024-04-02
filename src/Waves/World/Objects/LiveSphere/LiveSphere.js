import * as THREE from "three";
import Waves from "../../../Waves";
import Environment from "../../Environment";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const ACTIVE_CLASS = "active";
const OBJECT_SELECTOR = ".js-world__live-sphere";

export default class LiveSphere {
    constructor() {
        this.waves = new Waves();

        this.htmlEl = document.querySelector(OBJECT_SELECTOR);

        this.time = this.waves.time;
        this.debug = this.waves.debug;
        this.scene = this.waves.scene;
        this.resources = this.waves.resources;

        this.initComponent();
    }

    initComponent = () => {
        this.setDebugObj();

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.setDebug();

        if (this.htmlEl && !this.htmlEl.classList.contains(ACTIVE_CLASS)) {
            this.destroy();
        }
    };

    setDebugObj = () => {
        this.debugObj = {
            depthColor: new THREE.Color("#ffd694"),
            surfaceColor: new THREE.Color("#d60003"),
        };
    };

    setGeometry = () => {
        this.geometry = new THREE.SphereGeometry(0.5, 150, 150);
    };

    setMaterial = () => {
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            fog: false,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uBigWavesElevation: { value: 0.075 },
                uBigWavesFrequency: {
                    value: new THREE.Vector2(1.5, 10.0),
                },
                uBigWavesSpeed: { value: 2.2 },

                uSmallWavesCount: { value: 1.0 },
                uSmallWavesFrequency: { value: 1.0 },
                uSmallWavesElevation: { value: 0.8 },
                uSmallWavesSpeed: { value: 0.2 },

                uDepthColor: { value: this.debugObj?.depthColor },
                uSurfaceColor: { value: this.debugObj?.surfaceColor },
                // uColorOffset: { value: 0.25 },
                uColorOffset: { value: 0.3 },
                uColorMultiplier: { value: 3.2 },
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
    };

    addBigWavesTweaks = () => {
        const bigWaves = this.debug.gui?.addFolder("Big Waves").close();
        bigWaves
            .add(this.material?.uniforms.uBigWavesFrequency.value, "x", 0, 10, 0.001)
            .name("Frequency X");
        bigWaves
            .add(this.material?.uniforms.uBigWavesFrequency.value, "y", 0, 30, 0.001)
            .name("Frequency Y");
        bigWaves
            .add(this.material?.uniforms.uBigWavesElevation, "value", 0, 10, 0.001)
            .name("Elevation");
        bigWaves
            .add(this.material?.uniforms.uBigWavesSpeed, "value", 0, 10, 0.001)
            .name("Speed");
    };

    addSmallWavesTweaks = () => {
        const smallWaves = this.debug.gui?.addFolder("Small Waves").close();
        smallWaves
            .add(this.material.uniforms.uSmallWavesFrequency, "value", 0, 3, 0.001)
            .name("Frequency");
        smallWaves
            .add(this.material.uniforms.uSmallWavesElevation, "value", 0, 2, 0.001)
            .name("Elevation");
        smallWaves
            .add(this.material.uniforms.uSmallWavesSpeed, "value", 0, 10, 0.001)
            .name("Speed");
    };

    addColorsTweaks = () => {
        const colorsFolder = this.debug.gui?.addFolder("Colors").close();
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
        colorsFolder
            .add(this.material.uniforms.uColorOffset, "value", 0, 3, 0.001)
            .name("Offset");
        colorsFolder
            .add(this.material.uniforms.uColorMultiplier, "value", 0, 10, 0.001)
            .name("Multiplier");
    };

    update = () => {
        if (this.isActive) this.material.uniforms.uTime.value = this.time?.elapsed;
    };

    destroy = () => {
        this.scene?.remove(this.mesh);
        this.material?.dispose();
        this.geometry?.dispose();
    };
}
