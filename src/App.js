import { BrowserRouter as Router, Navigate, Route, Routes, Link } from 'react-router-dom';
import Signin from './components/signin';
import Signup from './components/signup';
import Todo from './components/todo';
import Home from './components/home';
import { useEffect, useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    setIsLoggedOut(!token)
  },[]);
  

  const handleLogout = () => {
    // 로그아웃 처리를 수행하는 코드를 여기에 작성
    // 예를 들어, localStorage에서 access_token을 삭제하는 등의 작업을 수행
    localStorage.removeItem('access_token');

    // 로그아웃 후 로그인 페이지로 이동
    window.location.href = '/signin'; // 혹은 다른 경로로 이동
  };

  return (
    <Router>
      <div className='app'>
        <nav>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/todo">Todo</Link>
                </li>
                <li>
                  <a href="/" onClick={handleLogout}>로그아웃</a>
                </li>
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/todo">Todo</Link>
                </li>
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/signin"
            element={isLoggedOut ? <Signin /> : <Navigate to="/todo" />}
            />
          <Route 
            path="/signup"
            element={isLoggedOut ? <Signup /> : <Navigate to="/todo" />}
            />
          <Route
            path="/todo"
            element={isLoggedIn ? <Todo /> : <Navigate to="/signin" />}
          />        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
