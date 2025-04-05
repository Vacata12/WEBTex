const express = require("express")
const multer = require("multer") //use to upload file
const path = require("path")
const fs = require("fs")
const { message } = require("statuses")

const app = express()
const PORT = 3000

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Debugging middleware
app.use((req, res, next) => {
  console.log("Request body:", req.body)
  console.log("Request files:", req.files)
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// File upload api
app.post("/api/uploadfile", upload.single("uploadFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded")
  }
  console.log("Uploaded file:", req.file)
  res.send("File uploaded successfully")
})


//Download file api (local)
app.get("/api/download/:filename", (req, res, next) => {
  const filename = req.params.filename
  const filePath = path.join(uploadDir, filename)

  res.download(filePath, filename, (err) => {
    if(err) {
      res.status(500).send({
        error: err,
        message: "File not download. " + err.message,
      })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});