import * as THREE from "three";
import Waves from "../Waves";
import Environment from "./Environment";
import PlaneWaves from "./Waves/Plane/PlaneWaves";

export default class World {
    constructor() {
        this.waves = new Waves();
        this.scene = this.waves.scene;
        this.resources = this.waves.resources;

        this.initComponent();
    }

    initComponent = () => {
        this.environment = new Environment();
        this.planeWaves = new PlaneWaves();
        /*  this.resources?.on(this.resources.eventName, () => {
            this.environment = new Environment();
            this.floor = new Floor();
            console.log("test");
            this.fox = new Fox();
        }); */
    };

    update = () => {
        this.planeWaves?.update();
    };

    destroy = () => {
        this.scene?.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();

                for (let key in child.material) {
                    const value = child.material[key];

                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                }
            }
        });
    };
}
