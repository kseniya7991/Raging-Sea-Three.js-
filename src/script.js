import Waves from "./Waves/Waves";
import "./styles/index.scss";
import initMenu from "./menu";

window.addEventListener("DOMContentLoaded", () => {
    const template = new Waves("canvas.webgl");
    initMenu();
});
