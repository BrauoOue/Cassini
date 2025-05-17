import { useEffect } from 'react';

// Lenis Scroll
import { LenisScroll } from '../assets/utils/LenisScroll';

// Video
import Video from '../components/Video';

const HomePage = () => {

    useEffect(()=>{
        LenisScroll()
    },[])

    return (
        <div className="h-auto overflow-x-hidden bg-white">
            <Video></Video>
        </div>
    );
};

export default HomePage;
