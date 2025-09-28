const express = require('express');
const router = express.Router();
const multer  = require('multer'); //for photo
const Product = require ('../models/product.js');
const upload = multer({ dest: 'uploads/' })// for import the photo from uplods

//to get all product
router.get('/',async(req,res)=>{
    try {
        res.render('products/index.ejs');
    } catch (error) {
        res.send('error!');
    }
});
//list of product
router.get("/product", async (req, res) => {
    res.render("products/index.ejs");
    console.log("route done!!!!!!");
});
//list single product
router.get("/:productId", async(req, res) => {
  const product = await Product.findById(req.params.productId);
  res.render("products/show.ejs");
});

//to add a new product
router.get("/new", (req, res) => {
  res.render("products/new.ejs");
});

router.delete('/product/:productId', async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.redirect(`/users/${req.params.productId}/product`);
});

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const newProduct= new Product({
            name:req.body.name,
            type: req.body.type,
            categoryId: req.body.categoryId,
            description:req.body.description,
            image: req.file ? req.file.filename : null,
            price:req.body.price,
            user: req.params.userId,
        });
        await newProduct.save();//saveing the new food
        res.redirect(`products/products`);
    } catch (error) {
        res.send('error found with adding a new products!!')
    }
});
//to update 
router.put('/product/:productId', upload.single('image'), async (req, res) => {
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