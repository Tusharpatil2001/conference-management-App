@IsTest
public class SpeakerAssignmentHandlerTest {

    @testSetup
    static void setupData() {

        // Speaker (ALL REQUIRED FIELDS)
        Speaker__c speaker = new Speaker__c(
            Name__c = 'Test Speaker',
            Email__c = 'test.speaker@example.com',
            Speciality__c = 'Apex'
        );
        insert speaker;

        // Sessions
        Session__c session1 = new Session__c(
            Name = 'Session 1',
            Title__c = 'Session2',
            Session_Date__c = Date.today(),
            Start_Time__c = Time.newInstance(10, 0, 0, 0),
            End_Time__c   = Time.newInstance(11, 0, 0, 0)
        );

        Session__c session2 = new Session__c(
            Name = 'Session 2',
            Title__c = 'Session2',
            Session_Date__c = Date.today(),
            Start_Time__c = Time.newInstance(10, 30, 0, 0),
            End_Time__c   = Time.newInstance(11, 30, 0, 0)
        );

        insert new List<Session__c>{ session1, session2 };

        // Existing Assignment
        Speaker_Assignment__c sa1 = new Speaker_Assignment__c(
            Speaker__c = speaker.Id,
            Session__c = session1.Id
        );
        insert sa1;
    }

    @IsTest
    static void testSpeakerConflict() {

        Speaker__c speaker = [SELECT Id FROM Speaker__c LIMIT 1];
        Session__c session2 = [
            SELECT Id FROM Session__c WHERE Name = 'Session 2' LIMIT 1
        ];

        Speaker_Assignment__c sa2 = new Speaker_Assignment__c(
            Speaker__c = speaker.Id,
            Session__c = session2.Id
        );

        Test.startTest();
        try {
            insert sa2;
            System.assert(false, 'Expected booking conflict');
        } catch (DmlException e) {
            System.assert(
                e.getMessage().contains('already booked'),
                'Correct conflict error expected'
            );
        }
        Test.stopTest();
    }
    @IsTest
    static void testNoConflictDifferentSpeaker() {

        //New Speaker
        Speaker__c speaker2 = new Speaker__c(
            Name__c = 'Second Speaker',
            Email__c = 'secondspeaker@gmail.com',
            Speciality__c = 'LWC'
        );
        insert speaker2;

        Session__c session2 = [
            SELECT Id FROM Session__c WHERE Name = 'Session 2' LIMIT 1
        ];

        Speaker_Assignment__c sa = new Speaker_Assignment__c(
            Speaker__c = speaker2.Id,
            Session__c = session2.Id
        );

        Test.startTest();
        insert sa; // SHOULD PASS
        Test.stopTest();

        System.assertNotEquals(null, sa.Id);
    }
}