const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt1312171/?ref_=nv_sr_3';

(async () => {
  const response = await request({
    uri: URL,
    headers: {
      'authority': 'www.imdb.com',
      'method': 'GET',
      'path': '/title/tt0325547/',
      'scheme': 'https',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
    },
    gzip: true
  });

  const $ = cheerio.load(response);
  //console.log(response)

  const title = $('div[class="title_wrapper"] > h1').text().trim();
  const rating = $('span[itemprop="ratingValue"]').text();
  const poster = $('div[class="poster"] > a > img').attr('src');
  const totalRatings = $('div[class="imdbRating"] > a').text();
  const releaseDate = $('a[title="See more release dates"]').text().trim();
  const titleHead = $('title').first().text();
  const genres = [];
  $('div[class="title_wrapper"] a[href^="/genre/"]').each((i, elm) => {
    let genre = $(elm).text();

    genres.push(genre);
  });

  console.log(title, rating, poster, totalRatings, releaseDate, titleHead, `${genres}`)
})();