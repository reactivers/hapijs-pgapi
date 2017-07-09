/**
 * Created by Utku on 07/03/2017.
 */
const utils = require('./queryAndFormUtils');
const listAllQueries = function (request, reply) {
    const sqlSelectAllQueries = 'SELECT * FROM queries.query_table';
    request.pg.client.query(sqlSelectAllQueries, function (err, result) {
        reply(result.rows);
    })
};
const getQuery = function (request, reply) {
    const sqlGetQueryByName = 'SELECT * FROM queries.query_table WHERE query_name=$1';
    request.pg.client.query(sqlGetQueryByName, [request.params.queryName], function (err, result) {
        if (err) {
            reply(err.stack)
        } else {
            reply(result.rows)
        }
    })
};
const updateQuery = function (request, reply) {
    utils.getQueryResult(request, "SELECT * from queries.query_table WHERE query_name=$1", [request.params.queryName]).then(function (selectResult) {
        const sqlCreateQuery = `UPDATE queries.query_table SET query_name='${request.payload.query_name || selectResult[0].query_name}',query_text='${(request.payload.query_text).replace(/'/g, "''") || selectResult[0].query_text}' WHERE query_name='${request.params.queryName}' RETURNING query_name`;

        request.pg.client.query(sqlCreateQuery, function (err, result) {
            if (err) {
                reply(err.stack)
            } else {
                reply(result.rows)
            }
        })
    })
};
const deleteQuery = function (request, reply) {
    const sqlCreateQuery = "DELETE FROM queries.query_table WHERE query_name=$1";
    request.pg.client.query(sqlCreateQuery, [request.params.queryName], function (err, result) {
        if (err) {
            reply(err.stack)
        } else {
            reply("Deleted!")
        }
    })
};
const createNewQuery = function (request, reply) {
    const sqlCreateQuery = "INSERT INTO queries.query_table(query_name,query_text) VALUES ($1,$2) RETURNING query_name";
    request.pg.client.query(sqlCreateQuery, [request.payload.query_name, (request.payload.query_text).replace(/'/g, "''")], function (err, result) {
        if (err) {
            reply(err.stack)
        } else {
            reply(result.rows)
        }
    })
};
const runQuery = function (request, reply) {
    const sqlGetQueryByName = "SELECT * FROM queries.query_table WHERE query_name=$1";
    utils.getQueryResult(request, sqlGetQueryByName, [request.params.queryName]).then(function (res) {
        try{
            utils.getQueryResult(request,utils.modifyQuery(res[0].query_text, request.payload),[]).then(function (res) {
                if(res.length == 1)
                    reply(res[0])
                else
                    reply(res)
            })
        }catch (err){
            reply(err)
        }
    });
};

exports.listAllQueries = listAllQueries;
exports.getQuery = getQuery;
exports.updateQuery = updateQuery;
exports.deleteQuery = deleteQuery;
exports.createNewQuery = createNewQuery;
exports.runQuery = runQuery;