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
    this.parts = [];
    this.createHorse();
  }

  createHorse() {
    // Create main body parts with curved forms
    this.parts.push({
      type: 'body',
      points: [
        { x: 0, y: 0 },
        { x: 20, y: -10 },
        { x: 40, y: -5 },
        { x: 60, y: 0 },
        { x: 80, y: 10 },
        { x: 100, y: 15 },
        { x: 120, y: 10 },
        { x: 140, y: 5 },
        { x: 160, y: 0 }
      ],
      isCurve: true
    });

    // Head
    this.parts.push({
      type: 'head',
      points: [
        { x: 160, y: 0 },
        { x: 180, y: -5 },
        { x: 200, y: -10 },
        { x: 220, y: -5 },
        { x: 230, y: 0 }
      ],
      isCurve: true
    });

    // Legs (front and hind)
    for (let i = 0; i < 4; i++) {
      this.parts.push({
        type: 'leg',
        points: [
          { x: 40 + i * 30, y: 15 },
          { x: 50 + i * 30, y: 25 },
          { x: 60 + i * 30, y: 35 }
        ],
        isCurve: true
      });
    }

    // Tail
    this.parts.push({
      type: 'tail',
      points: [
        { x: 0, y: 10 },
        { x: -10, y: 20 },
        { x: -20, y: 30 },
        { x: -30, y: 40 }
      ],
      isCurve: true
    });
  }

  update() {
    time += 0.05;
    // Animate the horse by shifting points
    for (let part of this.parts) {
      if (part.isCurve) {
        for (let point of part.points) {
          point.y += sin(time + point.x * 0.1) * 0.5;
        }
      }
    }

    // Add subtle gallop motion to legs
    for (let i = 0; i < this.parts.length; i++) {
      if (this.parts[i].type === 'leg') {
        const offset = i % 2 === 0 ? time : time + PI;
        const legPoints = this.parts[i].points;
        for (let j = 0; j < legPoints.length; j++) {
          legPoints[j].y += sin(offset + j * 0.5) * 1.5;
          legPoints[j].x += cos(offset + j * 0.5) * 0.8;
        }
      }
    }

    // Body sway
    const body = this.parts[0];
    for (let point of body.points) {
      point.x += sin(time * 1.2 + point.y * 0.1) * 0.5;
    }
  }

  display() {
    stroke(30);
    strokeWeight(2);
    noFill();

    // Draw each part
    for (let part of this.parts) {
      if (part.isCurve) {
        beginShape();
        for (let point of part.points) {
          curveVertex(point.x, point.y);
        }
        endShape();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
