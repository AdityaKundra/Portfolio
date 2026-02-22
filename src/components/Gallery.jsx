import { useState } from 'react';
import { gallery } from './Info';
import { useDraggableWindow } from '../hooks/useDraggableWindow';

const Gallery = ({ isOpen, isClose, onMinimize, position = { x: 0, y: 0 }, onPositionChange }) => {
    if (!isOpen) return null;

    const { handleMouseDown } = useDraggableWindow(position, onPositionChange || (() => {}));
    const albums = gallery?.albums ?? [];
    const [activeAlbum, setActiveAlbum] = useState(albums[0]?.id ?? null);
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    const currentAlbum = albums.find((a) => a.id === activeAlbum) ?? albums[0];
    const photos = currentAlbum?.photos ?? [];

    return (
        <>
            <div
                className="absolute h-[80vh] max-h-[500px] w-[95vw] max-w-[750px] md:h-[450px] md:w-[750px] bg-white dark:bg-[#2d2d2d] flex rounded-xl z-20 overflow-hidden animate-scale-in"
                style={{ left: position.x, top: position.y, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }}
            >
                {/* Sidebar */}
                <div className="w-3/12 bg-[#ebebeb] py-4 px-4 flex flex-col rounded-bl-xl">
                    <div
                        className="sidebarHead h-8 mb-2 cursor-grab active:cursor-grabbing"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="actionButtons flex gap-2" data-no-drag>
                            <span
                                className="cursor-pointer close h-3 w-3 block rounded-full bg-[#ED6A5E] border border-[#CE5347]"
                                onClick={isClose}
                            />
                            <span
                                className="cursor-pointer minimize h-3 w-3 block rounded-full bg-[#F6BE4F] border border-[#D6A243]"
                                onClick={onMinimize}
                            />
                            <span className="expand h-3 w-3 block rounded-full bg-[#62C554] border border-[#58A942]" />
                        </div>
                    </div>
                    <p className="text-sm mb-2 text-start font-medium dark:text-[#272727]">Albums</p>
                    <ul className="text-start flex-1 overflow-y-auto">
                        {albums.map((album) => (
                            <li
                                key={album.id}
                                className={`text-xs py-2 cursor-pointer font-medium capitalize dark:text-[#272727] hover:opacity-80 ${
                                    activeAlbum === album.id ? 'text-blue-600 font-semibold' : ''
                                }`}
                                onClick={() => setActiveAlbum(album.id)}
                            >
                                {album.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main content */}
                <div className="w-9/12 flex flex-col rounded-br-xl overflow-hidden">
                    <div
                        className="contentHead h-12 flex justify-start items-center px-4 bg-[#fdfdfd] shrink-0"
                        style={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 0.5px 0px 0px',
                        }}
                    >
                        <span className="text-sm font-semibold text-[#000000b3]">
                            {currentAlbum?.name ?? 'Photos'}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-[#f7f7f7]">
                        {photos.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-[#272727]">
                                No photos in this album. Add images to gallery in Info.js
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-white shadow-sm"
                                        onClick={() => setLightboxPhoto(photo)}
                                    >
                                        <img
                                            src={photo.url}
                                            alt={photo.caption ?? ''}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxPhoto && (
                <div
                    className="fixed inset-0 z-30 flex items-center justify-center bg-black/70"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <div
                        className="relative max-w-[90vw] max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxPhoto.url}
                            alt={lightboxPhoto.caption ?? ''}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        />
                        {lightboxPhoto.caption && (
                            <p className="text-white text-sm text-center mt-2">{lightboxPhoto.caption}</p>
                        )}
                        <button
                            className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition"
                            onClick={() => setLightboxPhoto(null)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Gallery;
