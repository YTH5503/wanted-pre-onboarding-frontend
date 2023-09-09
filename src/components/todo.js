import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios 라이브러리를 import

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedTodo, setEditedTodo] = useState('');

  useEffect(() => {
    // Todo 목록을 서버에서 가져와서 todos 상태를 설정하는 함수
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      // Axios를 사용하여 Todo 목록을 가져오기
      const response = await axios.get('https://www.pre-onboarding-selection-task.shop/todos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTodos(response.data);
      console.log('Todo목록 ', todos)
    } catch (error) {
      console.error('Todo 목록을 가져오는 도중 오류가 발생했습니다.', error);
    }
  };

  const createTodo = async () => {
    try {
      // Axios를 사용하여 새로운 Todo를 생성하기
      const response = await axios.post('https://www.pre-onboarding-selection-task.shop/todos', { todo: newTodo }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.status === 201) {
        setNewTodo('');
        setIsCreating(false);
        fetchTodos(); // Todo 목록을 다시 가져오기
      } else {
        console.error('Todo 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Todo 생성 도중 오류가 발생했습니다.', error);
    }
  };


  const updateTodo = async (id, todoText, isCompleted) => {
    try {
      // 수정할 Todo의 데이터
      const updatedTodoData = {
        todo: todoText,
        isCompleted: isCompleted,
      };
  
      // Axios를 사용하여 서버에 PUT 요청을 보냅니다.
      const response = await axios.put(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, updatedTodoData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      // 서버 응답 확인
      if (response.status === 200) {
        // Todo 목록을 다시 가져옵니다.
        fetchTodos();
        // 수정 모드 종료
        setEditingId(null);
        // 수정한 내용 초기화
        setEditedTodo('');
      } else {
        console.error('Todo 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Todo 수정 도중 오류가 발생했습니다.', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.status === 204) {
        fetchTodos();
      } else {
        console.error('Todo 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Todo 삭제 도중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div>
      <h1>Todo 목록</h1>
      <button onClick={() => setIsCreating(true)} data-testid="new-todo-add-button">새로운 Todo 생성</button>

      {isCreating && (
        <div>
          <input
            type="text"
            placeholder="새로운 Todo 입력"
            value={newTodo}
            data-testid = "new-todo-input"
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={createTodo}>생성</button>
        </div>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={(e) => updateTodo(todo.id, todo.todo,!todo.isCompleted)} // 체크박스 상태 변경 시 updateTodo 호출
            />
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedTodo}
                  onChange={(e) => setEditedTodo(e.target.value)}
                />
                <button
                  onClick={() => updateTodo(todo.id, editedTodo, todo.isCompleted)}
                  data-testid="submit-button" 
                >
                  제출
                </button>
                <button onClick={() => setEditingId(null)} data-testid="cancel-button">취소</button>
              </>
            ) : (
              <>
                {todo.todo}{' '}
                <button onClick={() => setEditingId(todo.id)} data-testid="modify-input">수정</button>
              </>
            )}
            {editingId !== todo.id && (
              <button onClick={() => deleteTodo(todo.id)} data-testid="delete-button">삭제</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
