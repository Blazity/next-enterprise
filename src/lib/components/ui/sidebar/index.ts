import type { ComponentProps } from 'svelte';
import { useSidebar } from './context.svelte.js';
import Content from './sidebar-content.svelte';
import Footer from './sidebar-footer.svelte';
import GroupAction from './sidebar-group-action.svelte';
import GroupContent from './sidebar-group-content.svelte';
import GroupLabel from './sidebar-group-label.svelte';
import Group from './sidebar-group.svelte';
import Header from './sidebar-header.svelte';
import Input from './sidebar-input.svelte';
import Inset from './sidebar-inset.svelte';
import MenuAction from './sidebar-menu-action.svelte';
import MenuBadge from './sidebar-menu-badge.svelte';
import MenuButton from './sidebar-menu-button.svelte';
import MenuItem from './sidebar-menu-item.svelte';
import MenuSkeleton from './sidebar-menu-skeleton.svelte';
import MenuSubButton from './sidebar-menu-sub-button.svelte';
import MenuSubItem from './sidebar-menu-sub-item.svelte';
import MenuSub from './sidebar-menu-sub.svelte';
import Menu from './sidebar-menu.svelte';
import Provider from './sidebar-provider.svelte';
import Rail from './sidebar-rail.svelte';
import Separator from './sidebar-separator.svelte';
import Trigger from './sidebar-trigger.svelte';
import Root from './sidebar.svelte';

type SidebarProps = ComponentProps<typeof Root>;
type SidebarContentProps = ComponentProps<typeof Content>;
type SidebarFooterProps = ComponentProps<typeof Footer>;
type SidebarGroupProps = ComponentProps<typeof Group>;
type SidebarGroupActionProps = ComponentProps<typeof GroupAction>;
type SidebarGroupContentProps = ComponentProps<typeof GroupContent>;
type SidebarGroupLabelProps = ComponentProps<typeof GroupLabel>;
type SidebarHeaderProps = ComponentProps<typeof Header>;
type SidebarInputProps = ComponentProps<typeof Input>;
type SidebarInsetProps = ComponentProps<typeof Inset>;
type SidebarMenuProps = ComponentProps<typeof Menu>;
type SidebarMenuActionProps = ComponentProps<typeof MenuAction>;
type SidebarMenuBadgeProps = ComponentProps<typeof MenuBadge>;
type SidebarMenuButtonProps = ComponentProps<typeof MenuButton>;
type SidebarMenuItemProps = ComponentProps<typeof MenuItem>;
type SidebarMenuSkeletonProps = ComponentProps<typeof MenuSkeleton>;
type SidebarMenuSubProps = ComponentProps<typeof MenuSub>;
type SidebarMenuSubButtonProps = ComponentProps<typeof MenuSubButton>;
type SidebarMenuSubItemProps = ComponentProps<typeof MenuSubItem>;
type SidebarProviderProps = ComponentProps<typeof Provider>;
type SidebarRailProps = ComponentProps<typeof Rail>;
type SidebarSeparatorProps = ComponentProps<typeof Separator>;
type SidebarTriggerProps = ComponentProps<typeof Trigger>;

export {
	Content,
	Footer,
	Group,
	GroupAction,
	GroupContent,
	GroupLabel,
	Header,
	Input,
	Inset,
	Menu,
	MenuAction,
	MenuBadge,
	MenuButton,
	MenuItem,
	MenuSkeleton,
	MenuSub,
	MenuSubButton,
	MenuSubItem,
	Provider,
	Rail,
	Root,
	Separator,
	//
	Root as Sidebar,
	type SidebarProps,
	Content as SidebarContent,
	type SidebarContentProps,
	Footer as SidebarFooter,
	type SidebarFooterProps,
	Group as SidebarGroup,
	type SidebarGroupProps,
	GroupAction as SidebarGroupAction,
	type SidebarGroupActionProps,
	GroupContent as SidebarGroupContent,
	type SidebarGroupContentProps,
	GroupLabel as SidebarGroupLabel,
	type SidebarGroupLabelProps,
	Header as SidebarHeader,
	type SidebarHeaderProps,
	Input as SidebarInput,
	type SidebarInputProps,
	Inset as SidebarInset,
	type SidebarInsetProps,
	Menu as SidebarMenu,
	type SidebarMenuProps,
	MenuAction as SidebarMenuAction,
	type SidebarMenuActionProps,
	MenuBadge as SidebarMenuBadge,
	type SidebarMenuBadgeProps,
	MenuButton as SidebarMenuButton,
	type SidebarMenuButtonProps,
	MenuItem as SidebarMenuItem,
	type SidebarMenuItemProps,
	MenuSkeleton as SidebarMenuSkeleton,
	type SidebarMenuSkeletonProps,
	MenuSub as SidebarMenuSub,
	type SidebarMenuSubProps,
	MenuSubButton as SidebarMenuSubButton,
	type SidebarMenuSubButtonProps,
	MenuSubItem as SidebarMenuSubItem,
	type SidebarMenuSubItemProps,
	Provider as SidebarProvider,
	type SidebarProviderProps,
	Rail as SidebarRail,
	type SidebarRailProps,
	Separator as SidebarSeparator,
	type SidebarSeparatorProps,
	Trigger as SidebarTrigger,
	type SidebarTriggerProps,
	Trigger,
	useSidebar
};
