import "dotenv/config";
import axios from 'axios';
import bcrypt from 'bcryptjs';

const USERS_FILMMAKER_SERVICE_URI = process.env.USERS_FILMMAKER_SERVICE_URI;
const USERS_3DARTIST_SERVICE_URI = process.env.USERS_3DARTIST_SERVICE_URI;
const SCENES_SERVICE_URI = process.env.SCENES_SERVICE_URI;
const BOOKINGS_SERVICE_URI = process.env.BOOKINGS_SERVICE_URI;


const user = async userId => {

  try {
    const user = await axios({
      method: 'get',
      url: USERS_3DARTIST_SERVICE_URI,
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

const userFilmmaker = async userId => {

  try {
    const user = await axios({
      method: 'get',
      url: USERS_FILMMAKER_SERVICE_URI,
      params: {
        FETCH_USER_BY_ID: true,
        id: userId,
      }
    });

    let userData = user.data;

    return {
      _id: userData._id,
      count: userData.count,
      email: userData.email,
      password: userData.password,
      bookedScenes: bookings.bind(this, userData.bookedScenes)
    }
  } catch (err) {
    throw err;
  }
}

const singleScenes = async sceneId => {

  if(sceneId.length < 1 || sceneId == undefined){
    console.log('empty')
    return 
  } else {
    try {
      const scene = await axios({
        method: 'get',
        url: SCENES_SERVICE_URI,
        params: {
          FETCH_SCENE_BY_ID: true,
          id: sceneId
        }
      })

      const result = scene.data;

      return {
        _id: result._id,
        name: result.name,
        description: result.description,
        creator: user.bind(this, result.creator)
      }
    } catch (err) {
      throw err;
    }
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

const bookings = async bookingIds => {

  if(bookingIds.length < 1 || bookingIds == undefined){
    console.log('empty')
    return 
  } else {
    try {
      const bookings = await axios({
        method: 'get',
        url: BOOKINGS_SERVICE_URI,
        params: {
          FETCH_BOOKINGS_BY_IDS: true,
          ids: bookingIds
        }
      })
  
      const a = bookings.data.map(async booking => {
        const bb = await booking.map(async result => {
          const bookingObject =  {
            _id: result._id,
            user: userFilmmaker.bind(this, result.user),
            scene: singleScenes.bind(this, result.scene),
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString(),
          }
          return bookingObject;
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

const updateUserBookedScenes = async (userFilmmakerId) => {
  const bookings = await axios({
    method: 'get',
    url: BOOKINGS_SERVICE_URI,
    params: {
      FETCH_BOOKINGS_BY_USER: true,
      user: userFilmmakerId
    }
  })
  const arrayBookings = bookings.data.map(booking => {
    return booking._id;
  })

  const updateBookedScenes = await axios({
    method: 'put',
    url: USERS_FILMMAKER_SERVICE_URI,
    data: {
      UPDATE_BOOKED_SCENES: true,
      id: userFilmmakerId,
      idArray: arrayBookings
    }
  })
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
    url: USERS_3DARTIST_SERVICE_URI,
    data: {
      UPDATE_CREATED_SCENES: true,
      id: userId,
      idArray: arrayScenes
    }
  })
}


const resolvers = {
  Query: {
    me3Dartist: async (_, __, { req }) => {
      if (!req.userId3Dartist) {
        console.log('Please Login')
        return null;
      }
      const user = await axios({
        method: 'get',
        url: USERS_3DARTIST_SERVICE_URI,
        params: {
          id: req.userId3Dartist,
          ME: true,
        }
      })
      return user.data;
    },
    meFilmmaker: async (_, __, { req }) => {

      if (!req.userIdFilmmaker) {
        console.log('Please Login')
        return null;
      }
      const user = await axios({
        method: 'get',
        url: USERS_FILMMAKER_SERVICE_URI,
        params: {
          id: req.userIdFilmmaker,
          ME: true,
        }
      })
      return user.data;
    },
    users3dartists: async (_, __, { req }) => {
      if (!req.userId3Dartist) {
        throw new Error('Unauthenticated');
      }

      try {
        const users = await axios({
          method: 'get',
          url: USERS_3DARTIST_SERVICE_URI,
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

    usersFilmmaker: async (_, __, { req }) => {
      if (!req.userIdFilmmaker) {
        throw new Error('Unauthenticated');
      }

      try {
        const users = await axios({
          method: 'get',
          url: USERS_FILMMAKER_SERVICE_URI,
          params: {
            FETCH_ALL_USERS: true
          }
        })

        const data = users.data.map(async result => {
          let userObject = {
            _id: result._id,
            count: result.count,
            bookedScenes: bookings.bind(this, result.bookedScenes),
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

    bookings: async (_, __, { req }) => {
      try {
        const bookings = await axios({
          method: 'get',
          url: BOOKINGS_SERVICE_URI,
          params: {
            FETCH_ALL_BOOKINGS: true
          }
        });
  
        const data = await bookings.data.map(async result => {
          const scene = await axios({
            method: 'get',
            url: SCENES_SERVICE_URI,
            params: {
              FETCH_SCENE_BY_ID: true,
              id: result.scene
            }
          });

          if (Object.keys(scene.data).length === 0) {
            console.log(`scene with ID:${result.scene} from bookingID: ${result._id} is missing`)
            return {
              _id: result._id,
              scene: null,
              user: userFilmmaker.bind(this, result.user),
              createdAt: new Date(result.createdAt).toISOString(),
              updatedAt: new Date(result.updatedAt).toISOString(),
            }
          }

          let sceneObject = {
            _id: result._id,
            scene: singleScenes.bind(this, result.scene),
            user: userFilmmaker.bind(this, result.user),
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString(),
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

    login3Dartist: async (_, { email, password }, {res}) => {
      const users = await axios({
        method: 'get',
        url: USERS_3DARTIST_SERVICE_URI,
        params: {
          LOGIN: true,
          email: email,
          password: password
        }
      }).then(result => {
        const refreshToken3Dartist = result.data.refreshToken3Dartist
        const accessToken3Dartist = result.data.accessToken3Dartist
        
        res.cookie("refresh-token-3Dartist", refreshToken3Dartist);
        res.cookie("access-token-3Dartist", accessToken3Dartist);

        return result.data
      });
      return users;
    },
    loginFilmmaker: async (_, { email, password }, {res}) => {
      const users = await axios({
        method: 'get',
        url: USERS_FILMMAKER_SERVICE_URI,
        params: {
          LOGIN: true,
          email: email,
          password: password
        }
      }).then(result => {
        const refreshTokenFilmmaker = result.data.refreshTokenFilmmaker
        const accessTokenFilmmaker = result.data.accessTokenFilmmaker
        
        res.cookie("refresh-token-Filmmaker", refreshTokenFilmmaker);
        res.cookie("access-token-Filmmaker", accessTokenFilmmaker);

        return result.data
      });
      return users;
    }
  },

  Mutation: {
    createUser3dartist: async (_, { email, password }) => {
      if (!email || !password) {
        return new Error("Invalid body!");
      }
      
      const passwordHashed = await bcrypt.hash(password, 12)
        .then(result => { return result })
        .catch(err => { throw err })

      const user = await axios({
        method: 'post',
        url: USERS_3DARTIST_SERVICE_URI,
        data: {
          CREATE_USER: true,
          email: email,
          passwordHashed: passwordHashed
        }
      })
      return user.data;
    },
    createUserFilmmaker: async (_, { email, password }) => {
      if (!email || !password) {
        return new Error("Invalid body!");
      }
      
      const passwordHashed = await bcrypt.hash(password, 12)
        .then(result => { return result })
        .catch(err => { throw err })

      const user = await axios({
        method: 'post',
        url: USERS_FILMMAKER_SERVICE_URI,
        data: {
          CREATE_USER: true,
          email: email,
          passwordHashed: passwordHashed
        }
      })
      return user.data;
    },
    createScene: async (_, { name, description }, {req}) => {

      if (!req.userId3Dartist) {
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
            creator: req.userId3Dartist
          }
        })

        updateUserCreatedScenes(req.userId3Dartist);

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

    bookScene: async (_, { sceneId }, {req}) => {
      if (!req.userIdFilmmaker) {
        throw new Error('Unauthenticated with filmmaker account');
      }      
      try {
        const scene = await axios({
          method: 'get',
          url: SCENES_SERVICE_URI,
          params: {
            FETCH_SCENE_BY_ID: true,
            id: sceneId
          }
        });

        const checkBooking = await axios({
          method: 'get',
          url: BOOKINGS_SERVICE_URI,
          params: {
            FETCH_BOOKING_BY_SCENE_ID: true,
            id: sceneId
          }
        });

        const sceneBooked = checkBooking.data.scene;

        console.log(sceneBooked)
        
        if (sceneBooked) {
          throw new Error('you already booked this scene');
        }

        const booking = await axios({
          method: 'post',
          url: BOOKINGS_SERVICE_URI,
          data: {
            CREATE_BOOKING: true,
            user: req.userIdFilmmaker,
            scene: scene.data,
          }
        });
        
        updateUserBookedScenes(req.userIdFilmmaker);

        let result = booking.data;
        
        return {
          _id: result._id,
          user: userFilmmaker.bind(this, result.user),
          scene: singleScenes.bind(this, result.scene),
          createdAt: new Date(result.createdAt).toISOString(),
          updatedAt: new Date(result.updatedAt).toISOString(),
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    cancelBooking: async (_, { bookingId }, {req}) => {
      if (!req.userIdFilmmaker) {
        throw new Error('Unauthenticated with filmmaker account');
      }
      
      try {
        const booking = await axios({
          method: 'get',
          url: BOOKINGS_SERVICE_URI,
          params: {
            FETCH_BOOKING_BY_ID: true,
            id: bookingId
          }
        });

        if (Object.keys(booking.data).length === 0) {
          throw new Error('No such booking');
        }

        const deleteBookingItem = await axios({
          method: 'delete',
          url: BOOKINGS_SERVICE_URI,
          params: {
            CANCEL_BOOKING: true,
            user: req.userIdFilmmaker,
            bookingId: bookingId,
          }
        });

        updateUserBookedScenes(req.userIdFilmmaker);

        const sceneId = booking.data.scene;

        const scene = await axios({
          method: 'get',
          url: SCENES_SERVICE_URI,
          params: {
            FETCH_SCENE_BY_ID: true,
            id: sceneId
          }
        });

        const result = scene.data;

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

    invalidateTokens3Dartist: async (_, __, { req, res }) => {
      if (!req.userId3Dartist) {
        return false;
      }

      const user = await axios({
        method: 'get',
        url: USERS_3DARTIST_SERVICE_URI,
        params: {
          id: req.userId3Dartist,
          INVALIDATE_TOKENS: true,
        }
      }).then(result => {
        return result.data
      })

      res.clearCookie('access-token-3Dartist')
      res.clearCookie('refresh-token-3Dartist')

      return user;
    },
    invalidateTokensFilmmaker: async (_, __, { req, res }) => {
      if (!req.userIdFilmmaker) {
        return false;
      }
  
      const user = await axios({
        method: 'get',
        url: USERS_FILMMAKER_SERVICE_URI,
        params: {
          id: req.userIdFilmmaker,
          INVALIDATE_TOKENS: true,
        }
      }).then(result => {
        return result.data
      })
  
      res.clearCookie('access-token-Filmmaker')
      res.clearCookie('refresh-token-Filmmaker')
  
      return user;
    }
  },
};

export default resolvers;