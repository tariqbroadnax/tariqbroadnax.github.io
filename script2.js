var MAX_SEARCH_RESULTS = 5;

function updateSearchDropdown()
{
	console.log("input received");
	
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
	console.log("project file opened");
	
	var input = document.getElementById("search input").value;
	
	var projects = projectXmlToObjects(xml);
	
	projects = searchProjects(projects, input);
	
	console.log(projects.length);
	
	if(projects.length <= 0)
		return;
	
	var html = "<p>Projects</p>";
	
	for(var i = 0; i < projects.length && i < MAX_SEARCH_RESULTS; i++)
		html += getProjectSearchItemHTML(projects[i]);
	
	document.getElementById("search dropdown").innerHTML = html;
}

function projectXmlToObjects(xml)
{
	console.log("converting project xml to objects");
	
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
	console.log("searching projects");
		
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
	var html = "<div class=\"w3-container\"><img style=\"height: 50px;width: 50px;\" class=\"w3-cell\" src=\""+project.imgURL+"\"><div class=\"w3-cell\"><p>"+project.name+"</p></div>";
	
	console.log(html);
	
	return html;
}

function clearSearchDropdown()
{
	document.getElementById("search dropdown").innerHTML = "";
}