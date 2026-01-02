public class SpeakerAssignmentHandler {

    public static void checkSpeakerAvailability(
        List<Speaker_Assignment__c> newAssignments
    ) {
        // Collect Speaker & Session Ids
        Set<Id> speakerIds = new Set<Id>();
        Set<Id> sessionIds = new Set<Id>();

        for (Speaker_Assignment__c sa : newAssignments) {
            if (sa.Speaker__c != null && sa.Session__c != null) {
                speakerIds.add(sa.Speaker__c);
                sessionIds.add(sa.Session__c);
            }
        }

        if (speakerIds.isEmpty()) return;

        // Fetch Session details for NEW assignments
        Map<Id, Session__c> sessionMap = new Map<Id, Session__c>(
            [
                SELECT Id, Session_Date__c, Start_Time__c, End_Time__c
                FROM Session__c
                WHERE Id IN :sessionIds
            ]
        );

        // Fetch EXISTING assignments for those speakers
        List<Speaker_Assignment__c> existingAssignments = [
            SELECT Id, Speaker__c, Session__r.Session_Date__c,
                   Session__r.Start_Time__c, Session__r.End_Time__c
            FROM Speaker_Assignment__c
            WHERE Speaker__c IN :speakerIds
            AND Id NOT IN :newAssignments
        ];

        // Compare new vs existing assignments
        for (Speaker_Assignment__c newSA : newAssignments) {
            Session__c newSession = sessionMap.get(newSA.Session__c);
            if (newSession == null) continue;

            for (Speaker_Assignment__c existingSA : existingAssignments) {

               if (
                    newSA.Speaker__c == existingSA.Speaker__c &&
                    newSA.Id != existingSA.Id &&
                    newSession.Session_Date__c ==
                        existingSA.Session__r.Session_Date__c &&
                    newSession.Start_Time__c <
                        existingSA.Session__r.End_Time__c &&
                    newSession.End_Time__c >
                        existingSA.Session__r.Start_Time__c
                ) {
                    newSA.addError(
                        'Speaker is already booked for this time.'
                    );
                    break;
                }
            }
        }
    }
}