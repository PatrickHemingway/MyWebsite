import React, { useRef, useEffect } from 'react';

const DuckAnimation = () => {
  const canvasRef = useRef(null);

  const forestImg = new Image();
  forestImg.src = '/DuckAnimation/Scene/forest.png';

  const vinesImg = new Image();
  vinesImg.src = '/DuckAnimation/Scene/vines.png';

  const NUM_DUCKS = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const DUCK_HEIGHT = 60;
    const DUCK_SPACING = 30;
    const RIVER_TOP = 100;
    const RIVER_HEIGHT = NUM_DUCKS * (DUCK_SPACING + 6);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = RIVER_TOP + RIVER_HEIGHT + 25;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frame = 0;

    const duckPaths = Array.from({ length: 6 }, (_, i) => `/DuckAnimation/Ducks/duck${i + 1}.png`);
    const shuffled = duckPaths.sort(() => 0.5 - Math.random()).slice(0, NUM_DUCKS);

    const ducks = shuffled.map((src, i) => ({
      x: canvas.width * 0.25 + i * 20,
      speed: (Math.random() - 0.5) * 0.4,
      laneIndex: i,
      img: Object.assign(new Image(), { src }),
    }));

    const drawRiver = () => {
      const gradient = ctx.createLinearGradient(0, RIVER_TOP, 0, RIVER_TOP + RIVER_HEIGHT);
      gradient.addColorStop(0, '#b7eaff');
      gradient.addColorStop(1, '#5dc5ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, RIVER_TOP, canvas.width, RIVER_HEIGHT);
    };

    const drawWaves = (offset) => {
      ctx.beginPath();
      for (let y = RIVER_TOP; y <= RIVER_TOP + RIVER_HEIGHT; y += 20) {
        ctx.moveTo(0, y);
        for (let x = 0; x <= canvas.width; x += 10) {
          const wave = Math.sin((x + offset + y) * 0.05) * 3;
          ctx.lineTo(x, y + wave);
        }
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawForest = (offset) => {
      if (!forestImg.complete || !forestImg.width || !forestImg.height) return;

      const forestHeight = 280;
      const aspectRatio = forestImg.width / forestImg.height;
      const forestWidth = forestHeight * aspectRatio;
      const forestY = RIVER_TOP - forestHeight + 95;
      const adjustedOffset = offset / 1.5;
      const repeatCount = Math.ceil(canvas.width / (forestWidth - 11)) + 2;

      for (let i = 0; i < repeatCount; i++) {
        const x = (i * (forestWidth - 11)) - (adjustedOffset % (forestWidth - 11));
        ctx.drawImage(forestImg, x, forestY, forestWidth, forestHeight);
      }
    };

    const drawVines = (offset) => {
      if (!vinesImg.complete || !vinesImg.width || !vinesImg.height) return;

      const vinesHeight = 250;
      const aspectRatio = vinesImg.width / vinesImg.height;
      const vinesWidth = vinesHeight * aspectRatio;
      const vinesY = RIVER_HEIGHT + 10;
      const adjustedOffset = offset / 1.5;
      const repeatCount = Math.ceil(canvas.width / (vinesWidth - 11)) + 2;

      for (let i = 0; i < repeatCount; i++) {
        const x = (i * (vinesWidth - 90)) - (adjustedOffset % (vinesWidth - 90)) - 50;
        ctx.drawImage(vinesImg, x, vinesY, vinesWidth, vinesHeight);
      }
    };

    const animate = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawRiver();
      drawForest(frame);
      drawWaves(frame);

      const maxX = Math.max(...ducks.map((d) => d.x));
      const minX = Math.min(...ducks.map((d) => d.x));

      ducks.forEach((duck, index) => {
        const isLeader = duck.x >= maxX - 5;
        const isTrailing = duck.x <= minX + 5;

        if (isLeader) duck.speed -= 0.001;
        if (isTrailing) duck.speed += 0.002;

        const buffer = 60;
        if (duck.x > canvas.width - buffer) {
          duck.speed -= 0.06;
        } else if (duck.x < buffer) {
          duck.speed += 0.06;
        }

        duck.speed = Math.max(-1.0, Math.min(duck.speed, 1.0));
        duck.x += duck.speed;

        const bobOffset = Math.sin((frame + index * 30) * 0.1) * 3.5;
        const duckY = RIVER_TOP + index * DUCK_SPACING + bobOffset;

        if (duck.img.complete) {
          ctx.drawImage(duck.img, duck.x, duckY, DUCK_HEIGHT, DUCK_HEIGHT);
        }
      });

      drawVines(frame);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100vw',
        backgroundColor: '#fff',
      }}
    />
  );
};

export default DuckAnimation;