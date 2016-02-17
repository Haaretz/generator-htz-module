/* eslint-disable */
global.chai = require('chai');
global.expect = global.chai.expect;

// TODO if condition (enabled)
global.sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
