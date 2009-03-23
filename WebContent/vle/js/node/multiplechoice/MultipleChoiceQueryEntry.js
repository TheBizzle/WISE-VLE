/**
 * MultipleChoiceQueryEntry
 * 
 * An object that contains student work for a multiple choice node
 * for a specific student.
 */

MultipleChoiceQueryEntry.prototype = new QueryEntry();
MultipleChoiceQueryEntry.prototype.constructor = MultipleChoiceQueryEntry;
MultipleChoiceQueryEntry.prototype.parent = QueryEntry.prototype;

/**
 * Constructor
 * @param dataId the dataId for a specific student
 * @param nodeId the nodeId for a specific node
 * @param prompt the prompt for this multiple choice node
 * @param choiceId the choiceId for this query entry
 * @param choiceValue the user displayed value for the query entry
 */
function MultipleChoiceQueryEntry(dataId, nodeId, prompt, choiceId, choiceValue) {
	this.dataId = dataId;
	this.nodeId = nodeId;
	this.prompt = prompt;
	this.choiceId = choiceId;
	this.choiceValue = choiceValue;
}

/**
 * Gets html representation of the student's work
 * @return html that displays the student's work
 */
MultipleChoiceQueryEntry.prototype.printEntry = function() {
	return "[User " + this.dataId + "] answered " + this.choiceValue;
}