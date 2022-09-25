const _watch = {
    watch: false,
    ignore_watch: [
        'dist',
        'logs',
        'node_modules',
        'scripts',
        'src/assets/uploaded',
        'package.json',
        'package-lock.json',
        'yarn-lock.json',
    ],
};

const _restart = {
    max_memory_restart: '4G',
    autorestart: true,
    cron_restart: '',
    restart_delay: 5000,
    stop_exit_codes: [0],
};

const _log_date_format = 'YYYY-MM-DD HH:mm:ss';

const _instance = {
    exec_mode: 'cluster',
    instances: 1,
    min_uptime: '60s',
    instance_var: 'isMaster',
};

const _args = {
    cwd: './',
    args: '',
    interpreter: '',
    interpreter_args: '',
};

const _deploy_linuxlei = {
    user: 'wanglei',
    host: ['192.168.3.25'],
    ref: 'origin/master',
    repo: 'git@e.coding.net:codelei/www/web-node.git',
    'pre-setup': '',
    'post-setup': '',
};

// ==================================================== //

// ==================================================== //

const apps_development = [
    {
        name: 'web-development',
        namespace: 'development',
        script: './src/web.server.js',
        ..._args,
        ..._instance,
        ..._restart,
        ..._watch,
        watch: true,
        log_date_format: _log_date_format,
        error_file: './logs/web/development-err.log',
        out_file: './logs/web/development-out.log',
        env_development: {
            NODE_ENV: 'development',
            PORT: 10091,
        },
    },
    {
        name: 'api-development',
        namespace: 'development',
        script: './src/api.server.js',
        ..._args,
        ..._restart,
        ..._instance,
        ..._watch,
        watch: true,
        instances: 3,
        log_date_format: _log_date_format,
        error_file: './logs/api/development-err.log',
        out_file: './logs/api/development-out.log',
        env_development: {
            NODE_ENV: 'development',
            PORT: 10092,
        },
    },
];

const apps_test = [
    {
        name: 'web-test',
        namespace: 'test',
        script: './src/web.server.js',
        ..._args,
        ..._instance,
        ..._restart,
        ..._watch,
        log_date_format: _log_date_format,
        error_file: './logs/web/test-err.log',
        out_file: './logs/web/test-out.log',
        env_test: {
            NODE_ENV: 'test',
            PORT: 10093,
        },
    },
    {
        name: 'api-test',
        namespace: 'test',
        script: './src/api.server.js',
        ..._args,
        ..._restart,
        ..._instance,
        ..._watch,
        instances: 3,
        log_date_format: _log_date_format,
        error_file: './logs/api/test-err.log',
        out_file: './logs/api/test-out.log',
        env_test: {
            NODE_ENV: 'test',
            PORT: 10094,
        },
    },
];

const apps_production = [
    {
        name: 'web-production',
        namespace: 'production',
        script: './src/web.server.js',
        ..._args,
        ..._instance,
        ..._restart,
        ..._watch,
        log_date_format: _log_date_format,
        error_file: './logs/web/production-err.log',
        out_file: './logs/web/production-out.log',
        env_production: {
            NODE_ENV: 'production',
            PORT: 10095,
        },
    },
    {
        name: 'api-production',
        namespace: 'production',
        script: './src/api.server.js',
        ..._args,
        ..._restart,
        ..._instance,
        ..._watch,
        instances: 3,
        log_date_format: _log_date_format,
        error_file: './logs/api/production-err.log',
        out_file: './logs/api/production-out.log',
        env_production: {
            NODE_ENV: 'production',
            PORT: 10096,
        },
    },
];

const baseHome = '/home/wanglei/workspace/www';
const homeDev = baseHome + '/web-node-development';
const homeTest = baseHome + '/web-node-test';
const homeProd = baseHome + '/web-node-production';
function getPostDeployCmd(env_name, instance_names_only = []) {
    if (!instance_names_only.length) {
        throw new Error('instance_names_only invalid');
    }
    return `ls -la && nvm install v14.17.0 && nvm use && npm i -g pm2@5.1.0 && npm install && pm2 startOrRestart ecosystem.config.js --only '${instance_names_only.join()}' --env ${env_name} && pm2 save --force && pm2 update`;
}

module.exports = {
    apps: [...apps_development, ...apps_test, ...apps_production],
    deploy: {
        development: {
            ..._deploy_linuxlei,
            ref: 'origin/develop',
            path: homeDev,
            "pre-setup": 'rm -rf ' + homeDev + ' && mkdir -p ' + homeDev,
            "post-setup": 'pwd',
            'pre-deploy-local': '',
            'post-deploy': getPostDeployCmd('development', ['web-development', 'api-development'])
        },
        test: {
            ..._deploy_linuxlei,
            ref: 'origin/test',
            path: homeTest,
            "pre-setup": 'rm -rf ' + homeTest + ' && mkdir -p ' + homeTest,
            "post-setup": 'pwd',
            'pre-deploy-local': '',
            'post-deploy': getPostDeployCmd('test', ['web-test', 'api-test'])
        },
        production: {
            ..._deploy_linuxlei,
            path: homeProd,
            "pre-setup": 'rm -rf ' + homeProd + ' && mkdir -p ' + homeProd,
            "post-setup": 'pwd',
            'pre-deploy-local': '',
            'post-deploy': getPostDeployCmd('production', ['web-production', 'api-production'])
        }
    },
};
