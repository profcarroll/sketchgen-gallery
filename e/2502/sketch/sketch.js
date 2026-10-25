let structures = [];
let time = 0;
let connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create glowing geometric structures with intersecting planes
  for (let i = 0; i < 25; i++) {
    structures.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-500, 500)
      ),
      size: random(100, 250),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.004),
      hue: random(180, 300), // Electric blue/purple palette
      segments: floor(random(3, 6)),
      wavePhase: random(TWO_PI),
      layerHeight: random(8, 25)
    });
  }
  
  // Pre-compute connections for performance
  for (let i = 0; i < structures.length; i++) {
    for (let j = i + 1; j < structures.length; j++) {
      const d = p5.Vector.dist(structures[i].pos, structures[j].pos);
      if (d < 350) {
        connections.push({
          s1: i,
          s2: j,
          distance: d
        });
      }
    }
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Slow rotation of entire scene to simulate deep-sea drift
  rotateY(time * 0.0002);
  rotateX(sin(time * 0.0001) * 0.05);
  
  time++;
  
  // Draw structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    // Update wave phase for pulsing effect
    s.wavePhase += s.speed;
    
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateZ(s.rotation + sin(time * 0.001) * 0.15);
    
    // Draw layered intersecting planes
    const wave = sin(s.wavePhase) * 0.5 + 0.5;
    const hue = (s.hue + time * 0.2) % 360;
    const bright = map(wave, 0, 1, 50, 90);
    
    // Draw multiple horizontal layers
    for (let j = 0; j < s.segments; j++) {
      const layerOffset = (j - s.segments/2) * s.layerHeight;
      const layerSize = s.size * (0.7 + wave * 0.3);
      
      push();
      translate(0, 0, layerOffset);
      
      // Glow effect with pulsing intensity
      fill(hue, 90, bright, 0.5);
      
      // Create intersecting plane geometry
      drawIntersectingPlane(layerSize, layerSize, wave);
      
      pop();
    }
    
    pop();
  }
  
  // Draw connecting lines with rhythmic pulsing
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    const s1 = structures[conn.s1];
    const s2 = structures[conn.s2];
    
    const d = conn.distance;
    // Calculate proximity-based pulse effect
    const proximity = map(d, 0, 350, 1, 0);
    const pulse = sin(time * 0.008 + d * 0.002) * 0.5 + 0.5;
    
    // Intense pulse when planes are in critical proximity
    const pulseIntensity = map(proximity, 0, 1, 0, 1);
    const finalPulse = pow(pulseIntensity, 3) * 0.8 + 0.2;
    
    const lHue = (s1.hue + s2.hue) / 2;
    const bright = map(proximity, 0, 1, 40, 95);
    
    stroke(lHue, 100, bright * finalPulse, 0.8);
    
    vertex(s1.pos.x, s1.pos.y, s1.pos.z);
    vertex(s2.pos.x, s2.pos.y, s2.pos.z);
  }
  endShape();
}

function drawIntersectingPlane(w, h, wave) {
  const segmentsW = 8;
  const segmentsH = 8;
  
  beginShape(QUADS);
  for (let i = 0; i < segmentsW; i++) {
    for (let j = 0; j < segmentsH; j++) {
      const x1 = map(i, 0, segmentsW - 1, -w/2, w/2);
      const y1 = map(j, 0, segmentsH - 1, -h/2, h/2);
      const x2 = map(i + 1, 0, segmentsW - 1, -w/2, w/2);
      const y2 = map(j + 1, 0, segmentsH - 1, -h/2, h/2);
      
      // Add subtle distortion for organic feel
      const distX = (x1 + x2) / 2;
      const distY = (y1 + y2) / 2;
      const distortion = sin(distX * 0.03 + time * 0.002) * 
                         cos(distY * 0.03 + time * 0.003) * 
                         10 * wave;
      
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
