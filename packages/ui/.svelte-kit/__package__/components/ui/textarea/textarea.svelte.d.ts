import { type WithElementRef } from '../../../utils/shadcn';
import type { HTMLTextareaAttributes } from 'svelte/elements';
declare const Textarea: import("svelte").Component<Omit<WithElementRef<HTMLTextareaAttributes>, "children">, {}, "ref" | "value">;
type Textarea = ReturnType<typeof Textarea>;
export default Textarea;
