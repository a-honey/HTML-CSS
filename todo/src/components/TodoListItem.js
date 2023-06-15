import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import './TodoListItem.css';
import { useDispatch } from 'react-redux';
import { deleteTodo, toggleTodo } from '../features/todoSlice';

const TodoListItem = ({ todo, style }) => {
  const { id, text, checked } = todo;

  const dispatch = useDispatch(deleteTodo);

  const onRemove = (id) => {
    dispatch(deleteTodo(id));
  };

  const onToggle = (id) => {
    dispatch(toggleTodo(id));
  };

  return (
    <div className="TodoListItem-virtualized" style={style}>
      <div className="TodoListItem">
        <div
          className={checked ? 'checkbox checked' : 'checkbox'}
          onClick={() => onToggle(id)}
        >
          {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <div className={checked ? 'text checked' : 'text'}>{text}</div>
        </div>
        <div className="remove" onClick={() => onRemove(id)}>
          <MdRemoveCircleOutline />
        </div>
      </div>
    </div>
  );
};

export default TodoListItem;
