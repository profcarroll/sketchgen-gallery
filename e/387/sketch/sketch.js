let strands = [];
let numStrands = 5;
let dnaRadius = 100;
let proteinChainLength = 20;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < numStrands; i++) {
    strands.push({
      phase: i * (TWO_PI / numStrands),
      segments: [],
      proteinChain: []
    });
    
    // Initialize DNA segments
    for (let j = 0; j < 20; j++) {
      let angle = j * 0.5 + time;
      let x = cos(angle) * dnaRadius;
      let y = sin(angle) * dnaRadius;
      let z = j * 10 - 100;
      
      strands[i].segments.push({
        x: x,
        y: y,
        z: z,
        angle: angle,
        base: random(['A', 'T', 'C', 'G'])
      });
    }
    
    // Initialize protein chain
    for (let j = 0; j < proteinChainLength; j++) {
      let x = cos(time + j * 0.3) * 150;
      let y = sin(time + j * 0.3) * 150;
      let z = j * 20 - 100;
      
      strands[i].proteinChain.push({
        x: x,
        y: y,
        z: z,
        base: random(['A', 'T', 'C', 'G'])
      });
    }
  }
}

function draw() {
  background(0, 0, 10);
  time += 0.02;
  
  // Camera movement
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw DNA strands
  for (let i = 0; i < strands.length; i++) {
    let strand = strands[i];
    
    // Update DNA segments
    for (let j = 0; j < strand.segments.length; j++) {
      let segment = strand.segments[j];
      segment.angle += 0.02;
      segment.x = cos(segment.angle + strand.phase) * dnaRadius;
      segment.y = sin(segment.angle + strand.phase) * dnaRadius;
      segment.z = j * 10 - 100 + sin(time * 0.5 + j * 0.1) * 20;
    }
    
    // Draw DNA double helix
    stroke(200, 80, 90);
    noFill();
    beginShape();
    for (let j = 0; j < strand.segments.length; j++) {
      let segment = strand.segments[j];
      vertex(segment.x, segment.y, segment.z);
    }
    endShape();
    
    // Draw complementary strand
    stroke(180, 80, 90);
    beginShape();
    for (let j = 0; j < strand.segments.length; j++) {
      let segment = strand.segments[j];
      let x = -segment.x;
      let y = -segment.y;
      vertex(x, y, segment.z);
    }
    endShape();
    
    // Draw bases
    noStroke();
    for (let j = 0; j < strand.segments.length; j += 3) {
      let segment = strand.segments[j];
      let hue = map(segment.base.charCodeAt(0), 65, 71, 0, 360);
      fill(hue, 80, 90, 0.8);
      
      push();
      translate(segment.x, segment.y, segment.z);
      sphere(5);
      pop();
    }
    
    // Draw protein chain
    stroke(100, 80, 90);
    noFill();
    beginShape();
    for (let j = 0; j < strand.proteinChain.length; j++) {
      let segment = strand.proteinChain[j];
      vertex(segment.x, segment.y, segment.z);
    }
    endShape();
    
    // Draw protein chain bases
    noStroke();
    for (let j = 0; j < strand.proteinChain.length; j += 2) {
      let segment = strand.proteinChain[j];
      let hue = map(segment.base.charCodeAt(0), 65, 71, 0, 360);
      fill(hue, 80, 90, 0.8);
      
      push();
      translate(segment.x, segment.y, segment.z);
      sphere(4);
      pop();
    }
    
    // Update protein chain positions
    for (let j = 0; j < strand.proteinChain.length; j++) {
      let segment = strand.proteinChain[j];
      segment.x = cos(time + j * 0.3) * 150;
      segment.y = sin(time + j * 0.3) * 150;
      segment.z = j * 20 - 100;
    }
  }
  
  // Draw glowing particles
  noStroke();
  for (let i = 0; i < 100; i++) {
    let angle = time + i * 0.1;
    let radius = 200 + sin(time * 0.5 + i) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time + i) * 100;
    
    let hue = (time * 20 + i * 3) % 360;
    fill(hue, 80, 90, 0.5);
    push();
    translate(x, y, z);
    sphere(3);
    pop();
  }
}
