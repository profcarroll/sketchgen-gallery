let helix;
let rotation = 0;
let clickTime = 0;
let uncoilSegment = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  helix = new Helix();
}

function draw() {
  background(20);
  rotateY(rotation);
  
  if (millis() - clickTime < 3000) {
    uncoilSegment += 0.02;
    if (uncoilSegment > 1) uncoilSegment = 1;
  }
  
  helix.display(uncoilSegment);
  rotation += 0.005;
}

function mousePressed() {
  clickTime = millis();
  uncoilSegment = 0;
}

class Helix {
  constructor() {
    this.radius = 150;
    this.height = 400;
    this.turns = 10;
    this.basePairs = [];
    this.bonds = [];
    
    let numBases = 200;
    for (let i = 0; i < numBases; i++) {
      let angle = map(i, 0, numBases, 0, TWO_PI * this.turns);
      let y = map(i, 0, numBases, -this.height/2, this.height/2);
      let x = this.radius * cos(angle);
      let z = this.radius * sin(angle);
      
      // Base pair
      let base1 = createVector(x, y, z);
      let base2 = createVector(-x, y, -z);
      
      // Complementary pairs
      let pairType = i % 4;
      this.basePairs.push({
        base1: base1,
        base2: base2,
        type: pairType,
        angle: angle
      });
    }
    
    // Create hydrogen bonds between complementary bases
    for (let i = 0; i < this.basePairs.length - 1; i++) {
      let p1 = this.basePairs[i];
      let p2 = this.basePairs[i + 1];
      
      // Connect bases with bonds
      let bond1 = createVector(p1.base1.x, p1.base1.y, p1.base1.z);
      let bond2 = createVector(p2.base1.x, p2.base1.y, p2.base1.z);
      this.bonds.push([bond1, bond2]);
      
      let bond3 = createVector(p1.base2.x, p1.base2.y, p1.base2.z);
      let bond4 = createVector(p2.base2.x, p2.base2.y, p2.base2.z);
      this.bonds.push([bond3, bond4]);
    }
  }
  
  display(uncoil) {
    stroke(255);
    strokeWeight(1);
    
    // Draw hydrogen bonds
    for (let i = 0; i < this.bonds.length; i++) {
      let b = this.bonds[i];
      line(b[0].x, b[0].y, b[0].z, b[1].x, b[1].y, b[1].z);
    }
    
    // Draw base pairs
    for (let i = 0; i < this.basePairs.length; i++) {
      let p = this.basePairs[i];
      
      // Determine uncoiling effect
      let dist = abs(p.angle - (TWO_PI * this.turns / 2));
      let uncoilFactor = map(dist, 0, TWO_PI * this.turns, 1, 0);
      if (uncoilFactor < 0) uncoilFactor = 0;
      
      // Draw base 1
      push();
      translate(p.base1.x, p.base1.y, p.base1.z);
      fill(255, 100, 100);
      sphere(8);
      pop();
      
      // Draw base 2
      push();
      translate(p.base2.x, p.base2.y, p.base2.z);
      fill(100, 150, 255);
      sphere(8);
      pop();
      
      // Draw connecting bond lines if not uncoiled
      if (uncoilFactor > 0.5) {
        let bond1 = createVector(p.base1.x, p.base1.y, p.base1.z);
        let bond2 = createVector(p.base2.x, p.base2.y, p.base2.z);
        stroke(200);
        strokeWeight(1);
        line(bond1.x, bond1.y, bond1.z, bond2.x, bond2.y, bond2.z);
      }
    }
  }
}
