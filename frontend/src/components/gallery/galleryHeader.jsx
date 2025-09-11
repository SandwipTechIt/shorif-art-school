import React from 'react';

const GalleryHeader = ({ onAddClick }) => {
    return (
        <div className="gallery-header bg-white m-2 md:m-4 border border-[#00c2ff80] dark:bg-gray-800 dark:border-gray-700">
            <div className="gallery-header-content">
                <h1 className="gallery-title !text-black dark:!text-white">Gallery</h1>
                <button
                    className="add-button !text-black dark:!text-white"
                    onClick={onAddClick}
                    aria-label="Add new image"
                >
                    <svg
                        className="add-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Image
                </button>
            </div>

            <style jsx>{`
                .gallery-header {
               background: linear-gradient(to right, #47cef880 10%, #47cef880 );
                    padding: 2rem 1rem;
                    margin-bottom: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                .gallery-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    pointer-events: none;
                }
                
                .gallery-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }
                
                .gallery-title {
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    letter-spacing: -0.02em;
                }
                
                .add-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .add-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }
                
                .add-button:active {
                    transform: translateY(0);
                }
                
                .add-icon {
                    width: 20px;
                    height: 20px;
                    transition: transform 0.3s ease;
                }
                
                .add-button:hover .add-icon {
                    transform: rotate(90deg);
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .gallery-header {
                        padding: 1.5rem 1rem;
                        margin-bottom: 1.5rem;
                        border-radius: 8px;
                    }
                    
                    .gallery-header-content {
                        flex-direction: column;
                        gap: 1.5rem;
                        text-align: center;
                    }
                    
                    .gallery-title {
                        font-size: 2rem;
                    }
                    
                    .add-button {
                        padding: 0.875rem 2rem;
                        font-size: 0.95rem;
                        width: fit-content;
                    }
                }
                
                @media (max-width: 480px) {
                    .gallery-header {
                        padding: 1.25rem 0.75rem;
                        margin: 0 0.5rem 1.5rem;
                    }
                    
                    .gallery-title {
                        font-size: 1.75rem;
                    }
                    
                    .add-button {
                        padding: 0.75rem 1.75rem;
                        font-size: 0.9rem;
                    }
                    
                    .add-button span {
                        display: none;
                    }
                    
                    .add-icon {
                        width: 18px;
                        height: 18px;
                    }
                }
                
                @media (max-width: 320px) {
                    .gallery-header {
                        margin: 0 0.25rem 1rem;
                    }
                    
                    .gallery-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default GalleryHeader;