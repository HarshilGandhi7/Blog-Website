import React from 'react';
import loading from '../assets/loading.gif';

const Loading = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <img src={loading} alt="loading" />
    </div>
  );
}

export default Loading;