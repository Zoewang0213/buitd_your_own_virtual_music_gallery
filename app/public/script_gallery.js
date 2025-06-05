
        // 从收藏夹中获取图片并显示
        const collection = JSON.parse(localStorage.getItem('collection')) || [];
        console.log(collection)
        document.getElementById('virtualGallery').style.display = 'block';
        initVirtualGallery();

        function showHomePage() {
            window.location.href = 'index.html'
            document.getElementById('virtualGallery').style.display = 'none';
            document.getElementById('homePage').style.display = 'flex';
            // 清理Three.js的场景
            if (window.virtualGalleryRenderer) {
                window.virtualGalleryRenderer.dispose();
                window.virtualGalleryRenderer.forceContextLoss();
                window.virtualGalleryRenderer.domElement.remove();
                window.virtualGalleryRenderer = null;
            }
            if (window.virtualGalleryScene) {
                window.virtualGalleryScene.clear();
                window.virtualGalleryScene = null;
            }
        }

        function initVirtualGallery() {
            const virtualGalleryDiv = document.getElementById('virtualGallery');
            virtualGalleryDiv.innerHTML = '';

            // 重新添加返回首页按钮
            const homeButton = document.createElement('button');
            homeButton.id = 'homeButton';
            homeButton.textContent = 'Home';
            homeButton.onclick = showHomePage;
            virtualGalleryDiv.appendChild(homeButton);

          
      // 重新添加信息面板
const infoDiv = document.createElement('div');
infoDiv.id = 'info';
infoDiv.style.position = 'fixed'; // 设置为固定定位
infoDiv.style.top = '50%'; // 垂直居中
infoDiv.style.left = '50%'; // 水平居中
infoDiv.style.transform = 'translate(-50%, -50%)'; // 通过 transform 实现绝对居中
infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // 背景半透明
infoDiv.style.color = 'white';
infoDiv.style.padding = '2rem'; // 内边距
infoDiv.style.borderRadius = '10px'; // 圆角
infoDiv.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)'; // 添加阴影
infoDiv.style.zIndex = '1000'; // 确保面板在最前
infoDiv.style.transition = 'opacity 0.5s ease'; // 添加渐隐过渡效果
infoDiv.style.opacity = '1'; // 初始完全不透明

infoDiv.innerHTML = `
    <p>W, A, S, D keys to move</p>
    <p>Click and drag to look around</p>
    <p>Click "Play" to play the music</p>
    <button id="ok-button" style="
        margin-top: 1rem; 
        padding: 0.5rem 1rem; 
        font-size: 1rem; 
        background-color: #ffffff; 
        color: #000000; 
        border: none; 
        border-radius: 5px; 
        font-family: 'Inter', sans-serif; /* 设置为 Inter 字体 */
        font-weight: 700; /* 粗体 */
        cursor: pointer;">OK</button>
`;
            virtualGalleryDiv.appendChild(infoDiv);

// 为“OK”按钮添加点击事件
document.getElementById('ok-button').addEventListener('click', () => {
    infoDiv.style.opacity = '0'; // 设置透明度为 0，触发渐隐效果
    setTimeout(() => {
        infoDiv.style.display = 'none'; // 在动画结束后隐藏信息面板
    }, 500); // 500ms 等于 transition 的时长
});


            const scene = new THREE.Scene();
            window.virtualGalleryScene = scene;
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            window.virtualGalleryRenderer = renderer;
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById('virtualGallery').appendChild(renderer.domElement);

            // Improved Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);
            
            // Room dimensions
            const roomWidth = 40;
            const roomHeight = 20;
            const roomDepth = 40;
            
            // Function to create walls
            const createWall = (width, height, depth, position, rotation, color = 0x414D59) => {
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const material = new THREE.MeshPhongMaterial({ color });
                const wall = new THREE.Mesh(geometry, material);
                wall.position.copy(position);
                wall.position.y += 0.2;
                wall.rotation.copy(rotation);
                wall.receiveShadow = true;
                scene.add(wall);
                return wall;
            };
    
            const createBaseboard = (width, height, depth, position, rotation) => {
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const material = new THREE.MeshBasicMaterial({ color: 0x333333 }); // 使用深灰色纯色材质
                const baseboard = new THREE.Mesh(geometry, material);
            
                // 调整位置，避免与地面冲突
                baseboard.position.copy(position);
                baseboard.rotation.copy(rotation);
            
                // 禁用阴影
                baseboard.castShadow = false;
                baseboard.receiveShadow = false;
            
                scene.add(baseboard);
                return baseboard;
            };
            

          
            // Create gallery layout
            createWall(roomWidth, roomHeight, 0.1, new THREE.Vector3(0, 0, -roomDepth / 2), new THREE.Euler(0, 0, 0));
            createWall(roomWidth, roomHeight, 0.1, new THREE.Vector3(0, 0, roomDepth / 2), new THREE.Euler(0, Math.PI, 0));
            createWall(roomDepth, roomHeight, 0.1, new THREE.Vector3(-roomWidth / 2, 0, 0), new THREE.Euler(0, Math.PI / 2, 0));
            createWall(roomDepth, roomHeight, 0.1, new THREE.Vector3(roomWidth / 2, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));
            
            const baseboardHeight = 0.2; // 条带的高度
createBaseboard(roomWidth, baseboardHeight, 0.1, new THREE.Vector3(0, -roomHeight / 2 + 0.1, -roomDepth / 2), new THREE.Euler(0, 0, 0)); // 前墙
createBaseboard(roomWidth, baseboardHeight, 0.1, new THREE.Vector3(0, -roomHeight / 2 + 0.1, roomDepth / 2), new THREE.Euler(0, Math.PI, 0)); // 后墙
createBaseboard(roomDepth, baseboardHeight, 0.1, new THREE.Vector3(-roomWidth / 2, -roomHeight / 2 + 0.1, 0), new THREE.Euler(0, Math.PI / 2, 0)); // 左墙
createBaseboard(roomDepth, baseboardHeight, 0.1, new THREE.Vector3(roomWidth / 2, -roomHeight / 2 + 0.1, 0), new THREE.Euler(0, -Math.PI / 2, 0)); // 右墙

            // 创建底部条带
        
            // Textured floor
            const textureLoader = new THREE.TextureLoader();
            const floorTexture = textureLoader.load(' https://zoewang0213.github.io/final/carpet.png');
            floorTexture.wrapS = THREE.RepeatWrapping;
            floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(1, 1);
            const floorMaterial = new THREE.MeshPhongMaterial({ 
                map: floorTexture, 
              //color: 0xffffff, // 设置浅灰色，与纹理混合降低对比度
              //transparent: true, // 启用透明度支持
               //opacity: 1 // 设置为半透明，调节地板整体亮度
            });
            const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -roomHeight / 2;
            floor.receiveShadow = true;

                scene.add(floor);
                
            // Ceiling
            createWall(roomWidth, roomDepth, 0.1, new THREE.Vector3(0, roomHeight / 2, 0), new THREE.Euler(Math.PI / 2, 0, 0), 0xeeeeee);

            // 移除原来的 createColorBlock 函数

            // 新的函数来创建艺术品
            const createArtwork = (width, height, position, rotation, imageUrl, songTitle, artistName, songUrl) => {
    const loader = new THREE.TextureLoader();
    loader.load(
        imageUrl,
        (texture) => {
            const depth = 0.2; // 画作厚度
            const wallOffset = 0.2; // 画作离墙距离
            const whiteBorderOffset = 0; // 白色底偏移量
            const blackFrameOffset = 0; // 黑色外框偏移量
            const textOffset = 0.01;
           // 墙面法向量
            const wallNormal = new THREE.Vector3(0, 0, 1).applyEuler(rotation);
            // 创建画作
            const boxGeometry = new THREE.BoxGeometry(width, height, depth+0.4);
            const materials = [
                new THREE.MeshBasicMaterial({ color: 0x000000 }), // 上侧边框
                new THREE.MeshBasicMaterial({ color: 0x000000 }), // 后面（黑色）
                new THREE.MeshBasicMaterial({ color: 0x000000 }), // 右侧边框
                new THREE.MeshBasicMaterial({ color: 0x000000 }), // 左侧边框
                new THREE.MeshBasicMaterial({ map: texture }), // 前面（画作）
                new THREE.MeshBasicMaterial({ color: 0x000000 }), // 下侧边框
            ];
            const artwork = new THREE.Mesh(boxGeometry, materials);
            artwork.position.copy(position);
            artwork.rotation.copy(rotation);


            // 创建白色填充层
            const whiteBorderGeometry = new THREE.BoxGeometry(width + 0.4, height + 0.4, depth + 0.3);
            const whiteBorderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const whiteBorder = new THREE.Mesh(whiteBorderGeometry, whiteBorderMaterial);
            whiteBorder.position.copy(artwork.position);
            whiteBorder.rotation.copy(rotation);

            

            // 创建黑色外框
            const blackFrameGeometry = new THREE.BoxGeometry(width + 0.6, height + 0.6, depth + 0.2);
            const blackFrameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const blackFrame = new THREE.Mesh(blackFrameGeometry, blackFrameMaterial);
            blackFrame.position.copy(artwork.position);
            blackFrame.rotation.copy(rotation);

            

            // 添加到场景
            scene.add(blackFrame);
            scene.add(whiteBorder);
            scene.add(artwork);

            // 调试信息
            console.log(`Artwork at (${position.x}, ${position.y}, ${position.z}) with offsets applied.`);

            // 添加歌曲信息
            if (songTitle || artistName) {
                const songInfoCanvas = createMultiLineCanvas([songTitle, artistName], 1024, 256, 48);
                const songInfoTexture = new THREE.CanvasTexture(songInfoCanvas);
                const songInfoMaterial = new THREE.MeshBasicMaterial({ map: songInfoTexture, transparent: true });
                const songInfoPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, 1), songInfoMaterial);

                // 设置文字位置
                songInfoPlane.position.copy(artwork.position);
                songInfoPlane.position.add(wallNormal.multiplyScalar(textOffset)); // 文字向画作前方偏移
                songInfoPlane.position.y -= height / 2 + 0.7; // 下移到画作底部
                songInfoPlane.rotation.copy(rotation);
                scene.add(songInfoPlane);
            }
          
     // 添加按钮（播放/暂停）
if (songUrl) {
    const playButtonText = "Play";
    const playButtonCanvas = createSingleLineCanvas(playButtonText, 512, 128, 48);
    const playButtonTexture = new THREE.CanvasTexture(playButtonCanvas);
    const playButtonMaterial = new THREE.MeshBasicMaterial({ map: playButtonTexture, transparent: true });

    // 创建按钮平面
    const playButtonPlane = new THREE.Mesh(new THREE.PlaneGeometry(width / 2, 0.5), playButtonMaterial);

    // 设置按钮位置
    playButtonPlane.position.copy(artwork.position);
    playButtonPlane.position.add(wallNormal.multiplyScalar(textOffset)); // 按钮向画作前方偏移
    playButtonPlane.position.y -= height / 2 + 1.2; // 下移到文字下方
    playButtonPlane.rotation.copy(rotation);

    // 绑定点击事件Binding click events
    playButtonPlane.userData = { songUrl };
    playButtonPlane.onClick = () => handlePlayPause(playButtonPlane, songUrl, width / 2, 0.5); // 将按钮大小传递给事件处理器
    scene.add(playButtonPlane);
}
          
        },
        undefined,
        (error) => console.error(`Failed to load image ${imageUrl}`, error)
    );
};
          
          
          
          
          function createMultiLineCanvas(lines, width = 512, height = 256, fontSize = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.font = `bold ${fontSize+12}px Inter`;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    const lineHeight = fontSize * 1.5; // 行高
    const startY = (canvas.height - lines.length * lineHeight) / 2; // 居中起点高度

    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        context.fillText(line, canvas.width / 2, y);
    });

    return canvas;
}



            function createSingleLineCanvas(text, width = 512, height = 256, fontSize = 32) {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d');
                context.fillStyle = '#FFFFFF';
                context.font = `bold ${fontSize+20}px Inter`;
                context.textAlign = 'center';
                context.textBaseline = 'top';
            
                // 在画布中央绘制文字
                context.clearRect(0, 0, width, height);
                context.fillText(text, width / 2, height / 2);
            
                return canvas;
            }
            
            

            function updateSpriteText(sprite, text) {
                const newTexture = new THREE.CanvasTexture(createSingleLineCanvas(text, 512, 128)); // 创建新纹理
                sprite.material.map.dispose(); // 清理旧纹理
                sprite.material.map = newTexture; // 应用新纹理
            }
            
            

            let currentAudio = null;
            let currentPlayingSprite = null;
            
// 修改后的 handlePlayPause 函数，确保按钮大小不变
function handlePlayPause(sprite, songUrl, buttonWidth, buttonHeight) {
    if (currentAudio && currentPlayingSprite === sprite) {
        currentAudio.pause();
        currentAudio = null;
        updateButtonTexture(sprite, "Play", buttonWidth, buttonHeight); // 保持按钮大小
        currentPlayingSprite = null;
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        updateButtonTexture(currentPlayingSprite, "Play", buttonWidth, buttonHeight); // 保持按钮大小
    }

    currentAudio = new Audio(songUrl);
    currentAudio.play();
    currentPlayingSprite = sprite;
    updateButtonTexture(sprite, "Pause", buttonWidth, buttonHeight); // 保持按钮大小

    currentAudio.onended = () => {
        updateButtonTexture(sprite, "Play", buttonWidth, buttonHeight); // 保持按钮大小
        currentAudio = null;
        currentPlayingSprite = null;
    };
}

// 修改后的 updateButtonTexture 函数，支持自定义按钮大小
function updateButtonTexture(sprite, text, buttonWidth, buttonHeight) {
    const canvas = createSingleLineCanvas(text, 512, 128, 48);
    const newTexture = new THREE.CanvasTexture(canvas);

    sprite.material.map.dispose();
    sprite.material.map = newTexture;

    const aspectRatio = buttonWidth / buttonHeight;
    sprite.geometry.dispose();
    sprite.geometry = new THREE.PlaneGeometry(buttonWidth, buttonWidth / aspectRatio);
}
            
            
            function onDocumentMouseDown(event) {
                const mouse = new THREE.Vector2();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(scene.children, true);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.onClick) {
                        object.onClick();
                    }
                }
            }

            document.addEventListener('mousedown', onDocumentMouseDown);


            // 创建艺术品
        const artworkPositions = [
    // Front wall
    { pos: new THREE.Vector3(0, 0, -roomDepth / 2 + 0.1), rot: new THREE.Euler(0, 0, 0) },
    { pos: new THREE.Vector3(-10, 0, -roomDepth / 2 + 0.1), rot: new THREE.Euler(0, 0, 0) },
    { pos: new THREE.Vector3(10, 0, -roomDepth / 2 + 0.1), rot: new THREE.Euler(0, 0, 0) },

    // Left wall
    { pos: new THREE.Vector3(-roomWidth / 2 + 0.1, 0, -10), rot: new THREE.Euler(0, Math.PI / 2, 0) },
    { pos: new THREE.Vector3(-roomWidth / 2 + 0.1, 0, 0), rot: new THREE.Euler(0, Math.PI / 2, 0) },
    { pos: new THREE.Vector3(-roomWidth / 2 + 0.1, 0, 10), rot: new THREE.Euler(0, Math.PI / 2, 0) },

    // Right wall
    { pos: new THREE.Vector3(roomWidth / 2 - 0.1, 0, -10), rot: new THREE.Euler(0, -Math.PI / 2, 0) },
    { pos: new THREE.Vector3(roomWidth / 2 - 0.1, 0, 0), rot: new THREE.Euler(0, -Math.PI / 2, 0) },
    { pos: new THREE.Vector3(roomWidth / 2 - 0.1, 0, 10), rot: new THREE.Euler(0, -Math.PI / 2, 0) },

    // Back wall
    { pos: new THREE.Vector3(0, 0, roomDepth / 2 - 0.1), rot: new THREE.Euler(0, Math.PI, 0) },
    { pos: new THREE.Vector3(-10, 0, roomDepth / 2 - 0.1), rot: new THREE.Euler(0, Math.PI, 0) },
    { pos: new THREE.Vector3(10, 0, roomDepth / 2 - 0.1), rot: new THREE.Euler(0, Math.PI, 0) }
];

            collection.forEach((card, index) => {
                if (index < artworkPositions.length) {
                    createArtwork(4, 4, artworkPositions[index].pos, artworkPositions[index].rot, card.albumImage, card.title,
                        card.artist,
                        card.songUrl);
                }
            });


          
// Function to create modern pendant lights
function createModernPendant(x, y, z) {
    const group = new THREE.Group();

    // Wire (吊灯的电线)
    const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, roomHeight / 2 - y),
        wireMaterial
    );
    wire.position.set(0, (roomHeight / 2 - y) / 2, 0);
    group.add(wire);

    // Half-sphere light (半圆形灯罩)
    const lightMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.5
    });

    const lightShape = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), // 半圆形
        lightMaterial
    );

    lightShape.position.set(0, -roomHeight / 4, 0); // 调整位置
    group.add(lightShape);

    // Light source (灯光点)
    const light = new THREE.PointLight(0xffffff, 1, 15);
    light.position.set(0, -roomHeight / 4, 0); // 放置在灯罩中心
    group.add(light);

    // Set position of the group
    group.position.set(x, y, z);
    scene.add(group);
}

// Create modern pendant lights in a 3×3 grid
const gridRows = 3; // 行数
const gridCols = 3; // 列数
const spacingX = roomWidth / (gridCols + 1); // 灯光之间的水平间隔
const spacingZ = roomDepth / (gridRows + 1); // 灯光之间的深度间隔

for (let i = 1; i <= gridRows; i++) {
    for (let j = 1; j <= gridCols; j++) {
        const x = -roomWidth / 2 + j * spacingX; // 根据列数计算 X 坐标
        const z = -roomDepth / 2 + i * spacingZ; // 根据行数计算 Z 坐标
        const y = roomHeight * 3 / 4; // 高度固定在天花板
        createModernPendant(x, y, z);
    }
}
            // Add decorative plan
            // Camera setup
            camera.position.set(0, 0, 5);

            // Control variables
            let isMouseDown = false;
            let startX = 0;
            let startY = 0;
            const moveSpeed = 0.1;
            const keysPressed = {};

          
            // Event listeners
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('wheel', onWheel);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            function onMouseDown(event) {
                isMouseDown = true;
                startX = event.clientX;
                startY = event.clientY;
            }

            function onMouseMove(event) {
                if (!isMouseDown) return;
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                camera.rotation.y -= deltaX * 0.01;
                // camera.rotation.x -= deltaY * 0.01;
                // camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
                startX = event.clientX;
                startY = event.clientY;
            }


            function onMouseUp() {
                isMouseDown = false;
            }

            function onWheel(event) {
                const zoomSpeed = 0.05;
                camera.position.z += event.deltaY * zoomSpeed;
                camera.position.z = Math.max(2, Math.min(15, camera.position.z));
            }

            function onKeyDown(event) {
                keysPressed[event.key.toLowerCase()] = true;
            }

            function onKeyUp(event) {
                keysPressed[event.key.toLowerCase()] = false;
            }

            function moveCamera() {
                const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
                const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

                if (keysPressed['w']) camera.position.add(forward.multiplyScalar(moveSpeed));
                if (keysPressed['s']) camera.position.add(forward.multiplyScalar(-moveSpeed));
                if (keysPressed['a']) camera.position.add(right.multiplyScalar(-moveSpeed));
                if (keysPressed['d']) camera.position.add(right.multiplyScalar(moveSpeed));

                // Constrain movement
                camera.position.x = Math.max(-roomWidth / 2 + 0.5, Math.min(roomWidth / 2 - 0.5, camera.position.x));
                camera.position.z = Math.max(-roomDepth / 2 + 0.5, Math.min(roomDepth / 2 - 0.5, camera.position.z));
                camera.position.y = 0;
            }

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                moveCamera();
                renderer.render(scene, camera);
            }
            animate();

            // Handle window resize
            window.virtualGalleryResizeHandler = function () {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', window.virtualGalleryResizeHandler, false);
            // At the end of initVirtualGallery function
            // Event listeners
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('wheel', onWheel);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            window.addEventListener('resize', window.virtualGalleryResizeHandler, false);
        }


        // 初始化首页


