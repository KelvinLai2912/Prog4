const pool = require('../util/mysql-db');
const logger = require('../util/utils').logger;
const assert = require('assert');


const userController = {
  getAllUsers: (req, res, next) => {
    logger.info('Get all users');
    let sqlStatement = 'SELECT * FROM `user`'

    pool.getConnection(function (err, conn) {
        if (err) {
          logger.error(err.message)
          next({
            status: 500,
            message: 'Failed to connect to the database' 
          })
        }
        if (conn) {
          conn.query(sqlStatement, function (err, results, fields) {
            if (err) {
              logger.err(err.message)
              next({
                status: 500,
                message: 'Failed to retrieve user data'
              })
            }
            if (results) {
              logger.info('Found', results.length, 'results');
              res.status(200).json({
                status: 200,
                message: 'User data endpoint',
                data: results
              })
            }
          })
          pool.releaseConnection(conn);
        }
    });
  },

  createUser: (req, res) => {
    logger.info('Register user');
  
    const user = req.body;
    logger.debug('user = ', user);
  
    try {
      // Validation
      assert(user.firstName && typeof user.firstName === 'string' && user.firstName.trim().length > 0 , 'Required field missing')
      assert(user.lastName && typeof user.lastName === 'string' && user.lastName.trim().length > 0 , 'Required field missing')

  
      // Email address validation
      assert(typeof user.emailAdress === 'string', 'emailAdress must be a string')
      assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.emailAdress), 'emailAdress is not valid')
  
      // Password validation
      assert(typeof user.password === 'string', 'password must be a string')
      // assert(user.password.length >= 8, 'password must be at least 8 characters long')
      // assert(/[a-z]/i.test(user.password), 'password must contain at least one letter')
      // assert(/[0-9]/.test(user.password), 'password must contain at least one number')
      // assert(/[^a-z0-9]/i.test(user.password), 'password must contain at least one special character')
  
      pool.query('SELECT * FROM `user` WHERE `emailAdress` = ?', [user.emailAdress], (err, result) => {
        if (err) {
          logger.error(err.message);
          res.status(500).json({ 
            status: 500, 
            message: 'Failed to search for emailAdress in the database' 
          });
          return;
        }   
  
        try {
          assert(result.length === 0, 'User already exists')
          const sqlStatement = 'INSERT INTO `user` SET ?'
          pool.getConnection((err, conn) => {
            if (err) {
              logger.error(err.message);
              res.status(500).json({ 
                status: 500, 
                message: 'Failed to connect to the database' 
              });
              return;
            }
  
            conn.query(sqlStatement, user, (err, result) => {
              if (err) {
                logger.error(err.message);
                res.status(500).json({ 
                  status: 500, 
                  message: 'Failed to insert user data into the database' 
                });
                return;
              }
  
              user.id = result.insertId;
              logger.info('User registered successfully with ID:', result.insertId)
              res.status(201).json({ 
                status: 201, 
                message: 'Successfully registered user', 
                data: user 
              });
            })
            pool.releaseConnection(conn);
          });
        } catch (err) {
          logger.warn(err.message)
          res.status(403).json({
            status: 403,
            message: err.message // this is the assert message: the user/email already exists
          });
          return;
        }
      });
    } catch (err) {
      logger.warn(err.message)
      res.status(400).json({
        status: 400,
        message: err.message // this is the assert message
      });
      return;
    }
  },
  
  getUserProfile: (req, res) => {
    res.status(501).json({
      status: 501,
      message: "Deze functionaliteit is nog niet geimplemnteerd",
      data: {}
    });
  },

  getUserById: (req, res) => {
    const userId = parseInt(req.params.userId);
    let sqlStatement = 'SELECT * FROM `user` WHERE id = ?';
    pool.getConnection((err, conn) => {
      if (err) {
        logger.error(err.message);
        res.status(500).json({
          status: 500,
          message: 'Failed to connect to the database'
        });
        return;
      }

      conn.query(sqlStatement, [userId], (err, results) => {
        pool.releaseConnection(conn);
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            status: 500,
            message: 'Failed to retrieve user'
          });
          return;
        }

        if (results.length > 0) {
          res.status(200).json({
            status: 200,
            message: `User with id ${userId} found`,
            data: results[0]
          });
        } else {
          res.status(404).json({
            status: 404,
            message: `User with id ${userId} not found`,
            data: {}
          });
        }
      });
    });
  },


  updateUser: (req, res) => {
    const userId = parseInt(req.params.userId);
    const updatedUser = req.body;
    logger.info(`Update user with id ${userId}`);

    if (!updatedUser.emailAdress) {
      res.status(400).json({
        status: 400,
        message: 'Required field "emailAdress" is missing'
      });
      return;
    }
    
    let sqlStatement = 'UPDATE `user` SET ? WHERE `id` = ?';
    pool.getConnection((err, conn) => {
      if (err) {
        logger.error(err.message);
        res.status(500).json({
          status: 500,
          message: 'Failed to connect to the database'
        });
        return;
      }
  
      conn.query(sqlStatement, [updatedUser, userId], (err, results) => {
        pool.releaseConnection(conn);
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            status: 500,
            message: 'Failed to update user'
          });
          return;
        }
  
        if (results.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `User with id ${userId} has been updated`,
            data: updatedUser
          });
        } else {
          res.status(404).json({
            status: 404,
            message: `User with id ${userId} not found`,
            data: {}
          });
        }
      });
    });
  },
  

  deleteUser: (req, res) => {
    const userId = parseInt(req.params.userId);
    logger.info(`Delete user with id ${userId}`);

    let sqlStatement = 'DELETE FROM `user` WHERE id = ?';
    pool.getConnection((err, conn) => {
      if (err) {
        logger.error(err.message);
        res.status(500).json({
          status: 500,
          message: 'Failed to connect to the database'
        });
        return;
      }

      conn.query(sqlStatement, [userId], (err, results) => {
        pool.releaseConnection(conn);
        if (err) {
          logger.error(err.message);
          res.status(500).json({
            status: 500,
            message: 'Failed to delete user'
          });
          return;
        }

        if (results.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `User with id ${userId} has been deleted`,
            data: {}
          });
        } else {
          res.status(404).json({
            status: 404,
            message: `User with id ${userId} not found`,
            data: {}
          });
        }
      });
    });
  }
};


module.exports = userController;





// // Bij de user kan je nu filteren
// app.get('/api/user', (req, res) => {

//   const querryField = Object.entries(req.query);
//   console.log(`Dit is field1 ${querryField[0][0]} = ${querryField[0][1]}`);
  
//   res.status(200).json({
//     status: 200,
//     message: `Gefilterd op...`,
//     data: {},
//   });
// });

