/*
 * Project config
 */

let env = process.env;

let listenaddr   = env.LISTENADDR               || '127.0.0.1';
let dbhost       = env.DBHOST                   || '127.0.0.1';
let dbport       = parseInt(env.DBPORT)         ||  3306;
let dbuser       = env.DBUSER                   || 'root';
let dbpass       = env.DBPASS                   || 'root';
let dbbase       = env.DBBASE                   || 'ctf';
let listenport   = parseInt(env.LISTENPORT)     ||  3000;
let environ      = env.NODE_ENV                 || 'development';

let sesskey: Array<string> = ['test'];
if ( env.SESS_KEY ) {
    sesskey = [ env.SESS_KEY ]
}

export {
    listenaddr,
    listenport,
    dbhost,
    dbport,
    dbuser,
    dbpass,
    dbbase,
    sesskey,
    environ
}