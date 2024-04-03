import Project from "./Project/Project";
import "./styles/index.scss";
import initMenu from "./menu";

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    const template = new Project("canvas.webgl");
    initMenu();
});
