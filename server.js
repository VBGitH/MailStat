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
  isSync          : Boolean,
  dateSync        : Date, 
})

app.use('/', express.static('public'))
app.use(express.json())

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
  recordSet.isSync = false
  recordSet.dateSync = new Date(1,1,1)

  await recordSet.save()

  /* ---- возвращаем картинку ---- */
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
  recordSet.isSync = false
  recordSet.dateSync = new Date(1,1,1)

  await recordSet.save()
  res.end('Выполнено отключение от рассылки')

})

//синхронизация с УНФ: чтение новых данных (пароль передаем в запросе для чтения)
//https://mail-stat.vercel.app/api/getupdates/?pass=adter7re54556njfdhgfdgg8756546
app.get('/api/getupdates', async (req, res) => {

  if(req.query.pass == process.env.PASSWORD_READ){

      /* ---- запрос к БД ---- */
      let rec = await mailAction.find({ 
        isSync: false 
      }).exec()

      //res.json(rec)
      res.status(200).json(rec)
    }else{
      res.status(500).send({error: 'error authentication'})
    }

})

//синхронизация с УНФ: отметка о загрузке записи (пароль передаем в заголовке post запроса)
app.post('/api/setupdates', async (req, res) => {

  let query = req.body
  
  if(query.pass == process.env.PASSWORD_READ){

      let rowCount = Object.keys(query.records).length
    
      for (let i = 0; i < rowCount; i++ ){
        let curId = query.records[i]
        let curRec = await mailAction.findById(curId).exec()
        if (curRec != null) {
          curRec.isSync = true
          curRec.dateSync = new Date()
          await curRec.save()
        }
         
      }
      
      res.status(200).send()  

    }else{
      res.status(500).send({error: 'error authentication'})
    }

})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})