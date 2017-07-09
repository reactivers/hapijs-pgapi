/**
 * Created by Utku on 28/02/2017.
 */
const Hapi = require('hapi');
const PostgresDriver = require('hapi-postgres-connection');
const AsyncHandler = require('hapi-async-handler');
const Good = require('good');
const customHandlers = require('./src/routeHandlers/handlers');
const server = new Hapi.Server();
server.connection({port: 4000});
/*--------------------------Query ROUTES-----------------------*/
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file("./ui/build/index.html")
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/static/css/main.5240760a.css',
    handler: function (request, reply) {
        reply.file("./ui/build/static/css/main.5240760a.css")
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/static/js/main.b67634fd.js',
    handler: function (request, reply) {
        reply.file("ui/build/static/js/main.b67634fd.js")
    }
})
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/queries',
    handler: function (request, reply) {
        customHandlers.listAllQueries(request, reply);
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/queries/{queryName}',
    handler: function (request, reply) {
        customHandlers.getQuery(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'POST',
    path: '/queries',
    handler: function (request, reply) {
        customHandlers.createNewQuery(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'POST',
    path: '/runquery/{queryName}',
    handler: function (request, reply) {
        customHandlers.runQuery(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'PUT',
    path: '/queries/{queryName}',
    handler: function (request, reply) {
        customHandlers.updateQuery(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'DELETE',
    path: '/queries/{queryName}',
    handler: function (request, reply) {
        customHandlers.deleteQuery(request, reply)
    }
});
/*--------------------------Form ROUTES-----------------------*/
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/forms',
    handler: function (request, reply) {
        customHandlers.listAllForms(request, reply);
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/forms/{formName}',
    handler: function (request, reply) {
        customHandlers.getForm(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'POST',
    path: '/forms',
    handler: function (request, reply) {
        customHandlers.createNewForm(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'PUT',
    path: '/forms/{formName}',
    handler: function (request, reply) {
        customHandlers.updateForm(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'DELETE',
    path: '/forms/{formName}',
    handler: function (request, reply) {
        customHandlers.deleteForm(request, reply)
    }
});
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'POST',
    path: '/runform/{formName}',
    handler: function (request, reply) {
        customHandlers.runForm(request, reply)
    }
});
server.register([{
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    },
},{ register: PostgresDriver},{register : AsyncHandler},{register : require('inert')}], (err) => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log("Server " + server.info.uri + " adresinde ve " + server.info.port + " portunda çalışıyor.");
    });
});
