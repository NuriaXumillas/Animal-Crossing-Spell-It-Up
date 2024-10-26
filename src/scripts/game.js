 class Game {
        constructor(ctx) {
            this.ctx = ctx;
            this.player = new Player(ctx);
            this.background = new Background(ctx);
            this.letters = [];
            this.interval = null;
            this.started = false;
            this.lives = 3;
            this.targetWordSpanish = "SILLA"; // Traducción en español de la palabra objetivo
            this.targetWord = "CHAIR"; // Palabra objetivo
            this.capturedLetters = ""; // Letras capturadas correctamente
            this.nextLetterIndex = 0; // Índice de la siguiente letra esperada
            this.letterSpawnCounter = 0; // Contador para controlar la frecuencia de aparición
    
            // Mezclamos letras objetivo 
            this.availableLetters = this.targetWord.split("");
        }

    start() {
        this.player.y = this.ctx.canvas.height - this.player.h;
        this.player.vy = 0;
        this.started = true;
        this.lives = 3;
        this.capturedLetters = "";
        this.letters = [];
        this.nextLetterIndex = 0;
        this.letterSpawnCounter = 0;

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
                    this.nextLetterIndex++; 

                    // Verificar si ha completado la palabra
                    if (this.capturedLetters === this.targetWord) {
                        alert("¡Ganaste!");
                        this.gameOver();
                    }
                } else {
                    // Letra incorrecta, pierde una vida
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
                // Eliminar letra del array tras la colisión
                this.letters.splice(index, 1);
            }
        });
    }

    draw() {
        this.background.draw();
        this.letters.forEach((e) => e.draw());
        this.player.draw();

         // Mostrar la palabra en español 
         this.ctx.font = "24px Arial";
         this.ctx.fillText("Palabra en español: " + this.targetWordSpanish, this.ctx.canvas.width - 300, 50);
 

        // Letras capturadas y vidas
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Palabra: " + this.capturedLetters, 10, 50);
        this.ctx.fillText("Vidas: " + this.lives, 10, 80);
    }

    gameOver() {
        this.pause();
        alert("Game Over!");
    }

    pause() {
        this.started = false;
        clearInterval(this.interval);
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
