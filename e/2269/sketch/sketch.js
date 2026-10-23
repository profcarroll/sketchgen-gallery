// Fungal hyphae network on forest floor
let hyphae = [];
const NUM_HYPHAE = 800;
const MAX_SEGMENTS = 15;
const SEGMENT_LENGTH = 8;
const STIFFNESS = 0.1;
const DAMPING = 0.95;
const GRAVITY = 0.02;
const SUBTERRANEAN_VIBRATION = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create hyphae network
  for (let i = 0; i < NUM_HYPHAE; i++) {
    hyphae.push({
      segments: [],
      baseX: random(width),
      baseY: height + random(100, 300),
      color: color(random(80, 120), random(40, 70), random(20, 50)),
      vibrationPhase: random(TWO_PI)
    });
    
    // Initialize segments
    const h = hyphae[i];
    for (let j = 0; j < MAX_SEGMENTS; j++) {
      h.segments.push({
        x: h.baseX,
        y: h.baseY - j * SEGMENT_LENGTH,
        vx: 0,
        vy: 0,
        radius: map(j, 0, MAX_SEGMENTS-1, 2, 0.5)
      });
    }
  }
}

function draw() {
  background(20, 30, 15);
  
  // Apply physics to each hyphae
  for (let i = 0; i < hyphae.length; i++) {
    const h = hyphae[i];
    
    // Subterranean vibration effect
    const vibration = sin(frameCount * SUBTERRANEAN_VIBRATION + h.vibrationPhase) * 0.5;
    
    // Apply gravity and vibration to base segment
    h.segments[0].vy += GRAVITY;
    h.segments[0].vx += vibration * 0.3;
    
    // Update each segment
    for (let j = 0; j < h.segments.length; j++) {
      const s = h.segments[j];
      
      // Apply damping
      s.vx *= DAMPING;
      s.vy *= DAMPING;
      
      // Apply gravity and vibration
      s.vy += GRAVITY;
      s.vx += vibration * 0.1;
      
      // Update position
      s.x += s.vx;
      s.y += s.vy;
      
      // Boundary constraints
      if (s.y > height) {
        s.y = height;
        s.vy *= -0.3;
      }
      
      if (s.x < 0) {
        s.x = 0;
        s.vx *= -0.5;
      } else if (s.x > width) {
        s.x = width;
        s.vx *= -0.5;
      }
    }
    
    // Apply spring forces between segments
    for (let j = 0; j < h.segments.length - 1; j++) {
      const a = h.segments[j];
      const b = h.segments[j + 1];
      
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const diff = (SEGMENT_LENGTH - distance) / distance;
        const offsetX = dx * diff * STIFFNESS;
        const offsetY = dy * diff * STIFFNESS;
        
        a.vx -= offsetX * 0.5;
        a.vy -= offsetY * 0.5;
        b.vx += offsetX * 0.5;
        b.vy += offsetY * 0.5;
      }
    }
  }
  
  // Draw hyphae
  noFill();
  for (let i = 0; i < hyphae.length; i++) {
    const h = hyphae[i];
    
    stroke(h.color);
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < h.segments.length; j++) {
      const s = h.segments[j];
      vertex(s.x, s.y);
    }
    endShape();
    
    // Draw root-like tendrils
    stroke(red(h.color), green(h.color), blue(h.color), 150);
    strokeWeight(0.5);
    
    for (let j = 0; j < h.segments.length; j += 3) {
      const s = h.segments[j];
      const next = h.segments[j + 1] || s;
      
      // Draw tendrils from segments
      const angle = atan2(next.y - s.y, next.x - s.x);
      const length = random(5, 15);
      
      line(s.x, s.y, s.x + cos(angle) * length, s.y + sin(angle) * length);
    }
  }
  
  // Add subtle glow effect
  blendMode(ADD);
  noStroke();
  fill(0, 0, 0, 5);
  rect(0, 0, width, height);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
