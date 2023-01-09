class JSONOutputBind {
	
	static getDataForElement(htmlElement,outputNS,out){
		if(!out){
			out = {};
		}
		
		var children = htmlElement.children;
		for(var child of children){			
			var targetPath = child.getAttribute('x-target-path');
			if(targetPath && targetPath.startsWith(outputNS+":")){				
				this.getJSONObject(out,targetPath.split(':')[1],this.getFieldValue(child));
			}
			this.getDataForElement(child,outputNS,out);
		}	
		//console.log("Final -> " + JSON.stringify(out,2,2));
		return out;
	}
	
	static getFieldValue(targetObj){
		if(targetObj.tagName=='INPUT' || targetObj.tagName=='SELECT' || targetObj.tagName=='BUTTON' || targetObj.tagName=='TEXTAREA'){
			if(targetObj.type=='checkbox'){
				return targetObj.checked;
			}
			return targetObj.value;
		}
		if(targetObj.tagName=='LABEL' || targetObj.tagName=='TD'){
			return targetObj.textContent;
		}	
	}
	
	static getJSONObject(out,path,value){
		var arr = path.split('.');
		for(var i=0;i<arr.length;i++){
			var cPath = arr[i];
			if(i==arr.length-1){
				this.processLastElement(out,cPath,value);
			} else {
				out = this.processElement(out,cPath,value);
			}
		}
	}
	
	static processElement(out,path,value){
		if(path.includes('[')){
			return this.processArrayElement(out,path,value);
		} else {
			if(out[path]){
				return out[path];
			} else {
				out[path] = {};
				return out[path];
			}
		}		
	}
	
	static processArrayElement(out,path,value){
		var name = path.substr(0,path.indexOf('['));
		var pos = path.substr(path.indexOf('[')+1,path.indexOf(']')-path.indexOf('[')-1);
		if(out[name]){
			if(out[name][Number(pos)]){
				return out[name][Number(pos)];
			} else {
				out[name][Number(pos)]={};
				return out[name][Number(pos)];
			}
		} else {
			out[name] = [];
			out[name][Number(pos)]={};
			return out[name][Number(pos)];
		}
	}
	
	static processLastElement(out,path,value){
		if(path.includes('[')){
			this.processLastArrayElement(out,path,value);
		} else {
			out[path] = value;
		}		
	}
	
	static processLastArrayElement(out,path,value){
		var name = path.substr(0,path.indexOf('['));
		var pos = path.substr(path.indexOf('[')+1,path.indexOf(']')-path.indexOf('[')-1);
		if(out[name]){
			out[name][Number(pos)] = value;
		} else {
			out[name] = [];
			out[name][Number(pos)] = value;
		}
			
	}
	
}