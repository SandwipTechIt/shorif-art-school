import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllGalleryImages, deleteGalleryImage } from '../../api';

const ShowAllImages = ({ onImageDeleted }) => {
    const queryClient = useQueryClient();
    const [deleting, setDeleting] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Use React Query to fetch gallery images
    const {
        data: images = [],
        isLoading: loading,
        error,
        refetch
    } = useQuery({
        queryKey: ['galleryImages'],
        queryFn: getAllGalleryImages,
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: true,
        retry: 2
    });

    const handleApiErrorMessage = (error, defaultMessage) => {
        switch (error.type) {
            case 'SERVER_ERROR':
                if (error.status === 500) {
                    return 'Server error. Please try again later.';
                } else {
                    return error.message || defaultMessage;
                }
            case 'NETWORK_ERROR':
                return 'Network connection failed. Please check your internet connection.';
            case 'NOT_FOUND_ERROR':
                return 'No images found in the gallery.';
            default:
                return defaultMessage;
        }
    };

    // Convert error to array format for existing error handling
    const errors = error ? [handleApiErrorMessage(error, 'Failed to load gallery images')] : [];

    // Delete mutation with React Query
    const deleteMutation = useMutation({
        mutationFn: deleteGalleryImage,
        onSuccess: (data, deletedImageId) => {
            // Update the cache by removing the deleted image
            queryClient.setQueryData(['galleryImages'], (oldImages) => 
                oldImages ? oldImages.filter(img => img._id !== deletedImageId) : []
            );
            
            setSuccessMessage('Image deleted successfully');
            
            // Notify parent component
            if (onImageDeleted) {
                onImageDeleted(deletedImageId);
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        },
        onError: (error) => {
            console.error('Delete error:', error);
        },
        onSettled: () => {
            setDeleting(null);
            setDeleteConfirm(null);
        }
    });

    const handleDeleteClick = (image) => {
        setDeleteConfirm(image);
        setSuccessMessage('');
    };

    const handleDeleteConfirm = () => {
        if (!deleteConfirm) return;

        setDeleting(deleteConfirm._id);
        deleteMutation.mutate(deleteConfirm._id);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleRetry = () => {
        refetch();
    };

    if (loading) {
        return (
            <div className="show-all-images">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading gallery images...</p>
                </div>
                <style jsx>{`
                    .show-all-images {
                        padding: 2rem;
                        margin: 0 auto;
                    }

                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem 2rem;
                        text-align: center;
                    }

                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f4f6;
                        border-top: 4px solid #6366f1;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 1rem;
                    }

                    .loading-container p {
                        color: #6b7280;
                        font-size: 1rem;
                        margin: 0;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="show-all-images">
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="error-section">
                    {errors.map((error, index) => (
                        <div key={index} className="error-message">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    ))}
                    <button className="retry-btn" onClick={handleRetry}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                    </button>
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="success-message">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {/* Images Grid */}
            {images.length === 0 && !loading && errors.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3>No Images Found</h3>
                    <p>Your gallery is empty. Start by adding some beautiful images!</p>
                </div>
            ) : (
                <div className="images-grid">
                    {images.map((image) => (
                        <div key={image._id} className="image-card">
                            <div className="image-container">
                                <img 
                                    src={image.img?.trim()} 
                                    alt="Gallery image"
                                    onError={(e) => {
                                        e.target.src = '/default.png';
                                        e.target.onerror = null;
                                    }}
                                />
                                <div className="image-overlay">
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteClick(image)}
                                        disabled={deleting === image._id}
                                        title="Delete image"
                                    >
                                        {deleting === image._id ? (
                                            <div className="delete-spinner"></div>
                                        ) : (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Image</h3>
                            <button className="close-btn" onClick={handleDeleteCancel}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="confirm-image">
                                <img src={deleteConfirm.img?.trim()} alt="Image to delete" />
                            </div>
                            <p>Are you sure you want to delete this image? This action cannot be undone.</p>
                        </div>
                        <div className="delete-modal-actions">
                            <button className="cdelete-ancel-btn" onClick={handleDeleteCancel}>
                                Cancel
                            </button>
                            <button className="confirm-delete-btn" onClick={handleDeleteConfirm}>
                                Delete Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .show-all-images {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .error-section {
                    margin-bottom: 2rem;
                }

                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .error-message svg {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }

                .retry-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 0.75rem 1rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-top: 0.5rem;
                }

                .retry-btn:hover {
                    background: #5b5bd6;
                    transform: translateY(-1px);
                }

                .retry-btn svg {
                    width: 16px;
                    height: 16px;
                }

                .success-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #16a34a;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .success-message svg {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    text-align: center;
                    color: #6b7280;
                }

                .empty-icon {
                    width: 64px;
                    height: 64px;
                    color: #d1d5db;
                    margin-bottom: 1rem;
                }

                .empty-icon svg {
                    width: 100%;
                    height: 100%;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #374151;
                    margin: 0 0 0.5rem;
                }

                .empty-state p {
                    font-size: 1rem;
                    margin: 0;
                }

                .images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1rem;
                }

                .image-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }

                .image-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                }

                .image-container {
                    position: relative;
                    aspect-ratio: 1;
                    overflow: hidden;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .image-card:hover .image-container img {
                    transform: scale(1.05);
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .image-card:hover .image-overlay {
                    opacity: 1;
                }

                .delete-btn {
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .delete-btn:hover:not(:disabled) {
                    background: #dc2626;
                    transform: scale(1.1);
                }

                .delete-btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .delete-btn svg {
                    width: 20px;
                    height: 20px;
                }

                .delete-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .delete-modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 1.5rem 0;
                }

                .modal-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .close-btn svg {
                    width: 18px;
                    height: 18px;
                }

                .modal-body {
                    padding: 1.5rem;
                    text-align: center;
                }

                .confirm-image {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 1rem;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid #e5e7eb;
                }

                .confirm-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .modal-body p {
                    color: #6b7280;
                    margin: 0;
                    line-height: 1.5;
                }

                .delete-modal-actions {
                    display: flex;
                    gap: 0.75rem;
                    padding: 0 1.5rem 1.5rem;
                }

                .cdelete-ancel-btn {
                    flex: 1;
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    padding: 0.75rem 1rem;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .cdelete-ancel-btn:hover {
                    background: #e5e7eb;
                }

                .confirm-delete-btn {
                    flex: 1;
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 0.75rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .confirm-delete-btn:hover {
                    background: #dc2626;
                    transform: translateY(-1px);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .show-all-images {
                        padding: 1rem;
                    }

                    .images-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 1rem;
                    }

                    .delete-modal-content {
                        margin: 1rem;
                    }

                    .delete-modal-actions {
                        flex-direction: column;
                    }
                }

                @media (max-width: 480px) {
                    .images-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 0.75rem;
                    }

                    .delete-btn {
                        width: 40px;
                        height: 40px;
                    }

                    .delete-btn svg {
                        width: 16px;
                        height: 16px;
                    }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ShowAllImages;