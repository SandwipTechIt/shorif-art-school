import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import GalleryHeader from '../../components/gallery/galleryHeader';
import InputGalleryImages from '../../components/gallery/inputGalleryImgaes';
import ShowAllImages from '../../components/gallery/showAllImages';

export default function Gallery() {
    const queryClient = useQueryClient();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleAddImage = () => {
        setIsUploadModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsUploadModalOpen(false);
    };

    const handleImagesSelected = (files) => {
    };

    const handleUploadSuccess = (response) => {
    };
    
    const handleImageDeleted = (deletedImageId) => {

    };
    return (
        <div>
            <GalleryHeader onAddClick={handleAddImage} />
            
            <InputGalleryImages 
                isOpen={isUploadModalOpen}
                onClose={handleCloseModal}
                onImagesSelected={handleImagesSelected}
                onUploadSuccess={handleUploadSuccess}
                maxFiles={10}
            />
            
            {/* Gallery content will go here */}
            <ShowAllImages 
                onImageDeleted={handleImageDeleted}
            />
        </div>
    );
}