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

  it('shows "Draft saved" with the saved style after the user types', () => {
    mountEditor();

    typeAndWait(DRAFT_HTML);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Draft saved');
    expect(status).toHaveClass('save-status', 'save-status--saved');
  });

  it('explains in plain words that the draft is only on this device', () => {
    mountEditor();

    typeAndWait(DRAFT_HTML);

    expect(screen.getByRole('status')).toHaveAttribute('title', expect.stringMatching(/this device/i));
  });

  it('shows "Saved" (not "Draft saved") once the server confirms the save', async () => {
    mountEditor();
    typeAndWait(DRAFT_HTML);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create branch/i }));
    });

    const status = screen.getByRole('status');
    expect(status).not.toHaveTextContent('Draft saved');
    expect(status).toHaveTextContent(/created/i);
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

  describe('when editing an existing branch', () => {
    const SERVER_HTML = '<h1 class="branch-name" id="branch-name">My notes</h1><p>Server version</p>';

    beforeEach(() => {
      useUiStore.setState({
        isUpdate: true,
        oldBranch: { id: 7, title: 'My notes', content: SERVER_HTML },
        branchType: 'branch1',
      });
    });

    it('shows the server content when there is no local draft', () => {
      mountEditor();

      expect(fake.content).toBe(SERVER_HTML);
    });

    it('restores the local draft over the server content after a refresh', () => {
      const first = mountEditor();
      typeAndWait(DRAFT_HTML);
      first.unmount();

      fake.content = '';
      mountEditor();

      expect(fake.content).toBe(DRAFT_HTML);
    });

    it('keeps drafts of different branches separate', () => {
      const first = mountEditor();
      typeAndWait(DRAFT_HTML);
      first.unmount();

      useUiStore.setState({ oldBranch: { id: 8, title: 'Other', content: '<p>Other server</p>' } });
      fake.content = '';
      mountEditor();

      expect(fake.content).toBe('<p>Other server</p>');
    });
  });

  it('does not lose edits made just before leaving the page', () => {
    const first = mountEditor();

    act(() => fake.type(DRAFT_HTML)); // no time passes: the debounce has not fired yet
    first.unmount();

    fake.content = '';
    mountEditor();

    expect(fake.content).toBe(DRAFT_HTML);
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

  describe('server auto-save of an existing branch', () => {
    const SERVER_SAVE_DELAY_MS = 3000;
    let updateBranch;

    // Advance fake time and let the awaited save settle
    const advance = (ms) => act(async () => { vi.advanceTimersByTime(ms); });

    beforeEach(() => {
      updateBranch = vi.fn().mockResolvedValue({ id: 7 });
      useUiStore.setState({
        isUpdate: true,
        oldBranch: { id: 7, title: 'My notes', content: '<p>Server version</p>' },
        branchType: 'branch1',
      });
      useBranchStore.setState({ updateBranch });
    });

    it('saves to the server after 3 seconds of inactivity', async () => {
      mountEditor();

      act(() => fake.type(DRAFT_HTML));
      await advance(SERVER_SAVE_DELAY_MS - 100);
      expect(updateBranch).not.toHaveBeenCalled();

      await advance(200);
      expect(updateBranch).toHaveBeenCalledTimes(1);
      expect(updateBranch).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ id: 7, title: 'My notes', content: DRAFT_HTML })
      );
    });

    it('waits again while the user keeps typing, then saves once', async () => {
      mountEditor();

      act(() => fake.type('<p>a</p>'));
      await advance(2000);
      act(() => fake.type('<p>ab</p>'));
      await advance(2000);
      expect(updateBranch).not.toHaveBeenCalled();

      await advance(1100);
      expect(updateBranch).toHaveBeenCalledTimes(1);
      expect(updateBranch).toHaveBeenCalledWith(1, expect.objectContaining({ content: '<p>ab</p>' }));
    });

    it('shows "Saving…" and then "Saved" once the server confirms', async () => {
      let confirmSave;
      updateBranch.mockReturnValue(new Promise((resolve) => { confirmSave = resolve; }));
      mountEditor();

      act(() => fake.type(DRAFT_HTML));
      await advance(SERVER_SAVE_DELAY_MS + 100);
      expect(screen.getByRole('status')).toHaveTextContent('Saving');

      await act(async () => confirmSave({ id: 7 }));
      expect(screen.getByRole('status')).toHaveTextContent(/^Saved$/);
    });

    it('saves pending edits straight away when the user leaves the editor', () => {
      const first = mountEditor();

      act(() => fake.type(DRAFT_HTML)); // no time passes
      first.unmount();

      expect(updateBranch).toHaveBeenCalledTimes(1);
      expect(updateBranch).toHaveBeenCalledWith(1, expect.objectContaining({ content: DRAFT_HTML }));
    });

    it('clears the local draft once the server confirms', async () => {
      mountEditor();

      act(() => fake.type(DRAFT_HTML));
      await advance(SERVER_SAVE_DELAY_MS + 100);

      expect(updateBranch).toHaveBeenCalledTimes(1);
      expect(Object.keys(localStorage)).toHaveLength(0);
    });

    it('keeps the local draft and shows an error when the server save fails', async () => {
      updateBranch.mockResolvedValue(null);
      mountEditor();

      act(() => fake.type(DRAFT_HTML));
      await advance(SERVER_SAVE_DELAY_MS + 100);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      const stored = Object.keys(localStorage).map((key) => localStorage.getItem(key));
      expect(stored.some((value) => value.includes('Half-written thought'))).toBe(true);
    });

    it('keeps text typed while a save is still in flight', async () => {
      let confirmSave;
      updateBranch.mockReturnValue(new Promise((resolve) => { confirmSave = resolve; }));
      mountEditor();

      act(() => fake.type('<p>first</p>'));
      await advance(SERVER_SAVE_DELAY_MS + 100); // save is now waiting on the server

      act(() => fake.type('<p>second</p>'));
      await advance(1000);
      await act(async () => confirmSave({ id: 7 }));

      const stored = Object.keys(localStorage).map((key) => localStorage.getItem(key));
      expect(stored.some((value) => value.includes('second'))).toBe(true);
    });

    it('does not auto-save a new, unsaved branch to the server', async () => {
      useUiStore.setState({ isUpdate: false, oldBranch: null });
      mountEditor();

      act(() => fake.type(DRAFT_HTML));
      await advance(SERVER_SAVE_DELAY_MS * 2);

      expect(updateBranch).not.toHaveBeenCalled();
      expect(useBranchStore.getState().addBranch).not.toHaveBeenCalled();
    });

    it('stays quiet when the title is too short to save', async () => {
      Object.defineProperty(titleEl, 'innerText', { value: 'Hi', configurable: true });
      mountEditor();

      act(() => fake.type(DRAFT_HTML));
      await advance(SERVER_SAVE_DELAY_MS + 100);

      expect(updateBranch).not.toHaveBeenCalled();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
