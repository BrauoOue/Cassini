import { useEffect } from 'react';

// Lenis Scroll
import { LenisScroll } from '../assets/utils/LenisScroll';

// Cursor Component
import Cursor from '../components/Cursor';

// Navbar Component
import NavBar from '../components/NavBar';

// Menu Aside
import MenuAside from '../components/MenuAside';

const HomePage = () => {

    useEffect(()=>{
        LenisScroll()
    },[])


    return (
        <div className="h-screen w-screen overflow-x-hidden bg-white">
            <Cursor></Cursor>
            <NavBar></NavBar>
            <MenuAside></MenuAside>
        </div>
    );
};

export default HomePage;