import { cn } from '@/utils/cn.utils';
import React from 'react';

interface AvatarProps {
    src: string;
    alt?: string;
    size?: number; // Size in pixels
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    size = 50,
}) => {

    return (
        <div className={cn(`flex rounded-full overflow-hidden`)} style={{width: size + "px", height: size + "px"}}>
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
    );
}

export default Avatar;
