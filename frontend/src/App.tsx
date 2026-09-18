import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SearchConsole } from './components/SearchConsole';
import { InsightsDiagnostics } from './components/InsightsDiagnostics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchConsole />} />
          <Route path="insights" element={<InsightsDiagnostics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
