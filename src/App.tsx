import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Intake from './pages/Intake';
import Analyze from './pages/Analyze';
import Report from './pages/Report';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/report" element={<Report />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
