import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';
import { useAuthStore } from '../../store/authStore';

// Mock the child components to isolate App testing
vi.mock('../LeftSide', () => ({
  default: () => <div data-testid="left-side">LeftSide Mock</div>
}));

vi.mock('../Editor', () => ({
  default: () => <div data-testid="editor">Editor Mock</div>
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
      error: null,
      fetchAllBranches: vi.fn()
    });
    useAuthStore.setState({
      user: { id: 'u1', email: 'ada@example.com', username: 'Ada' },
      isAuthenticated: true,
      initialized: true,
      initialize: vi.fn(),
      logout: vi.fn(async () => {})
    });
  });

  it('should render the KH-Doc header and account controls', () => {
    render(<App />);

    expect(screen.getByText('KH-Doc')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
    expect(screen.queryByText(/Welcome to kh best documentation/i)).not.toBeInTheDocument();
  });

  it('should render the first-use empty state when there are no branches', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Your notes begin here.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create your first branch' })).toBeInTheDocument();
    expect(screen.getByTestId('left-side')).toBeInTheDocument();
  });

  it('should open the editor from the first-use empty state', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Create your first branch' }));

    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(useUiStore.getState().branchType).toBe('branch1');
  });

  it('should prompt to select a branch when branches exist', () => {
    useBranchStore.setState({ branches1: [{ id: 1, title: 'Main', isShow: false, isAdd: false }] });

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Select a branch' })).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByRole('button', { name: 'New branch' })).toBeInTheDocument();
  });

  it('should show a loading state while branches load', () => {
    useBranchStore.setState({ loading: true });

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading your branches…');
  });

  it('should render editor and left side when isEditor is true', () => {
    useUiStore.setState({ isEditor: true });
    
    render(<App />);
    
    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(screen.getByTestId('left-side')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create your first branch' })).not.toBeInTheDocument();
  });

  it('should call fetchAllBranches on mount', async () => {
    const fetchAllBranches = vi.fn();
    useBranchStore.setState({ fetchAllBranches });
    
    render(<App />);
    
    // fetchAllBranches should be called on mount
    expect(fetchAllBranches).toHaveBeenCalled();
  });

  it('should log out and clear branches', async () => {
    const logout = vi.fn(async () => {});
    const clearAllBranches = vi.fn();
    useAuthStore.setState({ logout });
    useBranchStore.setState({ clearAllBranches });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(clearAllBranches).toHaveBeenCalled();
    });
  });

  it('should open the mobile library and account menu from the header', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Open library' }));
    expect(useUiStore.getState().isNavOpen).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByRole('menu', { name: 'Account' })).toHaveTextContent('ada@example.com');
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeInTheDocument();
  });

  it('should render the sign-in screen when not authenticated', () => {
    useAuthStore.setState({ isAuthenticated: false, user: null });

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
