import Waves from "./Waves";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;

export default class Camera {
    constructor() {
        this.waves = new Waves();

        this.sizes = this.waves.sizes;
        this.scene = this.waves.scene;
        this.canvas = this.waves.canvas;

        this.initComponent();
    }

    initComponent() {
        this.initCamera();
        this.initcontrols();
    }

    initCamera = () => {
        if (!this.sizes) return;
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes?.width / this.sizes?.height,
            CAMERA_NEAR,
            CAMERA_FAR
        );
        this.instance.position.set(1, 1, 2);

        this.scene?.add(this.instance);
    };

    reset = () => {
        this.instance.position.set(1, 1, 2);
    };

    initcontrols = () => {
        if (!this.instance) return;

        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    };

    resize = () => {
        if (!this.instance || !this.sizes) return;
        this.instance.aspect = this.sizes?.width / this.sizes?.height;
        this.instance.updateProjectionMatrix();
    };

    update = () => {
        if (!this.controls) return;

        this.controls.update();
    };

    destroy = () => {
        this.controls?.dispose();
    };
}
