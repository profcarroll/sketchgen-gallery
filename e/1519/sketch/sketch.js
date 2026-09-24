let bandMembers = [];
const fieldWidth = 800;
const fieldHeight = 600;
const memberCount = 24;
const colors = [
  [255, 0, 0],    // red
  [0, 255, 0],    // green
  [0, 0, 255],    // blue
  [255, 255, 0],  // yellow
  [255, 0, 255],  // magenta
  [0, 255, 255]   // cyan
];
let time = 0;

function setup() {
  createCanvas(fieldWidth, fieldHeight);
  // Initialize band members in a circular formation
  for (let i = 0; i < memberCount; i++) {
    const angle = TWO_PI * i / memberCount;
    const radius = min(fieldWidth, fieldHeight) * 0.35;
    const x = width/2 + cos(angle) * radius;
    const y = height/2 + sin(angle) * radius;
    bandMembers.push({
      x,
      y,
      color: colors[i % colors.length],
      originalX: x,
      originalY: y,
      angle: angle
    });
  }
}

function draw() {
  // Static field background
  background(34, 139, 34); // Forest Green

  // Draw the field markings (simple grid)
  stroke(255);
  strokeWeight(1);
  noFill();
  rect(50, 50, fieldWidth - 100, fieldHeight - 100);

  // Draw center circle
  ellipse(width/2, height/2, 100, 100);

  // Draw field grid lines
  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < 10; i++) {
    line(50, 50 + i * (fieldHeight - 100) / 10, fieldWidth - 50, 50 + i * (fieldHeight - 100) / 10);
    line(50 + i * (fieldWidth - 100) / 10, 50, 50 + i * (fieldWidth - 100) / 10, fieldHeight - 50);
  }

  time += 0.02;

  // Update and draw band members
  for (let i = 0; i < bandMembers.length; i++) {
    const member = bandMembers[i];
    
    // Create formation patterns using sine and cosine functions
    const angle = member.angle + time;
    const radius = min(fieldWidth, fieldHeight) * 0.35;
    const spiralRadius = map(sin(time * 0.5 + i), -1, 1, 0, 200);
    
    // Use different movement patterns for different groups
    if (i % 4 === 0) {
      member.x = width/2 + cos(angle * 2) * radius + sin(time + i) * spiralRadius;
      member.y = height/2 + sin(angle * 2) * radius + cos(time + i) * spiralRadius;
    } else if (i % 4 === 1) {
      member.x = width/2 + cos(angle * 1.5) * (radius + sin(time * 0.7 + i) * 100);
      member.y = height/2 + sin(angle * 1.5) * (radius + sin(time * 0.7 + i) * 100);
    } else if (i % 4 === 2) {
      member.x = width/2 + cos(angle * 0.8) * radius;
      member.y = height/2 + sin(angle * 0.8) * radius + sin(time * 0.5 + i) * 150;
    } else {
      member.x = width/2 + cos(angle) * (radius + cos(time * 0.3 + i) * 100);
      member.y = height/2 + sin(angle) * (radius + cos(time * 0.3 + i) * 100);
    }

    fill(member.color[0], member.color[1], member.color[2]);
    noStroke();
    
    // Alternate between circle and square shapes
    if (i % 2 === 0) {
      ellipse(member.x, member.y, 20, 20);
    } else {
      rect(member.x - 10, member.y - 10, 20, 20);
    }
  }
}
