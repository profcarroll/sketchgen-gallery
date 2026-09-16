let helix;
let basePairs = [];
let bonds = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  helix = new DNAHelix();
}

function draw() {
  background(20);
  orbitControl();
  helix.update();
  helix.display();
  
  // Update and display bonds
  for (let i = bonds.length - 1; i >= 0; i--) {
    bonds[i].update();
    if (bonds[i].isFinished()) {
      bonds.splice(i, 1);
    } else {
      bonds[i].display();
    }
  }
}

class DNAHelix {
  constructor() {
    this.radius = 150;
    this.height = 400;
    this.turns = 2.5;
    this.baseCount = 20;
    this.baseSpacing = this.height / this.baseCount;
    this.angleStep = (TWO_PI * this.turns) / this.baseCount;
    this.rotation = 0;
    this.bases = [];
    this.generateBases();
  }

  generateBases() {
    for (let i = 0; i < this.baseCount; i++) {
      let angle = i * this.angleStep + this.rotation;
      let x = cos(angle) * this.radius;
      let y = -this.height / 2 + i * this.baseSpacing;
      let z = sin(angle) * this.radius;
      
      // Alternate strands
      let strand = (i % 2 === 0) ? 1 : -1;
      let baseType = this.getRandomBase();
      this.bases.push({
        x: x,
        y: y,
        z: z,
        type: baseType,
        strand: strand,
        angle: angle
      });
    }
  }

  update() {
    this.rotation += 0.01;
    for (let i = 0; i < this.bases.length; i++) {
      let base = this.bases[i];
      base.angle = i * this.angleStep + this.rotation;
      base.x = cos(base.angle) * this.radius;
      base.z = sin(base.angle) * this.radius;
    }
    this.checkBasePairs();
  }

  checkBasePairs() {
    for (let i = 0; i < this.bases.length; i++) {
      for (let j = i + 1; j < this.bases.length; j++) {
        let base1 = this.bases[i];
        let base2 = this.bases[j];
        
        // Only pair bases from different strands
        if (base1.strand !== base2.strand) {
          let d = dist(base1.x, base1.y, base1.z, base2.x, base2.y, base2.z);
          
          // If they're close enough to form a bond
          if (d < 50 && d > 30) {
            // Add a new bond between them
            bonds.push(new Bond(base1, base2));
          }
        }
      }
    }
  }

  display() {
    stroke(255);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.bases.length; i++) {
      let base = this.bases[i];
      vertex(base.x, base.y, base.z);
    }
    endShape(CLOSE);

    // Draw labels
    for (let i = 0; i < this.bases.length; i++) {
      let base = this.bases[i];
      push();
      translate(base.x, base.y, base.z);
      fill(255);
      noStroke();
      textFont('Arial');
      textSize(12);
      textAlign(CENTER, CENTER);
      text(base.type, 0, 0);
      pop();
    }
  }

  getRandomBase() {
    let bases = ['A', 'T', 'C', 'G'];
    return random(bases);
  }
}

class Bond {
  constructor(base1, base2) {
    this.base1 = base1;
    this.base2 = base2;
    this.life = 1.0;
    this.maxLife = 100;
  }

  update() {
    this.life -= 1 / this.maxLife;
  }

  isFinished() {
    return this.life <= 0;
  }

  display() {
    stroke(255, 100);
    noFill();
    
    let x1 = this.base1.x;
    let y1 = this.base1.y;
    let z1 = this.base1.z;
    let x2 = this.base2.x;
    let y2 = this.base2.y;
    let z2 = this.base2.z;
    
    line(x1, y1, z1, x2, y2, z2);
  }
}
