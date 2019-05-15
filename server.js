var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    querystring = require("querystring");

function parseFile(req, res) {
    req.setEncoding("binary");
    var body = "";
    var fileName = "";
    var boundary = req.headers["content-type"]
        .split("; ")[1]
        .replace("boundary=", "");
    req.on("data", function(chunk) {
        body += chunk;
    });

    req.on("end", function() {
        // console.log("body: \n",body);
        // console.log("req: \n", req);
        var file = querystring.parse(body, "\r\n", ":");

        if (file["Content-Type"].indexOf("image") !== -1) {
            var fileInfo = file["Content-Disposition"].split("; ");
            for (value in fileInfo) {
                if (fileInfo[value].indexOf("filename=") != -1) {
                    fileName = fileInfo[value].substring(
                        10,
                        fileInfo[value].length - 1
                    );

                    if (fileName.indexOf("\\") != -1) {
                        fileName = fileName.substring(
                            fileName.lastIndexOf("\\") + 1
                        );
                    }
                    console.log("TCL: parseFile -> fileName", fileName);
                }
            }

            var entireData = body.toString();
            var contentTypeRegex = /Content-Type: image\/.*/;
            contentType = file["Content-Type"].substring(1);

            var upperBoundary =
                entireData.indexOf(contentType) + contentType.length;
            var shorterData = entireData.substring(upperBoundary);

            var binaryDataAlmost = shorterData
                .replace(/^\s\s*/, "")
                .replace(/\s\s*$/, "");

            var binaryData = binaryDataAlmost.substring(
                0,
                binaryDataAlmost.indexOf("--" + boundary + "--")
            );

            fs.writeFile(fileName, binaryData, "binary", function(err) {
                if (err) {
                    console.error("writeFileError: ", err);
                } else {
                    // res.writeHead(200, {
                    //     "Content-Type": "text/plain;charset=utf-8"
                    // });
                    // res.end("图片上传完成");
                    res.writeHead(200, {
                        "Content-Type": "application/json;charset=utf-8"
                    });
                    res.end(JSON.stringify({
                        name: fileName,
                        url: "http://127.0.0.1:3001/"+fileName
                    }));
                }
            });
        } else {
            res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
            res.end("只能上传图片文件");
        }
    });
}

var server = http
    .createServer(function(req, res) {
        // res.setHeader('Content','keep-alive');
        // res.setHeader('Expires','Mon, 31 Dec 2012 23:59:59 GMT');
        //res.setHeader('Cache-Control', 'max-age=31536000');
        var pathname = path.join(__dirname, url.parse(req.url).pathname); // 获取访问路径url的目录路径部分
        if (path.extname(pathname) == "") {
            //path.extname() 拿出拓展名
            pathname += "/";
        }
        if (pathname.charAt(pathname.length - 1) == "/") {
            pathname += "index.html";
        }
        if (req.url === "/api/upload/") {
            console.log("/api/upload/");
            if (req.method === "POST") {
                if (
                    req.headers["content-type"].indexOf(
                        "multipart/form-data"
                    ) !== -1
                ) {
                    parseFile(req, res);
                } else {
                    res.end("其它提交方式");
                }
            }
        } else {
            // fs.exists(pathname, function(exists) {  //fs.exists已经废弃, 改用fs.access(path[,mode],callback), 但是后边有读写操作不推荐用fs.access, 改用fs.readFile
            // console.log(pathname)
            fs.readFile(pathname, function(err, data) {
                if (err) {
                    console.error(err);
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end("<h1>404 Not Found</h1>");
                } else {
                    var type = {
                        ".html": "text/html",
                        ".htm": "text/html",
                        ".js": "application/javascript",
                        ".css": "text/css",
                        ".ico": "image/x-icon",
                        ".jpeg": "image/jpeg",
                        ".jpg": "image/jpeg",
                        ".png": "image/png",
                        ".gif": "image/gif",
                        ".xml": "text/xml",
                        ".json": "application/json",
                        ".txt": "text/plain",
                        ".pdf": "application/pdf",
                        ".swf": "application/x-shockwave-flash",
                        ".woff": "application/font-woff",
                        ".ttf": "application/octet-stream"
                    };
                    if (type[path.extname(pathname)]) {
                        res.writeHead(200, {
                            "Content-Type": type[path.extname(pathname)]
                            // "Set-Cookie": "type=ninja"
                        });
                    }
                    res.end(data);
                }
            });
        }
    })
    .listen(3001);

console.log("Server is running at http://192.168.7.177:3001/");
