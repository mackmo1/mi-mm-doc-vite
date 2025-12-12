import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BranchItem from '../BranchItem';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { id: 1, title: 'Test', content: '<p>Content</p>' } })),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(() => Promise.resolve({}))
  }
}));

describe('BranchItem Component', () => {
  const mockBranch = { 
    id: 1, 
    title: 'Test Branch', 
    isShow: false, 
    isAdd: false 
  };

  beforeEach(() => {
    // Reset stores
    useUiStore.setState({
      isEditor: true,
      branchType: 'branch1',
      isUpdate: false,
      oldBranch: null,
      selectedParentId: null,
      menuVisibleLevel: null,
      menuVisibleBranchId: null,
      editorRef: null
    });
    useBranchStore.setState({
      branches1: [mockBranch],
      branches2: [],
      branches3: [],
      branches4: [],
      branches5: [],
      loading: false,
      error: null
    });
    vi.clearAllMocks();
  });

  it('should render branch title', () => {
    render(<BranchItem branch={mockBranch} level={1} />);
    
    expect(screen.getByText('Test Branch')).toBeInTheDocument();
  });

  it('should render expand icon for levels 1-4', () => {
    render(<BranchItem branch={mockBranch} level={1} />);
    
    // Should have the caret-right icon (collapsed state)
    expect(document.querySelector('.fa-caret-right')).toBeInTheDocument();
  });

  it('should NOT render expand icon for level 5', () => {
    render(<BranchItem branch={{ ...mockBranch, id: 5 }} level={5} />);
    
    expect(document.querySelector('.fa-caret-right')).not.toBeInTheDocument();
    expect(document.querySelector('.fa-sort-desc')).not.toBeInTheDocument();
  });

  it('should toggle isShow when expand icon is clicked', () => {
    render(<BranchItem branch={mockBranch} level={1} />);
    
    fireEvent.click(document.querySelector('.descIcon'));
    
    const state = useBranchStore.getState();
    expect(state.branches1[0].isShow).toBe(true);
  });

  it('should show sort-desc icon when expanded', () => {
    useBranchStore.setState({
      branches1: [{ ...mockBranch, isShow: true }]
    });
    
    render(<BranchItem branch={{ ...mockBranch, isShow: true }} level={1} />);
    
    expect(document.querySelector('.fa-sort-desc')).toBeInTheDocument();
  });

  it('should show context menu on right-click', () => {
    render(<BranchItem branch={mockBranch} level={1} />);
    
    const title = screen.getByText('Test Branch');
    fireEvent.contextMenu(title);
    
    const uiState = useUiStore.getState();
    expect(uiState.menuVisibleBranchId).toBe(mockBranch.id);
    expect(uiState.menuVisibleLevel).toBe(1);
  });

  it('should render context menu when visible', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    
    render(<BranchItem branch={mockBranch} level={1} />);
    
    expect(screen.getByText('Add new Branch')).toBeInTheDocument();
    expect(screen.getByText('Delete Branch')).toBeInTheDocument();
  });

  it('should render child branches when expanded', () => {
    const parentBranch = { id: 1, title: 'Parent', isShow: true, isAdd: false };
    const childBranch = { id: 10, title: 'Child', branch_id: 1, isShow: false, isAdd: false };
    
    useBranchStore.setState({
      branches1: [parentBranch],
      branches2: [childBranch]
    });
    
    render(<BranchItem branch={parentBranch} level={1} />);
    
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('should not render child branches when collapsed', () => {
    const parentBranch = { id: 1, title: 'Parent', isShow: false, isAdd: false };
    const childBranch = { id: 10, title: 'Child', branch_id: 1, isShow: false, isAdd: false };
    
    useBranchStore.setState({
      branches1: [parentBranch],
      branches2: [childBranch]
    });
    
    render(<BranchItem branch={parentBranch} level={1} />);
    
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
  });

  it('should set update mode when branch title is clicked', async () => {
    render(<BranchItem branch={mockBranch} level={1} />);
    
    fireEvent.click(screen.getByText('Test Branch'));
    
    await waitFor(() => {
      const uiState = useUiStore.getState();
      expect(uiState.isUpdate).toBe(true);
      expect(uiState.branchType).toBe('branch1');
    });
  });
});

