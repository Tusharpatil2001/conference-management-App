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
