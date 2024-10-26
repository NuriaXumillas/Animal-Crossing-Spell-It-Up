class Letter {
    constructor(ctx) {
      this.ctx = ctx;
  
      this.w = 50;
      this.h = 75;
  
      this.x = this.ctx.canvas.width - this.w - 20;
      this.y = 730;
      this.vx = -3;
  
      // this.img = new Image();
      // this.img.src = "/assets/images/enemy.jpeg";
    }
  
    draw() {
      // this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
  
    move() {
      this.x += this.vx;
    }
  }