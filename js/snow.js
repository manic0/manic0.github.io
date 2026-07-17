/**
 * 花瓣飘落背景特效 - 结合版
 * - 花瓣形状来自 snow.js (贝塞尔曲线花瓣)
 * - 定位在毛玻璃主面板后面 (z-index: 0)
 * - 粉色系花瓣颜色
 */

(function() {
  "use strict";

  /* 动画兼容 */
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(cb) { return setTimeout(cb, 1000 / 60); };

  /* 花瓣颜色 - 粉色系 (来自 snow.js) */
  var PETAL_COLORS = [
    '#FFC0CB',
    '#FFB7C5',
    '#FF69B4',
    '#FFB6C1',
    '#FFE4E1',
    '#F8B8D0',
    '#E6A8D7'
  ];

  /* ========== 花瓣控制器 ========== */

  function PetalFall(options) {
    options = options || {};
    this.count = options.count || 80;
    this.size = options.size || 18;
    this.speed = options.speed || 1;
    this.petals = [];
  }

  /* 创建 canvas - 定位在毛玻璃主面板后面 */
  PetalFall.prototype.initCanvas = function() {
    var canvas = document.createElement("canvas");
    canvas.id = "petal-bg";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /* z-index: 0 确保在主面板后面飘 */
    canvas.style.cssText =
      "position:fixed;" +
      "top:0;" +
      "left:0;" +
      "width:100%;" +
      "height:100%;" +
      "z-index:0;" +
      "pointer-events:none;";

    document.body.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    var self = this;
    window.addEventListener("resize", function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };

  /* ========== 花瓣对象 ========== */

  function Petal(width, height, size, speed) {
    this.reset(width, height);

    this.size = Math.random() * size + 5;
    this.maxSize = size;
    this.speed = Math.random() * 0.2 + speed;
    this.velY = this.speed;
    this.velX = 0;
    this.stepSize = Math.random() / 30;
    this.step = Math.random() * Math.PI * 2;

    /* 旋转 (来自 snow.js) */
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;

    /* 透明度 */
    this.opacity = Math.random() * 0.4 + 0.5;

    /* 随机颜色 */
    this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  }

  Petal.prototype.reset = function(width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
  };

  /* 移动逻辑 (结合两份代码的物理效果) */
  Petal.prototype.update = function(canvasWidth, canvasHeight) {
    this.velX *= 0.98;
    if (this.velY <= this.speed) {
      this.velY = this.speed;
    }

    this.velX += Math.cos(this.step += 0.05) * this.stepSize;
    this.y += this.velY;
    this.x += this.velX;

    /* 花瓣旋转 */
    this.rotation += this.rotationSpeed;

    /* 超出边界时重置 */
    if (this.x >= canvasWidth || this.x <= 0 || this.y >= canvasHeight + 40 || this.y <= -40) {
      this.x = Math.floor(Math.random() * canvasWidth);
      this.y = -30;
      this.size = Math.random() * this.maxSize + 5;
      this.speed = Math.random() * 1 + 0.5;
      this.velY = this.speed;
      this.velX = 0;
      this.rotation = Math.random() * Math.PI * 2;
    }
  };

  /* 绘制花瓣形状 - 来自 snow.js 的贝塞尔曲线花瓣 */
  Petal.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    /* 花瓣渐变 */
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.7, this.color + 'CC');
    gradient.addColorStop(1, this.color + '66');

    ctx.fillStyle = gradient;
    ctx.beginPath();

    /* snow.js 的花瓣形状 - 椭圆形贝塞尔曲线 */
    var w = this.size;
    var h = this.size * 0.6;

    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w * 0.5, -h * 1.2, w, -h * 0.3, 0, h);
    ctx.bezierCurveTo(-w, -h * 0.3, -w * 0.5, -h * 1.2, 0, -h);

    ctx.fill();

    /* 花瓣中心纹理线 */
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.8);
    ctx.lineTo(0, h * 0.8);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  };

  /* ========== 创建花瓣 ========== */

  PetalFall.prototype.create = function() {
    for (var i = 0; i < this.count; i++) {
      this.petals.push(
        new Petal(this.canvas.width, this.canvas.height, this.size, this.speed)
      );
    }
  };

  /* ========== 动画循环 ========== */

  PetalFall.prototype.animate = function() {
    var self = this;
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < this.petals.length; i++) {
      this.petals[i].update(canvas.width, canvas.height);
      this.petals[i].draw(ctx);
    }

    requestAnimationFrame(function() {
      self.animate();
    });
  };

  /* ========== 启动 ========== */

  PetalFall.prototype.start = function() {
    this.initCanvas();
    this.create();
    this.animate();
  };

  /* ========== 页面加载时初始化 ========== */

  window.addEventListener("load", function() {
    var amount = window.innerWidth < 768 ? 35 : 90;

    var petalFall = new PetalFall({
      count: amount,
      size: 22,
      speed: 1.1
    });

    petalFall.start();
  });

})();