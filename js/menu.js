function addMenu() {
	var div = document.createElement("div");
	div.style.left="50px";
	div.style.top="50px";
	div.style.width="634px";
	div.style.height="50px";
	div.style.border="1px solid #fff";
	div.style.color="#000";
	div.style.margin="0 auto";
	div.style.background="#fff";
	div.innerHTML = 
		'<a href="#" class="ui-state-default ui-corner-all" onclick="SaveLevel(); return false;">Сохранить</a> | ' +
		'<a href="#" class="ui-state-default ui-corner-all" onclick="Help(); return false;">Помощь</a>' + 
		'<div id="statusdiv"></div>';

	gbox._menudiv = div;
	gbox._box.appendChild(div);
}