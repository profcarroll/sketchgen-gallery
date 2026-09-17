let notes = [];
const numNotes = 100;
const lineSpacing = 40;
let sheetWidth, sheetHeight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  sheetWidth = width * 0.8;
  sheetHeight = height * 0.6;
  
  // Initialize notes with random positions and velocities
  for (let i = 0; i < numNotes; i++) {
    notes.push({
      x: random(-100, -20),
      y: random(0, sheetHeight),
      speed: random(0.5, 2),
      size: random(8, 16),
      opacity: random(100, 255),
      life: 1
    });
  }
}

function draw() {
  background(245);
  
  // Draw the music sheet
  fill(255);
  noStroke();
  rect(width/2 - sheetWidth/2, height/2 - sheetHeight/2, sheetWidth, sheetHeight);
  
  // Draw the five parallel lines
  stroke(0);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    line(
      width/2 - sheetWidth/2,
      height/2 - sheetHeight/2 + i * lineSpacing,
      width/2 + sheetWidth/2,
      height/2 - sheetHeight/2 + i * lineSpacing
    );
  }
  
  // Update and display notes
  for (let note of notes) {
    // Move the note
    note.x += note.speed;
    
    // Fade out as it moves
    note.life -= 0.001;
    note.opacity = map(note.life, 0, 1, 0, 255);
    
    // Reset note if it goes off screen
    if (note.x > width + 20 || note.life <= 0) {
      note.x = random(-100, -20);
      note.y = random(0, sheetHeight);
      note.life = 1;
      note.opacity = random(100, 255);
    }
    
    // Draw the note
    fill(0, note.opacity);
    noStroke();
    ellipse(note.x, note.y, note.size, note.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
