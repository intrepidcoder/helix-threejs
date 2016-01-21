// Declare global variables.
var scene, camera, renderer;

function init() {
    // Declare vaiables in function scope.
    var geometry, material, controls, sphere, axis, gui, guiParams;
    var time = 0, currentPosition, lastPosition, path, lineGeometry, line;

    // Create scene, camera, and rendere objects.
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    // Set coordinates for camera.
    camera.position.x = 180;
    camera.position.y = 180;
    camera.position.z = 180;

    // Add the renderer to the page.
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a basic blue material for the sphere and path.
    material = new THREE.MeshBasicMaterial({'color': 0x0080ff});

    // Add orbit controls to enable moving around.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create a sphere object.
    // SphereGeometry(radius, widthSegments, heightSegments);
    sphere = new THREE.Mesh(new THREE.SphereGeometry(8, 20, 10), material);
    sphere.position.set(50, 0, 0);
    scene.add(sphere);

    // Create a 3D axes object.
    axis = new THREE.AxisHelper(200);
    axis.position.set(0, 0, 0);
    scene.add(axis);

    // Create an object group to hold the lines that show the sphere's path.
    path = new THREE.Group();
    scene.add(path);

    // Create object of different parameters that can be changed via the GUI.
    guiParams = {
        // Move the sphere back to the starting position and restart the animation.
        'reset': function() {
            sphere.position.set(guiParams.radius, 0, 0);
            time = 0;
            lastPosition = new THREE.Vector3(guiParams.radius, 0, 0);
            scene.remove(path);
            path = new THREE.Group();
            scene.add(path);
        },
        'rotations': 2,
        'radius': 50,
        'velocity': 50
    };

    // Create menu in the top right of screen.
    gui = new dat.GUI();
    gui.add(guiParams, 'rotations', 1, 5).step(0.1); // Add slider to menu.
    gui.add(guiParams, 'radius', 10, 100); // Add slider to menu.
    gui.add(guiParams, 'velocity', 10, 50, 'velocity'); // Add slider to menu.
    gui.add(guiParams, 'reset'); // Add reset button to menu.

    // gui.add(guiParams, 'color', {'Red': 0xff0000, 'Blue': 0x0000ff, 'Green': 0x00ff00}); // Example: Add drop-down list to menu.
    // gui.add(guiParams, 'rotate'); // Example: Add checkbox to menu.
    gui.open(); // Open menu.

    lastPosition = new THREE.Vector3(guiParams.radius, 0, 0); // Store starting position.

    // Create a function to update all the objects and render the scene for the animation.
    function render() {
        // Add animation frame to call render() about 30 times a second.
        setTimeout(function() {
            requestAnimationFrame(render);
        }, 1000 / 30);

        if (time < guiParams.rotations) {
            // Increment time in 100 steps per rotation.
            time += 0.01;

            // Calculate the current position.
            currentPosition = new THREE.Vector3(
                guiParams.radius*Math.cos(2*Math.PI*time),
                guiParams.velocity*time,
                guiParams.radius*Math.sin(2*Math.PI*time)
            );

            // Update position of sphere.
            sphere.position.copy(currentPosition);

            // Draw a line from the previous position to the current possition.
            lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(lastPosition, currentPosition);
            line = new THREE.LineSegments(lineGeometry, material);
            path.add(line);

            lastPosition = currentPosition;
        }

        // Update the scene.
        renderer.render(scene, camera);
    }

    render(); // Start animation.
}

init();

// Create a function that is called whenever the window is resized.
window.addEventListener('resize', function() {
    var width = window.innerWidth, height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
