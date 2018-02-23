var MAX_SEARCH_RESULTS = 5;

function updateSearchDropdown()
{
	// console.log("input received");
	
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function()
	{	
		if(this.readyState == 4 && this.status == 200)
			_updateSearchDropdown(this);
	}

	xhttp.open("GET", "projects.xml", true);
	xhttp.send();	
}

function _updateSearchDropdown(xml)
{
	// console.log("project file opened");
	
	var input = document.getElementById("search input").value;
	
	var projects = projectXmlToObjects(xml);
	
	projects = searchProjects(projects, input);
	
	// console.log(projects.length);
	
	var html = "";
	
	if(projects.length > 1 && input.length > 0)
	{
		var html = "<div class=\"w3-container w3-black\"><h9><b>Development</b></h9></div>";
	
		for(var i = 0; i < projects.length && i < MAX_SEARCH_RESULTS; i++)
			html += getProjectSearchItemHTML(projects[i]);
	}
	
	document.getElementById("search dropdown").innerHTML = html;
}

function projectXmlToObjects(xml)
{
	// console.log("converting project xml to objects");
	
	var xmlDoc = xml.responseXML;
	
	var projects = xmlDoc.getElementsByTagName("PROJECT");
	
	var out = [];
	
	for(var i = 0; i < projects.length; i++)
	{
		var date = new Date(projects[i].getElementsByTagName("DATE")[0].childNodes[0].nodeValue);
		
		var name = projects[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue
		
		var imgNode = projects[i].getElementsByTagName("IMAGE");

		var imgURL = "";
		
		if(imgNode.length > 0)
			imgURL = imgNode[0].childNodes[0].nodeValue;
		else
			imgURL = "assets/placeholder.png";
		
		var project = {name: name, date: date, imgURL: imgURL};
		
		out.push(project);
	}
	
	return out;
}

function searchProjects(projects, input)
{
	// console.log("searching projects");
		
	var out = [];
	
	for(var i = 0; i < projects.length; i++)
	{
		if(projects[i].name.search(input) > -1)
			out.push(projects[i]);
	}

	return out;
}

function getProjectSearchItemHTML(project)
{
	var html = "<div class=\"w3-white w3-hover-blue\"><div class=\"w3-container w3-cell\"><img style=\"height: 50px;width: 50px;\" src=\""+project.imgURL+"\"></div><div class=\"w3-container w3-cell\"><p style=\"margin: 0\">"+project.name+"<br>("+project.date.getFullYear()+")</p></div></div>";
	
	// console.log(html);
	
	return html;
}

function clearSearchDropdown()
{
	document.getElementById("search dropdown").innerHTML = "";
}