# AI Chatbot Testing Guide

## Prerequisites

1. **Environment Setup**

   ```bash
   # Ensure .env file has required variables
   DATABASE_URL="local.db"
   OPENROUTER_API_KEY="your-actual-openrouter-api-key"
   PUBLIC_APP_URL="http://localhost:5173"
   NODE_ENV="development"
   ```

2. **Database Setup**

   ```bash
   # Run migrations
   npx tsx src/lib/server/db/migrate.ts
   ```

3. **Start Server**
   ```bash
   # Start development server
   pnpm dev
   ```

## Manual Testing Checklist

### 1. Authentication Flow

#### Test User Registration

1. Navigate to http://localhost:5173/auth/signup
2. Fill in:
   - Email: test@example.com
   - Username: testuser
   - Password: testpassword123
3. Click "Sign Up"
4. **Expected**: Redirect to home page, user logged in

#### Test User Login

1. Navigate to http://localhost:5173/auth/signin
2. Fill in:
   - Email: test@example.com
   - Password: testpassword123
3. Click "Sign In"
4. **Expected**: Redirect to home page, user logged in

#### Test Session Persistence

1. After logging in, refresh the page
2. **Expected**: User remains logged in

#### Test Logout

1. Click user menu in sidebar
2. Click "Sign out"
3. **Expected**: Redirect to home page, user logged out

### 2. Chat Functionality

#### Test Chat Creation

1. Navigate to http://localhost:5173/chat
2. **Expected**: New chat interface appears
3. **Expected**: Chat ID generated and visible in URL

#### Test Message Sending

1. In chat interface, type a message: "Hello, how are you?"
2. Press Enter or click send button
3. **Expected**:
   - Message appears in chat
   - Loading indicator shows
   - AI response streams in
   - Response completes

#### Test Model Selection

1. Click model selector (if visible)
2. Select different model (e.g., GPT-4, Claude)
3. Send a message
4. **Expected**: Response uses selected model

#### Test Message Streaming

1. Send a longer prompt: "Write a 200-word essay about AI"
2. **Expected**:
   - Response streams word by word
   - No lag or freezing
   - Complete response appears

### 3. File Upload

#### Test File Upload

1. In chat interface, click attachment button
2. Select an image file (JPEG or PNG, < 5MB)
3. **Expected**:
   - File preview appears
   - Upload progress shown
   - File uploaded successfully

#### Test File Download

1. After uploading, check if file URL is accessible
2. Navigate to `/api/files/[filename]`
3. **Expected**: File downloads or displays

### 4. Chat History

#### Test Chat List

1. Create multiple chats
2. Navigate to sidebar
3. **Expected**:
   - All chats listed
   - Chat titles visible
   - Click chat to open

#### Test Chat Persistence

1. Send messages in a chat
2. Navigate away
3. Return to chat
4. **Expected**: All messages still visible

### 5. UI/UX Features

#### Test Dark Mode

1. Click user menu
2. Click "Toggle dark mode"
3. **Expected**: Theme switches between light and dark

#### Test Responsive Design

1. Resize browser window
2. **Expected**:
   - Layout adapts to screen size
   - Sidebar collapses on mobile
   - All features accessible

#### Test Suggested Actions

1. On new chat, check for suggested prompts
2. Click a suggested action
3. **Expected**: Prompt fills input and sends

### 6. Error Handling

#### Test Invalid Login

1. Try logging in with wrong password
2. **Expected**: Error message displayed

#### Test Network Error

1. Stop dev server
2. Try sending a message
3. **Expected**: Error message displayed

#### Test File Upload Error

1. Try uploading file > 5MB
2. **Expected**: Error message displayed

#### Test Invalid File Type

1. Try uploading .exe or .zip file
2. **Expected**: Error message displayed

## Database Verification

### Check Database Tables

```bash
# Open SQLite database
sqlite3 local.db

# List tables
.tables

# Check user table
SELECT * FROM user;

# Check chat table
SELECT * FROM chat;

# Check message table
SELECT * FROM message;

# Exit
.quit
```

### Expected Tables

- user
- session
- chat
- message
- vote
- document
- suggestion

## API Testing

### Test Chat API

```bash
# Send message (requires valid session cookie)
curl -X POST http://localhost:5173/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-chat-id",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

### Test File Upload API

```bash
# Upload file (requires valid session cookie)
curl -X POST http://localhost:5173/api/files/upload \
  -F "file=@test-image.jpg"
```

## Performance Testing

### Test Response Time

1. Send a simple message
2. Measure time to first token
3. **Expected**: < 2 seconds

### Test Concurrent Chats

1. Open multiple chat tabs
2. Send messages in each
3. **Expected**: All work independently

### Test Large Messages

1. Send a very long prompt (1000+ words)
2. **Expected**: Handles gracefully

## Known Issues to Verify

1. **Examples Folder**: Disabled, should not affect main app
2. **ComplexUserProfileForm**: Demo component, may not work fully
3. **TypeScript Warnings**: Should not affect runtime

## Success Criteria

- ✅ User can register and login
- ✅ User can create chats
- ✅ User can send messages
- ✅ AI responses stream correctly
- ✅ Files can be uploaded
- ✅ Chat history persists
- ✅ Dark mode works
- ✅ No console errors
- ✅ No runtime errors
- ✅ Database saves data correctly

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**: Run migrations: `npx tsx src/lib/server/db/migrate.ts`

### Issue: "OpenRouter API error"

**Solution**: Check OPENROUTER_API_KEY in .env

### Issue: "Session expired"

**Solution**: Login again, check session table in database

### Issue: "File upload fails"

**Solution**: Check file size (< 5MB) and type (JPEG/PNG)

### Issue: "Build errors"

**Solution**: Run `pnpm install` and `pnpm run build`

## Reporting Issues

When reporting issues, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Console errors (if any)
5. Network errors (if any)
6. Database state (if relevant)

## Next Steps After Testing

1. Fix any bugs found
2. Add missing features
3. Improve error handling
4. Add loading states
5. Add toast notifications
6. Optimize performance
7. Add tests
8. Create PR
9. Deploy

## Contact

For questions or issues, refer to:

- `MIGRATION_COMPLETE.md` - Full migration details
- `README_MIGRATION.md` - Usage guide
- `CHATBOT_MIGRATION_STATUS.md` - Phase-by-phase status
