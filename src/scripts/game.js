class Game {
    constructor(ctx) {
        this.ctx = ctx;

        this.player = new Player(ctx);

        this.background = new Background(ctx);

        this.interval = null;

        this.started = false;
    }

    start() {
        this.player.y = -this.player.h; 
        this.player.vy = 0;

        this.started = true;

        this.interval = setInterval(() => {
            this.clear();
            this.move();
            this.draw();
            this.checkCollisions();
            this.letter(); 

            tick++;

            if (tick >= 300) {
                tick = 0;
                this.addLetter();
            }

        }, 1000 / 60);
    }

    checkCollisions() {
        this.letters.forEach((letter) => {
          if (this.player.collides(letter)) {
            // this.gameOver(); si choca hay que guardarla y mostrarla
          }
        });
      }
    
    
     addLetter() {
        const newLetter = new Letter (this.ctx);
        this.letters.push(newLetter);
    
        this.letters = this.letters.filter((e) => e.x + e.w > 0);
    
        console.log(this.letters.length);
    }
    

    gameOver() {
        this.pause();
    }

    pause() {
        this.started = false;
        clearInterval(this.interval);
    }

    draw() {
        this.background.draw();
        this.letters.forEach((e) => e.draw());
        this.player.draw();
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
