import "dotenv/config";
import axios from 'axios';
import bcrypt from 'bcryptjs';

const USERS_SERVICE_URI = process.env.USERS_SERVICE_URI;
const SCENES_SERVICE_URI = process.env.SCENES_SERVICE_URI;

const user = async userId => {

  try {
    const user = await axios({
      method: 'get',
      url: USERS_SERVICE_URI,
      params: {
        FETCH_USER_BY_ID: true,
        id: userId,
      }
    });

    let userData = user.data;

    return {
      _id: userData._id,
      count: userData.count,
      createdScenes: scenes.bind(this, userData.createdScenes),
      email: userData.email,
      password: userData.password
    }
  } catch (err) {
    throw err;
  }
}


const scenes = async sceneIds => {

  if(sceneIds.length < 1 || sceneIds == undefined){
    console.log('empty')
    return 
  } else {
    try {
      const scenes = await axios({
        method: 'get',
        url: SCENES_SERVICE_URI,
        params: {
          FETCH_SCENES_BY_IDS: true,
          ids: sceneIds
        }
      })
  
      const a = scenes.data.map(async scene => {
        const bb = await scene.map(async result => {
          const sceneObject =  {
            _id: result._id,
            name: result.name,
            description: result.description,
            creator: user.bind(this, result.creator)
          }
          return sceneObject;
        })
        const results = await Promise.all(bb)
        return results;
      })
      const results = await Promise.all(a)
      return results[0];
    } catch (err) {
      throw err;
    }
  }
}


const updateUserCreatedScenes = async (userId) => {
  const scenes = await axios({
    method: 'get',
    url: SCENES_SERVICE_URI,
    params: {
      FETCH_SCENES_BY_CREATOR: true,
      creator: userId
    }
  })
  const arrayScenes = scenes.data.map(scene => {
    return scene._id;
  })
  const updateCreatedScenes = await axios({
    method: 'put',
    url: USERS_SERVICE_URI,
    data: {
      UPDATE_CREATED_SCENES: true,
      id: userId,
      idArray: arrayScenes
    }
  })
}


const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.userId) {
        console.log('Please Login')
        return null;
      }
      const user = await axios({
        method: 'get',
        url: USERS_SERVICE_URI,
        params: {
          id: req.userId,
          ME: true,
        }
      })
      return user.data;
    },
    users: async (_, __, { req }) => {
      if (!req.userId) {
        throw new Error('Unauthenticated');
      }

      try {
        const users = await axios({
          method: 'get',
          url: USERS_SERVICE_URI,
          params: {
            FETCH_ALL_USERS: true
          }
        })

        updateUserCreatedScenes(req.userId);

        const data = users.data.map(async result => {
          let userObject = {
            _id: result._id,
            count: result.count,
            createdScenes: scenes.bind(this, result.createdScenes),
            email: result.email,
            password: result.password
          }

          return userObject;
        })

        const results = await Promise.all(data);
        return results;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },


    scenes: async (_, __, { req }) => {
      try {
        const scenes = await axios({
          method: 'get',
          url: SCENES_SERVICE_URI,
          params: {
            FETCH_ALL_SCENES: true
          }
        })
  
        const data = await scenes.data.map(async result => {
          let sceneObject = {
            _id: result._id,
            name: result.name,
            description: result.description,
            creator: user.bind(this, result.creator)
          }
          return sceneObject
        })
        const results = await Promise.all(data)
        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    login: async (_, { email, password }, {res}) => {
      const users = await axios({
        method: 'get',
        url: USERS_SERVICE_URI,
        params: {
          LOGIN: true,
          email: email,
          password: password
        }
      }).then(result => {
        const refreshToken = result.data.refreshToken
        const accessToken = result.data.accessToken
        
        res.cookie("refresh-token", refreshToken);
        res.cookie("access-token", accessToken);

        return result.data
      });
      return users;
    }
  },

  Mutation: {
    createUser: async (_, { email, password }) => {
      if (!email || !password) {
        return new Error("Invalid body!");
      }
      
      const passwordHashed = await bcrypt.hash(password, 12)
        .then(result => { return result })
        .catch(err => { throw err })

      const user = await axios({
        method: 'post',
        url: USERS_SERVICE_URI,
        data: {
          CREATE_USER: true,
          email: email,
          passwordHashed: passwordHashed
        }
      })
      return user.data;
    },
    createScene: async (_, { name, description }, {req}) => {
      if (!req.userId) {
        throw new Error('Unauthenticated');
      }
      
      try {
        const scene = await axios({
          method: 'post',
          url: SCENES_SERVICE_URI,
          data: {
            CREATE_SCENE: true,
            name: name,
            description: description,
            creator: req.userId
          }
        })

        updateUserCreatedScenes(req.userId);

        let result = scene.data;
        
        return {
          _id: result._id,
          name: result.name,
          description: result.description,
          creator: user.bind(this, result.creator)
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    invalidateTokens: async (_, __, { req, res }) => {
      if (!req.userId) {
        return false;
      }

      const user = await axios({
        method: 'get',
        url: USERS_SERVICE_URI,
        params: {
          id: req.userId,
          INVALIDATE_TOKENS: true,
        }
      }).then(result => {
        return result.data
      })

      res.clearCookie('access-token')
      res.clearCookie('refresh-token')

      return user;
    }
  },
};

export default resolvers;