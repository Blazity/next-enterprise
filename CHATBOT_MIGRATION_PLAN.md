# AI Chatbot Migration Plan

## Phase 1: Direct File Copying (No Modification Needed)

### UI Components (Copy Directly)

- ✅ All icon components from `ai-chatbot-svelte/src/lib/components/icons/`
- ✅ UI components from `ai-chatbot-svelte/src/lib/components/ui/`
- ✅ Markdown renderer components
- ✅ Code block component
- ✅ Artifact components

### Utilities (Copy Directly)

- ✅ `ai-chatbot-svelte/src/lib/utils/shadcn.ts`
- ✅ `ai-chatbot-svelte/src/lib/utils/constants.ts`
- ✅ `ai-chatbot-svelte/src/lib/utils/chat.ts`
- ✅ `ai-chatbot-svelte/src/lib/utils/types.ts`
- ✅ `ai-chatbot-svelte/src/lib/utils/reactivity.svelte.ts`

### Hooks (Copy Directly)

- ✅ `ai-chatbot-svelte/src/lib/hooks/is-mobile.svelte.ts`
- ✅ `ai-chatbot-svelte/src/lib/hooks/local-storage.svelte.ts`
- ✅ `ai-chatbot-svelte/src/lib/hooks/lock.ts`
- ✅ `ai-chatbot-svelte/src/lib/hooks/selected-model.svelte.ts`
- ✅ `ai-chatbot-svelte/src/lib/hooks/chat-history.svelte.ts`

### Error Handling (Copy Directly)

- ✅ `ai-chatbot-svelte/src/lib/errors/tagged-error.ts`
- ✅ `ai-chatbot-svelte/src/lib/errors/ai.ts`
- ✅ `ai-chatbot-svelte/src/lib/errors/db.ts`

### Static Assets

- ✅ Fonts from `ai-chatbot-svelte/static/fonts/`
- ✅ Images from `ai-chatbot-svelte/static/`

## Phase 2: Service Layer Migration (Requires Modification)

### Database Schema Migration

- ❌ Convert from Postgres to SQLite syntax
- ❌ Update `src/lib/server/db/schema.ts` with chat tables
- ❌ Create migration file for new tables

### Database Queries Migration

- ❌ Convert all queries from Postgres to SQLite
- ❌ Replace `neverthrow` pattern with standard error handling
- ❌ Update to use our SQLite db instance

### Authentication Migration

- ❌ Integrate with existing Lucia auth
- ❌ Update session management
- ❌ Migrate password hashing

## Phase 3: AI Integration Migration

### AI Models Configuration

- ❌ Update `ai-chatbot-svelte/src/lib/ai/models.ts` to use OpenRouter
- ❌ Migrate AI server code to use our AI service

### AI Server Functions

- ❌ Update `ai-chatbot-svelte/src/lib/server/ai/models.ts`
- ❌ Update `ai-chatbot-svelte/src/lib/server/ai/prompts.ts`
- ❌ Update `ai-chatbot-svelte/src/lib/server/ai/utils.ts`

## Phase 4: Route and Component Migration

### Chat Components (Requires Svelte 5 Updates)

- ❌ `app-sidebar.svelte`
- ❌ `auth-form.svelte`
- ❌ `chat-header.svelte`
- ❌ `chat.svelte`
- ❌ `message-reasoning.svelte`
- ❌ `messages.svelte`
- ❌ `model-selector.svelte`
- ❌ `multimodal-input.svelte`
- ❌ `preview-attachment.svelte`
- ❌ `sidebar-history/`
- ❌ `sidebar-toggle.svelte`
- ❌ `sidebar-user-nav.svelte`
- ❌ `submit-button.svelte`
- ❌ `suggested-actions.svelte`
- ❌ `visibility-selector.svelte`

### Routes Migration

- ❌ `ai-chatbot-svelte/src/routes/(auth)/` → `src/routes/auth/`
- ❌ `ai-chatbot-svelte/src/routes/(chat)/` → `src/routes/chat/`
- ❌ API routes for chat, files, history, suggestions, votes

## Phase 5: Feature Completeness

### Core Features

- ❌ Chat creation and management
- ❌ Message streaming
- ❌ Chat history persistence
- ❌ File attachments (using local storage)
- ❌ Vote system
- ❌ Document suggestions
- ❌ Model selection
- ❌ Sidebar navigation

### Database Migrations

- ❌ Create migration script
- ❌ Run migrations
- ❌ Verify tables created

## Phase 6: Validation

### Code Quality

- ❌ Format all code
- ❌ Fix TypeScript errors
- ❌ Fix linting issues
- ❌ Build successfully

### Testing

- ❌ Manual testing of all features
- ❌ Verify chat creation
- ❌ Verify message streaming
- ❌ Verify file uploads
- ❌ Verify voting
- ❌ Verify model selection

## Files to Copy Directly (Phase 1)

```bash
# Icons
cp -r ai-chatbot-svelte/src/lib/components/icons src/lib/components/

# UI Components (shadcn)
cp -r ai-chatbot-svelte/src/lib/components/ui src/lib/components/

# Markdown
cp -r ai-chatbot-svelte/src/lib/components/markdown src/lib/components/

# Artifact
cp -r ai-chatbot-svelte/src/lib/components/artifact src/lib/components/

# Code block
cp ai-chatbot-svelte/src/lib/components/code-block.svelte src/lib/components/

# Utilities
cp ai-chatbot-svelte/src/lib/utils/shadcn.ts src/lib/utils/
cp ai-chatbot-svelte/src/lib/utils/constants.ts src/lib/utils/
cp ai-chatbot-svelte/src/lib/utils/chat.ts src/lib/utils/
cp ai-chatbot-svelte/src/lib/utils/types.ts src/lib/utils/
cp ai-chatbot-svelte/src/lib/utils/reactivity.svelte.ts src/lib/utils/

# Hooks
cp ai-chatbot-svelte/src/lib/hooks/is-mobile.svelte.ts src/lib/hooks/
cp ai-chatbot-svelte/src/lib/hooks/local-storage.svelte.ts src/lib/hooks/
cp ai-chatbot-svelte/src/lib/hooks/lock.ts src/lib/hooks/
cp ai-chatbot-svelte/src/lib/hooks/selected-model.svelte.ts src/lib/hooks/
cp ai-chatbot-svelte/src/lib/hooks/chat-history.svelte.ts src/lib/hooks/

# Errors
cp ai-chatbot-svelte/src/lib/errors/tagged-error.ts src/lib/errors/
cp ai-chatbot-svelte/src/lib/errors/ai.ts src/lib/errors/
cp ai-chatbot-svelte/src/lib/errors/db.ts src/lib/errors/

# Static assets
cp -r ai-chatbot-svelte/static/fonts static/
cp ai-chatbot-svelte/static/opengraph-image.png static/
```

## Success Criteria

- [ ] All files copied or migrated
- [ ] SQLite database with all chat tables
- [ ] All queries working with SQLite
- [ ] AI SDK 5 with OpenRouter integration
- [ ] All chat features functional
- [ ] Zero build errors
- [ ] Zero TypeScript errors
- [ ] Zero linting errors
- [ ] All CI checks passing
