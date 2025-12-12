import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock jQuery and Trumbowyg for tests
const mockTrumbowyg = vi.fn(() => ({
  html: vi.fn(),
}))

window.$ = vi.fn((selector) => ({
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

