import * as THREE from "three";
import Waves from "../../../Waves";
import Environment from "../../Environment";

//@ts-ignore
import vertexShader from "./shaders/vertex.glsl";

//@ts-ignore
import fragmentShader from "./shaders/fragment.glsl";

export default class PlaneWaves {
    constructor() {
        this.waves = new Waves();

        this.time = this.waves.time;
        this.debug = this.waves.debug;
        this.scene = this.waves.scene;
        this.resources = this.waves.resources;

        this.initComponent();
    }

    initComponent = () => {
        this.debugObj = {
            depthColor: new THREE.Color("#186691"),
            surfaceColor: new THREE.Color("#9bd8ff"),
            foamColor: new THREE.Color("#ffffff"),
        };

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.setDebug();
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

                uSmallWavesCount: { value: 3.0 },
                uSmallWavesFrequency: { value: 3.0 },
                uSmallWavesElevation: { value: 0.1 },
                uSmallWavesSpeed: { value: 0.2 },

                uFoamColor: { value: this.debugObj?.foamColor },
                uFoamOffset: { value: 0.01 },
                uFoamMultiplier: { value: 12.0 },

                uDepthColor: { value: this.debugObj?.depthColor },
                uSurfaceColor: { value: this.debugObj?.surfaceColor },
                // uColorOffset: { value: 0.25 },
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

    update = () => {
        this.material.uniforms.uTime.value = this.time?.elapsed;
    };

    setDebug = () => {
        if (!this.debug) return;
        const bigWaves = this.debug.gui?.addFolder("Big Waves").close();
        bigWaves
            .add(this.material?.uniforms.uBigWavesFrequency.value, "x", 0, 10, 0.001)
            .name("Frequency X");
        bigWaves
            .add(this.material?.uniforms.uBigWavesFrequency.value, "y", 0, 10, 0.001)
            .name("Frequency Y");
        bigWaves
            .add(this.material?.uniforms.uBigWavesElevation, "value", 0, 10, 0.001)
            .name("Elevation");
        bigWaves.add(this.material?.uniforms.uBigWavesSpeed, "value", 0, 10, 0.001).name("Speed");

        const smallWaves = this.debug.gui?.addFolder("Small Waves").close();
        smallWaves
            .add(this.material.uniforms.uSmallWavesCount, "value", 0, 10, 0.001)
            .name("Count");
        smallWaves
            .add(this.material.uniforms.uSmallWavesFrequency, "value", 0, 10, 0.001)
            .name("Frequency");
        smallWaves
            .add(this.material.uniforms.uSmallWavesElevation, "value", 0, 2, 0.001)
            .name("Elevation");
        smallWaves
            .add(this.material.uniforms.uSmallWavesSpeed, "value", 0, 10, 0.001)
            .name("Speed");

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
        colorsFolder.add(this.material.uniforms.uColorOffset, "value", 0, 3, 0.001).name("Offset");
        colorsFolder
            .add(this.material.uniforms.uColorMultiplier, "value", 0, 10, 0.001)
            .name("Multiplier");

        const foamFolder = this.debug.gui?.addFolder("Foam").close();
        foamFolder
            .addColor(this.debugObj, "foamColor")
            .name("Foam color")
            .onChange((value) => {
                this.material.uniforms.uFoamColor.value = value;
            });
        foamFolder.add(this.material.uniforms.uFoamOffset, "value", 0, 3, 0.001).name("Offset");
        foamFolder
            .add(this.material.uniforms.uFoamMultiplier, "value", 0, 20, 0.001)
            .name("Multiplier");
    };
}
