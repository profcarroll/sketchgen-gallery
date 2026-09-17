let horse;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  horse = new Horse();
}

function draw() {
  background(240);
  horse.update();
  horse.display();
}

class Horse {
  constructor() {
    this.bodyParts = [];
    this.createHorse();
  }

  createHorse() {
    // Create a simplified, flowing horse using curves
    for (let i = 0; i < 15; i++) {
      this.bodyParts.push({
        x: 0,
        y: 0,
        angle: 0,
        length: 20 + i * 3,
        width: 5 + i * 0.5
      });
    }
  }

  update() {
    time += 0.05;
    
    // Animate the body with a wave motion
    for (let i = 0; i < this.bodyParts.length; i++) {
      let part = this.bodyParts[i];
      part.angle = sin(time + i * 0.3) * 0.2;
      part.x = (i - 7) * 15;
      part.y = sin(time + i * 0.2) * 10;
    }
    
    // Animate front legs with galloping motion
    this.bodyParts[0].angle = sin(time * 2) * 0.3; // Head
    this.bodyParts[1].angle = sin(time * 2 + 1) * 0.4; // Neck
    this.bodyParts[2].angle = sin(time * 2 + 2) * 0.5; // Body
    this.bodyParts[3].angle = sin(time * 2 + 3) * 0.6; // Front leg
    this.bodyParts[4].angle = sin(time * 2 + 4) * 0.7; // Front leg extended
  }

  display() {
    translate(width/2, height/2);
    
    // Draw body with flowing curves
    beginShape();
    for (let i = 0; i < this.bodyParts.length; i++) {
      let part = this.bodyParts[i];
      let x = part.x + cos(part.angle) * part.length;
      let y = part.y + sin(part.angle) * part.length;
      vertex(x, y);
    }
    endShape();
    
    // Draw legs with extension
    for (let i = 3; i < 6; i++) {
      let part = this.bodyParts[i];
      let x1 = part.x;
      let y1 = part.y;
      let x2 = x1 + cos(part.angle) * part.length;
      let y2 = y1 + sin(part.angle) * part.length;
      
      strokeWeight(3);
      line(x1, y1, x2, y2);
    }
    
    // Draw front legs in extended position
    for (let i = 3; i < 5; i++) {
      let part = this.bodyParts[i];
      let x1 = part.x;
      let y1 = part.y;
      let x2 = x1 + cos(part.angle) * part.length;
      let y2 = y1 + sin(part.angle) * part.length;
      
      strokeWeight(3);
      line(x1, y1, x2, y2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
