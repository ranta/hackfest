const API_URL = 'https://pokeapi.co/api/v2';

/**
 * @typedef {Object} Pokemon
 * @property {string} name
 * @property {string} url
 */

const state = {
  currentPokemon: undefined,
  streak: 0,
  maxStreak: 0,
  correct: 0,
  incorrect: 0,
};

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

  const id = state.currentPokemon.url.match(/\/(\d+)\//)[1];
  const imageUrl = getImageUrl(Number(id));
  const div = template.content.cloneNode(true);

  div.querySelector('img').src = imageUrl;

  main.append(div);
};

/**
 * @returns {void}
 */
const renderScore = () => {
  document.getElementById('score')?.remove();

  const main = document.getElementById('main');
  const template = document.getElementById('score-template');

  const div = template.content.cloneNode(true);

  div.querySelector('#score-correct').textContent = state.correct;
  div.querySelector('#score-incorrect').textContent = state.incorrect;
  div.querySelector('#score-streak').textContent = state.streak;
  div.querySelector('#score-max-streak').textContent = state.maxStreak;

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
  if (guessedName.toLowerCase() === state.currentPokemon.name.toLowerCase()) {
    results = document.getElementById('correct-template').content.cloneNode(true);
    state.correct++;
    state.streak++;
    if (state.streak > state.maxStreak) {
      state.maxStreak = state.streak;
    }
  } else {
    results = document.getElementById('incorrect-template').content.cloneNode(true);
    state.incorrect++;
    state.streak = 0;
  }
  results.querySelector('p > span').textContent = state.currentPokemon.name;
  main.append(results);
  state.currentPokemon = randomPokemon;
  renderPokemon();
  renderScore();
};

window.addEventListener('load', async () => {
  const pokemons = await getPokemons();
  state.currentPokemon = getRandomPokemon(pokemons);
  renderPokemon();
  document.getElementById('pokemon-form').onsubmit = handleSubmit(pokemons);
});
