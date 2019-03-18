const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const {
  Parser
} = require('json2csv');

const URLS = [
  'https://www.imdb.com/title/tt1312171/',
  'https://www.imdb.com/title/tt0325547/'
];

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const response = await request({
      uri: movie,
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
      //this is to help deal with gzip compression enabled websites
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

    moviesData.push({
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
      genres
    });
  }
  //fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');
  //console.log(moviesData)
  //console.log(title, rating, poster, totalRatings, releaseDate, titleHead, `${genres}`)
  /*
  //if you don't want to specify al fields
    const json2csvParser = new Parser();
  */
  const fields = ['title', 'rating'];
  const json2csvParser = new Parser({
    fields
  });
  const csv = json2csvParser.parse(moviesData);
  fs.writeFileSync('./data.csv', csv, 'utf-8')
  console.log(csv)
})();