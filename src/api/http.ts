export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export interface HttpResponse<T> extends ProgressEvent<XMLHttpRequest> {
  json(): Promise<T>;
}

export class Http {
  static Request<T>(method: HttpMethod, url: string, data?: any, headers?: any) {
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      if (method === 'GET' || method === 'HEAD' || method === 'DELETE') {
        xhr.open(method, url + Http.ToParams(data), true);
        if (headers) Object.entries<string>(headers).forEach(header => xhr.setRequestHeader(header[0], header[1]));
        xhr.send();
      } else {
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        if (headers) Object.entries<string>(headers).forEach(header => xhr.setRequestHeader(header[0], header[1]));
        xhr.send(JSON.stringify(data));
      }

      xhr.onload = function(event) {
        const newEvent: HttpResponse<T> = event as HttpResponse<T>; // Recast to add json method
        newEvent.json = Http.Parse.bind<Http, string, any, Promise<T>>(this, xhr.responseText);
        if (xhr.status < 400 || xhr.status > 599) {
          resolve(newEvent);
        } else {
          reject(newEvent);
        }
        return true;
      };
      xhr.onerror = function(event) {
        reject(event);
        return true;
      };
    });
  }

  static Get<T>(url: string, params?: any, headers?: any) {
    return Http.Request<T>('GET', url, params, headers);
  }

  static Head<T>(url: string, params?: any, headers?: any) {
    return Http.Request<T>('HEAD', url, params, headers);
  }

  static Delete<T>(url: string, params?: any, headers?: any) {
    return Http.Request<T>('DELETE', url, params, headers);
  }

  static Post<T>(url: string, body?: any, headers?: any) {
    return Http.Request<T>('POST', url, body, headers);
  }

  static Put<T>(url: string, body?: any, headers?: any) {
    return Http.Request<T>('PUT', url, body, headers);
  }

  static Connect<T>(url: string, body?: any, headers?: any) {
    return Http.Request<T>('CONNECT', url, body, headers);
  }

  static Options<T>(url: string, body?: any, headers?: any) {
    return Http.Request<T>('OPTIONS', url, body, headers);
  }

  static Trace<T>(url: string, body?: any, headers?: any) {
    return Http.Request<T>('TRACE', url, body, headers);
  }

  static Patch<T>(url: string, body?: any, headers?: any) {
    return Http.Request<T>('PATCH', url, body, headers);
  }

  static ToParams(params: { [param: string]: any }) {
    if (!params) return '';
    return Object.entries(params)
      .filter(([_, value]) => {
        return value !== undefined && value !== null;
      })
      .reduce((prev, [key, value], index) => `${prev}${!!index ? '&' : ''}${key}=${value}`, '?');
  }

  static Parse<T>(json: string) {
    return new Promise<T>((resolve, reject) => {
      try {
        resolve(JSON.parse(json));
      } catch (e) {
        reject(json);
      }
    });
  }
}
