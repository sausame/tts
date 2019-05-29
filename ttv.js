function getInputValue(id) {

  var element = document.getElementById(id);
  if (null == element) {
    return null;
  }

  return element.value;
}

function getSelectedRadioValue(name) {

  var radios = document.getElementsByName(name);

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
}

function displayImage(id, url) {

  if (null == url || '' == url) {
    return;
  }

  var element = document.getElementById(id);
  if (null == element) {
    return;
  }

  element.setAttribute('src', url);
}

function createImageHtml(contentIndex, imageIndex) {

  var content = '<p>NO.' + (imageIndex + 1) + ' Image:';
  content += '<img id="content_' + contentIndex + '_image_' + imageIndex + '" style="width:100%;"></img></p>';
  content += '<input type="text" id="content_' + contentIndex + '_imageUrl_' + imageIndex + '"  placeholder="https://" value=""/>';
  content += '</p>';

  return content;
}

function addImage(contentIndex, imageCount) {

  var contentElement = document.getElementById('content_' + contentIndex);
  var imageElement = document.createElement('p');

  imageElement.innerHTML = createImageHtml(contentIndex, imageCount);
  var button = document.getElementById('content_' + contentIndex + '_addImage');

  contentElement.insertBefore(imageElement, button);

  button.setAttribute('onclick', 'addImage(' + contentIndex + ', ' + (imageCount + 1) + ')');
}

function addContent(contentCount) {

  var button = document.getElementById('addContent');
  var element = document.createElement('div');
  element.setAttribute('id', 'content_' + contentCount);

  var content = '<h2>NO.' + (contentCount + 1) + ' Content</h2></hr>';
  content += '<p>Name:<input type="text" id="content_' + contentCount + '_name" value=""/></p>';
  content += '<p>Text:<textarea id="content_' + contentCount + '_text" style="width:100%;" rows="5"></textarea></p>';
  content += '<p><h3>Image List</h3></p>';
  content += createImageHtml(contentCount, 0);
  content += '<button id="content_' + contentCount + '_addImage" onclick="addImage(' + contentCount + ', 1)">Add Image</button>';

  element.innerHTML = content;

  var containerElement = document.getElementById('container');

  containerElement.insertBefore(element, button);
  button.setAttribute('onclick', 'addContent(' + (contentCount + 1) + ')');
}

function createRequest() {

  var request = '{';

  var coding = getSelectedRadioValue('coding');

  request += '"coding": "' + coding + '",';
  request += '"language": "' + getSelectedRadioValue('language') + '",';

  var background = getInputValue('background');
  displayImage('backgroundImage', background);

  request += '"background": "' + background + '",';
  request += '"width": "' + getInputValue('width') + '",';
  request += '"height": "' + getInputValue('height') + '",';

  var logo = getInputValue('logoUrl');
  displayImage('logoImage', logo);

  request += '"logo": "' + logo + '",';
  request += '"logo-width": "' + getInputValue('logoWidth') + '",';
  request += '"logo-height": "' + getInputValue('logoHeight') + '",';

  var font = getInputValue('fontUrl');

  request += '"font": "' + font + '",';

  request += '"contents-list":[';

  var count = 0;

  for (var contentIndex = 0; true; contentIndex ++) {
    var contentElement = document.getElementById('content_' + contentIndex);

    if (null == contentElement) {
      break;
    }

    var text = getInputValue('content_' + contentIndex + '_text');
    if ('' == text) {
      continue;
    }

    if (count > 0) {
      request += ',';
    }

    request += '{';

    if ('base64' == coding) {
      text = encodeURIComponent(text);
      text = window.btoa(text);
    }

    var name = getInputValue('content_' + contentIndex + '_name');
    if ('' != name && 'base64' == coding) {
      name = encodeURIComponent(name);
      name = window.btoa(name);
    }

    request += '"name": "' + name + '",';
    request += '"text": "' + text + '",';
    request += '"image-urls-list":[';

    var imageCount = 0;
    for (var imageIndex = 0; true; imageIndex ++) {
      var urlElement = document.getElementById('content_' + contentIndex + '_imageUrl_' + imageIndex);

      if (null == urlElement) {
        break;
      }

      var url = urlElement.value;
      if ('' == url) {
        continue;
      }

      if (imageCount > 0) {
        request += ',';
      }

      request += '"' + url + '"';
      displayImage('content_' + contentIndex + '_image_' + imageIndex, url);

      imageCount ++;
    }

    request += ']';
    request += '}';

    count ++;
  }

  request += ']';
  request += '}';

  document.getElementById('request').value = request;
  document.getElementById('msg').value = window.btoa(window.btoa(request));
}

addContent(0);

