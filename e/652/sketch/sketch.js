let notes = [];
const numLines = 5;
const lineHeight = 100;
const lineSpacing = 20;
let sheetHeight;

function setup() {
  createCanvas(800, 600);
  sheetHeight = lineHeight + (numLines - 1) * lineSpacing;
  
  // Initialize notes
  for (let i = 0; i < 20; i++) {
    notes.push({
      x: random(width),
      y: random(sheetHeight),
      speed: random(1, 3),
      size: random(5, 15),
      opacity: random(100, 255)
    });
  }
}

function draw() {
  background(240);
  
  // Draw the sheet music lines
  stroke(0);
  strokeWeight(1);
  for (let i = 0; i < numLines; i++) {
    const y = i * lineSpacing + lineHeight;
    line(0, y, width, y);
  }
  
  // Update and display notes
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    
    // Move the note
    note.x += note.speed;
    
    // Check if note is out of bounds
    if (note.x > width + 50) {
      // Reset note to start
      note.x = -50;
      note.y = random(sheetHeight);
      note.opacity = random(100, 255);
    }
    
    // Draw the note
    fill(0, note.opacity);
    noStroke();
    ellipse(note.x, note.y, note.size);
  }
}
