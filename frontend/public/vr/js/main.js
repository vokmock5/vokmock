// Main Application
let sceneManager, roomBuilder, cameraControls;

function init() {
    // Initialize Scene
    sceneManager = new SceneManager();

    // Build Room
    roomBuilder = new RoomBuilder(sceneManager.scene);
    roomBuilder.createRoom();

    // Setup Controls
    cameraControls = new CameraControls(sceneManager.camera);

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);

    // Start animation
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    cameraControls.update();
    
    // Render scene
    sceneManager.render();
}

// Start the application when page loads
window.addEventListener('load', init);

window.addEventListener("interview-question", (e) => {
  console.log("🎤 Interviewer says:", e.detail);
  // Later: animate avatar mouth / head nod
}); 