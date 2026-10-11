let gears = [];
let springs = [];
let links = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a complex gear system
  for (let i = 0; i < 8; i++) {
    let radius = 50 + i * 30;
    let gear = {
      radius: radius,
      teeth: 12 + i % 4 * 4,
      angle: i * 0.5,
      speed: 0.005 + i * 0.001,
      color: color(30 + i * 10, 70, 40),
      x: 0,
      y: 0
    };
    gears.push(gear);
  }
  
  // Create springs
  for (let i = 0; i < 20; i++) {
    springs.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      length: random(30, 80),
      angle: random(TWO_PI),
      speed: random(0.005, 0.01),
      color: color(20, 60, 30)
    });
  }
  
  // Create linkages
  for (let i = 0; i < 50; i++) {
    links.push({
      x1: random(-width/2, width/2),
      y1: random(-height/2, height/2),
      x2: random(-width/2, width/2),
      y2: random(-height/2, height/2),
      speed: random(0.002, 0.008),
      color: color(10, 50, 20)
    });
  }
}

function draw() {
  background(0, 0, 5);
  
  // Center the view
  translate(0, 0, -300);
  
  time += 0.01;
  
  // Draw gears
  for (let gear of gears) {
    gear.angle += gear.speed;
    
    push();
    rotate(gear.angle);
    
    // Draw gear teeth
    fill(gear.color);
    noStroke();
    for (let i = 0; i < gear.teeth; i++) {
      let angle = TWO_PI * i / gear.teeth;
      let toothX = gear.radius * cos(angle);
      let toothY = gear.radius * sin(angle);
      
      // Draw a small tooth
      push();
      translate(toothX, toothY);
      rotate(angle);
      rect(0, -5, 10, 10);
      pop();
    }
    
    // Draw center circle
    fill(color(20, 30, 10));
    ellipse(0, 0, gear.radius * 0.3, gear.radius * 0.3);
    
    pop();
    
    // Draw connecting links
    for (let otherGear of gears) {
      if (otherGear !== gear) {
        let dx = otherGear.x - gear.x;
        let dy = otherGear.y - gear.y;
        let distance = sqrt(dx * dx + dy * dy);
        
        if (distance < 300 && distance > 50) {
          stroke(color(20, 40, 20));
          strokeWeight(1);
          line(gear.x, gear.y, otherGear.x, otherGear.y);
        }
      }
    }
  }
  
  // Draw springs
  for (let spring of springs) {
    spring.angle += spring.speed;
    
    let x1 = spring.x + cos(spring.angle) * spring.length;
    let y1 = spring.y + sin(spring.angle) * spring.length;
    
    stroke(spring.color);
    strokeWeight(2);
    line(spring.x, spring.y, x1, y1);
  }
  
  // Draw linkages
  for (let link of links) {
    link.angle += link.speed;
    
    let x1 = link.x1 + cos(link.angle) * 50;
    let y1 = link.y1 + sin(link.angle) * 50;
    
    stroke(20, 40, 20);
    strokeWeight(1);
    line(link.x1, link.y1, x1, y1);
  }
  
  // Draw glowing patterns
  for (let i = 0; i < 200; i++) {
    let angle = time * 0.5 + i * 0.1;
    let radius = 100 + sin(time * 0.3 + i) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    let hue = (time * 20 + i * 5) % 360;
    fill(hue, 80, 90, 0.1);
    noStroke();
    ellipse(x, y, 10, 10);
  }
  
  // Draw complex geometric patterns
  for (let i = 0; i < 50; i++) {
    let angle = time * 0.2 + i * 0.3;
    let radius = 200 + sin(time * 0.4 + i) * 100;
    
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    stroke(30, 70, 60);
    strokeWeight(1);
    ellipse(x, y, 5, 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
