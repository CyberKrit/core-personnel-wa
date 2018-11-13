import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class FormService {

	public safeString(value) {
		if( typeof value === 'string' ) {
			return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
				switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char;
        }
			});
		}
	}

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