<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { cn } from '../../../utils/shadcn';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AlertDialogPrimitive.DescriptionProps = $props();
</script>

<AlertDialogPrimitive.Description
	bind:ref
	data-slot="alert-dialog-description"
	class={cn('text-muted-foreground text-sm', className)}
	{...restProps}
/>
