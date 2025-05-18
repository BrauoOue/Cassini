// src/pages/HomePage.tsx
import { useEffect } from 'react';

// Lenis Scroll
import { LenisScroll } from '../assets/utils/LenisScroll';

// Video
import Video from '../components/Video';

// Cursor Type
import type { CursorType } from '../assets/utils/types'

// Story
import Story from '../components/Story';

// Label
import SponsorLabel from '../components/SponsorLabel'

// StoryLine
import StoryLine from '../components/StoryLine';

// Team
import Team from '../components/Team';

// ParallaxScroll
import ParallaxScroll from '../components/ParallaxScroll';

// Footer
import Footer from '../components/Footer';

type VideoProps = {
  setCursorType: React.Dispatch<React.SetStateAction<CursorType>>;
  setVideoView: React.Dispatch<React.SetStateAction<boolean>>;
};

const HomePage = ({ setVideoView, setCursorType }: VideoProps) => {
  useEffect(() => {
    LenisScroll();
  }, []);

  return (
    <div className="bg-white overflow-x-clip">
      <Video setCursorType={setCursorType} setVideoView={setVideoView} />
      <Story />
      <SponsorLabel />
      <StoryLine />
      <Team />
      
      {/* This is the anchor target for smooth scrolling */}
      <div id="research-section">
        <ParallaxScroll setCursorType={setCursorType} />
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
