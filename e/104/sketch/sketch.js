let hills = [];
let trees = [];
let river;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create hills
  for (let i = 0; i < 5; i++) {
    hills.push({
      y: height * 0.6 + random(-20, 20),
      w: width * 0.8 + random(-100, 100),
      h: height * 0.3 + random(-30, 30),
      color: color(90 + random(20), 60 + random(20), 20 + random(20))
    });
  }
  
  // Create trees
  for (let i = 0; i < 20; i++) {
    trees.push({
      x: random(width),
      y: height * 0.7 + random(-50, 50),
      size: random(10, 30),
      color: color(40 + random(20), 80 + random(20), 20 + random(20))
    });
  }
  
  // Create river
  river = {
    points: [],
    width: random(50, 100)
  };
  
  for (let x = 0; x < width; x += 20) {
    river.points.push({
      x: x,
      y: height * 0.8 + sin(x * 0.02 + time) * 30
    });
  }
}

function draw() {
  background(150, 200, 255);
  
  // Draw sky gradient
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(150, 200, 255), color(220, 240, 255), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  // Draw distant mountains
  fill(80, 100, 60);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.7 + sin(x * 0.01 + time * 0.5) * 40;
    curveVertex(x, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);
  
  // Draw hills
  for (let hill of hills) {
    fill(hill.color);
    beginShape();
    vertex(0, height);
    vertex(0, hill.y);
    curveVertex(0, hill.y);
    curveVertex(hill.w * 0.5, hill.y - hill.h * 0.8);
    curveVertex(hill.w, hill.y);
    curveVertex(width, hill.y);
    vertex(width, height);
    endShape(CLOSE);
  }
  
  // Draw river
  fill(30, 120, 200);
  noStroke();
  beginShape();
  for (let point of river.points) {
    vertex(point.x, point.y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Draw trees
  for (let tree of trees) {
    fill(tree.color);
    ellipse(tree.x, tree.y, tree.size, tree.size * 1.5);
    
    // Trunk
    stroke(80, 60, 40);
    strokeWeight(3);
    line(tree.x, tree.y + tree.size * 0.7, tree.x, tree.y + tree.size * 1.5);
  }
  
  // Animate time
  time += 0.01;
  
  // Simulate subtle movement in hills and river
  for (let hill of hills) {
    hill.y += sin(time * 0.3) * 0.2;
    hill.w += cos(time * 0.2) * 0.5;
  }
  
  for (let i = 0; i < river.points.length; i++) {
    river.points[i].y = height * 0.8 + sin(river.points[i].x * 0.02 + time) * 30;
  }
}

function mouseDragged() {
  // Create ripple effect
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  if (d > 10) {
    let angle = atan2(mouseY - pmouseY, mouseX - pmouseX);
    
    for (let i = 0; i < hills.length; i++) {
      let hill = hills[i];
      let distToHill = dist(mouseX, mouseY, width/2, hill.y);
      if (distToHill < 300) {
        let intensity = map(distToHill, 0, 300, 1, 0.5);
        hill.color = lerpColor(hill.color, color(120, 80, 40), intensity * 0.2);
      }
    }
    
    for (let i = 0; i < trees.length; i++) {
      let tree = trees[i];
      let distToTree = dist(mouseX, mouseY, tree.x, tree.y);
      if (distToTree < 200) {
        let intensity = map(distToTree, 0, 200, 1, 0.5);
        tree.color = lerpColor(tree.color, color(70, 110, 40), intensity * 0.3);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
