let threads = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Initialize thread structures with recursive patterns
  for (let i = 0; i < 150; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-200, 200);
    const size = random(20, 80);
    const depth = floor(random(3, 6));
    threads.push(new Thread(x, y, z, size, depth));
  }
}

function draw() {
  background(10, 15, 30);
  time += 0.003;
  
  // Slow rotation of the entire scene
  rotateY(time * 0.1);
  rotateX(sin(time * 0.2) * 0.1);
  
  // Draw all threads
  for (let thread of threads) {
    thread.update(time);
    thread.display();
  }
}

class Thread {
  constructor(x, y, z, size, depth) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.depth = depth;
    this.segments = [];
    this.initSegments();
  }
  
  initSegments() {
    this.segments = [];
    const numSegments = floor(random(4, 8));
    for (let i = 0; i < numSegments; i++) {
      const angle = random(TWO_PI);
      const length = random(this.size * 0.3, this.size * 0.7);
      this.segments.push({
        angle: angle,
        length: length,
        depth: floor(random(2, 4))
      });
    }
  }
  
  update(time) {
    // Oscillating movement
    for (let segment of this.segments) {
      segment.length = this.size * 0.3 + sin(time * 0.7 + segment.angle) * this.size * 0.2;
    }
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    
    // Draw each segment as a rotating, colored cylinder
    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      const nextSeg = this.segments[(i + 1) % this.segments.length];
      
      // Create rotation for the segment
      const rotAngle = seg.angle + time * 0.5;
      rotateZ(rotAngle);
      
      // Calculate color based on position and time
      const hue = (i * 60 + time * 30) % 360;
      const saturation = 80 + sin(time * 0.3 + i) * 20;
      const brightness = 70 + sin(time * 0.5 + i) * 20;
      
      fill(hue, saturation, brightness, 200);
      
      // Draw the segment as a rotating cylinder
      push();
      translate(0, seg.length/2, 0);
      cylinder(seg.length * 0.2, 8, 1, true);
      pop();
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
