let mic;
let vol = 0;
let threshold = 0.7;
let jumpscareActive = false;
let jumpscareImage;
let jumpscareSound;
let soundStarted = false;
let score = 0;
let question, options, correctAnswer;
let gameOver = false;
let resetButton;

function preload() {
  jumpscareImage = loadImage('IMAGENS/monstro.png');
  jumpscareSound = loadSound('IMAGENS/jumpsacare.wav');
}

function setup() {
  createCanvas(800, 600);
  mic = new p5.AudioIn();
  mic.start();
  generateQuestion();

  // Criar o botão de reset
  resetButton = createButton('Reset');
  resetButton.position(width / 2 - 40, height - 80);
  resetButton.size(80, 40);
  resetButton.mousePressed(resetGame);
}

function draw() {
  background(0);

  // Ler o volume do microfone
  vol = mic.getLevel();

  // Exibir volume na tela
  fill(255);
  textSize(24);
  text(`Volume: ${vol.toFixed(2)}`, 10, 30);
  text(`Score: ${score}`, width - 150, 30);

  // Verificar se o volume excede o limite para ativar o jumpscare
  if (vol > threshold && !jumpscareActive && !gameOver) {
    triggerJumpscare();
  }

  // Exibir a imagem do jumpscare
  if (jumpscareActive) {
    image(jumpscareImage, 0, 0, width, height);
    textSize(50);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text('GAME OVER', width / 2, height / 2);
  }

  // Se o jogo não acabou, exibir a questão e as opções
  if (!gameOver) {
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(255);
    text(question, width / 2, height / 3);

    // Exibir as opções de resposta
    for (let i = 0; i < options.length; i++) {
      let y = height / 2 + i * 50;
      fill(0, 255, 0);
      rect(width / 2 - 150, y - 20, 300, 40);
      fill(255);
      text(options[i], width / 2, y);
    }
  }
}

function mousePressed() {
  if (!gameOver) {
    // Verifica qual opção foi clicada
    for (let i = 0; i < options.length; i++) {
      let y = height / 2 + i * 50;
      if (mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > y - 20 && mouseY < y + 20) {
        checkAnswer(options[i]);
      }
    }
  }
}

function checkAnswer(selectedOption) {
  if (selectedOption === correctAnswer) {
    score += 10;  // Aumenta a pontuação
    generateQuestion(); // Gera uma nova questão
  } else {
    triggerJumpscare(); // Ativa o jumpscare se a resposta for errada
  }
}

function generateQuestion() {
  // Gera uma questão matemática simples
  let num1 = floor(random(1, 10));
  let num2 = floor(random(1, 10));
  let operation = floor(random(0, 4)); // 0: soma, 1: subtração, 2: multiplicação, 3: divisão

  switch (operation) {
    case 0:
      question = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
      break;
    case 1:
      question = `${num1} - ${num2}`;
      correctAnswer = num1 - num2;
      break;
    case 2:
      question = `${num1} * ${num2}`;
      correctAnswer = num1 * num2;
      break;
    case 3:
      question = `${num1} / ${num2}`;
      correctAnswer = num1 / num2;
      break;
  }

  // Gera opções de resposta (uma correta e três erradas)
  options = [correctAnswer];
  while (options.length < 4) {
    let wrongAnswer = floor(random(correctAnswer - 5, correctAnswer + 5));
    if (!options.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
      options.push(wrongAnswer);
    }
  }
  shuffle(options, true); // Embaralha as opções para que a correta não esteja sempre na mesma posição
}

function triggerJumpscare() {
  jumpscareActive = true;
  soundStarted = false;

  // Começar a tocar o som
  jumpscareSound.play();

  // Esperar o som terminar para esconder a imagem
  jumpscareSound.onended(() => {
    jumpscareActive = false;
    gameOver = true;  // Finaliza o jogo após o jumpscare
  });

  // Impede que o som toque múltiplas vezes
  if (!soundStarted) {
    soundStarted = true;
  }
}

function resetGame() {
  // Reinicia o jogo
  score = 0;
  gameOver = false;
  generateQuestion(); // Gera uma nova questão após o reset
  jumpscareActive = false;
  soundStarted = false;
}
