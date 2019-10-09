const Recipe = require('./models/recipe');
const Step = require('./models/step');
const extractFile = require('./middleware/file');

const express = require('express');
const router = express.Router();

router.post('', (req,res,next) => {
  const recipe = new Recipe({
    name: req.body.name
  });
  console.log(recipe);
  recipe.save().then(createdRecipe => {
    res.status(201).json({
      message: 'Recipe added Successfully',
      recipe: {
        id: recipe._id,
        name: recipe.name
      }
    });
  });
})

router.post('/step',extractFile, (req,res,next) => {
  const url = req.protocol+ '://' + req.get('host');
  const vlink = req.body.videoLink === 'null' ? '' : req.body.videoLink;
  const recipeStep = new Step({
    recipeId: req.body.recipeId,
    title: req.body.title,
    description: req.body.description,
    imagePath: url + '/images/' + req.file.filename,
    videoLink: vlink,
    timer: +req.body.timer
  });
  console.log(recipeStep);
  recipeStep.save().then(stepAdded =>{
    res.status(201).json({
      message: 'Step added Successfully',
      recipeStep: recipeStep
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Adding step failed!"
    });
  });
});

router.get('/recipeList', (req,res,next) => {
  const recipeQuery = Recipe.find();
  const stepQuery = Step.find();
  let fetchedRecipes;
  let fetchedSteps;
  let message;
  let recipeCount;
  recipeQuery.then(documents => {
    fetchedRecipes = documents;
      return Recipe.countDocuments();
    }).then(count => {
        message = 'Recipes fetched successfully',
        recipeCount = count,
        stepQuery.then(documents => {
          fetchedSteps = documents;
          message = message + 'Steps fetched successfully';
          res.status(200).json({
            message: message,
            recipes: fetchedRecipes,
            steps: fetchedSteps,
            recipeCount: recipeCount
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Fetching steps failed!'
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching recipes failed!'
    });
  });
});

router.get("/recipe/:id", (req, res, next) =>{
  Recipe.findById(req.params.id).then(recipe =>{
    if(recipe){
      res.status(200).json(recipe);
    } else {
      res.status(404).json({message: 'Recipe not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching recipe failed!'
    });
  });
});

router.get("/step/:id", (req, res, next) =>{
  Step.findById(req.params.id).then(step =>{
    if(step){
      res.status(200).json(step);
    } else {
      res.status(404).json({message: 'Step not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching step failed!'
    });
  });
});

router.delete('/recipe/:id',(req,res,next) => {
  console.log(req.params);
  Step.deleteMany({recipeId: req.params.id}).then(() => {
    Recipe.deleteOne({_id: req.params.id}).then(() => {
        res.status(200).json({message: "Deletion Successful!"});
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting recipe failed!'
    });
  });
});

router.delete('/step/:id',(req,res,next) => {
  console.log(req.params);
  Step.deleteOne({_id: req.params.id}).then(() => {
      res.status(200).json({message: "Deletion step Successful!"});
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting step failed!'
    });
  });
});

router.put('/updateRecipe/:id', (req, res, next) => {
  const recipe = new Recipe({
    _id: req.body.id,
    name: req.body.name
  });
  Recipe.updateOne({_id: req.params.id}, recipe).then(result => {
      res.status(200).json({message: "Update Successful!"});
  })
  .catch(error => {
    res.status(500).json({
      message: `Couldn't update recipe name!`
    })
  });
});

router.put('/updateStep/:id',extractFile, (req, res, next) => {
  console.log(req.body);
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const step = new Step({
    _id: req.body.stepId,
    recipeId: req.body.recipeId,
    title: req.body.title,
    description: req.body.description,
    imagePath: imagePath,
    videoLink: req.body.videoLink,
    timer: req.body.timer
  });
  Step.updateOne({_id: req.params.id}, step).then(result => {
      res.status(200).json({message: "Update Successful!"});
  })
  .catch(error => {
    res.status(500).json({
      message: `Couldn't update the step details!`
    })
  });
});

module.exports = router;
