import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class FormService {

	public whiteSpaceControl(value) {
		let filteredValue = JSON.stringify(value).replace(/\s+/g, ' ').replace(/\s\"/g, '"').replace(/\"\s/g, '"');
		return JSON.parse(filteredValue);
	}

	public AlphaNumericSpace(control: FormControl): { [key: string]: boolean } | null {
		if(!control.value) return null;

		if (control.value.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/)) {
      return null;
    } else {
      return { 'AlphaNumericSpaceErr': true };
    }
	}

}