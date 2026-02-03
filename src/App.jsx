import React, { useState, createContext, useContext, useReducer } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './App.css';

// ==================== REDUX SETUP ====================
// Redux Action Types
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';

// Redux Action Creators
const incrementCounter = () => ({ type: INCREMENT_COUNTER });
const decrementCounter = () => ({ type: DECREMENT_COUNTER });
const addTodo = (text) => ({ type: ADD_TODO, payload: text });
const toggleTodo = (id) => ({ type: TOGGLE_TODO, payload: id });
const deleteTodo = (id) => ({ type: DELETE_TODO, payload: id });

// Redux Reducer
const initialReduxState = {
  counter: 0,
  todos: []
};

function rootReducer(state = initialReduxState, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return { ...state, counter: state.counter + 1 };
    case DECREMENT_COUNTER:
      return { ...state, counter: state.counter - 1 };
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
}

// Create Redux Store
const store = createStore(rootReducer);

// ==================== CONTEXT API SETUP ====================
// Theme Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// User Context with useReducer
const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, name: action.payload.name, email: action.payload.email };
    case 'CLEAR_USER':
      return { name: '', email: '' };
    default:
      return state;
  }
};

function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, { name: '', email: '' });
  
  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// ==================== COMPONENTS ====================

// Component using LOCAL STATE (useState)
function LocalStateComponent() {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(true);
  
  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, { id: Date.now(), text: inputValue }]);
      setInputValue('');
    }
  };
  
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  return (
    <div className="component-card local-state">
      <div className="card-header">
        <h2>📌 Local State (useState)</h2>
        <p className="subtitle">State lives within this component only</p>
      </div>
      
      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add an item..."
          className="input-field"
        />
        <button onClick={addItem} className="btn btn-primary">Add</button>
        <button onClick={() => setShowItems(!showItems)} className="btn btn-secondary">
          {showItems ? 'Hide' : 'Show'} Items
        </button>
      </div>
      
      {showItems && (
        <div className="items-list">
          <p className="count-badge">{items.length} items</p>
          {items.map(item => (
            <div key={item.id} className="item">
              <span>{item.text}</span>
              <button onClick={() => removeItem(item.id)} className="btn-delete">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component using REDUX
function ReduxComponent() {
  const [todoInput, setTodoInput] = useState('');
  const [reduxState, setReduxState] = useState(store.getState());
  
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setReduxState(store.getState());
    });
    return unsubscribe;
  }, []);
  
  const handleAddTodo = () => {
    if (todoInput.trim()) {
      store.dispatch(addTodo(todoInput));
      setTodoInput('');
    }
  };
  
  return (
    <div className="component-card redux-state">
      <div className="card-header">
        <h2>🔴 Redux Global State</h2>
        <p className="subtitle">Centralized state with predictable updates</p>
      </div>
      
      <div className="counter-section">
        <h3>Counter: {reduxState.counter}</h3>
        <div className="button-group">
          <button onClick={() => store.dispatch(incrementCounter())} className="btn btn-success">
            + Increment
          </button>
          <button onClick={() => store.dispatch(decrementCounter())} className="btn btn-danger">
            - Decrement
          </button>
        </div>
      </div>
      
      <div className="input-group">
        <input
          type="text"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Add a Redux todo..."
          className="input-field"
        />
        <button onClick={handleAddTodo} className="btn btn-primary">Add Todo</button>
      </div>
      
      <div className="items-list">
        <p className="count-badge">{reduxState.todos.length} todos</p>
        {reduxState.todos.map(todo => (
          <div key={todo.id} className={`item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => store.dispatch(toggleTodo(todo.id))}
            />
            <span>{todo.text}</span>
            <button onClick={() => store.dispatch(deleteTodo(todo.id))} className="btn-delete">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component using CONTEXT API
function ContextComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, dispatch } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSetUser = () => {
    if (name.trim() && email.trim()) {
      dispatch({ type: 'SET_USER', payload: { name, email } });
      setName('');
      setEmail('');
    }
  };
  
  return (
    <div className="component-card context-state">
      <div className="card-header">
        <h2>🌐 Context API Global State</h2>
        <p className="subtitle">Shared state without prop drilling</p>
      </div>
      
      <div className="theme-section">
        <h3>Current Theme: <span className="theme-badge">{theme}</span></h3>
        <button onClick={toggleTheme} className="btn btn-accent">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      
      <div className="user-section">
        <h3>User Profile</h3>
        {user.name ? (
          <div className="user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => dispatch({ type: 'CLEAR_USER' })} className="btn btn-danger">
              Clear User
            </button>
          </div>
        ) : (
          <div className="input-group vertical">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              className="input-field"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email..."
              className="input-field"
            />
            <button onClick={handleSetUser} className="btn btn-primary">Set User</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>State Management Comparison</h1>
        <p className="header-subtitle">Redux • Context API • Local State</p>
      </header>
      
      <div className="info-section">
        <div className="info-card">
          <h3>🎯 Experiment Overview</h3>
          <ul>
            <li><strong>Local State:</strong> Component-specific data using useState</li>
            <li><strong>Context API:</strong> Shared state across components (theme, user)</li>
            <li><strong>Redux:</strong> Centralized global state with predictable actions</li>
          </ul>
        </div>
      </div>
      
      <div className="components-grid">
        <LocalStateComponent />
        <ReduxComponent />
        <ContextComponent />
      </div>
      
      <footer className="app-footer">
        <p>Interact with each component to see how different state management approaches work!</p>
      </footer>
    </div>
  );
}

// Root Component with Providers
export default function Root() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </Provider>
  );
}