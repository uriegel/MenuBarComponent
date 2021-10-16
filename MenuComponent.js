class MenubarComponent extends HTMLElement {

    get isAccelerated()  {
        return this._isAccelerated
    }
    set isAccelerated(value) {
        this._isAccelerated = value
        const items = Array.from(document.querySelectorAll('menubar-submenu-component'))
        items.forEach(n => n.setAttribute("is-accelerated", value))
    }

    get selectedIndex()  {
        return this._selectedIndex
    }
    set selectedIndex(value) {
        this._selectedIndex = value
        const items = Array.from(document.querySelectorAll('menubar-submenu-component'))
        items.forEach(n => n.setAttribute("selected-index", value))
    }
    constructor() {
        super()
        this.isAccelerated = false
        this.selectedIndex = -1
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
                <slot></slot>
            </ul>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        const items = Array.from(document.querySelectorAll('menubar-submenu-component'))
        this.itemCount = items.length
        items.forEach((n, i) => n.setAttribute("index", i))

        this.menubar = this.shadowRoot.querySelector('ul')
        this.autoMode = this.getAttribute("automode") == "true"
        if (this.autoMode)
            this.menubar.classList.add("invisible")
    }

    connectedCallback() {
        document.addEventListener("keydown", evt => {
            if (this.autoMode && evt.keyCode == 18) { // alt
                if (this.menubar.classList.contains("invisible"))
                    this.menubar.classList.remove("invisible")
                else
                    this.menubar.classList.add("invisible")
                // setTimeout(() => {
                //     this.$el.style.setProperty('--vue-menu-submenu-top', `${this.$el.children[0].clientHeight}px`)
                //     this.$emit('resize')
                // })
                evt.preventDefault()
                evt.stopPropagation()
            }            
            // if (this.menuState.isKeyboardActivated) {
            //     const hits = parseShortcuts(this.shortcuts, evt.key)
            //     if (hits.length > 0) {
            //         this.menuState.selectedIndex = hits[0]
            //         this.menuState.isKeyboardActivated = false
            //         evt.preventDefault()
            //         evt.stopPropagation()
            //     }
            // }

            if (evt.which == 18 && !evt.repeat && evt.code == "AltLeft") { // Alt 
                if (this.isAccelerated) {
                    this.closeMenu()
                    return
                }
                if (!this.isKeyboardActivated) {
                    if (this.selectedIndex == -1)
                        this.isKeyboardActivated = true
                    this.isAccelerated = true
                    //this.menuState.lastActive = document.activeElement
                }
            }
            else if (evt.which == 27) // ESC
                this.closeMenu()
            else if (evt.which == 37) { // <-
                this.selectedIndex--
                if (this.selectedIndex == -1)
                    this.selectedIndex = this.itemCount - 1
            }
            else if (evt.which == 39) { // ->
                this.selectedIndex++
                if (this.selectedIndex == this.itemCount)
                    this.selectedIndex = 0
            }
        }, true)
        document.addEventListener("keyup", evt => {
            if (evt.which == 18) { // Alt 
                if (this.isKeyboardActivated && this.selectedIndex == -1) 
                    this.selectedIndex = 0
            }
        }, true)
    }

    closeMenu() {
        this.stopKeyboardActivated()
        this.selectedIndex = -1
        // if (this.menuState.lastActive)
        //     this.menuState.lastActive.focus()
        if (!this.menubar.classList.contains("invisible")) {
            if (this.autoMode)
                this.menubar.classList.add("invisible")
//            setTimeout(() => this.$emit('resize'))
        }        
    }

    stopKeyboardActivated() {
        this.isKeyboardActivated = false
        this.isAccelerated = false
    }
}

class SubmenuComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                :host {
                    --menubar-hover-color: lightblue;
                    --menubar-selected-color: white;
                    --menubar-selected-background-color: blue;
                    --menubar-color: black;
                    --menubar-background-color: white;
                    --menubar-border-color: lightgray;
                    --menubar-shadow-color: rgba(0, 0, 0, 0.2);
                }            
                #menubarItem {
                    float: left;
                }
                #header:hover {
                    background-color: var(--menubar-hover-color);
                }
                .selected #header {
                    color: var(--menubar-selected-color);
                    background-color: var(--menubar-selected-background-color);
                }
                .submenuHeader {
                    padding-left: 5px;
                    padding-top: 2px;
                    padding-right: 5px;
                    padding-bottom: 2px;
                }
                #submenu {
                    display: none;
                    position: absolute;
                    color: var(--menubar-color);
                    background-color: var(--menubar-background-color);
                    z-index: 10000;

                    border-color: var(--menubar-border-color);
                    border-style: solid;
                    border-width: 1px;
                    white-space: nowrap;
                    box-shadow: 2px 2px 20px 2px var(--menubar-shadow-color);
                }
                .selected #submenu {
                    display: block;
                }
            </style>
            <li id="menubarItem">
                <div id="header" class="submenuHeader">
                    <menubar-menuitem-component mainmenu="true" id="item"></menubar-menuitem-component>
                </div>
                <div id="submenu">
                    <slot>
                </div>
            </li>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.menubaritem = this.shadowRoot.getElementById("menubarItem")
        this.item = this.shadowRoot.getElementById("item")
        this.header = this.shadowRoot.getElementById("header")
        this.item.setAttribute("text", this.getAttribute("header"))
        this.index = Number.parseInt(this.getAttribute("index"))
        const items = Array.from(document.querySelectorAll('menubar-menuitem-component'))
        console.log("Schau", items)
        items.forEach(n => n.classList.add("submenu-item"))
    }

    static get observedAttributes() {
        return ['is-accelerated', 'selected-index']
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        switch (attributeName) {
            case "is-accelerated":
                if (oldValue != newValue)
                    this.handleIsAccelerated(newValue)
                break
            case "selected-index":
                if (oldValue != newValue) {
                    const selectedIndex = Number.parseInt(newValue)
                    if (selectedIndex == this.index)
                        this.menubaritem.classList.add("selected")
                    else
                        this.menubaritem.classList.remove("selected")
                }
                break
        }
    }

    handleIsAccelerated(value) {
        const items = Array.from(this.shadowRoot.querySelectorAll('menubar-menuitem-component'))
        items.forEach(n => n.setAttribute("is-accelerated", value))
    }
}

class MenuItemComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                :host {
                    --menubar-hover-color: lightblue;
                    --menubar-selected-color: white;
                    --menubar-selected-background-color: blue;
                }            
                .menuitemtext {
                    display: flex;
                }
                #menuitem.selected {
                    background-color: var(--menubar-selected-background-color);
                    color: var(--menubar-selected-color);
                }
                .accelerated-active.accelerated {
                    text-decoration: underline;
                }
                .submenu-item {
                    padding: 5px 20px 5px 0px;
                }
            </style>
            <div id="menuItem">
                <div id="text" class="menuitemtext">
                    <div>
                        <span id="pretext"></span><span id="acctext" class="accelerated"></span><span id="posttext"></span>
                    </div>
                </div>
            </div>
        `

    //     <div class="menuitemtext" v-if="!menuState.accelerated && !separator">
    //         <span class="selector" :class="{ 'isSelected': isSelected }">✓</span>
    //         <span>{{name}}</span>
    //         <span class="spacer"> </span>
    //         <span v-if='item.accelerator'>{{item.accelerator.name}}</span>
    //     </div>
    //     <div class="menuitemtext" v-if="menuState.accelerated && !separator">
    //         <span class="selector" :class="{ 'isSelected': isSelected }">✓</span>
    //         <div>
    //             <span>{{pre}}</span><span class="accelerated">{{acc}}</span><span>{{post}}</span>
    //         </div>
    //         <span class="spacer"> </span>
    //         <span v-if='item.accelerator'>{{item.accelerator.name}}</span>
    //     </div>


        this.shadowRoot.appendChild(template.content.cloneNode(true))
        const pretext = this.shadowRoot.getElementById("pretext")
        this.acctext = this.shadowRoot.getElementById("acctext")
        const posttext = this.shadowRoot.getElementById("posttext")
        const textParts = getTextParts(this.getAttribute("text"))
        pretext.innerText = textParts[0]
        this.acctext.innerText = textParts[1]
        posttext.innerText = textParts[2]

        if (this.getAttribute("mainmenu") != "true") {
            const menuItem = this.shadowRoot.getElementById("menuItem")
            menuItem.classList.add("submenu-item")
        }
                    

        function getTextParts(text) {
            const pos = text.indexOf('_')
            if (pos == -1) 
                return ["", "", text]
            else if (pos == 0) 
                return ["", text[1], text.substring(2)]
            else 
                return [ 
                    text.substring(0, pos), 
                    text[pos + 1], 
                    text.substring(pos + 2)
                ]
        }
    }

    static get observedAttributes() {
        return ['is-accelerated']
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        switch (attributeName) {
            case "is-accelerated":
                if (oldValue != newValue)
                    this.handleIsAccelerated(newValue)
                break
        }
    }

    handleIsAccelerated(value) {
        if (value == "true")
            this.acctext.classList.add("accelerated-active")
        else
            this.acctext.classList.remove("accelerated-active")
    }
}

class SeparatorComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                :host {
                    --menubar-separator-color: red;
                }
                #hr {
                    border:solid var(--menubar-separator-color) 0.5px
                }
            </style>
            <hr /> 
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        const pretext = this.shadowRoot.getElementById("pretext")
    }
}

customElements.define('menubar-component', MenubarComponent)
customElements.define('menubar-submenu-component', SubmenuComponent)
customElements.define('menubar-menuitem-component', MenuItemComponent)
customElements.define('menubar-separator-component', SeparatorComponent)
