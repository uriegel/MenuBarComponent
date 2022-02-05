export declare class Submenu extends HTMLElement {
    private menubaritem;
    private item;
    private index;
    private submenulist;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    onKeyDown(evt: KeyboardEvent): void;
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    handleIsAccelerated(value: string): void;
}
