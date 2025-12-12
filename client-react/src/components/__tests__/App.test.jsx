import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

// Mock the child components to isolate App testing
vi.mock('../LeftSide', () => ({
  default: () => <div data-testid="left-side">LeftSide Mock</div>
}));

vi.mock('../Editor', () => ({
  default: () => <div data-testid="editor">Editor Mock</div>
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

describe('App Component', () => {
  beforeEach(() => {
    // Reset stores before each test
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
  });

  it('should render welcome message when editor is closed', () => {
    render(<App />);
    
    expect(screen.getByText('Welcome to kh best documentation side :)')).toBeInTheDocument();
    expect(screen.getByText(/Either there is no branches/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open The Editor' })).toBeInTheDocument();
  });

  it('should open editor when "Open The Editor" button is clicked', () => {
    render(<App />);
    
    const openButton = screen.getByRole('button', { name: 'Open The Editor' });
    fireEvent.click(openButton);
    
    // Check that editor is now visible
    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(screen.getByTestId('left-side')).toBeInTheDocument();
  });

  it('should render editor and left side when isEditor is true', () => {
    useUiStore.setState({ isEditor: true });
    
    render(<App />);
    
    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(screen.getByTestId('left-side')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open The Editor' })).not.toBeInTheDocument();
  });

  it('should call fetchAllBranches on mount', async () => {
    const fetchAllBranches = vi.fn();
    useBranchStore.setState({ fetchAllBranches });
    
    render(<App />);
    
    // fetchAllBranches should be called on mount
    expect(fetchAllBranches).toHaveBeenCalled();
  });
});

