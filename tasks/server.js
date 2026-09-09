const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

  // GET /
  if (req.url === '/' && req.method === 'GET') {

    fs.readFile('message', 'utf8', (err, data) => {

      if (err) {
        data = '';
      }

      res.write(`
        <html>
          <head>
            <title>Message App</title>
          </head>

          <body>

            <h1>Messages</h1>

            <p>${data}</p>

            <form action="/message" method="POST">

              <input
                type="text"
                name="message"
                required
              >

              <button type="submit">
                Send
              </button>

            </form>

          </body>
        </html>
      `);

      return res.end();

    });

    return;
  }


  // POST /message
  if (req.url === '/message' && req.method === 'POST') {

    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });


    req.on('end', () => {

      const parsedBody = Buffer
        .concat(body)
        .toString();

      const message = parsedBody.split('=')[1];


      fs.appendFile(
        'message',
        message + '\n',
        (err) => {

          res.statusCode = 302;

          res.setHeader(
            'Location',
            '/'
          );

          return res.end();

        }
      );

    });

    return;
  }


  // 404
  res.statusCode = 404;

  res.end('Page Not Found');

});


server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});