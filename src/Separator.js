export class Separator extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const template = document.createElement('template')
        template.innerHTML = ` 
            <style>
                hr {
                    border:solid var(--menubar-separator-color) 0.5px;
                    border-top-style: hidden;
                }
            </style>
            <hr /> 
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

customElements.define('menubar-separator', Separator)
