'use client';
import { useEffect, useState, useCallback } from 'react';
import styles from './Cosmic.module.css';

interface StarStyle {
    id: number;
    left: string;
    size: number;
    fallDuration: string;
    fallDelay: string;
    twinkleDuration: string;
}

interface ShootingStarStyle {
    id: number;
    top: string;
    left: string;
    duration: string;
}

export default function CosmicBackground() {
    const [stars, setStars] = useState<StarStyle[]>([]);
    const [shootingStars, setShootingStars] = useState<ShootingStarStyle[]>([]);

    // 1. 初始化背景星星
    useEffect(() => {
        // 🔥 修改 1：星星数量增加到 80 颗
        const STAR_COUNT = 80;
        const newStars: StarStyle[] = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            const size = Math.random() * 2 + 0.5; // 大小微调
            newStars.push({
                id: i,
                left: `${Math.random() * 100}%`,
                size: size,
                // 背景星星下落速度保持缓慢 (15-30秒)
                fallDuration: `${Math.random() * 15 + 15}s`,
                fallDelay: `${Math.random() * 20}s`,
                twinkleDuration: `${Math.random() * 2 + 1}s`,
            });
        }
        setStars(newStars);
    }, []);

    // 2. 生成流星
    const spawnShootingStar = useCallback(() => {
        const id = Date.now();
        const startOnTop = Math.random() < 0.5;
        let top, left;

        // 稍微扩大出生范围，防止流星过于集中
        if (startOnTop) {
            top = '-10%';
            left = `${Math.random() * 80}%`;
        } else {
            left = '-10%';
            top = `${Math.random() * 50}%`;
        }

        // 🔥 修改 2：流星飞行时间延长到 2秒-4秒 (变慢)
        // 之前是 0.8-1.5秒
        const durationNum = Math.random() * 2 + 2;

        const newStar: ShootingStarStyle = {
            id, top, left, duration: `${durationNum}s`
        };

        setShootingStars(prev => [...prev, newStar]);

        setTimeout(() => {
            setShootingStars(prev => prev.filter(star => star.id !== id));
        }, durationNum * 1000 + 200);
    }, []);

    // 3. 定时器
    useEffect(() => {
        const intervalId = setInterval(() => {
            // 🔥 修改 3：触发频率提高
            // 70% 的概率生成 (之前是 40%)
            if (Math.random() > 0.3) {
                spawnShootingStar();
                // 40% 概率双星并发
                if (Math.random() > 0.6) {
                    setTimeout(spawnShootingStar, 200 + Math.random() * 500);
                }
            }
            // 🔥 修改 4：检查间隔缩短到 0.8秒 - 2.5秒 (之前是 2.5-5秒)
        }, Math.random() * 1700 + 800);

        return () => clearInterval(intervalId);
    }, [spawnShootingStar]);

    return (
        <div className={styles.background}>
            <div className={styles.moon}></div>

            {stars.map((star) => (
                <div
                    key={star.id}
                    className={styles.starContainer}
                    style={{
                        left: star.left,
                        animationDuration: star.fallDuration,
                        animationDelay: star.fallDelay,
                    }}
                >
                    <div
                        className={styles.starBody}
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDuration: star.twinkleDuration,
                            boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(147, 51, 234, 0.5)`
                        }}
                    ></div>
                </div>
            ))}

            {shootingStars.map((sStar) => (
                <div
                    key={sStar.id}
                    className={styles.shootingStar}
                    style={{
                        top: sStar.top,
                        left: sStar.left,
                        animationDuration: sStar.duration,
                    }}
                />
            ))}

            <div className={styles.gradient}></div>
        </div>
    );
}