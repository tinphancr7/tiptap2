import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import QuestionSettings from "./pages/question-setting";
import QuestionEditor from "./pages/question-editor";

const App = () => {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/question-registration/settings" replace />}
          />
          <Route
            path="/question-registration/settings"
            element={<QuestionSettings />}
          />
          <Route
            path="/question-registration/editor"
            element={<QuestionEditor />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
