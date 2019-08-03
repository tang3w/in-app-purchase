var assert = require('assert'); 
var fs = require('fs');
var fixedPath = process.cwd() + '/test/receipts/apple';

describe('#### Apple ####', function () {

    it('Can parse the validated subscription receipt with duplicates', function (done) {
        var iap = require('../');
        var list = [{"quantity":"1","product_id":"basicmembership","transaction_id":"1000000381600687","original_transaction_id":"1000000381600687","purchase_date":"2018-03-08 19:58:55 Etc/GMT","purchase_date_ms":"1520539135000","purchase_date_pst":"2018-03-08 11:58:55 America/Los_Angeles","original_purchase_date":"2018-03-08 19:58:56 Etc/GMT","original_purchase_date_ms":"1520539136000","original_purchase_date_pst":"2018-03-08 11:58:56 America/Los_Angeles","expires_date":"2018-03-08 20:03:55 Etc/GMT","expires_date_ms":"1520539435000","expires_date_pst":"2018-03-08 12:03:55 America/Los_Angeles","web_order_line_item_id":"1000000038056225","is_trial_period":"false","is_in_intro_offer_period":"false"},{"quantity":"1","product_id":"basicmembership","transaction_id":"1000000381600903","original_transaction_id":"1000000381600687","purchase_date":"2018-03-08 20:03:55 Etc/GMT","purchase_date_ms":"1520539435000","purchase_date_pst":"2018-03-08 12:03:55 America/Los_Angeles","original_purchase_date":"2018-03-08 19:58:56 Etc/GMT","original_purchase_date_ms":"1520539136000","original_purchase_date_pst":"2018-03-08 11:58:56 America/Los_Angeles","expires_date":"2018-03-08 20:08:55 Etc/GMT","expires_date_ms":"1520539735000","expires_date_pst":"2018-03-08 12:08:55 America/Los_Angeles","web_order_line_item_id":"1000000038056226","is_trial_period":"false","is_in_intro_offer_period":"false"},{"quantity":"1","product_id":"basicmembership","transaction_id":"1000000381601336","original_transaction_id":"1000000381600687","purchase_date":"2018-03-08 20:09:15 Etc/GMT","purchase_date_ms":"1520539755000","purchase_date_pst":"2018-03-08 12:09:15 America/Los_Angeles","original_purchase_date":"2018-03-08 19:58:56 Etc/GMT","original_purchase_date_ms":"1520539136000","original_purchase_date_pst":"2018-03-08 11:58:56 America/Los_Angeles","expires_date":"2018-03-08 20:14:15 Etc/GMT","expires_date_ms":"1520540055000","expires_date_pst":"2018-03-08 12:14:15 America/Los_Angeles","web_order_line_item_id":"1000000038056264","is_trial_period":"false","is_in_intro_offer_period":"false"},{"quantity":"1","product_id":"basicmembership","transaction_id":"1000000381601740","original_transaction_id":"1000000381600687","purchase_date":"2018-03-08 20:14:30 Etc/GMT","purchase_date_ms":"1520540070000","purchase_date_pst":"2018-03-08 12:14:30 America/Los_Angeles","original_purchase_date":"2018-03-08 19:58:56 Etc/GMT","original_purchase_date_ms":"1520539136000","original_purchase_date_pst":"2018-03-08 11:58:56 America/Los_Angeles","expires_date":"2018-03-08 20:19:30 Etc/GMT","expires_date_ms":"1520540370000","expires_date_pst":"2018-03-08 12:19:30 America/Los_Angeles","web_order_line_item_id":"1000000038056312","is_trial_period":"false","is_in_intro_offer_period":"false"},{"quantity":"1","product_id":"basicmembership","transaction_id":"1000000381602052","original_transaction_id":"1000000381600687","purchase_date":"2018-03-08 20:19:30 Etc/GMT","purchase_date_ms":"1520540370000","purchase_date_pst":"2018-03-08 12:19:30 America/Los_Angeles","original_purchase_date":"2018-03-08 19:58:56 Etc/GMT","original_purchase_date_ms":"1520539136000","original_purchase_date_pst":"2018-03-08 11:58:56 America/Los_Angeles","expires_date":"2018-03-08 20:24:30 Etc/GMT","expires_date_ms":"1520540670000","expires_date_pst":"2018-03-08 12:24:30 America/Los_Angeles","web_order_line_item_id":"1000000038056364","is_trial_period":"false","is_in_intro_offer_period":"false"},{"quantity":"1","product_id":"basicmembership","transaction_id":"1000000381602343","original_transaction_id":"1000000381600687","purchase_date":"2018-03-08 20:24:30 Etc/GMT","purchase_date_ms":"1520540670000","purchase_date_pst":"2018-03-08 12:24:30 America/Los_Angeles","original_purchase_date":"2018-03-08 19:58:56 Etc/GMT","original_purchase_date_ms":"1520539136000","original_purchase_date_pst":"2018-03-08 11:58:56 America/Los_Angeles","expires_date":"2018-03-08 20:29:30 Etc/GMT","expires_date_ms":"1520540970000","expires_date_pst":"2018-03-08 12:29:30 America/Los_Angeles","web_order_line_item_id":"1000000038056406","is_trial_period":"false","is_in_intro_offer_period":"false"}];
        var data = {
            service: iap.APPLE,
            receipt: {
                in_app: [],
                latest_receipt_info: list    
            }
        };
        var res = iap.getPurchaseData(data);
        console.log(res);
        assert.equal(res.length, 1);
        assert.equal(res[0].originalTransactionId, '1000000381600687');
        assert.equal(res[0].purchaseDateMs, 1520540670000);
        assert.equal(res[0].isTrial, false);
        done();
    });
    
    it('Can validate Unity apple in-app-purchase w/ auto-service detection', function (done) {

        var path = process.cwd() + '/test/receipts/unity_apple';
        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validate(receipt, function (error, response) {
                    if (error) {
                        console.error('Error >>>>', error);
                    }
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
    it('Can validate apple in-app-purchase w/ auto-service detection', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validate(receipt, function (error, response) {
                    if (error) {
                        console.error('Error >>>>', error);
                    }
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
    it('Can validate apple in-app-purchase w/ Promise & auto service detection', function (done) {
        
        if (!Promise) {
            return done();
        }
    
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        var receipt = fs.readFileSync(path, 'utf8');
        iap.setup()
            .then(function () {
                iap.validate(receipt).then(onSuccess).catch(onError);
            }).catch(function (error) {
                throw error;
            });

        function onSuccess(response) {
            var data = iap.getPurchaseData(response, { ignoreExpired: true });
            for (var i = 0, len = data.length; i < len; i++) {
                console.log('parsedPurchaseData:', i, data);
                assert(data[i].productId);
                assert(data[i].purchaseDate);
                assert(data[i].quantity);
            }
            done();
        }

        function onError(error) {
            throw error;
        }

    });
    
    it('Can validate apple in-app-purchase', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validate(iap.APPLE, receipt, function (error, response) {
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
    it('Can validate apple in-app-purchase w/ .validateOnce() and w/ auto-service detection', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validateOnce(receipt, null, function (error, response) {
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
    it('Can validate Unity apple in-app-purchase w/ .validateOnce()', function (done) {
        
        var path = process.cwd() + '/test/receipts/unity_apple';
        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validateOnce(receipt, null, function (error, response) {
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
    it('Can validate apple in-app-purchase w/ .validateOnce()', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validateOnce(iap.APPLE, null, receipt, function (error, response) {
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
    it('Can NOT validate apple in-app-purchase with incorrect receipt w/ auto-service detection', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            iap.validate('fake-receipt', function (error, response) {
                assert(error);
                assert.equal(iap.isValidated(response), false);
                done();
            });
        });
    
    });
    
    it('Can NOT validate apple in-app-purchase with incorrect receipt', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            iap.validate(iap.APPLE, 'fake-receipt', function (error, response) {
                assert(error);
                assert.equal(iap.isValidated(response), false);
                done();
            });
        });
    
    });
    
    it('Can get an error response', function (done) {
        
        var path = process.argv[process.argv.length - 1].replace('--path=', '');

        if (path === 'false') {
            path = fixedPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            iap.validate(iap.APPLE, 'fake-receipt', function (error, response) {
                assert(error);
                assert(response);
                assert.equal(iap.isValidated(response), false);
                done();
            });
        });
    
    });

    it('can parse both in_app and latest_receipt_info array with .getPurchaseData()', function () {
        var iap = require('../');
        var rec = {
            service: iap.APPLE,
            receipt: {
                in_app: [ 
                    { quantity: '1',
                    product_id: 'in_app.0',
                    transaction_id: '210000259386802',
                    original_transaction_id: '210000259386802',
                    purchase_date: '2016-04-14 16:03:33 Etc/GMT',
                    purchase_date_ms: '1460649813000',
                    purchase_date_pst: '2016-04-14 09:03:33 America/Los_Angeles',
                    original_purchase_date: '2016-04-14 16:03:34 Etc/GMT',
                    original_purchase_date_ms: '1460649814000',
                    original_purchase_date_pst: '2016-04-14 09:03:34 America/Los_Angeles',
                    expires_date: '2016-05-14 16:03:33 Etc/GMT',
                    expires_date_ms: '1463241813000',
                    expires_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
                    web_order_line_item_id: '210000038560504',
                    is_trial_period: 'false' }
                ]
            },
            latest_receipt_info: [
                { quantity: '1',
                product_id: 'latest_receipt_info.0',
                transaction_id: '210000259386802',
                original_transaction_id: '210000259386802',
                purchase_date: '2016-04-14 16:03:33 Etc/GMT',
                purchase_date_ms: '1460649813982',
                purchase_date_pst: '2016-04-14 09:03:33 America/Los_Angeles',
                original_purchase_date: '2016-04-14 16:03:34 Etc/GMT',
                original_purchase_date_ms: '1460649814000',
                original_purchase_date_pst: '2016-04-14 09:03:34 America/Los_Angeles',
                expires_date: '2016-05-14 16:03:33 Etc/GMT',
                expires_date_ms: '1463241813982',
                expires_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
                web_order_line_item_id: '210000038560504',
                is_trial_period: 'false' },
                { quantity: '1',
                product_id: 'latest_receipt_info.1',
                transaction_id: '210000265773203',
                original_transaction_id: '210000259386802',
                purchase_date: '2016-05-14 16:03:33 Etc/GMT',
                purchase_date_ms: '1463241813000',
                purchase_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
                original_purchase_date: '2016-05-14 10:03:37 Etc/GMT',
                original_purchase_date_ms: '1463220217552',
                original_purchase_date_pst: '2016-05-14 03:03:37 America/Los_Angeles',
                expires_date: '2016-06-14 16:03:33 Etc/GMT',
                expires_date_ms: '1465920213000',
                expires_date_pst: '2016-06-14 09:03:33 America/Los_Angeles',
                web_order_line_item_id: '210000038560503',
                is_trial_period: 'false' }
            ]
        };
        iap.config({
            verbose: true
        });
        var parsed = iap.getPurchaseData(rec);
        var res = [
            'in_app.0',
            'latest_receipt_info.0',
            'latest_receipt_info.1'
        ];
        for (var i = 0, len = parsed.length; i < len; i++) {
            if (res.indexOf(parsed[i].productId) === -1) {
                console.error(parsed[i]);
                throw new Error('missing purchase data');
            }
            console.log(parsed[i].productId, parsed[i].transactionId);
        }

    });

    it('can parse without latest_receipt_info array with .getPurchaseData()', function () {
        var iap = require('../');
        var rec = {
            service: iap.APPLE,
            receipt: {
                in_app: [ 
                    { quantity: '1',
                    product_id: 'in_app.0',
                    transaction_id: '210000259386802',
                    original_transaction_id: '210000259386802',
                    purchase_date: '2016-04-14 16:03:33 Etc/GMT',
                    purchase_date_ms: '1460649813000',
                    purchase_date_pst: '2016-04-14 09:03:33 America/Los_Angeles',
                    original_purchase_date: '2016-04-14 16:03:34 Etc/GMT',
                    original_purchase_date_ms: '1460649814000',
                    original_purchase_date_pst: '2016-04-14 09:03:34 America/Los_Angeles',
                    expires_date: '2016-05-14 16:03:33 Etc/GMT',
                    expires_date_ms: '1463241813000',
                    expires_date_pst: '2016-05-14 09:03:33 America/Los_Angeles',
                    web_order_line_item_id: '210000038560504',
                    is_trial_period: 'false' }
                ]
            }
        };
        iap.config({
            verbose: true
        });
        var parsed = iap.getPurchaseData(rec);
        var res = [
            'in_app.0',
        ];
        for (var i = 0, len = parsed.length; i < len; i++) {
            if (res.indexOf(parsed[i].productId) === -1) {
                throw new Error('missing purchase data');
            }
            console.log(parsed[i].productId, parsed[i].transactionId);
        }
    });

});
