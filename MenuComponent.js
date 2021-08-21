class MenubarComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                .menubar {
                    user-select: none;
                    cursor: default;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .invisible {
                    display: none;
                }
            </style>
            <ul class="menubar">
                <slot name="menuitem"></slot>
            </ul>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.menubar = this.shadowRoot.querySelector('ul')
        this.autoMode = this.attributes.autoMode
        if (this.autoMode)
            this.menubar.classList.add("invisible")
    }
}

class MenubarItemComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                .menubarItem {
                    float: left;
                }
            </style>
            <li class="menubarItem">
                <slot></slot>
            </li>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

customElements.define('menubar-component', MenubarComponent)
customElements.define('menubar-item-component', MenubarItemComponent)