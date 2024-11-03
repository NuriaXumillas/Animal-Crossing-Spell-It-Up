 class Game {
        constructor(ctx) {
            this.ctx = ctx;
            this.floor = this.ctx.canvas.height - 90;
            this.player = new Player(ctx, this.ctx.canvas.width / 2, this.floor - 80, this.floor);
            this.background = new Background(ctx);
            this.letters = [];
            this.interval = null;
            this.started = false;
            this.lives = 3;
            this.currentDifficulty = 1; // Empezamos en dificultad 1
            this.completedWords = []; // Palabras completadas en el nivel actual
            this.setNewWord(); // primera palabra del juego
            this.capturedLetters = ""; // Letras capturadas correctamente
            this.nextLetterIndex = 0; // Índice de la siguiente letra esperada
            this.letterSpawnCounter = 0; // Contador para controlar la frecuencia de aparición
            this.availableLetters = this.targetWord.split(""); // Mezclamos letras del objetivo
          
            // Corazones
            this.heartImg = new Image();
            this.heartImg.src = "/assets/images/heart.png";
            this.noHeartImg = new Image();
            this.noHeartImg.src = "/assets/images/no-heart.png";

            // Musica
            this.audio = new Audio("/assets/sounds/music.mp3");
            this.audio.loop = true;
            this.audio.volume = 0.05;

            this.victoryAudio = new Audio("/assets/sounds/win.wav");
            this.victoryAudio.volume = 0.05;
            this.gameOverAudio = new Audio("/assets/sounds/gameover.wav");
            this.gameOverAudio.volume = 0.05;

            this.correctLetterAudio = new Audio("/assets/sounds/correct.wav");
            this.correctLetterAudio.volume = 0.05;
            this.incorrectLetterAudio = new Audio("/assets/sounds/incorrect.wav");
            this.incorrectLetterAudio.volume = 0.05;

            this.levelUpAudio = new Audio("/assets/sounds/levelUp.wav");
            this.levelUpAudio.volume = 0.05;
    
        }
        

    setNewWord() {
        const availableWords = words.filter(word => word.difficulty === this.currentDifficulty && !this.completedWords.includes(word.english));
            
            if (availableWords.length === 0) {
                this.advanceDifficulty(); // Avanza si no hay más palabras en la dificultad actual
            } else {
                const wordData = availableWords[Math.floor(Math.random() * availableWords.length)];
                this.targetWordSpanish = wordData.spanish;
                this.targetWord = wordData.english;
                this.availableLetters = this.targetWord.split("");
                this.capturedLetters = "";
                this.nextLetterIndex = 0;
            }
    }  

    advanceDifficulty() {
        const maxDifficulty = 3; // numero de niveles que hay
    
        if (this.currentDifficulty < maxDifficulty) {
            this.currentDifficulty++;
            this.levelUpAudio.play().catch(error => {
                console.log("Error al reproducir el sonido de subida de nivel:", error);
            });

            this.completedWords = []; 
            this.setNewWord();

        
        } else {
            this.showVictory(); 
        }
    }

    start() {
        if (!this.started) {
            this.started = true;

            // Musica del juego
            this.audio.play().catch(error => {
                console.log("Error al reproducir la música:", error);
            });

            this.interval = setInterval(() => {
                this.clear();
                this.move();
                this.draw();
                this.checkCollisions();

                this.letterSpawnCounter++;
                if (this.letterSpawnCounter >= 90) {
                    this.addLetter();
                    this.letterSpawnCounter = 0;
                }
            }, 1000 / 60);
        }
    }

    addLetter() {
        // Elegimos una sola letra al azar del arreglo combinado
        const char = this.availableLetters[Math.floor(Math.random() * this.availableLetters.length)];
        const isTarget = this.targetWord.includes(char); // Verifica si es parte de la palabra objetivo

        // Crea una nueva letra y la agrega a la lista de letras en pantalla
        const newLetter = new Letter(this.ctx, char, isTarget);
        this.letters.push(newLetter);
    }

    checkCollisions() {
        this.letters.forEach((letter, index) => {

            if (this.player.collides(letter)) {

                const expectedChar = this.targetWord[this.nextLetterIndex];

                if (letter.char === expectedChar) {

                    this.capturedLetters += letter.char; 
                    this.nextLetterIndex++; // si la letra capturada es la que necesitamos pasamos a la otra
                    this.correctLetterAudio.play().catch(error => {
                        console.log("Error al reproducir el sonido de letra correcta:", error);
                    }); // audio correcto
    
                    if (this.capturedLetters === this.targetWord) {
                        this.completedWords.push(this.targetWord); // Marca la palabra como completada
                        this.setNewWord(); // Configura la siguiente palabra
                    }
                } else {
                    this.lives--;

                    this.incorrectLetterAudio.play().catch(error => {
                        console.log("Error al reproducir el sonido de letra incorrecta:", error);
                    }); // audio incorrecto

                    if (this.lives <= 0) {
                        this.gameOver(); // si pierdes todas las vidas game over
                    }
                }
                this.letters.splice(index, 1);
            }
        });
    }

    draw() {

        this.background.draw();
        this.letters.forEach((e) => e.draw());
        this.player.draw();
    
        // Fondo marrón izq
        this.ctx.fillStyle = "rgba(92, 64, 51, 0.7)"; 
        this.ctx.fillRect(10, 10, 100, 80); 
    
        // Dibujar corazones para vidas
        for (let i = 0; i < 3; i++) {
            if (i < this.lives) {
                this.ctx.drawImage(this.heartImg, 20 + i * 30, 20, 24, 24); // Corazones llenos
            } else {
                this.ctx.drawImage(this.noHeartImg, 20 + i * 30, 20, 24, 24); // Corazones vacíos
            }
        }
    
        // Nivel de dificultad
        this.ctx.fillStyle = "rgba(92, 64, 51, 0.7)"; 
        this.ctx.fillRect(10, 50, 100, 40); 
        this.ctx.fillStyle = "#FFFFFF"; 
        this.ctx.font = "bold 20px monospace";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Lv." + this.currentDifficulty, 60, 75);
    
        // Fondo marrón palabras
        const textWidth = 200;
        this.ctx.fillStyle = "rgba(92, 64, 51, 0.7)";
        this.ctx.fillRect(this.ctx.canvas.width - textWidth - 10, 10, textWidth, 40);
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "bold 24px monospace";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.targetWordSpanish, this.ctx.canvas.width - textWidth / 2 - 10, 40);
    
        // Fondo amarillo palabras
        this.ctx.fillStyle = "rgba(255, 217, 102, 0.7)"; 
        this.ctx.fillRect(this.ctx.canvas.width - textWidth - 10, 55, textWidth, 40);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "bold 24px monospace";
        this.ctx.fillText(this.capturedLetters, this.ctx.canvas.width - textWidth / 2 - 10, 85);
    }
    
    showVictory() {
        this.pause();
        this.victoryAudio.play().catch(error => {
            console.log("Error al reproducir la música de victoria:", error);
        });
        document.getElementById("victoryScreen").classList.remove("hidden");
    }

    gameOver() {
        this.audio.pause();
        this.gameOverAudio.play().catch(error => {
        console.log("Error al reproducir la música de derrota:", error);
    });
        this.pause();
        document.getElementById("gameOverScreen").classList.remove("hidden");
    }

    pause() {
        this.audio.pause();
        clearInterval(this.interval);
        this.interval = null
        this.started = false
    }

    move() {
        this.player.move();
        this.letters.forEach((e) => e.move());
        this.background.move();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    setListeners() {
        document.addEventListener("keydown", (event) => {
            this.player.onKeyDown(event.keyCode);
        });

        document.addEventListener("keyup", (event) => {
            this.player.onKeyUp(event.keyCode);
        });
    }
}
