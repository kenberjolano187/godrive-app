export function getImageUrl(photo: string | File | null | undefined): string | null {
    if (!photo) return null;
    
    if (photo instanceof File) {
        return URL.createObjectURL(photo);
    }
    
    if (typeof photo === 'string') {
    
        const cleanPath = photo.replace(/^\/+/, '');
        
        if (cleanPath.startsWith('images/uploads/')) {
            return `/${cleanPath}`;
        }
        
        return `/images/uploads/${cleanPath}`;
    }
    
    return null;
}

export function getInitials(name: string): string {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getUserInitials(firstname?: string, lastname?: string): string {
    const first = firstname?.charAt(0)?.toUpperCase() || '';
    const last = lastname?.charAt(0)?.toUpperCase() || '';
    return first + last || '??';
}
export function validateImageFile(file: File, maxSizeMB: number = 2): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload JPG, PNG, or GIF.'
        };
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `File size exceeds ${maxSizeMB}MB limit.`
        };
    }
    
    return { valid: true };
}

export function createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}