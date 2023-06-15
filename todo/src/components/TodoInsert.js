import { MdAdd } from 'react-icons/md';
import './TodoInsert.css';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todoSlice';

const TodoInsert = ({ onInsert }) => {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addTodo(value));
    setValue('');
  };

  return (
    <form className="TodoInsert" onSubmit={onSubmit}>
      <input
        placeholder="할 일을 입력하세요."
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        <MdAdd />
      </button>
    </form>
  );
};

export default TodoInsert;
