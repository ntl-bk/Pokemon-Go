const pokemonsEl = document.getElementById('pokemons'),
  single_pokemonEl = document.getElementById('single-pokemon'),
  loadMoreBtn = document.getElementById('load-more');

const types = {
  normal: 'grey',
  fighting: 'brown',
  flying: 'dodgerblue',
  poison: 'violet',
  ground: 'dimgrey',
  rock: 'slategrey',
  bug: 'darkred',
  ghost: 'chartreuse',
  steel: 'mediumpurple',
  fire: 'red',
  water: 'aqua',
  grass: 'green',
  electric: 'blue',
  psychic: 'beige',
  ice: 'skyblue',
  dragon: 'orange',
  dark: 'darkgrey',
  fairy: 'yellow',
  unknown: 'transparent',
  shadow: 'lightgrey',
};

async function getPokemons(url = 'https://pokeapi.co/api/v2/pokemon/?limit=12') {
  const response = await fetch(url);
  const data = await response.json();
  const detailsResponsePromise = Promise.all(
    data.results.map((e) => fetch(e.url))
  );
  let detailsResponse = await detailsResponsePromise;
  let detailsData = await Promise.all(detailsResponse.map((e) => e.json()));
  showPokemons(data, detailsData);
}

function showPokemons(data, detailsData) {
  if (data.next) {
    more.innerHTML = `
      ${
        data.next
          ? `<button id="load-more" onclick="getPokemons('${data.next}')">Load More</button>`
          : ''
      }
    `;
    pokemonsEl.innerHTML += `${data.results
      .map((e) => pokemonTemplate(e, detailsData))
      .join('')}`;
  } else {
    more.innerHTML = '';
    pokemonsEl.innerHTML = `${data.results
      .map((e) => pokemonTemplate(e, detailsData))
      .join('')}`;
  }
}

function pokemonTemplate(pokemon, pokemonInfo) {
  let pokemonTypes = pokemonInfo
    .find((e) => e.name == pokemon.name)
    .types.map((e) => e.type.name)
    .map(function (e) {
      return { type: toUpperFirstLetter(e), color: types[e] };
    });
  return `
    <div class="pokemon-card" data-pokemonName="${pokemon.name}">
      <img class="card-img" src="../img/cross.svg">
      <h2 class="pokemon-name">${toUpperFirstLetter(pokemon.name)}</h2>
      <div class="pokemon-types">${pokemonTypes
        .map((e) => typeTemplate(e.type, e.color))
        .join('')}</div>
    </div>
  `;
}

function typeTemplate(type, color) {
  return `<button class="type-item" style="background-color:${color}">${type}</button>`;
}

function getPokemonByName(pokemonName) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((res) => res.json())
    .then((data) => {
      addPokemonToDOM(data);
    });
}

function addPokemonToDOM(pokemon) {
  single_pokemonEl.innerHTML = `
  <div class="pokemon">
  <img class="card-img pokemon-img" src="../img/cross.svg">
  <h2 class="pokemon-name">${toUpperFirstLetter(pokemon.name)} #${
    pokemon.order
  }</h2>
  <table class="pokemon-info">
    <tr>
      <td>Type</td>
      <td>${pokemon.types
        .map((e) => toUpperFirstLetter(e.type.name))
        .join(', ')}</td>
    </tr>
    <tr>
      <td>Attack</td>
      <td>${getStats(pokemon, 'attack')}</td>
    </tr>
    <tr>
      <td>Defense</td>
      <td>${getStats(pokemon, 'defense')}</td>
    </tr>
    <tr>
      <td>HP</td>
      <td>${getStats(pokemon, 'hp')}</td>
    </tr>
    <tr>
      <td>SP Attack</td>
      <td>${getStats(pokemon, 'special-attack')}</td>
    </tr>
    <tr>
      <td>SP Defense</td>
      <td>${getStats(pokemon, 'special-defense')}</td>
    </tr>
    <tr>
      <td>Speed</td>
      <td>${getStats(pokemon, 'speed')}</td>
    </tr>
    <tr>
      <td>Weight</td>
      <td>${pokemon.weight}</td>
    </tr>
    <tr>
      <td>Total moves</td>
      <td>${pokemon.moves.length}</td>
    </tr>
  </table>
</div>
  `;
}

function toUpperFirstLetter(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function getStats(pokemon, statName) {
  return pokemon.stats.find((e) => e.stat.name == statName).base_stat;
}

getPokemons();

pokemonsEl.addEventListener(
  'click',
  (e) => {
    e.preventDefault();
    const pokemonCard = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains('pokemon-card');
      } else {
        return false;
      }
    });

    if (pokemonCard) {
      const pokemonName = pokemonCard.getAttribute('data-pokemonName');
      getPokemonByName(pokemonName);
    }
  },
  false
);
