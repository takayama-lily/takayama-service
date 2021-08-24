"use strict"
const http = require("http")
const url = require("url")
const querystring = require("querystring")
const zlib = require("zlib")
const { exec } = require("child_process")
const mjsoul = require("./majsoul/majsoul")

function fn(req) {
    let r = url.parse(req.url)
    let query = querystring.parse(r.query)
    
    //国服雀魂api
    if (r.pathname === "/api" && query.m && !["login", "logout"].includes(query.m)) {
        return mjsoul.sendAsync(query.m, query)
    }

    //whois请求
    else if (r.pathname === "/whois" && query.domain) {
        return new Promise((resolve, reject)=>{
            exec("whois " + query.domain, (error, stdout, stderr) => {
                let output = {
                    "stdout": stdout,
                    "stderr": stderr,
                    "error": error
                }
                resolve(output)
            })
        })
    }
}

http.createServer(async(req, res) => {
    let result
    try {
        result = await fn(req)
        if (!result) {
            res.writeHead(302, {"Location": "/index.html"})
            res.end()
            return
        }
    } catch(e) {
        result = e
    }
    if (!(result instanceof Buffer) && typeof result !== "string")
        result = JSON.stringify(result)
    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.setHeader("Access-Control-Allow-Origin", "*")

    //开启gzip
    let acceptEncoding = req.headers["accept-encoding"]
    if (result.length > 1024 && acceptEncoding && acceptEncoding.includes("gzip")) {
        res.writeHead(200, { "Content-Encoding": "gzip" })
        zlib.gzip(result, (err, buffer)=>{
            if (err)
                buffer = JSON.stringify({error: err})
            res.end(buffer)
        })
    } else {
        res.end(result)
    }
}).listen(3000)
