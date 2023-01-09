class JSONInputBind {
	
	static setDataForElement(data,htmlElement,inputNS){
		var children = htmlElement.children;
		for(var child of children){			
			var targetPath = child.getAttribute('x-source-path');
			if(targetPath && targetPath.startsWith(inputNS+":")){				
				this.setFieldValue(data,targetPath.split(':')[1],child);
			}
			this.setDataForElement(data,child,inputNS);
		}	
	}
	
	static setFieldValue(data,path,targetObj){
		if(targetObj.tagName=='INPUT'||targetObj.tagName=='SELECT'||targetObj.tagName=='TEXTAREA'){
			targetObj.value = this.getJsonValue(data,path);
		}
		if(targetObj.tagName=='LABEL' || targetObj.tagName=='BUTTON'){
			targetObj.textContent = this.getJsonValue(data,path);
		}	
	}
	
	static getJsonValue(data,path){
		if(data){
			if(path.includes(".")){
				var subpath = path.substr(0,path.indexOf('.'));
				var remainingPath = path.substr(path.indexOf('.')+1,path.length);
				if(subpath.includes("]")){
					var name = path.substr(0,path.indexOf('['));
					var pos = path.substr(path.indexOf('[')+1,path.indexOf(']')-path.indexOf('[')-1);
					return this.getJsonValue(data[name][pos],remainingPath);
				} else {
					return this.getJsonValue(data[subpath],remainingPath);
				}
			} else {
				if(path.includes("]")){
					var name = path.substr(0,path.indexOf('['));
					var pos = path.substr(path.indexOf('[')+1,path.indexOf(']')-path.indexOf('[')-1);
					return data[name][pos];
				} else {
					return data[path];
				}
				
			}
		} else {
			return "";
		}
	}

	
}