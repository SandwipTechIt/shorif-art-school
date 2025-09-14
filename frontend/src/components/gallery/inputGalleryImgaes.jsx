import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { uploadGalleryImages } from '../../api';

const InputGalleryImages = ({ onImagesSelected, maxFiles = 10, isOpen = false, onClose, onUploadSuccess }) => {
    const queryClient = useQueryClient();
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState([]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const fileInputRef = useRef(null);

    const categories = ['Calligraphy', 'Handwriting', 'Drawing'];

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            return 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
        }
        if (file.size > maxSize) {
            return 'File size must be less than 10MB';
        }
        return null;
    };

    const createPreview = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    url: e.target.result,
                    name: file.name,
                    size: file.size
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFiles = useCallback(async (files) => {
        const fileArray = Array.from(files);
        const newErrors = [];
        const validFiles = [];

        // Validate files
        fileArray.forEach((file, index) => {
            const error = validateFile(file);
            if (error) {
                newErrors.push(`File ${index + 1}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        // Check total file count
        if (selectedFiles.length + validFiles.length > maxFiles) {
            newErrors.push(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setErrors(newErrors);

        if (validFiles.length > 0) {
            // Create previews
            const newPreviews = await Promise.all(validFiles.map(createPreview));
            
            setSelectedFiles(prev => [...prev, ...validFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);
            
            if (onImagesSelected) {
                onImagesSelected([...selectedFiles, ...validFiles]);
            }
        }
    }, [selectedFiles, maxFiles, onImagesSelected]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (id) => {
        const updatedPreviews = previews.filter(preview => preview.id !== id);
        const updatedFiles = selectedFiles.filter((_, index) => previews[index]?.id !== id);
        
        setPreviews(updatedPreviews);
        setSelectedFiles(updatedFiles);
        
        if (onImagesSelected) {
            onImagesSelected(updatedFiles);
        }
    };

    const clearAll = () => {
        setSelectedFiles([]);
        setPreviews([]);
        setErrors([]);
        setUploadErrors([]);
        setSuccessMessage('');
        setUploadProgress(0);
        setSelectedCategory('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onImagesSelected) {
            onImagesSelected([]);
        }
    };

    // Handle image upload to backend
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setUploadErrors(['No files selected for upload']);
            return;
        }

        if (!selectedCategory) {
            setUploadErrors(['Please select a category for your images']);
            return;
        }

        setUploading(true);
        setUploadErrors([]);
        setSuccessMessage('');
        setUploadProgress(0);

        try {
            // Upload images to backend
            const response = await uploadGalleryImages(
                selectedFiles,
                selectedCategory,
                (progress) => setUploadProgress(progress)
            );

            // Handle successful upload
            setSuccessMessage(`Successfully uploaded ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`);
            
            // Invalidate and refetch gallery images query to show new images instantly
            queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
            
            // Notify parent component
            if (onUploadSuccess) {
                onUploadSuccess(response);
            }
            
            // Clear form and close modal after a short delay to show success message
            setTimeout(() => {
                clearAll();
                onClose();
            }, 1000);

        } catch (error) {
            // Handle different types of errors
            const errorMessages = [];

            switch (error.type) {
                case 'SERVER_ERROR':
                    if (error.status === 413) {
                        errorMessages.push('Files are too large. Please reduce file sizes and try again.');
                    } else if (error.status === 400) {
                        errorMessages.push(error.message || 'Invalid file format or data.');
                    } else if (error.status === 500) {
                        errorMessages.push('Server error. Please try again later.');
                    } else {
                        errorMessages.push(error.message || `Upload failed with status ${error.status}`);
                    }
                    break;

                case 'NETWORK_ERROR':
                    errorMessages.push('Network connection failed. Please check your internet connection.');
                    break;

                case 'UNKNOWN_ERROR':
                default:
                    errorMessages.push('Upload failed. Please try again.');
                    break;
            }

            setUploadErrors(errorMessages);
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add Images to Gallery</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="input-gallery-images">
                        {/* Category Selection */}
                        <div className="category-selection">
                            <label htmlFor="category-select" className="category-label">
                                Select Category <span className="required">*</span>
                            </label>
                            <select
                                id="category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-dropdown"
                            >
                                <option value="">Choose a category...</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Upload Area */}
                        <div
                            className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileInput}
                                style={{ display: 'none' }}
                            />
                            
                            <div className="upload-content">
                                <div className="upload-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h3>Drop images here or click to browse</h3>
                                <p>Support for JPEG, PNG, GIF, WebP files up to 10MB each</p>
                                <p className="file-limit">Maximum {maxFiles} files allowed</p>
                            </div>
                        </div>

                        {/* Error Messages */}
                        {errors.length > 0 && (
                            <div className="error-messages">
                                {errors.map((error, index) => (
                                    <div key={index} className="error-message">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Error Messages */}
                        {uploadErrors.length > 0 && (
                            <div className="error-messages">
                                {uploadErrors.map((error, index) => (
                                    <div key={index} className="error-message upload-error">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                ))}
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

                        {/* Upload Progress */}
                        {uploading && (
                            <div className="upload-progress">
                                <div className="progress-header">
                                    <span>Uploading images...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Preview Section */}
                        {previews.length > 0 && (
                            <div className="preview-section">
                                <div className="preview-header">
                                    <h4>Selected Images ({previews.length})</h4>
                                    <button className="clear-all-btn" onClick={clearAll}>
                                        Clear All
                                    </button>
                                </div>
                                
                                <div className="preview-grid">
                                    {previews.map((preview) => (
                                        <div key={preview.id} className="preview-item">
                                            <div className="preview-image">
                                                <img src={preview.url} alt={preview.name} />
                                                <button 
                                                    className="remove-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(preview.id);
                                                    }}
                                                >
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="preview-info">
                                                <p className="file-name">{preview.name}</p>
                                                <p className="file-size">{formatFileSize(preview.size)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Modal Action Buttons */}
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="upload-btn" 
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || !selectedCategory || uploading}
                    >
                        {uploading ? (
                            <>
                                <svg className="upload-spinner" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}` : 'Images'}`
                        )}
                    </button>
                </div>
            </div>
        </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease-out;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #e5e7eb;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-radius: 16px 16px 0 0;
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .close-btn svg {
                    width: 20px;
                    height: 20px;
                }

                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    border-top: 1px solid #e5e7eb;
                    background: #f9fafb;
                    border-radius: 0 0 16px 16px;
                    justify-content: flex-end;
                }

                .cancel-btn {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .cancel-btn:hover {
                    background: #e5e7eb;
                }

                .upload-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 120px;
                }

                .upload-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }

                .upload-btn:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Responsive modal */
                @media (max-width: 768px) {
                    .modal-overlay {
                        padding: 0.5rem;
                    }

                    .modal-content {
                        max-height: 95vh;
                    }

                    .modal-header {
                        padding: 1rem 1.5rem;
                    }

                    .modal-header h2 {
                        font-size: 1.25rem;
                    }

                    .modal-actions {
                        padding: 1rem 1.5rem;
                        flex-direction: column;
                    }

                    .cancel-btn, .upload-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }

                .modal-body {
                    padding: 2rem;
                }

                .input-gallery-images {
                    width: 100%;
                    max-width: none;
                    margin: 0;
                }

                .category-selection {
                    margin-bottom: 2rem;
                }

                .category-label {
                    display: block;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }

                .required {
                    color: #ef4444;
                    font-weight: 700;
                }

                .category-dropdown {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    color: #374151;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .category-dropdown:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .category-dropdown:hover {
                    border-color: #d1d5db;
                }

                .upload-area {
                    border: 2px dashed #e1e5e9;
                    border-radius: 12px;
                    padding: 3rem 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #fafbfc;
                    position: relative;
                    overflow: hidden;
                }

                .upload-area::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent 49%, rgba(99, 102, 241, 0.03) 50%, transparent 51%);
                    pointer-events: none;
                }

                .upload-area:hover {
                    border-color: #6366f1;
                    background: #f8faff;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
                }

                .upload-area.drag-active {
                    border-color: #6366f1;
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    transform: scale(1.02);
                }

                .upload-area.has-files {
                    border-color: #10b981;
                    background: #f0fdf4;
                }

                .upload-content {
                    position: relative;
                    z-index: 1;
                }

                .upload-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 1.5rem;
                    color: #6366f1;
                }

                .upload-icon svg {
                    width: 100%;
                    height: 100%;
                }

                .upload-area h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 0.5rem;
                }

                .upload-area p {
                    color: #6b7280;
                    margin: 0.25rem 0;
                    font-size: 0.95rem;
                }

                .file-limit {
                    font-size: 0.85rem !important;
                    color: #9ca3af !important;
                    font-style: italic;
                }

                .error-messages {
                    margin-top: 1rem;
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

                .upload-error {
                    background: #fef2f2;
                    border-color: #fca5a5;
                    color: #dc2626;
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
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .success-message svg {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }

                .upload-progress {
                    margin: 1rem 0;
                    padding: 1rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #475569;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                .upload-spinner {
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                    margin-right: 0.5rem;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .preview-section {
                    margin-top: 2rem;
                }

                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .preview-header h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }

                .clear-all-btn {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .clear-all-btn:hover {
                    background: #dc2626;
                    transform: translateY(-1px);
                }

                .preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .preview-item {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }

                .preview-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }

                .preview-image {
                    position: relative;
                    aspect-ratio: 1;
                    overflow: hidden;
                }

                .preview-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .preview-item:hover .preview-image img {
                    transform: scale(1.05);
                }

                .remove-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    opacity: 0;
                }

                .preview-item:hover .remove-btn {
                    opacity: 1;
                }

                .remove-btn:hover {
                    background: #dc2626;
                    transform: scale(1.1);
                }

                .remove-btn svg {
                    width: 14px;
                    height: 14px;
                }

                .preview-info {
                    padding: 1rem;
                }

                .file-name {
                    font-weight: 500;
                    color: #1f2937;
                    margin: 0 0 0.25rem;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .file-size {
                    color: #6b7280;
                    font-size: 0.8rem;
                    margin: 0;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .upload-area {
                        padding: 2rem 1rem;
                    }

                    .upload-icon {
                        width: 48px;
                        height: 48px;
                    }

                    .upload-area h3 {
                        font-size: 1.25rem;
                    }

                    .preview-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 0.75rem;
                    }

                    .preview-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }

                    .clear-all-btn {
                        align-self: center;
                    }
                }

                @media (max-width: 480px) {
                    .input-gallery-images {
                        margin: 0 0.5rem;
                    }

                    .upload-area {
                        padding: 1.5rem 0.75rem;
                    }

                    .preview-grid {
                        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                        gap: 0.5rem;
                    }

                    .preview-info {
                        padding: 0.75rem;
                    }
                }
            `}</style>
        </>
    );
};

export default InputGalleryImages;