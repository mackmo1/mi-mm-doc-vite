import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LeftSide from '../LeftSide';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

// Mock BranchItem component
vi.mock('../BranchItem', () => ({
  default: ({ branch, level }) => (
    <li data-testid={`branch-item-${branch.id}`}>
      {branch.title} (Level {level})
    </li>
  )
}));

describe('LeftSide Component', () => {
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

  it('should render the library label and "New branch" button', () => {
    render(<LeftSide />);
    
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New branch' })).toBeInTheDocument();
  });

  it('should render branch items for level 1 branches', () => {
    useBranchStore.setState({
      branches1: [
        { id: 1, title: 'First Branch', isShow: false, isAdd: false },
        { id: 2, title: 'Second Branch', isShow: false, isAdd: false }
      ]
    });
    
    render(<LeftSide />);
    
    expect(screen.getByTestId('branch-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('branch-item-2')).toBeInTheDocument();
  });

  it('should start a new main branch when "New branch" is clicked', () => {
    useUiStore.setState({ branchType: 'branch3', selectedParentId: 5, isNavOpen: true });
    
    render(<LeftSide />);
    
    fireEvent.click(screen.getByRole('button', { name: 'New branch' }));
    
    const uiState = useUiStore.getState();
    expect(uiState.branchType).toBe('branch1');
    expect(uiState.selectedParentId).toBe(null);
    expect(uiState.isEditor).toBe(true);
    expect(uiState.isNavOpen).toBe(false);
  });

  it('should close the mobile drawer with the close button', () => {
    useUiStore.setState({ isNavOpen: true });

    render(<LeftSide />);

    fireEvent.click(screen.getByRole('button', { name: 'Close library' }));

    expect(useUiStore.getState().isNavOpen).toBe(false);
  });

  it('should close the mobile drawer on Escape', () => {
    useUiStore.setState({ isNavOpen: true });

    render(<LeftSide />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(useUiStore.getState().isNavOpen).toBe(false);
  });

  it('should hide context menu when sidebar is clicked', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    useBranchStore.setState({
      branches1: [{ id: 1, title: 'Test', isShow: false, isAdd: true }]
    });
    
    render(<LeftSide />);
    
    // Click on the sidebar container
    fireEvent.click(screen.getByRole('complementary', { name: 'Library' }));
    
    const uiState = useUiStore.getState();
    expect(uiState.menuVisibleBranchId).toBe(null);
    expect(uiState.menuVisibleLevel).toBe(null);
  });

  it('should show an empty message when branches1 is empty', () => {
    useBranchStore.setState({ branches1: [] });
    
    render(<LeftSide />);
    
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.getByText('No branches yet.')).toBeInTheDocument();
  });

  it('should show a loading message while branches load', () => {
    useBranchStore.setState({ branches1: [], loading: true });

    render(<LeftSide />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading your branches…');
  });

  it('should show an error with a retry action', () => {
    const fetchAllBranches = vi.fn();
    useBranchStore.setState({ error: 'Network error', fetchAllBranches });

    render(<LeftSide />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong while syncing your branches.');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(fetchAllBranches).toHaveBeenCalled();
    expect(useBranchStore.getState().error).toBe(null);
  });
});

