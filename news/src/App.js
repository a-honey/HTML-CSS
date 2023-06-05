import "./App.css";
import NewsPage from "./pages/NewsPage";
import { Route, Routes } from "react-router-dom";
///9da76e0cf2f94b489903abf2d45ff974

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/:category" element={<NewsPage />} />
    </Routes>
  );
}

export default App;
