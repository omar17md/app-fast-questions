/*********** API TRIVIA DATA BASE ***********/
/*
-Pagina: https://opentdb.com/
-Documentacion: https://opentdb.com/api_config.php
.URI DE LA API: https://opentdb.com/api.php
*/

/*********** ENDPOINTS ***********/
const URIListaCategorias = 'https://opentdb.com/api_category.php' // Helper API Tools

/*********** Declaracion de variables ***********/
const boxPantalla = document.querySelector('#boxPantalla');
const nickName = document.querySelector('#nickName');
const mensajeNickname = document.querySelector('#mensajeNickName');


/*********** Eventos ***********/ 
document.querySelector('#continuar').addEventListener('click', Continuar)

/*********** Funciones ***********/
function Continuar() {
    if (nickName.value) {
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
        location.reload()
    }
}

function AgregarEstructura() {
    const col1 = document.createElement('div');
    col1.classList.add('col', 'text-white','d-flex', 'flex-column', 'gap-5');
    col1.innerHTML =
        `
            <h2 class="text-center">Hola ${nickName.value}, para comenzar elige la configuracion para la partida</h2>
            <div class="form-floating text-dark">
                <input type="number" class="form-control" id="numeroPreguntas" placeholder="" min="1" max="50" maxlength="2">
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
        `;

    boxPantalla.appendChild(col2);

    const btnComenzar = document.querySelector('#comenzar');

    btnComenzar.addEventListener('click', ComenzarPartida)
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

function ComenzarPartida(){
    const numeroPreguntas = document.querySelector('#numeroPreguntas');
    const mensajeNumeroPreguntas = document.querySelector('#mensajeNumeroPreguntas');

    if(numeroPreguntas.value != null){
        if(numeroPreguntas.value >= 1 && numeroPreguntas.value <= 50){
            window.location.href = "../preguntas.HTML";
        }else{
            numeroPreguntas.value = "";
            mensajeNumeroPreguntas.style.display = 'block';
        }
    }
    else{
        mensajeNumeroPreguntas.style.display = 'block';
    }
}
