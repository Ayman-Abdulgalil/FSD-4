import React, { useState, createContext, useContext } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './App.css';

// ==================== REDUX SETUP (Global Theme State) ====================
const TOGGLE_THEME = 'TOGGLE_THEME';

const toggleTheme = () => ({ type: TOGGLE_THEME });

const initialReduxState = {
  theme: 'light'
};

function rootReducer(state = initialReduxState, action) {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    default:
      return state;
  }
}

const store = createStore(rootReducer);

// ==================== CONTEXT API SETUP (Shared Visibility States) ====================
// List A Context - shared visibility state
const ListAContext = createContext();

function ListAProvider({ children }) {
  const [showItems, setShowItems] = useState(true);
  
  return (
    <ListAContext.Provider value={{ showItems, setShowItems }}>
      {children}
    </ListAContext.Provider>
  );
}

// List B Context - shared visibility state
const ListBContext = createContext();

function ListBProvider({ children }) {
  const [showItems, setShowItems] = useState(true);
  
  return (
    <ListBContext.Provider value={{ showItems, setShowItems }}>
      {children}
    </ListBContext.Provider>
  );
}

// ==================== COMPONENTS ====================

// Individual Todo Item with LOCAL STATE for completion
function TodoItem({ text, onDelete }) {
  const [completed, setCompleted] = useState(false);
  
  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => setCompleted(!completed)}
        className="todo-checkbox"
      />
      <span className="todo-text">{text}</span>
      <button onClick={onDelete} className="btn-delete">×</button>
    </div>
  );
}

// List A - Component 1 (uses shared Context API visibility state)
function ListAComponent1() {
  const { showItems } = useContext(ListAContext);
  
  return (
    <div className="list-component">
      <h3>Component A1</h3>
      <p className="component-note">Visibility controlled by Context A</p>
      {showItems && (
        <div className="component-content">
          <p>✓ This component is visible</p>
          <p>🔗 Shares visibility state with A2 and A3</p>
        </div>
      )}
      {!showItems && <p className="hidden-message">Hidden by Context A</p>}
    </div>
  );
}

// List A - Component 2
function ListAComponent2() {
  const { showItems } = useContext(ListAContext);
  
  return (
    <div className="list-component">
      <h3>Component A2</h3>
      <p className="component-note">Visibility controlled by Context A</p>
      {showItems && (
        <div className="component-content">
          <p>✓ This component is visible</p>
          <p>🔗 Shares visibility state with A1 and A3</p>
        </div>
      )}
      {!showItems && <p className="hidden-message">Hidden by Context A</p>}
    </div>
  );
}

// List A - Component 3
function ListAComponent3() {
  const { showItems } = useContext(ListAContext);
  
  return (
    <div className="list-component">
      <h3>Component A3</h3>
      <p className="component-note">Visibility controlled by Context A</p>
      {showItems && (
        <div className="component-content">
          <p>✓ This component is visible</p>
          <p>🔗 Shares visibility state with A1 and A2</p>
        </div>
      )}
      {!showItems && <p className="hidden-message">Hidden by Context A</p>}
    </div>
  );
}

// List B - Component 1 (uses shared Context API visibility state)
function ListBComponent1() {
  const { showItems } = useContext(ListBContext);
  
  return (
    <div className="list-component">
      <h3>Component B1</h3>
      <p className="component-note">Visibility controlled by Context B</p>
      {showItems && (
        <div className="component-content">
          <p>✓ This component is visible</p>
          <p>🔗 Shares visibility state with B2 and B3</p>
        </div>
      )}
      {!showItems && <p className="hidden-message">Hidden by Context B</p>}
    </div>
  );
}

// List B - Component 2
function ListBComponent2() {
  const { showItems } = useContext(ListBContext);
  
  return (
    <div className="list-component">
      <h3>Component B2</h3>
      <p className="component-note">Visibility controlled by Context B</p>
      {showItems && (
        <div className="component-content">
          <p>✓ This component is visible</p>
          <p>🔗 Shares visibility state with B1 and B3</p>
        </div>
      )}
      {!showItems && <p className="hidden-message">Hidden by Context B</p>}
    </div>
  );
}

// List B - Component 3
function ListBComponent3() {
  const { showItems } = useContext(ListBContext);
  
  return (
    <div className="list-component">
      <h3>Component B3</h3>
      <p className="component-note">Visibility controlled by Context B</p>
      {showItems && (
        <div className="component-content">
          <p>✓ This component is visible</p>
          <p>🔗 Shares visibility state with B1 and B2</p>
        </div>
      )}
      {!showItems && <p className="hidden-message">Hidden by Context B</p>}
    </div>
  );
}

// Context A Controller
function ListAController() {
  const { showItems, setShowItems } = useContext(ListAContext);
  
  return (
    <div className="context-controller context-a">
      <div className="card-header">
        <h2>Context API - Group A</h2>
        <p className="subtitle">Shared visibility state across A1, A2, A3</p>
      </div>
      <button 
        onClick={() => setShowItems(!showItems)} 
        className="btn btn-context-a"
      >
        {showItems ? 'Hide' : 'Show'} All A Components
      </button>
      <div className="components-container">
        <ListAComponent1 />
        <ListAComponent2 />
        <ListAComponent3 />
      </div>
    </div>
  );
}

// Context B Controller
function ListBController() {
  const { showItems, setShowItems } = useContext(ListBContext);
  
  return (
    <div className="context-controller context-b">
      <div className="card-header">
        <h2>Context API - Group B</h2>
        <p className="subtitle">Shared visibility state across B1, B2, B3</p>
      </div>
      <button 
        onClick={() => setShowItems(!showItems)} 
        className="btn btn-context-b"
      >
        {showItems ? 'Hide' : 'Show'} All B Components
      </button>
      <div className="components-container">
        <ListBComponent1 />
        <ListBComponent2 />
        <ListBComponent3 />
      </div>
    </div>
  );
}

// Local State Component (Todo List)
function LocalStateTodos() {
  const [todoInput, setTodoInput] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy groceries' },
    { id: 2, text: 'Walk the dog' },
    { id: 3, text: 'Read a book' }
  ]);
  
  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos([...todos, { id: Date.now(), text: todoInput }]);
      setTodoInput('');
    }
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div className="local-state-section">
      <div className="card-header">
        <h2>Local State - Independent Todos</h2>
        <p className="subtitle">Each todo manages its own completion state</p>
      </div>
      
      <div className="input-group">
        <input
          type="text"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="input-field"
        />
        <button onClick={addTodo} className="btn btn-primary">Add Todo</button>
      </div>
      
      <div className="todos-list">
        <p className="count-badge">{todos.length} todos</p>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Global State Component (Redux Theme)
function GlobalThemeController() {
  const [reduxState, setReduxState] = useState(store.getState());
  
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setReduxState(store.getState());
    });
    return unsubscribe;
  }, []);
  
  return (
    <div className="global-state-section">
      <div className="card-header">
        <h2>Redux Global State - Theme</h2>
        <p className="subtitle">Single source of truth for entire application</p>
      </div>
      
      <div className="theme-display">
        <div className="theme-indicator">
          <span className="theme-icon">{reduxState.theme === 'light' ? '☀️' : '🌙'}</span>
          <h3>Current Theme: <span className="theme-badge">{reduxState.theme}</span></h3>
        </div>
        <button 
          onClick={() => store.dispatch(toggleTheme())} 
          className="btn btn-theme"
        >
          Switch to {reduxState.theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <p className="theme-note">This theme affects the entire application</p>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [reduxState, setReduxState] = useState(store.getState());
  
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setReduxState(store.getState());
    });
    return unsubscribe;
  }, []);
  
  return (
    <div className={`app ${reduxState.theme}`}>
      <header className="app-header">
        <h1>State Management Architecture</h1>
        <p className="header-subtitle">Understanding Redux • Context API • Local State</p>
      </header>
      
      <div className="main-layout">
        <div className="top-section">
          <GlobalThemeController />
        </div>
        
        <div className="middle-section">
          <ListAProvider>
            <ListAController />
          </ListAProvider>
          
          <ListBProvider>
            <ListBController />
          </ListBProvider>
        </div>
        
        <div className="bottom-section">
          <LocalStateTodos />
        </div>
      </div>
      
      <footer className="app-footer">
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color global"></span>
            <span>Redux: Global theme state</span>
          </div>
          <div className="legend-item">
            <span className="legend-color context"></span>
            <span>Context API: Shared visibility in groups</span>
          </div>
          <div className="legend-item">
            <span className="legend-color local"></span>
            <span>Local State: Individual todo completion</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Root Component with Providers
export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}