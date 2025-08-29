import fs from 'fs';
import path from 'path';

export const deleteImage = async (filename) => {
    if (!filename) return false;
    try {
        const imagePath = path.join('./images', filename);

        // Check if file exists
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Image deleted: ${filename}`);
            return true;
        } else {
            console.log(`Image not found: ${filename}`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting image ${filename}:`, error);
        return false;
    }
};


export const getImageUrl = (filename, baseUrl = '') => {
    if (!filename) return null;
    return `${baseUrl}/images/${filename} `;
};

export const getFilenameFromUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return path.basename(imageUrl);
};