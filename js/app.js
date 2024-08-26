const app = Vue.createApp({
    data() {
        return {
            cells: [],
            message: 'Just trying things out',
            gridSize: 12,
            score: 0,
            timeRemaining: 60,
            gameStarted: false,
            intervalId: null,
            canvas: null,
            ctx: null,
            cellSize: 0,
            lastClickedCell: null,
            lastHoveredCell: null,
            highlightedCell: null
        }
    },
    methods: {
        updateGridSize() {
            const computedStyle = getComputedStyle(document.documentElement);
            this.gridSize = parseInt(computedStyle.getPropertyValue('--grid-size'));
            this.message = `Grid size: ${this.gridSize} x ${this.gridSize}`;
        },
        draw () {
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    this.ctx.fillStyle = this.cells[i][j].color;
                    this.ctx.strokeStyle = 'black';
                    this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
                    this.ctx.strokeRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        },
        drawGrid() {
            this.canvas = document.querySelector('#gridCanvas');
            if (!this.canvas) return; // Guard against null

            const parent = this.canvas.parentElement;
            const parentWidth = parent.offsetWidth;
            const parentHeight = parent.offsetHeight;

            // Determine the size of the square canvas
            const multiplier = this.gridSize === 30 ? 0.82 : 0.95;
            const size = Math.min(parentWidth, parentHeight) * multiplier;// * 0.82;

            // Set canvas dimensions
            this.canvas.width = size;
            this.canvas.height = size;
            console.log(`Canvas size: ${this.canvas.width} x ${this.canvas.height}`);
            this.ctx = this.canvas.getContext('2d');

            // Use dynamic grid size
            this.cellSize = (size / this.gridSize)-1; // subtract 1 so that successive cell-borders don't go out of canvas

            for (let i = 0; i < this.gridSize; i++) {
                this.cells[i] = [];
                for (let j = 0; j < this.gridSize; j++) {
                    this.cells[i][j] = { color: 'white' };
                }
            }
            
            // Initial draw
            this.draw();
        },
        resetLastHoveredCell () {
            if (this.lastHoveredCell) {
                const { cellX, cellY } = this.lastHoveredCell;
                this.cells[cellX][cellY].color = this.cells[cellX][cellY].color === 'blue' ? 'blue' : 'white';
                this.lastHoveredCell = null;
                this.draw();
            }
        },
        resetLastClickedCell () {
            if (this.lastClickedCell) {
                const { cellX, cellY } = this.lastClickedCell;
                this.cells[cellX][cellY].color = 'white';
                this.lastClickedCell = null;
                this.draw();
            }
        },
        handleMouseMove(event) {            
            const rect = this.canvas.getBoundingClientRect();
            const cellX = Math.floor((event.clientX - rect.left) / this.cellSize);
            const cellY = Math.floor((event.clientY - rect.top) / this.cellSize);

            this.resetLastHoveredCell();

            if (cellX >= 0 && cellX < this.gridSize && cellY >= 0 && cellY < this.gridSize) {
                console.log(`Cell color: ${this.cells[cellX][cellY].color}`);
                // if (this.cells[cellX][cellY].color !== 'blue' || this.cells[cellX][cellY].color !== 'red') {
                //     this.cells[cellX][cellY].color = 'lightgray';
                // }
                this.cells[cellX][cellY].color = this.cells[cellX][cellY].color === 'blue' ? 'blue' : 'lightgray';
                this.lastHoveredCell = { cellX, cellY };
            }

            this.draw();
        },
        handleMouseLeave() {
            this.resetLastHoveredCell();
        },
        highlightRandomCell() {
            const nextCellX = Math.floor(Math.random() * this.gridSize);
            const nextCellY = Math.floor(Math.random() * this.gridSize);
            this.cells[nextCellX][nextCellY].color = 'blue';
            this.highlightedCell = { cellX: nextCellX, cellY: nextCellY };
            this.draw();
        },
        handleCellClick(event) {
            const rect = this.canvas.getBoundingClientRect();
            const cellX = Math.floor((event.clientX - rect.left) / this.cellSize);
            const cellY = Math.floor((event.clientY - rect.top) / this.cellSize);

            this.resetLastClickedCell();

            if(this.highlightedCell.cellX === cellX && this.highlightedCell.cellY === cellY) {
                this.score++;
                this.cells[cellX][cellY].color = 'lightgray';
                this.highlightRandomCell();
            } else {
                this.cells[cellX][cellY].color = 'red';
                this.draw();
                this.score--;
            }
            this.lastClickedCell = { cellX, cellY };
        },
        startTimer() {
            this.intervalId = setInterval(() => {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) {
                  this.endGame();
                }
            }, 1000);
        },
        endGame() {
            console.log("Game over!");
            clearInterval(this.intervalId);
            this.gameStarted = false;
            this.message = `Game over! Your score: ${this.score}`;
            this.resetLastClickedCell();
            this.drawGrid();
        },
        startGame() {
            console.log("Starting game...");
            this.gameStarted = true;
            this.score = 0;
            this.timeRemaining = 60;
            this.highlightRandomCell();
            this.startTimer();
        }
    },
    mounted() {
        // this.checkScreenSize();
        this.updateGridSize();
        window.addEventListener('resize', this.updateGridSize);
        this.drawGrid();
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
        this.canvas.addEventListener('click', (event) => this.handleCellClick(event));
        this.startGame();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateGridSize);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
        this.canvas.removeEventListener('click', this.handleCellClick);
    }
});

app.mount('#app');