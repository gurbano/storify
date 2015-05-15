exports = module.exports = new Global();


function Global(){
	var self = this;	
	self.repo = {};
	self.test = function(){console.info('-------------------------><-------------------');}
	self.put = function(name,object){
		self.repo[name] = object;
	}
	self.get = function(name){
		return self.repo[name];
	}
}