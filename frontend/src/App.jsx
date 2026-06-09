import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AllTodos from './pages/allTodos';
import Categories from './pages/categories';
import Login from './pages/login';
import Signup from './pages/signup';
import MainLayout from './components/MainLayout';

const App = () => {

    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} /> 
                    <Route element={<MainLayout />}> 
                        <Route path="/"  element={<AllTodos />}/>
                        <Route path="/categories"  element={<Categories />}/>
                    </Route>
                    <Route path="*" element={<h1>404 page not fount</h1>} />
                </Routes>
        </BrowserRouter>
    )
}

export default App;