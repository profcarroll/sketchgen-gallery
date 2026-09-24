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
      originalY: y
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

  // Draw band members as geometric shapes
  for (let i = 0; i < bandMembers.length; i++) {
    const member = bandMembers[i];
    
    fill(member.color[0], member.color[1], member.color[2]);
    noStroke();
    
    // Alternate between circle and square shapes
    if (i % 2 === 0) {
      ellipse(member.x, member.y, 20, 20);
    } else {
      rect(member.x - 10, member.y - 10, 20, 20);
    }
  }

  // Ensure no motion occurs
  noLoop();
}
