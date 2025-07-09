import React, { useRef, useEffect } from 'react';

const DuckAnimation = () => {
  const canvasRef = useRef(null);

  const duckImg = new Image();
  duckImg.src = '/DuckAnimation/Duck1/duck1.png';

  const wallImg = new Image();
  wallImg.src = '/DuckAnimation/Scene/wall.png';

  const NUM_DUCKS = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const DUCK_HEIGHT = 60;
    const DUCK_SPACING = 30;
    const RIVER_TOP = 100;
    const RIVER_HEIGHT = NUM_DUCKS * (DUCK_SPACING + 6) + 5;

    const WALL_HEIGHT = 40; // fixed height for scaled wall

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = RIVER_TOP + RIVER_HEIGHT + 25;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frame = 0;
    const duckSpeed = 2;
    let wallReady = true;

    const ducks = Array.from({ length: NUM_DUCKS }, (_, i) => ({
      x: -60 * (i + 1),
      laneIndex: i,
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

    const drawWall = () => {
      if (!wallReady || !wallImg.width || !wallImg.height) return;

      const scaledWallHeight = WALL_HEIGHT;
      const aspectRatio = wallImg.width / wallImg.height;
      const scaledWallWidth = scaledWallHeight * aspectRatio;

      const wallY = RIVER_TOP + RIVER_HEIGHT - 10;

      const repeatCount = Math.ceil(canvas.width / (scaledWallWidth - 11)) + 1;
      for (let i = 0; i < repeatCount; i++) {
        const x = i * (scaledWallWidth - 11)-5;
        ctx.drawImage(wallImg, x, wallY, scaledWallWidth, scaledWallHeight);
      }
    };

    const animate = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawRiver();
      
      drawWaves(frame);   // ripple lines

      ducks.forEach((duck, index) => {
        duck.x += duckSpeed;
        if (duck.x > canvas.width + 60) duck.x = -60;

        const bobOffset = Math.sin((frame + index * 30) * 0.1) * 5;
        const duckY = RIVER_TOP + index * DUCK_SPACING + bobOffset;

        if (duckImg.complete) {
          ctx.drawImage(duckImg, duck.x, duckY, DUCK_HEIGHT, DUCK_HEIGHT);
        }
      });
      
      drawWall();

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
        backgroundColor: '#cceeff',
      }}
    />
  );
};

export default DuckAnimation;