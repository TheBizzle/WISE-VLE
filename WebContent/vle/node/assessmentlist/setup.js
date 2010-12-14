var coreScripts = [
	'vle/node/assessmentlist/AssessmentListNode.js',
	'vle/node/assessmentlist/assessmentListEvents.js'
];

var studentVLEScripts = [
	'vle/jquery/js/jquery-1.4.2.min.js',
	'vle/node/assessmentlist/assessmentlist.js',
	'vle/node/assessmentlist/assessmentliststate.js'
];

var authorScripts = [
	'vle/node/assessmentlist/authorview_assessmentlist.js'
];

var gradingScripts = [
	'vle/node/assessmentlist/assessmentliststate.js'
];

var dependencies = [
	{child:"vle/node/assessmentlist/AssessmentListNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/assessmentlist/assessmentlist.css"
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('assessmentlist', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('assessmentlist', css);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/assessmentlist/setup.js');
};