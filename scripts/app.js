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
// Function to draw the field, robot, tape lines, and path
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

    // Draw the path (lines between waypoints)
    for (let i = 0; i < waypoints.length - 1; i++) {
        const wp1 = waypoints[i];
        const wp2 = waypoints[i + 1];
        ctx.strokeStyle = "#0000ff"; // Blue path
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wp1.x, wp1.y);
        ctx.lineTo(wp2.x, wp2.y);
        ctx.stroke();
    }

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

// Array to store waypoints (X, Y, Heading)
let waypoints = [];

// Function to add a new waypoint to the list
function addWaypoint() {
    const table = document.getElementById('waypointsTable');
    const row = table.insertRow(-1); // Add row at the end
    row.innerHTML = `
        <td>Waypoint ${table.rows.length - 1}</td>
        <td><input type="number" value="0"></td>
        <td><input type="number" value="0"></td>
        <td><input type="number" value="0"></td>
    `;
}

// Function to start following the path
function startPath() {
    // Capture the waypoints
    waypoints = [];
    const table = document.getElementById('waypointsTable');
    
    // Loop through the rows and capture X, Y, Heading for each waypoint
    for (let i = 1; i < table.rows.length; i++) {
        const x = parseInt(table.rows[i].cells[1].querySelector('input').value);
        const y = parseInt(table.rows[i].cells[2].querySelector('input').value);
        const heading = parseInt(table.rows[i].cells[3].querySelector('input').value);
        waypoints.push({ x, y, heading });
    }

    // Start the robot's movement
    moveRobotAlongPath();
}

// Function to move the robot along the path
function moveRobotAlongPath() {
    let currentIndex = 0;

    // Set initial robot position
    robotX = waypoints[currentIndex].x;
    robotY = waypoints[currentIndex].y;
    robotAngle = waypoints[currentIndex].heading;
    
    // Draw the first waypoint
    drawField();

    // Function to animate the robot moving from one waypoint to the next
    function animateRobot() {
        if (currentIndex < waypoints.length - 1) {
            currentIndex++;
            const nextWaypoint = waypoints[currentIndex];

            // Animate robot to the next point (linearly)
            const dx = nextWaypoint.x - robotX;
            const dy = nextWaypoint.y - robotY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 1; // Speed of robot movement

            const moveSteps = distance / speed;
            let step = 0;

            const interval = setInterval(() => {
                if (step < moveSteps) {
                    robotX += (dx / moveSteps);
                    robotY += (dy / moveSteps);
                    robotAngle = nextWaypoint.heading;
                    drawField();
                    step++;
                } else {
                    clearInterval(interval);
                    animateRobot(); // Move to the next waypoint
                }
            }, 50); // Refresh rate
        }
    }

    // Start the animation loop
    animateRobot();
}

