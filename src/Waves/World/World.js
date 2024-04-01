import * as THREE from "three";
import Waves from "../Waves";
import Environment from "./Environment";
import PlaneWaves from "./Objects/Plane/PlaneWaves";
import LiveSphere from "./Objects/LiveSphere/LiveSphere";
import HellSphere from "./Objects/HellSphere/HellSphere";
import PlaneWorld from "./Objects/PlaneWorld/PlaneWorld";
import Fog from "./Fog";

export default class World {
    constructor() {
        this.waves = new Waves();
        this.scene = this.waves.scene;
        this.resources = this.waves.resources;

        this.initComponent();
    }

    initComponent = () => {
        this.environment = new Environment();
        this.planeWorld = new PlaneWorld();
        // this.planeWaves = new PlaneWaves();
        // this.liveSphere = new LiveSphere();
        // this.hellSphere = new HellSphere();

        this.fog = new Fog();
    };

    update = () => {
        this.planeWaves?.update();
        this.liveSphere?.update();
        this.hellSphere?.update();
        this.planeWorld?.update();
        this.planeLights?.update();
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
