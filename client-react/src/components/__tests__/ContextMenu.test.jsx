import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContextMenu from '../ContextMenu';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(() => Promise.resolve({}))
  }
}));

describe('ContextMenu Component', () => {
  const mockBranch = { id: 1, title: 'Test Branch' };
  const mockOnClose = vi.fn();

  beforeEach(() => {
    // Reset stores
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
  });

  it('should render "Add new Branch" option for levels 1-4', () => {
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    expect(screen.getByText('Add new Branch')).toBeInTheDocument();
    expect(screen.getByText('Delete Branch')).toBeInTheDocument();
  });

  it('should NOT render "Add new Branch" option for level 5', () => {
    render(<ContextMenu branch={mockBranch} level={5} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Add new Branch')).not.toBeInTheDocument();
    expect(screen.getByText('Delete Branch')).toBeInTheDocument();
  });

  it('should call setType with child level when "Add new Branch" is clicked', () => {
    render(<ContextMenu branch={mockBranch} level={2} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Add new Branch'));
    
    const uiState = useUiStore.getState();
    expect(uiState.branchType).toBe('branch3'); // level 2 + 1
    expect(uiState.selectedParentId).toBe(mockBranch.id);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show confirmation and delete branch when "Delete Branch" is clicked', async () => {
    window.confirm = vi.fn(() => true);
    
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Delete Branch'));
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this branch?');
  });

  it('should not delete if confirmation is cancelled', () => {
    window.confirm = vi.fn(() => false);
    
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Delete Branch'));
    
    expect(window.confirm).toHaveBeenCalled();
    // onClose should still be called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should hide menu when action is taken', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Add new Branch'));
    
    const uiState = useUiStore.getState();
    expect(uiState.menuVisibleBranchId).toBe(null);
    expect(uiState.menuVisibleLevel).toBe(null);
  });
});

