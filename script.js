const API_URL = 'https://pokeapi.co/api/v2';

/**
 * @typedef {Object} Pokemon
 * @property {string} name
 * @property {string} url
 */

/**
 * @type Pokemon
 */
let currentPokemon;

/**
 * @returns Pokemon[]
 */
const getPokemons = async () => {
  const response = await fetch(`${API_URL}/pokemon?limit=151`);
  return (await response.json()).results;
};

/**
 * @param {number} id
 * @returns {string}
 */
const getImageUrl = (id) => {
  const padding = '0'.repeat(2 - Math.floor(Math.log10(id)));
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${padding}${id}.png`;
};

/**
 * @returns {void}
 */
const renderPokemon = () => {
  document.getElementById('pokemon')?.remove();

  const main = document.getElementById('main');
  const template = document.getElementById('pokemon-template');

  const id = currentPokemon.url.match(/\/(\d+)\//)[1];
  const imageUrl = getImageUrl(Number(id));
  const div = template.content.cloneNode(true);

  div.querySelector('img').src = imageUrl;

  main.append(div);
};

/**
 * @param {Pokemon[]} pokemons
 * @return {Pokemon}
 */
const getRandomPokemon = (pokemons) => {
  const index = Math.floor(Math.random() * pokemons.length);
  const pokemon = pokemons[index];
  pokemons.splice(index, 1);
  return pokemon;
};

/**
 * @param {Pokemon[]} pokemons
 * @return {((Event) => Promise<void>)}
 */
const handleSubmit = (pokemons) => async (event) => {
  event.preventDefault();
  document.getElementById('correct')?.remove();
  document.getElementById('incorrect')?.remove();
  const randomPokemon = getRandomPokemon(pokemons);

  const guessedName = event.target.name.value;
  event.target.name.value = '';

  let results;
  if (guessedName.toLowerCase() === currentPokemon.name.toLowerCase()) {
    results = document.getElementById('correct-template').content.cloneNode(true);
  } else {
    results = document.getElementById('incorrect-template').content.cloneNode(true);
  }
  results.querySelector('p > span').textContent = currentPokemon.name;
  main.append(results);
  currentPokemon = randomPokemon;
  renderPokemon();
};

window.addEventListener('load', async () => {
  const pokemons = await getPokemons();
  currentPokemon = getRandomPokemon(pokemons);
  renderPokemon();
  document.getElementById('pokemon-form').onsubmit = handleSubmit(pokemons);
});
