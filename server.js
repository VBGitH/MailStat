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
  dateAction      : Date,
  guidObject      : String,
  guidLetter      : String,
  addInf          : String,
  isNew           : Boolean,
  dateSync        : Date, 
})

app.use('/', express.static('public'))

//http://localhost:3030/api/mail/open?LidGuid=123&LetterGuid=321
//https://mail-stat.vercel.app/api/mail/open?LidGuid=123&LetterGuid=321
//событие открытия письма
app.get('/api/mail/open', async (req, res) => {

  /* ---- запись БД ---- */
  const recordSet = new mailAction()
  recordSet.action = 'readMail'
  recordSet.dateAction = new Date()
  recordSet.guidObject = req.query.LidGuid
  recordSet.guidLetter = req.query.LetterGuid
  recordSet.addInf = ''
  recordSet.isNew = true
  recordSet.dateSync = new Date(1,1,1)

  await recordSet.save()

  /* ---- возвращаем картинку ---- */
  res.statusCode = 200
  res.sendFile(pathPoint)

})

//https://mail-stat.vercel.app/api/mail/unsubscribe?LidGuid=123&LetterGuid=321
//событие отписки от рассылки
app.get('/api/mail/unsubscribe', async (req, res) => {

  /* ---- запись БД ---- */
  const recordSet = new mailAction()
  recordSet.action = 'unsubscribe'
  recordSet.dateAction = new Date()
  recordSet.guidObject = req.query.LidGuid
  recordSet.guidLetter = req.query.LetterGuid
  recordSet.addInf = ''
  recordSet.isNew = true
  recordSet.dateSync = new Date(1,1,1)

  await recordSet.save()

  res.statusCode = 200
  res.end('Выполнено отключение от рассылки')

})

//синхронизация с УНФ (пароль передаем в запросе для чтения)
//https://mail-stat.vercel.app/api/getupdates/?pass=adter7re54556njfdhgfdgg8756546
app.get('/api/getupdates', async (req, res) => {

  if(req.query.pass == process.env.PASSWORD_READ){

      /* ---- запрос к БД ---- */
      let rec = await mailAction.find({ 
        isNew: true 
      }).exec()
      
      res.json(rec)
    }else{
      res.end('denide')
    }

})    

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})