var MAX_POSTS_PER_PAGE = 4;

init();

function init()
{	
	initSlideshows();
	initPosts();
}

function initPosts()
{
	var xhttp = new XMLHttpRequest();
	 
	xhttp.onreadystatechange = function()
	{	
		if(this.readyState == 4 && this.status == 200)
		{
			_initPosts(this);
		}
	}
	
	xhttp.overrideMimeType('text/plain');
	xhttp.open("GET", "posts/index.txt", true);
	xhttp.send(null);
}

function _initPosts(xml)
{
	var paths = xml.responseText.split(/\r?\n/);
	
	var xhttp = new XMLHttpRequest();
	
	var path = null;

	xhttp.onload = function()
	{	
		if(this.readyState == 4 && this.status == 200)
			addPost(this, path);
	}
	
	//paths.sort(comparePostPaths);
		
	for(var i = 0; i < paths.length && i < MAX_POSTS_PER_PAGE; i++)
	{
		path = "posts/"+paths[i];
		xhttp.open("GET", path);
		xhttp.send();
	}
}

function test()
{
	alert("lost focus");
}

function addPost(xml, path)
{
	var post = xml.responseXML;
	var posts = document.getElementById("posts");
	
	posts.innerHTML += "<div class=\"w3-panel\"><div class=\"w3-container w3-cell\"><img src=\"assets/placeholder.png\"></div><div class=\"w3-container w3-cell\"><p><a href="+path+">"+post.getElementById("title").innerHTML+"</a></p><p>"+post.getElementById("preview").innerHTML+"</p><h6>"+post.getElementById("date").innerHTML+"</h6></div></div><hr>";
}

function comparePostPaths(path1, path2)
{
	var date1 = getPostPathDate(path1),
		date2 = getPostPathDate(path2);
		
	if(date1 > date2)
		return -1;
	else if(date1 == date2)
		return 0;
	else
		return 1;
}

function getPostPathDate(path)
{
	var i = path.indexOf("_");
	
	var dateStr = path.substr(i+1, path.length);
	
	return new Date(dateStr);
}

function initSlideshows()
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{	
		if(this.readyState == 4 && this.status == 200)
		{
			initUpcomingProjectsSlideshow(this);
			initRecentProjectsSlideshow(this);
			
			showDivs(1, 0);
			showDivs(1, 1);
		}
	}

	xhttp.open("GET", "projects.xml", true);
	xhttp.send();
}

function initUpcomingProjectsSlideshow(xml)
{
	var xmlDoc = xml.responseXML;
	var x = xmlDoc.getElementsByTagName("PROJECT");
	var html = "";
		
	x = [].slice.call(x);
	x.sort(maxCompareProjectXML);

	var imgURL = "";
	
	var currDate = new Date();
	
	for(var i = 0; i < x.length; i++)
	{
	    if(getDate(x[i]) < currDate)
			continue;
		
		var imgNode = x[i].getElementsByTagName("IMAGE");
		
		if (imgNode.length > 0)
	        imgURL = imgNode[0].childNodes[0].nodeValue;
		else
			imgURL = "assets/code_icon.png";
		
		html += "<div class=\"w3-display-container mySlides1\"><img src=\""+imgURL+"\" style=\"width:100%\">";
		
		html += "<div class=\"w3-display-bottomleft w3-container w3-padding-16 w3-black\">" + x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue + "</div></div>";
	}
	
	document.getElementById("upcoming projects container").innerHTML = html+document.getElementById("upcoming projects container").innerHTML;
}

function initRecentProjectsSlideshow(xml)
{
	var xmlDoc = xml.responseXML;
	var x = xmlDoc.getElementsByTagName("PROJECT");
	var html = "";
	
	x = [].slice.call(x);
	x.sort(minCompareProjectXML);

	var imgURL = "";
	
	var currDate = new Date();
	
	for(var i = 0; i < x.length; i++)
	{		
		if(getDate(x[i]) > currDate)
			continue;
		
		var imgNode = x[i].getElementsByTagName("IMAGE");
		
		if (imgNode.length > 0)
	        imgURL = imgNode[0].childNodes[0].nodeValue;
		else
			imgURL = "assets/code_icon.png";
		
		html += "<div class=\"w3-display-container mySlides2\"><img src=\""+imgURL+"\" style=\"width:100%\">";
		
		html += "<div class=\"w3-display-bottomleft w3-container w3-padding-16 w3-black\">" + x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue + "</div></div>";
	}
	
	document.getElementById("recent projects container").innerHTML = html+document.getElementById("upcoming projects container").innerHTML;
}

function getDate(projectNode)
{
	var dateStr = projectNode.getElementsByTagName("DATE")[0].childNodes[0].nodeValue;
			
	return new Date(dateStr);
}

function minCompareProjectXML(projectNode1, projectNode2)
{
	var date1 = getDate(projectNode1),
		date2 = getDate(projectNode2);
		
	if(date1 < date2)
		return -1;
	else if(date1 == date2)
		return 0;
	else
		return 1;
}

function maxCompareProjectXML(projectNode1, projectNode2)
{		
	var date1 = getDate(projectNode1),
		date2 = getDate(projectNode2);
		
	if(date1 < date2)
		return 1;
	else if(date1 == date2)
		return 0;
	else
		return -1;
}


var slideIndex = [1,1];
var slideId = ["mySlides1", "mySlides2"]

function plusDivs(n, no) {
  showDivs(slideIndex[no] += n, no);
}

function showDivs(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}    
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex[no]-1].style.display = "block";  
}