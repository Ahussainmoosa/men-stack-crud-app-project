const express = require('express');
const router = express.Router();
const multer  = require('multer'); //for photo
const Product = require ('../models/product.js');
const upload = multer({ dest: 'uploads/' })// for import the photo from uplods

//to get all product
router.get('/',async(req,res)=>{
    try {
      const products =await Product.find();
        res.render('product/index.ejs',{products});
    } catch (error) {
        res.send('error with loading the product!');
    }
});

//to add a new product
router.get("/new", (req, res) => {
  console.log ('routes new done');
  res.render("product/new.ejs");
});

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const newProduct= new Product({
            name: req.body.name,
            categoryId: req.body.categoryId,
            description:req.body.description,
            image: req.file ? req.file.filename : null,
            price:req.body.price,
            user: req.session.user ? req.session.user._id : null,
        });
        await newProduct.save();//saveing the new food
        res.redirect('/product');
    } catch (error) {
        res.send(error);
    }
});

//list single product
router.get("/:productId", async(req, res) => {
  const products = await Product.findById(req.params.productId);
  res.render("product/show.ejs",{products});
});



router.delete('/:productId', async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.redirect(`/users/${req.params.productId}/product`);
});


//to update 
router.put('/:productId', upload.single('image'), async (req, res) => {
  try {
    const updateProduct ={
        name:req.body.name,
        ingredients:req.body.ingredients,
        description:req.body.description,
        image : req.file ? req.file.filename :null
    }
    await Product.findByIdAndUpdate(req.params.productId, updateProduct);
    res.redirect(`/users/${req.params.productId}/product`);
  } catch (error) {
    res.send('error with updating !!')
  }
});


module.exports=router;
