// import { LightningElement, track } from 'lwc';
// import searchSpeakers from '@salesforce/apex/SpeakerBookingController.searchSpeakers';
// import getSessionByDate from '@salesforce/apex/SpeakerBookingController.getSessionByDate';
//import getAvailableSessionsByDate from '@salesforce/apex/SpeakerBookingController.getAvailableSessionsByDate';
// import createSpeakerAssignment from '@salesforce/apex/SpeakerBookingController.createSpeakerAssignment';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class SpeakerBooking extends LightningElement {

//     searchName = '';
//     searchSpeciality = '';
//     speakers = [];
//     selectedSpeaker;
//     selectedDate;
//     selectedSessionId;
//     disableCreate = true;
//     showRightSection = false;
    //sessions = [];
    //showSessionsTable = false;

//    sessionColumns = [
//     { label: 'Session Name', fieldName: 'Name' },
//     { label: 'Start Time', fieldName: 'Start_time__c' },
//     { label: 'End Time', fieldName: 'End_time__c' },
//     {label : 'Level', fieldName: 'Level__c'},
//     {
//         type: 'button',
//         typeAttributes: {
//             label: 'Create Assignment',
//             name: 'create',
//             variant: 'brand'
//         }
//     }
// ];




//     today = new Date().toISOString().split('T')[0];

//     leftColumns = [
//         { label: 'Name', fieldName: 'Name' },
//         { label: 'Email', fieldName: 'Email__c' },
//         { label: 'Speciality', fieldName: 'Speciality__c' },
//         {
//             type: 'button',
//             typeAttributes: {
//                 label: 'Book Session',
//                 name: 'book',
//                 variant: 'brand'
//             }
//         }
//     ];

//     rightColumns = [
//         { label: 'Name', fieldName: 'Name' },
//         { label: 'Email', fieldName: 'Email__c' },
//         { label: 'Speciality', fieldName: 'Speciality__c' },
//         { label: 'Bio', fieldName: 'Bio__c' }
//     ];

//     get selectedSpeakerData() {
//         return this.selectedSpeaker ? [this.selectedSpeaker] : [];
//     }

//     handleNameChange(event) {
//         this.searchName = event.target.value;
//     }

//     handleSpecChange(event) {
//         this.searchSpeciality = event.target.value;
//     }

//     handleSearch() {
//         searchSpeakers({
//             nameKey: this.searchName,
//             specialityKey: this.searchSpeciality
//         }).then(result => {
//             this.speakers = result;
//         });
//     }

//     handleLeftAction(event) {
//     if (event.detail.action.name === 'book') {
//         this.selectedSpeaker = event.detail.row;
//         this.showRightSection = true;   // 🔥 SHOW RIGHT SECTION
//         this.disableCreate = true;
//         this.selectedSessionId = null;
//     }
// }



//     handleDateChange(event) {
//     this.selectedDate = event.target.value;
//     this.disableCreate = true;
//     this.selectedSessionId = null;

//     getSessionByDate({
//         selectedDate: this.selectedDate,
//         speakerId: this.selectedSpeaker.Id
//     })
//     .then(session => {
//         this.selectedSessionId = session.Id;
//         this.disableCreate = false; // Enable button
//     })
//     .catch(error => {
//         this.showToast(
//             'No Available Session',
//             error.body.message,
//             'warning'
//         );
//         this.disableCreate = true; // Disable button
//     });
// }


    // getAvailableSessionsByDate({ selectedDate })
    //     .then(result => {
    //         this.sessions = result.map(s => ({
    //             Id: s.Id,
    //             Name: s.Name,
    //             StartTime: s.Start_time__c
    //                 ? s.Start_time__c.substring(0, 5)
    //                 : '',
    //             EndTime: s.End_time__c
    //                 ? s.End_time__c.substring(0, 5)
    //                 : '',
    //             Level: s.Level__c
    //         }));

    //         this.showSessionsTable = this.sessions.length > 0;
    //     });
//}



//     handleSessionAction(event) {
//     const sessionId = event.detail.row.Id;

//     createSpeakerAssignment({
//         speakerId: this.selectedSpeaker.Id,
//         sessionId
//     })
//     .then(() => {
//         this.showToast(
//             'Success',
//             'Speaker assigned successfully',
//             'success'
//         );

//         // Refresh session list
//         this.sessions = this.sessions.filter(s => s.Id !== sessionId);
//     })
//     .catch(error => {
//         this.showToast('Error', error.body.message, 'error');
//     });
// }



//     handleCreate() {
//     createSpeakerAssignment({
//         speakerId: this.selectedSpeaker.Id,
//         sessionId: this.selectedSessionId
//     })
//     .then(() => {
//         this.showToast(
//             'Success',
//             'Speaker Assignment created successfully',
//             'success'
//         );
//         this.disableCreate = true;
//         this.selectedSessionId = null;
//     })
//     // ❌ Do not catch Apex availability errors here
// }





//     showToast(title, message, variant) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title,
//                 message,
//                 variant
//             })
//         );
//     }

//     connectedCallback() {
//     this.loadAllSpeakers();
// }

// loadAllSpeakers() {
//     searchSpeakers({
//         nameKey: '',
//         specialityKey: ''
//     })
//     .then(result => {
//         this.speakers = result;
//     })
//     .catch(error => {
//         console.error(error);
//     });
// }

// get leftSectionClass() {
//     return this.showRightSection
//         ? 'slds-col slds-size_1-of-2 slds-p-around_medium'
//         : 'slds-col slds-size_1-of-1 slds-p-around_medium';
// }


// }

//working code is above
// import { LightningElement, track } from 'lwc';
// import searchSpeakers from '@salesforce/apex/SpeakerBookingController.searchSpeakers';
// import getAvailableSessionByDate from '@salesforce/apex/SpeakerBookingController.getAvailableSessionByDate';
// import createSpeakerAssignment from '@salesforce/apex/SpeakerBookingController.createSpeakerAssignment';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class SpeakerBooking extends LightningElement {

//     @track speakers = [];
//     @track selectedSpeaker;
//     @track selectedSession;
//     @track showRightSection = false;
//     @track disableCreate = true;

//     nameKey = '';
//     specialityKey = '';
//     today = new Date().toISOString().split('T')[0];

//     /* =========== COLUMNS =========== */
//     leftColumns = [
//         { label: 'Name', fieldName: 'Name' },
//         { label: 'Email', fieldName: 'Email__c' },
//         { label: 'Speciality', fieldName: 'Speciality__c' },
//         {
//             type: 'button',
//             typeAttributes: { label: 'Book Session', name: 'book', variant: 'brand' }
//         }
//     ];

//     rightColumns = [
//         { label: 'Name', fieldName: 'Name' },
//         { label: 'Email', fieldName: 'Email__c' },
//         { label: 'Bio', fieldName: 'Bio__c' },
//         { label: 'Speciality', fieldName: 'Speciality__c' }
//     ];

//     /* =========== GETTERS =========== */
//     get leftSectionClass() {
//         return this.showRightSection ? 'slds-col slds-size_1-of-2 slds-p-around_medium' : 'slds-col slds-size_1-of-1 slds-p-around_medium';
//     }

//     get searchInputClass() {
//         return this.showRightSection ? 'slds-col slds-size_1-of-1' : 'slds-col slds-size_1-of-2';
//     }

//     get selectedSpeakerData() {
//         return this.selectedSpeaker ? [this.selectedSpeaker] : [];
//     }

//     /* =========== LIFECYCLE =========== */
//     connectedCallback() {
//         this.loadSpeakers();
//     }

//     /* =========== EVENTS =========== */
//     handleNameChange(event) { this.nameKey = event.target.value; }
//     handleSpecChange(event) { this.specialityKey = event.target.value; }

//     handleSearch() { this.loadSpeakers(); }

//     loadSpeakers() {
//         searchSpeakers({ nameKey: this.nameKey, specialityKey: this.specialityKey })
//         .then(result => { this.speakers = result; })
//         .catch(error => { this.showToast('Error', error.body.message, 'error'); });
//     }

//     handleRowAction(event) {
//         if (event.detail.action.name === 'book') {
//             this.selectedSpeaker = event.detail.row;
//             this.showRightSection = true;
//             this.disableCreate = true;
//             this.selectedSession = null;
//         }
//     }

//     handleDateChange(event) {
//         const selectedDate = event.target.value;

//         getAvailableSessionByDate({ selectedDate: selectedDate, speakerId: this.selectedSpeaker.Id })
//         .then(session => {
//             this.selectedSession = session;
//             this.disableCreate = false;
//         })
//         .catch(error => {
//             this.selectedSession = null;
//             this.disableCreate = true;
//             this.showToast('Not Available', error.body.message, 'error');
//         });
//     }

//     handleCreate() {
//         if (!this.selectedSpeaker || !this.selectedSession) return;

//         createSpeakerAssignment({ speakerId: this.selectedSpeaker.Id, sessionId: this.selectedSession.Id })
//         .then(() => {
//             this.showToast('Success', 'Speaker Assignment created successfully', 'success');
//             this.disableCreate = true;
//             this.selectedSpeaker = null;
//             this.showRightSection = false;
//             this.loadSpeakers(); // reload list
//         })
//         .catch(error => { this.showToast('Error', error.body.message, 'error'); });
//     }

//     /* =========== TOAST =========== */
//     showToast(title, message, variant) {
//         this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
//     }
// }




import { LightningElement, track } from 'lwc';
import searchSpeakers from '@salesforce/apex/SpeakerBookingController.searchSpeakers';
import getSessionByDate from '@salesforce/apex/SpeakerBookingController.getSessionByDate';
import createSpeakerAssignment from '@salesforce/apex/SpeakerBookingController.createSpeakerAssignment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SpeakerBooking extends LightningElement {

    searchName = '';
    searchSpeciality = '';
    speakers = [];
    selectedSpeaker;
    selectedSessionId;
    disableCreate = true;
    showRightSection = false;

    today = new Date().toISOString().split('T')[0];

    leftColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Speciality', fieldName: 'Speciality__c' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Book Session',
                name: 'book',
                variant: 'brand'
            }
        }
    ];

    rightColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Speciality', fieldName: 'Speciality__c' },
        { label: 'Bio', fieldName: 'Bio__c' }
    ];

    get selectedSpeakerData() {
        return this.selectedSpeaker ? [this.selectedSpeaker] : [];
    }

    handleNameChange(event) {
        this.searchName = event.target.value;
    }

    handleSpecChange(event) {
        this.searchSpeciality = event.target.value;
    }

    handleSearch() {
        searchSpeakers({
            nameKey: this.searchName,
            specialityKey: this.searchSpeciality
        }).then(result => {
            this.speakers = result;
        });
    }

    handleLeftAction(event) {
        if (event.detail.action.name === 'book') {
            this.selectedSpeaker = event.detail.row;
            this.showRightSection = true;   // show right section
            this.disableCreate = true;
            this.selectedSessionId = null;
        }
    }

    handleDateChange(event) {
        const selectedDate = event.target.value;
        this.disableCreate = true;
        this.selectedSessionId = null;

        getSessionByDate({
            selectedDate,
            speakerId: this.selectedSpeaker.Id
        })
        .then(session => {
            this.selectedSessionId = session.Id;
            this.disableCreate = false; // enable button
        })
        .catch(error => {
            this.showToast(
                'Session Unavailable',
                error.body.message,
                'warning'
            );
            this.disableCreate = true; // disable button
        });
    }

    handleCreate() {
        createSpeakerAssignment({
            speakerId: this.selectedSpeaker.Id,
            sessionId: this.selectedSessionId
        })
        .then(() => {
            this.showToast(
                'Success',
                'Speaker Assignment created successfully',
                'success'
            );
            this.disableCreate = true;
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }

    connectedCallback() {
        this.loadAllSpeakers();
    }

    loadAllSpeakers() {
        searchSpeakers({
            nameKey: '',
            specialityKey: ''
        })
        .then(result => {
            this.speakers = result;
        })
        .catch(error => console.error(error));
    }

    get leftSectionClass() {
        return this.showRightSection
            ? 'slds-col slds-size_1-of-2 slds-p-around_medium'
            : 'slds-col slds-size_1-of-1 slds-p-around_medium';
    }
}
