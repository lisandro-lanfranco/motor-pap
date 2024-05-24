let angle = 0;
const angleStep = 45;

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  estator = loadImage('images/estator.png');
  rotor = loadImage('images/rotor.png');
}

function draw() {
  background(255);

  // Dibujar el estator (fondo fijo)
  imageMode(CORNER);
  image(estator, 0, 0, width, height);

  // Dibujar la superposición de circulación de corriente en el estator
  dibujarCorriente();

  // Traducir al centro de la pantalla y rotar
  translate(width / 2, height / 2);
  rotate(angle);

  // Dibujar el rotor con transparencia
  imageMode(CENTER);
  image(rotor, 0, 0, 150, 150);
  
  // Dibujar el texto del título
  resetMatrix();
  textSize(24);
  fill(0);
  text("Motor PaP - Esquema", 100, 30);

  // Dibujar el texto de las instrucciones
  textSize(16);
  text("Presione las teclas <- y -> para girar el motor.", width / 2, height - 20);

}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
      angle -= angleStep;
  } else if (keyCode === RIGHT_ARROW) {
      angle += angleStep;
  }
}

function dibujarCorriente() {
  // Calcula el ángulo actual del rotor
  let adjustedAngle = angle % 360;
  if (adjustedAngle < 0) {
      adjustedAngle += 360;
  }

  // Define las posiciones y colores de los bobinados
  let positions = [
      { x: width / 2, y: 150, color: 'red' },
      { x: width - 250, y: height / 2, color: 'red' },
      { x: width / 2, y: height - 150, color: 'red' },
      { x: 250, y: height / 2, color: 'red' }
  ];

  // Definir los pasos intermedios
  let steps = [
      [0],        // Posición 1: bobinado A
      [0, 1],     // Posición 2: bobinado A y B
      [1],        // Posición 3: bobinado B
      [1, 2],     // Posición 4: bobinado B y C
      [2],        // Posición 5: bobinado C
      [2, 3],     // Posición 6: bobinado C y D
      [3],        // Posición 7: bobinado D
      [3, 0]      // Posición 8: bobinado D y A
  ];

  // Activar bobinados correspondientes según el ángulo del rotor
  let activeStep = Math.floor(adjustedAngle / (360 / steps.length));

  // Dibujar los bobinados energizados
  for (let i = 0; i < positions.length; i++) {
      let pos = positions[i];
      if (steps[activeStep].includes(i)) {
          fill(pos.color);
      } else {
          noFill();
      }
      noStroke();
      ellipse(pos.x, pos.y, 40, 40);
  }
}