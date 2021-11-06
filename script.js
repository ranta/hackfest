const API_URL = 'https://pokeapi.co/api/v2';

/**
 * @typedef {Object} Pokemon
 * @property {string} name
 * @property {string} url
 */

const state = {
  currentPokemon: undefined,
  streak: 0,
  correct: 0,
  incorrect: 0,
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * @returns Pokemon[]
 */
const getPokemons = async () => {
  const response = await fetch(`${API_URL}/pokemon?limit=251`);
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
 * @returns {string[]}
 */
const getChoices = () => {
  if (state.pokemons.length < 3) {
    throw Error('Thanks for playing!');
  }
  const choices = new Set([state.currentPokemon.name]);
  while (choices.size < 4) {
    const index = Math.floor(Math.random() * state.pokemons.length);
    const pokemon = state.pokemons[index];
    choices.add(pokemon.name);
  }

  return shuffle(Array.from(choices));
};

/**
 * @returns {void}
 */
const renderChoices = () => {
  const main = document.getElementById('main');
  const div = document.getElementById('choices');

  for (const [i, choice] of getChoices().entries()) {
    div.querySelector(`#choice-${i + 1}`).textContent = choice;
  }

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
  div.querySelector('#score-max-streak').textContent = localStorage.getItem('maxStreak') || 0;

  main.append(div);
};

/**
 * @return {Pokemon}
 */
const getRandomPokemon = () => {
  const index = Math.floor(Math.random() * state.pokemons.length);
  const pokemon = state.pokemons[index];
  state.pokemons.splice(index, 1);
  return pokemon;
};

/**
 * @returns {void}
 */
const renderGame = () => {
  renderPokemon();
  renderChoices();
  renderScore();
};

/**
 * @param {Event} event
 * @return {Promise<void>}
 */
const handleChoiceClick = async (event) => {
  event.preventDefault();
  document.getElementById('correct')?.remove();
  document.getElementById('incorrect')?.remove();
  const randomPokemon = getRandomPokemon(state.pokemons);

  const guessedName = event.target.textContent;
  event.target.name.value = '';

  let results;
  if (guessedName.toLowerCase() === state.currentPokemon.name.toLowerCase()) {
    results = document.getElementById('correct-template').content.cloneNode(true);
    state.correct++;
    state.streak++;
    if (state.streak > (localStorage.getItem('maxStreak')) || 0) {
      localStorage.setItem('maxStreak', state.streak);
    }
  } else {
    results = document.getElementById('incorrect-template').content.cloneNode(true);
    state.incorrect++;
    state.streak = 0;
  }
  results.querySelector('p > span').textContent = state.currentPokemon.name;
  main.append(results);
  state.currentPokemon = randomPokemon;
  renderGame();
};

window.addEventListener('load', async () => {
  state.pokemons = await getPokemons();
  state.currentPokemon = getRandomPokemon();
  renderGame();
  document.querySelectorAll('.choice-button').forEach(item => {
    item.addEventListener('click', handleChoiceClick);
  });
});
