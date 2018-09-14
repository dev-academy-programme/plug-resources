require('dotenv').load()

const express = require('express')
const auth = require('basic-auth')

const port = process.env.PORT || 3000
const username = process.env.USERNAME
const password = process.env.PASSWORD

const server = express()

server.set('trust proxy', true) // so we can detect https correctly
server.use('/', [makeSecure, authenticate, express.static('.')])

server.listen(port)

function makeSecure (req, res, next) {
  if (req.protocol === 'https' || port === 3000) {
    return next()
  }
  res.redirect(`https://${req.hostname}${req.originalUrl}`)
}

function authenticate (req, res, next) {
  const user = auth(req)
  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="EDA Student Handbook"')
    return res.status(401).send()
  }
  next()
}
