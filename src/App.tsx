import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { ActivityPage } from './pages/ActivityPage';
import './App.css';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/activities/:id" element={<ActivityPage />}></Route>
			</Routes>
		</Router>
	);
}

export default App;
