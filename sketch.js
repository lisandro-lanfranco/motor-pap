/* v03 Se agregan los modos de control
1- Wave Drive
2- Full Step Drive
3- Half Step Drive
4- Micro-Steps
*/

let angulo = 0;
let modo = 1;
let angleStep = 90;

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  estator = loadImage('images/estator.png');
  rotor = loadImage('images/rotor.png');
  
  // Crear botones
  let buttonContainer = createDiv().addClass('button-container');
  buttonContainer.parent(document.body);
  
  let modo1Button = createButton('1');
  modo1Button.mousePressed(() => modo = 1);
  modo1Button.parent(buttonContainer);

  let modo2Button = createButton('2');
  modo2Button.mousePressed(() => {
    modo = 2;
    angulo = 45;
    angleStep = 90;
  });
  modo2Button.parent(buttonContainer);
  
  let modo3Button = createButton('3');
  modo3Button.mousePressed(() => {
    modo = 3;
    angulo = 45;
    angleStep = 90;);
  modo3Button.parent(buttonContainer);
  
  let modo4Button = createButton('4');
  modo4Button.mousePressed(() => modo = 4);
  modo4Button.parent(buttonContainer);

  let leftButton = createButton('Girar Izquierda');
  leftButton.mousePressed(() => angulo -= angleStep);
  leftButton.parent(buttonContainer);

  let rightButton = createButton('Girar Derecha');
  rightButton.mousePressed(() => angulo += angleStep);
  rightButton.parent(buttonContainer);
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
  rotate(angulo);

  // Dibujar el rotor con transparencia
  imageMode(CENTER);
  image(rotor, 0, 0, 150, 150);
  
  // Dibujar el texto del título
  noStroke();
  resetMatrix();
  textSize(24);
  fill(0);
  text("Motor PaP - Esquema de funcionamiento", 100, 30);
  
  // Mostrar el angulo actual
  textSize(16);

  text("Angulo rotor: " + angulo, width / 2 -50, height - 30);
  
  // Mostrar el modo actual
  dibujarControl();

}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
      angulo -= angleStep;
  } else if (keyCode === RIGHT_ARROW) {
      angulo += angleStep;
  } else if (key === '1') {
      modo = 1;
      angulo = 0;
      angleStep = 90;
  } else if (key === '2') {
      modo = 2;
      angulo = 45;
      angleStep = 90;
  } else if (key === '3') {
      modo = 3;
      angulo = 0;
      angleStep = 45;
  } else if (key === '4') {
      modo = 4;
      angulo = 0;
      angleStep = 15;
  }
}

function dibujarCorriente() {
  // Calcula el ángulo actual del rotor
  let adjustedAngle = angulo % 360;
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
  
  let steps;
  if (modo === 1) {
    //Wave Drive
    steps = [
      [0],        // Posición 1: bobinado A
      [1],        // Posición 3: bobinado B
      [2],        // Posición 5: bobinado C
      [3]         // Posición 7: bobinado D
    ];
  }
  else if (modo === 2) {
  //Full Step Drive
    steps = [
      [0, 1],     // Posición 2: bobinado A y B
      [1, 2],     // Posición 4: bobinado B y C
      [2, 3],     // Posición 6: bobinado C y D
      [3, 0]      // Posición 8: bobinado D y A
    ];
  }
  else if (modo === 3) {
    //Half Step Drive
    steps = [
        [0],        // Posición 1: bobinado A
        [0, 1],     // Posición 2: bobinado A y B
        [1],        // Posición 3: bobinado B
        [1, 2],     // Posición 4: bobinado B y C
        [2],        // Posición 5: bobinado C
        [2, 3],     // Posición 6: bobinado C y D
        [3],        // Posición 7: bobinado D
        [3, 0]      // Posición 8: bobinado D y A
    ];
  }
  else if (modo === 4) {
    //Micro Step No implementado aun
    steps = [
        [0],        // Posición 1: bobinado A
        [0, 1],     // Posición 2: bobinado A y B
        [1],        // Posición 3: bobinado B
        [1, 2],     // Posición 4: bobinado B y C
        [2],        // Posición 5: bobinado C
        [2, 3],     // Posición 6: bobinado C y D
        [3],        // Posición 7: bobinado D
        [3, 0]      // Posición 8: bobinado D y A
    ];
  }

 // Dibujar los bobinados energizados
    for (let i = 0; i < positions.length; i++) {
        let pos = positions[i];
        let intensity = 0;

        if (modo === 4) {
            let stepAngle = 360 / steps.length;
            let stepIndex = Math.floor(adjustedAngle / stepAngle);
            let nextStepIndex = (stepIndex + 1) % steps.length;

            let currentStepAngle = stepAngle * stepIndex;
            let nextStepAngle = stepAngle * nextStepIndex;

            let t = (adjustedAngle - currentStepAngle) / (nextStepAngle - currentStepAngle);

            if (steps[stepIndex].includes(i) && steps[nextStepIndex].includes(i)) {
                intensity = lerp(255, 255, t);
            } else if (steps[stepIndex].includes(i)) {
                intensity = lerp(255, 0, t);
            } else if (steps[nextStepIndex].includes(i)) {
                intensity = lerp(0, 255, t);
            }
        } else {
            intensity = steps[Math.floor(adjustedAngle / (360 / steps.length))].includes(i) ? 255 : 0;
        }

        fill(pos.color.replace('red', `rgba(255, 0, 0, ${intensity / 255})`));
        stroke(pos.color.replace('red', `rgba(255, 0, 0, ${intensity / 255})`));
        rect(pos.x-25, pos.y-25, 50, 50);
    }
  
}

function dibujarControl() {
  stroke(255, 255, 0);
  fill(255, 255, 0, 127); // Relleno semi-transparente para visibilidad
    if (modo === 1) {
        ellipse(642, 468, 20, 20);
    } else if (modo === 2) {
        ellipse(642, 487, 20, 20);
    } else if (modo === 3) {
        ellipse(642, 504, 20, 20);
    } else if (modo === 4) {
        ellipse(642, 522, 20, 20);
    }
}