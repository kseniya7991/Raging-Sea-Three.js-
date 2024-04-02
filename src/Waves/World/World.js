import * as THREE from "three";
import Waves from "../Waves";
import Environment from "./Environment";
import RagingSea from "./Objects/Plane/RagingSea";
import LiveSphere from "./Objects/LiveSphere/LiveSphere";
import HellSphere from "./Objects/HellSphere/HellSphere";
import City from "./Objects/PlaneWorld/City";
import Fog from "./Fog";

const HTML_OBJ_SELECTOR = ".js-world__obj";

export default class World {
    constructor() {
        this.waves = new Waves();
        this.scene = this.waves.scene;
        this.resources = this.waves.resources;

        this.htmlObjects = document.querySelectorAll(HTML_OBJ_SELECTOR);
        this.toggleEventName = "toggle";

        this.initComponent();
    }

    initComponent = () => {
        this.environment = new Environment();
        this.ragingSea = new RagingSea();
        this.city = new City();
        this.liveSphere = new LiveSphere();
        this.hellSphere = new HellSphere();

        this.addListeners();

        this.fog = new Fog();
    };

    addListeners = () => {
        console.log(this.htmlObjects);
        Array.from(this.htmlObjects).forEach((item) => {
            item.addEventListener(this.toggleEventName, () => {
                this.toggle(item);
            });
        });
    };

    toggle = (item) => {
        this.hellSphere?.toggle(item);
    };

    update = () => {
        this.ragingSea?.update();
        this.liveSphere?.update();
        this.hellSphere?.update();
        this.city?.update();
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
