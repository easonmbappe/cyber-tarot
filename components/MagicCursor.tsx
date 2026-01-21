'use client';
import { useEffect, useState } from 'react';

export default function MagicCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // 检测鼠标是否停留在可点击元素上(按钮/输入框)
            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A'
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen transition-transform duration-100 ease-out"
            style={{
                transform: `translate(${position.x - 16}px, ${position.y - 16}px)`, // 居中
            }}
        >
            {/* 核心光点 */}
            <div className={`relative flex items-center justify-center ${isPointer ? 'scale-150' : 'scale-100'} transition-transform duration-300`}>
                <div className="w-8 h-8 bg-white rounded-full opacity-50 blur-[2px]"></div>
                {/* 外围大光晕 */}
                <div className="absolute w-32 h-32 bg-purple-600 rounded-full opacity-20 blur-2xl"></div>
            </div>
        </div>
    );
}