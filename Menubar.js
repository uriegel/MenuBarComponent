class Menubar extends HTMLElement {
    constructor() {
        super()
        this.isAccelerated = false
        this.isKeyboardActivated = false
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
        this.style.outline = "none"
        this.setAttribute("tabindex", "-1")

        const items = Array.from(document.querySelectorAll('menubar-submenu'))
        this.itemCount = items.length
        items.forEach((n, i) => n.setAttribute("index", i))

        this.menubar = this.shadowRoot.querySelector('ul')
        this.autoMode = this.getAttribute("automode") == "true"
        if (this.autoMode)
            this.menubar.classList.add("invisible")
    }

    get isAccelerated()  {
        return this._isAccelerated
    }
    set isAccelerated(value) {
        this._isAccelerated = value
        const items = Array.from(document.querySelectorAll('menubar-menuitem'))
        items.forEach(n => n.setAttribute("is-accelerated", value))
        const mainitems = Array.from(document.querySelectorAll('menubar-submenu'))
        mainitems.forEach(n => n.setAttribute("is-accelerated", value))
    }

    get isKeyboardActivated()  {
        return this._isKeyboardActivated
    }
    set isKeyboardActivated(value) {
        this._isKeyboardActivated = value
        const items = Array.from(document.querySelectorAll('menubar-submenu'))
        items.forEach(n => n.setAttribute("is-keyboard-activated", value))
    }
    
    get selectedIndex()  {
        return this._selectedIndex
    }
    set selectedIndex(value) {
        this._selectedIndex = value
        const items = Array.from(document.querySelectorAll('menubar-submenu'))
        items.forEach(n => n.setAttribute("selected-index", value))
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
                    this.focus()
                }
                evt.preventDefault()
                evt.stopPropagation()                
            }
            else if (evt.which == 27) // ESC
                this.closeMenu()
        }, true)
        document.addEventListener("keyup", evt => {
            if (evt.which == 18) { // Alt 
                if (this.isKeyboardActivated && this.selectedIndex == -1) 
                    this.selectedIndex = 0
                evt.preventDefault()
                evt.stopPropagation()
            }
        }, true)

        this.addEventListener("menubar-clicked", evt => {
            this.selectedIndex = evt.detail.index
        })
        this.addEventListener("menubar-executed", () => this.closeMenu())
        this.addEventListener("focusout", () => this.closeMenu())

        this.addEventListener("keydown", evt => {
            switch (evt.which) {
                case 37: // <-
                    this.selectedIndex--
                    if (this.selectedIndex == -1)
                        this.selectedIndex = this.itemCount - 1
                    break
                case 39: // ->
                    this.selectedIndex++
                    if (this.selectedIndex == this.itemCount)
                        this.selectedIndex = 0
                    break
                case 13: // Enter
                case 32: // Space                
                case 40: //  |d
                    if (this.isKeyboardActivated) {
                        this.isKeyboardActivated = false
                        break
                    }
                default: {
                    const items = Array.from(document.querySelectorAll('menubar-submenu'))
                    items.forEach(n => n.onKeyDown(evt))
                }
                break
            }
        })
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

class Submenu extends HTMLElement {
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
                #submenu {
                    display: none;
                    position: absolute;
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
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.menubaritem = this.shadowRoot.getElementById("menubarItem")
        this.item = this.shadowRoot.getElementById("item")
        this.index = Number.parseInt(this.getAttribute("index"))
        this.item.setAttribute("text", this.getAttribute("header"))
        this.item.setAttribute("index", this.index)
        const slot = this.shadowRoot.getElementById("slot")
        slot.id = `submenu-${this.index}`
        this.submenulist = this.shadowRoot.getElementById('submenu')
        this.submenulist.setAttribute("index", this.index)
    }

    static get observedAttributes() {
        return ['is-accelerated', 'is-keyboard-activated', 'selected-index']
    }

    onKeyDown(evt) {
        const items = Array.from(this.shadowRoot.querySelectorAll('menubar-submenu-list'))
            .filter(n => window.getComputedStyle(n).display != "none")
        if (items.length == 1)
            items[0].onKeyDown(evt) 
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

    handleIsAccelerated(value) {
        const items = Array.from(this.shadowRoot.querySelectorAll('menubar-menuitem'))
        items.forEach(n => n.setAttribute("is-accelerated", value))
    }
}

class SubmenuList extends HTMLElement {
    constructor() {
        super()
        this.selectedIndex = -1
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                :host {
                    --menubar-color: black;
                    --menubar-background-color: white;
                    --menubar-border-color: lightgray;
                    --menubar-shadow-color: rgba(0, 0, 0, 0.2);
                }
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
        return ['index']
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
                break
        }
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
                break
            case 38: //  |^
                this.selectedIndex--
                if (this.selectedIndex < 0)
                    this.selectedIndex = this.menuItems.length - 1
                break
            case 40: //  |d
                this.selectedIndex++
                if (this.selectedIndex == this.menuItems.length)
                    this.selectedIndex = 0
                break
        }
    }
}

class MenuItem extends HTMLElement {
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
                .selector {
                    display: none;
                }                
                .submenu-item .selector {
                    display: inline-block;
                    opacity: 0;
                    padding: 0px 7px;
                }                
                .submenu-item.checkbox.is-checked .selector {
                    opacity: 1;
                }                
                .accelerated-active.accelerated {
                    text-decoration: underline;
                }
                #menuItem {
                    padding: 2px 5px;
                }
                #menuItem.submenu-item {
                    padding: 5px 20px 5px 0px;
                }
                #menuItem.submenu-item:hover {
                    background-color: var(--menubar-selected-background-color);
                    color: var(--menubar-selected-color);
                }
            </style>
            <div id="menuItem">
                <div id="text" class="menuitemtext">
                    <span class="selector">✓</span>
                    <div>
                        <span id="pretext"></span><span id="acctext" class="accelerated"></span><span id="posttext"></span>
                    </div>
                </div>
            </div>
        `

    //     <div class="menuitemtext" v-if="menuState.accelerated && !separator">
    //         <span class="selector" :class="{ 'isSelected': isSelected }">✓</span>
    //         <div>
    //             <span>{{pre}}</span><span class="accelerated">{{acc}}</span><span>{{post}}</span>
    //         </div>
    //         <span class="spacer"> </span>
    //         <span v-if='item.accelerator'>{{item.accelerator.name}}</span>
    //     </div>


        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.index = Number.parseInt(this.getAttribute("index"))
        this.menuItem = this.shadowRoot.getElementById("menuItem")
        const pretext = this.shadowRoot.getElementById("pretext")
        this.acctext = this.shadowRoot.getElementById("acctext")
        const posttext = this.shadowRoot.getElementById("posttext")
        const textParts = getTextParts(this.getAttribute("text"))
        this.action = this.getAttribute("action")
        const setChecked = this.getAttribute("setChecked")
        if (setChecked)
            setTimeout(() => eval(`${setChecked}(this)`))
        pretext.innerText = textParts[0]
        this.acctext.innerText = textParts[1]
        posttext.innerText = textParts[2]
        this.isCheckbox = this.getAttribute("checkbox") != null
        const menuItem = this.shadowRoot.getElementById("menuItem")
        if (this.isCheckbox)
            menuItem.classList.add("checkbox")
        this.mainmenu = this.getAttribute("mainmenu") == "true"        
        if (!this.mainmenu) 
            menuItem.classList.add("submenu-item")
                         
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
                        this.menuItem.classList.add("selected")
                    else
                        this.menuItem.classList.remove("selected")
                }
                break
        }
    }

    connectedCallback() {
        this.addEventListener("click", () => this.executeCommand())
    }

    get isChecked()  {
        return this._isChecked
    }
    set isChecked(value) {
        this._isChecked = value
        if (this.isChecked)
            this.menuItem.classList.add("is-checked")
        else
            this.menuItem.classList.remove("is-checked")
    }

    executeCommand() {
        if (this.mainmenu) {
            this.dispatchEvent(new CustomEvent('menubar-clicked', {
                bubbles: true,
                composed: true,
                detail: { index: this.index }
            }))
        } else {
            this.dispatchEvent(new CustomEvent('menubar-executed', {
                bubbles: true,
                composed: true
            }))

            if (!this.isCheckbox) {
                if (this.action)
                    eval(`${this.action}()`)
            } else {
                this.isChecked = !this.isChecked
                if (this.action)
                    eval(`${this.action}(${this.isChecked})`)
            }
        }
    }

    handleIsAccelerated(value) {
        if (value == "true")
            this.acctext.classList.add("accelerated-active")
        else
            this.acctext.classList.remove("accelerated-active")
    }
}

class Separator extends HTMLElement {
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
    }
}

customElements.define('menubar-mainmenu', Menubar)
customElements.define('menubar-submenu', Submenu)
customElements.define('menubar-submenu-list', SubmenuList)
customElements.define('menubar-menuitem', MenuItem)
customElements.define('menubar-separator', Separator)

// TODO Mouse control: not hovering but set selected item when mouse over
// TODO Accelerators
// TODO Shortcuts
// TODO Electron titlebar
// TODO Submenu 