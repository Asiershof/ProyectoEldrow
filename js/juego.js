const PALABRAS = [
    "AVION", "BRAVO", "CLAVE", "DIGNO", "ENLACE", "FINCA", "GRANO", "HECHO", "ISLAS", "JARRA",
    "KILOS", "LIBRO", "MUNDO", "NACER", "OASIS", "PIANO", "QUIEN", "RUEDA", "ASIER", "TARDE",
    "UNICO", "VAPOR", "ZORRA", "ANCHO", "BARCO", "CESAR", "DUDAR", "ENVIO", "FIRMA", "GUAPO",
    "HUEVO", "ILUSO", "JUGAR", "KOALA", "LUNAR", "MANGO", "NUEVO", "ORDEN", "PLAZA", "QUISO",
    "RESTO", "SABOR", "TOMAR", "UNIDO", "VERDE", "XENON", "YERMO", "ZEBRA", "ACTOR", "BUENO"
];

class Juego {
    constructor() {
        this.palabra = '';
        this.intentos = [];
        this.intentoActual = '';
        this.intentosMaximos = 6;
        this.juegoTerminado = false;
        this.letrasDeshabilitadas = new Set();
        this.configurarEventosTeclado();
        
        this.inicializarInterfaz();
    }

    inicializarInterfaz() {
        this.configurarPaginaBienvenida();
        this.configurarTemaOscuro();
        this.configurarModoDaltonico();
        this.configurarBotonInstrucciones();
        this.configurarBotonVolverJugar();
        this.configurarVentanaModal();
    }

    configurarPaginaBienvenida() {
        const botonJugar = document.getElementById('botonJugar');
        const paginaBienvenida = document.getElementById('paginaBienvenida');
        const contenedorJuego = document.getElementById('contenedorJuego');

        botonJugar.addEventListener('click', () => {
            paginaBienvenida.style.display = 'none';
            contenedorJuego.style.display = 'block';
            this.iniciarJuego();
        });
    }

    configurarTemaOscuro() {
        const botonTema = document.getElementById('botonTema');
        const icono = botonTema.querySelector('.theme-toggle-icon');
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
        aviso.className = 'colorblind-notice';
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
            modal.style.display = 'block';
        });
    }

    configurarVentanaModal() {
        const modal = document.getElementById('modalInstrucciones');
        const span = document.getElementsByClassName('close')[0];

        span.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

    configurarBotonVolverJugar() {
        const botonVolverJugar = document.getElementById('botonVolverJugar');
        botonVolverJugar.addEventListener('click', () => {
            this.iniciarJuego();
            document.getElementById('mensaje_alerta').classList.remove('mostrar');
        });
    }

    iniciarJuego() {
        this.palabra = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
        this.intentos = [];
        this.intentoActual = '';
        this.juegoTerminado = false;
        this.letrasDeshabilitadas.clear();
        
        this.crearCuadricula();
        this.crearTeclado();
        
        // Ocultar el mensaje de alerta si está visible
        const mensajeAlerta = document.getElementById('mensaje_alerta');
        mensajeAlerta.classList.remove('mostrar');
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
            ['Borrar', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
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
                if (tecla === 'ENTER' || tecla === 'Borrar') {
                    boton.classList.add('tecla-ancha');
                }
                boton.addEventListener('click', () => {
                    if (!this.letrasDeshabilitadas.has(tecla)) {
                        this.manejarTecla(tecla);
                    }
                });
                filaDiv.appendChild(boton);
            });

            teclado.appendChild(filaDiv);
        });

        contenedorTeclado.appendChild(teclado);
    }

    configurarEventosTeclado() {
        document.removeEventListener('keydown', this.manejarEventoTeclado);
        this.manejarEventoTeclado = (e) => {
            const tecla = e.key.toUpperCase();
            if (tecla === 'ENTER') {
                this.manejarTecla('ENTER');
            } else if (tecla === 'BACKSPACE') {
                this.manejarTecla('Borrar');
            } else if (/^[A-ZÑ]$/.test(tecla) && !this.letrasDeshabilitadas.has(tecla)) {
                this.manejarTecla(tecla);
            }
        };
        document.addEventListener('keydown', this.manejarEventoTeclado);
    }

    manejarTecla(tecla) {
        if (this.juegoTerminado) return;

        if (tecla === 'ENTER') {
            this.confirmarIntento();
        } else if (tecla === 'Borrar') {
            this.borrarLetra();
        } else if (this.intentoActual.length < 5) {
            this.agregarLetra(tecla);
        }
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

    confirmarIntento() {
        if (this.intentoActual.length !== 5) return;

        const resultado = this.intentoActual.split('').map((letra, indice) => {
            if (letra === this.palabra[indice]) {
                return { letra, estado: 'correcto' };
            } else if (this.palabra.includes(letra)) {
                return { letra, estado: 'presente' };
            } else {
                return { letra, estado: 'ausente' };
            }
        });

        this.intentos.push(resultado);
        this.actualizarCuadricula(resultado);
        
        const esGanador = this.intentoActual === this.palabra;
        this.juegoTerminado = esGanador || this.intentos.length >= this.intentosMaximos;
        
        if (esGanador) {
            this.mostrarMensaje('¡Ganaste! 🎉');
        } else if (this.juegoTerminado) {
            this.mostrarMensaje(`¡Juego terminado! La palabra era ${this.palabra}`);
        }

        this.intentoActual = '';
        this.actualizarInterfaz();
    }

    actualizarCuadricula(resultado) {
        const fila = document.querySelector('.cuadricula').children[this.intentos.length - 1];
        resultado.forEach((letra, indice) => {
            const celda = fila.children[indice];
            celda.textContent = letra.letra;
            celda.classList.add(letra.estado);
            this.actualizarEstadoTecla(letra.letra, letra.estado);
        });
    }

    actualizarEstadoTecla(letra, estado) {
        const teclas = document.querySelectorAll('.tecla');
        teclas.forEach(tecla => {
            if (tecla.textContent === letra) {
                if (estado === 'ausente') {
                    this.letrasDeshabilitadas.add(letra);
                    tecla.classList.add(estado);
                } else {
                    tecla.classList.add(estado);
                }
            }
        });
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
}

// Iniciar el juego
new Juego();

