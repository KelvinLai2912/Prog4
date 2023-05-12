const pool = require('../util/mysql-db');
const logger = require('../util/utils').logger;
const assert = require('assert');

const mealController = {
    getAllMeals: (req, res, next) => {
        logger.info('Get all meals');
        let sqlStatement = 'SELECT * FROM `meal`'
    
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
                    message: 'Failed to retrieve meal data'
                  })
                }
                if (results) {
                  logger.info('Found', results.length, 'results');
                  res.status(200).json({
                    status: 200,
                    message: 'Meal data endpoint',
                    data: results
                  })
                }
              })
              pool.releaseConnection(conn);
            }
        });
      },
      
    getMealById: (req, res) => {
            const mealId = parseInt(req.params.mealId);
            let sqlStatement = 'SELECT * FROM `meal` WHERE id = ?';
            pool.getConnection((err, conn) => {
              if (err) {
                logger.error(err.message);
                res.status(500).json({
                  status: 500,
                  message: 'Failed to connect to the database'
                });
                return;
              }
        
              conn.query(sqlStatement, [mealId], (err, results) => {
                pool.releaseConnection(conn);
                if (err) {
                  logger.error(err.message);
                  res.status(500).json({
                    status: 500,
                    message: 'Failed to retrieve meal'
                  });
                  return;
                }
        
                if (results.length > 0) {
                  res.status(200).json({
                    status: 200,
                    message: `meal with id ${mealId} found`,
                    data: results[0]
                  });
                } else {
                  res.status(404).json({
                    status: 404,
                    message: `meal with id ${mealId} not found`,
                    data: {}
                  });
                }
              });
            });
      },


    createMeal: (req, res) => {
         logger.info('Register meal');
         
      },


    updateMeal: (req, res) => {

  },
  

    deleteMeal: (req, res) => {

  } 
    
};




module.exports = mealController;
