---
name: wednesday-dev
description: Technical development guidelines for Wednesday Solutions projects. Enforces import ordering, complexity limits, naming conventions, TypeScript best practices, and code quality standards for React/Next.js applications.
license: MIT
metadata:
  author: wednesday-solutions
  version: "1.0"
compatibility: Next.js 14+, React 18+, TypeScript 5+
---

# Wednesday Technical Development Guidelines

This skill enforces code quality standards for Wednesday Solutions projects. Follow these guidelines to maintain consistency, readability, and maintainability across the codebase.

## 1. Import Order

Imports must follow a strict ordering pattern. The project uses `@trivago/prettier-plugin-sort-imports` to enforce this automatically.

### Required Order

```typescript
// 1. React (always first)
import React, { useState, useEffect } from 'react'

// 2. Next.js imports
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// 3. State management (Recoil, Redux)
import { useSelector } from 'react-redux'

// 4. UI libraries (MUI, Radix)
import { Button } from '@mui/material'

// 5. Path alias imports (@/)
import { useAuth } from '@/lib/hooks/useAuth'
import { API_ROUTES } from '@/lib/constants'

// 6. External packages
import { z } from 'zod'
import { motion } from 'framer-motion'

// 7. Internal components
import { Header } from 'components/Header'

// 8. Relative imports (sibling/parent)
import { utils } from './utils'
import { types } from '../types'
```

### Rules

- Each import group must be separated by a blank line
- Imports within each group should be alphabetically sorted
- Use type imports for TypeScript types: `import type { User } from '@/types'`
- Avoid wildcard imports (`import * as`) unless necessary

## 2. Code Complexity

### Cyclomatic Complexity

**Maximum allowed: 8** (stricter than industry standard of 10)

Functions exceeding this limit must be refactored. See [references/COMPLEXITY.md](references/COMPLEXITY.md) for detailed strategies.

### Quick Remediation

| Complexity | Action Required |
|------------|-----------------|
| 1-4        | Good - easy to test |
| 5-7        | Acceptable - consider simplifying |
| 8          | At limit - refactor if adding logic |
| 9+         | Must refactor before merging |

### How to Reduce Complexity

1. **Extract helper functions** - Break large functions into smaller, focused ones
2. **Use early returns** - Replace nested conditions with guard clauses
3. **Replace conditionals with polymorphism** - Use strategy pattern for complex branching
4. **Simplify boolean expressions** - Extract complex conditions into named variables
5. **Use lookup tables** - Replace switch statements with object maps

```typescript
// BAD: High complexity
function getDiscount(user: User, items: Item[]) {
  let discount = 0
  if (user.isPremium) {
    if (items.length > 10) {
      discount = 20
    } else if (items.length > 5) {
      discount = 10
    } else {
      discount = 5
    }
  } else {
    if (items.length > 10) {
      discount = 10
    } else if (items.length > 5) {
      discount = 5
    }
  }
  return discount
}

// GOOD: Low complexity with lookup table
const DISCOUNT_TABLE = {
  premium: { large: 20, medium: 10, small: 5 },
  regular: { large: 10, medium: 5, small: 0 },
} as const

function getCartSize(count: number): 'large' | 'medium' | 'small' {
  if (count > 10) return 'large'
  if (count > 5) return 'medium'
  return 'small'
}

function getDiscount(user: User, items: Item[]) {
  const tier = user.isPremium ? 'premium' : 'regular'
  const size = getCartSize(items.length)
  return DISCOUNT_TABLE[tier][size]
}
```

### File Size Limits

- **Max file lines**: 250
- **Max function lines**: 350
- **Max line length**: 120 characters

## 3. Naming Conventions

### Components & Classes

Use **PascalCase** for React components, classes, types, and interfaces.

```typescript
// Components
function UserProfile() { }
function PaymentCard() { }

// Types & Interfaces
interface UserProfileProps { }
type PaymentMethod = 'card' | 'bank'

// Classes
class AuthService { }
```

### Functions & Variables

Use **camelCase** for functions, variables, hooks, and object properties.

```typescript
// Functions
function fetchUserData() { }
function calculateTotal() { }

// Variables
const isLoading = true
const userProfile = { }

// Hooks
function useAuth() { }
function useLocalStorage() { }
```

### Constants & Enums

Use **UPPER_SNAKE_CASE** for constants and enum values.

```typescript
// Constants
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3

// Enums
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
```

### Boolean Variables

Prefix with `is`, `has`, `should`, `can`, or `will` for clarity.

```typescript
// Good
const isAuthenticated = true
const hasPermission = false
const shouldRefetch = true
const canEdit = user.role === 'ADMIN'

// Bad
const authenticated = true
const permission = false
const refetch = true
```

### Files & Folders

| Type | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `UserProfile.tsx` |
| Hook files | camelCase with `use` prefix | `useAuth.ts` |
| Utility files | camelCase | `formatDate.ts` |
| Constant files | camelCase | `apiRoutes.ts` |
| Type files | camelCase | `user.types.ts` |
| Test files | Match source + `.test` | `UserProfile.test.tsx` |
| Folders | camelCase | `components/`, `hooks/` |

### Descriptive Naming

Names should be self-documenting:

```typescript
// Bad - unclear intent
const d = new Date()
const arr = users.filter(u => u.a)
function proc(x: number) { }

// Good - clear intent
const currentDate = new Date()
const activeUsers = users.filter(user => user.isActive)
function processPayment(amount: number) { }
```

## 4. TypeScript Best Practices

### Strict Type Safety

- Enable strict mode in `tsconfig.json`
- Avoid `any` type - use `unknown` and narrow types
- Use explicit return types for public functions
- Leverage discriminated unions for state

```typescript
// Use discriminated unions
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// Narrow types properly
function processValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  throw new Error('Unsupported type')
}
```

### Type Imports

Separate type imports from value imports:

```typescript
import { useState } from 'react'
import type { FC, ReactNode } from 'react'

import { fetchUser } from '@/lib/api'
import type { User, UserRole } from '@/types'
```

## 5. React Patterns

### Component Structure

Follow this order within components:

1. Type definitions (props interface)
2. Component function declaration
3. Hooks (useState, useEffect, custom hooks)
4. Derived state / computations
5. Event handlers
6. Effects
7. Return statement (JSX)

```typescript
interface UserCardProps {
  userId: string
  onSelect?: (user: User) => void
}

export function UserCard({ userId, onSelect }: UserCardProps) {
  // 1. Hooks
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: user, isLoading } = useUser(userId)

  // 2. Derived state
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Unknown'

  // 3. Event handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded)
    onSelect?.(user)
  }

  // 4. Early returns for loading/error states
  if (isLoading) return <Skeleton />
  if (!user) return null

  // 5. Main render
  return (
    <Card onClick={handleClick}>
      <CardTitle>{displayName}</CardTitle>
      {isExpanded && <CardContent>{user.bio}</CardContent>}
    </Card>
  )
}
```

### Use Client Directive

Mark client components explicitly:

```typescript
'use client'

import { useState } from 'react'
// ... client-side component
```

## 6. Forbidden Patterns

### No Console Statements

Console statements are forbidden in production code. Use proper logging utilities.

```typescript
// Forbidden
console.log('debug:', data)
console.error('Error:', err)

// Use structured logging or remove before commit
```

### No Magic Numbers/Strings

Extract to named constants:

```typescript
// Bad
if (retryCount > 3) { }
if (status === 'active') { }

// Good
const MAX_RETRIES = 3
const STATUS_ACTIVE = 'active'

if (retryCount > MAX_RETRIES) { }
if (status === STATUS_ACTIVE) { }
```

### No Unused Code

- Remove unused imports (enforced by `eslint-plugin-unused-imports`)
- Delete commented-out code
- Remove unused variables (prefix with `_` only if intentionally unused)

## 7. Testing Requirements

### Unit Tests

- Use Jest with React Testing Library
- Test file naming: `ComponentName.test.tsx`
- Focus on user behavior, not implementation details

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  it('displays user name correctly', () => {
    render(<UserCard userId="123" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn()
    render(<UserCard userId="123" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '123' }))
  })
})
```

### E2E Tests

- Use Playwright for end-to-end tests
- Test file naming: `feature.spec.ts`
- Test critical user flows

## 8. Security Considerations

- Sanitize HTML with DOMPurify before rendering
- Validate all user inputs with Zod schemas
- Never expose sensitive data in client-side code
- Use environment variables for secrets
- Implement CSRF protection for forms

## 9. Performance Guidelines

- Use `next/dynamic` for code splitting
- Implement proper loading states
- Memoize expensive computations with `useMemo`
- Avoid unnecessary re-renders with `React.memo`
- Use image optimization with `next/image`

---

For detailed examples and edge cases, see [references/COMPLEXITY.md](references/COMPLEXITY.md).
