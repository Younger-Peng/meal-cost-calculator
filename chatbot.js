const http = require('http');

async function gossip(msg) {
  msg = encodeURIComponent(msg);
  return new Promise((resolve, reject) => {
    http.get(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${msg}`, res => {
      let data = ''
      res.on('data', chunk => {
          data += chunk
      });

      res.on('end', () => {
          try {
            data = data.toString();
            data = JSON.parse(data);
            resolve(data.content)
          } catch(e) {
            resolve('Sorry, I don\'t understand')
          }
      })
    })
  })
}

module.exports ={
  gossip,
}