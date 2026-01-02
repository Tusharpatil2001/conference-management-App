public with sharing class SpeakerBookingController {

    /* SEARCH SPEAKERS */
    @AuraEnabled(cacheable=true)
    public static List<Speaker__c> searchSpeakers(String nameKey, String specialityKey) {
        String nameFilter = String.isBlank(nameKey) ? '%' : '%' + nameKey + '%';
        String specFilter = String.isBlank(specialityKey) ? '%' : '%' + specialityKey + '%';

        return [
            SELECT Id, Name, Email__c, Speciality__c, Bio__c
            FROM Speaker__c
            WHERE Name LIKE :nameFilter
            AND Speciality__c LIKE :specFilter
            ORDER BY Name
        ];
    }

    /* GET AVAILABLE SESSION BY DATE */
    @AuraEnabled
    public static Session__c getSessionByDate(Date selectedDate, Id speakerId) {

        List<Session__c> sessions = [
            SELECT Id, Name, Session_Date__c
            FROM Session__c
            WHERE Session_Date__c = :selectedDate
        ];

        if (sessions.isEmpty()) {
            throw new AuraHandledException('No session available on this date');
        }

        // check if session is already assigned to any speaker
        List<Speaker_Assignment__c> booked = [
            SELECT Id
            FROM Speaker_Assignment__c
            WHERE Session__r.Session_Date__c = :selectedDate
            LIMIT 1
        ];

        if (!booked.isEmpty()) {
            throw new AuraHandledException('Session is already booked. Try another session or date');
        }

        return sessions[0];
    }

    /* CREATE SPEAKER ASSIGNMENT */
    @AuraEnabled
    public static void createSpeakerAssignment(Id speakerId, Id sessionId) {
        Speaker__c speaker = [SELECT Name FROM Speaker__c WHERE Id = :speakerId LIMIT 1];
        Session__c session = [SELECT Name FROM Session__c WHERE Id = :sessionId LIMIT 1];

        Speaker_Assignment__c assignment = new Speaker_Assignment__c(
            Name = session.Name + ' by ' + speaker.Name,
            Speaker__c = speakerId,
            Session__c = sessionId
        );

        insert assignment;
    }
}