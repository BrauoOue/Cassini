import { useEffect } from 'react';

// Lenis Scroll
import { LenisScroll } from '../assets/utils/LenisScroll';

// Video
import Video from '../components/Video';

//Cursor Type
import type {CursorType} from '../assets/utils/types'

//Story
import Story from '../components/Story';

//Label
import SponsorLabel from '../components/SponsorLabel'

//StoryLine
import StoryLine from '../components/StoryLine';

//Team
import Team from '../components/Team';

// ParallaxScroll
import ParallaxScroll from '../components/ParallaxScroll';

type VideoProps = {
  setCursorType: React.Dispatch<React.SetStateAction<CursorType>>;
  setVideoView: React.Dispatch<React.SetStateAction<boolean>>;
};


const HomePage = ({setVideoView,setCursorType}:VideoProps) => {

    useEffect(()=>{
        LenisScroll()
    },[])

    return (
        <div className="bg-white overflow-x-clip">
            <Video setCursorType={setCursorType} setVideoView={setVideoView}></Video>
            <Story></Story>
            <SponsorLabel></SponsorLabel>
            <StoryLine></StoryLine>
            <Team></Team>
            <ParallaxScroll></ParallaxScroll>
        </div>
    );
};

export default HomePage;
