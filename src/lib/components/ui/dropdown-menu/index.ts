import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import CheckboxItem from './dropdown-menu-checkbox-item.svelte';
import Content from './dropdown-menu-content.svelte';
import Group from './dropdown-menu-group.svelte';
import Item from './dropdown-menu-item.svelte';
import Label from './dropdown-menu-label.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Shortcut from './dropdown-menu-shortcut.svelte';
import Trigger from './dropdown-menu-trigger.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';
import GroupHeading from './dropdown-menu-group-heading.svelte';
import type { ComponentProps } from 'svelte';

const Sub = DropdownMenuPrimitive.Sub;
const Root = DropdownMenuPrimitive.Root;

type DropdownMenuSubProps = ComponentProps<typeof Sub>;
type DropdownMenuProps = ComponentProps<typeof Root>;
type DropdownMenuTriggerProps = ComponentProps<typeof Trigger>;
type DropdownMenuGroupProps = ComponentProps<typeof Group>;
type DropdownMenuRadioGroupProps = ComponentProps<typeof RadioGroup>;
type DropdownMenuCheckboxItemProps = ComponentProps<typeof CheckboxItem>;
type DropdownMenuContentProps = ComponentProps<typeof Content>;
type DropdownMenuGroupHeadingProps = ComponentProps<typeof GroupHeading>;
type DropdownMenuItemProps = ComponentProps<typeof Item>;
type DropdownMenuLabelProps = ComponentProps<typeof Label>;
type DropdownMenuRadioItemProps = ComponentProps<typeof RadioItem>;
type DropdownMenuSeparatorProps = ComponentProps<typeof Separator>;
type DropdownMenuShortcutProps = ComponentProps<typeof Shortcut>;
type DropdownMenuSubContentProps = ComponentProps<typeof SubContent>;
type DropdownMenuSubTriggerProps = ComponentProps<typeof SubTrigger>;

export {
	CheckboxItem,
	Content,
	Root as DropdownMenu,
	type DropdownMenuProps,
	CheckboxItem as DropdownMenuCheckboxItem,
	type DropdownMenuCheckboxItemProps,
	Content as DropdownMenuContent,
	type DropdownMenuContentProps,
	Group as DropdownMenuGroup,
	type DropdownMenuGroupProps,
	GroupHeading as DropdownMenuGroupHeading,
	type DropdownMenuGroupHeadingProps,
	Item as DropdownMenuItem,
	type DropdownMenuItemProps,
	Label as DropdownMenuLabel,
	type DropdownMenuLabelProps,
	RadioGroup as DropdownMenuRadioGroup,
	type DropdownMenuRadioGroupProps,
	RadioItem as DropdownMenuRadioItem,
	type DropdownMenuRadioItemProps,
	Separator as DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
	Shortcut as DropdownMenuShortcut,
	type DropdownMenuShortcutProps,
	Sub as DropdownMenuSub,
	type DropdownMenuSubProps,
	SubContent as DropdownMenuSubContent,
	type DropdownMenuSubContentProps,
	SubTrigger as DropdownMenuSubTrigger,
	type DropdownMenuSubTriggerProps,
	Trigger as DropdownMenuTrigger,
	type DropdownMenuTriggerProps,
	Group,
	GroupHeading,
	Item,
	Label,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	SubTrigger,
	Trigger
};
