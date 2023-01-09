HtmlHelper.createNamespace("com.notes", window);

com.notes.App = {

	saveNote() {
		var notearea = document.getElementById("notearea");
		var req = JSONOutputBind.getDataForElement(notearea, 'req');

		if (req["title"].trim() == '') {
			HtmlHelper.showToast("Title can not be empty!");
			return;
		}

		var confirmMessage = '';
		if (req["id"].trim() == '') {
			confirmMessage = 'Create new note ' + req["title"] + "?";
		} else {
			confirmMessage = 'Save note ' + req["title"] + "?";
		}

		if (!confirm(confirmMessage)) {
			return;
		}
		var callObj = {};
		callObj.url = "/notes/save";
		callObj.method = "POST";
		callObj.body = JSON.stringify(req, 4, 4);
		callObj.headers = { "content-type": "application/json" };
		callObj.onSuccess = this.onSaveSuccess;
		callObj.onError = this.onError;
		callObj.additionalData = {};
		HtmlHelper.doFetch(callObj);
	},
	onError(response, callObj) {
		HtmlHelper.showToast("Some problem occured while fetch : " + response.status);
	},
	onSaveSuccess(response, callObj) {
		HtmlHelper.showToast("Note saved!", { "classname": "successtoast" });
		response.json().then(r => {
			document.getElementById("id").value = r["id"];
		});
		com.notes.App.getNoteList();
		
	},
	deleteNote() {
		var id = document.getElementById("id").value;
		var title = document.getElementById("title").value;
		if (id.trim() == '') {
			HtmlHelper.showToast("Can not delete this not as it is not created yet!");
			return;
		}
		var confirmMessage = 'Delete note ' + title + "?";
		if (!confirm(confirmMessage)) {
			return;
		}
		var callObj = {};
		callObj.url = "/notes/delete/" + id;
		callObj.method = "DELETE";
		callObj.body = null;
		callObj.headers = {};
		callObj.onSuccess = this.onDeleteSuccess;
		callObj.onError = this.onError;
		callObj.additionalData = {};
		HtmlHelper.doFetch(callObj);

	},
	onDeleteSuccess(response, callObj) {
		HtmlHelper.showToast("Note deleted!", { "classname": "successtoast" });
		var emptyData = { "id": "", "title": "", "content": "" };
		var notearea = document.getElementById("notearea");
		JSONInputBind.setDataForElement(emptyData, notearea, 'res');
		com.notes.App.getNoteList();
	},
	clearNote(response, callObj) {
		
		if (!confirm("Clear current form?")) {
			return;
		}
		var emptyData = { "id": "", "title": "", "content": "" };
		var notearea = document.getElementById("notearea");
		JSONInputBind.setDataForElement(emptyData, notearea, 'res');
		
	},
	getNoteList() {
		var noteareadiv = document.querySelector("div[x-element-id='noteitemsarea']");
		var availableNotes = noteareadiv.querySelectorAll("div[x-element-id='noteitem']");
		for(var availableNote of availableNotes){
			availableNote.parentNode.removeChild(availableNote);
		}
		var callObj = {};
		callObj.url = "/notes/get";
		callObj.method = "GET";
		callObj.body = null;
		callObj.headers = {};
		callObj.onSuccess = this.onNoteListFetch;
		callObj.onError = this.onError;
		callObj.additionalData = {};
		HtmlHelper.doFetch(callObj);

	},
	onNoteListFetch(response, callObj) {
		HtmlHelper.showToast("Notes fetched!", { "classname": "successtoast" });
		response.json().then(data => {
			for (var dataRow of data) {
				var template = document.querySelector("template[x-element-id='noteitemtemplate']");
				var noteareadiv = document.querySelector("div[x-element-id='noteitemsarea']");
				var clon = template.content.cloneNode(true);
				var newDiv = clon.querySelector("div");
				noteareadiv.appendChild(newDiv);
				JSONInputBind.setDataForElement(dataRow, newDiv, 'res');
				newDiv.querySelector("label[x-source-path='res:title']").addEventListener("click", com.notes.App.onListItemClick);
			}
		});
	},
	onListItemClick() {
		var label = event.target;
		var id = label.parentNode.querySelector("input[x-target-path='req:id']").value;
		var callObj = {};
		callObj.url = "/notes/get/" + id;
		callObj.method = "GET";
		callObj.body = null;
		callObj.headers = {};
		callObj.onSuccess = com.notes.App.onNoteFetch;
		callObj.onError = com.notes.App.onError;
		callObj.additionalData = {};
		HtmlHelper.doFetch(callObj);
	},
	onNoteFetch(response, callObj) {
		response.json().then(data => {
			var noteareadiv = document.getElementById("notearea");
			JSONInputBind.setDataForElement(data, noteareadiv, 'res');
		});
	},
}