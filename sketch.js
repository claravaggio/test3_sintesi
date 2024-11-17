// Variabili principali
let rectWidth = 10; // Larghezza del rettangolo bianco
let rectHeight = 100; // Altezza del rettangolo bianco

let greenArcVisible = false; // Flag per il semicerchio verde
let greenArcAngleStart; // Angolo iniziale del semicerchio verde
let greenArcAngleEnd; // Angolo finale del semicerchio verde
let greenArcMoveSpeed = -0.006; // Velocità di movimento del semicerchio verde verso lo zero

let counter = 0; // Contatore che funge da tachimetro
let speedIncrease = 0.5; // Velocità di aumento del contatore
let decreaseFactor = 0.1; // Fattore di riduzione del contatore
let spacePressed = false; // Flag per controllare se spacebar è premuto

// Variabili per le auto
let auto1X = 10;
let auto2X = 200;
let auto2Speed = 1.5; // Velocità della seconda auto

let gameOver = false;
let simulationStarted = false;

let progress = 0; // Variabile di progresso per il cerchio
let maxProgress = 100; // Valore massimo di progresso

let rectColor = 255; // Colore iniziale bianco

function preload() {
  img1 = loadImage("assets/car1.png");
  img2 = loadImage("assets/car2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (gameOver) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(100);
    text("GAME OVER", width / 2, height / 2 - 100);
    return;
  }

  background(0);
  fill(255, 255, 255);
  rect(0, 0, windowWidth, 80);

  fill(255);
  textSize(50);
  textAlign(LEFT);
  text("3", 20, height - 30);

  image(img1, auto1X, 10, img1.width / 8, img1.height / 8);
  image(img2, auto2X, 10, img2.width / 8, img2.height / 8);

  if (simulationStarted) {
    // Muove la seconda auto
    auto2X += auto2Speed;
    if (auto2X > width - img2.width / 8) {
      auto2X = width - img2.width / 8;
      auto2Speed = 0;
    }
  }

  // Disegna cerchio di base fisso bianco
  noFill();
  stroke(255);
  strokeWeight(30);
  arc(width / 2, height / 2, 300, 300, 0, TWO_PI);

  // Controllo per il progresso circolare che parte dal basso (90 gradi)
  if (keyIsDown(ENTER)) {
    if (!simulationStarted) {
      simulationStarted = true; // Inizia la simulazione con la prima pressione di ENTER
    }

    counter += speedIncrease;
    counter = constrain(counter, 0, maxProgress);
    progress = counter;
    auto1X += map(counter, 0, 100, 0, 5);
    greenArcVisible = false; // Nasconde il semicerchio verde durante l'accelerazione
  } else {
    counter -= decreaseFactor;
    counter = max(counter, 0);
    progress = counter;
    if (!spacePressed) {
      progress -= 0.5;
    }
    auto1X += map(counter, 0, 100, 0, 3);
  }

  // Gestione della barra spaziatrice per attivare il semicerchio verde
  if (keyIsDown(32) && counter > 0) {
    if (!greenArcVisible) {
      // Inizia il semicerchio verde dalla posizione attuale del progresso
      greenArcAngleEnd = map(
        progress,
        0,
        maxProgress,
        HALF_PI,
        TWO_PI + HALF_PI
      );
      greenArcAngleStart = greenArcAngleEnd - QUARTER_PI; // Semicerchio corto (un quarto di cerchio)
      greenArcVisible = true;
    }
    spacePressed = true;
    counter -= decreaseFactor * 3;
    counter = max(counter, 0);
    progress -= 2;
    auto1X += map(counter, 0, 100, 0, 1);
  } else {
    spacePressed = false;
  }

  if (greenArcVisible) {
    // Muove il semicerchio verde verso lo zero
    greenArcAngleStart += greenArcMoveSpeed;
    greenArcAngleEnd = greenArcAngleStart + QUARTER_PI;

    // Nasconde il semicerchio verde quando raggiunge lo zero
    if (greenArcAngleEnd <= HALF_PI) {
      greenArcVisible = false;
    }
  }

  // Imposta colore del cerchio principale in base alla posizione rispetto al semicerchio verde
  let progressColor;
  let angleProgress = map(progress, 0, maxProgress, HALF_PI, TWO_PI + HALF_PI);

  if (progress > 0) {
    progressColor = color(180); // Colore grigio per il progresso
  } else {
    progressColor = color(255); // Colore bianco per il cerchio quando il progresso è a zero
  }

  if (counter > 0 && greenArcVisible) {
    if (
      angleProgress > greenArcAngleStart &&
      angleProgress < greenArcAngleEnd
    ) {
      progressColor = color(130, 255, 134); // Verde se è all'interno del semicerchio verde
    } else if (
      angleProgress >= greenArcAngleEnd ||
      angleProgress <= greenArcAngleStart
    ) {
      progressColor = color(255, 0, 0); // Rosso se fuori dal semicerchio verde
    }
  }

  // Disegna cerchio di progresso
  noFill();
  stroke(progressColor);
  strokeWeight(30);
  arc(width / 2, height / 2, 300, 300, HALF_PI, angleProgress);

  // Disegna il semicerchio verde se visibile
  if (greenArcVisible) {
    stroke(130, 255, 134, 150);
    strokeWeight(10);
    arc(width / 2, height / 2, 360, 360, greenArcAngleStart, greenArcAngleEnd);
  }

  // Controllo collisione per il game over
  if (auto1X + img1.width / 8 > auto2X) {
    gameOver = true;
  }

  noStroke();
  // Testo del contatore al centro del cerchio
  fill(255);
  textSize(80);
  textFont("aktiv-grotesk");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(int(counter), width / 2, height / 2);
}
