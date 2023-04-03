#!/usr/bin/env node

  const fs        = require('fs')
  const path      = require('path')
  const http      = require('http')
  const https     = require('https')
  const WebSocket = require('ws')

  const setupWSConnection = require('./utils.js').setupWSConnection

  const host       = process.env.HOST || 'localhost'
  const port       = process.env.PORT || 1234
  const CERTPrefix = process.env.CERT || ''

  console.clear()

  let KeyFilePath, CERTFilePath
  if (CERTPrefix !== '') {
    KeyFilePath = CERTPrefix + '.key'
    if (! fs.existsSync(KeyFilePath)) {
      console.error('no key file at "' + KeyFilePath + '"')
      process.exit(1)
    }

    CERTFilePath = CERTPrefix + '.crt'
    if (! fs.existsSync(CERTFilePath)) {
      console.error('no cert file at "' + CERTFilePath + '"')
      process.exit(1)
    }
  }

  let server
  if (CERTPrefix !== '') {
    server = https.createServer({
      key:  fs.readFileSync(KeyFilePath),
      cert: fs.readFileSync(CERTFilePath)
    }, (request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('okay')
    })
  } else {
    server = http.createServer((request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end('okay')
    })
  }


  const wss = new WebSocket.Server({ noServer: true })

  wss.on('connection', setupWSConnection)

  server.on('upgrade', (request, socket, head) => {
    // You may check auth of request here..
    // See https://github.com/websockets/ws#client-authentication
    const handleAuth = ws => {
      wss.emit('connection', ws, request)
    }

    wss.handleUpgrade(request, socket, head, handleAuth)
  })

  server.listen(port, host, () => {
    console.log(`running at '${host}' on port ${port}`)
  })
