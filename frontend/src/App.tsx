import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BookingPage } from './features/booking/pages/BookingPage';
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bookings" element={<BookingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
