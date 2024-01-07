const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

app.use(express.static("public"));

// Creating DB connection 

const db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'bcard'
})

// Creating storage for images

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImg = multer({ storage : storage });

// Uploading user data

app.post(
  "/addcard",
  uploadImg.fields([{ name: "profileImage" }, { name: "logoImage" }]),
  async (req, res) => {
	const values = [
		req.files['profileImage'][0].path || '', 
    	req.files['logoImage'][0].path || '',   
		req.body.subUrl || '',
		req.body.name || '',
		req.body.designation || '',
		req.body.description || '',
		req.body.email || '',
		req.body.phno || '',
		req.body.website || '',
		req.body.instagram || '',
		req.body.facebook || '',
	 ];
	 const sql = "INSERT INTO USERDATA (profileImg, logoImg,subUrl, clientName, designation, description, email, phoneNumber, website, instagram, facebook) VALUES (?)"

	 try{
		 const data = await db.query(sql,[values]);
		 return res.json({status:"success"})
	 }
	 catch(err){
		 return res.status(500).json({ error: "Internal Server Error" });
	 }
	
		
  }
);

// check sub url

app.get('/checksuburl', (req, res) => {
	const subUrl = req.body.subUrl;
	const sql = "SELECT * FROM USERDATA WHERE subUrl = (?)";
  
	db.query(sql, [subUrl], (err, data) => {
	  if (err) {
		return res.status(500).json({ error: "Internal Server Error" });
	  }
  
	  if (data.length === 0) {
		return res.json({ status: "available" });
	  } else {
		return res.json({ status: "notavailable" });
	  }
	});
  });


// listing port

const port = 3300;
app.listen(port, () => console.log("listening in port " + port));
