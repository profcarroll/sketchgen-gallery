let faucetHandle;
let waterStream;
let basin;

function setup() {
  createCanvas(400, 400);
  faucetHandle = new FaucetHandle(200, 300);
  waterStream = new WaterStream();
  basin = new Basin();
}

function draw() {
  background(180, 200, 220);
  
  basin.display();
  faucetHandle.update();
  faucetHandle.display();
  
  if (faucetHandle.isTurning) {
    waterStream.start();
    waterStream.update(faucetHandle.angle);
  } else {
    waterStream.stop();
  }
  waterStream.display();
}

class FaucetHandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.isTurning = false;
    this.targetAngle = 0;
    this.rotationSpeed = 0.05;
    this.handleLength = 60;
    this.handleWidth = 8;
    this.baseRadius = 20;
  }

  update() {
    if (this.isTurning) {
      this.angle += (this.targetAngle - this.angle) * this.rotationSpeed;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    // Base circle
    fill(100);
    noStroke();
    ellipse(0, 0, this.baseRadius * 2);
    
    // Handle
    stroke(150);
    strokeWeight(this.handleWidth);
    line(0, 0, this.handleLength, 0);
    
    pop();
  }
}

class WaterStream {
  constructor() {
    this.drops = [];
    this.active = false;
    this.maxDrops = 200;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  update(angle) {
    if (!this.active) return;

    if (frameCount % 3 === 0) {
      const drop = new WaterDrop();
      drop.x = 200 + cos(angle) * 50;
      drop.y = 300 - sin(angle) * 50;
      drop.vx = random(-1, 1);
      drop.vy = random(-3, -1);
      drop.life = 255;
      this.drops.push(drop);
    }

    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i];
      drop.update();
      if (drop.life <= 0) {
        this.drops.splice(i, 1);
      }
    }
  }

  display() {
    for (const drop of this.drops) {
      drop.display();
    }
  }
}

class WaterDrop {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
    this.life -= 3;
  }

  display() {
    noStroke();
    fill(100, 180, 255, this.life);
    ellipse(this.x, this.y, 4);
  }
}

class Basin {
  constructor() {
    this.width = 200;
    this.height = 100;
    this.x = (width - this.width) / 2;
    this.y = height - this.height - 50;
  }

  display() {
    fill(220);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 10);

    // Basin rim
    stroke(180);
    strokeWeight(3);
    noFill();
    rect(this.x, this.y, this.width, this.height, 10);
    
    // Water surface
    fill(100, 180, 255, 100);
    noStroke();
    rect(this.x + 5, this.y + 5, this.width - 10, 10);
  }
}

function mouseDragged() {
  if (dist(mouseX, mouseY, 200, 300) < 80) {
    faucetHandle.isTurning = true;
    const dx = mouseX - 200;
    const dy = mouseY - 300;
    faucetHandle.targetAngle = atan2(dy, dx);
  }
}

function mouseReleased() {
  faucetHandle.isTurning = false;
}
