import { IsMobile } from '../../../hooks/is-mobile.svelte';
import { getContext, setContext } from 'svelte';
import { SIDEBAR_KEYBOARD_SHORTCUT } from './constants.js';
class SidebarState {
    props;
    open = $derived.by(() => this.props.open());
    openMobile = $state(false);
    setOpen;
    #isMobile;
    state = $derived.by(() => (this.open ? 'expanded' : 'collapsed'));
    constructor(props) {
        this.setOpen = props.setOpen;
        this.#isMobile = new IsMobile();
        this.props = props;
    }
    get isMobile() {
        return this.#isMobile.current;
    }
    handleShortcutKeydown = (e) => {
        if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            this.toggle();
        }
    };
    setOpenMobile = (value) => {
        this.openMobile = value;
    };
    toggle = () => {
        return this.#isMobile.current ? (this.openMobile = !this.openMobile) : this.setOpen(!this.open);
    };
}
const SYMBOL_KEY = 'scn-sidebar';
export function setSidebar(props) {
    return setContext(Symbol.for(SYMBOL_KEY), new SidebarState(props));
}
export function useSidebar() {
    return getContext(Symbol.for(SYMBOL_KEY));
}
