# Naming Conventions Reference

Detailed naming conventions for Wednesday Solutions React/TypeScript projects.

## Quick Reference Table

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `UserProfile`, `PaymentCard` |
| Hooks | camelCase with `use` prefix | `useAuth`, `useLocalStorage` |
| Functions | camelCase, verb-first | `fetchUser`, `calculateTotal` |
| Variables | camelCase | `isLoading`, `userData` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `User`, `PaymentMethod` |
| Enums | PascalCase name, UPPER_SNAKE_CASE values | `UserRole.ADMIN` |
| Files (components) | PascalCase | `UserProfile.tsx` |
| Files (utilities) | camelCase | `formatDate.ts` |
| Folders | camelCase | `components/`, `hooks/` |
| CSS classes | kebab-case (Tailwind) | `text-primary`, `bg-gray-100` |

## Detailed Guidelines

### React Components

```typescript
// Component naming - PascalCase
function UserProfileCard() { }
function PaymentMethodSelector() { }
function NavigationHeader() { }

// Higher-order components - prefix with 'with'
function withAuthentication(Component: FC) { }
function withErrorBoundary(Component: FC) { }

// Render prop components - descriptive name
function DataFetcher({ render }: DataFetcherProps) { }
function MouseTracker({ children }: MouseTrackerProps) { }
```

### Custom Hooks

```typescript
// Always prefix with 'use'
function useAuth() { }
function useLocalStorage<T>(key: string) { }
function usePagination(options: PaginationOptions) { }
function useDebounce<T>(value: T, delay: number) { }

// Query hooks - use 'use' + resource name
function useUser(id: string) { }
function useProducts(filters: ProductFilters) { }
function useOrderHistory(userId: string) { }

// Mutation hooks - use 'use' + action + resource
function useCreateUser() { }
function useUpdateProduct() { }
function useDeleteOrder() { }
```

### Functions

```typescript
// Action functions - start with verb
function fetchUserData() { }
function calculateTotalPrice() { }
function validateEmailFormat() { }
function formatCurrency() { }
function parseApiResponse() { }

// Boolean returning functions - prefix with 'is', 'has', 'can', 'should'
function isValidEmail(email: string): boolean { }
function hasPermission(user: User, action: string): boolean { }
function canEditPost(user: User, post: Post): boolean { }
function shouldRefetch(lastFetched: Date): boolean { }

// Event handlers - prefix with 'handle' or 'on'
function handleSubmit() { }
function handleInputChange() { }
function onUserSelect() { }
function onModalClose() { }

// Transformer functions - 'to' + target format
function toKebabCase(str: string) { }
function toApiFormat(data: FormData) { }
function toDisplayDate(date: Date) { }

// Factory functions - 'create' + object type
function createUser(data: UserData): User { }
function createApiClient(config: Config): ApiClient { }
```

### Variables

```typescript
// Boolean variables - 'is', 'has', 'should', 'can', 'will'
const isAuthenticated = true
const hasErrors = errors.length > 0
const shouldShowModal = isOpen && !isLoading
const canSubmit = isValid && !isSubmitting
const willRedirect = status === 'success'

// Arrays - plural nouns
const users: User[] = []
const selectedItems: Item[] = []
const errorMessages: string[] = []

// Objects - singular nouns
const user: User = { }
const config: Config = { }
const currentState: State = { }

// Counts - suffix with 'Count'
const userCount = users.length
const retryCount = 0
const errorCount = errors.length

// IDs - suffix with 'Id'
const userId = '123'
const orderId = 'abc'
const sessionId = 'xyz'

// Refs - suffix with 'Ref'
const inputRef = useRef<HTMLInputElement>(null)
const containerRef = useRef<HTMLDivElement>(null)

// Timeouts/Intervals - suffix with 'Timeout' or 'Interval'
const fetchTimeout = setTimeout(() => { }, 1000)
const pollingInterval = setInterval(() => { }, 5000)
```

### Constants

```typescript
// API endpoints
const API_BASE_URL = 'https://api.example.com'
const AUTH_ENDPOINT = '/auth/login'
const USERS_ENDPOINT = '/users'

// Configuration values
const MAX_RETRY_ATTEMPTS = 3
const DEFAULT_PAGE_SIZE = 20
const SESSION_TIMEOUT_MS = 30 * 60 * 1000

// Feature flags
const FEATURE_NEW_CHECKOUT = 'feature_new_checkout'
const FEATURE_DARK_MODE = 'feature_dark_mode'

// Error messages
const ERROR_NETWORK_FAILURE = 'Network request failed'
const ERROR_UNAUTHORIZED = 'You are not authorized'

// Validation rules
const MIN_PASSWORD_LENGTH = 8
const MAX_USERNAME_LENGTH = 50
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg']
```

### Types and Interfaces

```typescript
// Entity types - noun
interface User {
  id: string
  email: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
}

// Props interfaces - ComponentName + 'Props'
interface UserProfileProps {
  userId: string
  onEdit?: () => void
}

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

// State types - context + 'State'
interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
}

// Action types - context + 'Action'
type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

// Response types - endpoint + 'Response'
interface LoginResponse {
  user: User
  token: string
}

interface UsersResponse {
  users: User[]
  total: number
  page: number
}

// Request types - endpoint + 'Request'
interface LoginRequest {
  email: string
  password: string
}

interface CreateUserRequest {
  email: string
  name: string
  role: UserRole
}

// Union types - descriptive of options
type ButtonVariant = 'primary' | 'secondary' | 'danger'
type LoadingState = 'idle' | 'loading' | 'success' | 'error'
type SortDirection = 'asc' | 'desc'
```

### Enums

```typescript
// Enum name - PascalCase
// Enum values - UPPER_SNAKE_CASE
enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
  GUEST = 'GUEST',
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
```

### File Naming

```
components/
├── UserProfile/
│   ├── index.tsx              # Main export
│   ├── UserProfile.tsx        # Component
│   ├── UserProfile.test.tsx   # Tests
│   ├── UserProfile.styles.ts  # Styles (if needed)
│   └── types.ts               # Local types
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
hooks/
├── useAuth.ts
├── useLocalStorage.ts
└── usePagination.ts
lib/
├── api/
│   ├── client.ts
│   ├── endpoints.ts
│   └── types.ts
├── utils/
│   ├── formatDate.ts
│   ├── validateEmail.ts
│   └── index.ts
└── constants/
    ├── apiRoutes.ts
    ├── errorMessages.ts
    └── index.ts
```

## Anti-Patterns to Avoid

```typescript
// DON'T: Hungarian notation
const strName = 'John'        // Bad
const name = 'John'           // Good

// DON'T: Abbreviations (except common ones)
const usr = getUser()         // Bad
const user = getUser()        // Good
const idx = items.findIndex() // Acceptable (common)

// DON'T: Single letter variables (except loops)
const d = new Date()          // Bad
const currentDate = new Date() // Good
for (let i = 0; i < 10; i++)  // Acceptable in loops

// DON'T: Prefix interfaces with 'I'
interface IUser { }           // Bad (not idiomatic in TS)
interface User { }            // Good

// DON'T: Type suffix on types
type UserType = { }           // Bad
type User = { }               // Good

// DON'T: Redundant context
class UserClass { }           // Bad
class User { }                // Good

// DON'T: Negative boolean names
const isNotValid = false      // Bad
const isInvalid = false       // Acceptable
const isValid = true          // Better
```

## Domain-Specific Conventions

For this project (financial/educational platform):

```typescript
// Credit/Payment related
interface CreditCard { }
interface PaymentMethod { }
function calculateEMI() { }
function validatePAN() { }

// Course/Lesson related
interface Course { }
interface Lesson { }
interface LessonProgress { }
function markLessonComplete() { }

// User/Auth related
interface UserProfile { }
interface AuthToken { }
function refreshAuthToken() { }
```
