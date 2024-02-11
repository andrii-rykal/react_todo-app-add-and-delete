import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 120;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodos = (
  { title, userId, completed }: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = (todo: Omit<Todo, 'createdAt' | 'updatedAt'>) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};