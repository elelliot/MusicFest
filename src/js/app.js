document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});


function iniciarApp() {
    navegacionFija();
    crearGaleria();
    scrollNav();
}


//Header slide-up/down on Scroll
function navegacionFija() {
    const barra = document.querySelector('.header');//Seleccionamos el header

    const sobreFestival = document.querySelector('.sobre-festival')//Esta es la ubicacion donde queremos empezar a detectar si ya nos pasamos
    
    //Al poner fija la barra, la quitamos de su ubicación, por eso se ve que el resto de la página se mueve al llegar al top
    //Paso 1- le agregamos la clase body-scroll al body cuando se fije la barra para solucionarlo.
    const body = document.querySelector('body');

    //Evento de scroll
    window.addEventListener('scroll', function(){
        //con esto obtenemos info de la ubicacion con respecto al section de sobre-festival
        //console.log(sobreFestival.getBoundingClientRect() );

        //si el top(literal, el top de la sección) es <= 0 quiere decir que ya tocó arriba del viewport
        if( sobreFestival.getBoundingClientRect().top < 0 ) {
            barra.classList.add('fijo');// la barra se mantiene fija en cuanto pase
            body.classList.add('body-scroll');//ver _globales.scss para el paso 2

            

        } else {
            barra.classList.remove('fijo');//le quitamos la clase que la mantiene fija si no se pasa
            body.classList.remove('body-scroll');

        }
    })
}

//SmoothScroll
function scrollNav() {
    const enlaces = document.querySelectorAll('.navegacion-principal a');//seleccionamos todos los enlaces de navegacion
    
    //iteramos
    enlaces.forEach( enlace => {
        //agregamos un evento de click a cada enlace
        enlace.addEventListener('click', function(e){
            //console.log(e.target.attributes.href.value);

            e.preventDefault(); //quitamos el comportamiento por default de darle click a un enlace que tiene asociado un ID
            const seccionScroll = e.target.attributes.href.value; 
            const seccion = document.querySelector(seccionScroll);//seleccionamos el value del href al que le dimos click
            
            /*Scrolleamos a la seccion con scrollIntoView, y como el behavior por default es de golpe, lo cambiamos, 
            también hay que prevenirlo arriba*/
           seccion.scrollIntoView({ behavior: "smooth" });
        });
    });
}



function crearGaleria() {
    
    const galeria = document.querySelector('.galeria-imagenes');//<ul class ="galeria-imagenes"></ul>

    for( let i = 1; i <= 12; i++ ) {
        //Creamos 12 <picture>
        const imagen = document.createElement('picture');
        imagen.classList.add('imagen-cursor');//Agregamos clase para ponerle cursor con un hover

        /*Cada picture tiene este HTML, el cual llama las imagenes con sus mejores formatos disponibles, 
        de no tener el avif y webp, carga el jpg por defecto*/
        imagen.innerHTML=`
            <source srcset="build/img/thumb/${i}.avif" type="image/avif">
            <source srcset="build/img/thumb/${i}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="build/img/thumb/${i}.jpg" alt="imagen galeria">
        `;

        //Evento de click a la imagen, le mandamos el index. 
        imagen.onclick = function() {
            mostrarImagen(i);
            document.querySelector('header').classList.remove('fijo');//Quitamos el navbar fijo para que no estorbe al abrir imagen
        }

        //console.log(imagen);
        //... y ahora todo ese HTML de arriba lo insertamos en el <ul>
        galeria.appendChild(imagen);


    }
}

//Al dar click a una imagen de la galeria
function mostrarImagen(id) {
    //Creamos el picture y le damos el HTML, igual que en la galeria
    const imagen = document.createElement('picture');
    imagen.innerHTML=`
        <source srcset="build/img/grande/${id}.avif" type="image/avif">
        <source srcset="build/img/grande/${id}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="build/img/grande/${id}.jpg" alt="imagen galeria">
    `;

    //creamos un overlay(div) le ponemos la imagen seleccionada (picture con sus sources e img) y le asignamos una clase al div
    const overlay = document.createElement('DIV');
    overlay.appendChild(imagen);
    overlay.classList.add('overlay');


    //Dar click en la imagen o fuera (técnicamente en el div) para cerrarla
    overlay.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }


    //Botón(X) para cerrar el modal
    const cerrarModal = document.createElement('p');
    cerrarModal.textContent = 'X';
    cerrarModal.classList.add('btn-cerrar');
    //Quitamos el overlay (modal) al dar click en X  y la clase que bloquea el scroll
    cerrarModal.onclick = function() {
        //Quitamos la clase que bloquea el scroll
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        
        overlay.remove();//Quitamos el overlay(el div de la imagen)
    }
    //Agregamos el botón (X) al div (overlay)
    overlay.appendChild(cerrarModal);


    //Agregar la imagen al body
    const body = document.querySelector('body');
    body.appendChild(overlay);
    body.classList.add('fijar-body');//Agregamos esta clase al body al dar click en una imagen (para bloquear el scroll)
}


