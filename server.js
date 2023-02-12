const express = require('express')
const app = express()
const port=3000

//routes
app.get('/api/hello', (request, responce)=>{
    responce.send('Hello messenger API')
})

// server.get('/api/')
// server.post('/api/')
// server.patch('/api/')
// server.delete('/api/')

app.listen(port,console.log(`Server is listenning on http://localhost:${port}/`)) //npm run devStart
