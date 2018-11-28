import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'html'
})
export class HTMLPipe implements PipeTransform {

	transform(value: string) {
		let parser = new DOMParser();
		let parsedHtml = parser.parseFromString(value, 'text/html');
		return parsedHtml;
	}

}