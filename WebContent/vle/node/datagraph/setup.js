var coreScripts = [
	'vle/node/datagraph/DataGraphNode.js',
	'vle/node/datagraph/dataGraphEvents.js'
];

var studentVLEScripts = [
	'vle/common/helperfunctions.js',
	'vle/jquery/js/jquery-1.4.2.min.js',
	'vle/jquery/js/jquery-ui-1.8.custom.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/jquery/flot/jquery.flot.min.js',
	'vle/node/datagraph/datagraph.js',
	'vle/node/datagraph/datagraphstate.js'
];

var authorScripts = [
	'vle/node/datagraph/authorview_datagraph.js'
];

var gradingScripts = [
	'vle/node/datagraph/datagraphstate.js'
];

var dependencies = [
	{child:"vle/node/datagraph/DataGraphNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/datagraph/datagraph.css"
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('datagraph', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('datagraph', css);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/datagraph/setup.js');
};