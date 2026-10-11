let fragments = [];
let isShattering = false;
let shatterTimer = 0;
let equilibrium = [];
let transitionProgress = 0;
let fractalStructure = [];
let maxFractalDepth = 5;
let branchCount = 100;

class Fragment {
  constructor(x, y, z, size) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.acc = createVector(0, 0, 0);
    this.size = size;
    this.color = color(random(100, 180), random(100, 180), random(100, 180), 200);
    this.rotation = createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI));
    this.rotationSpeed = p5.Vector.random3D().mult(random(0.01, 0.05));
    this.originalPos = this.pos.copy();
    this.targetPos = this.pos.copy();
    this.isAttached = false;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.rotation.add(this.rotationSpeed);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rotation.x);
    rotateY(this.rotation.y);
    rotateZ(this.rotation.z);

    fill(this.color);
    noStroke();
    box(this.size);

    pop();
  }
}

class FractalBranch {
  constructor(startPos, direction, depth, size) {
    this.startPos = startPos.copy();
    this.direction = direction.copy().normalize();
    this.depth = depth;
    this.size = size;
    this.endPos = p5.Vector.add(this.startPos, this.direction.copy().mult(this.size));
    this.children = [];
    
    if (this.depth > 0) {
      let childCount = floor(random(2, 4));
      for (let i = 0; i < childCount; i++) {
        let newDirection = p5.Vector.random3D();
        // Keep some alignment with parent
        newDirection.lerp(this.direction, 0.3);
        this.children.push(new FractalBranch(this.endPos, newDirection, this.depth - 1, this.size * 0.7));
      }
    }
  }

  display() {
    push();
    translate(this.startPos.x, this.startPos.y, this.startPos.z);
    
    stroke(this.color);
    noFill();
    
    // Draw main branch
    line(0, 0, 0, this.direction.x * this.size, this.direction.y * this.size, this.direction.z * this.size);
    
    // Draw children
    for (let child of this.children) {
      child.display();
    }
    
    pop();
  }

  update() {
    // Recursive update for children
    for (let child of this.children) {
      child.update();
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Create initial equilibrium structure
  for (let i = 0; i < 20; i++) {
    let x = random(-width/4, width/4);
    let y = random(-height/4, height/4);
    let z = random(-100, 100);
    equilibrium.push(new Fragment(x, y, z, random(20, 50)));
  }
  
  // Precompute fractal structure
  generateFractalStructure();
}

function draw() {
  background(0);

  // Camera movement for better perspective
  let time = millis() / 2000;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  rotateY(time * 0.1);

  if (!isShattering) {
    // Normal equilibrium phase
    transitionProgress = lerp(transitionProgress, 0, 0.02);
    
    // Apply forces to keep structure together
    for (let i = 0; i < equilibrium.length; i++) {
      let frag = equilibrium[i];
      let target = createVector(0, 0, 0);
      let force = p5.Vector.sub(target, frag.pos);
      force.normalize();
      force.mult(0.01);
      
      // Add some gentle oscillation
      force.add(p5.Vector.random3D().mult(0.05));
      
      frag.applyForce(force);
    }

    if (frameCount % 120 === 0) {
      isShattering = true;
      shatterTimer = 0;
      fragments = [];
      
      // Create fragments from equilibrium
      for (let i = 0; i < equilibrium.length; i++) {
        let frag = equilibrium[i];
        fragments.push(new Fragment(frag.pos.x, frag.pos.y, frag.pos.z, frag.size));
      }
    }
  } else {
    // Shattering phase
    shatterTimer++;
    transitionProgress = lerp(transitionProgress, 1, 0.05);
    
    // Apply strong forces to fragments
    for (let i = 0; i < fragments.length; i++) {
      let frag = fragments[i];
      
      // Random explosion force
      let force = p5.Vector.random3D().mult(random(0.2, 0.8));
      frag.applyForce(force);
      
      // Add some gravity
      frag.applyForce(createVector(0, 0.1, 0));
    }
    
    if (shatterTimer > 60) {
      isShattering = false;
      // Rebuild equilibrium structure into fractal structure
      equilibrium = [];
      for (let i = 0; i < fragments.length; i++) {
        let x = random(-width/4, width/4);
        let y = random(-height/4, height/4);
        let z = random(-100, 100);
        equilibrium.push(new Fragment(x, y, z, fragments[i].size));
      }
    }
  }

  // Display fragments during shattering
  if (isShattering) {
    for (let i = 0; i < fragments.length; i++) {
      let frag = fragments[i];
      frag.update();
      frag.display();
    }
  } else {
    // Display equilibrium structure
    for (let i = 0; i < equilibrium.length; i++) {
      let frag = equilibrium[i];
      frag.update();
      frag.display();
    }

    // Reassemble into fractal structure
    if (fractalStructure.length > 0) {
      let t = millis() / 1000;
      for (let i = 0; i < equilibrium.length; i++) {
        let frag = equilibrium[i];
        let branch = fractalStructure[i % fractalStructure.length];
        
        // Smoothly transition to fractal position
        let target = branch.endPos.copy();
        target.add(createVector(
          sin(t * 2 + i) * 50,
          cos(t * 2 + i) * 50,
          i * 10
        ));
        
        let force = p5.Vector.sub(target, frag.pos);
        force.mult(0.05);
        frag.applyForce(force);
      }
    }

    // Draw connections between equilibrium fragments
    stroke(255, 10);
    noFill();
    
    beginShape(LINES);
    for (let i = 0; i < equilibrium.length; i++) {
      for (let j = i + 1; j < equilibrium.length; j++) {
        let d = dist(
          equilibrium[i].pos.x, equilibrium[i].pos.y, equilibrium[i].pos.z,
          equilibrium[j].pos.x, equilibrium[j].pos.y, equilibrium[j].pos.z
        );
        
        if (d < 150) {
          vertex(equilibrium[i].pos.x, equilibrium[i].pos.y, equilibrium[i].pos.z);
          vertex(equilibrium[j].pos.x, equilibrium[j].pos.y, equilibrium[j].pos.z);
        }
      }
    }
    endShape();
  }
}

function generateFractalStructure() {
  fractalStructure = [];
  let startPos = createVector(0, 0, 0);
  let direction = createVector(0, -1, 0);
  fractalStructure.push(new FractalBranch(startPos, direction, maxFractalDepth, 100));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
