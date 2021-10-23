class SubmenuList extends HTMLElement {
    constructor() {
        super()
        this.selectedIndex = -1
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                #submenu {
                    color: var(--menubar-color);
                    background-color: var(--menubar-background-color);
                    z-index: 10000;

                    border-color: var(--menubar-border-color);
                    border-style: solid;
                    border-width: 1px;
                    white-space: nowrap;
                    box-shadow: 2px 2px 20px 2px var(--menubar-shadow-color);
                }
            </style>
            <div id="submenu" tabindex="-1">
                <slot id="slot">
            </div>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes() {
        return ['index', 'is-accelerated']
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        switch (attributeName) {
            case "index":
                this.index = newValue
                this.menuItems = Array.from(document.querySelectorAll('menubar-menuitem'))
                    .filter(n => n.assignedSlot.id == `submenu-${this.index}`)
                this.menuItems.forEach((n, i) => {
                    n.classList.add("submenu-item")
                    n.setAttribute("index", i)
                })
                setTimeout(() => this.mnemonics = this.menuItems.map(n => n.getMnemonic()).map((n, i) => ({key: n, index: i})))
                break
            case "is-accelerated":
                if (oldValue != newValue)
                    this.isAccelerated = newValue == "true"
                break
        }
    }

    connectedCallback() {
        this.addEventListener("menubar-item-mouseover", evt => {
            this.selectedIndex = evt.detail.index
        })
    }

    get selectedIndex() {
        return this._selectedIndex
    }

    set selectedIndex(value) {
        this._selectedIndex = value
        if (this.menuItems)
            this.menuItems.forEach(n => n.setAttribute("selected-index", value))
    }

    resetIndex() { this.selectedIndex = -1 }

    onKeyDown(evt) {
        switch (evt.which) {
            case 13: // Enter
            case 32: // Space                
                if (this.selectedIndex != -1)
                    this.menuItems[this.selectedIndex].executeCommand()
                this.keyIndex = 0
                this.lastKey = null
                evt.preventDefault()
                evt.stopPropagation()
                break
            case 38: //  |^
                this.selectedIndex--
                if (this.selectedIndex < 0)
                    this.selectedIndex = this.menuItems.length - 1
                evt.preventDefault()
                evt.stopPropagation()
                break
            case 40: //  |d
                this.selectedIndex++
                if (this.selectedIndex == this.menuItems.length)
                    this.selectedIndex = 0
                evt.preventDefault()
                evt.stopPropagation()
                break
            default:
                if (this.isAccelerated) {
                    const items = this.mnemonics.filter(n => n.key == evt.key).map(n => n.index)
                    if (items.length == 1) {
                        this.menuItems[items[0]].executeCommand()
                        evt.preventDefault()
                        evt.stopPropagation()
                    } else if (items.length > 1) {
                        if (this.lastKey != evt.key) {
                            this.lastKey = evt.key
                            this.keyIndex = 0
                        }
                        else {
                            this.keyIndex++
                            if (this.keyIndex >= items.length)
                                this.keyIndex = 0
                        }
                        this.selectedIndex = items[this.keyIndex]
                        evt.preventDefault()
                        evt.stopPropagation()
                    }
                    if (this.lastKey != evt.key)
                        this.lastKey = evt.key
                }
                break
        }
    }
}

customElements.define('menubar-submenu-list', SubmenuList)