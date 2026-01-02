trigger SpeakerAssignmentTrigger on Speaker_Assignment__c (
    before insert, before update
) {
    if (Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)) {
        SpeakerAssignmentHandler.checkSpeakerAvailability(Trigger.new);
    }
}