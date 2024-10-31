 class Game {
        constructor(ctx) {
            this.ctx = ctx;
            this.player = new Player(ctx);
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
            this.player.y = this.ctx.canvas.height - this.player.h;
            this.player.vy = 0;
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
     // Avanzar la dificultad

     advanceDifficulty() {
        if (this.currentDifficulty < 3) {

            this.currentDifficulty++;
            this.completedWords = []; // Palabras completadas a 0 
            this.setNewWord(); // Nueva palabra para la siguiente dificultad
        
        } else {
            this.showVictoryFinal(); // Ganas si completas todas las dificultades
        }
    }  

    start() {
        if (!this.started) {

            this.started = true

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

                    if (this.capturedLetters === this.targetWord) {
                        this.completedWords.push(this.targetWord); // Marca la palabra como completada
                        this.setNewWord(); // Configura la siguiente palabra
                    }
                } else {
                    this.lives--;
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

        // Palabra, letras capturadas, vidas y dificultad actual
        document.getElementById("word-to-spell").textContent = "Deletrea: " + this.targetWordSpanish;
        document.getElementById("captured-letters").textContent = "Palabra: " + this.capturedLetters;
        document.getElementById("lives-info").textContent = "Vidas: " + this.lives;
        document.getElementById("difficulty-info").textContent = "Nivel: " + this.currentDifficulty; 
    }

    
    showVictory() {
        this.pause();
        document.getElementById("victoryScreen").classList.remove("hidden");
    }

    gameOver() {
        this.pause();
        document.getElementById("gameOverScreen").classList.remove("hidden");
    }

    pause() {

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
