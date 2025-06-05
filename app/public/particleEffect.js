// 获取 Canvas 和上下文
const canvas = document.getElementById('particle-background');
const ctx = canvas.getContext('2d');

// 设置 Canvas 尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 定义粒子数组
const particles = [];
const particleCount = 100;

// 记录鼠标位置
const mouse = {
    x: null,
    y: null,
    radius: 150 // 鼠标吸引范围
};

// 鼠标移动事件监听
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// 鼠标离开窗口时重置位置
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// 创建粒子类
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1; // 粒子半径
        this.initialDx = Math.random() * 0.6 - 0.3; // 初始水平速度
        this.initialDy = Math.random() * 0.6 - 0.3; // 初始垂直速度
        this.dx = this.initialDx;
        this.dy = this.initialDy;
        this.color = this.getRandomColor();
        this.lastInteractionTime = 0; // 最后一次鼠标交互时间
        this.isAccelerated = false; // 是否被加速状态
        this.accelerationFactor = 10; // 加速倍数
        this.recoveryDuration = 10000; // 恢复到原速的时间（毫秒）
    }

    // 生成随机渐变颜色
    getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        const now = Date.now();

        // 鼠标交互：加速
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius && !this.isAccelerated) {
                this.isAccelerated = true;
                this.lastInteractionTime = now;
                this.dx *= this.accelerationFactor;
                this.dy *= this.accelerationFactor;
            }
        }

        // 恢复逻辑：逐渐恢复到原速
        if (this.isAccelerated) {
            const elapsedTime = now - this.lastInteractionTime;
            if (elapsedTime < this.recoveryDuration) {
                const t = elapsedTime / this.recoveryDuration; // 0 到 1 的恢复时间比例
                this.dx = this.initialDx + (this.dx - this.initialDx) * (1 - t);
                this.dy = this.initialDy + (this.dy - this.initialDy) * (1 - t);
            } else {
                // 恢复完成，重置速度和状态
                this.dx = this.initialDx;
                this.dy = this.initialDy;
                this.isAccelerated = false;
            }
        }

        // 更新位置
        this.x += this.dx;
        this.y += this.dy;

        // 边界反弹
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.draw();
    }
}

// 初始化粒子
function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// 动画循环
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => particle.update());
    requestAnimationFrame(animateParticles);
}

// 窗口调整时更新 Canvas 尺寸
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 初始化并开始动画
initParticles();
animateParticles();