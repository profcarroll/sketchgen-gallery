let burners = [];
let dialAngle = 0;
let dialPressed = false;
let glowMap;

class Burner {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.active = false;
    this.glowIntensity = 0;
    this.flameIntensity = 0;
    this.particles = [];
  }

  update(active, intensity) {
    this.active = active;
    this.flameIntensity = intensity;
    this.glowIntensity = map(intensity, 0, 1, 0, 255);
    
    if (this.active && this.flameIntensity > 0) {
      // Limit particles to prevent memory leak
      while (this.particles.length > 100) {
        this.particles.shift();
      }
      
      // Add new particles
      for (let i = 0; i < 3; i++) {
        if (this.particles.length < 100) {
          let p = {
            x: this.x + random(-5, 5),
            y: this.y - random(0, 20),
            size: random(2, 6),
            speed: random(0.5, 2),
            life: 255,
            r: map(random(), 0, 1, 150, 255),
            g: map(random(), 0, 1, 50, 150),
            b: map(random(), 0, 1, 0, 100)
          };
          this.particles.push(p);
        }
      }
      
      // Update existing particles
      for (let p of this.particles) {
        p.y -= p.speed;
        p.life -= 3;
        p.size *= 0.97;
      }
    } else {
      this.particles = [];
    }
  }

  display() {
    // Burner casing
    fill(50);
    stroke(30);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);

    // Glow effect when active
    if (this.active && this.glowIntensity > 0) {
      noStroke();
      for (let i = 0; i < 5; i++) {
        let alpha = map(i, 0, 4, this.glowIntensity, 0);
        fill(255, 50, 50, alpha);
        ellipse(this.x, this.y, this.radius * 2 + i * 3);
      }
    }

    // Flame effect
    if (this.active && this.flameIntensity > 0) {
      let flameHeight = map(this.flameIntensity, 0, 1, 0, 40);
      
      noStroke();
      for (let p of this.particles) {
        if (p.life > 0) {
          fill(p.r, p.g, p.b, p.life);
          ellipse(p.x, p.y, p.size);
        }
      }
      
      let flameBase = this.y - 15;
      let flameTop = flameBase - flameHeight;
      
      for (let i = 0; i < 8; i++) {
        let t = map(i, 0, 7, 0, 1);
        let r = lerp(50, 255, t);
        let g = lerp(100, 150, t);
        let b = lerp(200, 50, t);
        
        let alpha = map(i, 0, 7, 200, 0);
        fill(r, g, b, alpha);
        noStroke();
        
        beginShape();
        vertex(this.x, flameBase);
        vertex(this.x - i * 2, flameTop + i * 3);
        vertex(this.x + i * 2, flameTop + i * 3);
        endShape(CLOSE);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  let centerX = width / 2;
  let centerY = height / 2;

  // Create burners in a circular arrangement
  let numBurners = 4;
  let radius = min(width, height) * 0.3;
  for (let i = 0; i < numBurners; i++) {
    let angle = map(i, 0, numBurners, 0, TWO_PI);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    burners.push(new Burner(x, y, 20));
  }

  // Initialize glow map
  glowMap = createGraphics(width, height);
  glowMap.noStroke();
}

function draw() {
  background(30);

  // Draw stovetop surface
  fill(80);
  stroke(60);
  strokeWeight(1);
  sphere(min(width, height) * 0.4, 32, 32);

  // Draw dial
  let centerX = width / 2;
  let centerY = height / 2;
  let dialRadius = 50;

  stroke(100);
  strokeWeight(3);
  noFill();
  ellipse(centerX, centerY, dialRadius * 2);

  // Dial indicator line
  let indicatorAngle = dialAngle + PI / 2;
  stroke(255);
  strokeWeight(2);
  line(
    centerX,
    centerY,
    centerX + cos(indicatorAngle) * dialRadius,
    centerY + sin(indicatorAngle) * dialRadius
  );

  // Draw burners
  for (let burner of burners) {
    burner.display();
  }

  // Apply glow map to metal surface
  image(glowMap, -width/2, -height/2);
}

function mousePressed() {
  let centerX = width / 2;
  let centerY = height / 2;
  let d = dist(mouseX, mouseY, centerX, centerY);
  if (d < 50) {
    dialPressed = true;
  }
}

function mouseReleased() {
  dialPressed = false;
}

function mouseDragged() {
  if (!dialPressed) return;

  let centerX = width / 2;
  let centerY = height / 2;
  let angle = atan2(mouseY - centerY, mouseX - centerX);
  dialAngle = angle;

  // Normalize to [0, 2π]
  if (dialAngle < 0) dialAngle += TWO_PI;

  // Update burners based on dial position
  let numBurners = burners.length;
  for (let i = 0; i < numBurners; i++) {
    let angleDiff = abs(angle - map(i, 0, numBurners, 0, TWO_PI));
    if (angleDiff > PI) angleDiff = TWO_PI - angleDiff;

    // Map to flame intensity
    let intensity = map(angleDiff, 0, PI, 1, 0);
    intensity = constrain(intensity, 0, 1);

    burners[i].update(true, intensity);
  }
  
  // Clear glow map
  glowMap.loadPixels();
  for (let i = 0; i < glowMap.pixels.length; i += 4) {
    glowMap.pixels[i] = 0;
    glowMap.pixels[i + 1] = 0;
    glowMap.pixels[i + 2] = 0;
    glowMap.pixels[i + 3] = 0;
  }
  glowMap.updatePixels();
  
  // Draw glow effect on metal surface directly under active flames
  for (let burner of burners) {
    if (burner.active && burner.glowIntensity > 0) {
      let glowRadius = map(burner.flameIntensity, 0, 1, 30, 80);
      let centerX = burner.x;
      let centerY = burner.y;
      
      // Draw a radial glow pattern
      for (let i = 0; i < 200; i++) {
        let angle = random(TWO_PI);
        let distFromCenter = random(glowRadius);
        let x = centerX + cos(angle) * distFromCenter;
        let y = centerY + sin(angle) * distFromCenter;
        
        if (x >= 0 && x < width && y >= 0 && y < height) {
          let pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
          glowMap.pixels[pixelIndex] = 255;         // R
          glowMap.pixels[pixelIndex + 1] = 50;      // G
          glowMap.pixels[pixelIndex + 2] = 50;      // B
          glowMap.pixels[pixelIndex + 3] = map(burner.glowIntensity, 0, 255, 100, 255); // A
        }
      }
    }
  }
  
  glowMap.updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
