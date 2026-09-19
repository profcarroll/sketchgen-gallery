let horse;
let time = 0;

function setup() {
  createCanvas(400, 400);
  horse = new Horse();
}

function draw() {
  background(220);
  horse.update();
  horse.display();
  time += 0.05;
}

class Horse {
  constructor() {
    this.x = 0;
    this.y = height / 2;
    this.bodyLength = 120;
    this.bodyHeight = 40;
    this.headSize = 30;
    this.legLength = 60;
    this.tailLength = 80;
    this.speed = 3;
  }

  update() {
    this.x += this.speed;
    if (this.x > width + this.bodyLength) {
      this.x = -this.bodyLength;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    
    // Body (sweeping curve)
    noFill();
    stroke(0);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < PI; i += 0.1) {
      let x = sin(i) * this.bodyLength;
      let y = cos(i) * this.bodyHeight;
      vertex(x, y);
    }
    endShape();

    // Head
    ellipse(this.bodyLength / 2, 0, this.headSize, this.headSize/2);

    // Legs (synchronized gallop)
    let legOffset = sin(time * 3) * 20;
    
    // Front legs
    line(this.bodyLength/4, -this.bodyHeight/2, 
         this.bodyLength/4 + cos(time) * this.legLength, 
         -this.bodyHeight/2 + sin(time) * this.legLength);
    line(this.bodyLength/2, -this.bodyHeight/2, 
         this.bodyLength/2 + cos(time + PI) * this.legLength, 
         -this.bodyHeight/2 + sin(time + PI) * this.legLength);

    // Hind legs
    line(-this.bodyLength/4, this.bodyHeight/2, 
         -this.bodyLength/4 + cos(time + PI) * this.legLength, 
         this.bodyHeight/2 + sin(time + PI) * this.legLength);
    line(-this.bodyLength/2, this.bodyHeight/2, 
         -this.bodyLength/2 + cos(time) * this.legLength, 
         this.bodyHeight/2 + sin(time) * this.legLength);

    // Tail
    line(-this.bodyLength/2, 0, 
         -this.bodyLength/2 - this.tailLength * cos(time), 
         -this.tailLength * sin(time));

    pop();
  }
}
