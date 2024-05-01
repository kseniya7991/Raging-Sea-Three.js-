import * as THREE from "three";
import Project from "./Project";
import Environment from "./World/Environment";

export default class AudioHandler {
    constructor() {
        this.project = new Project();

        this.time = this.project.time;
        this.debug = this.project.debug;
        this.scene = this.project.scene;
        this.resources = this.project.resources;
        this.volume = 0;

        // this.initComponent();
    }

    initComponent = async () => {
        console.log("audio");

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const analyserNode = audioContext.createAnalyser();
        mediaStreamAudioSourceNode.connect(analyserNode);

        const pcmData = new Float32Array(analyserNode.fftSize);
        const onFrame = () => {
            analyserNode.getFloatTimeDomainData(pcmData);
            let sumSquares = 0.0;
            for (const amplitude of pcmData) {
                sumSquares += amplitude * amplitude;
            }
            this.volume = Math.sqrt(sumSquares / pcmData.length);
            window.requestAnimationFrame(onFrame);
        };
        window.requestAnimationFrame(onFrame);
    };
}
