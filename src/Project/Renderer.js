import Project from "./Project";
import * as THREE from "three";

export default class Renderer {
    constructor() {
        this.project = new Project();

        this.canvas = this.project.canvas;
        this.sizes = this.project.sizes;
        this.scene = this.project.scene;
        this.camera = this.project.camera;

        this.initComponent();
    }

    initComponent() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

        this.instance.setClearColor("#211d20");

        this.resize();
    }

    resize() {
        if (!this.sizes || !this.instance) return;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update = () => {
        if (!this.scene || !this.camera || !this.camera.instance) return;
        this.instance?.render(this.scene, this.camera.instance);
    };

    destroy = () => {
        this.instance?.dispose();
    };
}
