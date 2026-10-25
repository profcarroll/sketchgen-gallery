let structures = [];
let time = 0;
let connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create travertine-like layered structures from corrugated cardboard
  for (let i = 0; i < 30; i++) {
    structures.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-500, 500)
      ),
      size: random(80, 200),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.003),
      hue: random(20, 60), // Earthy tones for travertine
      segments: floor(random(4, 8)),
      wavePhase: random(TWO_PI),
      layerHeight: random(5, 20)
    });
  }
  
  // Pre-compute connections for performance
  for (let i = 0; i < structures.length; i++) {
    for (let j = i + 1; j < structures.length; j++) {
      const d = p5.Vector.dist(structures[i].pos, structures[j].pos);
      if (d < 400) {
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
  
  // Slow rotation of entire scene to simulate dig site view
  rotateY(time * 0.0003);
  rotateX(sin(time * 0.0002) * 0.1);
  
  time++;
  
  // Draw structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    // Update wave phase for pulsing effect
    s.wavePhase += s.speed;
    
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateZ(s.rotation + sin(time * 0.001) * 0.2);
    
    // Draw layered corrugated cardboard structure
    const wave = sin(s.wavePhase) * 0.5 + 0.5;
    const hue = (s.hue + time * 0.1) % 360;
    const bright = map(wave, 0, 1, 40, 80);
    
    // Draw multiple horizontal layers
    for (let j = 0; j < s.segments; j++) {
      const layerOffset = (j - s.segments/2) * s.layerHeight;
      const layerSize = s.size * (0.8 + wave * 0.2);
      
      push();
      translate(0, 0, layerOffset);
      
      // Glow effect with pulsing intensity
      fill(hue, 80, bright, 0.6);
      
      // Create corrugated cardboard effect with slight distortion
      drawCorrugatedPlane(layerSize, layerSize, wave);
      
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
    const pulse = sin(time * 0.005 + d * 0.001) * 0.5 + 0.5; // Rhythmic pulsing
    const intensity = map(d, 0, 400, 1, 0.2);
    
    const lHue = (s1.hue + s2.hue) / 2;
    const bright = map(intensity, 0, 1, 30, 80);
    
    stroke(lHue, 90, bright * pulse, 0.7);
    
    vertex(s1.pos.x, s1.pos.y, s1.pos.z);
    vertex(s2.pos.x, s2.pos.y, s2.pos.z);
  }
  endShape();
}

function drawCorrugatedPlane(w, h, wave) {
  const segmentsW = 6;
  const segmentsH = 6;
  
  beginShape(QUADS);
  for (let i = 0; i < segmentsW; i++) {
    for (let j = 0; j < segmentsH; j++) {
      const x1 = map(i, 0, segmentsW - 1, -w/2, w/2);
      const y1 = map(j, 0, segmentsH - 1, -h/2, h/2);
      const x2 = map(i + 1, 0, segmentsW - 1, -w/2, w/2);
      const y2 = map(j + 1, 0, segmentsH - 1, -h/2, h/2);
      
      // Add corrugated cardboard texture
      const distX = (x1 + x2) / 2;
      const distY = (y1 + y2) / 2;
      const distortion = sin(distX * 0.02 + time * 0.003) * 
                         cos(distY * 0.02 + time * 0.004) * 
                         15 * wave;
      
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
