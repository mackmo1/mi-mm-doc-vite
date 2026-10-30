import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock the Supabase client: queries resolve to empty results unless a test overrides `from`
vi.mock('../lib/supabase', () => {
  const createQuery = (result = { data: [], error: null }) => {
    const query = {}
    ;['select', 'order', 'eq', 'single', 'insert', 'update', 'delete'].forEach((method) => {
      query[method] = vi.fn(() => query)
    })
    query.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject)
    return query
  }

  return {
    supabase: {
      from: vi.fn(() => createQuery()),
      auth: {
        getSession: vi.fn(async () => ({ data: { session: null } })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(async () => ({})),
        getUser: vi.fn()
      }
    }
  }
})

// Mock jQuery and Trumbowyg for tests
const mockTrumbowyg = vi.fn(() => ({
  html: vi.fn(),
}))

window.$ = vi.fn(() => ({
  trumbowyg: mockTrumbowyg,
  html: vi.fn(),
  length: 1
}))
window.jQuery = window.$

// Mock window.confirm for delete confirmations
window.confirm = vi.fn(() => true)

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})
