const PALABRAS = [
    
];

class Juego {
    constructor() {
        this.intentosMaximos = 6;
        this.inicializarInterfaz();
        this.inicializarJuego();
        this.configurarEventosTeclado();
    }

    inicializarJuego() {
        this.palabra = this.obtenerPalabraAleatoria();
        this.intentos = [];
        this.intentoActual = '';
        this.juegoTerminado = false;
        this.crearCuadricula();
        this.crearTeclado();
        document.querySelectorAll('.tecla').forEach(tecla => {
            tecla.classList.remove('ausente', 'presente', 'correcto');
        });
        const botonVolverJugar = document.getElementById('botonVolverJugar');
        botonVolverJugar.style.display = 'none';
        const mensajeAlerta = document.getElementById('mensaje_alerta');
        mensajeAlerta.classList.remove('mostrar');
        this.actualizarInterfaz();
    }

    obtenerPalabraAleatoria() {
        return PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
    }

    inicializarInterfaz() {
        this.configurarPaginaBienvenida();
        this.configurarTemaOscuro();
        this.configurarModoDaltonico();
        this.configurarBotonInstrucciones();
        this.configurarBotonVolverJugar();
        this.configurarVentanaModal();
        this.configurarVentanaMensaje();
    }

    configurarPaginaBienvenida() {
        const botonJugar = document.getElementById('botonJugar');
        const paginaBienvenida = document.getElementById('paginaBienvenida');
        const contenedorJuego = document.getElementById('contenedorJuego');
        const botonInstrucciones = document.getElementById('botonInstrucciones');

        botonJugar.addEventListener('click', () => {
            paginaBienvenida.style.display = 'none';
            contenedorJuego.style.display = 'block';
            botonInstrucciones.style.display = 'flex';
            this.iniciarJuego();
        });
    }

    configurarTemaOscuro() {
        const botonTema = document.getElementById('botonTema');
        const icono = botonTema.querySelector('.icono-alternar-tema');
        const html = document.documentElement;

        const temaGuardado = localStorage.getItem('tema') || 'light';
        this.establecerTema(temaGuardado, html, icono);

        botonTema.addEventListener('click', () => {
            const nuevoTema = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            this.establecerTema(nuevoTema, html, icono);
        });
    }

    establecerTema(tema, html, icono) {
        html.setAttribute('data-theme', tema);
        localStorage.setItem('tema', tema);
        icono.textContent = tema === 'dark' ? '🌙' : '🌞';
    }

    configurarModoDaltonico() {
        const botonDaltonico = document.getElementById('botonDaltonico');
        const html = document.documentElement;
        const aviso = document.createElement('div');
        aviso.className = 'aviso-daltonico';
        aviso.textContent = 'Modo daltónico activado';
        document.body.appendChild(aviso);

        const modoDaltonicoGuardado = localStorage.getItem('modoDaltonico') === 'true';
        this.establecerModoDaltonico(modoDaltonicoGuardado, html, botonDaltonico, aviso);

        botonDaltonico.addEventListener('click', () => {
            const nuevoModo = html.getAttribute('data-colorblind') !== 'true';
            this.establecerModoDaltonico(nuevoModo, html, botonDaltonico, aviso);
        });
    }

    establecerModoDaltonico(activar, html, boton, aviso) {
        html.setAttribute('data-colorblind', activar);
        localStorage.setItem('modoDaltonico', activar);

        if (activar) {
            boton.classList.add('active');
            aviso.classList.add('show');
            setTimeout(() => aviso.classList.remove('show'), 3000);
        } else {
            boton.classList.remove('active');
            aviso.classList.remove('show');
        }
    }

    configurarBotonInstrucciones() {
        const botonInstrucciones = document.getElementById('botonInstrucciones');
        const modal = document.getElementById('modalInstrucciones');

        botonInstrucciones.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    configurarVentanaModal() {
        const modal = document.getElementById('modalInstrucciones');
        const span = document.getElementsByClassName('cerrar')[0];

        span.onclick = function () {
            modal.style.display = 'none';
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

    configurarVentanaMensaje() {
        const mensaje = document.getElementById('mensaje_alerta');
        const span = document.getElementsByClassName('cerrar')[1];

        span.onclick = function () {
            mensaje.style.opacity = '0';
        }
    }

    configurarBotonVolverJugar() {
        const botonVolverJugar = document.getElementById('botonVolverJugar');

        const reiniciarJuego = (eventoReinicio) => {
            if (eventoReinicio) {
                eventoReinicio.preventDefault();
                eventoReinicio.stopPropagation();
            }
            this.inicializarJuego();
            document.getElementById('mensaje_alerta').classList.remove('mostrar');
        };

        // Remover escuchadores anteriores
        const nuevoBoton = botonVolverJugar.cloneNode(true);
        botonVolverJugar.parentNode.replaceChild(nuevoBoton, botonVolverJugar);

        // Agregar nuevo escuchador para el clic
        nuevoBoton.addEventListener('click', reiniciarJuego);

        // Manejar teclas Enter y Espacio
        document.addEventListener('keydown', (eventoTecla) => {
            if (nuevoBoton.style.display === 'block' &&
                (eventoTecla.key === 'Enter' || eventoTecla.key === ' ')) {
                eventoTecla.preventDefault(); // Prevenir la propagación del evento
                eventoTecla.stopPropagation(); // Detener la propagación
                reiniciarJuego(eventoTecla);
            }
        });
    }

    iniciarJuego() {
        this.palabra = this.obtenerPalabraAleatoria();
        this.intentos = [];
        this.intentoActual = '';
        this.juegoTerminado = false;
        this.crearCuadricula();
        this.crearTeclado();
        document.querySelectorAll('.tecla').forEach(tecla => {
            tecla.classList.remove('ausente', 'presente', 'correcto');
        });
        const mensajeAlerta = document.getElementById('mensaje_alerta');
        mensajeAlerta.classList.remove('mostrar');
        this.actualizarInterfaz();
    }

    crearCuadricula() {
        const cuadricula = document.getElementById('cuadricula');
        cuadricula.innerHTML = '';

        for (let i = 0; i < this.intentosMaximos; i++) {
            const fila = document.createElement('div');
            fila.className = 'fila';
            for (let j = 0; j < 5; j++) {
                const celda = document.createElement('div');
                celda.className = 'celda';
                fila.appendChild(celda);
            }
            cuadricula.appendChild(fila);
        }
    }

    crearTeclado() {
        const teclas = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
            ['BORRAR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
        ];

        const contenedorTeclado = document.getElementById('teclado_virtual');
        contenedorTeclado.innerHTML = '';
        const teclado = document.createElement('div');
        teclado.className = 'teclado';

        teclas.forEach(fila => {
            const filaDiv = document.createElement('div');
            filaDiv.className = 'fila-teclado';

            fila.forEach(tecla => {
                const boton = document.createElement('button');
                boton.textContent = tecla;
                boton.className = 'tecla';
                boton.setAttribute('data-key', tecla);
                if (tecla === 'ENTER' || tecla === 'BORRAR') {
                    boton.classList.add('tecla-ancha');
                }
                boton.addEventListener('click', () => this.manejarTecla(tecla));
                filaDiv.appendChild(boton);
            });

            teclado.appendChild(filaDiv);
        });

        contenedorTeclado.appendChild(teclado);
    }

    manejarTecla(tecla) {
        if (this.juegoTerminado) return;

        if (tecla === 'ENTER') {
            this.confirmarIntento();
        } else if (tecla === 'BORRAR') {
            this.borrarLetra();
        } else if (this.intentoActual.length < 5) {
            // Verificar si la tecla está bloqueada
            const teclaElemento = document.querySelector(`.tecla[data-key="${tecla}"]`);
            if (teclaElemento && !teclaElemento.classList.contains('ausente')) {
                this.agregarLetra(tecla);
            }
        }
        this.actualizarInterfaz();
    }

    agregarLetra(letra) {
        if (this.intentoActual.length < 5) {
            this.intentoActual += letra;
            this.actualizarInterfaz();
        }
    }

    borrarLetra() {
        if (this.intentoActual.length > 0) {
            this.intentoActual = this.intentoActual.slice(0, -1);
            this.actualizarInterfaz();
        }
    }

    esIntentoValido(intento) {
        return intento.length === 5;
    }

    confirmarIntento() {
        if (!this.esIntentoValido(this.intentoActual)) {
            this.mostrarMensaje('La palabra debe tener 5 letras');
            return;
        }

        const resultado = new Array(5).fill(null);
        const contadorLetras = {};

        // Contar las ocurrencias de cada letra en la palabra objetivo
        for (let letra of this.palabra) {
            contadorLetras[letra] = (contadorLetras[letra] || 0) + 1;
        }

        // Primer paso: Marcar las letras correctas
        for (let i = 0; i < 5; i++) {
            if (this.intentoActual[i] === this.palabra[i]) {
                resultado[i] = { letra: this.intentoActual[i], estado: 'correcto' };
                contadorLetras[this.intentoActual[i]]--;
            }
        }

        // Segundo paso: Marcar las letras presentes o ausentes
        for (let i = 0; i < 5; i++) {
            if (!resultado[i]) {
                if (contadorLetras[this.intentoActual[i]] > 0) {
                    resultado[i] = { letra: this.intentoActual[i], estado: 'presente' };
                    contadorLetras[this.intentoActual[i]]--;
                } else {
                    resultado[i] = { letra: this.intentoActual[i], estado: 'ausente' };
                }
            }
        }

        this.intentos.push(resultado);
        this.actualizarCuadricula(resultado);

        const esGanador = this.intentoActual === this.palabra;
        this.juegoTerminado = esGanador || this.intentos.length >= this.intentosMaximos;

        if (this.juegoTerminado) {
            setTimeout(() => {
                if (esGanador) {
                    this.mostrarMensajeVictoria();
                } else {
                    this.mostrarMensaje(`¡Has perdido!😥 La palabra era ${this.palabra}`);
                }
                document.getElementById('botonVolverJugar').style.display = 'block';
            }, 500); // Esperar a que termine la animación de la última palabra
        }

        this.intentoActual = '';
        this.actualizarInterfaz();
    }

    mostrarMensajeVictoria() {
        this.mostrarFuegosArtificiales();
        setTimeout(() => {
            this.mostrarMensaje('¡Feliciadades! Has ganado');
        }, 2000); // Retrasa el mensaje de victoria para que los fuegos artificiales se vean primero
    }

    mostrarFuegosArtificiales() {
        const container = document.createElement('div');
        container.className = 'fuegos-artificiales-container';
        document.body.appendChild(container);

        const canvas = document.createElement('canvas');
        canvas.id = 'fuegos-artificiales-canvas';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let fireworks = [];
        let particles = [];

        function Firework() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.sx = Math.random() * 3 - 1.5;
            this.sy = -Math.random() * 7 - 7; // Aumentado para que suban más rápido
            this.size = 3;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;

            this.update = function () {
                this.x += this.sx;
                this.y += this.sy;
                this.sy += 0.1;
                if (this.size > 0.1) this.size -= 0.1;
            }

            this.draw = function () {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function Particle(x, y, color) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 8 - 4;
            this.speedY = Math.random() * 8 - 4;
            this.color = color;

            this.update = function () {
                this.x += this.speedX;
                this.y += this.speedY;
                this.size -= 0.1;
            }

            this.draw = function () {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles(x, y, color) {
            const particleCount = 150; // Aumentado para más partículas
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.2) { // Aumentado para más frecuencia
                fireworks.push(new Firework());
            }

            for (let i = 0; i < fireworks.length; i++) {
                fireworks[i].update();
                fireworks[i].draw();

                if (fireworks[i].sy >= 0) {
                    createParticles(fireworks[i].x, fireworks[i].y, fireworks[i].color);
                    fireworks.splice(i, 1);
                    i--;
                }
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        // Ajustar el tamaño del canvas cuando cambia el tamaño de la ventana
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        setTimeout(() => {
            container.remove();
        }, 10000);
    }

    crearExplosion(fuegoElemento) {
        const explosion = document.createElement('div');
        explosion.className = 'fuego';
        explosion.style.left = fuegoElemento.style.left;
        explosion.style.bottom = fuegoElemento.style.bottom;
        explosion.style.backgroundColor = fuegoElemento.style.backgroundColor;

        const particulas = 30;
        for (let i = 0; i < particulas; i++) {
            const particula = document.createElement('div');
            particula.className = 'fuego';
            const angulo = (i / particulas) * 360;
            const distancia = 50 + Math.random() * 50;
            particula.style.transform = `rotate(${angulo}deg) translate(${distancia}px)`;
            particula.style.backgroundColor = fuegoElemento.style.backgroundColor;
            particula.style.animation = `explosion 1s ease-out forwards`;
            explosion.appendChild(particula);
        }

        fuegoElemento.parentNode.appendChild(explosion);
        setTimeout(() => explosion.remove(), 1000);
    }

    animarCeldas(fila, resultado) {
        resultado.forEach((letra, indice) => {
            setTimeout(() => {
                const celda = fila.children[indice];
                celda.textContent = letra.letra;
                celda.classList.add(letra.estado, 'revelada');
                this.actualizarEstadoTecla(letra.letra, letra.estado);
            }, indice * 250);
        });
    }

    actualizarCuadricula(resultado) {
        const fila = document.querySelector('.cuadricula').children[this.intentos.length - 1];
        this.animarCeldas(fila, resultado);
    }

    actualizarEstadoTecla(letra, estado) {
        const tecla = document.querySelector(`.tecla:not(.tecla-ancha)[data-key="${letra}"]`);
        if (tecla) {
            if (estado === 'correcto') {
                tecla.classList.remove('presente', 'ausente');
                tecla.classList.add('correcto');
            } else if (estado === 'presente' && !tecla.classList.contains('correcto')) {
                tecla.classList.remove('ausente');
                tecla.classList.add('presente');
            } else if (estado === 'ausente' && !tecla.classList.contains('correcto') && !tecla.classList.contains('presente')) {
                tecla.classList.add('ausente');
            }
        }
    }


    actualizarInterfaz() {
        const filaActual = document.querySelector('.cuadricula').children[this.intentos.length];
        const intento = this.intentoActual.padEnd(5, ' ');
        [...filaActual.children].forEach((celda, indice) => {
            celda.textContent = intento[indice].trim();
        });
    }

    mostrarMensaje(texto) {
        const mensaje = document.getElementById('mensaje_alerta');
        const mensajeTexto = document.getElementById('mensajeTexto');
        const botonVolverJugar = document.getElementById('botonVolverJugar');

        mensajeTexto.textContent = texto;
        mensaje.classList.add('mostrar');

        if (this.juegoTerminado) {
            botonVolverJugar.style.display = 'block';
        } else {
            botonVolverJugar.style.display = 'none';
            setTimeout(() => mensaje.classList.remove('mostrar'), 3000);
        }
    }


    configurarEventosTeclado() {
        document.addEventListener('keydown', (eventoTeclado) => {
            // Verificar primero si el botón está visible
            const botonVolverJugar = document.getElementById('botonVolverJugar');
            if (botonVolverJugar && botonVolverJugar.style.display === 'block') {
                return; // No procesar ninguna tecla si el botón está visible
            }

            if (this.juegoTerminado) return;

            const teclaPresionada = eventoTeclado.key.toUpperCase();
            if (teclaPresionada === 'ENTER') {
                eventoTeclado.preventDefault();
                this.manejarTecla('ENTER');
            } else if (teclaPresionada === 'BACKSPACE') {
                this.manejarTecla('BORRAR');
            } else if (/^[A-ZÑ]$/.test(teclaPresionada)) {
                this.manejarTecla(teclaPresionada);
            }
        }, { capture: true }); // Usar capture para asegurar que este manejador se ejecute primero
    }
}

// Iniciar el juego
new Juego();

