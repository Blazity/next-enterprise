# Complexity Reference Guide

This document provides detailed strategies for managing code complexity in Wednesday Solutions projects.

## Understanding Cyclomatic Complexity

Cyclomatic complexity measures the number of linearly independent paths through a function. Each decision point (if, else, case, &&, ||, ternary, catch) adds 1 to the complexity.

### Counting Complexity

```typescript
function example(a: boolean, b: boolean, c: number) {  // Base: 1
  if (a) {                    // +1
    doSomething()
  } else if (b) {             // +1
    doSomethingElse()
  }

  switch (c) {
    case 1:                   // +1
      handleOne()
      break
    case 2:                   // +1
      handleTwo()
      break
    default:
      handleDefault()
  }

  const result = a && b       // +1 (short-circuit)
    ? 'both'
    : 'not both'              // +1 (ternary)

  try {
    riskyOperation()
  } catch (e) {               // +1
    handleError(e)
  }

  return result
}
// Total complexity: 8
```

## Refactoring Strategies

### 1. Extract Early Returns (Guard Clauses)

Transform nested conditions into flat guard clauses.

```typescript
// Before: Complexity 5
function processOrder(order: Order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        if (order.shippingAddress) {
          return shipOrder(order)
        } else {
          return { error: 'No shipping address' }
        }
      } else {
        return { error: 'Order not paid' }
      }
    } else {
      return { error: 'No items' }
    }
  } else {
    return { error: 'Invalid order' }
  }
}

// After: Complexity 4
function processOrder(order: Order) {
  if (!order) return { error: 'Invalid order' }
  if (order.items.length === 0) return { error: 'No items' }
  if (!order.isPaid) return { error: 'Order not paid' }
  if (!order.shippingAddress) return { error: 'No shipping address' }

  return shipOrder(order)
}
```

### 2. Replace Conditionals with Lookup Tables

Transform switch/if-else chains into object lookups.

```typescript
// Before: Complexity 6
function getStatusColor(status: string): string {
  if (status === 'pending') {
    return 'yellow'
  } else if (status === 'approved') {
    return 'green'
  } else if (status === 'rejected') {
    return 'red'
  } else if (status === 'cancelled') {
    return 'gray'
  } else if (status === 'processing') {
    return 'blue'
  } else {
    return 'black'
  }
}

// After: Complexity 1
const STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  cancelled: 'gray',
  processing: 'blue',
}

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'black'
}
```

### 3. Extract Complex Conditions

Move boolean expressions into named variables or functions.

```typescript
// Before: Hard to read, complexity embedded in condition
function canUserEditPost(user: User, post: Post) {
  if ((user.role === 'admin' || user.role === 'moderator') &&
      post.status !== 'archived' &&
      (post.authorId === user.id || user.permissions.includes('edit_any'))) {
    return true
  }
  return false
}

// After: Self-documenting, same complexity but readable
function canUserEditPost(user: User, post: Post) {
  const isPrivilegedUser = user.role === 'admin' || user.role === 'moderator'
  const isPostEditable = post.status !== 'archived'
  const hasEditPermission = post.authorId === user.id || user.permissions.includes('edit_any')

  return isPrivilegedUser && isPostEditable && hasEditPermission
}
```

### 4. Use Strategy Pattern

Replace complex branching with polymorphism.

```typescript
// Before: Complexity 5
function calculatePrice(item: Item, userType: string) {
  let price = item.basePrice

  if (userType === 'premium') {
    price = price * 0.8
    if (item.quantity > 10) {
      price = price * 0.95
    }
  } else if (userType === 'wholesale') {
    price = price * 0.7
    if (item.quantity > 100) {
      price = price * 0.9
    }
  } else {
    if (item.quantity > 5) {
      price = price * 0.98
    }
  }

  return price
}

// After: Complexity 1 per function
interface PricingStrategy {
  calculate(basePrice: number, quantity: number): number
}

const pricingStrategies: Record<string, PricingStrategy> = {
  premium: {
    calculate: (basePrice, quantity) => {
      const discounted = basePrice * 0.8
      return quantity > 10 ? discounted * 0.95 : discounted
    },
  },
  wholesale: {
    calculate: (basePrice, quantity) => {
      const discounted = basePrice * 0.7
      return quantity > 100 ? discounted * 0.9 : discounted
    },
  },
  regular: {
    calculate: (basePrice, quantity) => {
      return quantity > 5 ? basePrice * 0.98 : basePrice
    },
  },
}

function calculatePrice(item: Item, userType: string) {
  const strategy = pricingStrategies[userType] ?? pricingStrategies.regular
  return strategy.calculate(item.basePrice, item.quantity)
}
```

### 5. Decompose Functions

Split large functions into smaller, focused ones.

```typescript
// Before: Complexity 10
function processUserRegistration(data: RegistrationData) {
  // Validate email
  if (!data.email || !data.email.includes('@')) {
    return { error: 'Invalid email' }
  }

  // Validate password
  if (!data.password || data.password.length < 8) {
    return { error: 'Password too short' }
  }
  if (!/[A-Z]/.test(data.password)) {
    return { error: 'Password needs uppercase' }
  }
  if (!/[0-9]/.test(data.password)) {
    return { error: 'Password needs number' }
  }

  // Check existing user
  const existing = findUserByEmail(data.email)
  if (existing) {
    return { error: 'Email already registered' }
  }

  // Create user
  const user = createUser(data)
  if (!user) {
    return { error: 'Failed to create user' }
  }

  // Send welcome email
  const emailSent = sendWelcomeEmail(user)
  if (!emailSent) {
    // Log but don't fail
    logError('Welcome email failed')
  }

  return { success: true, user }
}

// After: Each function has complexity 2-3
function validateEmail(email: string): string | null {
  if (!email || !email.includes('@')) return 'Invalid email'
  return null
}

function validatePassword(password: string): string | null {
  if (!password || password.length < 8) return 'Password too short'
  if (!/[A-Z]/.test(password)) return 'Password needs uppercase'
  if (!/[0-9]/.test(password)) return 'Password needs number'
  return null
}

function processUserRegistration(data: RegistrationData) {
  const emailError = validateEmail(data.email)
  if (emailError) return { error: emailError }

  const passwordError = validatePassword(data.password)
  if (passwordError) return { error: passwordError }

  const existing = findUserByEmail(data.email)
  if (existing) return { error: 'Email already registered' }

  const user = createUser(data)
  if (!user) return { error: 'Failed to create user' }

  sendWelcomeEmail(user).catch(logError)

  return { success: true, user }
}
```

### 6. Use Optional Chaining and Nullish Coalescing

Reduce null checks with modern JavaScript operators.

```typescript
// Before: Complexity increases with each check
function getUserCity(user: User | null) {
  if (user) {
    if (user.address) {
      if (user.address.city) {
        return user.address.city
      }
    }
  }
  return 'Unknown'
}

// After: Complexity 1
function getUserCity(user: User | null) {
  return user?.address?.city ?? 'Unknown'
}
```

## Cognitive Complexity

Beyond cyclomatic complexity, consider **cognitive complexity** - how hard code is for humans to understand.

### Factors That Increase Cognitive Load

1. **Nesting depth** - Each level of nesting multiplies difficulty
2. **Breaking linear flow** - break, continue, early returns in loops
3. **Multiple conditions** - Complex boolean expressions
4. **Recursion** - Harder to trace mentally

### Good Practices

```typescript
// Avoid deep nesting
// Bad
function processItems(items: Item[]) {
  for (const item of items) {
    if (item.isValid) {
      if (item.type === 'special') {
        for (const subItem of item.children) {
          if (subItem.active) {
            // 4 levels deep - hard to follow
          }
        }
      }
    }
  }
}

// Good - flatten with early continues
function processItems(items: Item[]) {
  for (const item of items) {
    if (!item.isValid) continue
    if (item.type !== 'special') continue

    processSpecialItem(item)
  }
}

function processSpecialItem(item: Item) {
  for (const subItem of item.children) {
    if (!subItem.active) continue

    // Process at max 1 level deep
  }
}
```

## ESLint Configuration

The project enforces complexity via ESLint:

```javascript
// eslint.config.mjs
{
  rules: {
    'complexity': ['error', 8],
    'max-lines': ['error', 250],
    'max-lines-per-function': ['error', 350],
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3],
  }
}
```

## Tools for Measuring Complexity

1. **ESLint** - Reports violations during development
2. **SonarQube** - Comprehensive code quality analysis
3. **VS Code Extensions** - CodeMetrics, SonarLint

## When to Accept Higher Complexity

Sometimes complexity is unavoidable:

1. **State machines** - Complex by nature, but use libraries like XState
2. **Parsers** - Consider using parser generators
3. **Algorithm implementations** - Document thoroughly, test extensively
4. **Legacy integration** - Isolate complexity, add comprehensive tests

In these cases:
- Add `// eslint-disable-next-line complexity` with justification
- Ensure 100% test coverage for the complex function
- Document the complexity in comments
- Consider if a library could handle it better
