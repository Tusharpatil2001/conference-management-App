import { LightningElement, track } from 'lwc';
import searchSpeakers from '@salesforce/apex/SpeakerController.searchSpeakers';

export default class SpeakerSearch extends LightningElement {
    @track speakers = [];
    name = '';
    speciality = '';

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleSpecialityChange(event) {
        this.speciality = event.target.value;
    }

    handleSearch() {
        searchSpeakers({ name: this.name, speciality: this.speciality })
            .then(result => {
                this.speakers = result;
            })
            .catch(error => console.error(error));
    }

    handleSpeakerSelect(event) {
        this.dispatchEvent(
            new CustomEvent('selectspeaker', { detail: event.detail })
        );
    }
}
