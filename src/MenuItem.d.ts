export declare class MenuItem extends HTMLElement {
    private index;
    private menuItem;
    private mnemonicText;
    private action;
    private isCheckbox;
    private mainmenu;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    get isChecked(): boolean;
    set isChecked(value: boolean);
    private _isChecked;
    get isHidden(): boolean;
    set isHidden(value: boolean);
    getMnemonic(): string | null;
    executeCommand(): void;
    handleIsAccelerated(value: string): void;
}
