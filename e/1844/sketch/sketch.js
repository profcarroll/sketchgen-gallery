let blocks = [];
const gravity = 0.1;
const friction = 0.99;
const maxBlocks = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize blocks
  for (let i = 0; i < 50; i++) {
    addBlock();
  }
}

function draw() {
  background(0, 0, 0, 0.03); // Semi-transparent background for trail effect

  // Add new blocks occasionally
  if (frameCount % 2 === 0 && blocks.length < maxBlocks) {
    addBlock();
  }

  // Update and display blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    b.update();
    b.display();

    // Remove blocks that fall off screen
    if (b.y > height + 50 || b.x < -50 || b.x > width + 50) {
      blocks.splice(i, 1);
    }
  }
}

function addBlock() {
  const x = random(width);
  const y = -20;
  const w = random(8, 30);
  const h = random(15, 40);
  const angle = random(TWO_PI);
  const speed = random(0.5, 3);
  const hue = random(360);
  const irregularity = random(0.7, 1.3);

  blocks.push({
    x: x,
    y: y,
    w: w,
    h: h,
    angle: angle,
    rotation: random(-0.05, 0.05),
    speed: speed,
    hue: hue,
    irregularity: irregularity,
    update: function() {
      // Spiral motion
      this.angle += 0.01;
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;
      
      // Add gravity effect
      this.y += gravity;
      
      // Rotation and friction
      this.angle += this.rotation;
      this.speed *= friction;
    },
    display: function() {
      push();
      translate(this.x, this.y);
      rotate(this.angle);
      
      // Create translucent glass effect using HSB
      const baseHue = (this.hue + frameCount * 0.3) % 360;
      fill(baseHue, 80, 90, 0.5); // Translucent glass color
      
      // Draw irregular rectangle with slight deformation
      const points = [];
      for (let i = 0; i < 4; i++) {
        const angle = i * HALF_PI;
        const px = cos(angle) * this.w * 0.5 * this.irregularity;
        const py = sin(angle) * this.h * 0.5 * this.irregularity;
        points.push({x: px, y: py});
      }
      
      // Create irregular shape by slightly modifying vertices
      for (let i = 0; i < points.length; i++) {
        const mod = random(-2, 2);
        if (i % 2 === 0) points[i].x += mod;
        else points[i].y += mod;
      }
      
      beginShape();
      for (const p of points) {
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
      
      // Add subtle refraction highlights
      fill((baseHue + 30) % 360, 100, 100, 0.4);
      rect(-this.w * 0.2, -this.h * 0.2, this.w * 0.4, this.h * 0.4);
      
      pop();
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
