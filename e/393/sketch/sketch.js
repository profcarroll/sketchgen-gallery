let helix;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  helix = new DNAHelix();
}

function draw() {
  background(20);
  lights();
  noStroke();
  
  translate(0, 0, -500);
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);
  
  helix.update(time);
  helix.display();
  
  time++;
}

class DNAHelix {
  constructor() {
    this.segments = [];
    this.basePairs = [];
    this.numSegments = 20;
    this.radius = 150;
    this.segmentLength = 40;
    this.twist = 0.3;
    
    for (let i = 0; i < this.numSegments; i++) {
      let angle = i * this.twist;
      let x = cos(angle) * this.radius;
      let y = i * this.segmentLength;
      let z = sin(angle) * this.radius;
      
      let segment = {
        pos: createVector(x, y, z),
        angle: angle,
        basePair: this.getBasePair()
      };
      
      this.segments.push(segment);
    }
  }
  
  getBasePair() {
    const bases = ['A', 'T', 'C', 'G'];
    return random(bases);
  }
  
  update(time) {
    // Animate the helix
    for (let i = 0; i < this.segments.length; i++) {
      let segment = this.segments[i];
      segment.angle += sin(time * 0.005 + i * 0.1) * 0.02;
      
      segment.pos.x = cos(segment.angle) * this.radius;
      segment.pos.z = sin(segment.angle) * this.radius;
    }
  }
  
  display() {
    // Draw the backbone
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let seg = this.segments[i];
      vertex(seg.pos.x, seg.pos.y, seg.pos.z);
    }
    endShape();
    
    // Draw base pairs
    for (let i = 0; i < this.segments.length; i += 2) {
      let seg1 = this.segments[i];
      let seg2 = this.segments[i + 1];
      
      if (seg1 && seg2) {
        let midPoint = p5.Vector.add(seg1.pos, seg2.pos).div(2);
        
        // Draw base pair label
        push();
        translate(midPoint.x, midPoint.y, midPoint.z);
        rotateY(-PI/2);
        fill(255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(seg1.basePair + " - " + seg2.basePair, 0, 0);
        pop();
      }
    }
    
    // Draw spheres at each backbone position
    for (let i = 0; i < this.segments.length; i++) {
      let segment = this.segments[i];
      push();
      translate(segment.pos.x, segment.pos.y, segment.pos.z);
      sphere(8);
      pop();
    }
    
    // Draw base pair spheres
    for (let i = 0; i < this.segments.length; i += 2) {
      let seg1 = this.segments[i];
      let seg2 = this.segments[i + 1];
      
      if (seg1 && seg2) {
        let midPoint = p5.Vector.add(seg1.pos, seg2.pos).div(2);
        
        // Draw base pair spheres
        push();
        translate(midPoint.x + 30, midPoint.y, midPoint.z);
        sphere(6);
        pop();
        
        push();
        translate(midPoint.x - 30, midPoint.y, midPoint.z);
        sphere(6);
        pop();
      }
    }
  }
}
