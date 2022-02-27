let playing = false;
const width = 300;
const height = 600;

const COLOR_TRIANGLE_RIGHT = "#c62828";
const COLOR_TRIANGLE_TOP = "#00bfa5";
const COLOR_TRIANGLE_LEFT = "#2979ff";
const COLOR_TRIANGLE_BOTTOM = "#ff9100";

const getDefaultValueRect = () => ({
  center: {
    x: 150,
    y: 375,
  },
  size: 150,
  padding: 5,
  angle: 0,
});

const getDefaultValueBall = () => ({
  x: width / 2,
  y: 20,
  width: 20,
  height: 20,
  radius: 10,
  vy: 0,
  color: COLOR_TRIANGLE_LEFT,
});

window.onload = function () {
  const handleEvent = (event) => {
    if (event.keyCode !== 32) {
      return;
    }

    handleClick();
  };
  const handleClick = () => {
    if (playing) {
      startAngle = rect.angle;
      return;
    }

    playing = true;
    updateScore(score);
    updateInfo("");
    requestAnimationFrame(tick);
  };

  document.addEventListener("keypress", debounce(handleEvent, 150));
  document.addEventListener("click", debounce(handleClick, 150));
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  canvas.backgroundColor = "#b2ebf2";
  const amplitude = 300;
  const elasticity = 2;
  const stepAngle = 10;
  const colors = [
    COLOR_TRIANGLE_TOP,
    COLOR_TRIANGLE_BOTTOM,
    COLOR_TRIANGLE_LEFT,
    COLOR_TRIANGLE_BOTTOM,
  ];
  let score = 0;
  let rect = getDefaultValueRect();
  let ball = getDefaultValueBall();

  const drawBall = () => {
    context.beginPath();
    context.fillStyle = ball.color;
    context.ellipse(ball.x, ball.y, ball.width, ball.height, 0, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.save();
  };
  const drawBackground = () => {
    context.clearRect(0, 0, width, height);
  };

  const drawRect = () => {
    const halfSize = rect.size / 2;
    const padding = rect.padding;
    const x = rect.center.x;
    const y = rect.center.y;
    context.beginPath();
    context.fillStyle = COLOR_TRIANGLE_RIGHT;
    context.moveTo(x + padding, y);
    context.lineTo(x + halfSize + padding, y + halfSize);
    context.lineTo(x + halfSize + padding, y - halfSize);
    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = COLOR_TRIANGLE_TOP;
    context.moveTo(x, y - padding);
    context.lineTo(x - halfSize, y - halfSize - padding);
    context.lineTo(x + halfSize, y - halfSize - padding);
    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = COLOR_TRIANGLE_LEFT;
    context.moveTo(x - padding, y);
    context.lineTo(x - halfSize - padding, y + halfSize);
    context.lineTo(x - halfSize - padding, y - halfSize);
    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = COLOR_TRIANGLE_BOTTOM;
    context.moveTo(x, y + padding);
    context.lineTo(x - halfSize, y + halfSize + padding);
    context.lineTo(x + halfSize, y + halfSize + padding);
    context.closePath();
    context.fill();
    context.restore();
  };

  let startAngle = 0;
  const rotateRect = () => {
    context.translate(rect.center.x, rect.center.y);

    if (rect.angle < startAngle + 90) {
      rect.angle = rect.angle + stepAngle;
    }
    context.rotate((Math.PI / 180) * rect.angle);
    context.translate(-rect.center.x, -rect.center.y);
  };

  const bound = () => {
    const currentColor = getCurrentTopColorRect();
    if (ball.color !== currentColor) {
      gameOver();
      return false;
    }

    ball.color = colors.filter((color) => color !== ball.color)[
      getRandom(0, 2)
    ];
    addScore();
    return true;
  };

  const getCurrentTopColorRect = () => {
    const rgba = context.getImageData(rect.center.x, rect.center.y - 50, 1, 1)
      .data;
    return RGBToHex(rgba[0], rgba[1], rgba[2]);
  };

  const addScore = () => {
    score++;
    updateScore(score);
  };

  const gameOver = () => {
    playing = false;
    score = 0;
    startAngle = 0;
    rect = getDefaultValueRect();
    ball = getDefaultValueBall();

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.restore();

    updateInfo("Game over! Press space to restart");
  };

  const updateInfo = (value) => {
    const info = document.getElementById("info");
    info.innerText = value;
  };

  const updateScore = (value) => {
    const info = document.getElementById("score");
    info.innerText = value;
  };

  const drawScene = () => {
    drawBackground();
    drawBall();
    drawRect();
  };

  const tick = () => {
    drawBackground();
    drawBall();
    rotateRect();
    drawRect();

    ball.vy += 16;
    ball.y += ball.vy / 60;

    if (ball.y - ball.radius < 10) {
      ball.y = ball.radius;
      ball.vy = -ball.vy;
    }
    if (ball.y + ball.radius > amplitude) {
      ball.y = amplitude - ball.radius;
      ball.vy = -ball.vy;
      bound();
    }
    if (amplitude - ball.y < ball.height) {
      ball.height = ball.height - elasticity;
      ball.width = ball.width + elasticity;
    } else {
      ball.height = Math.min(ball.height + elasticity, 20);
      ball.width = Math.max(ball.width - elasticity, 20);
    }
    playing && requestAnimationFrame(tick);
  };

  drawScene();
};
