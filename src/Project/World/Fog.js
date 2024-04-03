import * as THREE from "three";
import Project from "../Project";
import Environment from "./Environment";

export default class Fog {
    constructor() {
        this.project = new Project();

        this.time = this.project.time;
        this.debug = this.project.debug;
        this.scene = this.project.scene;
        this.resources = this.project.resources;

        this.initComponent();
    }

    initComponent = () => {
        this.setDebugObj();
        this.setSceneBackground();
        this.setDebug();
    };

    setDebugObj = () => {
        this.debugObj = {
            fogColor: new THREE.Color("#283042"),
        };
    };

    setSceneBackground = () => {
        this.scene.background = this.debugObj.fogColor;
        this.scene.fog = new THREE.Fog(this.debugObj.fogColor, 1, 6);
    };

    setDebug = () => {
        if (!this.debug || !this.debug.gui) return;
        const fogFolder = this.debug.gui.addFolder("Fog").close();

        fogFolder
            .addColor(this.scene.fog, "color")
            .name("Color")
            .onChange((value) => {
                this.scene.background = value;
            });
        fogFolder.add(this.scene.fog, "near").min(0).max(2).step(0.001).name("Near");
        fogFolder.add(this.scene.fog, "far").min(1).max(10).step(0.001).name("Far");
    };
}
