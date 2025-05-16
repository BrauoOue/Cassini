import React from 'react';
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
            <div className="text-xl font-bold">SatPulse 🚀</div>
            <div className="flex space-x-4">
                <Link to="/" className="hover:text-gray-300">Home</Link>
                {/*<Link to="/about" className="hover:text-gray-300">About</Link>*/}
            </div>
        </nav>
    );
};

export default NavBar;
