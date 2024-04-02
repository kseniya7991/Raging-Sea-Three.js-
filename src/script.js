import Waves from "./Waves/Waves";
import "./styles/index.scss";
import initMenu from "./menu";

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    const template = new Waves("canvas.webgl");
    initMenu();
});
