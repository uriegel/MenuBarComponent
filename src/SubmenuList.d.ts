export type Mnemonic = {
    key: string | null;
    index: number;
};
export declare class SubmenuList extends HTMLElement {
    private index;
    private menuItems;
    private mnemonics;
    private isAccelerated;
    private keyIndex;
    private lastKey;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    private _selectedIndex;
    resetIndex(): void;
    onKeyDown(evt: KeyboardEvent): void;
}
