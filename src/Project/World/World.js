import * as THREE from "three";
import Project from "../Project";
import Environment from "./Environment";
import RagingSea from "./Objects/Plane/RagingSea";
import RagingSeaShading from "./Objects/PlaneShading/RagingSeaShading";
import LiveSphere from "./Objects/LiveSphere/LiveSphere";
import HellSphere from "./Objects/HellSphere/HellSphere";
import City from "./Objects/City/City";
import Fog from "./Fog";

const HTML_OBJ_SELECTOR = ".js-world__obj";

export default class World {
    constructor() {
        this.project = new Project();
        this.scene = this.project.scene;
        this.resources = this.project.resources;

        this.htmlObjects = document.querySelectorAll(HTML_OBJ_SELECTOR);
        this.toggleEventName = "toggle";

        this.initComponent();
    }

    initComponent = () => {
        this.environment = new Environment();
        this.ragingSea = new RagingSea();
        this.ragingSeaShading = new RagingSeaShading();
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
        this.project.camera?.reset();

        this.ragingSea?.toggle(item);
        this.ragingSeaShading?.toggle(item);
        this.city?.toggle(item);
        this.liveSphere?.toggle(item);
        this.hellSphere?.toggle(item);
    };

    update = () => {
        this.ragingSea?.update();
        this.ragingSeaShading?.update();
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
