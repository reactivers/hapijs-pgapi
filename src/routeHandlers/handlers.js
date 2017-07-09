/**
 * Created by Utku on 28/02/2017.
 */
const queryHandlers = require('./queryHandlers');
const formHandlers = require('./formHandlers');

/*--------------------------QUERIES HANDLERS-----------------------*/
exports.listAllQueries = queryHandlers.listAllQueries;
exports.getQuery = queryHandlers.getQuery;
exports.updateQuery = queryHandlers.updateQuery;
exports.deleteQuery = queryHandlers.deleteQuery;
exports.createNewQuery = queryHandlers.createNewQuery;
exports.runQuery = queryHandlers.runQuery;
/*--------------------------FORM HANDLERS--------------------------*/
exports.listAllForms = formHandlers.listAllForms;
exports.getForm = formHandlers.getForm;
exports.updateForm = formHandlers.updateForm;
exports.deleteForm = formHandlers.deleteForm;
exports.createNewForm = formHandlers.createNewForm;
exports.runForm = formHandlers.runForm;