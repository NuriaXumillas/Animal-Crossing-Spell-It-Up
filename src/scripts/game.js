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
            // this.word(); 
        }, 1000 / 60);
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
        this.player.draw();
    }

    move() {
        
        this.player.move();
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
