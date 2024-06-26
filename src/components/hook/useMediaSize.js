import { useEffect, useState } from 'react';

const useMediaSize = (mediaUrl) => {
    const [sizeClass, setSizeClass] = useState('');

    useEffect(() => {
        const img = new Image();
        img.src = mediaUrl;
        img.onload = () => {
            if (img.width > img.height) {
                setSizeClass('auto-height');
            } else {
                setSizeClass('fixed-height');
            }
        };
    }, [mediaUrl]);

    return { sizeClass };
};

export default useMediaSize;