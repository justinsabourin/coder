module.exports = {
    repoPath: '/data/repositories',
    mongoURL: 'mongodb://mongo/webeditor',
    memcached: {
        hosts: ['memcached:11211'],
    },
    host: 'https://webeditor.me',
    port: process.env.PORT || 8080
};

