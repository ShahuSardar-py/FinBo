'use client';

import React, { useRef, useEffect, useState } from 'react';

interface FishProfile {
  id: string;
  name: string | null;
  species: string;
  quantity: number;
  size: string | null;
  addedDate: string;
  boughtFrom: string | null;
  price: number | null;
}

interface PlantProfile {
  id: string;
  species: string;
  quantity: number;
  addedDate: string;
  boughtFrom: string | null;
  price: number | null;
}

interface VirtualAquariumProps {
  hasGravel: number | boolean;
  isPlanted: number | boolean;
  fish: FishProfile[];
  plants: PlantProfile[];
}

// Visual classes for simulation
class Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleOffset: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 50;
    this.size = Math.random() * 4 + 1.5;
    this.speed = Math.random() * 1.5 + 0.5;
    this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    this.wobbleRange = Math.random() * 3 + 1;
    this.wobbleOffset = Math.random() * Math.PI * 2;
  }

  update(height: number) {
    this.y -= this.speed;
    this.wobbleOffset += this.wobbleSpeed;
    if (this.y < -10) {
      this.y = height + Math.random() * 50;
      this.wobbleOffset = Math.random() * Math.PI * 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    const xPos = this.x + Math.sin(this.wobbleOffset) * this.wobbleRange;
    ctx.arc(xPos, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
}

class Food {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  active: boolean;

  constructor(x: number) {
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = 0;
    this.size = Math.random() * 3 + 2;
    this.speed = Math.random() * 0.5 + 0.5;
    this.color = ['#f59e0b', '#d97706', '#b45309', '#fca5a5'][Math.floor(Math.random() * 4)];
    this.active = true;
  }

  update(height: number) {
    if (this.y < height - 15) {
      this.y += this.speed;
    } else {
      this.active = false; // Disappear on bottom after some time
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  species: string;
  size: number;
  color: string;
  accentColor: string;
  type: 'schooling' | 'crawling' | 'clinging' | 'standard' | 'reef';
  tailAngle: number;
  tailSpeed: number;
  scaredTimer: number;

  constructor(width: number, height: number, species: string) {
    this.x = Math.random() * width;
    this.species = species;
    this.tailAngle = Math.random() * Math.PI * 2;
    this.scaredTimer = 0;

    // Categorize fish types & customize look based on common species name
    const lowerSpecies = species.toLowerCase();
    
    if (lowerSpecies.includes('neon') || lowerSpecies.includes('tetra')) {
      this.type = 'schooling';
      this.size = 12 + Math.random() * 4;
      this.color = '#0ea5e9'; // Neon blue
      this.accentColor = '#ef4444'; // Neon red
      this.y = Math.random() * (height - 100) + 50;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.tailSpeed = 0.25;
    } else if (lowerSpecies.includes('shrimp')) {
      this.type = 'crawling';
      this.size = 10 + Math.random() * 4;
      this.color = lowerSpecies.includes('cherry') ? '#f43f5e' : '#a8a29e'; // Red vs grey transparent
      this.accentColor = '#ffffff';
      this.y = height - 15; // on the gravel
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = 0;
      this.tailSpeed = 0.05;
    } else if (lowerSpecies.includes('otocinclus') || lowerSpecies.includes('catfish') || lowerSpecies.includes('pleco')) {
      this.type = 'clinging';
      this.size = 18 + Math.random() * 4;
      this.color = '#451a03'; // Brownish dark
      this.accentColor = '#e7e5e4';
      this.y = Math.random() * (height - 60) + 30;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.tailSpeed = 0.15;
    } else if (lowerSpecies.includes('clownfish')) {
      this.type = 'reef';
      this.size = 22 + Math.random() * 5;
      this.color = '#f97316'; // Bright orange
      this.accentColor = '#ffffff'; // White stripes
      this.y = Math.random() * (height - 120) + 60;
      this.vx = (Math.random() - 0.5) * 1.0;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.tailSpeed = 0.18;
    } else if (lowerSpecies.includes('tang') || lowerSpecies.includes('dory')) {
      this.type = 'reef';
      this.size = 28 + Math.random() * 6;
      this.color = '#1d4ed8'; // Deep blue
      this.accentColor = '#eab308'; // Yellow tail
      this.y = Math.random() * (height - 120) + 60;
      this.vx = (Math.random() - 0.5) * 1.6;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.tailSpeed = 0.22;
    } else {
      // Default / standard freshwater fish
      this.type = 'standard';
      this.size = 20 + Math.random() * 8;
      this.color = '#f59e0b'; // Amber Goldfish style
      this.accentColor = '#ef4444';
      this.y = Math.random() * (height - 100) + 50;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.tailSpeed = 0.15;
    }
  }

  update(width: number, height: number, foods: Food[], activeTaps: {x: number, y: number, radius: number, maxRadius: number}[], isLightsOff: boolean) {
    // Tail animation
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.tailAngle += speed * this.tailSpeed + 0.05;

    // React to glass tapping
    for (const tap of activeTaps) {
      const dx = this.x - tap.x;
      const dy = this.y - tap.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < tap.radius + 100 && dist > 1) {
        // Scare effect! Dash away
        const force = (1 - dist / (tap.radius + 100)) * 6;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        this.scaredTimer = 40; // 40 frames of high speed
      }
    }

    if (this.scaredTimer > 0) {
      this.scaredTimer--;
    }

    // Crawling shrimp logic
    if (this.type === 'crawling') {
      this.y = height - 15; // stay on bottom
      this.vy = 0;

      // Sometimes jump to crawl somewhere else
      if (Math.random() < 0.005 && this.scaredTimer === 0) {
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 2 - 1.5;
        this.y += this.vy;
      }

      if (this.y < height - 15) {
        this.vy += 0.1; // gravity
        this.y += this.vy;
        this.x += this.vx;
      } else {
        this.x += this.vx;
        // Friction on bottom
        this.vx *= 0.95;
        if (Math.abs(this.vx) < 0.05 && Math.random() < 0.05) {
          this.vx = (Math.random() - 0.5) * 0.5;
        }
      }
    } else if (this.type === 'clinging') {
      // Otocinclus stick to walls or glass
      if (Math.random() < 0.01 && this.scaredTimer === 0) {
        // Detach and swim to a new spot
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Stick to boundary
      if (this.x < 15 || this.x > width - 15 || this.y < 20 || this.y > height - 25) {
        this.vx *= 0.1;
        this.vy *= 0.1;
      }
    } else {
      // Free swimmers
      // Schooling/Tetra behavior - attraction to nearest tetra
      if (this.type === 'schooling' && Math.random() < 0.1 && this.scaredTimer === 0) {
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.05;
      }

      // Food tracking
      if (foods.length > 0 && this.scaredTimer === 0) {
        // Find nearest food
        let nearestFood: Food | null = null;
        let minDist = 99999;
        
        for (const food of foods) {
          if (!food.active) continue;
          const dx = food.x - this.x;
          const dy = food.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            nearestFood = food;
          }
        }

        if (nearestFood && minDist < 200) {
          // Steer towards food
          const dx = (nearestFood as Food).x - this.x;
          const dy = (nearestFood as Food).y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const targetVx = (dx / dist) * (this.type === 'schooling' ? 1.8 : 2.5);
          const targetVy = (dy / dist) * (this.type === 'schooling' ? 0.8 : 1.5);
          
          this.vx += (targetVx - this.vx) * 0.1;
          this.vy += (targetVy - this.vy) * 0.1;

          // Check consumption
          if (dist < this.size * 0.7) {
            (nearestFood as Food).active = false;
          }
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Natural drag
      const maxSpd = this.scaredTimer > 0 ? 5 : (isLightsOff ? 0.4 : 2);
      const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > maxSpd) {
        this.vx = (this.vx / currentSpeed) * maxSpd;
        this.vy = (this.vy / currentSpeed) * maxSpd;
      }
    }

    // Keep within boundaries (bounce)
    const margin = 20;
    if (this.x < margin) {
      this.x = margin;
      this.vx = Math.abs(this.vx) * 0.8;
    } else if (this.x > width - margin) {
      this.x = width - margin;
      this.vx = -Math.abs(this.vx) * 0.8;
    }

    const yBottomMargin = this.type === 'crawling' ? 15 : 25;
    if (this.y < margin) {
      this.y = margin;
      this.vy = Math.abs(this.vy) * 0.8;
    } else if (this.y > height - yBottomMargin) {
      this.y = height - yBottomMargin;
      this.vy = -Math.abs(this.vy) * 0.8;
    }
  }

  draw(ctx: CanvasRenderingContext2D, isLightsOff: boolean) {
    ctx.save();
    
    // Position translation
    ctx.translate(this.x, this.y);
    
    // Flip fish graphic based on velocity direction
    const direction = this.vx >= 0 ? 1 : -1;
    ctx.scale(direction, 1);

    // Glow effect for night mode
    if (isLightsOff) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
    }

    // Draw custom body shape based on type
    if (this.type === 'crawling') {
      // Draw Shrimp
      ctx.fillStyle = this.color;
      // Head and body curve
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.6, this.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Tail tailsegments
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.4, 0);
      ctx.quadraticCurveTo(-this.size * 0.8, this.size * 0.2, -this.size, 0);
      ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.2, -this.size * 0.4, 0);
      ctx.fill();

      // Antennae
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(this.size * 0.5, -this.size * 0.1);
      ctx.quadraticCurveTo(this.size, -this.size * 0.5, this.size * 1.2, -this.size * 0.8);
      ctx.stroke();

      // Small crawling legs
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i += 2) {
        ctx.beginPath();
        ctx.moveTo(i, this.size * 0.2);
        ctx.lineTo(i + 2, this.size * 0.4 + Math.sin(this.tailAngle + i) * 2);
        ctx.stroke();
      }
    } else {
      // Fish drawing
      const bodyWidth = this.size;
      const bodyHeight = this.size * 0.5;

      // Draw Main Body
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyWidth * 0.6, bodyHeight * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Color accents based on species
      if (this.species.toLowerCase().includes('neon')) {
        // Neon stripe
        ctx.fillStyle = '#67e8f9'; // neon bright blue stripe
        ctx.beginPath();
        ctx.ellipse(0, -bodyHeight * 0.15, bodyWidth * 0.5, bodyHeight * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.accentColor; // Red bottom half
        ctx.beginPath();
        ctx.ellipse(-bodyWidth * 0.1, bodyHeight * 0.3, bodyWidth * 0.35, bodyHeight * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.species.toLowerCase().includes('clownfish')) {
        // White stripes
        ctx.fillStyle = this.accentColor;
        ctx.fillRect(-bodyWidth * 0.1, -bodyHeight * 0.7, bodyWidth * 0.15, bodyHeight * 1.4);
        ctx.fillRect(bodyWidth * 0.2, -bodyHeight * 0.5, bodyWidth * 0.1, bodyHeight * 1.0);
        // Black trim
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.strokeRect(-bodyWidth * 0.1, -bodyHeight * 0.7, bodyWidth * 0.15, bodyHeight * 1.4);
        ctx.strokeRect(bodyWidth * 0.2, -bodyHeight * 0.5, bodyWidth * 0.1, bodyHeight * 1.0);
      } else if (this.species.toLowerCase().includes('tang') || this.species.toLowerCase().includes('dory')) {
        // Black side stripe
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bodyWidth * 0.2, -bodyHeight * 0.1);
        ctx.quadraticCurveTo(-bodyWidth * 0.1, -bodyHeight * 0.6, -bodyWidth * 0.4, 0);
        ctx.stroke();
      }

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bodyWidth * 0.35, -bodyHeight * 0.2, bodyWidth * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bodyWidth * 0.37, -bodyHeight * 0.2, bodyWidth * 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Tail Fin (swaying)
      ctx.fillStyle = this.accentColor || this.color;
      ctx.beginPath();
      const tailX = -bodyWidth * 0.55;
      const tailY = 0;
      const wiggle = Math.sin(this.tailAngle) * (bodyHeight * 0.5);
      
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(tailX - bodyWidth * 0.45, tailY - bodyHeight * 0.8 + wiggle);
      ctx.quadraticCurveTo(tailX - bodyWidth * 0.3, tailY + wiggle, tailX - bodyWidth * 0.45, tailY + bodyHeight * 0.8 + wiggle);
      ctx.closePath();
      ctx.fill();

      // Pectoral Fin
      ctx.fillStyle = this.accentColor || this.color;
      ctx.save();
      ctx.translate(bodyWidth * 0.1, bodyHeight * 0.2);
      ctx.rotate(0.3 + Math.sin(this.tailAngle) * 0.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyWidth * 0.2, bodyHeight * 0.3, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}

export default function VirtualAquarium({ hasGravel, isPlanted, fish, plants }: VirtualAquariumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLightsOff, setIsLightsOff] = useState<boolean>(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [taps, setTaps] = useState<{x: number, y: number, radius: number, maxRadius: number}[]>([]);

  // Keep foods and taps in ref so animation loop always has latest references without re-binding
  const foodsRef = useRef<Food[]>([]);
  const tapsRef = useRef<{x: number, y: number, radius: number, maxRadius: number}[]>([]);
  foodsRef.current = foods;
  tapsRef.current = taps;

  const handleFeed = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // Spawn 5 pieces of food distributed horizontally near center
    const newFoods = [...foodsRef.current];
    for (let i = 0; i < 6; i++) {
      const spawnX = Math.random() * (canvas.width - 80) + 40;
      newFoods.push(new Food(spawnX));
    }
    setFoods(newFoods);
  };

  const handleTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add glass tap ripple
    const newTaps = [...tapsRef.current, { x, y, radius: 0, maxRadius: 70 }];
    setTaps(newTaps);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 300);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize bubbles
    const bubbleCount = Math.floor(width / 20);
    const bubbles: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble(width, height));
    }

    // Initialize fish based on profiles passed in
    const activeFish: Fish[] = [];
    fish.forEach((f) => {
      // Cap max rendered fish for performance to 35
      const renderQty = Math.min(f.quantity, 15);
      for (let i = 0; i < renderQty; i++) {
        activeFish.push(new Fish(width, height, f.species));
      }
    });

    // If no fish, add 3 default ones so the tank isn't empty!
    if (activeFish.length === 0) {
      activeFish.push(new Fish(width, height, 'Neon Tetra'));
      activeFish.push(new Fish(width, height, 'Orange Goldfish'));
      activeFish.push(new Fish(width, height, 'Zebra Danio'));
    }

    let time = 0;

    // Simulation render loop
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Water Background Gradient
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isLightsOff) {
        waterGrad.addColorStop(0, '#020617'); // Abyssal night colors
        waterGrad.addColorStop(0.6, '#0f172a');
        waterGrad.addColorStop(1, '#1e1b4b');
      } else {
        waterGrad.addColorStop(0, '#bae6fd'); // Sunlit sky-blue
        waterGrad.addColorStop(0.3, '#38bdf8'); // Soft water blue
        waterGrad.addColorStop(0.8, '#0284c7'); // Ocean deep blue
        waterGrad.addColorStop(1, '#075985');
      }
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Sunbeams (Daytime only)
      if (!isLightsOff) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 4; i++) {
          const shift = Math.sin(time * 0.5 + i) * 30;
          ctx.beginPath();
          ctx.moveTo(width * 0.2 + i * 150 + shift, 0);
          ctx.lineTo(width * 0.35 + i * 150 + shift * 1.5, height);
          ctx.lineTo(width * 0.25 + i * 150 + shift * 1.5, height);
          ctx.lineTo(width * 0.15 + i * 150 + shift, 0);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Draw Back Wall Rocks (Ambient background)
      ctx.fillStyle = isLightsOff ? '#111827' : '#1e293b';
      ctx.beginPath();
      // Draw some background rock mounds
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(width * 0.15, height - 60, width * 0.35, height - 10);
      ctx.quadraticCurveTo(width * 0.65, height - 80, width * 0.8, height - 20);
      ctx.quadraticCurveTo(width * 0.92, height - 50, width, height - 10);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 4. Draw Swaying Aquatic Plants (Flora)
      ctx.save();
      const plantQty = plants.reduce((sum, p) => sum + p.quantity, 0) || (isPlanted ? 8 : 1);
      const renderPlants = Math.min(plantQty, 12);
      ctx.strokeStyle = isLightsOff ? '#065f46' : '#10b981';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      
      for (let i = 0; i < renderPlants; i++) {
        // Distribute plants along bottom
        const plantX = (width / (renderPlants + 1)) * (i + 1);
        const plantH = height * 0.3 + Math.sin(i * 123.4) * (height * 0.15);
        const sway = Math.sin(time + i) * 15;
        
        ctx.beginPath();
        ctx.moveTo(plantX, height - 10);
        ctx.bezierCurveTo(
          plantX - sway * 0.5, height - 10 - plantH * 0.4,
          plantX + sway * 0.8, height - 10 - plantH * 0.7,
          plantX + sway, height - 10 - plantH
        );
        ctx.stroke();

        // Draw small leaves along plant stems
        ctx.fillStyle = isLightsOff ? '#047857' : '#34d399';
        for (let j = 0.2; j <= 1.0; j += 0.2) {
          const leafY = height - 10 - plantH * j;
          const leafX = plantX + sway * j;
          ctx.beginPath();
          ctx.arc(leafX - 6, leafY, 4, 0, Math.PI * 2);
          ctx.arc(leafX + 6, leafY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 5. Update and Draw Bubbles (Filter effect)
      bubbles.forEach((b) => {
        b.update(height);
        b.draw(ctx);
      });

      // 6. Update and Draw Foods
      const currentFoods = foodsRef.current.filter(f => f.active);
      currentFoods.forEach((food) => {
        food.update(height);
        food.draw(ctx);
      });
      if (currentFoods.length !== foodsRef.current.length) {
        setFoods(currentFoods);
      }

      // 7. Update and Draw Glass Taps (Ripple)
      const currentTaps = tapsRef.current.map(t => ({
        ...t,
        radius: t.radius + 2.5
      })).filter(t => t.radius < t.maxRadius);
      
      currentTaps.forEach((t) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - t.radius / t.maxRadius})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();
        
        // Inner secondary ripple
        if (t.radius > 15) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius - 12, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - t.radius / t.maxRadius) * 0.5})`;
          ctx.stroke();
        }
        ctx.restore();
      });
      if (currentTaps.length !== tapsRef.current.length) {
        setTaps(currentTaps);
      }

      // 8. Update and Draw Fish Fauna
      activeFish.forEach((f) => {
        f.update(width, height, currentFoods, currentTaps, isLightsOff);
        f.draw(ctx, isLightsOff);
      });

      // 9. Draw Substrate (Gravel vs Bare Bottom)
      ctx.save();
      if (hasGravel) {
        // Draw gravel/pebbles
        const gravelHeight = 15;
        const grad = ctx.createLinearGradient(0, height - gravelHeight, 0, height);
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(1, '#475569');
        ctx.fillStyle = grad;
        ctx.fillRect(0, height - gravelHeight, width, gravelHeight);

        // Individual gravel details for premium look
        ctx.fillStyle = '#64748b';
        for (let i = 0; i < width; i += 12) {
          const pebbleH = 4 + Math.sin(i) * 3;
          ctx.beginPath();
          ctx.ellipse(i + 6, height - gravelHeight + 2, 6, pebbleH, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Bare glass bottom with faint reflection line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, height - 6, width, 6);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, height - 2, width, 2);
      }
      ctx.restore();

      // 10. Glass reflections & Light Shimmer (Overlay)
      ctx.save();
      const glassGrad = ctx.createLinearGradient(0, 0, width, height);
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      glassGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
      glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      glassGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.02)');
      glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = glassGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fish, plants, hasGravel, isPlanted, isLightsOff]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '350px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3), inset 0 0 1px 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Canvas view viewport */}
      <canvas 
        ref={canvasRef}
        onClick={handleTap}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'pointer',
        }}
      />

      {/* Floating control buttons */}
      <div 
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '1.25rem',
          display: 'flex',
          gap: '0.75rem',
          zIndex: 5,
        }}
      >
        <button 
          onClick={handleFeed}
          className="btn"
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
          }}
        >
          🦐 Feed Habitat
        </button>
        <button 
          onClick={() => {
            setTaps([...tapsRef.current, { 
              x: (canvasRef.current?.width || 800) / 2, 
              y: (canvasRef.current?.height || 300) / 2, 
              radius: 0, 
              maxRadius: 100 
            }]);
          }}
          className="btn"
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
          }}
        >
          ✊ Tap Glass
        </button>
      </div>

      {/* Top right day/night selector */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 5,
        }}
      >
        <button
          onClick={() => setIsLightsOff(!isLightsOff)}
          className="btn"
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          {isLightsOff ? '☀️ Day Light' : '🌙 Night Glow'}
        </button>
      </div>

      {/* Floating immersive label overlay */}
      <div 
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          right: '1.25rem',
          background: 'rgba(15, 23, 42, 0.5)',
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.7rem',
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none',
        }}
      >
        ⚡ Live Ecosystem Simulation
      </div>
    </div>
  );
}
