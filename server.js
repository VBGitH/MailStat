const express = require('express')
const app = express()
const port = 3030
//const pathPoint = __dirname + '\\public\\visible_point.png'
const pathPoint = __dirname + '/public/visible_point.png'
require('dotenv').config()
const mongoose = require('mongoose')
//mongoose.connect('mongodb://127.0.0.1:27017/meteoDB')
mongoose.connect(process.env.MONGODB_URI)
const mailAction = mongoose.model('mailAction', { 
  action          : String,
  date            : Date,
  guidObg         : String,
  guidLetter      : String,
  addInf          : String, 
})

app.use('/', express.static('public'))

//http://localhost:3030/api/mail/open?LidGuid=123&LetterGuid=321
//https://mail-stat.vercel.app/api/mail/open?LidGuid=123&LetterGuid=321

app.get('/api/mail/open', async (req, res) => {

  /* ---- запись БД ---- */
  const recordSet = new mailAction()
  recordSet.action = 'readMail'
  recordSet.date = new Date()
  recordSet.guidObg = req.query.LidGuid
  recordSet.guidLetter = req.query.LetterGuid
  recordSet.addInf = ''

  await recordSet.save()

  /* ---- возвращаем картинку ---- */
  res.statusCode = 200
  res.sendFile(pathPoint)

  })

app.listen(port, () => {
  //console.log(`Example app listening on port http://localhost:${port}`)
})