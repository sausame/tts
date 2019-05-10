function dateFtt(fmt, date) {

  var o = {   
    'M+' : date.getMonth()+1,
    'd+' : date.getDate(),
    'h+' : date.getHours(),
    'm+' : date.getMinutes(),
    's+' : date.getSeconds(),
    'q+' : Math.floor((date.getMonth()+3)/3),
    'S'  : date.getMilliseconds()
  };   

  if(/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));   
  }

  for(var k in o) {
    if(new RegExp('('+ k +')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));   
    }
  }

  return fmt;   
}

function toRequestUrl(url, params) {

  var payload = null;

  for (var key in params) {
    if (! payload) {
      payload = '';
    } else {
      payload += '&';
    }
    payload += key + '=' + encodeURIComponent(params[key]);
  }

  return url + payload;
}

function getSelectedRadioValue(name) {

  var radios = document.getElementsByName(name);

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
}

function moveSelectedRadio(name) {

  var radios = document.getElementsByName(name);

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      var next = i + 1;
      if (next >= radios.length) {
        next = 0;
      }

      radios[i].checked = false;
      radios[next].checked = true;
      break;
    }
  }
}

function onClickButton(anEvent) {

  var text = document.getElementById('text').value;
  var lastText = document.getElementById('lasttext').value;

  if ('' == text || text == lastText) {
    return;
  }

  document.getElementById('lasttext').value = text;
  document.getElementById('text').value = '';

  var count = parseInt(document.getElementById('count').value);

  var url = 'http://cache-a.oddcast.com/tts/gen.php?';

  var lid = getSelectedRadioValue('language');
  var vid = getSelectedRadioValue('gender');

  var params = {
    EID: '3',
    LID: lid,
    VID: vid,
    TXT: text,
    IS_UTF8: '1',
    EXT: 'mp3',
    FNAME: '',
    ACC: vhsshtml5_accountID,
    API: '',
    SESSION: '',
    CS: ''
  };

  var security = params['EID']
                + params['LID']
                + params['VID']
                + text
                + params['IS_UTF8']
                + params['EXT']
                + params['ACC']
                + vhsshtml5_secretID;

  var cs = md5(security);
  params['CS'] = cs;

  var mainUrl = toRequestUrl(url, params);

  var generatorUrl = mainUrl + '&ID3ONLY=1';
  var playerUrl = mainUrl + '&cache_flag=3';

  var cmd = document.getElementById('cmd').value;

  var interval = Math.floor((Math.random() * 5) + 5); 
  var now = dateFtt('yyyy-MM-dd', new Date());
  var path = './' + now + '/';

  cmd += '\n\n#--------------------------------------------------------------';
  cmd += '\nmkdir -p ' + path + ' 2> /dev/null';
  cmd += '\nsleep ' + interval;
  cmd += '\nwget -O /dev/null "' + generatorUrl + '" \\';
  cmd += '\n&& wget -O ./' + now + '/' + count + '.mp3 "' + playerUrl + '"';

  // For next one
  document.getElementById('cmd').value = cmd;
  document.getElementById('count').value = '' + (count + 1);

  moveSelectedRadio('gender');

  document.getElementById('now').value = now;
  // Just base64 again for security
  document.getElementById('msg').value = window.btoa(window.btoa(cmd));
}

