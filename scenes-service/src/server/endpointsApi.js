import "dotenv/config";
const Scene = require('../models/scene');


const endpointsApi = app => {
  app.get('/', async (req, res, next) => {
    // FETCH_SCENES_BY_IDS
    const FETCH_SCENES_BY_IDS = await req.query.FETCH_SCENES_BY_IDS;
    const creator_fetchScenesByIds = await req.query.ids;
    if (FETCH_SCENES_BY_IDS && creator_fetchScenesByIds) {

      const obtainedScene = creator_fetchScenesByIds.map(async result => {
        const scenes = await Scene.find({ _id: { $in: creator_fetchScenesByIds } });
        return scenes;
      });
      const results = await Promise.all(obtainedScene)
      return res.send(results);
    }
    //_________________________________________________//



    // FETCH_SCENES_BY_CREATOR
    const FETCH_SCENES_BY_CREATOR = await req.query.FETCH_SCENES_BY_CREATOR;
    const creator_fetchScenesByCreator = await req.query.creator;
    
    if (FETCH_SCENES_BY_CREATOR && creator_fetchScenesByCreator) {
      const obtainedScene = await Scene.find({ creator: creator_fetchScenesByCreator });
      return res.send(obtainedScene);
    }
    //_________________________________________________//



    // FETCH_ALL_SCENES
    const FETCH_ALL_SCENES = await req.query.FETCH_ALL_SCENES;
    if (FETCH_ALL_SCENES) {
      const obtainedScene = await Scene.find();
      return res.send(obtainedScene.map(scenes => {
        return scenes;
      }))
    }
    //_________________________________________________//
  });
  app.post('/', async (req, res, next) => {
    // CREATE_SCENE
    const CREATE_SCENE = await req.body.CREATE_SCENE;
    const name_createScene = await req.body.name;
    const description_createScene = await req.body.description;
    const creator_createScene = await req.body.creator;
    if (CREATE_SCENE && name_createScene && description_createScene && creator_createScene) {
      try {
        const scene = await new Scene({
          name: name_createScene,
          description: description_createScene,
          creator: creator_createScene
        });
        const result = await scene.save();
        return res.send({...result._doc});
      } catch (error) {
        throw error;
      }
    }
    //_________________________________________________//  
  });
};

export default endpointsApi;