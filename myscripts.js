let arrayEstudiantes = [];
let arrayCarrera = [];

const url = "https://utn-lubnan-api-2.herokuapp.com/"

function loadData(method, endpoint) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url + endpoint);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);  // Resolver la promesa con la respuesta
      } else {
        reject(new Error("" + xhr.status));  // Rechazar si el estado no es exitoso
      }
    };

    xhr.onerror = function () {
      reject(new Error('Error de red'));  // Rechazar si hay un error de red
    };

    xhr.send(); // No se necesita cuerpo para una solicitud DELETE O GET
  });
}

function getEstudiantes() {
  return loadData('GET', 'api/Student');
}
function getCarrera() {
  return loadData('GET', 'api/career');
}
function deleteEstudiante(id){
  return loadData('DELETE','api/Student/' + id);
}

function connecEstudiantes() {
  getEstudiantes()
    .then(data => {
      arrayEstudiantes = JSON.parse(data);  // Asumimos que la respuesta es JSON
      console.log(arrayEstudiantes);  // Mostrar los datos de la compañía
      cargarEstudiantes();
    })
    .catch(error => {
      console.error('Error obteniendo las compañías:', error);
    });
}
function connecCarrera() {
  getCarrera()
    .then(data => {
      arrayCarrera = JSON.parse(data);  // Asumimos que la respuesta es JSON
      console.log(arrayCarrera);  // Mostrar los datos de la compañía
    })
    .catch(error => {
      console.error('Error obteniendo las compañías:', error);
    });
}
function connectDeleteEstudiante(id) {
  deleteEstudiante(id)
    .then(response => {
      alert("estudiante eliminado");// Asumimos que la respuesta es JSON
      connecEstudiantes(); // vuelvo a cargar los estudiantes
    })
    .catch(error => {
      console.error('Error obteniendo las compañías:', error);
    });
}

async function promisesget() {
  await Promise.all([connecCarrera(), connecEstudiantes()]);

}

window.onload = promisesget;

function cargarEstudiantes() {

  const tabla = document.getElementById("estudiantes");
  tabla.innerHTML = '';

 /* arrayEstudiantes.sort((a, b) => {
    if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) return 1;
    if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) return -1;
    return 0; // Si son iguales
});*/

  arrayEstudiantes.forEach(estudiante => {

    const fila = document.createElement("tr");

    const id = document.createElement("td");
    id.textContent = estudiante.studentId;

    const carrer = document.createElement("td");
    carrer.textContent = buscarCarrera(estudiante.careerId);

    const firstName = document.createElement("td");
    firstName.textContent = estudiante.firstName;

    const lastName = document.createElement("td");
    lastName.textContent = estudiante.lastName;

    const email = document.createElement("td");
    email.textContent = estudiante.email;

    const boton = document.createElement("button");
    boton.textContent = "Eliminar"

    boton.addEventListener('click',()=>{
      connectDeleteEstudiante(estudiante.studentId);

    }

    )

    fila.appendChild(id);
    fila.appendChild(carrer);
    fila.appendChild(lastName);
    fila.appendChild(firstName);
    fila.appendChild(email);
    fila.appendChild(boton);

    if (carrer.textContent != "Sin carrera") {
      tabla.appendChild(fila);
    }

  })

}

function buscarCarrera(id) {
  const carrera = arrayCarrera.find(career => career.careerId === id && career.active == true);
  return carrera ? carrera.name : "Sin carrera";
}




