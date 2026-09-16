let damageParticles = [];
let roads = [];
let buildings = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create roads
  for (let i = 0; i < 5; i++) {
    roads.push({
      x: -width/2 + i * width/4,
      y: 0,
      w: 80,
      h: height
    });
  }

  // Create buildings
  for (let i = 0; i < 10; i++) {
    buildings.push({
      x: -width/2 + random(width),
      z: -random(height),
      w: random(40, 80),
      h: random(60, 150)
    });
  }
}

function draw() {
  background(220, 30, 90);

  // Draw ground
  noStroke();
  fill(180, 20, 70);
  plane(width, height);

  // Draw roads
  for (let road of roads) {
    push();
    translate(road.x, road.y, road.z);
    fill(30, 10, 30);
    box(road.w, 10, road.h);
    pop();
  }

  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(240, 15, 60);
    box(building.w, building.h, 30);
    pop();
  }

  // Update and display damage particles
  for (let i = damageParticles.length - 1; i >= 0; i--) {
    let p = damageParticles[i];
    p.update();
    p.display();

    if (p.life <= 0) {
      damageParticles.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Create a new damage particle at the mouse position
  let x = map(mouseX, 0, width, -width/2, width/2);
  let z = map(mouseY, 0, height, -height/2, height/2);

  damageParticles.push(new DamageParticle(x, z));
}

class DamageParticle {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.life = 255;
    this.size = random(10, 30);
  }

  update() {
    this.life -= 2;
  }

  display() {
    push();
    translate(this.x, 0, this.z);

    noStroke();
    fill(0, 100, 0, this.life/255);
    sphere(this.size * (this.life/255));

    pop();
  }
}
