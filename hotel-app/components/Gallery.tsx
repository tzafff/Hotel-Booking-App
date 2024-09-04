"use client"
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import '../styles/gallery-styles.css';
import LightGallery from 'lightgallery/react';

interface LightGalleryDetail {
    instance: {
        openGallery: () => void;
    };
}

const Gallery = ({ imgURLs } : { imgURLs: string[] }) => {

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [galleryContainer, setGalleryContainer] = useState<string | null>(null);

    const onInit = useCallback((detail: LightGalleryDetail) => {
        if (detail) {
            detail.instance.openGallery();
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setGalleryContainer('aaa');
        }
    }, []);

    // Prepare dynamic elements for LightGallery
    const dynamicEl = imgURLs.map((url) => ({
        src: url,
    }));

    return (
        <div className="App">
            <div
                style={{
                    height: '430px',
                }}
                ref={containerRef}
            ></div>
            <div>
                {containerRef.current && (
                    <LightGallery
                        container={containerRef.current}
                        onInit={onInit}
                        closable={false}
                        showMaximizeIcon={false}
                        slideDelay={400}
                        thumbWidth={130}
                        thumbHeight={'100px'}
                        thumbMargin={6}
                        appendSubHtmlTo={'.lg-item'}
                        dynamic={true}
                        dynamicEl={dynamicEl}
                        hash={false}
                        elementClassNames={'inline-gallery-container'}
                    ></LightGallery>
                )}
            </div>
        </div>
    );
};

export default Gallery;
