import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { useUiStore } from '../store/uiStore';
import { useBranchStore } from '../store/branchStore';
import api from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock Editor component since it relies on jQuery/Trumbowyg
vi.mock('../components/Editor', () => ({
  default: () => (
    <div data-testid="editor-mock">
      <textarea data-testid="editor-textarea" />
      <button data-testid="save-button">Save</button>
    </div>
  )
}));

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
      editorRef: null
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
    vi.clearAllMocks();
    
    // Default API mock responses
    api.get.mockImplementation((url) => {
      if (url.includes('/branches')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });
  });

  describe('Workflow: Open Editor and Create New Branch', () => {
    it('should open editor from welcome screen', async () => {
      render(<App />);
      
      // Initial state: welcome screen
      expect(screen.getByText('Welcome to kh best documentation side :)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Open The Editor' })).toBeInTheDocument();
      
      // Click to open editor
      fireEvent.click(screen.getByRole('button', { name: 'Open The Editor' }));
      
      // Editor should now be visible
      await waitFor(() => {
        expect(screen.getByTestId('editor-mock')).toBeInTheDocument();
      });
    });

    it('should load branches when app mounts', async () => {
      api.get.mockImplementation((url) => {
        if (url === '/branches1') {
          return Promise.resolve({ 
            data: [{ id: 1, title: 'Main Branch', content: '<p>Content</p>' }] 
          });
        }
        return Promise.resolve({ data: [] });
      });

      render(<App />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/branches1');
        expect(api.get).toHaveBeenCalledWith('/branches2');
        expect(api.get).toHaveBeenCalledWith('/branches3');
        expect(api.get).toHaveBeenCalledWith('/branches4');
        expect(api.get).toHaveBeenCalledWith('/branches5');
      });
    });
  });

  describe('Workflow: Navigate Branch Tree', () => {
    it('should display branches in the sidebar when editor is open', async () => {
      // Set up branches
      api.get.mockImplementation((url) => {
        if (url === '/branches1') {
          return Promise.resolve({ 
            data: [
              { id: 1, title: 'Documentation', content: '<p>Docs</p>' },
              { id: 2, title: 'Tutorials', content: '<p>Tutorials</p>' }
            ] 
          });
        }
        return Promise.resolve({ data: [] });
      });

      // Open editor first
      useUiStore.setState({ isEditor: true, branchType: 'branch1' });
      
      render(<App />);

      await waitFor(() => {
        const state = useBranchStore.getState();
        expect(state.branches1).toHaveLength(2);
      });
    });
  });

  describe('Workflow: Close Editor', () => {
    it('should close editor and return to welcome screen', async () => {
      useUiStore.setState({ isEditor: true, branchType: 'branch1' });
      
      render(<App />);
      
      // Click close button
      fireEvent.click(screen.getByRole('button', { name: 'Close The Editor' }));
      
      // Should return to welcome screen
      await waitFor(() => {
        expect(screen.getByText('Welcome to kh best documentation side :)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open The Editor' })).toBeInTheDocument();
      });
    });
  });

  describe('State Management Integration', () => {
    it('should update UI when store state changes', async () => {
      render(<App />);
      
      // Initially closed
      expect(screen.queryByTestId('editor-mock')).not.toBeInTheDocument();
      
      // Update store directly
      useUiStore.setState({ isEditor: true });
      
      // UI should update
      await waitFor(() => {
        expect(screen.getByTestId('editor-mock')).toBeInTheDocument();
      });
    });

    it('should maintain state consistency across components', async () => {
      useUiStore.setState({ isEditor: true, branchType: 'branch1' });
      
      render(<App />);
      
      // Click "Add New Main Branch"
      fireEvent.click(screen.getByText('Add New Main Branch'));
      
      // State should be reset to add mode
      const uiState = useUiStore.getState();
      expect(uiState.branchType).toBe('branch1');
      expect(uiState.isUpdate).toBe(false);
      expect(uiState.oldBranch).toBe(null);
    });
  });
});

