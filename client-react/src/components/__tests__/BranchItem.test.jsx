import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BranchItem from '../BranchItem';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

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

  it('should render an expand control only for branches with children', () => {
    useBranchStore.setState({
      branches2: [{ id: 10, title: 'Child', branch_id: 1, isShow: false, isAdd: false }]
    });

    render(<BranchItem branch={mockBranch} level={1} />);

    const toggle = screen.getByRole('button', { name: 'Expand Test Branch' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('should NOT render an expand control for a branch without children', () => {
    render(<BranchItem branch={mockBranch} level={1} />);

    expect(screen.queryByRole('button', { name: /Expand|Collapse/ })).not.toBeInTheDocument();
  });

  it('should NOT render an expand control for level 5', () => {
    render(<BranchItem branch={{ ...mockBranch, id: 5 }} level={5} />);

    expect(screen.queryByRole('button', { name: /Expand|Collapse/ })).not.toBeInTheDocument();
  });

  it('should toggle isShow when the expand control is clicked', () => {
    useBranchStore.setState({
      branches2: [{ id: 10, title: 'Child', branch_id: 1, isShow: false, isAdd: false }]
    });

    render(<BranchItem branch={mockBranch} level={1} />);

    fireEvent.click(screen.getByRole('button', { name: 'Expand Test Branch' }));

    const state = useBranchStore.getState();
    expect(state.branches1[0].isShow).toBe(true);
  });

  it('should show a collapse control when expanded', () => {
    const expanded = { ...mockBranch, isShow: true };
    useBranchStore.setState({
      branches1: [expanded],
      branches2: [{ id: 10, title: 'Child', branch_id: 1, isShow: false, isAdd: false }]
    });

    render(<BranchItem branch={expanded} level={1} />);

    expect(screen.getByRole('button', { name: 'Collapse Test Branch' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('should show context menu on right-click', () => {
    render(<BranchItem branch={mockBranch} level={1} />);
    
    const title = screen.getByText('Test Branch');
    fireEvent.contextMenu(title);
    
    const uiState = useUiStore.getState();
    expect(uiState.menuVisibleBranchId).toBe(mockBranch.id);
    expect(uiState.menuVisibleLevel).toBe(1);
  });

  it('should toggle the menu with the "More actions" button', () => {
    render(<BranchItem branch={mockBranch} level={1} />);

    const moreButton = screen.getByRole('button', { name: 'More actions for Test Branch' });
    fireEvent.click(moreButton);
    expect(useUiStore.getState().menuVisibleBranchId).toBe(mockBranch.id);
    expect(screen.getByRole('menuitem', { name: 'Add child branch' })).toBeInTheDocument();
    expect(moreButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(moreButton);
    expect(useUiStore.getState().menuVisibleBranchId).toBe(null);
  });

  it('should render context menu when visible', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    
    render(<BranchItem branch={mockBranch} level={1} />);
    
    expect(screen.getByRole('menuitem', { name: 'Add child branch' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete branch' })).toBeInTheDocument();
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

  it('should open the branch in the editor when its title is clicked', async () => {
    const fullBranch = { id: 1, title: 'Test Branch', content: '<p>Content</p>' };
    const fetchBranch = vi.fn(async () => fullBranch);
    useBranchStore.setState({ fetchBranch });
    useUiStore.setState({ isEditor: false, isNavOpen: true });

    render(<BranchItem branch={mockBranch} level={1} />);
    
    fireEvent.click(screen.getByText('Test Branch'));
    
    await waitFor(() => {
      const uiState = useUiStore.getState();
      expect(uiState.isUpdate).toBe(true);
      expect(uiState.isEditor).toBe(true);
      expect(uiState.branchType).toBe('branch1');
      expect(uiState.oldBranch).toEqual(fullBranch);
      expect(uiState.isNavOpen).toBe(false);
    });
    expect(fetchBranch).toHaveBeenCalledWith(1, 1);
  });

  it('should mark the branch open in the editor as current', () => {
    useUiStore.setState({ isUpdate: true, oldBranch: { id: 1 }, branchType: 'branch1' });

    render(<BranchItem branch={mockBranch} level={1} />);

    expect(screen.getByRole('button', { name: 'Test Branch' })).toHaveAttribute('aria-current', 'page');
  });

  it('should not mark a same-id branch on another level as current', () => {
    useUiStore.setState({ isUpdate: true, oldBranch: { id: 1 }, branchType: 'branch2' });

    render(<BranchItem branch={mockBranch} level={1} />);

    expect(screen.getByRole('button', { name: 'Test Branch' })).not.toHaveAttribute('aria-current');
  });
});

