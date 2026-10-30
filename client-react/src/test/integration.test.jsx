import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import App from '../App';
import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

// Mock Editor component since it relies on jQuery/Trumbowyg
vi.mock('../components/Editor', () => ({
  default: () => (
    <div data-testid="editor-mock">
      <textarea data-testid="editor-textarea" />
      <button data-testid="save-button">Save</button>
    </div>
  )
}));

// Build a chainable Supabase query that resolves to the given result
const mockQuery = (result) => {
  const query = {};
  ['select', 'order', 'eq', 'single', 'insert', 'update', 'delete'].forEach((method) => {
    query[method] = vi.fn(() => query);
  });
  query.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return query;
};

// Serve branch rows per table from the mocked Supabase client
const mockTables = (tables) => {
  supabase.from.mockImplementation((table) => {
    const rows = tables[table] || [];
    const query = mockQuery({ data: rows, error: null });
    query.eq = vi.fn((column, value) => {
      query.then = (resolve, reject) =>
        Promise.resolve({ data: rows.find(row => row[column] === value) || null, error: null }).then(resolve, reject);
      return query;
    });
    return query;
  });
};

// Render the app and wait for the initial branch fetch to settle
const renderApp = async () => {
  render(<App />);
  await waitFor(() => expect(useBranchStore.getState().loading).toBe(false));
};

describe('Integration Tests - User Workflows', () => {
  beforeEach(() => {
    // Reset all stores
    useUiStore.setState({
      isEditor: false,
      branchType: null,
      isUpdate: false,
      oldBranch: null,
      selectedParentId: null,
      menuVisibleLevel: null,
      menuVisibleBranchId: null,
      editorRef: null,
      isNavOpen: false
    });
    useBranchStore.setState({
      branches1: [],
      branches2: [],
      branches3: [],
      branches4: [],
      branches5: [],
      loading: false,
      error: null
    });
    useAuthStore.setState({
      user: { id: 'u1', email: 'ada@example.com', username: 'Ada' },
      isAuthenticated: true,
      initialized: true,
      initialize: vi.fn()
    });
    mockTables({});
  });

  describe('Workflow: Open Editor and Create New Branch', () => {
    it('should open editor from the first-use empty state', async () => {
      render(<App />);
      
      // Initial state: no branches
      expect(await screen.findByRole('heading', { name: 'Your notes begin here.' })).toBeInTheDocument();
      
      fireEvent.click(screen.getByRole('button', { name: 'Create your first branch' }));
      
      // Editor should now be visible
      await waitFor(() => {
        expect(screen.getByTestId('editor-mock')).toBeInTheDocument();
      });
    });

    it('should load branches from all five levels when app mounts', async () => {
      render(<App />);

      await waitFor(() => {
        [1, 2, 3, 4, 5].forEach((level) => {
          expect(supabase.from).toHaveBeenCalledWith(`branches${level}`);
        });
      });
    });
  });

  describe('Workflow: Navigate Branch Tree', () => {
    it('should display branches and expand children in the sidebar', async () => {
      mockTables({
        branches1: [
          { id: 1, title: 'Documentation', content: '<p>Docs</p>' },
          { id: 2, title: 'Tutorials', content: '<p>Tutorials</p>' }
        ],
        branches2: [{ id: 10, branch_id: 1, title: 'Getting started', content: '' }]
      });

      render(<App />);

      expect(await screen.findByRole('button', { name: 'Documentation' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tutorials' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Getting started' })).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Expand Documentation' }));

      expect(screen.getByRole('button', { name: 'Getting started' })).toBeInTheDocument();
    });

    it('should open a branch in the editor and mark it as current', async () => {
      const branch = { id: 1, title: 'Documentation', content: '<p>Docs</p>' };
      mockTables({ branches1: [branch] });

      render(<App />);

      fireEvent.click(await screen.findByRole('button', { name: 'Documentation' }));

      await waitFor(() => {
        expect(screen.getByTestId('editor-mock')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Documentation' })).toHaveAttribute('aria-current', 'page');
      });
    });
  });

  describe('Workflow: Close Editor', () => {
    it('should return to the empty state when the editor closes', async () => {
      useUiStore.setState({ isEditor: true, branchType: 'branch1' });
      
      await renderApp();
      expect(screen.getByTestId('editor-mock')).toBeInTheDocument();

      act(() => useUiStore.getState().closeEditor());
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Your notes begin here.' })).toBeInTheDocument();
      });
    });
  });

  describe('State Management Integration', () => {
    it('should update UI when store state changes', async () => {
      await renderApp();
      
      // Initially closed
      expect(screen.queryByTestId('editor-mock')).not.toBeInTheDocument();
      
      // Update store directly
      act(() => useUiStore.setState({ isEditor: true }));
      
      // UI should update
      await waitFor(() => {
        expect(screen.getByTestId('editor-mock')).toBeInTheDocument();
      });
    });

    it('should maintain state consistency across components', async () => {
      useUiStore.setState({ isEditor: true, branchType: 'branch3', isUpdate: true, oldBranch: { id: 9 } });
      
      await renderApp();
      
      // Click "New branch" in the sidebar
      const sidebar = screen.getByRole('complementary', { name: 'Library' });
      fireEvent.click(within(sidebar).getByRole('button', { name: 'New branch' }));
      
      // State should be reset to add mode
      const uiState = useUiStore.getState();
      expect(uiState.branchType).toBe('branch1');
      expect(uiState.isUpdate).toBe(false);
      expect(uiState.oldBranch).toBe(null);
    });
  });
});
