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

    initComponent = () => {};
}
