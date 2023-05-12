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
    
};

module.exports = mealController;
