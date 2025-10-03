# SvelteKit Storybook Testable Code Standards

<!-- Verified via: mcp_context7_get-library-docs (Storybook), mcp_mcp-svelte-docs_svelte_definition on 2025-10-03 -->

## Document Purpose

This document defines testability standards specifically for SvelteKit components tested within Storybook, covering CSF3 story format, interaction testing with play functions, mocking SvelteKit dependencies, and automated testing with test-runner, all patterns derived exclusively from official Storybook documentation verified through systematic tool discovery.

---

## Table of Contents

1. [Storybook Setup for SvelteKit](#storybook-setup-for-sveltekit)
2. [Writing Testable SvelteKit Components](#writing-testable-sveltekit-components)
3. [Story Organization & CSF3 Format](#story-organization--csf3-format)
4. [Mocking SvelteKit Features](#mocking-sveltekit-features)
5. [Interaction Testing with Play Functions](#interaction-testing-with-play-functions)
6. [Test-Runner Automation](#test-runner-automation)
7. [Testing Checklist Implementation](#testing-checklist-implementation)
8. [Anti-Patterns & Refactoring](#anti-patterns--refactoring)

---

## Storybook Setup for SvelteKit

<!-- Verified via: mcp_context7_get-library-docs (Storybook) on 2025-10-03 -->

### Installation

```bash
npm install --save-dev @storybook/sveltekit @storybook/addon-essentials @storybook/addon-interactions @storybook/test @storybook/addon-svelte-csf
```

### Configuration

**`.storybook/main.ts`**:

```typescript
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-svelte-csf'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  docs: {
    autodocs: true
  },
  features: {
    buildStoriesJson: true
  }
};

export default config;
```

**`.storybook/preview.ts`** - Global Decorators and Mocks:

```typescript
import type { Preview } from '@storybook/sveltekit';
import { spyOn } from 'storybook/test';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  async beforeEach() {
    spyOn(console, 'log').mockName('console.log');
  }
};

export default preview;
```

---

## Writing Testable SvelteKit Components

<!-- Verified via: mcp_mcp-svelte-docs_svelte_definition on 2025-10-03 -->

### Component Organization for Story-Driven Development

**Testable Component Structure**:

```svelte
<!-- src/lib/components/ChatMessage/ChatMessage.svelte -->
<script lang="ts">
  import type { Message, User } from '$types';
  
  interface Props {
    message: Message;
    currentUser?: User | null;
    onEdit?: (messageId: string, content: string) => void;
    onDelete?: (messageId: string) => void;
    isLoading?: boolean;
  }
  
  let { message, currentUser, onEdit, onDelete, isLoading = false }: Props = $props();
  
  let isEditing = $state(false);
  let editedContent = $state(message.content);
  
  const isOwnMessage = $derived(
    currentUser && message.userId === currentUser.id
  );
  
  const canEdit = $derived(isOwnMessage && !isLoading);
  
  function handleEdit() {
    if (!canEdit) return;
    isEditing = true;
  }
  
  function handleSave() {
    onEdit?.(message.id, editedContent);
    isEditing = false;
  }
  
  function handleCancel() {
    editedContent = message.content;
    isEditing = false;
  }
</script>

<div class="message" data-testid="chat-message" class:own-message={isOwnMessage}>
  {#if isEditing}
    <textarea bind:value={editedContent} data-testid="edit-textarea" disabled={isLoading} />
    <div class="actions">
      <button onclick={handleSave} disabled={isLoading} data-testid="save-button">Save</button>
      <button onclick={handleCancel} disabled={isLoading} data-testid="cancel-button">Cancel</button>
    </div>
  {:else}
    <p data-testid="message-content">{message.content}</p>
    {#if canEdit}
      <div class="actions">
        <button onclick={handleEdit} data-testid="edit-button">Edit</button>
        <button onclick={() => onDelete?.(message.id)} data-testid="delete-button">Delete</button>
      </div>
    {/if}
  {/if}
</div>
```

### Props Design for Storybook Controls

**Pattern - Explicit Props with Defaults**:

```svelte
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    label: string;
    onclick?: () => void;
  }
  
  let {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    label,
    onclick
  }: Props = $props();
</script>

<button
  class={`btn btn-${variant} btn-${size}`}
  {disabled}
  data-loading={loading}
  {onclick}
  data-testid="action-button"
>
  {loading ? 'Loading...' : label}
</button>
```

### Dependency Injection for Testability

**Pattern - Context-Based Injection**:

```svelte
<!-- App.svelte -->
<script>
  import { setContext } from 'svelte';
  import { createClient } from '@supabase/supabase-js';
  
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  
  setContext('supabase', supabase);
</script>

<!-- Child Component -->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { SupabaseClient } from '@supabase/supabase-js';
  
  const supabase = getContext<SupabaseClient>('supabase');
  
  async function loadData() {
    const { data } = await supabase.from('messages').select('*');
    return data;
  }
</script>
```

---

## Story Organization & CSF3 Format

<!-- Verified via: mcp_context7_get-library-docs (Storybook) on 2025-10-03 -->

### File Structure

```
src/lib/components/
  ChatMessage/
    ChatMessage.svelte
    ChatMessage.stories.ts
    ChatMessage.spec.ts
  LoginForm/
    LoginForm.svelte
    LoginForm.stories.ts
  FileUpload/
    FileUpload.svelte
    FileUpload.stories.ts
```

### CSF3 Format with TypeScript

**Standard CSF Format (.stories.ts)**:

```typescript
import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import ChatMessage from './ChatMessage.svelte';

const meta = {
  title: 'Chat/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Message component for chat interface with edit/delete capabilities'
      }
    }
  },
  argTypes: {
    message: {
      description: 'Message object containing id, content, userId, timestamp',
      control: 'object'
    },
    currentUser: {
      description: 'Currently logged-in user for permission checking',
      control: 'object'
    },
    isLoading: {
      description: 'Loading state for async operations',
      control: 'boolean'
    },
    onEdit: {
      description: 'Callback when message is edited',
      action: 'edited'
    },
    onDelete: {
      description: 'Callback when message is deleted',
      action: 'deleted'
    }
  }
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OwnMessage: Story = {
  args: {
    message: {
      id: 'msg-1',
      content: 'Hello, this is my message!',
      userId: 'user-123',
      timestamp: new Date('2025-10-03T10:00:00Z')
    },
    currentUser: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com'
    },
    onEdit: fn(),
    onDelete: fn()
  }
};

export const OtherUserMessage: Story = {
  args: {
    message: {
      id: 'msg-2',
      content: 'Message from another user',
      userId: 'user-456',
      timestamp: new Date('2025-10-03T10:01:00Z')
    },
    currentUser: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
};

export const LoadingState: Story = {
  args: {
    ...OwnMessage.args,
    isLoading: true
  }
};
```

### Svelte CSF Format (.stories.svelte)

<!-- Verified via: mcp_context7_get-library-docs (Storybook addon-svelte-csf) on 2025-10-03 -->

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn, within, userEvent } from '@storybook/test';
  import LoginForm from './LoginForm.svelte';

  const { Story } = defineMeta({
    title: 'Auth/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered'
    },
    argTypes: {
      onSubmit: {
        description: 'Callback when form is submitted',
        action: 'submitted'
      },
      onRegister: {
        description: 'Callback when register is clicked',
        action: 'register-clicked'
      }
    }
  });
</script>

<Story
  name="Default"
  args={{
    onSubmit: fn(),
    onRegister: fn()
  }}
/>

<Story
  name="WithValidation"
  args={{
    onSubmit: fn(),
    onRegister: fn()
  }}
  play={async ({ canvas, userEvent }) => {
    const screen = within(canvas);
    
    await userEvent.click(screen.getByTestId('submit-button'));
    
    await expect(screen.getByText(/Email is required/i)).toBeVisible();
    await expect(screen.getByText(/Password is required/i)).toBeVisible();
  }}
/>

<Story
  name="SuccessfulLogin"
  args={{
    onSubmit: fn()
  }}
  play={async ({ args, canvas, userEvent }) => {
    const screen = within(canvas);
    
    await userEvent.type(screen.getByTestId('email-input'), 'user@example.com');
    await userEvent.type(screen.getByTestId('password-input'), 'Password123');
    await userEvent.click(screen.getByTestId('submit-button'));
    
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password123'
    });
  }}
/>
```

### Args and ArgTypes Configuration

**Pattern - Complete ArgTypes for Controls**:

```typescript
const meta = {
  component: ModelSwitcher,
  argTypes: {
    currentModel: {
      description: 'Currently selected AI model',
      control: { type: 'select' },
      options: ['claude-sonnet-4', 'gpt-4', 'gemini-pro'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'claude-sonnet-4' }
      }
    },
    models: {
      description: 'Available AI models',
      control: 'object',
      table: {
        type: { summary: 'Array<Model>' }
      }
    },
    onModelChange: {
      description: 'Callback when model is changed',
      action: 'model-changed',
      table: {
        type: { summary: '(modelId: string) => void' }
      }
    },
    disabled: {
      description: 'Disable model switching',
      control: 'boolean',
      table: {
        defaultValue: { summary: false }
      }
    }
  }
} satisfies Meta<typeof ModelSwitcher>;
```

---

## Mocking SvelteKit Features

<!-- Verified via: mcp_context7_get-library-docs (Storybook SvelteKit) on 2025-10-03 -->

### Mocking $app/stores

**Pattern - Mock Page Store Data**:

```typescript
import type { Meta, StoryObj } from '@storybook/sveltekit';
import ChatHistory from './ChatHistory.svelte';

const meta = {
  component: ChatHistory,
  parameters: {
    sveltekit_experimental: {
      stores: {
        page: {
          data: {
            sessions: [
              { id: 'session-1', title: 'Chat about AI', createdAt: '2025-10-01' },
              { id: 'session-2', title: 'Code review help', createdAt: '2025-10-02' }
            ],
            user: {
              id: 'user-123',
              name: 'Test User',
              email: 'test@example.com'
            }
          },
          url: new URL('http://localhost:6006/chat'),
          params: { id: 'session-1' },
          route: { id: '/chat/[id]' },
          status: 200,
          error: null,
          form: null,
          state: {}
        },
        navigating: null,
        updated: false
      }
    }
  }
} satisfies Meta<typeof ChatHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSessions: Story = {};

export const NavigatingState: Story = {
  parameters: {
    sveltekit_experimental: {
      stores: {
        navigating: {
          from: { url: new URL('http://localhost:6006/chat/session-1'), params: { id: 'session-1' }, route: { id: '/chat/[id]' } },
          to: { url: new URL('http://localhost:6006/chat/session-2'), params: { id: 'session-2' }, route: { id: '/chat/[id]' } },
          type: 'link',
          willUnload: false,
          delta: 1,
          complete: Promise.resolve()
        }
      }
    }
  }
};
```

### Mocking $app/navigation

**Pattern - Mock Navigation Functions**:

```typescript
export const NavigationTest: Story = {
  parameters: {
    sveltekit_experimental: {
      navigation: {
        goto: (url: string | URL, opts?: any) => {
          console.log('goto called with:', url, opts);
        },
        invalidate: (dependency: string) => {
          console.log('invalidate called with:', dependency);
        },
        invalidateAll: () => {
          console.log('invalidateAll called');
        },
        pushState: (url: string | URL, state: any) => {
          console.log('pushState called with:', url, state);
        },
        replaceState: (url: string | URL, state: any) => {
          console.log('replaceState called with:', url, state);
        },
        afterNavigate: {
          from: { url: new URL('http://localhost:6006/'), params: {}, route: { id: '/' } },
          to: { url: new URL('http://localhost:6006/chat'), params: {}, route: { id: '/chat' } },
          type: 'goto',
          willUnload: false,
          delta: 1,
          complete: Promise.resolve()
        }
      }
    }
  },
  play: async ({ canvas, userEvent }) => {
    const screen = within(canvas);
    const backButton = screen.getByTestId('back-button');
    await userEvent.click(backButton);
  }
};
```

### Mocking $app/forms (use:enhance)

**Pattern - Mock Form Actions**:

```typescript
import type { Meta, StoryObj } from '@storybook/sveltekit';
import UserRegistrationForm from './UserRegistrationForm.svelte';

const meta = {
  component: UserRegistrationForm,
  parameters: {
    sveltekit_experimental: {
      forms: {
        enhance: () => {
          console.log('Form enhancement called');
        }
      }
    }
  }
} satisfies Meta<typeof UserRegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegistrationFlow: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const screen = within(canvas);
    
    await step('Fill registration form', async () => {
      await userEvent.type(screen.getByTestId('email-input'), 'newuser@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'SecurePass123');
      await userEvent.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
    });
    
    await step('Submit form', async () => {
      await userEvent.click(screen.getByTestId('register-button'));
    });
  }
};
```

### Mocking $app/environment

**Pattern - Use sb.mock for Environment Variables**:

```typescript
import { sb } from 'storybook/test';

sb.mock(import('$app/environment'), () => ({
  browser: true,
  building: false,
  dev: true,
  version: '1.0.0'
}));

export const WithEnvironment: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Component behavior when running in browser environment'
      }
    }
  }
};
```

### Mocking Link Navigation

**Pattern - Mock href Clicks**:

```typescript
export const ChatHistoryWithNavigation: Story = {
  parameters: {
    sveltekit_experimental: {
      hrefs: {
        '/chat/.*': {
          callback: (to, event) => {
            console.log('Navigating to chat:', to);
            event.preventDefault();
          },
          asRegex: true
        },
        '/logout': (to, event) => {
          console.log('Logout clicked');
          event.preventDefault();
        }
      }
    }
  },
  play: async ({ canvas, userEvent }) => {
    const screen = within(canvas);
    await userEvent.click(screen.getByText(/View chat/i));
  }
};
```

---

## Interaction Testing with Play Functions

<!-- Verified via: mcp_context7_get-library-docs (Storybook) on 2025-10-03 -->

### Testing Checklist Implementation

#### 1. User Registration

```typescript
// src/lib/components/RegisterForm/RegisterForm.stories.ts
import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import RegisterForm from './RegisterForm.svelte';

const meta = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  parameters: {
    sveltekit_experimental: {
      forms: {
        enhance: () => console.log('Form enhanced')
      }
    }
  }
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessfulRegistration: Story = {
  args: {
    onSubmit: fn(async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, userId: 'user-123' };
    })
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Fill registration form', async () => {
      await userEvent.type(screen.getByTestId('email-input'), 'newuser@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'SecurePass123!');
      await userEvent.type(screen.getByTestId('confirm-password-input'), 'SecurePass123!');
      await userEvent.type(screen.getByTestId('name-input'), 'John Doe');
    });
    
    await step('Submit registration', async () => {
      const submitButton = screen.getByTestId('register-button');
      await userEvent.click(submitButton);
      
      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toHaveTextContent(/Registering/i);
    });
    
    await step('Verify submission', async () => {
      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
          name: 'John Doe'
        });
      });
    });
  }
};

export const ValidationErrors: Story = {
  args: {
    onSubmit: fn()
  },
  play: async ({ canvas, step }) => {
    const screen = within(canvas);
    
    await step('Submit empty form', async () => {
      await userEvent.click(screen.getByTestId('register-button'));
    });
    
    await step('Verify validation errors', async () => {
      await expect(screen.getByText(/Email is required/i)).toBeVisible();
      await expect(screen.getByText(/Password is required/i)).toBeVisible();
      await expect(screen.getByTestId('email-input')).toHaveAttribute('aria-invalid', 'true');
    });
  }
};
```

#### 2. User Login

```typescript
export const SuccessfulLogin: Story = {
  args: {
    onSubmit: fn(async (credentials) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, token: 'mock-jwt-token' };
    })
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Enter credentials', async () => {
      await userEvent.type(screen.getByTestId('email-input'), 'test@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'password123');
    });
    
    await step('Submit login', async () => {
      await userEvent.click(screen.getByTestId('login-button'));
    });
    
    await step('Verify authentication', async () => {
      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  }
};

export const InvalidCredentials: Story = {
  args: {
    onSubmit: fn(async () => {
      throw new Error('Invalid credentials');
    })
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Enter invalid credentials', async () => {
      await userEvent.type(screen.getByTestId('email-input'), 'wrong@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'wrongpass');
      await userEvent.click(screen.getByTestId('login-button'));
    });
    
    await step('Verify error message', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeVisible();
      });
    });
  }
};
```

#### 3. Create New Chat

```typescript
export const CreateChat: Story = {
  args: {
    onCreate: fn(async (title) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: 'chat-new', title, createdAt: new Date().toISOString() };
    })
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Click create chat button', async () => {
      await userEvent.click(screen.getByTestId('create-chat-button'));
    });
    
    await step('Enter chat title', async () => {
      const titleInput = await screen.findByTestId('chat-title-input');
      await userEvent.type(titleInput, 'New AI Discussion');
    });
    
    await step('Submit creation', async () => {
      await userEvent.click(screen.getByTestId('confirm-create-button'));
    });
    
    await step('Verify chat created', async () => {
      await waitFor(() => {
        expect(args.onCreate).toHaveBeenCalledWith('New AI Discussion');
      });
    });
  }
};
```

#### 4. Send Message

```typescript
export const SendMessage: Story = {
  args: {
    onSend: fn(async (content) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { id: 'msg-new', content, timestamp: Date.now() };
    }),
    isConnected: true
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Type message', async () => {
      const messageInput = screen.getByTestId('message-input');
      await userEvent.type(messageInput, 'Hello, AI assistant!');
      await expect(messageInput).toHaveValue('Hello, AI assistant!');
    });
    
    await step('Send message', async () => {
      await userEvent.click(screen.getByTestId('send-button'));
    });
    
    await step('Verify message sent and input cleared', async () => {
      await waitFor(() => {
        expect(args.onSend).toHaveBeenCalledWith('Hello, AI assistant!');
      });
      
      await expect(screen.getByTestId('message-input')).toHaveValue('');
    });
  }
};
```

#### 5. Receive AI Response

```typescript
export const ReceiveAIResponse: Story = {
  args: {
    messages: [
      { id: 'msg-1', role: 'user', content: 'What is TypeScript?', timestamp: Date.now() - 5000 }
    ],
    streamingMessage: {
      id: 'msg-2',
      role: 'assistant',
      content: 'TypeScript is a strongly typed programming language...',
      isStreaming: true
    }
  },
  play: async ({ canvas, step }) => {
    const screen = within(canvas);
    
    await step('Verify streaming indicator', async () => {
      await expect(screen.getByTestId('streaming-indicator')).toBeVisible();
    });
    
    await step('Verify partial content displayed', async () => {
      await expect(screen.getByText(/TypeScript is a strongly typed/i)).toBeVisible();
    });
  }
};

export const AIResponseComplete: Story = {
  args: {
    messages: [
      { id: 'msg-1', role: 'user', content: 'What is TypeScript?', timestamp: Date.now() - 5000 },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
        isStreaming: false,
        timestamp: Date.now()
      }
    ]
  },
  play: async ({ canvas }) => {
    const screen = within(canvas);
    
    await expect(screen.queryByTestId('streaming-indicator')).not.toBeInTheDocument();
    await expect(screen.getByText(/TypeScript is a strongly typed programming language/i)).toBeVisible();
  }
};
```

#### 6. Upload File

```typescript
export const FileUpload: Story = {
  args: {
    onUpload: fn(async (files) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return files.map(f => ({ id: crypto.randomUUID(), name: f.name, size: f.size }));
    }),
    maxSize: 10 * 1024 * 1024,
    acceptedTypes: ['image/*', '.pdf', '.doc', '.docx']
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Upload valid file', async () => {
      const file = new File(['file content'], 'document.pdf', { type: 'application/pdf' });
      const input = screen.getByTestId('file-input');
      
      await userEvent.upload(input, file);
    });
    
    await step('Verify upload progress', async () => {
      await expect(screen.getByTestId('upload-progress')).toBeVisible();
    });
    
    await step('Verify upload completed', async () => {
      await waitFor(() => {
        expect(args.onUpload).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      await expect(screen.getByText(/document.pdf/i)).toBeVisible();
    });
  }
};

export const FileSizeError: Story = {
  args: {
    onUpload: fn(),
    maxSize: 1024,
    acceptedTypes: ['image/*']
  },
  play: async ({ canvas, step }) => {
    const screen = within(canvas);
    
    await step('Upload oversized file', async () => {
      const file = new File(['x'.repeat(2048)], 'large.png', { type: 'image/png' });
      const input = screen.getByTestId('file-input');
      
      await userEvent.upload(input, file);
    });
    
    await step('Verify error message', async () => {
      await expect(screen.getByText(/File size exceeds maximum/i)).toBeVisible();
    });
  }
};
```

#### 7. Switch Models

```typescript
export const ModelSwitch: Story = {
  args: {
    currentModel: 'claude-sonnet-4',
    models: [
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'anthropic' },
      { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google' }
    ],
    onModelChange: fn()
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Open model selector', async () => {
      await userEvent.click(screen.getByTestId('model-selector-button'));
      await expect(screen.getByRole('listbox')).toBeVisible();
    });
    
    await step('Select different model', async () => {
      await userEvent.click(screen.getByText('GPT-4'));
    });
    
    await step('Verify model changed', async () => {
      await waitFor(() => {
        expect(args.onModelChange).toHaveBeenCalledWith('gpt-4');
      });
      
      await expect(screen.getByTestId('model-selector-button')).toHaveTextContent(/GPT-4/i);
    });
  }
};
```

#### 8. View Chat History

```typescript
export const ViewHistory: Story = {
  args: {
    sessions: [
      { id: '1', title: 'AI Basics', messageCount: 15, lastActivity: '2025-10-01' },
      { id: '2', title: 'Code Review', messageCount: 8, lastActivity: '2025-10-02' },
      { id: '3', title: 'Architecture Discussion', messageCount: 23, lastActivity: '2025-10-03' }
    ],
    onSessionClick: fn()
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Verify sessions displayed', async () => {
      await expect(screen.getByText('AI Basics')).toBeVisible();
      await expect(screen.getByText('Code Review')).toBeVisible();
      await expect(screen.getByText('Architecture Discussion')).toBeVisible();
    });
    
    await step('Click on session', async () => {
      await userEvent.click(screen.getByText('Code Review'));
    });
    
    await step('Verify session selected', async () => {
      await expect(args.onSessionClick).toHaveBeenCalledWith('2');
    });
  }
};
```

#### 9. Dark Mode Toggle

```typescript
export const DarkModeToggle: Story = {
  args: {
    theme: 'light',
    onThemeChange: fn()
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Toggle dark mode', async () => {
      const toggle = screen.getByTestId('theme-toggle');
      await userEvent.click(toggle);
    });
    
    await step('Verify theme changed', async () => {
      await expect(args.onThemeChange).toHaveBeenCalledWith('dark');
    });
    
    await step('Toggle back to light', async () => {
      await userEvent.click(screen.getByTestId('theme-toggle'));
      await expect(args.onThemeChange).toHaveBeenCalledWith('light');
    });
  }
};
```

#### 10. Logout

```typescript
export const Logout: Story = {
  args: {
    user: { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
    onLogout: fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    })
  },
  parameters: {
    sveltekit_experimental: {
      navigation: {
        goto: (url) => console.log('Redirecting to:', url)
      }
    }
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Click logout button', async () => {
      await userEvent.click(screen.getByTestId('logout-button'));
    });
    
    await step('Confirm logout', async () => {
      const confirmButton = await screen.findByTestId('confirm-logout-button');
      await userEvent.click(confirmButton);
    });
    
    await step('Verify logout called', async () => {
      await waitFor(() => {
        expect(args.onLogout).toHaveBeenCalled();
      });
    });
  }
};
```

### Multi-Step Interactions with step()

```typescript
export const CompleteUserJourney: Story = {
  args: {
    onLogin: fn(),
    onCreateChat: fn(),
    onSendMessage: fn(),
    onLogout: fn()
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('1. User logs in', async () => {
      await userEvent.type(screen.getByTestId('email-input'), 'user@example.com');
      await userEvent.type(screen.getByTestId('password-input'), 'password');
      await userEvent.click(screen.getByTestId('login-button'));
      
      await waitFor(() => expect(args.onLogin).toHaveBeenCalled());
    });
    
    await step('2. User creates new chat', async () => {
      await userEvent.click(screen.getByTestId('new-chat-button'));
      await userEvent.type(screen.getByTestId('chat-title-input'), 'Test Chat');
      await userEvent.click(screen.getByTestId('create-button'));
      
      await waitFor(() => expect(args.onCreateChat).toHaveBeenCalled());
    });
    
    await step('3. User sends message', async () => {
      await userEvent.type(screen.getByTestId('message-input'), 'Hello AI');
      await userEvent.click(screen.getByTestId('send-button'));
      
      await waitFor(() => expect(args.onSendMessage).toHaveBeenCalled());
    });
    
    await step('4. User logs out', async () => {
      await userEvent.click(screen.getByTestId('user-menu'));
      await userEvent.click(screen.getByTestId('logout-button'));
      
      await waitFor(() => expect(args.onLogout).toHaveBeenCalled());
    });
  }
};
```

### Async Behavior Testing

**Pattern - Using waitFor for Async Assertions**:

```typescript
export const AsyncDataLoading: Story = {
  args: {
    fetchData: fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { messages: [...], total: 42 };
    })
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('Verify loading state', async () => {
      await expect(screen.getByTestId('loading-spinner')).toBeVisible();
    });
    
    await step('Wait for data to load', async () => {
      await waitFor(() => {
        expect(args.fetchData).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
    
    await step('Verify data displayed', async () => {
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        expect(screen.getByText(/42 messages/i)).toBeVisible();
      });
    });
  }
};
```

---

## Test-Runner Automation

<!-- Verified via: mcp_context7_get-library-docs (test-runner) on 2025-10-03 -->

### Configuration

**`.storybook/test-runner.ts`**:

```typescript
import type { TestRunnerConfig, getStoryContext, waitForPageReady } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

const config: TestRunnerConfig = {
  logLevel: 'verbose',
  
  tags: {
    include: ['test'],
    exclude: ['skip-test', 'design-only'],
    skip: []
  },
  
  async setup() {
    console.log('Test runner setup complete');
  },
  
  async preVisit(page, context) {
    await injectAxe(page);
    
    const storyContext = await getStoryContext(page, context);
    
    if (storyContext.parameters?.viewport) {
      const viewport = storyContext.parameters.viewport;
      await page.setViewportSize({
        width: viewport.width || 1280,
        height: viewport.height || 720
      });
    }
  },
  
  async postVisit(page, context) {
    await waitForPageReady(page);
    
    const storyContext = await getStoryContext(page, context);
    
    if (!storyContext.parameters?.a11y?.disable) {
      await configureAxe(page, {
        rules: storyContext.parameters?.a11y?.config?.rules
      });
      
      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: true },
        axeOptions: storyContext.parameters?.a11y?.options
      });
    }
    
    if (storyContext.parameters?.snapshot) {
      const elementHandler = await page.$('#storybook-root');
      const innerHTML = await elementHandler?.innerHTML();
      expect(innerHTML).toMatchSnapshot();
    }
  }
};

export default config;
```

### CI Integration

**`package.json` scripts**:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "test-storybook",
    "test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook --quiet && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook --maxWorkers=2\"",
    "test-storybook:coverage": "test-storybook --coverage",
    "test-storybook:watch": "test-storybook --watch"
  }
}
```

**GitHub Actions Workflow**:

```yaml
name: Storybook Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Storybook tests
        run: npm run test-storybook:ci
      
      - name: Upload coverage
        if: always()
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/storybook/coverage-storybook.json
```

### Test Sharding for Parallel Execution

```json
{
  "test-storybook:shard": "test-storybook --shard=$SHARD_INDEX/$SHARD_COUNT"
}
```

**GitHub Actions with Sharding**:

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - name: Run tests
        run: npm run test-storybook --shard=${{ matrix.shard }}/${{ strategy.job-total }}
```

---

## Testing Checklist Implementation

<!-- Complete examples verified via: mcp_context7_get-library-docs on 2025-10-03 -->

### Complete Chat Application Testing Suite

```typescript
// src/lib/components/ChatApp/ChatApp.stories.ts
import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import ChatApp from './ChatApp.svelte';

const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com'
};

const mockSessions = [
  { id: 'session-1', title: 'AI Discussion', messageCount: 5, createdAt: '2025-10-01' },
  { id: 'session-2', title: 'Code Help', messageCount: 12, createdAt: '2025-10-02' }
];

const meta = {
  title: 'App/ChatApp',
  component: ChatApp,
  parameters: {
    layout: 'fullscreen',
    sveltekit_experimental: {
      stores: {
        page: {
          data: { user: mockUser, sessions: mockSessions },
          url: new URL('http://localhost:6006/chat'),
          params: {},
          route: { id: '/chat' }
        }
      },
      navigation: {
        goto: fn((url) => console.log('Navigate to:', url)),
        invalidate: fn(),
        invalidateAll: fn()
      },
      forms: {
        enhance: () => console.log('Form enhanced')
      }
    }
  },
  tags: ['autodocs', 'test']
} satisfies Meta<typeof ChatApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteWorkflow: Story = {
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateChat: fn(),
    onSendMessage: fn(),
    onModelChange: fn(),
    onFileUpload: fn()
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('✓ User registration', async () => {
      await userEvent.click(screen.getByTestId('register-link'));
      await userEvent.type(screen.getByTestId('register-email'), 'new@example.com');
      await userEvent.type(screen.getByTestId('register-password'), 'Password123!');
      await userEvent.type(screen.getByTestId('register-name'), 'New User');
      await userEvent.click(screen.getByTestId('register-submit'));
      
      await waitFor(() => expect(args.onLogin).toHaveBeenCalled());
    });
    
    await step('✓ User login', async () => {
      const loginButton = await screen.findByTestId('login-button');
      await expect(loginButton).toBeVisible();
    });
    
    await step('✓ Create new chat', async () => {
      await userEvent.click(screen.getByTestId('new-chat-button'));
      await userEvent.type(await screen.findByTestId('chat-title-input'), 'Test Chat');
      await userEvent.click(screen.getByTestId('create-chat-confirm'));
      
      await waitFor(() => expect(args.onCreateChat).toHaveBeenCalled());
    });
    
    await step('✓ Send message', async () => {
      const messageInput = await screen.findByTestId('message-input');
      await userEvent.type(messageInput, 'What is SvelteKit?');
      await userEvent.click(screen.getByTestId('send-button'));
      
      await waitFor(() => expect(args.onSendMessage).toHaveBeenCalled());
      await expect(messageInput).toHaveValue('');
    });
    
    await step('✓ Receive AI response', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('ai-response')).toBeVisible();
      }, { timeout: 3000 });
    });
    
    await step('✓ Upload file', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      await userEvent.upload(screen.getByTestId('file-input'), file);
      
      await waitFor(() => expect(args.onFileUpload).toHaveBeenCalled());
    });
    
    await step('✓ Switch models', async () => {
      await userEvent.click(screen.getByTestId('model-selector'));
      await userEvent.click(screen.getByText('GPT-4'));
      
      await expect(args.onModelChange).toHaveBeenCalledWith('gpt-4');
    });
    
    await step('✓ View chat history', async () => {
      await userEvent.click(screen.getByTestId('history-button'));
      await expect(screen.getByTestId('chat-history-panel')).toBeVisible();
      await expect(screen.getByText('AI Discussion')).toBeVisible();
    });
    
    await step('✓ Dark mode toggle', async () => {
      await userEvent.click(screen.getByTestId('theme-toggle'));
      await expect(screen.getByTestId('app-container')).toHaveClass(/dark/);
    });
    
    await step('✓ Logout', async () => {
      await userEvent.click(screen.getByTestId('user-menu'));
      await userEvent.click(screen.getByTestId('logout-button'));
      
      await waitFor(() => expect(args.onLogout).toHaveBeenCalled());
    });
  }
};
```

---

## Anti-Patterns & Refactoring

<!-- Verified via: tool discoveries on 2025-10-03 -->

### ❌ Anti-Pattern 1: Hard-Coded SvelteKit Dependencies

```svelte
<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  const userData = $page.data.user;
  
  function navigate() {
    goto('/chat');
  }
</script>
```

**Problem**: Cannot test in Storybook isolation - requires full SvelteKit runtime.

### ✅ Refactored: Injected Dependencies

```svelte
<script lang="ts">
  interface Props {
    user: User;
    onNavigate?: (path: string) => void;
  }
  
  let { user, onNavigate }: Props = $props();
  
  function navigate() {
    onNavigate?.('/chat');
  }
</script>
```

**Story**:

```typescript
export const Navigable: Story = {
  args: {
    user: mockUser,
    onNavigate: fn()
  },
  parameters: {
    sveltekit_experimental: {
      navigation: {
        goto: (url) => console.log('Navigate:', url)
      }
    }
  }
};
```

### ❌ Anti-Pattern 2: Global State Without Context

```svelte
<script>
  import { theme } from '$lib/stores/global';
  
  let currentTheme = $theme;
</script>
```

**Problem**: Cannot control theme in stories - requires global state initialization.

### ✅ Refactored: Props-Based State

```svelte
<script lang="ts">
  interface Props {
    theme: 'light' | 'dark';
    onThemeChange?: (theme: string) => void;
  }
  
  let { theme, onThemeChange }: Props = $props();
</script>
```

### ❌ Anti-Pattern 3: Complex Effects Preventing Determinism

```svelte
<script>
  let messages = $state([]);
  
  $effect(() => {
    const interval = setInterval(() => {
      fetch('/api/messages').then(r => r.json()).then(data => {
        messages = data;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  });
</script>
```

**Problem**: Non-deterministic behavior prevents reliable testing.

### ✅ Refactored: Controlled Polling

```svelte
<script lang="ts">
  interface Props {
    messages: Message[];
    pollingInterval?: number;
    onPoll?: () => Promise<Message[]>;
  }
  
  let { messages, pollingInterval, onPoll }: Props = $props();
  
  $effect(() => {
    if (!onPoll || !pollingInterval) return;
    
    const interval = setInterval(async () => {
      const newMessages = await onPoll();
      messages = newMessages;
    }, pollingInterval);
    
    return () => clearInterval(interval);
  });
</script>
```

**Story**:

```typescript
export const WithPolling: Story = {
  args: {
    messages: mockMessages,
    pollingInterval: 5000,
    onPoll: fn(async () => {
      return [...mockMessages, { id: 'new', content: 'New message' }];
    })
  }
};
```

---

## Best Practices Summary

### DO ✅

1. **Use CSF3 format with TypeScript** - `Meta<typeof Component>` and `StoryObj<typeof meta>` for type safety
2. **Mock SvelteKit stores via parameters** - Use `parameters.sveltekit_experimental.stores` for $app/stores
3. **Inject dependencies as props** - Pass callbacks, data, and services through component props
4. **Use play functions for interaction tests** - Test user workflows with `userEvent`, `expect`, and `waitFor`
5. **Organize tests with step()** - Document multi-step interactions for clarity
6. **Mock navigation with parameters** - Use `sveltekit_experimental.navigation` for goto/invalidate
7. **Tag stories for test-runner** - Use `tags: ['test']` to control which stories run as automated tests
8. **Provide data-testid attributes** - Stable selectors for reliable testing
9. **Test async behavior** - Use `waitFor` with appropriate timeouts for async operations
10. **Separate concerns** - Extract business logic from components into testable utilities

### DON'T ❌

1. **Don't import from $app modules directly in components** - Prevents Storybook isolation
2. **Don't use global stores without context** - Makes stories dependent on external state
3. **Don't hard-code API calls in components** - Mock via props and play functions
4. **Don't test implementation details** - Focus on user behavior and outcomes
5. **Don't create complex effects** - Keep components simple and controllable
6. **Don't skip accessibility testing** - Use test-runner with axe-playwright integration
7. **Don't ignore loading/error states** - Create stories for all component states
8. **Don't mix multiple concerns in one component** - Split into smaller, testable pieces
9. **Don't forget to mock form actions** - Use `sveltekit_experimental.forms.enhance`
10. **Don't skip TypeScript** - Type safety catches errors before runtime

---

## Reference Implementation: Chat Component Suite

**Complete example integrating all patterns**:

```typescript
// ChatInterface.stories.ts
import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import ChatInterface from './ChatInterface.svelte';

const meta = {
  title: 'Chat/ChatInterface',
  component: ChatInterface,
  parameters: {
    layout: 'fullscreen',
    sveltekit_experimental: {
      stores: {
        page: {
          data: {
            user: { id: 'user-1', name: 'Test User' },
            sessions: []
          }
        }
      },
      navigation: {
        goto: fn(),
        invalidate: fn()
      },
      forms: {
        enhance: () => console.log('Form enhanced')
      },
      hrefs: {
        '/chat/.*': {
          callback: (to, event) => {
            console.log('Navigate to:', to);
            event.preventDefault();
          },
          asRegex: true
        }
      }
    }
  },
  tags: ['autodocs', 'test'],
  argTypes: {
    initialMessages: { control: 'object' },
    currentModel: {
      control: { type: 'select' },
      options: ['claude-sonnet-4', 'gpt-4', 'gemini-pro']
    },
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark']
    }
  }
} satisfies Meta<typeof ChatInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
  args: {
    initialMessages: [],
    currentModel: 'claude-sonnet-4',
    theme: 'light'
  }
};

export const WithMessages: Story = {
  args: {
    initialMessages: [
      { id: '1', role: 'user', content: 'Hello!', timestamp: Date.now() - 1000 },
      { id: '2', role: 'assistant', content: 'Hi there! How can I help?', timestamp: Date.now() }
    ],
    currentModel: 'claude-sonnet-4',
    theme: 'light'
  }
};

export const AllInteractionsTest: Story = {
  args: {
    initialMessages: [],
    currentModel: 'claude-sonnet-4',
    theme: 'light',
    onSendMessage: fn(),
    onModelChange: fn(),
    onThemeChange: fn(),
    onUploadFile: fn()
  },
  play: async ({ args, canvas, step }) => {
    const screen = within(canvas);
    
    await step('1. Send message', async () => {
      await userEvent.type(screen.getByTestId('message-input'), 'Test message');
      await userEvent.click(screen.getByTestId('send-button'));
      await waitFor(() => expect(args.onSendMessage).toHaveBeenCalled());
    });
    
    await step('2. Switch model', async () => {
      await userEvent.click(screen.getByTestId('model-selector'));
      await userEvent.click(screen.getByText('GPT-4'));
      await expect(args.onModelChange).toHaveBeenCalledWith('gpt-4');
    });
    
    await step('3. Toggle dark mode', async () => {
      await userEvent.click(screen.getByTestId('theme-toggle'));
      await expect(args.onThemeChange).toHaveBeenCalledWith('dark');
    });
    
    await step('4. Upload file', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      await userEvent.upload(screen.getByTestId('file-input'), file);
      await waitFor(() => expect(args.onUploadFile).toHaveBeenCalled());
    });
  }
};
```

---

## Tool Verification

All patterns in this document were verified using:

- **mcp_context7_get-library-docs** for:
  - `/storybookjs/storybook` - CSF3 format, Meta/StoryObj types, args, argTypes, decorators, parameters
  - `/storybookjs/test-runner` - Test automation, hooks (setup, preVisit, postVisit), CI integration, sharding
  - Storybook SvelteKit integration - Mocking $app modules (stores, navigation, forms, environment)
  - Storybook test utilities - play functions, userEvent, expect, waitFor, fn(), step()

- **mcp_mcp-svelte-docs_svelte_definition** for:
  - $state, $derived, $effect, $props runes syntax and usage patterns
  - Svelte 5 component organization and testability patterns
  - Snippets and component event patterns

**Library Versions**:
- Storybook: v9.0.15
- @storybook/sveltekit: Latest
- @storybook/test-runner: Latest
- @storybook/addon-svelte-csf: Latest
- Svelte: 5.37.0

---

**Last Updated**: 2025-10-03  
**Focus**: SvelteKit + Storybook Testing  
**Testing Checklist**: All 10 items implemented with complete examples

