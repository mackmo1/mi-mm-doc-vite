import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Editor from '../Editor';
import { useUiStore } from '../../store/uiStore';
import { useBranchStore } from '../../store/branchStore';

/**
 * A minimal in-memory stand-in for jQuery + Trumbowyg.
 * It keeps the editor HTML and lets a test fire `tbwchange` like a real edit would.
 */
const createFakeEditor = () => {
  const handlers = {};
  const fake = {
    content: '',
    handlers,
    // Simulate the user typing: update the HTML, then fire Trumbowyg's change event
    type(html) {
      fake.content = html;
      (handlers.tbwchange || []).forEach((fn) => fn());
    },
  };

  const api = {
    trumbowyg: vi.fn((command, value) => {
      if (command === 'html') {
        if (value === undefined) return fake.content;
        fake.content = value;
      }
      return api;
    }),
    on: vi.fn((event, fn) => {
      (handlers[event] ||= []).push(fn);
      return api;
    }),
    off: vi.fn((event) => {
      delete handlers[event];
      return api;
    }),
  };

  return { fake, $: vi.fn(() => api) };
};

const DRAFT_HTML = '<h1 class="branch-name" id="branch-name">My notes</h1><p>Half-written thought</p>';
const AUTOSAVE_DELAY_MS = 1000; // comfortably past any reasonable debounce

describe('Editor local auto-save', () => {
  let fake;
  let originalJquery;
  let titleEl;

  const mountEditor = () => render(<Editor />);
  const typeAndWait = (html) => {
    act(() => fake.type(html));
    act(() => vi.advanceTimersByTime(AUTOSAVE_DELAY_MS));
  };

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();

    originalJquery = window.$;
    const editor = createFakeEditor();
    fake = editor.fake;
    window.$ = editor.$;

    // jsdom does not implement innerText, which the title validation relies on
    titleEl = document.createElement('h1');
    titleEl.id = 'branch-name';
    Object.defineProperty(titleEl, 'innerText', { value: 'My notes', configurable: true });
    document.body.appendChild(titleEl);

    useUiStore.setState({
      isEditor: true,
      isUpdate: false,
      oldBranch: null,
      branchType: 'branch1',
      selectedParentId: null,
    });
    useBranchStore.setState({
      addBranch: vi.fn().mockResolvedValue(true),
      fetchBranches: vi.fn(),
    });
  });

  afterEach(() => {
    titleEl.remove();
    window.$ = originalJquery;
    vi.useRealTimers();
  });

  it('initialises the editor and shows no save status before any edit', () => {
    mountEditor();

    expect(window.$).toHaveBeenCalled();
    expect(fake.handlers.tbwchange).toHaveLength(1);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows "Saved locally" with the saved style after the user types', () => {
    mountEditor();

    typeAndWait(DRAFT_HTML);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Saved locally');
    expect(status).toHaveClass('save-status', 'save-status--saved');
  });

  it('keeps the draft in the browser only, never calling the server', () => {
    mountEditor();

    typeAndWait(DRAFT_HTML);

    expect(useBranchStore.getState().addBranch).not.toHaveBeenCalled();
    const stored = Object.keys(localStorage).map((key) => localStorage.getItem(key));
    expect(stored.some((value) => value.includes('Half-written thought'))).toBe(true);
  });

  it('does not write on every keystroke (debounced)', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    mountEditor();

    act(() => fake.type('<p>a</p>'));
    act(() => fake.type('<p>ab</p>'));
    act(() => fake.type('<p>abc</p>'));
    expect(setItem).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(AUTOSAVE_DELAY_MS));
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(setItem.mock.calls[0][0])).toContain('abc');

    setItem.mockRestore();
  });

  it('restores the draft after a page refresh (unmount and remount)', () => {
    const first = mountEditor();
    typeAndWait(DRAFT_HTML);
    first.unmount();

    // Simulate the refresh: a fresh editor that starts empty
    fake.content = '';
    mountEditor();

    expect(fake.content).toBe(DRAFT_HTML);
  });

  it('does not restore the draft into a different branch context', () => {
    const first = mountEditor();
    typeAndWait(DRAFT_HTML);
    first.unmount();

    // The user now starts a child branch under another parent instead
    useUiStore.setState({ branchType: 'branch2', selectedParentId: 42 });
    fake.content = '';
    mountEditor();

    expect(fake.content).not.toContain('Half-written thought');
  });

  it('clears the draft once the branch is saved to the server', async () => {
    const first = mountEditor();
    typeAndWait(DRAFT_HTML);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create branch/i }));
    });
    expect(useBranchStore.getState().addBranch).toHaveBeenCalledTimes(1);
    first.unmount();

    fake.content = '';
    mountEditor();

    expect(fake.content).not.toContain('Half-written thought');
    expect(Object.keys(localStorage)).toHaveLength(0);
  });
});
