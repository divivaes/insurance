var express = require('express'); // Express Framework
var router = express.Router(); // Express routing
var mysql = require('mysql'); // MySQL
var bodyParser = require('body-parser'); // Working input
var connection_cl = require('./../config/connection_cl'); // MySQL Config Connection
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/uploads'); // set the destionation
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '.jpg'); // set the file name and extension
    }
});
var request = require('request');

var upload = multer({ storage: storage });

router.use(bodyParser.json());          // to support JSON - encoded bodies
router.use(bodyParser.urlencoded({      // to support URL - encoded bodies
    extended: false
}));


router.all('/', function (req, res, next){
  connection_cl.query('select * from ic_news limit 3', function (err, rows) {
    if (err) {
      console.log('Error selecting: %s', err);
    } else {
      res.render('index',{
          title: 'Главная страница',
          url: '/',
          data: rows
      });
    }
  });
});

router.all('/company', function (req, res, next) {
    res.render('about', {
      title: 'О компании',
      url: 'about'
    });
});

router.all('/contacts', function (req, res, next) {
    res.render('contacts', {
      title: 'Контакты',
      url: 'contacts'
    });
});

router.all('/company/loyalty', function (req, res, next) {
    res.render('loyalty', {
      title: 'Карта лояльности',
      url: 'loyalty'
    });
});

router.all('/company/leaders', function (req, res, next) {
    res.render('leaders', {
      title: 'Руководство',
      url: 'loyalty'
    });
});

router.all('/company/tips', function (req, res, next) {
    res.render('tips', {
      title: 'Полезные советы',
      url: 'tips'
    });
});

router.all('/company/requisites', function (req, res, next) {
    res.render('requisites', {
      title: 'Реквизиты',
      url: 'requisites'
    });
});

router.all('/company/career', function (req, res, next) {
    res.render('career', {
      title: 'Карьера в компании',
      url: 'career'
    });
});

router.all('/insurance_case', function (req, res, next) {
    res.render('insurance_case', {
        title: 'Страховой случай',
        url: 'insurance_case'
    });
});

router.all('/products', function (req, res, next) {
    res.render('products', {
        title: 'Наши продукты',
        url: 'products'
    });
});

router.post('/contacts/send', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  var currentTime = new Date().toLocaleTimeString();
  var currentDate = new Date().toLocaleDateString();
  var createdDate = currentTime + ' ' + currentDate;

  var data = {
      f_name : input.client_name,
      f_email: input.client_email,
      f_phone: input.client_phone,
      f_message: input.client_message,
      f_status: 0,
      f_form_type: 1,
      f_served_mid: 2,
      f_created_at: createdDate,
      f_updated_at: createdDate
  };

  console.log(data);
  connection_cl.query("INSERT INTO ic_form_requests SET ? ", data, function (err, rows) {
      if (err) {
          console.log("Error inserting: %s", err);
      } else {
          req.flash('success', 'Данные успешно отправлены!Ожидайте ответ менеджера :)');
          res.redirect('/contacts');
      }
  });
});

router.post('/insurance_case/send', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  var currentTime = new Date().toLocaleTimeString();
  var currentDate = new Date().toLocaleDateString();
  var createdDate = currentTime + ' ' + currentDate;

  var data = {
      f_name : input.client_name,
      f_email: '',
      f_phone: input.client_phone,
      f_message: '',
      f_status: 0,
      f_form_type: 2,
      f_served_mid: 2,
      f_created_at: createdDate,
      f_updated_at: createdDate
  };

  console.log(data);
  connection_cl.query("INSERT INTO ic_form_requests SET ? ", data, function (err, rows) {
      if (err) {
          console.log("Error inserting: %s", err);
      } else {
          req.flash('success', 'Данные успешно отправлены!Наши менеджера перезвонят вам! ');
          res.redirect('/insurance_case');
      }
  });
});

router.get('/insurance/kasko', function (req, res, next) {

   res.render('kasko',  {
       title: 'КАСКО',
       url: 'kasko'
   });

});

router.post('/insurance/kasko/add', function (req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var currentTime = new Date().toLocaleTimeString();
    var currentDate = new Date().toLocaleDateString();
    var createdDate = currentTime + ' ' + currentDate;
    var data = {
        car_type             : input.car_type,
        car_city             : input.car_city,
        car_year             : input.car_year,
        driver_experience    : input.driver_experience,
        driver_age           : input.driver_age,
        driver_iin           : input.driver_iin,
        client_city          : input.client_city,
        client_fullname      : input.client_fullname,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        car_number           : input.car_number,
        car_vin              : input.car_vin,
        client_address       : input.client_address,
        payment_type         : input.payment_type,
        ins_price            : input.ins_price,
        ins_type             : 1,
        served_mid           : 2,
        status               : 0,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    var clientData = {
        client_fullname      : input.client_fullname,
        client_address       : input.client_address,
        client_city          : input.client_city,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        insurance_type       : 1,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    console.log(data);
    connection_cl.query("INSERT INTO ic_kasko_order SET ? ", data, function (err, rows) {
      connection_cl.query("INSERT INTO ic_clients SET ? ", clientData, function (err, resuts) {
        if (err) {
            console.log("Error inserting: %s", err);
        } else {
            res.render('success', {
                title: 'Успешное завершение',
                url: 'insurance/kasko/success'
            });
        }
      });
    });
});

router.get('/insurance/kasko/iin/:val', function (req, res, next) {

    // console.log(req.params.val);

    var url = 'https://kupipolis.kz/ogpo/participantInfo?iin=' + req.params.val;
    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
          // console.log(body.response);
          res.send(body.response);
      }
    })
});

router.get('/insurance/tourism', function (req, res, next) {
   res.render('tourism',  {
       title: 'Туризм',
       url: 'tourism'
   });
});

router.post('/insurance/tourism/add', function (req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var currentTime = new Date().toLocaleTimeString();
    var currentDate = new Date().toLocaleDateString();
    var createdDate = currentTime + ' ' + currentDate;

    var data = {
        insurance_sum        : input.sc1,
        currency             : input.sc2,
        currency_sum         : input.curs,
        start_date           : input.sc3,
        end_date             : input.sc4,
        client_city          : input.client_city,
        client_fullname      : input.client_fullname,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        client_iin           : input.client_iin,
        client_address       : input.client_address,
        payment_type         : input.payment_type,
        insurance_price      : input.ins_price,
        insurance_type       : 2,
        served_mid           : 2,
        status               : 0,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    var clientData = {
        client_fullname      : input.client_fullname,
        client_address       : input.client_address,
        client_city          : input.client_city,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        insurance_type       : 2,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    console.log(data);
    connection_cl.query("INSERT INTO ic_tourism_order SET ? ", data, function (err, rows) {
      connection_cl.query("INSERT INTO ic_clients SET ? ", clientData, function (err, resuts) {
        if (err) {
            console.log("Error inserting: %s", err);
        } else {
            res.render('success', {
                title: 'Успешное завершение',
                url: 'insurance/kasko/success'
            });
        }
      });
    });
});


router.get('/insurance/goods', function (req, res, next) {
   res.render('goods',  {
       title: 'Недвижимость',
       url: 'goods'
   });
});

router.post('/insurance/goods/add', function (req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var currentTime = new Date().toLocaleTimeString();
    var currentDate = new Date().toLocaleDateString();
    var createdDate = currentTime + ' ' + currentDate;
    var risks = [
      input.r1,
      input.r2,
      input.r3,
      input.r4,
      input.r5
    ];

    var array = risks.join();


    var data = {
        goods_type           : input.sc1,
        risk_type            : array,
        given_sum            : input.sc3,
        client_city          : input.client_city,
        client_fullname      : input.client_fullname,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        client_address       : input.client_address,
        payment_type         : input.payment_type,
        insurance_price      : input.ins_price,
        insurance_type       : 4,
        served_mid           : 2,
        status               : 0,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    var clientData = {
        client_fullname      : input.client_fullname,
        client_address       : input.client_address,
        client_city          : input.client_city,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        insurance_type       : 4,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    console.log(data);
    connection_cl.query("INSERT INTO ic_goods_order SET ? ", data, function (err, rows) {
      connection_cl.query("INSERT INTO ic_clients SET ? ", clientData, function (err, resuts) {
        if (err) {
            console.log("Error inserting: %s", err);
        } else {
            res.render('success', {
                title: 'Успешное завершение',
                url: 'insurance/kasko/success'
            });
        }
      });
    });
});

router.get('/insurance/accident', function (req, res, next) {
   res.render('accident',  {
       title: 'Несчастный случай',
       url: 'accident'
   });
});

router.post('/insurance/accident/add', function (req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var currentTime = new Date().toLocaleTimeString();
    var currentDate = new Date().toLocaleDateString();
    var createdDate = currentTime + ' ' + currentDate;

    var data = {
        insurance_money      : input.sc1,
        insurance_territory  : input.sc2,
        insurance_term       : input.sc3,
        client_city          : input.client_city,
        client_fullname      : input.client_fullname,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        client_address       : input.client_address,
        client_iin           : input.client_iin,
        payment_type         : input.payment_type,
        insurance_price      : input.ins_price,
        insurance_type       : 5,
        served_mid           : 2,
        status               : 0,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    var clientData = {
        client_fullname      : input.client_fullname,
        client_address       : input.client_address,
        client_city          : input.client_city,
        client_phone         : input.client_phone,
        client_email         : input.client_email,
        insurance_type       : 5,
        created_at           : createdDate,
        updated_at           : createdDate
    };
    console.log(data);
    connection_cl.query("INSERT INTO ic_accident_order SET ? ", data, function (err, rows) {
      connection_cl.query("INSERT INTO ic_clients SET ? ", clientData, function (err, resuts) {
        if (err) {
            console.log("Error inserting: %s", err);
        } else {
            res.render('success', {
                title: 'Успешное завершение',
                url: 'insurance/kasko/success'
            });
        }
      });
    });
});




module.exports = router;
