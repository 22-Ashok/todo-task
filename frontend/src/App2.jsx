import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./pages/Auth";
import Todos from "./pages/todos";
const App2 = () => {
    
    return (
        <>
           <BrowserRouter>
             
             <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/todos" element={<Todos />} />
             </Routes>
             
           </BrowserRouter>
          
        </>
    )
}

export default App2;