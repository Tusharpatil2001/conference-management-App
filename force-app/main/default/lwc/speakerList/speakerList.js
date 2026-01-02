import { LightningElement, api, track } from 'lwc';

const actions = [{ label: 'Book Session', name: 'book' }];

export default class SpeakerList extends LightningElement {
    @api speakers;

    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Speciality', fieldName: 'Speciality__c' },
        { type: 'action', typeAttributes: { rowActions: actions } }
    ];

    handleRowAction(event) {
        if (event.detail.action.name === 'book') {
            this.dispatchEvent(new CustomEvent('selectspeaker', { detail: event.detail.row }));
        }
    }
}
