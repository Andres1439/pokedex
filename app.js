const d = document;
const listaPokemon = d.getElementById("listaPokemon");
const botonesHeader = d.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

//Aquí se crea una matriz vacía llamada fetchPromises que se utilizará para almacenar las promesas devueltas por fetch
const fetchPromises = [];

for (let i = 1; i <= 151; i++) {
  // Para agregar una nueva promesa a la matriz fetchPromises. Cada promesa corresponde a una petición fetch a un Pokémon diferente.
  fetchPromises.push(fetch(URL + i).then((response) => response.json()));
}

// Toma un iterable de promesas (en este caso, la matriz fetchPromises) y devuelve una nueva promesa que se resuelve cuando todas las promesas en el iterable se han resuelto, o se rechaza si alguna de las promesas se rechaza.
Promise.all(fetchPromises)
  // Cuando todas las promesas se resuelven exitosamente, se ejecuta esta función. Recibe un arreglo (pokemonDataArray) que contiene los datos de todos los Pokémon.
  .then((pokemonDataArray) => {
    pokemonDataArray.forEach((data) => mostrarPokemon(data));
  })
  .catch((error) => {
    console.error("Error al cargar los datos de los pokemons:", error);
  });

function mostrarPokemon(poke) {
  let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
  tipos = tipos.join("");

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = d.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
  listaPokemon.append(div);
}

botonesHeader.forEach((boton) =>
  boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
      fetch(URL + i)
        .then((response) => response.json())
        .then((data) => {
          if (botonId === "ver-todos") {
            mostrarPokemon(data);
          } else {
            const tipos = data.types.map((type) => type.type.name);
            if (tipos.some((tipo) => tipo.includes(botonId))) {
              mostrarPokemon(data);
            }
          }
        });
    }
  })
);
