import { Routes, Route } from 'react-router-dom';
import App from '../App.tsx';
import Winners from '../components/Winners.tsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="winners" element={<Winners />} />
      </Route>
    </Routes>
  );
}
