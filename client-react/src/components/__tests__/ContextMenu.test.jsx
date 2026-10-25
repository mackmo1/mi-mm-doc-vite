import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContextMenu from '../ContextMenu';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

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

  it('should render "Add child branch" option for levels 1-4', () => {
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    expect(screen.getByRole('menuitem', { name: 'Add child branch' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete branch' })).toBeInTheDocument();
  });

  it('should NOT render "Add child branch" option for level 5', () => {
    render(<ContextMenu branch={mockBranch} level={5} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('menuitem', { name: 'Add child branch' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete branch' })).toBeInTheDocument();
  });

  it('should focus the first item when opened', () => {
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);

    expect(screen.getByRole('menuitem', { name: 'Add child branch' })).toHaveFocus();
  });

  it('should start a child branch when "Add child branch" is clicked', () => {
    useUiStore.setState({ isNavOpen: true });
    render(<ContextMenu branch={mockBranch} level={2} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add child branch' }));
    
    const uiState = useUiStore.getState();
    expect(uiState.branchType).toBe('branch3'); // level 2 + 1
    expect(uiState.selectedParentId).toBe(mockBranch.id);
    expect(uiState.isEditor).toBe(true);
    expect(uiState.isNavOpen).toBe(false);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show confirmation and delete branch when "Delete branch" is clicked', async () => {
    window.confirm = vi.fn(() => true);
    const deleteBranch = vi.fn(async () => true);
    useBranchStore.setState({ deleteBranch, fetchBranches: vi.fn() });
    
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete branch' }));
    
    expect(window.confirm).toHaveBeenCalledWith('Delete “Test Branch”? This cannot be undone.');
    await waitFor(() => expect(deleteBranch).toHaveBeenCalledWith(1, mockBranch.id));
  });

  it('should close the editor when the branch open in it is deleted', async () => {
    window.confirm = vi.fn(() => true);
    useBranchStore.setState({ deleteBranch: vi.fn(async () => true), fetchBranches: vi.fn() });
    useUiStore.setState({ isEditor: true, isUpdate: true, oldBranch: mockBranch, branchType: 'branch1' });

    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete branch' }));

    await waitFor(() => expect(useUiStore.getState().isEditor).toBe(false));
  });

  it('should not delete if confirmation is cancelled', () => {
    window.confirm = vi.fn(() => false);
    const deleteBranch = vi.fn();
    useBranchStore.setState({ deleteBranch });
    
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete branch' }));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(deleteBranch).not.toHaveBeenCalled();
    // onClose should still be called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should hide menu when action is taken', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    
    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add child branch' }));
    
    const uiState = useUiStore.getState();
    expect(uiState.menuVisibleBranchId).toBe(null);
    expect(uiState.menuVisibleLevel).toBe(null);
  });

  it('should close on Escape and return focus to the trigger', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} triggerRef={{ current: trigger }} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(useUiStore.getState().menuVisibleBranchId).toBe(null);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('should close on an outside click', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });

    render(<ContextMenu branch={mockBranch} level={1} onClose={mockOnClose} />);

    fireEvent.mouseDown(document.body);

    expect(useUiStore.getState().menuVisibleBranchId).toBe(null);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

