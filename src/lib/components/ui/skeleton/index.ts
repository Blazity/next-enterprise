import type { ComponentProps } from 'svelte';
import Root from './skeleton.svelte';

type SkeletonProps = ComponentProps<typeof Root>;

export {
	Root,
	//
	Root as Skeleton,
	type SkeletonProps
};
