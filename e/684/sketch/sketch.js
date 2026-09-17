let helix;
let bonds = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  helix = new DNAHelix();
}

function draw() {
  background(20);
  rotateY(time * 0.005);
  rotateX(sin(time * 0.002) * 0.1);
  helix.update();
  helix.display();
  time++;
}

class DNAHelix {
  constructor() {
    this.radius = 150;
    this.height = 400;
    this.turns = 3;
    this.basePairs = [];
    this.bonds = [];
    this.createBasePairs();
  }

  createBasePairs() {
    for (let i = 0; i < 20; i++) {
      const angle = map(i, 0, 20, 0, TWO_PI * this.turns);
      const y = map(i, 0, 20, -this.height/2, this.height/2);
      const x = cos(angle) * this.radius;
      const z = sin(angle) * this.radius;
      
      const baseType = i % 4 === 0 ? 'A' : 
                      i % 4 === 1 ? 'T' :
                      i % 4 === 2 ? 'C' : 'G';
                      
      const base = new BasePair(x, y, z, baseType);
      this.basePairs.push(base);
    }
  }

  update() {
    for (let bp of this.basePairs) {
      bp.update();
    }
    
    this.bonds = [];
    for (let i = 0; i < this.basePairs.length; i++) {
      const a = this.basePairs[i];
      for (let j = i + 1; j < this.basePairs.length; j++) {
        const b = this.basePairs[j];
        if (a.isComplementary(b)) {
          const d = dist(a.x, a.y, a.z, b.x, b.y, b.z);
          if (d < 80 && d > 40) {
            this.bonds.push({a, b});
          }
        }
      }
    }
  }

  display() {
    stroke(255);
    noFill();
    
    // Draw the helix backbone
    beginShape();
    for (let bp of this.basePairs) {
      vertex(bp.x, bp.y, bp.z);
    }
    endShape();

    // Draw base pairs
    for (let bp of this.basePairs) {
      bp.display();
    }

    // Draw hydrogen bonds
    stroke(255, 100);
    noFill();
    for (let bond of this.bonds) {
      line(bond.a.x, bond.a.y, bond.a.z, bond.b.x, bond.b.y, bond.b.z);
    }
  }
}

class BasePair {
  constructor(x, y, z, type) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
    this.baseAngle = random(TWO_PI);
    this.offset = random(10);
  }

  update() {
    this.baseAngle += 0.02;
    const offset = sin(this.baseAngle + this.offset) * 5;
    
    // Slight up/down motion
    this.y += sin(time * 0.01 + this.offset) * 0.5;
    
    // Gentle rotation around the helix axis
    this.x = cos(this.baseAngle) * 150;
    this.z = sin(this.baseAngle) * 150;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    
    let color;
    switch (this.type) {
      case 'A': color = [255, 0, 0]; break; // Red
      case 'T': color = [0, 255, 0]; break; // Green
      case 'C': color = [0, 0, 255]; break; // Blue
      case 'G': color = [255, 255, 0]; break; // Yellow
    }
    
    fill(...color);
    noStroke();
    sphere(10);
    
    pop();
  }

  isComplementary(other) {
    return (this.type === 'A' && other.type === 'T') ||
           (this.type === 'T' && other.type === 'A') ||
           (this.type === 'C' && other.type === 'G') ||
           (this.type === 'G' && other.type === 'C');
  }
}
