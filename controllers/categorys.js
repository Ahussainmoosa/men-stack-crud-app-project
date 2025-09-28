const express = require('express');
const router = express.Router();
const Category = require ('../models/category.js');
const multer  = require('multer') //for photo
const upload = multer({ dest: 'uploads/' })// for import the photo from uplods

//to get all gategory
router.get('/',async(req,res)=>{
    try {
        res.render('products/index.ejs');
    } catch (error) {
        res.send('error!');
    }
});

router.get("/:categoryId", async(req, res) => {
  const category = await Category.findById(req.params.categoryId);
  res.render("products/show.ejs");
});

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const newCategory= new Category({
            name:req.body.name,
        });
        await newCategory.save();//saveing the new food
        res.redirect('/products/cart');
    } catch (error) {
        res.send('error found with adding a new products!!')
    }
});
router.delete('/:CategoryId', async (req, res) => {
  await Category.findByIdAndDelete(req.params.CategoryId);
  res.redirect('/categoris');
});

router.put('/category/:CategoryId', upload.single('image'), async (req, res) => {
  try {
    const updateCategory ={
        name:req.body.name,
        ingredients:req.body.ingredients,
        description:req.body.description,
        image : req.file ? req.file.filename :null
    }
    await Category.findByIdAndUpdate(req.params.CategoryId, updateCategory);
    res.redirect(`/users/${req.params.CategoryId}/category`);
  } catch (error) {
    res.send('error with updating with the category !!')
  }
});

module.exports =router;