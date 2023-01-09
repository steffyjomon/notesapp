class HtmlHelper {	
	
	static createNamespace(namespace,context){
		var namespaces = namespace.split(".");
		var currentContext = context;
		for(var i = 0; i < namespaces.length; i++) {		
			currentContext[namespaces[i]] = {};
			currentContext = currentContext[namespaces[i]];
		}
	}
	
	static doFetch(callObj){	
		fetch(callObj.url, {
		    	method: callObj.method,
		    	body: callObj.body,
				headers: callObj.headers
			}).then(response => {
				if(response.status==200){
					if(callObj.onSuccess){
						callObj.onSuccess(response,callObj)
					}
				} else {
					if(callObj.onError){
						callObj.onError(response,callObj)
					}
				}
		});
	}
	
	static getFunctionByName(functionName, context) {
		  var args = Array.prototype.slice.call(arguments, 2);
		  var namespaces = functionName.split(".");
		  var func = namespaces.pop();
		  for(var i = 0; i < namespaces.length; i++) {
		    context = context[namespaces[i]];
		  }
		  return context[func];
	}
	
	static addInput(parentObj,elementProps){
		var element = document.createElement(elementProps.elementTagName);
		parentObj.appendChild(element);
		element.setAttribute("x-source-path",elementProps.sourcePath);
		element.setAttribute("x-target-path",elementProps.targetPath);
		if(elementProps.value)
		element.value = elementProps.value;
		element.type = elementProps.type;
		if(elementProps.disabled){
			element.disabled = true;
		}
		if(elementProps.size){
			element.size = elementProps.size;
		}
		if(elementProps.changeEvent){
			element.addEventListener("change",HtmlHelper.getFunctionByName(elementProps.changeEvent,window));
		}
		return element;		
	}
	
	static addButton(parentObj,elementProps){
		var element = document.createElement("BUTTON");
		parentObj.appendChild(element);
		element.setAttribute("x-source-path",elementProps.sourcePath);
		element.setAttribute("x-target-path",elementProps.targetPath);
		elementProps.value
		element.value = elementProps.value;
		element.textContent = elementProps.displayValue;
		element.addEventListener("click",HtmlHelper.getFunctionByName(elementProps.clickEvent,window));
		return element;		
	}
	
	static addSelect(parentObj,elementProps){
		var element = document.createElement("SELECT");
		parentObj.appendChild(element);
		element.setAttribute("x-source-path",elementProps.sourcePath);
		element.setAttribute("x-target-path",elementProps.targetPath);
		for(var optionProps of elementProps.optionProperties){
			HtmlHelper.addOption(element,optionProps);
		}
		return element;		
	}
	
	
	static addOption(parentObj,elementProps){
		var element = document.createElement("OPTION");
		parentObj.appendChild(element);
		element.value=elementProps.value;
		element.textContent = elementProps.displayValue;
		element.selected = elementProps.selected;
		return element;		
	}
	
	static addTD(parentObj,elementProps){
		parentObj.setAttribute("x-source-path",elementProps.sourcePath);
		parentObj.setAttribute("x-target-path",elementProps.targetPath);
		parentObj.textContent=elementProps.value
		return parentObj;
	}
	
	static addEditableTable(parentObj,columnInfoList,rowDataArr,id){
		var table = document.createElement("TABLE");
		table.setAttribute("x-element-id",id);
		parentObj.appendChild(table);
		var tr = document.createElement("TR");
		table.appendChild(tr);
		for(var columnInfo of columnInfoList){
			var td = document.createElement("TH");
			if(columnInfo.headerName) {
				td.textContent=columnInfo.headerName;
			} else {
				td.textContent=columnInfo.attributeName;
			}
			tr.appendChild(td);
		}
		if(rowDataArr) {
			for(var rowData of rowDataArr){
				HtmlHelper.addRow(table,columnInfoList,rowData);
			}
		}
		return table;
		
	}
	
	static addRow(table,columnInfoList,rowData){
		var tr = document.createElement("TR");
		table.appendChild(tr);
		for(var columnInfo of columnInfoList){
			var td = document.createElement("TD");
			if(columnInfo.elementTagName=='INPUT'){
				columnInfo.value = rowData[columnInfo.attributeName];
				var input = HtmlHelper.addInput(td,columnInfo);
			} else if (columnInfo.elementTagName=='BUTTON'){
				var button = HtmlHelper.addButton(td,columnInfo);
			} else if (columnInfo.elementTagName=='TD'){
				columnInfo.value = rowData[columnInfo.attributeName];
				var checkbox = HtmlHelper.addTD(td,columnInfo)
			}else if (columnInfo.elementTagName=='SELECT'){
				var select = HtmlHelper.addSelect(td,columnInfo);
			}else {
				
			}				
			tr.appendChild(td);
		}
	}
	
	static deleteRow(){
		var target = event.target;
		var tr = target.parentNode.parentNode;
		var table = tr.parentNode;
		table.removeChild(tr);
	}
	
	static getTableData(table,outputNS) {
		var trs = table.getElementsByTagName("TR");
		var dataArr = [];
		for(var tr of trs){
			var data = JSONOutputBind.getDataForElement(tr,outputNS);			
			if(data && Object.keys(data).length != 0){
				dataArr.push(data);
			}
		}
		return dataArr;
	}
	
	static getMultiRowData(parent,rowSelector,outputNS) {
		var trs = parent.querySelectorAll(rowSelector);
		var dataArr = [];
		for(var tr of trs){
			var data = JSONOutputBind.getDataForElement(tr,outputNS);			
			if(data && Object.keys(data).length != 0){
				dataArr.push(data);
			}
		}
		return dataArr;
	}
	
	static getUUID(){		
		return Math.random().toString(36).substring(2, 15) +
	        Math.random().toString(36).substring(2, 15);
	}
	
	static showToast(message,meta){
		var target;
		var displayduration;
		var classname;
		if(meta){
			if(meta.target)
				target = meta.target;
			if(meta.displayduration)
				displayduration = meta.displayduration;
			if(meta.classname)
				classname = meta.classname;
		}
		var toastdiv;
		if(target){
			toastdiv = target;
		} else {
			toastdiv = document.querySelector("div[x-element-id='toastarea']");
		}
		var toast = document.createElement("DIV");
		if(classname) {
			toast.className = classname;
		} else {
			toast.className = 'errortoast';
		}
		toast.textContent = message;
		toastdiv.appendChild(toast);
		var duration = 1000;
		if(displayduration){
			duration = displayduration;
		}
		setTimeout(function(){ 
			toastdiv.removeChild(toast);
		}, duration);
	}
	
	static showPopup(evt,callback,addnlInfo){
		var targetArea = document.body;
		if(addnlInfo && addnlInfo.targetArea) {
			targetArea = addnlInfo.targetArea;
		}
		var p1 = document.createElement("DIV");
		p1.className = 'popupdiv';
		p1.id = 'popupdiv';	
		var p2 = document.createElement("DIV");
		p2.className = 'popupoverlay';
		var p3 = document.createElement("DIV");
		p3.className = 'poupupcontent';
		var clsBtn = document.createElement("BUTTON");
		clsBtn.textContent = "X";
		clsBtn.addEventListener("click",HtmlHelper.closePopup);
		p3.appendChild(clsBtn);
		p1.appendChild(p2);
		p1.appendChild(p3);
		targetArea.appendChild(p1);
		var popupContent = callback(addnlInfo);
		p3.appendChild(popupContent);
	}

	static closePopup(){
		var popup = document.getElementById("popupdiv"); 
		popup.parentNode.removeChild(popup);
	}
	
}