const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);
game.setListeners(); 

const button = document.getElementById("start");

button.addEventListener("click", () => {
    if (game.started === false) {
        game.start();
        button.innerText="REINICIAR"
        
    } else {
        button.innerText="START"
        game.pause();
    }
});
