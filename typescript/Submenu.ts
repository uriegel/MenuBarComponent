export class Submenu extends HTMLElement {

    private menubaritem: HTMLElement
    private item: HTMLElement
    private index: number
    private submenulist: HTMLElement

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                #menubarItem {
                    float: left;
                    align-items: center;
                    height: 100%;
                }
                #header {
                    height: 100%;
                    display: flex;
                    align-items: inherit;                    
                }
                #header:hover {
                    background-color: var(--menubar-hover-color);
                }
                .selected #header {
                    color: var(--menubar-selected-color);
                    background-color: var(--menubar-selected-background-color);
                }
                #submenu {
                    display: none;
                    position: absolute;
                    z-index: 10000;
                }
                .selected #submenu {
                    display: block;
                }
                .is-keyboard-activated #submenu  {
                    display: none;
                }
            </style>
            <li id="menubarItem">
                <div id="header">
                    <menubar-menuitem mainmenu="true" id="item"></menubar-menuitem>
                </div>
                <menubar-submenu-list id="submenu">
                    <slot id="slot">
                </menubar-submenu-list>
            </li>
        `
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
        this.menubaritem = this.shadowRoot!.getElementById("menubarItem")!
        this.item = this.shadowRoot!.getElementById("item")!
        this.index = Number.parseInt(this.getAttribute("index")!)
        this.item.setAttribute("text", this.getAttribute("header")!)
        this.item.setAttribute("index", this.index.toString())
        const slot = this.shadowRoot!.getElementById("slot") as HTMLSlotElement
        slot.id = `submenu-${this.index}`
        this.submenulist = this.shadowRoot!.getElementById('submenu')!
        this.submenulist.setAttribute("index", this.index.toString())
    }

    static get observedAttributes() {
        return ['is-accelerated', 'is-keyboard-activated', 'selected-index']
    }

    connectedCallback() {
        this.menubaritem.addEventListener("mouseover", () => this.dispatchEvent(new CustomEvent('menubar-item-mouseover', {
            bubbles: true,
            composed: true,
            detail: {
                mainmenu: true,
                index: this.index
            }
        })))
        this.menubaritem.addEventListener("click", evt => {
            if (!(evt.target! as HTMLElement).classList.contains("submenu-item"))
                this.item.executeCommand()
        })
    }

    onKeyDown(evt: KeyboardEvent) {
        const items = Array.from(this.shadowRoot!.querySelectorAll('menubar-submenu-list'))
            .filter(n => window.getComputedStyle(n).display != "none")
        if (items.length == 1)
            items[0].onKeyDown(evt) 
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {
        switch (attributeName) {
            case "is-accelerated":
                if (oldValue != newValue)
                    this.handleIsAccelerated(newValue)
                break
            case "selected-index":
                if (oldValue != newValue) {
                    const selectedIndex = Number.parseInt(newValue)
                    if (selectedIndex == this.index) {
                        this.menubaritem.classList.add("selected")
                        if (!this.menubaritem.classList.contains("is-keyboard-activated"))
                            this.submenulist.resetIndex()
                    }
                    else
                        this.menubaritem.classList.remove("selected")
                }
                break
            case "is-keyboard-activated":
                if (oldValue != newValue) {
                    if (newValue == "true")
                        this.menubaritem.classList.add("is-keyboard-activated")
                    else {
                        this.menubaritem.classList.remove("is-keyboard-activated")
                        if (this.menubaritem.classList.contains("selected"))
                            this.submenulist.resetIndex()
                    }
                }
                break
        }
    }

    handleIsAccelerated(value: string) {
        const items = Array.from(this.shadowRoot!.querySelectorAll('menubar-menuitem'))
        items.forEach(n => n.setAttribute("is-accelerated", value))
        this.submenulist.setAttribute("is-accelerated", value)
    }
}

customElements.define('menubar-submenu', Submenu)
