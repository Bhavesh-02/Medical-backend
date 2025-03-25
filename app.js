const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 5000;
const connectDB = require('./config/connectdb');
const User = require('./routes/userroutes');
const Product = require('./routes/productsroutes')
const bodyParser = require('body-parser');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const updateProduct = require('./routes/productsroutes')
 
app.use(cors()); 

connectDB();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const filePath = path.join(__dirname, 'uploads', 'image.png');
console.log(filePath);  // This will output the absolute path like /Users/yourname/project/uploads/image.png



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', User); // All routes related to users will be prefixed with /api
app.use('/api', Product);
app.use('/api', categoryRoutes);
app.use('/api', brandRoutes);
app.use('/api', updateProduct);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
