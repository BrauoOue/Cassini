import { useEffect } from 'react';

// Lenis Scroll
import { LenisScroll } from '../assets/utils/LenisScroll';

// Cursor Component
import Cursor from '../components/Cursor';

// Navbar Component
import NavBar from '../components/NavBar';

// Menu Aside
import MenuAside from '../components/MenuAside';

// Video
import Video from '../components/Video';

const HomePage = () => {

    useEffect(()=>{
        LenisScroll()
    },[])

    return (
        <div className="h-auto overflow-x-hidden bg-white">
            <Cursor></Cursor>
            <NavBar></NavBar>
            <Video></Video>
            <MenuAside></MenuAside>
        </div>
    );
};

export default HomePage;