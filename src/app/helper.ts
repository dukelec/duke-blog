
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'join'})
export class JoinPipe implements PipeTransform {
  transform(arr: Array<any>, args: Array<any>): string {
    return arr.join(args[0]);
  }
}

@Pipe({name: 'str2date'})
export class JoinStr2Date implements PipeTransform {
  transform(str: string, args: Array<any>): string {
    if (str === undefined)
      return;
    return new Date(str).toString();
  }
}

import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}


export function escapeHtml(unsafe: any) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


export function attributes2Array(attrs_str: any) {
   let attrs: any = [];
   attrs.permissions = [];
   attrs.languages = [];
   attrs.categories = [];
   attrs.tags = [];

   let attrs_array = attrs_str.split(",");
   for (let i in attrs_array) {
     switch (attrs_array[i].charAt(0)) {
     case 'P':
       attrs.permissions.push(attrs_array[i].substr(2));
       break;
     case 'L':
       attrs.languages.push(attrs_array[i].substr(2));
       break;
     case 'C':
       attrs.categories.push(attrs_array[i].substr(2));
       break;
     case 'T':
       attrs.tags.push(attrs_array[i].substr(2));
       break;
     }
   }
   return attrs;
}
