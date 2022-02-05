export declare class Menubar extends HTMLElement {
    private itemCount;
    private mnemonics;
    private menubar;
    private autoMode;
    private lastActive;
    private shortcuts;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    setAutoMode(automode: boolean): void;
    get isAccelerated(): boolean;
    set isAccelerated(value: boolean);
    private _isAccelerated;
    get isKeyboardActivated(): boolean;
    set isKeyboardActivated(value: boolean);
    private _isKeyboardActivated;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    private _selectedIndex;
    connectedCallback(): void;
    closeMenu(): void;
    stopKeyboardActivated(): void;
    getShortcuts(): void;
    checkShortcut(evt: KeyboardEvent): void;
}
