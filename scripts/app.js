// Get the canvas element and its context
const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size (12 ft x 12 ft field, 144 inches per side)
const FIELD_SIZE = 144; // Field size in inches (12 ft = 144 inches)

// Robot properties (initial values)
let robotLength = 12;
let robotWidth = 12;
let robotX = 0;
let robotY = 0;
let robotAngle = 0;

// Tape lines (store red and blue tape lines)
let tapeLines = [];

// Setup canvas size
canvas.width = FIELD_SIZE;
canvas.height = FIELD_SIZE;

// Function to update the robot's properties
function updateRobot() {
    robotLength = parseInt(document.getElementById('robotLength').value);
    robotWidth = parseInt(document.getElementById('robotWidth').value);
    robotX = parseInt(document.getElementById('robotX').value);
    robotY = parseInt(document.getElementById('robotY').value);
    robotAngle = parseInt(document.getElementById('robotAngle').value);
    drawField();
}

// Function to draw the field, robot, and tape lines
function drawField() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the field (light gray background)
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tape lines (red or blue)
    tapeLines.forEach(line => {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    });

    // Draw the robot (rectangle)
    ctx.save();
    ctx.translate(robotX, robotY);
    ctx.rotate(robotAngle * Math.PI / 180); // Convert angle to radians
    ctx.fillStyle = "#00ff00"; // Green robot
    ctx.fillRect(-robotLength / 2, -robotWidth / 2, robotLength, robotWidth); // Draw robot centered at (robotX, robotY)
    ctx.restore();
}

// Add tape line (red or blue)
function addTapeLine(x1, y1, x2, y2, color) {
    tapeLines.push({x1, y1, x2, y2, color});
    drawField();
}

// Example: Add a red tape line
addTapeLine(10, 10, 134, 10, 'red');
addTapeLine(10, 134, 134, 134, 'blue');

// Initial draw
drawField();
