import { useEffect } from 'react';
import { useUiStore } from './store/uiStore';
import { useBranchStore } from './store/branchStore';
import LeftSide from './components/LeftSide';
import Editor from './components/Editor';
import './scss/main.scss';

console.log('App.jsx loaded');

function App() {
  console.log('App component rendering');
  const { isEditor, openEditor } = useUiStore();
  const { fetchAllBranches } = useBranchStore();
  const title = "Welcome to kh best documentation side :)";

  // Fetch all branches on mount
  useEffect(() => {
    fetchAllBranches();
  }, [fetchAllBranches]);

  console.log('App isEditor:', isEditor);

  return (
    <div className="app">
      <h1 className="header-title">{title}</h1>
      {isEditor ? (
        <div className="template">
          <LeftSide />
          <Editor />
        </div>
      ) : (
        <div className="branchInfo">
          <div className="caption">
            <p>
              Either there is no branches or you didn't choosing a branch to view
              so add new branch or edit any available branch{' '}
              <span>by right click on the branch.</span>
            </p>
            <button onClick={openEditor}>Open The Editor</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
