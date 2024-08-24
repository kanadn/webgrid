const app = Vue.createApp({
    data() {
        return {
            message: 'Just trying things out',
            gridSize: 12
        }
    },
    methods: {
        checkScreenSize() {
            // Check screen width and adjust grid size
            const screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                this.gridSize = 12; // For smaller screens (e.g., phones)
            } else {
                this.gridSize = 30; // For larger screens (e.g., desktops)
            }
        },
        drawGrid() {
            const canvas = document.querySelector('#gridCanvas');
            if (!canvas) return; // Guard against null

            const parent = canvas.parentElement;
            const parentWidth = parent.offsetWidth;
            const parentHeight = parent.offsetHeight;

            // Determine the size of the square canvas
            const size = Math.min(parentWidth, parentHeight);

            // Set canvas dimensions
            canvas.width = size * 0.75;
            canvas.height = size * 0.75;

            // Center the canvas if needed
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';

            const ctx = canvas.getContext('2d');

            // Use dynamic grid size
            const cols = this.gridSize;
            const rows = this.gridSize;
            const cellSize = size / cols; // Now cellWidth and cellHeight are the same

            const cells = [];

            let lastHoveredCell = null;
            let lastClickedCell = null;

            for (let i = 0; i < cols; i++) {
                cells[i] = [];
                for (let j = 0; j < rows; j++) {
                    cells[i][j] = { color: 'white' };
                }
            }

            const draw = () => {
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    ctx.fillStyle = cells[i][j].color;
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                    ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        };

        draw();

        const getCellCoordinates = (x, y) => {
            const cellX = Math.floor(x / cellSize);
            const cellY = Math.floor(y / cellSize);
            return { cellX, cellY };
        };

            const resetLastHoveredCell = () => {
                if (lastHoveredCell) {
                    const { cellX, cellY } = lastHoveredCell;
                    cells[cellX][cellY].color = cells[cellX][cellY].color === 'lightgreen' ? 'lightgreen' : 'white';
                    lastHoveredCell = null;
                    draw();
                }
            };

            const resetLastClickedCell = () => {
                if (lastClickedCell) {
                    const { cellX, cellY } = lastClickedCell;
                    cells[cellX][cellY].color = 'white';
                    lastClickedCell = null;
                    draw();
                }
            };

            canvas.addEventListener('mousemove', (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const { cellX, cellY } = getCellCoordinates(x, y);

                resetLastHoveredCell();

                if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
                    cells[cellX][cellY].color = cells[cellX][cellY].color === 'lightgreen' ? 'lightgreen' : 'lightblue';
                    lastHoveredCell = { cellX, cellY };
                }

                draw();
            });

            canvas.addEventListener('mouseleave', () => {
                resetLastHoveredCell();
            });

            canvas.addEventListener('click', (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const { cellX, cellY } = getCellCoordinates(x, y);

                if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
                    resetLastClickedCell();
                    cells[cellX][cellY].color = cells[cellX][cellY].color === 'lightblue' ? 'lightgreen' : 'lightblue';
                    lastClickedCell = { cellX, cellY };
                }

                draw();
            });
        }
    },
    mounted() {
        this.checkScreenSize();
        this.drawGrid();
    }
});

app.mount('#app');