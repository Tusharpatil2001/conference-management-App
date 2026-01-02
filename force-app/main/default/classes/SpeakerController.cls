public with sharing class SpeakerController {

    // Search speakers
    @AuraEnabled(cacheable=true)
    public static List<Speaker__c> searchSpeakers(String name, String speciality) {
        String nameFilter = '%' + (name != null ? name : '') + '%';
        String specialityFilter = '%' + (speciality != null ? speciality : '') + '%';

        return [
            SELECT Id, Name, Email__c, Speciality__c, Bio__c
            FROM Speaker__c
            WHERE Name LIKE :nameFilter
            AND Speciality__c LIKE :specialityFilter
            ORDER BY Name
        ];
    }

    // Fetch future sessions not assigned to this speaker
    @AuraEnabled(cacheable=true)
    public static List<Session__c> getAvailableSessions(Id speakerId) {
        return [
            SELECT Id, Name, Session_Date__c
            FROM Session__c
            WHERE Session_Date__c >= TODAY
            AND Id NOT IN (
                SELECT Session__c
                FROM Speaker_Assignment__c
                WHERE Speaker__c = :speakerId
            )
            ORDER BY Session_Date__c
        ];
    }

    // Check if speaker is already assigned to a session
    @AuraEnabled
    public static Boolean checkAvailability(Id speakerId, Id sessionId) {
        Integer countAssignments = [
            SELECT COUNT()
            FROM Speaker_Assignment__c
            WHERE Speaker__c = :speakerId
            AND Session__c = :sessionId
        ];
        return countAssignments == 0;
    }

    // Create Speaker Assignment
    @AuraEnabled
    public static Speaker_Assignment__c createAssignment(Id speakerId, Id sessionId) {
        Speaker_Assignment__c assignment = new Speaker_Assignment__c(
            Speaker__c = speakerId,
            Session__c = sessionId
        );
        insert assignment;
        return assignment;
    }
}