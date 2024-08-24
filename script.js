// url
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api'
const API_KEY = '8a91212f-251a-46ed-89c2-08e085db7629'
const API_URL_POPULAR = BASE_URL + '/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page='
const API_URL_SEARCH = BASE_URL + '/v2.1/films/search-by-keyword?keyword='
const API_DETAILS = BASE_URL + '/v2.2/films/'
const SIMILARS = '/similars'
// url

// dom
const output = document.querySelector('.output')
const paginationWrap = document.querySelector('.paginationWrap')
const form = document.querySelector('form')
const input = document.querySelector('input')
// dom


//states
let activeBtn = 1
let valueState = ''
//states


const getMovies = async (url) => {
    try {
        const request = await fetch (url, {
            headers: {
                'X-API-KEY': API_KEY
            }
        })
        const response = await request.json()
        renderMovies(response.films)
        console.log(response);
        if(!response.keyword) {
            pagination(20)
        }

    } catch (e) {
        console.log(e);
        // alert(e)
    }
}
getMovies( API_URL_POPULAR + '1')


const searchMovies = (event) => {
    event.preventDefault();
    valueState = input.value.trim();
    if (valueState) {
      const url = API_URL_SEARCH + valueState;
      getMovies(url);
      input.value = '';
    }
  };
  form.addEventListener('submit', searchMovies);

const renderMovies = (data) => {
    output.innerHTML = ''
    console.log(data);

    data.forEach(el => {
        const wrap = document.createElement('div')
        const poster = document.createElement('img')
        const name = document.createElement('h3')
        const rating = document.createElement('p')
        const genresWrap = document.createElement('p')
        const filmLength = document.createElement('p')
        const countriesWrap = document.createElement('p') // Элемент для стран
              filmLength.textContent = el.filmLength 
            ? `Длительность фильма: ${el.filmLength} минут`
            : 'Длительность не указана';

        wrap.classList = 'wrap'

        poster.src = el.posterUrl
        name.textContent = el.nameRu || el.nameEn
        rating.textContent = el.rating === null || el.rating === 'null'
            ? 'Null'
            : el.rating
            rating.classList.add('rating_p')
           
        const newGenres = el.genres.map(item => item.genre).join(', ')
        genresWrap.textContent = newGenres

          // Вывод стран
        const newCountries = el.countries.map(item => item.country).join(', ')
        countriesWrap.textContent = `Страны: ${newCountries}`

        wrap.addEventListener('click', () => {
            getMovieDetails(el.filmId)
        })


        wrap.append(poster, name, filmLength, rating, genresWrap, countriesWrap)
        output.append(wrap)
    })

}

const pagination = (num) => {
    paginationWrap.innerHTML = ''
    const paginationNumbers = []

    for(let i = 1; i <= num; i++) {
        paginationNumbers.push(i)
    }

    paginationNumbers.forEach(el => {
        const button = document.createElement('button')
        button.classList = el === activeBtn ? 'active' : ''
        button.textContent = el

        button.addEventListener('click', () => {
            console.log(el);
            activeBtn = el
            getMovies(API_URL_POPULAR + el)
        })

        paginationWrap.append(button)
    })
}

////////////////////////////////////////////////////////////////////

const getMovieDetails = async (id) => {
    const request = await fetch(API_DETAILS + id, {
        headers: {
            'X-API-KEY': API_KEY
        }
    })
    const response = await request.json()
    console.log(response);
    getSimilars(id, response)
}


const getSimilars = async (id, data) => {
    const request = await fetch(API_DETAILS + id + SIMILARS, {
        headers: {
            'X-API-KEY': API_KEY
        }
    })
    const response = await request.json()

    const payload = {
        details: data,
        similars: response.items   
    }
    renderDetails(payload)
}

const renderDetails = (payload) => {
    
    const data = payload.details
    output.innerHTML=''
    paginationWrap.innerHTML=''

    const poster = document.createElement('img')
    const description = document.createElement('p')
    const back = document.createElement('button')


     // Установка классов для стилизации
     poster.classList.add('details-poster');
     description.classList.add('details-description');
     back.classList.add('details-back-button');

    poster.src = data.posterUrl
    description.textContent = data.description
    back.textContent = 'Назад'
   

    back.addEventListener('click', () => {
        if(valueState) {
            getMovies(API_URL_SEARCH + valueState)
        } else {
            getMovies(API_URL_POPULAR + activeBtn)
        }
        getMovies(API_URL_POPULAR + activeBtn)
    })
    output.append(back, poster, description)
}
