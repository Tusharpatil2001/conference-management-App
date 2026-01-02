import { LightningElement, api, track, wire } from 'lwc';
import getAvailableSessions from '@salesforce/apex/SpeakerController.getAvailableSessions';
import createAssignment from '@salesforce/apex/SpeakerController.createAssignment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BookSession extends LightningElement {
    @api speaker;
    @track sessionOptions = [];
    selectedSessionId;
    disableButton = true;

    @wire(getAvailableSessions, { speakerId: '$speaker.Id' })
    wiredSessions({ data, error }) {
        if (data) {
            this.sessionOptions = data.map(session => ({
                label: `${session.Name} (${session.Session_Date__c})`,
                value: session.Id
            }));
        } else if (error) {
            console.error(error);
        }
    }

    handleSessionChange(event) {
        this.selectedSessionId = event.detail.value;
        this.disableButton = !this.selectedSessionId;
    }

    handleCreateAssignment() {
        createAssignment({ speakerId: this.speaker.Id, sessionId: this.selectedSessionId })
            .then(() => {
                this.showToast('Success', 'Speaker assigned successfully!', 'success');
                this.selectedSessionId = null;
                this.disableButton = true;
                return getAvailableSessions({ speakerId: this.speaker.Id });
            })
            .then(data => { this.sessionOptions = data.map(s => ({ label: `${s.Name} (${s.Session_Date__c})`, value: s.Id })); })
            .catch(error => this.showToast('Error', error.body.message, 'error'));
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
