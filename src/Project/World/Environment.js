import * as THREE from "three";
import Project from "../Project";

export default class Environment {
    constructor() {
        this.project = new Project();
        this.scene = this.project.scene;
        this.resources = this.project.resources;

        //Debug
        this.debug = this.project.debug;
        this.initComponent();
    }

    initComponent = () => {};
}
