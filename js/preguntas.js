/*********** API TRIVIA DATA BASE ***********/
/*
-Pagina: https://opentdb.com/
-Documentacion: https://opentdb.com/api_config.php
.URI DE LA API: https://opentdb.com/api.php
*/

/*********** ENDPOINTS ***********/
const URIToken = 'https://opentdb.com/api_token.php?command=request'
const URIapi = 'https://opentdb.com/api.php'

/*********** Declaracion de variables ***********/
const numeroPreguntas = document.querySelector('#numeroPreguntas');
const pregunta = document.querySelector('#pregunta');
const boxOpciones = document.querySelector('#box-opciones');
const modal = document.querySelector("#divModal");
const textModal = document.querySelector("#modalText");
const span = document.getElementsByClassName("close")[0];

const colores = ["red", "blue", "yellow", "green"];
let token = "";
let indicePregunta = 0;
let listaPreguntas = [];
let respuesta = 0;
let puntuacion = 0;


/*********** Eventos ***********/ 
document.addEventListener('DOMContentLoaded', () => {
    CargarPagina();
});

span.onclick = function () {
    modal.style.display = "none";
    window.location.href = 'index.html';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        window.location.href = 'index.html';
    }
}

/*********** Funciones ***********/
async function CargarPagina(){
    let resultado = false

    if(await GenerarToken()){
        if(await GenerarPreguntas()){
            MostarPregunta();
            resultado = true;
        }
    }

    if(!resultado){
        window.location.href = "index.HTML";
    }
}


async function GenerarToken(){
    let resultado = true;
    token = localStorage.getItem('token')

    if(token === null){
        await fetch(URIToken)
        .then(async (response) => {
            if(response.status === 200){           
                token = await response.json().then(data => data['token'])
                localStorage.setItem('token', token);
            }else{
                resultado = false;
                alert(`Hubo un problema al generar el token para la API\nStatus Code: ${response.status}\nMensaje de Erro: ${response.statusText}`)
            }
        })
        .catch(error => {
            resultado = false;
            alert(`Hubo un problema al generar el token para la API\nError: ${error.message}`)
        })
    }

    return resultado
}

 async function GenerarPreguntas(){
    let resultado = true;
    const config = localStorage.getItem('config');

    await fetch(URIapi + config + `&token=${token}`)
    .then(async (response) => {
        if(response.status === 200){
            listaPreguntas = await response.json().then(data => data['results'])
        }else{
            resultado = false;
            alert(`Hubo un problema al obtener las preguntas de la API\nStatus Code: ${response.status}\nMensaje de Erro: ${response.statusText}`)
        }
    })
    .catch(error => {
        resultado = false;
        alert(`Hubo un problema al obtener las preguntas de la API\nError: ${error.message}`)
    })

    return resultado
}

function MostarPregunta(){
    if(listaPreguntas[indicePregunta].type == "multiple"){
        LimpiarOpciones(true);
        const opcion = [
            document.querySelector('#opcion1'),
            document.querySelector('#opcion2'),
            document.querySelector('#opcion3'),
            document.querySelector('#opcion4'),
        ]
        let numeroAleatorios = GenerarAleatorios(4);

        numeroPreguntas.innerHTML = `Pregunta ${indicePregunta+1} de ${listaPreguntas.length}`
        pregunta.innerHTML = listaPreguntas[indicePregunta].question;
        opcion[numeroAleatorios[0]].innerHTML = listaPreguntas[indicePregunta].incorrect_answers[0];
        opcion[numeroAleatorios[1]].innerHTML = listaPreguntas[indicePregunta].incorrect_answers[1];
        opcion[numeroAleatorios[2]].innerHTML = listaPreguntas[indicePregunta].incorrect_answers[2];
        opcion[numeroAleatorios[3]].innerHTML = listaPreguntas[indicePregunta].correct_answer;
        respuesta = numeroAleatorios[3];

    }else{
        LimpiarOpciones(false);
        const opcion = [
            document.querySelector('#opcion1'),
            document.querySelector('#opcion2')
        ]
        
        numeroPreguntas.innerHTML = `Pregunta ${indicePregunta+1} de ${listaPreguntas.length}`
        pregunta.innerHTML = listaPreguntas[indicePregunta].question;

        if(listaPreguntas[indicePregunta].correct_answer == "True"){
            opcion[0].innerHTML = listaPreguntas[indicePregunta].correct_answer;
            opcion[1].innerHTML = listaPreguntas[indicePregunta].incorrect_answers[0];
            respuesta = 0;
        }else{
            opcion[0].innerHTML = listaPreguntas[indicePregunta].incorrect_answers[0];
            opcion[1].innerHTML = listaPreguntas[indicePregunta].correct_answer;
            respuesta = 1;
        }   
    }
    console.log(listaPreguntas[indicePregunta].correct_answer);

    indicePregunta++;
}

function LimpiarOpciones(ban){
    while (boxOpciones.firstChild) {
        boxOpciones.firstChild.remove();
    }

    if(ban){
        for (let index = 0; index < 4; index++) {
            const opc = document.createElement('div');
            opc.style.backgroundColor = colores[index];
            opc.classList.add('col', 'd-flex', 'flex-column', 'opciones', 'justify-content-center', 'align-items-center');
            opc.addEventListener('click', ValidarRespuesta, false);
            opc.myParam = index;
            opc.innerHTML =
                `
                    <h3 id="opcion${index+1}"></h3>
                `;
        
            boxOpciones.appendChild(opc);
        }
    }else{
        for (let index = 0; index < 2; index++) {
            const opc = document.createElement('div');
            opc.style.backgroundColor = colores[index];
            opc.classList.add('col', 'd-flex', 'flex-column', 'pantalla-principal', 'justify-content-center', 'align-items-center');
            opc.addEventListener('click', ValidarRespuesta, false);
            opc.myParam = index;
            opc.innerHTML =
                `
                    <h3 id="opcion${index+1}"></h3>
                `;
        
            boxOpciones.appendChild(opc);
        }
    }
}


function GenerarAleatorios(){
    const aleatorios = [];
    let tam = 4;
    
    while (aleatorios.length < tam) {
    	const num = Math.floor(Math.random() * tam);
      
      if (!aleatorios.includes(num)) {
        aleatorios.push(num);
      }
    }
    
    return aleatorios
}

function ValidarRespuesta(msj){
    if(indicePregunta < listaPreguntas.length){
        if(respuesta == msj.currentTarget.myParam){
            puntuacion += 100;
            alert('correcta');
        }
        MostarPregunta();
    }else{
        let nickname = localStorage.getItem('nickname');
        let record = localStorage.getItem(nickname);

        if(record !== null){
            if(puntuacion > record){
                textModal.innerHTML = `NUEVO RECORD\n\nPuntuacion: ${puntuacion}\n\nRECORD ANTERIOR: ${record}
                `;

                localStorage.setItem(nickname, puntuacion);
            }else{
                textModal.innerHTML = `Puntuacion: ${puntuacion}\n\nRECORD ANTERIOR: ${record}`;
            }
        }else{
            textModal.innerHTML = `Puntuacion: ${puntuacion}`;
            
            localStorage.setItem(nickname, puntuacion);
        }
    
        modal.style.display = "block";
    }
}