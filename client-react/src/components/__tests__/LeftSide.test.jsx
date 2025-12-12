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

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
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

  it('should render "Add New Main Branch" header', () => {
    render(<LeftSide />);
    
    expect(screen.getByText('Add New Main Branch')).toBeInTheDocument();
  });

  it('should render "Close The Editor" button', () => {
    render(<LeftSide />);
    
    expect(screen.getByRole('button', { name: 'Close The Editor' })).toBeInTheDocument();
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

  it('should call resetToAdd when "Add New Main Branch" is clicked', () => {
    useUiStore.setState({ branchType: 'branch3', selectedParentId: 5 });
    
    render(<LeftSide />);
    
    fireEvent.click(screen.getByText('Add New Main Branch'));
    
    const uiState = useUiStore.getState();
    expect(uiState.branchType).toBe('branch1');
    expect(uiState.selectedParentId).toBe(null);
  });

  it('should call closeEditor when "Close The Editor" button is clicked', () => {
    useUiStore.setState({ isEditor: true });
    
    render(<LeftSide />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Close The Editor' }));
    
    const uiState = useUiStore.getState();
    expect(uiState.isEditor).toBe(false);
  });

  it('should hide context menu when sidebar is clicked', () => {
    useUiStore.setState({ menuVisibleBranchId: 1, menuVisibleLevel: 1 });
    useBranchStore.setState({
      branches1: [{ id: 1, title: 'Test', isShow: false, isAdd: true }]
    });
    
    render(<LeftSide />);
    
    // Click on the sidebar container
    fireEvent.click(screen.getByText('Add New Main Branch').closest('.left'));
    
    const uiState = useUiStore.getState();
    expect(uiState.menuVisibleBranchId).toBe(null);
    expect(uiState.menuVisibleLevel).toBe(null);
  });

  it('should not render branch list when branches1 is empty', () => {
    useBranchStore.setState({ branches1: [] });
    
    render(<LeftSide />);
    
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});

