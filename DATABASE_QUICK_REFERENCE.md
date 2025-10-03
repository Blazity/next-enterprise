# Database Quick Reference Guide

## PGlite + Drizzle ORM + Valibot

This guide provides quick examples for common database operations using the refactored stack.

---

## Table of Contents
1. [Importing](#importing)
2. [CRUD Operations](#crud-operations)
3. [Validation](#validation)
4. [Queries](#queries)
5. [Transactions](#transactions)
6. [Schema Reference](#schema-reference)

---

## Importing

### Database Connection
```typescript
import { db } from '$db/db';
```

### Schema Tables
```typescript
import { user, userProfile, session, chat, message, vote, document, suggestion } from '$db/schema';
```

### Drizzle Operators
```typescript
import { eq, and, or, gt, gte, lt, lte, like, inArray, desc, asc } from 'drizzle-orm';
```

### Valibot Schemas
```typescript
import {
  insertUserSchema,
  selectUserSchema,
  updateUserSchema,
  insertChatSchema,
  selectChatSchema
} from '$db/valibot-schemas';
```

### Valibot Validation
```typescript
import { parse, safeParse } from 'valibot';
```

---

## CRUD Operations

### Create (Insert)

#### Single Record
```typescript
import { db } from '$db/db';
import { user } from '$db/schema';

await db.insert(user).values({
  id: '123',
  email: 'user@example.com',
  username: 'johndoe',
  passwordHash: 'hashed_password'
});
```

#### Multiple Records
```typescript
await db.insert(user).values([
  { id: '1', email: 'user1@example.com', username: 'user1', passwordHash: 'hash1' },
  { id: '2', email: 'user2@example.com', username: 'user2', passwordHash: 'hash2' }
]);
```

#### With Validation
```typescript
import { insertUserSchema } from '$db/valibot-schemas';
import { parse } from 'valibot';

const userData = parse(insertUserSchema, {
  id: '123',
  email: 'user@example.com',
  username: 'johndoe',
  passwordHash: 'hashed_password'
});

await db.insert(user).values(userData);
```

### Read (Select)

#### All Records
```typescript
const users = await db.select().from(user);
```

#### With Conditions
```typescript
import { eq } from 'drizzle-orm';

const user = await db.select().from(user).where(eq(user.email, 'user@example.com'));
```

#### Multiple Conditions
```typescript
import { and, eq, gt } from 'drizzle-orm';

const chats = await db
  .select()
  .from(chat)
  .where(and(eq(chat.userId, '123'), gt(chat.createdAt, new Date('2024-01-01'))));
```

#### With Ordering
```typescript
import { desc } from 'drizzle-orm';

const recentChats = await db.select().from(chat).orderBy(desc(chat.createdAt)).limit(10);
```

#### With Joins
```typescript
const chatsWithMessages = await db
  .select()
  .from(chat)
  .leftJoin(message, eq(chat.id, message.chatId))
  .where(eq(chat.userId, '123'));
```

### Update

#### Single Record
```typescript
import { eq } from 'drizzle-orm';

await db.update(user).set({ username: 'newname' }).where(eq(user.id, '123'));
```

#### Multiple Fields
```typescript
await db
  .update(userProfile)
  .set({
    firstName: 'John',
    lastName: 'Doe',
    updatedAt: new Date()
  })
  .where(eq(userProfile.userId, '123'));
```

#### With Validation
```typescript
import { updateUserSchema } from '$db/valibot-schemas';
import { parse } from 'valibot';

const updateData = parse(updateUserSchema, {
  username: 'newname'
});

await db.update(user).set(updateData).where(eq(user.id, '123'));
```

### Delete

#### Single Record
```typescript
import { eq } from 'drizzle-orm';

await db.delete(user).where(eq(user.id, '123'));
```

#### Multiple Records
```typescript
import { inArray } from 'drizzle-orm';

await db.delete(message).where(inArray(message.id, ['msg1', 'msg2', 'msg3']));
```

---

## Validation

### Validate Insert Data
```typescript
import { insertChatSchema } from '$db/valibot-schemas';
import { parse, safeParse } from 'valibot';

// Throws error if invalid
const chatData = parse(insertChatSchema, {
  id: 'chat123',
  title: 'My Chat',
  userId: 'user123',
  visibility: 'private'
});

// Returns result object
const result = safeParse(insertChatSchema, rawData);
if (result.success) {
  await db.insert(chat).values(result.output);
} else {
  console.error(result.issues);
}
```

### Validate Query Results
```typescript
import { selectUserSchema } from '$db/valibot-schemas';
import { parse } from 'valibot';

const users = await db.select().from(user);
const validatedUsers = users.map((u) => parse(selectUserSchema, u));
```

### Validate Update Data
```typescript
import { updateChatSchema } from '$db/valibot-schemas';
import { parse } from 'valibot';

const updateData = parse(updateChatSchema, {
  title: 'Updated Title'
});

await db.update(chat).set(updateData).where(eq(chat.id, 'chat123'));
```

---

## Queries

### Complex Queries

#### Count Records
```typescript
import { count } from 'drizzle-orm';

const result = await db.select({ count: count() }).from(user);
const userCount = result[0].count;
```

#### Aggregate Functions
```typescript
import { count, avg, sum, min, max } from 'drizzle-orm';

const stats = await db
  .select({
    totalChats: count(),
    avgMessagesPerChat: avg(message.id)
  })
  .from(chat)
  .leftJoin(message, eq(chat.id, message.chatId));
```

#### Subqueries
```typescript
const recentChats = db
  .select()
  .from(chat)
  .where(gt(chat.createdAt, new Date('2024-01-01')))
  .as('recentChats');

const usersWithRecentChats = await db
  .select()
  .from(user)
  .innerJoin(recentChats, eq(user.id, recentChats.userId));
```

#### Pagination
```typescript
const page = 1;
const pageSize = 20;

const paginatedChats = await db
  .select()
  .from(chat)
  .orderBy(desc(chat.createdAt))
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

---

## Transactions

### Basic Transaction
```typescript
await db.transaction(async (tx) => {
  await tx.insert(user).values({ id: '123', email: 'user@example.com', username: 'user', passwordHash: 'hash' });
  await tx.insert(userProfile).values({ id: 'profile123', userId: '123', firstName: 'John', lastName: 'Doe' });
});
```

### Transaction with Error Handling
```typescript
try {
  await db.transaction(async (tx) => {
    const newUser = await tx.insert(user).values(userData).returning();
    await tx.insert(session).values({ id: 'session123', userId: newUser[0].id, expiresAt: new Date() });
  });
} catch (error) {
  console.error('Transaction failed:', error);
  // Transaction automatically rolled back
}
```

---

## Schema Reference

### Available Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `user` | User accounts | id, email, username, passwordHash |
| `userProfile` | Extended user info | id, userId, firstName, lastName |
| `session` | User sessions | id, userId, expiresAt |
| `chat` | Chat conversations | id, userId, title, visibility |
| `message` | Chat messages | id, chatId, role, parts, attachments |
| `vote` | Message votes | chatId, messageId, isUpvoted |
| `document` | Documents | id, userId, title, content, kind |
| `suggestion` | Document suggestions | id, documentId, originalText, suggestedText |

### Schema Files Location
```
src/lib/server/database/schema/
├── users.ts          # user, userProfile
├── sessions.ts       # session
├── chats.ts          # chat, message, vote
├── documents.ts      # document, suggestion
└── index.ts          # exports all
```

---

## Common Patterns

### User Registration
```typescript
import { db } from '$db/db';
import { user, session } from '$db/schema';
import { insertUserSchema } from '$db/valibot-schemas';
import { parse } from 'valibot';
import { hash } from 'bcrypt-ts';

const userData = parse(insertUserSchema, {
  id: generateId(),
  email: formData.email,
  username: formData.username,
  passwordHash: await hash(formData.password, 10)
});

await db.transaction(async (tx) => {
  await tx.insert(user).values(userData);
  await tx.insert(session).values({
    id: generateSessionId(),
    userId: userData.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
});
```

### Create Chat with First Message
```typescript
import { db } from '$db/db';
import { chat, message } from '$db/schema';

await db.transaction(async (tx) => {
  const newChat = await tx
    .insert(chat)
    .values({
      id: generateId(),
      userId: userId,
      title: 'New Chat',
      visibility: 'private'
    })
    .returning();

  await tx.insert(message).values({
    id: generateId(),
    chatId: newChat[0].id,
    role: 'user',
    parts: JSON.stringify([{ type: 'text', text: 'Hello!' }]),
    attachments: JSON.stringify([])
  });
});
```

### Get User with Profile
```typescript
import { db } from '$db/db';
import { user, userProfile } from '$db/schema';
import { eq } from 'drizzle-orm';

const result = await db
  .select()
  .from(user)
  .leftJoin(userProfile, eq(user.id, userProfile.userId))
  .where(eq(user.id, userId));

const userData = {
  ...result[0].user,
  profile: result[0].user_profile
};
```

---

## Tips & Best Practices

1. **Always use transactions** for operations that modify multiple tables
2. **Validate data** before inserting/updating using Valibot schemas
3. **Use prepared statements** for repeated queries (Drizzle does this automatically)
4. **Index frequently queried fields** (already done in schema)
5. **Use TypeScript types** from schema for type safety
6. **Handle errors** properly in transactions
7. **Use pagination** for large result sets
8. **Avoid N+1 queries** by using joins

---

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PGlite Documentation](https://github.com/electric-sql/pglite)
- [Valibot Documentation](https://valibot.dev/)
- [drizzle-valibot Documentation](https://orm.drizzle.team/docs/valibot)

---

**Last Updated**: 2025-10-03  
**Version**: 1.0.0

