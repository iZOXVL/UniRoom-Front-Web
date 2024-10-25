import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

const Loader = () => {
  return (
    <div className="flex h-auto items-center justify-center bg-transparent dark:bg-transparent flex-col mt-8">
      <DotLottiePlayer
        src="/lotties/loading.lottie"
        autoplay
        loop
        style={{ height: '320px', width: '320px' }}
      >
      </DotLottiePlayer>
    </div>
  );
};

export default Loader;
