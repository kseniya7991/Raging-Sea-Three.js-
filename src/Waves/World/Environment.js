import * as THREE from "three";
import Waves from "../Waves";

export default class Environment {
    constructor() {
        this.waves = new Waves();
        this.scene = this.waves.scene;
        this.resources = this.waves.resources;

        //Debug
        this.debug = this.waves.debug;

        this.initComponent();
    }

    initComponent = () => {
        this.setSunLight();
        this.setEnvMap();

        this.setDebug();
    };

    setDebug = () => {
        if (this.debug?.active) {
            this.debugFolder = this.debug.gui?.addFolder("Environment");
            if (this.environmentMap)
                this.debugFolder
                    ?.add(this.environmentMap, "intensity", 0, 5, 0.001)
                    .onChange((value) => {
                        this.updateMaterials();
                    });

            if (this.sunLight) this.debugFolder?.add(this.sunLight, "intensity", 0, 5, 0.001);
        }
    };

    setSunLight = () => {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, -1.25);

        this.scene?.add(this.sunLight);
    };

    setEnvMap = () => {
        this.environmentMap = {};
        this.environmentMap.intensity = 2;
        this.environmentMap.texture = this.resources?.items.environmentMapTexture;
        this.environmentMap.colorSpace = THREE.SRGBColorSpace;

        if (!this.scene) return;
        this.scene.environment = this.environmentMap.texture;

        this.updateMaterials();
    };

    updateMaterials = () => {
        if (!this.scene) return;
        this.scene.traverse((child) => {
            //@ts-ignore
            if (child.isMesh && child.material.isMeshStandardMaterial && this.environmentMap) {
                //@ts-ignore
                child.material.envMap = this.environmentMap.texture;
                //@ts-ignore
                child.material.envMapIntensity = this.environmentMap.intensity;
                //@ts-ignore
                child.material.needsUpdate = true;
            }
        });
    };
}
