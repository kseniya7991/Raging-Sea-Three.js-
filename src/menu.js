const MENU_SELECTOR = ".menu__list";
const MENU_ITEM_SELECTOR = ".menu__item";

const ACTIVE_CLASS = "active";
const HOVWEWD_CLASS = "hovered";

const initMenu = () => {
    const menu = document.querySelector(MENU_SELECTOR);
    if (!menu) return;
    new Menu(menu);
};

export class Menu {
    constructor(wrap) {
        this.wrap = wrap;

        this.items = document.querySelectorAll(MENU_ITEM_SELECTOR);

        initComponent();
    }

    initComponent = () => {
        this.addListeners();
    };

    addListeners = () => {
        if (!this.items || this.items.length <= 0) return;
        this.items.forEach((item) => {
            item.addEventListener("click", () => {});
        });
    };
}

export default initMenu;
