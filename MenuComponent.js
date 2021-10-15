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
        this.autoMode = this.getAttribute("autoMode")
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
            //     if (this.menuState.accelerated) {
            //         this.closeMenu()
            //         return
            //     }
            //     if (!this.menuState.isKeyboardActivated) {
            //         if (this.menuState.selectedIndex == -1)
            //             this.menuState.isKeyboardActivated = true
            //         this.menuState.accelerated = true
            //         this.menuState.lastActive = document.activeElement
            //     } 
            }
            else if (evt.which == 27) // ESC
                this.closeMenu()
        }, true)
        document.addEventListener("keyup", evt => {
            // if (evt.which == 18) { // Alt 
            //     if (this.menuState.isKeyboardActivated && this.menuState.selectedIndex == -1) 
            //         this.menuState.selectedIndex = 0
            // }
        }, true)
    }

    closeMenu() {
        //this.stopKeyboardActivated()
        this.selectedIndex = -1
        // if (this.menuState.lastActive)
        //     this.menuState.lastActive.focus()
        if (!this.menubar.classList.contains("invisible")) {
            if (this.autoMode)
                this.menubar.classList.add("invisible")
//            setTimeout(() => this.$emit('resize'))
        }        
    }
}

class MenubarItemComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                :host {
                    --menubar-hover-color : lightblue;
                }            
                .menubarItem {
                    float: left;
                }
                li:hover {
                    background-color: var(--menubar-hover-color);
                }
            </style>
            <li class="menubarItem">
                <slot></slot>
            </li>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

class SubmenuComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                .submenuHeader {
                    margin-left: 5px;
                    margin-top: 2px;
                    margin-right: 5px;
                    margin-bottom: 2px;
                }
            </style>
            <div id="header" class="submenuHeader">
                <menuitem-component id="item"></menuitem-component>
            </div>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.item = this.shadowRoot.getElementById("item")
        this.item.setAttribute("text", this.getAttribute("header"))
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
                .menuitem.selected {
                    background-color: var(--menubar-selected-background-color);
                    color: var(--menubar-selected-color);
                }                
            </style>
            <div class="menuItem">
                <div id="text" class="menuitemtext">
                    <span>Der Eintrag</span>
                </div>
            </div>
        `

    //     <div class="menuItem">
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
    //     <hr v-if="separator" />                
    // </div>


        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.text = this.shadowRoot.getElementById("text")
        this.text.innerHTML = this.getAttribute("text")

    }
}

customElements.define('menubar-component', MenubarComponent)
customElements.define('menubar-item-component', MenubarItemComponent)
customElements.define('submenu-component', SubmenuComponent)
customElements.define('menuitem-component', MenuItemComponent)