const API_URL = 'https://pokeapi.co/api/v2';

const getPokemons = async () => {
  const response = await fetch(`${API_URL}/pokemon?limit=151`);
  return (await response.json()).results;
};

const getImageUrl = (id) => {
  const padding = '0'.repeat(2 - Math.floor(Math.log10(id)));
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${padding}${id}.png`;

};

const renderPokemons = async () => {
  const pokemons = await getPokemons();
  const main = document.getElementById('main');
  const template = document.getElementById('pokemon-template');

  for (const pokemon of pokemons) {
    const id = pokemon.url.match(/\/(\d+)\//)[1];
    const imageUrl = getImageUrl(Number(id));
    const div = template.content.cloneNode(true);
    div.querySelector('h2').textContent = pokemon.name;
    div.querySelector('img').src = imageUrl;
    main.append(div);
  }
};

window.addEventListener('load', async () => {
  await renderPokemons();
});
