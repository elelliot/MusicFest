//Para trabajar con gulp debemos tener este archivo en el proyecto, las tareas de gulp son funciones de JavaScript y se comunican con la API de Gulp
//Para trabajar con el bin de sass con gulp debemos instalar una dependencia que las conecte: gulp-sass

//----------COMPILANDO SASS CON GULP-------------//
const { src, dest, watch, parallel } = require('gulp')//(Retorna varias funciones, por eso las llaves)


//Extraemos las funcionalidades de gulp-sass de la carpeta de node_modules (retorna una función)
// CSS
const sass = require('gulp-sass')(require('sass')); //Para ejecutarlo, necesitamos sass, si solo tenemos gulp-sass no podemos.
const plumber = require('gulp-plumber');//para que no se detenga la ejecucion con los errores y no de mucho texto innecesario de error

//Funcionan con postcss no con gulp
const autoprefixer = require('autoprefixer');//Se asegura que el css funcione en el navegador que quieras
const cssnano = require('cssnano');//comprime el codigo de css
const postcss = require('gulp-postcss');//Hace algunas transformaciones al css


/*Al hacerle una compresión al css, el código se comprime en una sola línea y es díficil leerlo incluso con el navegador,
el sourcemaps te crea un .map en tu css y el navegador lo entiende, al inspeccionar un elemento,
te dice donde está en el SASS, haciendolo aún más fácil que cuando antes del postcss te decía donde estaba en el css*/
const sourcemaps = require('gulp-sourcemaps');//se inicializa al identificar el scss y antes de crear el css
/////////////////////////////////////////////////////////




// IMGS
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin')//para Aligerar imagenes (instalamos la versión 7.1.0 por que la 8 petea)
const webp = require('gulp-webp'); //para poder convertir imagenes a webp con gulp
const avif = require('gulp-avif');//permite convertir imagenes a avif



//JavaScript
const terser = require('gulp-terser-js');



//Task para compilar archivos SASS (Para hacer el postcss compilamos solo con gulp css, no dev)
//Las tareas(tasks) de gulp tienen un callback que termina la tarea, si no lo ponemos nos marca un error de que no se terminó la tarea
function css( done ) {
    
    src('src/scss/**/*.scss') //Identificar el archivo .SCSS a compilar (función src) 
        .pipe( sourcemaps.init() )//inicializamos el sourcemaps en el scss
        .pipe( plumber() ) 
        //Un pipe es una acción que se ejecuta, una vez finalizada se ejecuta otra y otra.
        .pipe( sass() ) //Compilarlo: pipe es para asignar la acción después del src, sass() es la acción y eso lo compila 
        
        .pipe( postcss([autoprefixer(), cssnano() ]) )//Hacemos la compatibilidada a navegadores con autoprefixer y la compresion con cssnano
        .pipe( sourcemaps.write('.') )//Guardamos la referencia en la misma ubicacion del css (por eso el '.')
        
        // el pipe de sass se mantiene en memoria un momento, pero si no lo almacenamos "se le acaba la memoria"
        .pipe( dest('build/css') ) //Almacenarla: dest toma un path para escribir un archivo, usará el nombre del original en este caso (ya que no le pusimos nombre al file y con extensión css)

    done();
}



//Optimizar imagenes jpg y png y mandarlas al build
function imagenes(done) {
    //los parametros de imagemin (ver DOC)
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin( opciones ) ) )//el procesamiento con gulp-imagemin requiere tener las imgs en caché, why? idk
        .pipe( dest('build/img') )

    done();
}



//task para convertir imagenes .png y .jpg a .webp
function versionWebp( done ) {
    const opciones = {
        quality: 50
    };

    //identificamos todas las imagenes
    src('src/img/**/*.{png,jpg}') //buscamos todas las imagenes que estén en todas las carpetas del path y si busco más de un formato, debo ponerlo entre llaves
        .pipe( webp(opciones) )//el parametro es la calidad de imagen (1-100, donde 50 parece ser suficiente, ver DOC)
        .pipe( dest('build/img') )//guardamos las imagenes en disco duro
    
    done();
}




//task para convertir imagenes .png y .jpg a .avif (funciona igual que gulp-webp)
function versionAvif( done ) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
    
    done();
}



//Detectamos ,comprimimos(con gulp-terser-js,) y mandamos archivos de JS a Build
function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())//también podemos usar sourcemaps para javascript
        
        //Mejoramos el código de JavaScript con terser (mas o menos igual que el cssnano, lo comprime, pero ver el sourcemap de JS no funciona en CHROME por ahora, en EDGE y Firefox si)
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
    
    done();
}





//Task para escuchar cambios en los archivos de SASS (SCSS) y llamamos a la función css para que los compile automaticamente
//En npm usamos un --watch en el package.json del script para que en cualquier cambio se vulelva a compilar... pero en gulp...
function dev( done ){
    
    //Solo escuchamos los cambios en el app.scss con 'src/scss/app.scss'...
    //pero agregando **/*.scss, escuchamos los cambios de todos los archivos de todas carpetas de adentro.
    //También debemos de poner eso en el src para que todos los archivos se compilen para el css final
    watch('src/scss/**/*.scss', css)//Archivo que escuchas por cambios, funcion que se llama en cada cambio
    watch('src/js/**/*.js', javascript)//Escuchamos cambios en cada archivo JS y ejecutamos task javascript
    
    done();
}



/*Debemos hacer disponibles las tareas que queramos ejecutar con: export.*comando* = *fn que llama...
...y los ejecutamos con: gulp *comando* (sin *) */
/*Podemos usar ciertas funciones de GULP para ejecutar varias tareas con un comando:
    series: las tareas se ejecutan una tras otra, es decir, en secuencia
    parallel: se ejecutan al mismo tiempo*/
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes,versionWebp, versionAvif, javascript, dev);






