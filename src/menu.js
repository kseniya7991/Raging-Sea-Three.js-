const MENU_SELECTOR = ".menu__list";
const MENU_ITEM_SELECTOR = ".menu__item";

const ACTIVE_CLASS = "active";
const HOVERED_CLASS = "hovered";

import EventEmitter from "./Waves/Utils/EventEmitter";

const initMenu = () => {
    const menu = document.querySelector(MENU_SELECTOR);
    if (!menu) return;
    new Menu(menu);
};

export class Menu extends EventEmitter {
    constructor(wrap) {
        super();
        this.wrap = wrap;

        this.items = document.querySelectorAll(MENU_ITEM_SELECTOR);
        this.animId = null;

        this.toggleEventName = "toggle";
        this.toggleEvent = new Event(this.toggleEventName);

        this.initComponent();
    }

    initComponent = () => {
        this.addListeners();
    };

    addListeners = () => {
        if (!this.items || this.items.length <= 0) return;

        console.log("menu");

        this.items.forEach((item) => {
            item.addEventListener("click", () => {
                this.clearActive();
                item.classList.add(ACTIVE_CLASS);
                this.trigger(this.eventName);

                item.dispatchEvent(this.toggleEvent);

                this.clearAndStartAnim(item);
            });

            item.addEventListener("mouseover", () => {
                item.classList.add(HOVERED_CLASS);
                this.wrap.classList.add(HOVERED_CLASS);
            });
            item.addEventListener("mouseleave", () => {
                item.classList.remove(HOVERED_CLASS);
                if (this.checkIsHovered()) {
                    this.wrap.classList.add(HOVERED_CLASS);
                } else {
                    this.wrap.classList.remove(HOVERED_CLASS);
                }
            });
        });
    };

    clearAndStartAnim = (item) => {
        item.classList.remove("anim");
        setTimeout(() => {
            this.initAmim(item);
        }, 0);
    };

    initAmim = (item) => {
        item.classList.add("anim");
        clearTimeout(this.animId);
        this.animId = setTimeout(() => {
            item.classList.remove("anim");
        }, 500);
    };

    checkIsHovered = () => {
        Array.from(this.items).some((item) => item.classList.contains(HOVERED_CLASS));
    };

    clearActive = () => {
        this.items.forEach((item) => {
            item.classList.remove(ACTIVE_CLASS);
        });
    };
}

export default initMenu;
