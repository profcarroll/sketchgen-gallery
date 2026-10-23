let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geometric structures with intersecting planes
  for (let i = 0; i < 50; i++) {
    structures.push({
      pos: createVector(
        random(-width/3, width/3),
        random(-height/3, height/3),
        random(-200, 200)
      ),
      size: random(50, 150),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003),
      hue: random(0, 360),
      segments: floor(random(3, 8)),
      wavePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Slow rotation of entire scene
  rotateY(time * 0.0005);
  rotateX(sin(time * 0.0003) * 0.1);
  
  time++;
  
  // Draw structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    // Update wave phase
    s.wavePhase += s.speed;
    
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateZ(s.rotation + sin(time * 0.002) * 0.3);
    
    // Draw intersecting planes with pulsing glow
    const wave = sin(s.wavePhase) * 0.5 + 0.5;
    const hue = (s.hue + time * 0.2) % 360;
    const bright = map(wave, 0, 1, 40, 90);
    
    // Draw multiple planes
    for (let j = 0; j < s.segments; j++) {
      const angle = (j / s.segments) * TWO_PI + time * 0.001;
      const planeSize = s.size * (0.7 + wave * 0.3);
      
      push();
      rotate(angle);
      
      // Glow effect based on wave
      fill(hue, 90, bright, 0.7);
      plane(planeSize, planeSize);
      
      pop();
    }
    
    // Draw connecting lines between structures
    beginShape(LINES);
    for (let j = i + 1; j < structures.length; j++) {
      const s2 = structures[j];
      const d = p5.Vector.dist(s.pos, s2.pos);
      
      if (d < 300) {
        // Line intensity based on distance
        const intensity = map(d, 0, 300, 1, 0.1);
        const lHue = (s.hue + s2.hue) / 2;
        
        stroke(lHue, 90, map(intensity, 0, 1, 40, 90), 0.6);
        
        vertex(s.pos.x, s.pos.y, s.pos.z);
        vertex(s2.pos.x, s2.pos.y, s2.pos.z);
      }
    }
    endShape();
    
    pop();
  }
}

function plane(w, h) {
  // Draw a rectangular plane with subtle distortion
  const segmentsW = 8;
  const segmentsH = 8;
  
  beginShape(QUADS);
  for (let i = 0; i < segmentsW; i++) {
    for (let j = 0; j < segmentsH; j++) {
      const x1 = map(i, 0, segmentsW - 1, -w/2, w/2);
      const y1 = map(j, 0, segmentsH - 1, -h/2, h/2);
      const x2 = map(i + 1, 0, segmentsW - 1, -w/2, w/2);
      const y2 = map(j + 1, 0, segmentsH - 1, -h/2, h/2);
      
      // Add wave distortion
      const distX = (x1 + x2) / 2;
      const distY = (y1 + y2) / 2;
      const distortion = sin(distX * 0.01 + time * 0.005) * cos(distY * 0.01 + time * 0.003) * 20;
      
      vertex(x1, y1, distortion);
      vertex(x2, y1, distortion);
      vertex(x2, y2, distortion);
      vertex(x1, y2, distortion);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
