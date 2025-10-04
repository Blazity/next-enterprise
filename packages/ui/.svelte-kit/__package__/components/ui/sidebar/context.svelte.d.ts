type Getter<T> = () => T;
export type SidebarStateProps = {
    open: Getter<boolean>;
    setOpen: (open: boolean) => void;
};
declare class SidebarState {
    #private;
    readonly props: SidebarStateProps;
    open: boolean;
    openMobile: boolean;
    setOpen: SidebarStateProps['setOpen'];
    state: string;
    constructor(props: SidebarStateProps);
    get isMobile(): boolean;
    handleShortcutKeydown: (e: KeyboardEvent) => void;
    setOpenMobile: (value: boolean) => void;
    toggle: () => boolean | void;
}
export declare function setSidebar(props: SidebarStateProps): SidebarState;
export declare function useSidebar(): SidebarState;
export {};
