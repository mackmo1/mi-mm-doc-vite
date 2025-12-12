import { useUiStore } from './store/uiStore';
import LeftSide from './components/LeftSide';
import Editor from './components/Editor';

function App() {
  const { isEditor, openEditor } = useUiStore();
  const title = "Welcome to kh best documentation side :)";

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
