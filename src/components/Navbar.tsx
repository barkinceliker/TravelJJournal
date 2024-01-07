// Navbar.tsx

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signup');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="navbar bg-base-100 justify-between" style={{ backgroundColor: 'transparent' }}>
      <a className="font-bold normal-case text-2xl" style={{ color: 'black' }}>
        YUBAR📸
      </a>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
