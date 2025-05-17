import { useEffect } from 'react';

// Lenis Scroll
import { LenisScroll } from '../assets/utils/LenisScroll';

// Video
import Video from '../components/Video';

type VideoProps = {
  setVideoView: (arg: boolean) => void;
};


const HomePage = ({setVideoView}:VideoProps) => {

    useEffect(()=>{
        LenisScroll()
    },[])

    return (
        <div className="bg-white overflow-x-clip">
            <Video setVideoView={setVideoView}></Video>
        </div>
    );
};

export default HomePage;
