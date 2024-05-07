const express = require('express')
const app = express()
const port = 3030
//const pathPoint = __dirname + '\\public\\visible_point.png'
const pathPoint = __dirname + '/public/visible_point.png'

const mongoose = require('mongoose')
//mongoose.connect('mongodb://127.0.0.1:27017/meteoDB')
mongoose.connect(process.env.MONGODB_URI)
const mailAction = mongoose.model('mailAction', { 
  action          : String,
  date            : String,
  guidObg         : String,
  guidLetter      : String,
  addInf          : String, 
})

app.use('/', express.static('public'))

app.get('/api/mail/open', async (req, res) => {
    
  res.statusCode = 200
  res.sendFile(pathPoint)

  //res.json({
  //  'path' : pathPoint
  //})

  })

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})