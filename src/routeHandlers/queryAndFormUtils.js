/**
 * Created by Utku on 07/03/2017.
 */
const getQueryResult = function (request, query, params) {
    return new Promise(function (resolve, reject) {
        request.pg.client.query(query, [...params], function (err, result) {
            try {
                resolve(result.rows)
            } catch (err) {
                reject(err)
            }
        })
    })
}
const modifyQuery = function (queryText, params) {
    let paramKeys = []
    let splittedQuery = queryText.split(' ');
    let allParams = splittedQuery.filter((i1) => i1.includes('#'))
    allParams.map((i1) => {
        paramKeys.push(i1.split("'")[1])
    })
    splittedQuery.map((i1, index) => {
        if (i1.includes("=") && i1.includes("#")) {
            if (params[i1.split("'")[1]] != null || params[i1.split("'")[1]] != undefined || params[i1.split("'")[1]])
                splittedQuery[index] = i1.split("=")[0] + "='" + params[i1.split("'")[1]] + "'";
            else {
                throw i1.split("'")[1] + " parametresi eksik!"
            }

        }
    })
    return splittedQuery.join(" ")
}
const createInsertQuery = function (formFields, payload, tableAndSchema) {
    let insertQuery = "INSERT INTO " + tableAndSchema + "(";
    let valuePart = "VALUES(";
    formFields.map((field, index) => {
        insertQuery = insertQuery + field.column_name + ",";
        if (payload.formValues[field.column_name] != null) {
            if (typeof payload.formValues[field.column_name] == "object") {
                if (!JSON.stringify(payload.formValues[field.column_name]).includes("{")) {
                    valuePart = valuePart + "'" + JSON.stringify(payload.formValues[field.column_name]).replace(/\[/g, '{').replace(/\]/g, '}') + "'" + ","
                }
                else {
                    valuePart = valuePart + "'" + JSON.stringify(payload.formValues[field.column_name]) + "'" + ","
                }
            } else {
                valuePart = valuePart + "'" + payload.formValues[field.column_name] + "'" + ",";
            }
        }
        else {
            if (field.is_nullable == "YES")
                valuePart = valuePart + "null,";
            else {
                valuePart = valuePart + "DEFAULT,";
            }
        }
    });
    insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ") ";
    valuePart = valuePart.slice(0, valuePart.length - 1) + ")";
    insertQuery = insertQuery + valuePart;
    return insertQuery;
}
/*var getColumnInfo = function (request, tableNames, columnNames) {
 let dolarIn = 1
 let sqlColumnInfo = "SELECT data_type,column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE ";
 if (tableNames.length == 1) {
 sqlColumnInfo = "SELECT data_type,column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=$1 AND";
 }
 else {
 for (var j = 0; j < tableNames.length; j++) {
 if (j = 0) {
 sqlColumnInfo = sqlColumnInfo + "(TABLE_NAME=$" + dolarIn
 dolarIn++
 }
 else if (j == tableNames.length - 1) {
 sqlColumnInfo = sqlColumnInfo + " OR TABLE_NAME=$" + dolarIn + ") AND"
 dolarIn++
 }
 else {
 sqlColumnInfo = sqlColumnInfo + " OR TABLE_NAME=$" + dolarIn
 dolarIn++
 }
 }
 }
 for (var i = 0; i < columnNames.length; i++) {
 if (i == 0) {
 sqlColumnInfo = sqlColumnInfo + " (COLUMN_NAME=$" + dolarIn
 dolarIn++
 }
 else if (i == columnNames.length - 1) {
 sqlColumnInfo = sqlColumnInfo + " OR COLUMN_NAME=$" + dolarIn + ")"
 dolarIn++
 }
 else{
 sqlColumnInfo = sqlColumnInfo + " OR COLUMN_NAME=$" + dolarIn
 dolarIn++
 }
 }
 console.log(sqlColumnInfo)
 return new Promise(function (resolve, reject) {
 request.pg.client.query(sqlColumnInfo, [...tableNames, ...columnNames], function (err, result) {
 try {
 console.log('RESULT', result.rows)
 } catch (err) {
 reject(err)
 }
 })
 })
 };*/

exports.getQueryResult = getQueryResult;
exports.modifyQuery = modifyQuery;
exports.createInsertQuery = createInsertQuery;