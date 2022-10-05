/*********** ENDPOINTS ***********/
const URIListaCategorias = 'https://opentdb.com/api_category.php'; // Helper API Tools
const URIapi = 'https://opentdb.com/api.php';

/*********** Declaracion de variables ***********/
const boxPantalla = document.querySelector('#boxPantalla');
const nickName = document.querySelector('#nickName');
const mensajeNickname = document.querySelector('#mensajeNickName');
let banSiguiente = false;


/*********** Eventos ***********/ 
document.querySelector('#continuar').addEventListener('click', Continuar)


document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if(banSiguiente){
            ComenzarPartida();
        }else{
            Continuar();
        }
    }
});

/*********** Funciones ***********/
nickName.focus();

function Continuar() {
    if (nickName.value) {
        banSiguiente = true;

        LimpiarPantalla();
        AgregarConfiguraciones()
    } else {
        mensajeNickname.style.display = 'block';
    }
}

function LimpiarPantalla() {
    while (boxPantalla.firstChild) {
        boxPantalla.firstChild.remove();
    }
}

async function AgregarConfiguraciones() {
    AgregarEstructura()

    if (await ConsultarCategorias() == false) {
        window.location.href = '../index.php';
    }
}

function AgregarEstructura() {
    const col1 = document.createElement('div');
    col1.classList.add('col', 'text-white','d-flex', 'flex-column', 'gap-5');
    col1.innerHTML =
        `
            <h2 class="text-center">Hola ${nickName.value}, para comenzar elige la configuracion para la partida</h2>
            <div class="form-floating text-dark">
                <input type="text" class="form-control" id="numeroPreguntas" placeholder="" maxlength="2"
                onkeypress="return valideKey(event);">
                <label for="forYear">Ingresa el numero de preguntas a responder (Maximo 50 preguntas por partida)</label>
                <h5 for="forRequired" id="mensajeNumeroPreguntas" class="text-danger" style="display: none;">El numero de preguntas debe ser minimo 1 y maximo 50</h5>
            </div>

            <div>
                <h5>Seleccione una Categoria</h5>
                <select class="form-select" id="category">
                    <option value="any" selected>Any Category</option>
                </select>
            </div>

            <div>
                <h5>Seleccione una dificultad</h5>
                <select class="form-select" id="difficulty">
                    <option value="any" selected>Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <div>
                <h5>Seleccione el tipo de pregunta</h5>
                <select class="form-select" id="type">
                    <option value="any" selected>Any Type</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                </select>
            </div>
        `;

    boxPantalla.appendChild(col1);

    const col2 = document.createElement('div');
    col2.classList.add('col', 'text-white', 'text-center');
    col2.innerHTML =
        `
            <button type="button" class="btn btn-success" id="comenzar">Continuar</button>
            <h5 for="forRequired" id="mensajeConfiguracion" class="text-danger" style="display: none;">No existen preguntas para la configuracion de partida seleccionada, por favor intente otra</h5>
        `;

    boxPantalla.appendChild(col2);

    const btnComenzar = document.querySelector('#comenzar');

    btnComenzar.addEventListener('click', ComenzarPartida)

    const numeroPreguntas = document.querySelector('#numeroPreguntas');
    numeroPreguntas.focus();
}

async function ConsultarCategorias() {
    let resultado = true;
    const category = document.querySelector('#category');

    await fetch(URIListaCategorias)
        .then(async (response) => {
            if (response.status === 200) {
                const respJSON = await response.json().then(data => data['trivia_categories'])
                respJSON.forEach(item => {
                    const opcionCategory = document.createElement('option');
                    opcionCategory.value = item.id;
                    opcionCategory.innerHTML = item.name;
                    category.appendChild(opcionCategory);
                })
            } else {
                resultado = false;
                alert(`Hubo un problema al consultar las categorias\nStatus Code: ${response.status}\nMensaje de Erro: ${response.statusText}`)
            }
        }).catch(error => {
            resultado = false;
            alert(`Hubo un problema al consultar las categorias\nError: ${error.message}`)
        })

    return resultado
}

async function ComenzarPartida(){
    const numeroPreguntas = document.querySelector('#numeroPreguntas');
    const categoria = document.querySelector('#category');
    const dificultad = document.querySelector('#difficulty');
    const tipo = document.querySelector('#type');
    const mensajeNumeroPreguntas = document.querySelector('#mensajeNumeroPreguntas');

    if(numeroPreguntas.value != null){
        if(numeroPreguntas.value >= 1 && numeroPreguntas.value <= 50){
            const paramCategoria = categoria.value != "any" ? "&category="+categoria.value : ""
            const paramDificultad = dificultad.value != "any" ? "&difficulty="+dificultad.value : ""
            const paramTipo = tipo.value != "any" ? "&type="+tipo.value : ""
            const parametros = `?amount=${numeroPreguntas.value}`+ paramCategoria + paramDificultad + paramTipo;

            if(await VerificarConfiguracion(parametros)){
                localStorage.setItem("nickname", nickName.value);
                localStorage.setItem("config", parametros);
            
                window.location.href = '../preguntas.php';
            }else{
                let mensajeConfiguracion = document.querySelector('#mensajeConfiguracion');

                mensajeConfiguracion.style.display = 'block';
            }
            
        }else{
            numeroPreguntas.value = "";
            mensajeNumeroPreguntas.style.display = 'block';
        }
    }
    else{
        mensajeNumeroPreguntas.style.display = 'block';
    }
}

async function VerificarConfiguracion(parametros){
    let resultado = false;
    
    await fetch(URIapi + parametros)
    .then(async (response) => {
        if(response.status === 200){
            resultado = await response.json().then(data => data['response_code']) == 0 ? true : false;
        }else{
            resultado = false;
            alert(`Hubo un problema al verificar la informacion en la API\nStatus Code: ${response.status}\nMensaje de Erro: ${response.statusText}`)
        }
    })
    .catch(error => {
        resultado = false;
        alert(`Hubo un problema al verificar la informacion en la API\nError: ${error.message}`)
    })

    return resultado;
}

function valideKey(evt) {

    var code = (evt.which) ? evt.which : evt.keyCode;

    if (code == 8) {
        return true;
    } else if (code >= 48 && code <= 57) {
        return true;
    } else {
        return false;
    }
}

