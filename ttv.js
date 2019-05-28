function addImage(contentIndex, imageCount) {

  var contentElement = document.getElementById('content_' + contentIndex);
  var imageElement = document.createElement('p');
  imageElement.innerHTML = 'NO.' + (imageCount + 1) + ':<input type="text" id="content_' + contentIndex + '_imageUrl_' + imageCount + '" value=""/>';
  var button = document.getElementById('content_' + contentIndex + '_addImage');

  contentElement.insertBefore(imageElement, button);

  button.setAttribute('onclick', 'addImage(' + contentIndex + ', ' + (imageCount + 1) + ')');
}

function addContent(contentCount) {

  var button = document.getElementById('addContent');
  var element = document.createElement('div');
  element.setAttribute('id', 'content_' + contentCount);

  var content = 'Content ' + (contentCount + 1) + ':</br>';
  content += '<p>Name:<input type="text" id="content_' + contentCount + '_name" value=""/></p>';
  content += '<p>Image List:</p>';
  content += '<p>NO.1:<input type="text" id="content_' + contentCount + '_imageUrl_0" value=""/></p>';
  content += '<button id="content_' + contentCount + '_addImage" onclick="addImage(' + contentCount + ', 1)">Add Image</button>';
  content += '<p><textarea id="content_' + contentCount + '_text" style="width:100%;" rows="5"></textarea></p>';

  element.innerHTML = content;

  var containerElement = document.getElementById('container');

  containerElement.insertBefore(element, button);
  button.setAttribute('onclick', 'addContent(' + (contentCount + 1) + ')');
}

