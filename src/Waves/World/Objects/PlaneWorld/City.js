import * as THREE from "three";
import Waves from "../../../Waves";
import Environment from "../../Environment";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const ACTIVE_CLASS = "active";
const OBJECT_SELECTOR = ".js-world__city";

export default class PlaneWorld {
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
            depthColor: new THREE.Color("#b3fcfc"),
            surfaceColor: new THREE.Color("#036d94"),
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
            transparent: true,
            uniforms: {
                uTime: { value: 0 },

                uBuildingsElevation: { value: 0.2 },
                uBuildingsCount: { value: 20.0 },

                uDepthColor: { value: this.debugObj?.depthColor },
                uSurfaceColor: { value: this.debugObj?.surfaceColor },
                uColorOffset: { value: 0.4 },
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
        this.addBuildingsTweaks();
        this.addColorsTweaks();
    };

    addBuildingsTweaks = () => {
        const buildings = this.debug.gui?.addFolder("Buildings").close();
        buildings
            .add(this.material.uniforms.uBuildingsCount, "value", 0, 10, 0.001)
            .name("Count");
        buildings
            .add(this.material.uniforms.uBuildingsElevation, "value", 0, 10, 0.001)
            .name("Elevation");
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
