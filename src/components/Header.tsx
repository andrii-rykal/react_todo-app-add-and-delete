import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../management/TodoContext';
import { USER_ID, createTodos, updateTodo } from '../api/todos';

export const Header: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);

  const userId = USER_ID;
  const [title, setTitle] = useState('');

  const completedAll = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && !title) {
      inputRef.current.focus();
    }
  }, [title, todos.length]);

  const hendleAddedTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const data = {
      title: title.trim(),
      userId,
      completed: false,
    };

    if (data.title.trim()) {
      dispatch({
        type: 'tempTodo',
        payload: {
          createdAt: '',
          updatedAt: '',
          id: 0,
          userId,
          title: title.trim(),
          completed: false,
        },
      });

      dispatch({ type: 'isLoading', payload: true });
      dispatch({ type: 'createCurrentId', payload: 0 });

      createTodos(data)
        .then(newTodo => {
          dispatch({
            type: 'addTodo',
            payload: newTodo,
          });
          setTitle('');
        })
        .catch(() => {
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to add a todo',
          });
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus();
          }

          dispatch({ type: 'tempTodo', payload: null });
          dispatch({ type: 'isLoading', payload: false });
          dispatch({ type: 'clearCurrentId' });
        });
    } else {
      dispatch({
        type: 'errorMessage',
        payload: 'Title should not be empty',
      });
      setTitle('');

      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    }
  };

  const hendleChangeStatusAll = () => {
    dispatch({ type: 'isLoading', payload: true });
    todos.forEach(todo => {
      dispatch({ type: 'createCurrentId', payload: todo.id });
      updateTodo({
        id: todo.id,
        title: todo.title,
        completed: !completedAll,
      })
        .then(newTodo => {
          dispatch({
            type: 'changeStatusAll',
            payload: newTodo.completed,
          });
        })
        .catch(() => {
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to update a todo',
          });
        })
        .finally(() => {
          dispatch({ type: 'isLoading', payload: false });
          dispatch({ type: 'clearCurrentId' });
        });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedAll,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all completed"
          onClick={hendleChangeStatusAll}
        />
      )}

      <form onSubmit={hendleAddedTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};