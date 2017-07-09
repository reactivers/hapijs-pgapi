/**
 * Created by Utku on 07/03/2017.
 */
const utils = require('./queryAndFormUtils');
const sqlTableColumns = "SELECT column_name,data_type,is_nullable from information_schema.columns where table_name=$1 and table_schema=$2"
const listAllForms = function (request, reply) {
    const sqlSelectAllQueries = 'SELECT * FROM queries.form_table';
    request.pg.client.query(sqlSelectAllQueries, function (err, result) {
        reply(result.rows);
    })
};
const getForm = function (request, reply) {
    const sqlGetFormByName = 'SELECT * FROM queries.form_table WHERE form_name=$1';
    request.pg.client.query(sqlGetFormByName, [request.params.formName], function (err, result) {
        if (err) {
            reply(err.stack)
        } else {
            reply(result.rows)
        }
    })
};
const updateForm = function (request, reply) {
    utils.getQueryResult(request, "SELECT * from queries.form_table WHERE form_name=$1", [request.params.formName]).then(function (selectResult) {
        const sqlUpdateForm = `UPDATE queries.form_table SET form_name='${request.payload.form_name || selectResult[0].form_name}',table_and_schema='${request.payload.table_and_schema || selectResult[0].table_and_schema}',form_fields='${JSON.stringify(request.payload.form_fields) || selectResult[0].form_fields}' WHERE form_name='${request.params.formName}' RETURNING form_name`;
        request.pg.client.query(sqlUpdateForm, function (err, result) {
            if (err) {
                reply(err.stack)
            } else {
                reply(result.rows)
            }
        })
    })
};
const deleteForm = function (request, reply) {
    const sqlDeleteForm = "DELETE FROM queries.form_table WHERE form_name=$1";
    request.pg.client.query(sqlDeleteForm, [request.params.formName], function (err, result) {
        if (err) {
            reply(err.stack)
        } else {
            reply("Deleted!")
        }
    })
};
const createNewForm = function (request, reply) {
    const sqlCreateForm = "INSERT INTO queries.form_table(form_name,form_fields,table_and_schema) VALUES ($1,$2,$3) RETURNING form_name";
    utils.getQueryResult(request,sqlTableColumns,[ (request.payload.table_and_schema).split(".")[1],(request.payload.table_and_schema).split(".")[0]]).then(function(res){

        request.pg.client.query(sqlCreateForm, [request.payload.form_name, JSON.stringify(res),request.payload.table_and_schema], function (err, result) {
            if (err) {
                reply(err.stack)
            } else {
                reply(result.rows)
            }
        })
    })
};
const runForm = function (request, reply) {
    const sqlGetQueryByName = "SELECT * FROM queries.form_table WHERE form_name=$1";
    utils.getQueryResult(request, sqlGetQueryByName, [request.params.formName]).then(function (res) {
        request.pg.client.query(utils.createInsertQuery(res[0].form_fields, request.payload,res[0].table_and_schema), function (err, result) {
            if(err){
                reply(err.stack)
            }else{
                reply("Inserted !")
            }
        })
    });
};
exports.listAllForms = listAllForms;
exports.getForm = getForm;
exports.updateForm = updateForm;
exports.deleteForm = deleteForm;
exports.createNewForm = createNewForm;
exports.runForm = runForm;