// controllers/foods.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const Food = require ('../models/food.js');
const multer  = require('multer') //for photo
const upload = multer({ dest: 'uploads/' })// for import the photo from uplods

//routes
//home page
router.get('/',async(req,res)=>{
    try {
        const foods = await Food.find({ user: req.params.userId });
        res.render('foods/index.ejs',{foods, userId: req.params.userId});
    } catch (error) {
        res.send('error!');
    }
});
//list of foods
router.get("/foods", async (req, res) => {
    const foods = await Food.find({ user: req.params.userId });
    res.render("foods/index.ejs", {foods, userId: req.params.userId });
    console.log("route done!!!!!!");
});
//to add a new food
router.get("/new", (req, res) => {
  res.render("foods/new.ejs", { userId: req.params.userId });
});
//to edit food
router.get("/:foodId/edit", async (req, res) => {
  const foods = await Food.findById(req.params.foodId);
  res.render("foods/edit.ejs", {foods, userId: req.params.userId});
});

//to show single food  
router.get("/:foodId", async(req, res) => {
  const foods = await Food.findById(req.params.foodId);
  res.render("foods/show.ejs", {foods, userId: req.params.userId});
});

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const newFood= new Food({
            name:req.body.name,
            ingredients: req.body.ingredients,
            description:req.body.description,
            image: req.file ? req.file.filename : null,
            user: req.params.userId,
        });
        await newFood.save();//saveing the new food
        res.redirect(`/users/${req.params.userId}/foods`);
    } catch (error) {
        res.send('error found with adding a new food!!')
    }
});
//to delete
router.delete("/:foodId", async (req, res) => {
  await Food.findByIdAndDelete(req.params.foodId);
  res.redirect(`/users/${req.params.userId}/foods`);
});
//to update 
router.put("/:foodId", upload.single('image'), async (req, res) => {
  try {
    const updateFood ={
        name:req.body.name,
        ingredients:req.body.ingredients,
        description:req.body.description,
        image : req.file ? req.file.filename :null
    }
    await Food.findByIdAndUpdate(req.params.foodId, updateFood);
    res.redirect(`/users/${req.params.userId}/foods`);
  } catch (error) {
    res.send('error with updating !!')
  }
});

module.exports = router;
