class Player {
    constructor(ctx) {
        this.ctx = ctx;

        this.w = 50;
        this.h = 50;

        this.x = (this.ctx.canvas.width - this.w) / 2; 
        this.y = this.ctx.canvas.height - this.h ; 
        
        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 1; 

        this.img = new Image();
        this.img.src = "../assets/images/player.png";
        
        this.isJumping = false; 
    }

    move() {
        this.vy += this.ay; 
        this.vx += this.ax;

        this.x += this.vx;
        this.y += this.vy;

       // abajo
        if (this.y + this.h >= this.ctx.canvas.height) {
            this.vy = 0;
            this.y = this.ctx.canvas.height - this.h ; 
            this.isJumping = false; 
        }

        // superior
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        // izquierdo
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        // derecho
        if (this.x + this.w > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.w;
            this.vx = 0;
        }
    }

    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h); 
    }

    jump() {
        if (!this.isJumping) {
            this.vy = -20; 
            this.isJumping = true; 
        }
    }

    onKeyDown(code) {
        switch (code) {
          case KEY_UP:
            this.jump();
            break;
          case KEY_RIGHT:
            this.vx = 5;
            break;
          case KEY_LEFT:
            this.vx = -5;
            break;
        }
    }

    onKeyUp(code) {
        switch (code) {
          case KEY_RIGHT:
          case KEY_LEFT:
            this.vx = 0;
            break;
        }
    }

    collides(el) {
        const colX = el.x <= this.x + this.w && el.x + el.w >= this.x;
        const colY = el.y <= this.y + this.h && el.y + el.h >= this.y;
    
        return colX && colY;
    }


}
