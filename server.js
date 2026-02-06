const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const publicDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${port}`;
  const requestUrl = new URL(req.url, `http://${host}`);
  const safePath = path.normalize(requestUrl.pathname).replace(/^([/\\])+/, "");
  const filePath = path.join(publicDir, safePath || "index.html");

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Arquivo não encontrado.");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Erro ao ler o arquivo.");
    });
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
