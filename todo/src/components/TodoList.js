import TodoListItem from './TodoListItem';
import './TodoList.css';
import { useCallback } from 'react';
import { List } from 'react-virtualized';
import { useSelector } from 'react-redux';

const TodoList = () => {
  const todos = useSelector((state) => state.todo);

  const rowRenderer = ({ index, key, style }) => {
    const todo = todos[index];
    return <TodoListItem todo={todo} key={key} style={style} />;
  };

  return (
    <List
      className="TodoList"
      width={512}
      height={513}
      rowCount={todos.length}
      rowHeight={57}
      rowRenderer={rowRenderer}
      list={todos}
      style={{ outline: 'none' }}
    />
  );
};

export default TodoList;
